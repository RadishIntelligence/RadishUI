import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { componentCatalog, componentGroups, filterComponents, findComponent, groupLabel } from '../apps/docs/src/component-catalog.ts';
import { pilotDocs } from '../apps/docs/src/component-api.generated.ts';
import { behaviorSources, behaviorTopics } from '../apps/docs/src/component-api-types.ts';
import { buildLlmsText } from './generate-llms.mjs';
import { auditApiContract, buildGeneratedApi } from './generate-api.mjs';
import { buildGeneratedCode, buildHighlightedCode, readExampleSources } from './generate-code.mjs';

test('component catalog has unique, routable ids and known groups', () => {
  assert.equal(componentCatalog.length, 30);
  assert.equal(new Set(componentCatalog.map(component => component.id)).size, componentCatalog.length);
  assert.equal(new Set(componentCatalog.map(component => component.name)).size, componentCatalog.length);
  for (const component of componentCatalog) {
    assert.match(component.id, /^[a-z0-9]+(-[a-z0-9]+)*$/);
    assert.ok(componentGroups.some(group => group.id === component.group), component.id);
    assert.ok(component.summary.trim().length > 0, component.id);
    assert.equal(findComponent(component.id), component);
  }
});

test('pilot entries have API rows and a dedicated page', () => {
  const pilots = componentCatalog.filter(component => component.detail);
  assert.deepEqual(pilots.map(component => component.id), ['button', 'icon-button', 'form-field', 'input', 'textarea', 'input-otp', 'select', 'tag-input', 'radio-group', 'avatar', 'tag', 'toggle-group', 'checkbox', 'switch', 'tabs', 'status-badge', 'dialog', 'confirm-dialog', 'accordion', 'drawer', 'menu', 'inline-alert', 'skeleton', 'toast', 'tooltip', 'pagination', 'table-of-contents', 'card', 'section', 'table']);
  for (const component of pilots) {
    const doc = pilotDocs[component.id];
    assert.ok(doc, component.id);
    assert.ok(doc.api.length >= 2, component.id);
    assert.ok(doc.behavior.length >= 3, component.id);
    assert.ok(doc.related.every(id => findComponent(id)), component.id);
    assert.match(doc.importCode, new RegExp(`from '@radish-ui/react'`), component.id);
  }
  for (const id of Object.keys(pilotDocs)) assert.equal(findComponent(id)?.detail, true, id);
});

test('component-api.generated.ts matches component source types', () => {
  const file = new URL('../apps/docs/src/component-api.generated.ts', import.meta.url);
  assert.equal(readFileSync(file, 'utf8'), buildGeneratedApi());
});

test('behavior declarations cover every component with sources and topics', () => {
  for (const component of componentCatalog) {
    const doc = pilotDocs[component.id];
    assert.ok(doc.behavior.length >= 3, component.id);
    for (const item of doc.behavior) {
      assert.ok(behaviorTopics.includes(item.topic), `${component.id}: ${item.topic}`);
      assert.ok(behaviorSources.includes(item.source), `${component.id}: ${item.source}`);
      assert.ok(item.text.trim().length > 0, component.id);
    }
    assert.ok(doc.behavior.some(item => item.topic === 'keyboard'), `${component.id} 缺少键盘行为`);
    assert.ok(doc.behavior.some(item => item.topic !== 'limitation'), `${component.id} 只有限制声明`);
  }
  const sources = new Set(componentCatalog.flatMap(component => pilotDocs[component.id].behavior.map(item => item.source)));
  assert.deepEqual([...sources].sort(), ['native', 'radish', 'radix']);
  const topics = new Set(componentCatalog.flatMap(component => pilotDocs[component.id].behavior.map(item => item.topic)));
  assert.deepEqual([...topics].sort(), ['aria', 'focus', 'keyboard', 'limitation']);
});

test('authored contract only keeps fields the source cannot provide', () => {
  const audit = auditApiContract();
  assert.deepEqual(audit.problems, []);
  assert.deepEqual(audit.tightening, []);
  // Default values that are not destructured in source stay authored; adding or
  // removing one should be a deliberate contract change, not silent drift.
  const authoredDefaults = audit.fallbacks
    .filter(fallback => fallback.fields.includes('defaultValue'))
    .map(fallback => `${fallback.id}.${fallback.name}`)
    .sort();
  assert.deepEqual(authoredDefaults, [
    'accordion.collapsible',
    'accordion.type',
    'button.disabled',
    'form-field.required',
    'icon-button.disabled',
    'icon-button.type',
    'select.disabled',
    'select.required',
    'tag-input.disabled',
    'textarea.readOnly',
    'toggle-group.type',
  ]);
});

test('descriptions and default values come from component source', () => {
  const row = (id, name, component) => {
    const found = pilotDocs[id].api.find(entry => entry.name === name && (!component || entry.component === component));
    assert.ok(found, `${id}.${name}`);
    return found;
  };
  assert.equal(row('button', 'variant').description, '操作层级；一个区域只保留一个主要操作。');
  assert.equal(row('button', 'variant').defaultValue, "'primary'");
  assert.equal(row('icon-button', 'variant').defaultValue, "'ghost'");
  assert.equal(row('icon-button', 'size').defaultValue, "'md'");
  assert.equal(row('dialog', 'role').defaultValue, "'dialog'");
  assert.equal(row('pagination', 'pageSizeOptions').defaultValue, '[5, 10, 20, 50]');
  assert.equal(row('table-of-contents', 'hrefFor').defaultValue, 'id => `#${id}`');
  assert.equal(row('card', 'tone').description, '表面角色：内容卡、弱化内嵌或预览画布。');
  assert.equal(row('section', 'size').description, 'md 阅读区块；sm 密集参考区。');
  assert.equal(row('table', 'label').description, '表格的可访问名称，渲染为视觉隐藏的 caption。');
  for (const doc of Object.values(pilotDocs)) {
    for (const entry of doc.api) {
      if (/^on[A-Z]/.test(entry.name) || entry.name === 'hrefFor' || entry.name === 'removeLabel') {
        assert.match(entry.type, /=>|Handler</, `${entry.name} 应保留函数类型`);
      }
    }
  }
});

