import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { changelog, siteVersion } from '../apps/docs/src/changelog.ts';
import { componentCatalog } from '../apps/docs/src/component-catalog.ts';
import { iconReference, iconReferenceGroups } from '../apps/docs/src/icon-reference.ts';
import { siteSearchEntries } from '../apps/docs/src/site-search.generated.ts';
import { searchMatchDetail, searchSite, siteSearchKindOrder } from '../apps/docs/src/site-search.ts';
import { buildGeneratedSearch } from './generate-search.mjs';
import * as lucideIcons from 'lucide-react';
import { appendResourceTags, defaultPreferences, filterResources, isArticle, isArticles, isLegacyPreferences, isPreferences, isPreferencesV2, isResources, migratePreferences, migratePreferencesV2, pageCount, parseArticle, parseRoute, resourceTagLimits } from '../apps/docs/src/model.ts';
import { paginationRange, validatePage } from '../packages/react/src/pagination.ts';

const resource = { id: 'release-notes', name: '发布 Release Notes', kind: 'document', status: 'ready', summary: 'Upgrade guide', creator: '示例成员', updatedAt: '2026-11-04T10:00:00Z', version: 'v1', tags: ['发布'] };

test('icon reference matches lucide-react exports and stays unique', () => {
  assert.ok(iconReference.length >= 30, '图标参考至少覆盖 30 个已使用图标');
  const names = iconReference.map(entry => entry.name);
  assert.equal(new Set(names).size, names.length, '图标名不重复');
  assert.deepEqual([...new Set(iconReference.map(entry => entry.group))].sort(), [...iconReferenceGroups].sort(), '每个分组都有图标');
  for (const entry of iconReference) {
    assert.ok(entry.zh.trim() && entry.en.trim(), entry.name);
    assert.equal(entry.Icon, lucideIcons[entry.name], `${entry.name} 与 lucide-react 导出不一致`);
  }
});


