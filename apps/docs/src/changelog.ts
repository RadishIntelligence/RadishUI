export type ChangelogKind = 'components' | 'site' | 'engineering' | 'verification';

/** 变更类型的显示文案；变更记录页与站点搜索共用同一来源。 */
export const changelogKindLabels: Record<ChangelogKind, { zh: string; en: string }> = {
  components: { zh: '共享组件', en: 'Shared components' },
  site: { zh: '展示站', en: 'Showcase' },
  engineering: { zh: '工程与发布', en: 'Engineering' },
  verification: { zh: '验证', en: 'Verification' },
};

export interface ChangelogItem {
  zh: string;
  en: string;
  /** 站内深链；由 `test:workbench` 校验目标存在。 */
  href?: string;
}

export interface ChangelogEntry {
  /** ISO 日期；条目按日期倒序。 */
  date: string;
  kind: ChangelogKind;
  title: { zh: string; en: string };
  items: readonly ChangelogItem[];
}

/** 展示站显示的内部版本；与根 package.json 的 version 一致，由 `test:workbench` 校验。 */
export const siteVersion = '26.11.1';

/**
 * 组件站与共享组件的内部变更记录。正式版本、Git tag 与 Release 在 P4 发行任务中另行创建；
 * 本文件只记录已进入展示站或共享包的变更，条目来源是 docs/devlogs/，不代替版本策略。
 */
