import test from 'node:test';
import assert from 'node:assert/strict';
import { componentCatalog, componentGroups, filterComponents, findComponent, groupLabel } from '../apps/docs/src/component-catalog.ts';
import { pilotDocs } from '../apps/docs/src/component-api.ts';

test('component catalog has unique, routable ids and known groups', () => {
  assert.equal(componentCatalog.length, 27);
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
  assert.deepEqual(pilots.map(component => component.id), ['button', 'form-field', 'input', 'textarea', 'input-otp', 'select', 'tag-input', 'radio-group', 'checkbox', 'switch', 'tabs']);
  for (const component of pilots) {
    const doc = pilotDocs[component.id];
    assert.ok(doc, component.id);
    assert.ok(doc.api.length >= 6, component.id);
    assert.ok(doc.keyboard.length >= 3, component.id);
    assert.ok(doc.related.every(id => findComponent(id)), component.id);
    assert.match(doc.importCode, new RegExp(`from '@radish-ui/react'`), component.id);
  }
  for (const id of Object.keys(pilotDocs)) assert.equal(findComponent(id)?.detail, true, id);
});

test('catalog search filters names, summaries and group labels', () => {
  assert.equal(filterComponents('').length, componentCatalog.length);
  assert.deepEqual(filterComponents('button').map(component => component.id), ['button', 'icon-button']);
  assert.deepEqual(filterComponents('表单').map(component => component.id), ['select']);
  assert.deepEqual(filterComponents('没有这个组件'), []);
  assert.equal(groupLabel('fields'), '字段');
  assert.equal(groupLabel('fields', 'en'), 'Fields');
});