test('site search index covers static content and points at existing pages', () => {
  const ids = siteSearchEntries.map(entry => entry.id);
  assert.equal(new Set(ids).size, ids.length, '站点搜索 id 不重复');
  assert.deepEqual([...new Set(siteSearchEntries.map(entry => entry.kind))].sort(), [...siteSearchKindOrder].sort());
  assert.equal(siteSearchEntries.filter(entry => entry.kind === 'page').length, 10);
  assert.equal(siteSearchEntries.filter(entry => entry.kind === 'component').length, componentCatalog.length);
  assert.equal(siteSearchEntries.filter(entry => entry.kind === 'icon').length, iconReference.length);
  assert.equal(siteSearchEntries.filter(entry => entry.kind === 'changelog').length, changelog.length);
  const standalone = new Set(['#/overview', '#/catalog', '#/components', '#/foundations', '#/icons', '#/changelog', '#/platforms', '#/resources', '#/settings', '#/document']);
  for (const entry of siteSearchEntries) {
    assert.ok(entry.title.zh.trim() && entry.title.en.trim(), entry.id);
    assert.ok(entry.description.zh.trim() && entry.description.en.trim(), entry.id);
    assert.ok(entry.group.zh.trim() && entry.group.en.trim(), entry.id);
    const parts = entry.href.replace(/^#\//, '').split('/');
    if (parts[0] === 'components' && parts[1]) {
      assert.ok(componentCatalog.some(component => component.id === parts[1] && component.detail), entry.id);
    } else {
      assert.ok(standalone.has(entry.href), `${entry.id} 链接目标不存在：${entry.href}`);
    }
  }
  for (const component of componentCatalog) {
    assert.ok(ids.includes(`component:${component.id}`), component.id);
    const entry = siteSearchEntries.find(candidate => candidate.id === `component:${component.id}`);
    assert.equal(/[\u4e00-\u9fff]/.test(entry.description.en), false, `${component.id} 的英文搜索说明仍含中文`);
  }
  for (const icon of iconReference) assert.ok(ids.includes(`icon:${icon.name}`), icon.name);
  for (const entry of changelog) assert.ok(ids.includes(`changelog:${entry.date}`), entry.date);
});

test('site search generated file matches its sources', () => {
  const file = new URL('../apps/docs/src/site-search.generated.ts', import.meta.url);
  assert.equal(readFileSync(file, 'utf8'), buildGeneratedSearch());
});

test('site search matches names, roles, aliases and changelog details', () => {
  assert.equal(searchSite(siteSearchEntries, '').length, siteSearchEntries.length);
  const buttons = searchSite(siteSearchEntries, 'button').map(entry => entry.id);
  assert.ok(buttons.includes('component:button'));
  assert.ok(buttons.includes('component:icon-button'));
  assert.deepEqual(searchSite(siteSearchEntries, 'BUTTON').map(entry => entry.id), buttons);
  assert.deepEqual(searchSite(siteSearchEntries, 'arrow').filter(entry => entry.kind === 'icon').map(entry => entry.id).sort(), ['icon:ArrowLeft', 'icon:ArrowRight', 'icon:ArrowUpRight']);
  assert.ok(searchSite(siteSearchEntries, '表单').some(entry => entry.id === 'component:form'));
  assert.ok(searchSite(siteSearchEntries, '按钮').some(entry => entry.id === 'component:button'));
  assert.ok(searchSite(siteSearchEntries, '表单 校验').some(entry => entry.id === 'component:form'));
  // The active language drives matching; keywords keep bilingual aliases for recall.
  assert.ok(searchSite(siteSearchEntries, 'sticky header', 'en').some(entry => entry.id === 'component:table'));
  assert.deepEqual(searchSite(siteSearchEntries, 'sticky header', 'zh-CN'), []);
  assert.ok(searchSite(siteSearchEntries, '按钮', 'en').some(entry => entry.id === 'component:button'));
  assert.ok(searchSite(siteSearchEntries, 'button', 'en').some(entry => entry.id === 'component:tag-input'));
  const shiki = searchSite(siteSearchEntries, 'shiki').find(entry => entry.id === 'changelog:2026-11-22');
  assert.ok(shiki);
  assert.match(searchMatchDetail(shiki, 'shiki').zh, /Shiki/);
  assert.deepEqual(searchSite(siteSearchEntries, '没有这个条目'), []);
  assert.equal(searchSite(siteSearchEntries, '   ').length, siteSearchEntries.length);
});

test('changelog records stay sorted and link to existing pages', () => {
  const version = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version;
  assert.equal(siteVersion, version, '展示站版本需与 package.json 一致');
  const dates = changelog.map(entry => entry.date);
  assert.deepEqual(dates, [...dates].sort().reverse(), '变更记录按日期倒序');
  assert.equal(new Set(dates).size, dates.length, '变更记录日期不重复');
  const standaloneHrefs = new Set(['#/overview', '#/catalog', '#/components', '#/platforms', '#/changelog', '#/resources', '#/settings', '#/document', '#/foundations', '#/search']);
  for (const entry of changelog) {
    assert.match(entry.date, /^\d{4}-\d{2}-\d{2}$/, entry.date);
    assert.ok(entry.title.zh.trim() && entry.title.en.trim(), entry.date);
    assert.ok(entry.items.length >= 1, entry.date);
    for (const item of entry.items) {
      assert.ok(item.zh.trim() && item.en.trim(), entry.date);
      if (!item.href) continue;
      const parts = item.href.replace(/^#\//, '').split('/');
      if (parts[0] === 'components' && parts[1]) {
        const component = componentCatalog.find(entry => entry.id === parts[1]);
        assert.ok(component?.detail, `${entry.date} 链接到未迁移组件：${item.href}`);
        if (parts[2] !== undefined) assert.match(parts[2], /^doc-[a-z-]+$/, item.href);
      } else {
        assert.ok(standaloneHrefs.has(item.href), `${entry.date} 链接目标不存在：${item.href}`);
      }
    }
  }
});

test('stored preferences reject missing, coerced and unknown values', () => {
  assert(isPreferences(defaultPreferences));
  assert.equal(defaultPreferences.density, 'standard');
  assert.equal(defaultPreferences.pageSize, 20);
  assert(isPreferences({ ...defaultPreferences, density: 'compact' }));
  assert(isPreferences({ ...defaultPreferences, density: 'spacious' }));
  assert(isPreferences({ ...defaultPreferences, pageSize: 5 }));
  assert(isPreferences({ ...defaultPreferences, pageSize: 50 }));
  for (const value of [null, {}, { ...defaultPreferences, theme: ['dark'] }, { ...defaultPreferences, locale: 'fr' }, { ...defaultPreferences, showToc: 'true' }, { ...defaultPreferences, density: 'ultra' }, { ...defaultPreferences, density: 'comfortable' }, { ...defaultPreferences, pageSize: 4 }, { ...defaultPreferences, pageSize: 51 }, { ...defaultPreferences, pageSize: 1.5 }, { ...defaultPreferences, pageSize: '20' }]) assert.equal(isPreferences(value), false);
});

test('version 2 preferences gain the default page size without losing their appearance', () => {
  const { pageSize, ...version2 } = defaultPreferences;
  assert.equal(pageSize, 20);
  assert(isPreferencesV2(version2));
  assert.equal(isPreferences(version2), false);
  assert.deepEqual(migratePreferencesV2(version2), defaultPreferences);
  assert.deepEqual(migratePreferencesV2({ ...version2, density: 'compact', theme: 'dark' }), { ...defaultPreferences, density: 'compact', theme: 'dark' });
});
test('legacy density values migrate without changing the standard appearance', () => {
  assert(isLegacyPreferences({ ...defaultPreferences, density: 'compact' }));
  assert(isLegacyPreferences({ ...defaultPreferences, density: 'comfortable' }));
  assert.equal(isLegacyPreferences({ ...defaultPreferences, density: 'ultra' }), false);
  assert.equal(migratePreferences({ ...defaultPreferences, density: 'compact' }).density, 'standard');
  assert.equal(migratePreferences({ ...defaultPreferences, density: 'comfortable' }).density, 'spacious');
  assert.equal(migratePreferences({ ...defaultPreferences, density: 'spacious' }).density, 'spacious');
  assert.equal(migratePreferences({ ...defaultPreferences, density: 'comfortable' }).pageSize, 20);
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
test('resource tag drafts deduplicate in order and enforce the saved data limits atomically', () => {
  const current = Object.freeze(['发布', 'Token']);
  const result = appendResourceTags(current, ' token, 键盘，键盘, , Safari ');
  assert.deepEqual(result, { tags: ['发布', 'Token', '键盘', 'Safari'] });
  const saved = { ...resource, tags: result.tags };
  assert(isResources([saved]));
  assert.deepEqual(filterResources([saved], 'safari', 'all', 'all'), [saved]);
  const full = Array.from({ length: resourceTagLimits.count }, (_, index) => String(index));
  assert.deepEqual(appendResourceTags(full, '0，  '), { tags: full });
  assert.deepEqual(appendResourceTags(full, 'another'), { error: 'count' });
  const longest = '字'.repeat(resourceTagLimits.length);
  assert.deepEqual(appendResourceTags([], longest), { tags: [longest] });
  assert.deepEqual(appendResourceTags(current, `键盘，${longest}字`), { error: 'length' });
  assert.deepEqual(current, ['发布', 'Token']);
});
test('pagination has one empty page, clamps page counts and rejects ambiguous input', () => {
  assert.equal(pageCount(0, 10), 1); assert.equal(pageCount(8, 5), 2); assert.equal(pageCount(11, 10), 2);
  assert.equal(validatePage('2', 2), 2); assert.equal(validatePage(' 1 ', 2), 1);
  for (const input of ['', '0', '-1', '3', '1.5', '1e1', '+1', 'NaN']) assert.equal(validatePage(input, 2), undefined);
});
test('page links keep first, current and last pages with unambiguous gaps', () => {
  assert.deepEqual(paginationRange(1, 1), [1]);
  assert.deepEqual(paginationRange(6, 24), [1, 'gap', 5, 6, 7, 'gap', 24]);
  assert.deepEqual(paginationRange(24, 24), [1, 'gap', 23, 24]);
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
  assert.deepEqual(parseRoute(''), { page: 'overview', resourceId: undefined, section: undefined });
  assert.deepEqual(parseRoute('#/overview'), { page: 'overview', resourceId: undefined, section: undefined });
  assert.deepEqual(parseRoute('#/platforms'), { page: 'platforms', resourceId: undefined, section: undefined });
  assert.equal(parseRoute('#/resources').page, 'resources');
  assert.deepEqual(parseRoute('#/document/theme-colors/section-2'), { page: 'document', resourceId: 'theme-colors', section: 'section-2' });
  assert.equal(parseRoute('#/settings').page, 'settings');
  assert.equal(parseRoute('#/icons').page, 'icons');
  assert.equal(parseRoute('#/search').page, 'search');
  assert.deepEqual(parseRoute('#/components'), { page: 'components', resourceId: undefined, section: undefined });
  assert.deepEqual(parseRoute('#/catalog'), { page: 'components', resourceId: undefined, section: undefined, catalog: true });
  assert.deepEqual(parseRoute('#/components/button'), { page: 'components', resourceId: undefined, section: undefined, componentId: 'button' });
  assert.deepEqual(parseRoute('#/components/button/doc-api'), { page: 'components', resourceId: undefined, section: undefined, componentId: 'button', componentSection: 'doc-api' });
  assert.deepEqual(parseRoute('#/components/button/unknown'), { page: 'components', resourceId: undefined, section: undefined, componentId: 'button' });
  assert.deepEqual(parseRoute('#/foundations'), { page: 'foundations', resourceId: undefined, section: undefined });
  assert.equal(parseRoute('#/unknown').page, 'overview');
  assert.equal(parseRoute('#/document/%2Fetc/section-x').resourceId, undefined);
  assert.equal(parseRoute('#/document/welcome/section-x').section, undefined);
});
