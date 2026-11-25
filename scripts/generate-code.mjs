import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';
import { createHighlighter } from 'shiki';
import { pilotDocs } from '../apps/docs/src/component-api.generated.ts';

const root = new URL('../', import.meta.url);
const output = new URL('apps/docs/src/component-code.generated.ts', root);
const examplesPath = 'apps/docs/src/component-pilot-examples.tsx';

// Sentinel colours keep the palette in CSS: the generator only marks token roles,
// and component-site.css maps each role to an existing semantic token, so light /
// dark and the design contract stay single-sourced. `default` is deliberately empty.
const sentinel = {
  default: '__TOK_DEFAULT__',
  comment: '__TOK_COMMENT__',
  keyword: '__TOK_KEYWORD__',
  string: '__TOK_STRING__',
  tag: '__TOK_TAG__',
};
const className = {
  [sentinel.comment]: 'tok-c',
  [sentinel.keyword]: 'tok-k',
  [sentinel.string]: 'tok-s',
  [sentinel.tag]: 'tok-t',
};
const theme = {
  name: 'radish-code',
  type: 'dark',
  settings: [
    { settings: { foreground: sentinel.default } },
    { scope: ['comment'], settings: { foreground: sentinel.comment } },
    { scope: ['string'], settings: { foreground: sentinel.string } },
    { scope: ['entity.name.tag', 'support.class.component'], settings: { foreground: sentinel.tag } },
    { scope: ['keyword.control', 'keyword.declaration', 'keyword.other', 'storage'], settings: { foreground: sentinel.keyword } },
    // Operators and arrow functions stay at body colour; only statement keywords are tinted.
    { scope: ['keyword.operator', 'storage.type.function.arrow'], settings: { foreground: sentinel.default } },
  ],
};

const highlighter = await createHighlighter({ themes: [theme], langs: ['tsx', 'ts'] });

const escapeHtml = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const decodeHtml = html => html.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

function render(code, lang) {
  const { tokens } = highlighter.codeToTokens(code, { lang, theme: theme.name });
  return tokens.map(line => {
    const runs = [];
    for (const token of line) {
      const runClass = className[token.color] ?? '';
      const last = runs[runs.length - 1];
      if (last && last.runClass === runClass) last.text += token.content;
      else runs.push({ runClass, text: token.content });
    }
    return runs.map(run => run.runClass ? `<span class="${run.runClass}">${escapeHtml(run.text)}</span>` : escapeHtml(run.text)).join('');
  }).join('\n');
}

/** 读取示例对象里的字符串字段；缺失或类型不符时直接失败，避免文案与生成物漂移。 */
function readLiteralField(fields, componentId, exampleId, name) {
  const value = fields.get(name);
  if (!value || !(ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) || value.text.trim().length === 0) {
    throw new Error(`${componentId}${exampleId ? `.${exampleId}` : ''} 的 ${name} 必须是非空字符串字面量`);
  }
  return value.text;
}

/**
 * Reads `pilotExamples` from the TSX example module. The previews are JSX, so the file
 * cannot be imported by Node directly; the TypeScript AST is the same source the docs
 * page renders, and the catalog test checks the same literal shape.
 *
 * Each example carries both Chinese and English copy. The English fields are required
 * here so `code:generate --check` fails when a translation is missing, and the test
 * entry point below exposes them for coverage assertions.
 */
