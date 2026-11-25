import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { changelog, changelogKindLabels } from '../apps/docs/src/changelog.ts';
import { componentCatalog, componentGroups } from '../apps/docs/src/component-catalog.ts';
import { iconReference, iconReferenceGroupLabels } from '../apps/docs/src/icon-reference.ts';

// The site search index is generated from the same sources as the pages it points at.
// `--check` keeps `site-search.generated.ts` in sync in `npm run check`; the page never
// hand-maintains a second list of components, icons, or changelog entries.

const output = new URL('../apps/docs/src/site-search.generated.ts', import.meta.url);

const pageEntries = [
  {
    id: 'page:overview', kind: 'page', group: { zh: '入口', en: 'Entry' },
    title: { zh: '概览', en: 'Overview' },
    description: { zh: '视觉基础、组件与页面范例的入口。', en: 'Entry to foundations, components, and page examples.' },
    href: '#/overview', keywords: ['首页', '工作台', 'home', 'workbench'],
  },
  {
    id: 'page:catalog', kind: 'page', group: { zh: '文档', en: 'Docs' },
    title: { zh: '组件目录', en: 'Component catalog' },
    description: { zh: '34 个组件与页面原语的文档目录，支持名称、说明与分组搜索。', en: 'Documentation catalog for 34 components and page primitives, searchable by name, summary, or group.' },
    href: '#/catalog', keywords: ['组件', '目录', 'components', 'catalog', '文档'],
  },
  {
    id: 'page:components', kind: 'page', group: { zh: '参考', en: 'Reference' },
    title: { zh: '组件用法（单页参考）', en: 'Component reference (single page)' },
    description: { zh: '旧版单页组件参考，保留为过渡入口。', en: 'Legacy single-page component reference kept as a transition entry.' },
    href: '#/components', keywords: ['旧版', '示例', 'legacy', 'examples'],
  },
  {
    id: 'page:foundations', kind: 'page', group: { zh: '设计', en: 'Design' },
    title: { zh: '视觉基础', en: 'Foundations' },
    description: { zh: '语义 token、颜色、排版、间距与动效基础。', en: 'Semantic tokens, color, typography, spacing, and motion.' },
    href: '#/foundations', keywords: ['token', '颜色', '排版', '间距', '动效', 'color', 'typography', 'spacing', 'motion'],
  },
  {
    id: 'page:icons', kind: 'page', group: { zh: '参考', en: 'Reference' },
    title: { zh: '图标参考', en: 'Icon reference' },
    description: { zh: '展示站实际使用的 lucide-react 图标与用途分组。', en: 'lucide-react icons used by the showcase, grouped by role.' },
    href: '#/icons', keywords: ['图标', 'lucide', 'icon', '复制'],
  },
  {
    id: 'page:changelog', kind: 'page', group: { zh: '版本', en: 'Versions' },
    title: { zh: '变更记录', en: 'Changelog' },
    description: { zh: '内部版本、目录状态与按日期倒序的变更记录。', en: 'Internal version, catalog status, and dated changes.' },
    href: '#/changelog', keywords: ['版本', '发布', 'changelog', 'version', 'release'],
  },
  {
    id: 'page:platforms', kind: 'page', group: { zh: '接入', en: 'Adoption' },
    title: { zh: '平台与接入', en: 'Platforms' },
    description: { zh: 'React 与 Flutter 的实现边界、接入状态与发行范围。', en: 'React and Flutter boundaries, adoption status, and release scope.' },
    href: '#/platforms', keywords: ['平台', '接入', 'flutter', 'react', 'adoption'],
  },
  {
    id: 'page:resources', kind: 'page', group: { zh: '演示', en: 'Demo' },
    title: { zh: '资源库', en: 'Resources' },
    description: { zh: '本地资源库的检索、筛选、新建与详情。', en: 'Local resource library search, filters, creation, and details.' },
    href: '#/resources', keywords: ['资源', '搜索', '筛选', 'resources', 'filter'],
  },
  {
    id: 'page:settings', kind: 'page', group: { zh: '演示', en: 'Demo' },
    title: { zh: '偏好设置', en: 'Preferences' },
    description: { zh: '外观、密度、字号、行高与通知偏好。', en: 'Appearance, density, font size, line height, and notification preferences.' },
    href: '#/settings', keywords: ['偏好', '外观', '密度', '主题', 'settings', 'appearance', 'density', 'theme'],
  },
  {
    id: 'page:document', kind: 'page', group: { zh: '演示', en: 'Demo' },
    title: { zh: '文档', en: 'Documents' },
    description: { zh: '文档阅读、章节定位与本地编辑。', en: 'Document reading, section navigation, and local editing.' },
    href: '#/document', keywords: ['文档', '文章', '编辑', 'document', 'article', 'edit'],
  },
];

