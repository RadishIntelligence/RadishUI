import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { componentCatalog, componentGroups, filterComponents, findComponent, groupLabel } from '../apps/docs/src/component-catalog.ts';
import { pilotDocs } from '../apps/docs/src/component-api.generated.ts';
import { buildLlmsText } from './generate-llms.mjs';
import { auditApiContract, buildGeneratedApi } from './generate-api.mjs';

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
    assert.ok(doc.keyboard.length >= 3, component.id);
    assert.ok(doc.related.every(id => findComponent(id)), component.id);
    assert.match(doc.importCode, new RegExp(`from '@radish-ui/react'`), component.id);
  }
  for (const id of Object.keys(pilotDocs)) assert.equal(findComponent(id)?.detail, true, id);
});

test('component-api.generated.ts matches component source types', () => {
  const file = new URL('../apps/docs/src/component-api.generated.ts', import.meta.url);
  assert.equal(readFileSync(file, 'utf8'), buildGeneratedApi());
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