function readPilotExampleCatalog() {
  const file = fileURLToPath(new URL(examplesPath, root));
  const source = ts.createSourceFile(examplesPath, readFileSync(file, 'utf8'), ts.ScriptTarget.ES2022, true, ts.ScriptKind.TSX);
  let catalog;
  const findCatalog = node => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'pilotExamples') catalog = node.initializer;
    ts.forEachChild(node, findCatalog);
  };
  ts.forEachChild(source, findCatalog);
  if (!catalog || !ts.isObjectLiteralExpression(catalog)) throw new Error('pilotExamples 必须是对象字面量');

  const components = new Map();
  for (const property of catalog.properties) {
    if (!ts.isPropertyAssignment(property)) throw new Error('示例目录项必须是属性赋值');
    const id = ts.isIdentifier(property.name) || ts.isStringLiteral(property.name) ? property.name.text : undefined;
    if (!id) throw new Error('示例目录键必须可静态读取');
    if (!ts.isArrayLiteralExpression(property.initializer)) throw new Error(`${id} 的示例必须是数组`);
    const examples = new Map();
    for (const element of property.initializer.elements) {
      if (!ts.isObjectLiteralExpression(element)) throw new Error(`${id} 的示例必须是对象字面量`);
      const fields = new Map(element.properties.filter(entry => ts.isPropertyAssignment(entry))
        .map(entry => [entry.name.getText(source).replace(/^'|'$/g, ''), entry.initializer]));
      const exampleId = fields.get('id');
      const code = fields.get('code');
      if (!exampleId || !ts.isStringLiteral(exampleId)) throw new Error(`${id} 的示例缺少可读取 id`);
      if (!code || !(ts.isStringLiteral(code) || ts.isNoSubstitutionTemplateLiteral(code))) throw new Error(`${id}.${exampleId.text} 的代码片段必须是无插值字符串`);
      if (examples.has(exampleId.text)) throw new Error(`${id} 示例 id 重复：${exampleId.text}`);
      examples.set(exampleId.text, {
        code: code.text,
        title: readLiteralField(fields, id, exampleId.text, 'title'),
        titleEn: readLiteralField(fields, id, exampleId.text, 'titleEn'),
        description: readLiteralField(fields, id, exampleId.text, 'description'),
        descriptionEn: readLiteralField(fields, id, exampleId.text, 'descriptionEn'),
      });
    }
    components.set(id, examples);
  }
  return components;
}

/** Code snippets keyed by component id then example id; used by the highlight generator. */
export function readExampleSources() {
  const components = new Map();
  for (const [id, examples] of readPilotExampleCatalog()) {
    components.set(id, new Map([...examples].map(([exampleId, example]) => [exampleId, example.code])));
  }
  return components;
}

/** Chinese / English example copy keyed by component id then example id; used by tests. */
export function readExampleMetadata() {
  return readPilotExampleCatalog();
}

/**
 * Renders the import snippet and every component-page example to HTML. Token text is
 * escaped by the generator; the docs page only injects this generated, repository-owned
 * markup (never user input), so `innerHTML` stays limited to `<span class="tok-*">`.
 */
export function buildHighlightedCode() {
  const examples = readExampleSources();
  const docs = Object.keys(pilotDocs);
  const missing = docs.filter(id => !examples.has(id));
  const extra = [...examples.keys()].filter(id => !pilotDocs[id]);
  if (missing.length) throw new Error(`缺少示例：${missing.join(', ')}`);
  if (extra.length) throw new Error(`示例没有对应的组件契约：${extra.join(', ')}`);

  const snippets = [];
  for (const id of docs) {
    snippets.push({ key: `${id}/import`, lang: 'ts', code: pilotDocs[id].importCode });
    for (const [exampleId, code] of examples.get(id)) snippets.push({ key: `${id}/${exampleId}`, lang: 'tsx', code });
  }

  const seen = new Set();
  const entries = [];
  const roles = new Set();
  for (const { key, lang, code } of snippets) {
    if (seen.has(key)) throw new Error(`示例键重复：${key}`);
    seen.add(key);
    if (code.trim().length === 0) throw new Error(`${key} 的代码片段为空`);
    const html = render(code, lang);
    if (decodeHtml(html) !== code) throw new Error(`${key} 的高亮产物没有保留原始文本`);
    for (const match of html.matchAll(/class="tok-([a-z])"/g)) roles.add(match[1]);
    entries.push([key, html]);
  }
  return { entries, roles };
}

export function buildGeneratedCode() {
  const { entries } = buildHighlightedCode();
  const lines = [
    '// Generated by scripts/generate-code.mjs from component-pilot-examples.tsx and component-api.generated.ts. Do not edit by hand.',
    '',
    'export const highlightedCode: Record<string, string> = {',
    ...entries.map(([key, html]) => `  ${JSON.stringify(key)}: ${JSON.stringify(html)},`),
    '};',
    '',
  ];
  return lines.join('\n');
}

function main() {
  const text = buildGeneratedCode();
  if (process.argv.includes('--check')) {
    let current;
    try { current = readFileSync(output, 'utf8'); }
    catch { throw new Error('component-code.generated.ts 缺失，请执行 npm run code:generate'); }
    if (current !== text) throw new Error('代码高亮产物与示例源码不一致，请执行 npm run code:generate');
    console.log('Highlighted code matches component examples.');
  } else {
    writeFileSync(output, text);
    console.log('Generated apps/docs/src/component-code.generated.ts.');
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