const componentGroupLabels = new Map(componentGroups.map(group => [group.id, { zh: group.label, en: group.labelEn }]));

// Component summaries are behavior prose; add a small explicit set of common Chinese aliases
// so searching「按钮」「表单」also finds the English-named components.
const componentAliases = {
  button: ['按钮'], 'icon-button': ['图标按钮'], form: ['表单', '校验'], 'form-field': ['表单字段', '字段'],
  input: ['输入框', '文本输入'], textarea: ['文本域', '多行输入'], 'input-otp': ['验证码', '一次性密码'],
  select: ['选择器', '下拉'], 'tag-input': ['标签输入'], 'radio-group': ['单选'], checkbox: ['复选框', '多选'],
  switch: ['开关'], tabs: ['标签页'], 'toggle-group': ['分段', '切换组'], dialog: ['对话框', '模态'],
  'confirm-dialog': ['确认对话框'], drawer: ['抽屉'], menu: ['菜单', '下拉菜单'], 'inline-alert': ['提示', '警告'],
  skeleton: ['骨架屏'], toast: ['通知', '提示'], tooltip: ['工具提示'], pagination: ['分页'],
  'table-of-contents': ['页面目录', '目录'], card: ['卡片'], section: ['区块', '分区'],
  'description-list': ['描述列表', '属性列表'], table: ['表格'], avatar: ['头像'], tag: ['标签'],
  'status-badge': ['状态', '徽标'],
};

export function buildSearchEntries() {
  const components = componentCatalog.map(component => {
    const group = componentGroupLabels.get(component.group) ?? { zh: component.group, en: component.group };
    return {
      id: `component:${component.id}`,
      kind: 'component',
      group,
      title: { zh: component.name, en: component.name },
      description: { zh: component.summary, en: component.summaryEn },
      href: component.detail ? `#/components/${component.id}` : '#/components',
      keywords: [component.id, group.zh, group.en, '组件', 'component', ...(componentAliases[component.id] ?? [])],
    };
  });
  const icons = iconReference.map(icon => {
    const group = iconReferenceGroupLabels[icon.group];
    return {
      id: `icon:${icon.name}`,
      kind: 'icon',
      group,
      title: { zh: icon.name, en: icon.name },
      description: { zh: icon.zh, en: icon.en },
      href: '#/icons',
      keywords: [icon.name, group.zh, group.en, '图标', 'icon', 'lucide'],
    };
  });
  const changelogEntries = changelog.map(entry => {
    const group = changelogKindLabels[entry.kind];
    const details = entry.items.map(item => ({ zh: item.zh, en: item.en }));
    return {
      id: `changelog:${entry.date}`,
      kind: 'changelog',
      group,
      title: entry.title,
      description: { zh: `${entry.date} · ${entry.items.length} 项变更`, en: `${entry.date} · ${entry.items.length} updates` },
      href: '#/changelog',
      keywords: [entry.date, group.zh, group.en, ...details.flatMap(detail => [detail.zh, detail.en])],
      details,
    };
  });
  return [...pageEntries, ...components, ...icons, ...changelogEntries];
}

export function buildGeneratedSearch() {
  const rows = buildSearchEntries().map(entry => `  ${JSON.stringify(entry)},`).join('\n');
  return `// Generated by scripts/generate-search.mjs from component-catalog, icon-reference, changelog,
// and the page list in the generator. Do not edit by hand; run npm run search:generate.
import type { SiteSearchEntry } from './site-search';

export const siteSearchEntries: readonly SiteSearchEntry[] = [
${rows}
];
`;
}

function main() {
  const generated = buildGeneratedSearch();
  if (process.argv.includes('--check')) {
    let current;
    try { current = readFileSync(output, 'utf8'); }
    catch { throw new Error('site-search.generated.ts 缺失，请执行 npm run search:generate。'); }
    if (current !== generated) throw new Error('站点搜索索引与来源不一致，请执行 npm run search:generate。');
    console.log(`Site search index matches sources (${buildSearchEntries().length} entries).`);
  } else {
    writeFileSync(output, generated);
    console.log(`Generated site search index (${buildSearchEntries().length} entries).`);
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
