import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';
import { authoredDocs } from '../apps/docs/src/component-api.ts';
import { apiDescriptionEn } from '../apps/docs/src/component-api-en.ts';
import { authoredBehavior } from '../apps/docs/src/component-behavior.ts';
import { behaviorSources, behaviorTopics } from '../apps/docs/src/component-api-types.ts';

const root = new URL('../', import.meta.url);
const sourceRoot = fileURLToPath(new URL('packages/react/src', root));
const output = new URL('apps/docs/src/component-api.generated.ts', root);
const format = ts.TypeFormatFlags.NoTruncation;

const typeMap = {
  button: ['ButtonProps'],
  'icon-button': ['IconButtonProps'],
  'form-field': ['FormFieldProps'],
  form: ['FormProps'],
  input: ['InputProps'],
  'input-number': ['InputNumberProps'],
  textarea: ['TextareaProps'],
  'input-otp': ['InputOTPProps'],
  select: ['SelectProps'],
  'tag-input': ['TagInputProps'],
  upload: ['UploadProps'],
  'radio-group': ['RadioGroupProps'],
  avatar: ['AvatarProps'],
  tag: ['TagProps'],
  'toggle-group': ['ToggleGroupProps'],
  checkbox: ['CheckboxProps'],
  switch: ['SwitchProps'],
  tabs: [
    { component: 'Tabs', type: 'TabsProps' },
    { component: 'TabsList', type: 'TabsListProps' },
    { component: 'TabsContent', type: 'TabsContentProps' },
  ],
  'status-badge': ['StatusBadgeProps'],
  dialog: ['DialogProps'],
  'confirm-dialog': ['ConfirmDialogProps'],
  accordion: ['AccordionProps'],
  drawer: ['DrawerProps'],
  menu: [
    { component: 'Menu', type: 'MenuProps' },
    { component: 'MenuItem', type: 'MenuItem' },
  ],
  'inline-alert': ['InlineAlertProps'],
  empty: ['EmptyProps'],
  skeleton: ['SkeletonProps'],
  toast: ['ToastProps'],
  tooltip: ['TooltipProps'],
  pagination: ['PaginationProps'],
  'table-of-contents': ['TableOfContentsProps'],
  card: ['CardProps'],
  section: ['SectionProps'],
  'description-list': ['DescriptionListProps'],
  table: ['TableProps'],
};

const files = ts.sys.readDirectory(sourceRoot, ['.ts', '.tsx']);
const program = ts.createProgram(files, {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  strict: true,
  noEmit: true,
  skipLibCheck: true,
  esModuleInterop: true,
});
const checker = program.getTypeChecker();
const declarations = new Map();
for (const file of files) {
  const sourceFile = program.getSourceFile(file);
  for (const statement of sourceFile.statements) {
    if (ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) declarations.set(statement.name.text, statement);
  }
}

function declaredType(name) {
  const declaration = declarations.get(name);
  if (!declaration) throw new Error(`找不到源码类型 ${name}`);
  const symbol = checker.getSymbolAtLocation(declaration.name);
  return { declaration, type: ts.isInterfaceDeclaration(declaration) ? checker.getDeclaredTypeOfSymbol(symbol) : checker.getTypeAtLocation(declaration.name) };
}

function members(type) {
  return type.isUnion() ? type.types : [type];
}

function typeNamesIn(node) {
  const names = [];
  const visit = current => {
    if (ts.isTypeReferenceNode(current)) {
      names.push(ts.isIdentifier(current.typeName) ? current.typeName.text : current.typeName.right.text);
      current.typeArguments?.forEach(visit);
    } else if (ts.isIntersectionTypeNode(current) || ts.isUnionTypeNode(current)) current.types.forEach(visit);
    else if (ts.isParenthesizedTypeNode(current)) visit(current.type);
  };
  visit(node);
  return names;
}

