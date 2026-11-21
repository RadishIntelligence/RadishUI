import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';
import { authoredDocs } from '../apps/docs/src/component-api.ts';

const root = new URL('../', import.meta.url);
const sourceRoot = fileURLToPath(new URL('packages/react/src', root));
const output = new URL('apps/docs/src/component-api.generated.ts', root);
const format = ts.TypeFormatFlags.NoTruncation;

const typeMap = {
  button: ['ButtonProps'],
  'icon-button': ['IconButtonProps'],
  'form-field': ['FormFieldProps'],
  input: ['InputProps'],
  textarea: ['TextareaProps'],
  'input-otp': ['InputOTPProps'],
  select: ['SelectProps'],
  'tag-input': ['TagInputProps'],
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
  drawer: ['DialogProps'],
  menu: [
    { component: 'Menu', type: 'MenuProps' },
    { component: 'MenuItem', type: 'MenuItem' },
  ],
  'inline-alert': ['InlineAlertProps'],
  skeleton: ['SkeletonProps'],
  toast: ['ToastProps'],
  tooltip: ['TooltipProps'],
  pagination: ['PaginationProps'],
  'table-of-contents': ['TableOfContentsProps'],
  card: ['CardProps'],
  section: ['SectionProps'],
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

function propertyInfo(type, name) {
  const found = members(type).map(member => checker.getPropertyOfType(member, name)).filter(Boolean);
  if (found.length === 0) return undefined;
  if (type.isUnion()) return { owned: false };
  const property = found[0];
  const declarations = property.declarations ?? [];
  const repoDeclaration = declarations.find(declaration => declaration.getSourceFile().fileName.startsWith(sourceRoot));
  if (!repoDeclaration) return { owned: false };
  const typeText = repoDeclaration.type
    ? repoDeclaration.type.getText()
    : checker.typeToString(checker.getTypeOfSymbolAtLocation(property, repoDeclaration), repoDeclaration, format)
      .replace(/ \| undefined$/, '').replace(/"/g, "'");
  return { owned: true, type: typeText, required: (property.flags & ts.SymbolFlags.Optional) === 0 };
}

function entriesFor(id) {
  return typeMap[id].map(entry => typeof entry === 'string' ? { type: entry } : entry);
}

function generatedDocs() {
  const docs = {};
  const problems = [];
  for (const [id, doc] of Object.entries(authoredDocs)) {
    if (!typeMap[id]) throw new Error(`组件 ${id} 缺少源码类型映射`);
    const entries = entriesFor(id).map(entry => ({ ...entry, ...declaredType(entry.type) }));
    const api = doc.api.map(row => {
      const candidates = row.name === '其余属性' ? [] : entries.filter(entry => !row.component || entry.component === row.component);
      const matches = candidates.map(entry => ({ entry, info: propertyInfo(entry.type, row.name) })).filter(match => match.info);
      if (row.name !== '其余属性' && matches.length === 0) problems.push(`${id}.${row.name} 未在源码类型中找到`);
      const source = matches.find(match => match.info.owned);
      if (!source) return row;
      const type = /^[A-Za-z_$][\w$]*$/.test(source.info.type) && row.type.includes('|') ? row.type : source.info.type;
      return { ...row, type, required: source.info.required };
    });
    docs[id] = { ...doc, api };
    for (const entry of entries) {
      for (const member of members(entry.type)) {
        for (const property of checker.getPropertiesOfType(member)) {
          const declarations = property.declarations ?? [];
          if (!declarations.some(declaration => declaration.getSourceFile().fileName.startsWith(sourceRoot))) continue;
          const documented = doc.api.some(row => row.name === property.name && (!entry.component || row.component === entry.component));
          if (!documented) problems.push(`${id}.${property.name} 是源码公开属性，但 API 表未登记`);
        }
      }
    }
  }
  if (problems.length) throw new Error([...new Set(problems)].join('\n'));
  return docs;
}

const quote = value => JSON.stringify(value);
function rowLiteral(row) {
  const parts = [];
  if (row.component) parts.push(`component: ${quote(row.component)}`);
  parts.push(`name: ${quote(row.name)}`, `type: ${quote(row.type)}`);
  if (row.defaultValue !== undefined) parts.push(`defaultValue: ${quote(row.defaultValue)}`);
  parts.push(`required: ${row.required}`, `description: ${quote(row.description)}`);
  return `      { ${parts.join(', ')} },`;
}

export function buildGeneratedApi() {
  const docs = generatedDocs();
  const lines = [
    '// Generated by scripts/generate-api.mjs from component-api.ts and packages/react/src. Do not edit by hand.',
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
    lines.push(`    keyboard: [${doc.keyboard.map(quote).join(', ')}],`);
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