test('example catalog covers every detail component with usable snippets', () => {
  const file = new URL('../apps/docs/src/component-pilot-examples.tsx', import.meta.url);
  const source = ts.createSourceFile('component-pilot-examples.tsx', readFileSync(file, 'utf8'),
    ts.ScriptTarget.ES2022, true, ts.ScriptKind.TSX);
  let catalog;
  const findCatalog = node => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'pilotExamples') catalog = node.initializer;
    ts.forEachChild(node, findCatalog);
  };
  ts.forEachChild(source, findCatalog);
  assert.ok(catalog && ts.isObjectLiteralExpression(catalog), 'pilotExamples 必须是对象字面量');

  const details = new Map();
  for (const property of catalog.properties) {
    assert.ok(ts.isPropertyAssignment(property), '示例目录项必须是属性赋值');
    const key = ts.isIdentifier(property.name) || ts.isStringLiteral(property.name) ? property.name.text : undefined;
    assert.ok(key, '示例目录键必须可静态读取');
    assert.ok(ts.isArrayLiteralExpression(property.initializer), `${key} 的示例必须是数组`);
    const examples = property.initializer.elements;
    assert.ok(examples.length >= 3, `${key} 至少需要 3 个示例`);
    const ids = new Set();
    for (const element of examples) {
      assert.ok(ts.isObjectLiteralExpression(element), `${key} 的示例必须是对象字面量`);
      const fields = new Map(element.properties.filter(property => ts.isPropertyAssignment(property))
        .map(property => [property.name.getText(source).replace(/^'|'$/g, ''), property.initializer]));
      const id = fields.get('id');
      const title = fields.get('title');
      const description = fields.get('description');
      const code = fields.get('code');
      assert.ok(id && ts.isStringLiteral(id) && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id.text), `${key} 示例缺少可路由 id`);
      assert.ok(!ids.has(id.text), `${key} 示例 id 重复：${id.text}`);
      ids.add(id.text);
      assert.ok(title && ts.isStringLiteral(title) && title.text.trim().length > 0, `${key}.${id.text} 缺少标题`);
      assert.ok(description && ts.isStringLiteral(description) && description.text.trim().length > 0, `${key}.${id.text} 缺少说明`);
      const snippet = code && (ts.isStringLiteral(code) || ts.isNoSubstitutionTemplateLiteral(code)) ? code.text : undefined;
      assert.ok(snippet && snippet.trim().length > 20 && snippet.includes('<'), `${key}.${id.text} 的代码片段不可用`);
      assert.ok(fields.has('preview'), `${key}.${id.text} 缺少预览`);
    }
    details.set(key, examples.length);
  }
  const detailIds = componentCatalog.filter(component => component.detail).map(component => component.id).sort();
  assert.deepEqual([...details.keys()].sort(), detailIds);
});

test('component-code.generated.ts matches example sources', () => {
  const file = new URL('../apps/docs/src/component-code.generated.ts', import.meta.url);
  assert.equal(readFileSync(file, 'utf8'), buildGeneratedCode());
});

test('highlighted code covers every import and example with escaped token markup', () => {
  const { entries, roles } = buildHighlightedCode();
  const examples = readExampleSources();
  const snippets = new Map(entries);
  assert.equal(snippets.size, entries.length);
  assert.equal(entries.length, Object.keys(pilotDocs).length + [...examples.values()].reduce((total, list) => total + list.size, 0));
  for (const id of Object.keys(pilotDocs)) {
    assert.ok(snippets.has(`${id}/import`), `${id}/import 缺少高亮产物`);
    for (const exampleId of examples.get(id).keys()) assert.ok(snippets.has(`${id}/${exampleId}`), `${id}/${exampleId} 缺少高亮产物`);
  }
  for (const [key, html] of entries) {
    // Only generated span wrappers may carry markup; token text stays HTML-escaped,
    // so attribute-looking text (onSubmit=, />) inside a snippet cannot become markup.
    assert.doesNotMatch(html.replace(/<span class="tok-[a-z]">|<\/span>/g, ''), /[<>]/, `${key} 的产物含未转义标记`);
  }
  for (const role of ['k', 's', 't']) assert.ok(roles.has(role), `缺少 token 角色 ${role}`);
  assert.deepEqual([...roles].filter(role => !['c', 'k', 's', 't'].includes(role)), []);
});

test('llms.txt matches generated component contracts', () => {
  const file = new URL('../apps/docs/public/llms.txt', import.meta.url);
  assert.equal(readFileSync(file, 'utf8'), buildLlmsText());
});

test('catalog search filters names, summaries and group labels', () => {
  assert.equal(filterComponents('').length, componentCatalog.length);
  assert.deepEqual(filterComponents('button').map(component => component.id), ['button', 'icon-button']);
  assert.deepEqual(filterComponents('表单').map(component => component.id), ['select']);
  assert.deepEqual(filterComponents('没有这个组件'), []);
  assert.equal(groupLabel('fields'), '字段');
  assert.equal(groupLabel('fields', 'en'), 'Fields');
});