// Destructured defaults are the source of truth for documented default values. Both
// `function Component({ size = 'md', ... })` and `const { size = 'md' } = props` count.
const defaultsByType = new Map();
function recordDefault(typeName, propertyName, initializer) {
  const value = initializer.getText().replace(/\s+/g, ' ').trim();
  if (!defaultsByType.has(typeName)) defaultsByType.set(typeName, new Map());
  const found = defaultsByType.get(typeName).get(propertyName);
  if (found && found.value !== value) throw new Error(`${typeName}.${propertyName} 有冲突的解构默认值：${found.value} / ${value}`);
  defaultsByType.get(typeName).set(propertyName, { value, initializer });
}
function recordPattern(typeNames, pattern) {
  for (const element of pattern.elements) {
    if (ts.isOmittedExpression(element)) continue;
    const propertyName = element.propertyName ? element.propertyName.getText() : element.name.getText();
    if (ts.isObjectBindingPattern(element.name)) { recordPattern(typeNames, element.name); continue; }
    if (element.initializer) for (const typeName of typeNames) recordDefault(typeName, propertyName, element.initializer);
  }
}
for (const file of files) {
  const sourceFile = program.getSourceFile(file);
  const visit = node => {
    if (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node)) {
      for (const parameter of node.parameters) {
        if (!parameter.type) continue;
        const typeNames = typeNamesIn(parameter.type);
        if (ts.isObjectBindingPattern(parameter.name)) { recordPattern(typeNames, parameter.name); continue; }
        if (!ts.isIdentifier(parameter.name) || !node.body || !ts.isBlock(node.body)) continue;
        for (const statement of node.body.statements) {
          if (!ts.isVariableStatement(statement)) continue;
          for (const declaration of statement.declarationList.declarations) {
            if (!ts.isObjectBindingPattern(declaration.name)) continue;
            if (!ts.isIdentifier(declaration.initializer) || declaration.initializer.text !== parameter.name.text) continue;
            recordPattern(typeNames, declaration.name);
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
}

function jsdocSummary(declaration) {
  const texts = [];
  for (const comment of ts.getJSDocCommentsAndTags(declaration)) {
    if (!ts.isJSDoc(comment)) continue;
    const text = ts.getTextOfJSDocComment(comment.comment);
    if (text) texts.push(text.replace(/\s+/g, ' ').trim());
  }
  return texts.join(' ') || undefined;
}

function stripOuterParens(text) {
  if (!text.startsWith('(') || !text.endsWith(')')) return text;
  let depth = 0;
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] === '(') depth += 1;
    else if (text[index] === ')') depth -= 1;
    if (depth === 0 && index < text.length - 1) return text;
  }
  return text.slice(1, -1);
}

function propertyTypeText(declaration, property) {
  // Method signatures expose their return type through `declaration.type`; read the
  // callable type from the symbol instead so callbacks are not documented as `void`.
  if (ts.isMethodSignature(declaration)) {
    return stripOuterParens(checker.typeToString(checker.getTypeOfSymbolAtLocation(property, declaration), declaration, format)
      .replace(/ \| undefined$/, '').replace(/"/g, "'"));
  }
  if (declaration.type) return declaration.type.getText();
  return checker.typeToString(checker.getTypeOfSymbolAtLocation(property, declaration), declaration, format)
    .replace(/ \| undefined$/, '').replace(/"/g, "'");
}

function propertyInfo(type, name) {
  const found = members(type).map(member => checker.getPropertyOfType(member, name)).filter(Boolean);
  if (found.length === 0) return undefined;
  if (type.isUnion()) return { owned: false };
  const property = found[0];
  const propertyDeclarations = property.declarations ?? [];
  const repoDeclaration = propertyDeclarations.find(declaration => declaration.getSourceFile().fileName.startsWith(sourceRoot));
  if (!repoDeclaration) return { owned: false };
  const parent = repoDeclaration.parent;
  const declaringType = ts.isInterfaceDeclaration(parent) || ts.isTypeAliasDeclaration(parent) ? parent.name.text : undefined;
  return {
    owned: true,
    type: propertyTypeText(repoDeclaration, property),
    required: (property.flags & ts.SymbolFlags.Optional) === 0,
    description: jsdocSummary(repoDeclaration),
    declaringType,
    declaration: repoDeclaration,
  };
}

function defaultFor(entry, declaringType, propertyName) {
  const fromPropsType = defaultsByType.get(entry.typeName)?.get(propertyName)?.value;
  if (fromPropsType !== undefined) return fromPropsType;
  if (!declaringType) return undefined;
  return defaultsByType.get(declaringType)?.get(propertyName)?.value;
}

function entriesFor(id) {
  return typeMap[id].map(entry => (typeof entry === 'string' ? { type: entry } : entry));
}

/** Stable key for one API row: `Prop` for single-part components, `Part.Prop` otherwise. */
function apiRowKey(row) {
  return row.component ? `${row.component}.${row.name}` : row.name;
}

const REST_PROP = '其余属性';

function resolvedEntries(id) {
  return entriesFor(id).map(entry => ({ ...entry, typeName: entry.type, ...declaredType(entry.type) }));
}

function matchesFor(entries, row) {
  return entries
    .filter(entry => !row.component || entry.component === row.component)
    .map(entry => ({ entry, info: propertyInfo(entry.type, row.name) }))
    .filter(match => match.info);
}

function analyzeAuthoredDocs() {
  const docs = {};
  const problems = [];
  const tightening = [];
  const fallbacks = [];
  const rows = [];

  if (Object.keys(authoredDocs).length === 0) problems.push('authoredDocs 为空');

  for (const [id, doc] of Object.entries(authoredDocs)) {
    if (!typeMap[id]) { problems.push(`组件 ${id} 缺少源码类型映射`); continue; }
    const entries = resolvedEntries(id);
    const componentNames = entries.map(entry => entry.component).filter(Boolean);
    if (entries.length > 1 && new Set(componentNames).size !== componentNames.length) problems.push(`${id} 的多组件映射存在重名`);

    const seenRows = new Set();
    const api = doc.api.map(row => {
      const label = `${id}${row.component ? `.${row.component}` : ''}.${row.name}`;
      if (typeof row.name !== 'string' || row.name.length === 0) { problems.push(`${id} 存在缺少 name 的 API 行`); return row; }
      if (entries.length > 1 && !row.component) problems.push(`${label} 缺少 component 列`);
      if (row.component && !componentNames.includes(row.component)) problems.push(`${label} 的 component 未在类型映射中声明`);
      const key = `${row.component ?? ''}:${row.name}`;
      if (seenRows.has(key)) problems.push(`${label} 重复登记`);
      seenRows.add(key);

      if (row.name === REST_PROP) {
        if (row.component) problems.push(`${label} 不应带 component 列`);
        if (row.type === undefined || row.description === undefined || row.required === undefined) problems.push(`${label} 缺少回退的 type / required / description`);
        if (row.defaultValue !== undefined) problems.push(`${label} 不应声明 defaultValue`);
        fallbacks.push({ id, name: row.name, fields: ['type', 'required', 'description'] });
        rows.push({ id, name: row.name, mode: 'rest' });
        return { ...row };
      }

      const matches = matchesFor(entries, row);
      if (matches.length === 0) { problems.push(`${label} 未在源码类型中找到`); return { ...row }; }
      const union = matches.every(match => match.entry.type.isUnion());
      const source = union ? undefined : matches.find(match => match.info.owned);
      const sourceDefault = matches.map(match => defaultFor(match.entry, source?.info.declaringType, row.name)).find(value => value !== undefined);

      // Union props (ToggleGroup / Accordion) keep the authored type, required and
      // description; destructured defaults can still come from source.
      if (union) {
        if (row.type === undefined || row.description === undefined || row.required === undefined) problems.push(`${label} 缺少 union 回退的 type / required / description`);
        const contractDefault = row.defaultValue;
        if (sourceDefault !== undefined && contractDefault !== undefined) {
          tightening.push(`${label} 的默认值已可从源码解构提取，authoredDocs 中应删除 defaultValue`);
        }
        const defaultValue = sourceDefault ?? contractDefault;
        const fields = ['type', 'required', 'description'];
        if (defaultValue !== undefined && sourceDefault === undefined) fields.push('defaultValue');
        fallbacks.push({ id, component: row.component, name: row.name, fields });
        rows.push({ id, component: row.component, name: row.name, mode: 'union', defaultValue });
        return { component: row.component, name: row.name, type: row.type, defaultValue, required: row.required, description: row.description };
      }

      // Repo-owned props: type, required and description come from the source
      // declaration + JSDoc. Authored duplicates are reported as tightening issues.
      if (source) {
        const description = source.info.description ?? row.description;
        if (!description) problems.push(`${label} 缺少 JSDoc 说明`);
        const defaultValue = sourceDefault ?? row.defaultValue;
        if (sourceDefault === undefined && row.defaultValue !== undefined) fallbacks.push({ id, component: row.component, name: row.name, fields: ['defaultValue'] });
        for (const field of ['type', 'required', 'description']) {
          if (row[field] !== undefined) tightening.push(`${label} 的 ${field} 已由源码提供，authoredDocs 中应删除`);
        }
        if (sourceDefault !== undefined && row.defaultValue !== undefined) {
          tightening.push(`${label} 的默认值已可从源码解构提取，authoredDocs 中应删除 defaultValue`);
        }
        rows.push({ id, component: row.component, name: row.name, mode: 'owned', description, defaultValue });
        return {
          component: row.component,
          name: row.name,
          type: source.info.type,
          defaultValue,
          required: source.info.required,
          description,
        };
      }

      // Native / Radix inherited props keep authored type, required and description.
      const inherited = matches[0].info;
      if (row.type === undefined || row.description === undefined || row.required === undefined) problems.push(`${label} 缺少继承属性的 type / required / description 回退`);
      const defaultValue = sourceDefault ?? row.defaultValue;
      const fields = ['type', 'required', 'description'];
      if (defaultValue !== undefined && sourceDefault === undefined) fields.push('defaultValue');
      fallbacks.push({ id, component: row.component, name: row.name, fields });
      rows.push({ id, component: row.component, name: row.name, mode: 'inherited', defaultValue });
      return {
        component: row.component,
        name: row.name,
        type: row.type,
        defaultValue,
        required: row.required,
        description: row.description,
      };
    });

    // English API prose is authored in component-api-en.ts keyed by component id and
    // row key (`component:name`, or `:name` for single-part components). Require an
    // exact one-to-one match with the generated rows so translations cannot drift.
    const englishApi = apiDescriptionEn[id] ?? {};
    const englishKeys = new Set();
    for (const row of api) {
      const key = apiRowKey(row);
      englishKeys.add(key);
      const text = englishApi[key];
      if (typeof text !== 'string' || text.trim().length === 0) problems.push(`${id} 的 API 行 ${key} 缺少英文说明`);
      else if (/[\u4e00-\u9fff]/.test(text)) problems.push(`${id} 的 API 行 ${key} 的英文说明含中文`);
    }
    for (const key of Object.keys(englishApi)) {
      if (!englishKeys.has(key)) problems.push(`${id} 的英文 API 映射存在多余键 ${key}`);
    }
    const localizedApi = api.map(row => ({ ...row, descriptionEn: englishApi[apiRowKey(row)] ?? '' }));
    docs[id] = { importCode: doc.importCode, api: localizedApi, behavior: authoredBehavior[id] ?? [], related: doc.related };

    for (const entry of entries) {
      for (const member of members(entry.type)) {
        for (const property of checker.getPropertiesOfType(member)) {
          const propertyDeclarations = property.declarations ?? [];
          if (!propertyDeclarations.some(declaration => declaration.getSourceFile().fileName.startsWith(sourceRoot))) continue;
          const documented = doc.api.some(row => row.name === property.name && (!entry.component || row.component === entry.component));
          if (!documented) problems.push(`${id}.${property.name} 是源码公开属性，但 API 表未登记`);
        }
      }
    }
  }

  for (const id of Object.keys(typeMap)) {
    if (!authoredDocs[id]) problems.push(`组件 ${id} 缺少契约条目`);
  }
  for (const id of Object.keys(authoredBehavior)) {
    if (!typeMap[id]) problems.push(`行为声明 ${id} 没有对应的源码类型映射`);
  }
  for (const id of Object.keys(apiDescriptionEn)) {
    if (!typeMap[id]) problems.push(`英文 API 映射 ${id} 没有对应的源码类型映射`);
  }
  for (const id of Object.keys(typeMap)) {
    const entries = authoredBehavior[id];
    if (!entries) { problems.push(`组件 ${id} 缺少行为归属与 a11y 声明`); continue; }
    if (entries.length < 3) problems.push(`组件 ${id} 的行为声明少于 3 条`);
    const seenEntries = new Set();
    let hasKeyboard = false;
    for (const entry of entries) {
      const label = `${id} 的行为声明`;
      if (!behaviorTopics.includes(entry.topic)) problems.push(`${label} topic 非法：${entry.topic}`);
      if (!behaviorSources.includes(entry.source)) problems.push(`${label} source 非法：${entry.source}`);
      if (typeof entry.text !== 'string' || entry.text.trim().length === 0) problems.push(`${label} text 为空`);
      if (typeof entry.textEn !== 'string' || entry.textEn.trim().length === 0) problems.push(`${label} textEn 为空`);
      else if (/[\u4e00-\u9fff]/.test(entry.textEn)) problems.push(`${label} textEn 含中文`);
      if (entry.topic === 'keyboard') hasKeyboard = true;
      const key = `${entry.topic}:${entry.source}:${entry.text}`;
      if (seenEntries.has(key)) problems.push(`${label}重复：${entry.text}`);
      seenEntries.add(key);
    }
    if (!hasKeyboard) problems.push(`组件 ${id} 缺少键盘行为声明`);
  }
  return { docs, problems, tightening, fallbacks, rows };
}

let cachedAnalysis;
function analysis() {
  if (!cachedAnalysis) cachedAnalysis = analyzeAuthoredDocs();
  return cachedAnalysis;
}

/**
 * Reports source / contract drift. `problems` block generation (missing source rows,
 * incomplete fallbacks, duplicated defaults); `fallbacks` lists the authored fields
 * that remain because the source cannot provide them.
 */
export function auditApiContract() {
  const { problems, tightening, fallbacks, rows } = analysis();
  return { problems: [...problems, ...tightening], tightening, fallbacks, rows };
}

const quote = value => JSON.stringify(value);
function rowLiteral(row) {
  const parts = [];
  if (row.component) parts.push(`component: ${quote(row.component)}`);
  parts.push(`name: ${quote(row.name)}`, `type: ${quote(row.type)}`);
  if (row.defaultValue !== undefined) parts.push(`defaultValue: ${quote(row.defaultValue)}`);
  parts.push(`required: ${row.required}`, `description: ${quote(row.description)}`, `descriptionEn: ${quote(row.descriptionEn)}`);
  return `      { ${parts.join(', ')} },`;
}

export function buildGeneratedApi() {
  const { problems } = auditApiContract();
  if (problems.length) throw new Error([...new Set(problems)].join('\n'));
  const { docs } = analysis();
  const lines = [
    '// Generated by scripts/generate-api.mjs from packages/react/src, component-api.ts, component-api-en.ts and component-behavior.ts. Do not edit by hand.',
    "import type { PilotDoc } from './component-api-types';",
    '',
    'export const pilotDocs: Record<string, PilotDoc> = {',
  ];
  for (const [id, doc] of Object.entries(docs)) {
    lines.push(`  ${/^[a-z][a-z0-9]*$/.test(id) ? id : quote(id)}: {`);
    lines.push(`    importCode: ${quote(doc.importCode)},`);
    lines.push('    api: [');
    for (const row of doc.api) lines.push(rowLiteral(row));
    lines.push('    ],');
    lines.push('    behavior: [');
    for (const entry of doc.behavior) lines.push(`      { topic: ${quote(entry.topic)}, source: ${quote(entry.source)}, text: ${quote(entry.text)}, textEn: ${quote(entry.textEn)} },`);
    lines.push('    ],');
    lines.push(`    related: [${doc.related.map(quote).join(', ')}],`);
    lines.push('  },');
  }
  lines.push('};', '');
  return lines.join('\n');
}

function main() {
  const text = buildGeneratedApi();
  if (process.argv.includes('--check')) {
    if (!existsSync(output)) throw new Error('component-api.generated.ts 缺失，请执行 npm run api:generate');
    if (readFileSync(output, 'utf8') !== text) throw new Error('API 产物与源码 / 契约不一致，请执行 npm run api:generate');
    console.log('API contracts match component source.');
  } else {
    writeFileSync(output, text);
    console.log('Generated apps/docs/src/component-api.generated.ts.');
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