export const changelog: readonly ChangelogEntry[] = [
  {
    date: '2026-11-24',
    kind: 'site',
    title: { zh: '站点搜索、InputNumber 与验收收口', en: 'Site search, InputNumber, and acceptance audit' },
    items: [
      { zh: '新增 #/search 站点搜索：索引页面、组件、图标与变更记录，侧栏与窄屏页头提供入口。', en: 'Added #/search site search, indexing pages, components, icons, and changelog entries, with entries in the sidebar and the narrow-screen header.', href: '#/search' },
      { zh: '组件站 1.0 验收收口审计通过：32 个组件页 × 1440 / 390 × 明暗共 128 次加载，未发现产品级差距。', en: 'Completed the component site 1.0 acceptance audit: 32 component pages at 1440 / 390 in light and dark, 128 page loads, with no product-level gaps.' },
      { zh: '新增共享 InputNumber：受控数值、min / max / step、方向键与失焦钳制；设置页每页条数成为首个真实承载。', en: 'Added shared InputNumber with controlled values, min / max / step, arrow-key stepping, and blur clamping; resource page size is its first real use.', href: '#/components/input-number' },
      { zh: '设置页新增资源库每页条数（5–50），偏好存储升级到 v3 并迁移旧数据；资源库分页消费该值。', en: 'Settings gained a resource page size (5–50); preference storage moved to v3 with migration, and resource pagination consumes the value.', href: '#/settings' },
      { zh: '新增共享 Empty：图标 / 标题 / 说明 / 操作与 start / center、fill 两种空态编排；目录与资源空态已采用。', en: 'Added shared Empty with icon, title, description, action, start / center alignment, and fill; the catalog and resource empty states now use it.', href: '#/components/empty' },
      { zh: '交互断言扩至 29 项，固化全量组件页结构、390 溢出、暗色代表页、站点搜索、数字输入与空态采用检查。', en: 'Interaction assertions grew to 29, covering the full component page structure, 390 overflow, representative dark pages, site search, numeric input, and empty-state adoption.' },
    ],
  },
  {
    date: '2026-11-23',
    kind: 'components',
    title: { zh: '描述列表与组件页目录', en: 'Description list and component page outline' },
    items: [
      { zh: '新增页面原语 DescriptionList（原生 dl 语义、行式窄栏排版），资源详情、文档属性与版本弹窗已采用。', en: 'Added the DescriptionList page primitive (native dl semantics, single-column metadata rows); resource details, document properties, and the version dialog now use it.', href: '#/components/description-list' },
      { zh: '组件页统一 1184 内容宽；≥1100px 右侧目录、窄屏抽屉与章节深链（本条目即指向 API 深链）。', en: 'Component pages share a 1184px content width, with a right-side outline at ≥1100px, a drawer on narrow screens, and section deep links (this item links to an API section).', href: '#/components/description-list/doc-api' },
      { zh: 'Safari 27 与 Firefox 159 定向复验通过：1440 明暗 / 1024 / 390 明暗，布局、目录、深链与表单校验正常。', en: 'Safari 27 and Firefox 159 directed verification passed at 1440 light/dark, 1024, and 390 light/dark, covering layout, outline, deep links, and form validation.' },
      { zh: '完成家族真实用量审计（只读），按证据确认目录扩展下一项。', en: 'Completed a read-only family usage audit and confirmed the next catalog extension by evidence.' },
    ],
  },
  {
    date: '2026-11-22',
    kind: 'components',
    title: { zh: '表单编排、抽屉底部方位与交互断言', en: 'Form orchestration, bottom drawer, and interaction assertions' },
    items: [
      { zh: '新增共享 Form：noValidate 提交、调用方校验、首个错误字段聚焦；资源新建与文档编辑已采用。', en: 'Added shared Form: noValidate submission, caller-owned validation, and first-error focus; used by resource creation and document editing.', href: '#/components/form' },
      { zh: 'Drawer 增加 side="bottom" 方位，工作台窄屏资源详情改用底部编排，不新增第二套浮层。', en: 'Drawer gained side="bottom"; narrow resource details use the bottom sheet instead of a page-level overlay.', href: '#/components/drawer' },
      { zh: '代码高亮改为构建期生成（Shiki），不进入浏览器包。', en: 'Code highlighting is generated at build time with Shiki and stays out of the browser bundle.' },
      { zh: 'Playwright 交互断言入仓并进入 CI，覆盖键盘、焦点、ARIA、强制颜色与页面冒烟。', en: 'Playwright interaction assertions are in the repository and CI, covering keyboard, focus, ARIA, forced colors, and page smoke.' },
    ],
  },
  {
    date: '2026-11-21',
    kind: 'site',
    title: { zh: 'API 契约与用法深度', en: 'API contract and usage depth' },
    items: [
      { zh: 'API 表与 llms.txt 改由源码 props 类型、JSDoc 与解构默认值生成，漂移由 check 拦截。', en: 'API tables and llms.txt are generated from source prop types, JSDoc, and destructured defaults, with drift blocked by check.' },
      { zh: '逐组件行为归属与可访问性声明（键盘 / 焦点 / ARIA / 已知限制）进入组件页与 llms.txt。', en: 'Per-component behavior attribution and accessibility declarations (keyboard, focus, ARIA, limitations) feed the component pages and llms.txt.', href: '#/components/button' },
      { zh: '示例深度覆盖六组，共 106 个示例；每个示例支持主题与密度预览。', en: 'Example depth covers six groups with 106 examples; each example previews theme and density.' },
    ],
  },
  {
    date: '2026-11-19',
    kind: 'site',
    title: { zh: '组件目录与独立文档页', en: 'Component catalog and dedicated pages' },
    items: [
      { zh: '目录页提供搜索、分组、状态与深链。', en: 'The catalog provides search, grouping, status, and deep links.', href: '#/catalog' },
      { zh: '30 个条目（27 个组件与 Card / Section / Table 页面原语）全部迁入独立页。', en: 'All 30 entries (27 components plus the Card / Section / Table page primitives) moved to dedicated pages.', href: '#/components/card' },
      { zh: '完成 P0 用法复审，修正 Select 与 Tabs 示例代码和预览不一致。', en: 'Completed the P0 usage review and fixed Select / Tabs snippets that disagreed with their previews.' },
    ],
  },
  {
    date: '2026-11-17',
    kind: 'site',
    title: { zh: '组件站 1.0 启动', en: 'Component site 1.0 started' },
    items: [
      { zh: '所有者确认下一阶段为组件站 1.0：先做文档 / API / 用法深度，再扩目录。', en: 'The owner confirmed component site 1.0: deepen documentation, API, and usage before expanding the catalog.' },
      { zh: '首批独立页 Button / Select / Tabs 上线，旧单页参考保留为过渡入口。', en: 'The first dedicated pages for Button, Select, and Tabs shipped; the legacy single-page reference stays as a transition entry.', href: '#/components/select' },
      { zh: '完成家族组件需求盘点（只读）；P2 外部采用与 P3 Flutter 暂缓。', en: 'Completed a read-only family component demand inventory; external adoption (P2) and Flutter (P3) stay paused.' },
    ],
  },
];
