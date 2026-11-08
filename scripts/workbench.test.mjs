import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultPreferences, filterResources, isArticle, isArticles, isLegacyPreferences, isPreferences, isResources, migratePreferences, pageCount, pageNumbers, parseArticle, parseRoute, validatePage } from '../apps/docs/src/model.ts';

const resource = { id: 'release-notes', name: '发布 Release Notes', kind: 'document', status: 'ready', summary: 'Upgrade guide', creator: '示例成员', updatedAt: '2026-11-04T10:00:00Z', version: 'v1', tags: ['发布'] };

test('stored preferences reject missing, coerced and unknown values', () => {
  assert(isPreferences(defaultPreferences));
  assert.equal(defaultPreferences.density, 'standard');
  assert(isPreferences({ ...defaultPreferences, density: 'compact' }));
  assert(isPreferences({ ...defaultPreferences, density: 'spacious' }));
  for (const value of [null, {}, { ...defaultPreferences, theme: ['dark'] }, { ...defaultPreferences, locale: 'fr' }, { ...defaultPreferences, hints: 'true' }, { ...defaultPreferences, density: 'ultra' }, { ...defaultPreferences, density: 'comfortable' }]) assert.equal(isPreferences(value), false);
});
test('legacy density values migrate without changing the standard appearance', () => {
  assert(isLegacyPreferences({ ...defaultPreferences, density: 'compact' }));
  assert(isLegacyPreferences({ ...defaultPreferences, density: 'comfortable' }));
  assert.equal(isLegacyPreferences({ ...defaultPreferences, density: 'ultra' }), false);
  assert.equal(migratePreferences({ ...defaultPreferences, density: 'compact' }).density, 'standard');
  assert.equal(migratePreferences({ ...defaultPreferences, density: 'comfortable' }).density, 'spacious');
  assert.equal(migratePreferences({ ...defaultPreferences, density: 'spacious' }).density, 'spacious');
});
test('resources accept empty collections and reject corrupted or duplicate records', () => {
  assert(isResources([])); assert(isResources([resource]));
  for (const value of [[resource, resource], [{ ...resource, updatedAt: 'not-a-date' }], [{ ...resource, kind: ['document'] }], [{ ...resource, tags: [42] }], [{ ...resource, name: ' ' }], [{ ...resource, id: '../secrets' }]]) assert.equal(isResources(value), false);
});
test('resource filters combine text, type and state without mutating the source', () => {
  const items = [resource, { ...resource, id: 'review', name: '检查清单', kind: 'checklist', status: 'draft' }];
  assert.deepEqual(filterResources(items, ' release ', 'all', 'ready'), [resource]);
  assert.deepEqual(filterResources(items, 'UPGRADE', 'document', 'all'), [resource]);
  assert.equal(filterResources(items, '', 'checklist', 'ready').length, 0);
  assert.equal(items.length, 2);
});
test('pagination has one empty page, clamps page counts and rejects ambiguous input', () => {
  assert.equal(pageCount(0, 10), 1); assert.equal(pageCount(8, 5), 2); assert.equal(pageCount(11, 10), 2);
  assert.equal(validatePage('2', 2), 2); assert.equal(validatePage(' 1 ', 2), 1);
  for (const input of ['', '0', '-1', '3', '1.5', '1e1', '+1', 'NaN']) assert.equal(validatePage(input, 2), undefined);
});
test('page links keep first, current and last pages with unambiguous gaps', () => {
  assert.deepEqual(pageNumbers(1, 1), [1]);
  assert.deepEqual(pageNumbers(6, 24), [1, 'gap', 5, 6, 7, 'gap', 24]);
  assert.deepEqual(pageNumbers(24, 24), [1, 'gap', 23, 24]);
});
test('outline reflects heading levels, repeated titles have unique ids', () => {
  const blocks = parseArticle('导语\r\n\r\n## 第一章\r\n正文\r\n\r\n### 子章节\r\n内容\r\n\r\n## 第一章');
  const headings = blocks.filter(block => block.type === 'heading');
  assert.deepEqual(headings.map(h => h.level), [2, 3, 2]);
  assert.equal(new Set(headings.map(h => h.id)).size, 3);
  assert.equal(blocks[0].text, '导语');
});
test('plain text is preserved and is not interpreted as HTML or a full markdown language', () => {
  const source = '<img src=x onerror=alert(1)>\n# Not a supported heading';
  assert.deepEqual(parseArticle(source), [{ type: 'paragraph', text: source }]);
  assert.deepEqual(parseArticle('> 提示\n\n'), [{ type: 'callout', text: '提示' }]);
  assert.deepEqual(parseArticle(''), []);
});
test('stored articles validate title, size and dates without rejecting a deliberately empty body', () => {
  const article = { title: '一份文档', body: '', updatedAt: '2026-11-04T10:00:00Z' };
  assert(isArticle(article)); assert(isArticles({ welcome: article }));
  assert.equal(isArticle({ ...article, title: ' ' }), false);
  assert.equal(isArticle({ ...article, body: 'x'.repeat(50001) }), false);
  assert.equal(isArticles({ '../invalid': article }), false);
});
test('routes distinguish pages, resource ids and section anchors', () => {
  assert.deepEqual(parseRoute('#/document/theme-colors/section-2'), { page: 'document', resourceId: 'theme-colors', section: 'section-2' });
  assert.equal(parseRoute('#/settings').page, 'settings');
  assert.deepEqual(parseRoute('#/components'), { page: 'components', resourceId: undefined, section: undefined });
  assert.deepEqual(parseRoute('#/foundations'), { page: 'foundations', resourceId: undefined, section: undefined });
  assert.equal(parseRoute('#/unknown').page, 'resources');
  assert.equal(parseRoute('#/document/%2Fetc/section-x').resourceId, undefined);
  assert.equal(parseRoute('#/document/welcome/section-x').section, undefined);
});
