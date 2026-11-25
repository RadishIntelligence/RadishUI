export type ComponentGroupId = 'actions' | 'fields' | 'selection' | 'feedback' | 'navigation' | 'primitives';
export type ComponentStatus = 'stable' | 'preview';

export interface ComponentEntry {
  id: string;
  name: string;
  group: ComponentGroupId;
  /** 中文摘要；目录、组件页与站点搜索共同消费。 */
  summary: string;
  /** 英文摘要，与 `summary` 同源维护；英文切换下由目录、组件页与搜索展示。 */
  summaryEn: string;
  status: ComponentStatus;
  detail: boolean;
}

export const componentGroups: readonly { id: ComponentGroupId; label: string; labelEn: string }[] = [
  { id: 'actions', label: '操作', labelEn: 'Actions' },
  { id: 'fields', label: '字段', labelEn: 'Fields' },
  { id: 'selection', label: '选择', labelEn: 'Choice' },
  { id: 'feedback', label: '反馈', labelEn: 'Feedback' },
  { id: 'navigation', label: '导航', labelEn: 'Navigation' },
  { id: 'primitives', label: '页面原语', labelEn: 'Page primitives' },
] as const;

/**
 * The component catalog is the single source for navigation and search.
 * `detail` marks entries with a dedicated documentation page; the remaining
 * entries still point at the current single-page reference until they migrate.
 */
export const componentCatalog: readonly ComponentEntry[] = [
  {
    id: 'button', name: 'Button', group: 'actions', status: 'stable', detail: true,
    summary: '主要、次要、幽灵与危险操作；sm / md 两档，loading 保留焦点并拦截重复激活。',
    summaryEn: 'Primary, secondary, ghost, and danger actions; sm / md sizes; loading keeps focus and blocks repeated activation.',
  },
  {
    id: 'icon-button', name: 'IconButton', group: 'actions', status: 'stable', detail: true,
    summary: '纯图标按钮，label 必填；默认 ghost，继承 Button 的尺寸、loading 与焦点。',
    summaryEn: 'Icon-only button with a required label; ghost by default, inheriting Button\'s sizes, loading, and focus behavior.',
  },
  {
    id: 'form-field', name: 'FormField', group: 'fields', status: 'stable', detail: true,
    summary: '字段标签、说明与错误关联；Input / Textarea / Select 自动读取字段上下文。',
    summaryEn: 'Associates field labels, hints, and errors; Input / Textarea / Select read the field context automatically.',
  },
  {
    id: 'form', name: 'Form', group: 'fields', status: 'stable', detail: true,
    summary: '原生 form 语义与提交门禁：noValidate、调用方校验、首个错误字段聚焦；不渲染错误文案。',
    summaryEn: 'Native form semantics and a submission gate: noValidate, caller-owned validation, and focus on the first invalid field; it does not render error text.',
  },
  {
    id: 'input', name: 'Input', group: 'fields', status: 'stable', detail: true,
    summary: '单行文本输入，outline / filled 表面；原生 input 属性与 ref 透传。',
    summaryEn: 'Single-line text input with outline / filled surfaces; native input attributes and ref are passed through.',
  },
  {
    id: 'input-number', name: 'InputNumber', group: 'fields', status: 'stable', detail: true,
    summary: '受控数字输入与步进：min / max / step、方向键与失焦钳制；上下按钮不占 Tab。',
    summaryEn: 'Controlled numeric input and stepping: min / max / step, arrow keys, and clamping on blur; the up and down buttons stay out of the Tab order.',
  },
  {
    id: 'textarea', name: 'Textarea', group: 'fields', status: 'stable', detail: true,
    summary: '多行文本输入，支持只读、禁用与字段错误；保留垂直 resize。',
    summaryEn: 'Multiline text input supporting read-only, disabled, and field errors; vertical resize is preserved.',
  },
  {
    id: 'input-otp', name: 'InputOTP', group: 'fields', status: 'stable', detail: true,
    summary: '六位验证码输入，自动前进、粘贴与逐格错误关联；Enter 回调可接管提交。',
    summaryEn: 'Six-digit verification code input with automatic advance, paste handling, and per-cell error association; an Enter callback can take over submission.',
  },
  {
    id: 'select', name: 'Select', group: 'fields', status: 'stable', detail: true,
    summary: '受控选择器，键盘高亮、碰撞避让与字段关联；chrome 用 sm，表单用 md。',
    summaryEn: 'Controlled select with keyboard highlighting, collision avoidance, and field association; sm for chrome, md for forms.',
  },
  {
    id: 'tag-input', name: 'TagInput', group: 'fields', status: 'stable', detail: true,
    summary: '标签草稿与去重、删除；Enter / 按钮添加，空输入 Backspace 移除末项。',
    summaryEn: 'Tag drafts with deduplication and removal; Enter or the add button commits a draft, and Backspace on an empty input removes the last tag.',
  },
  {
    id: 'upload', name: 'Upload', group: 'fields', status: 'stable', detail: true,
    summary: '文件附件字段：选择或拖入文件，展示名称 / 大小并可移除；类型、大小、数量校验与进度由调用方维护。',
    summaryEn: 'File attachment field: select or drop files, list names / sizes with removal; the caller owns type, size, count validation and progress.',
  },
  {
    id: 'radio-group', name: 'RadioGroup', group: 'selection', status: 'stable', detail: true,
    summary: '少量选项的单选；方向键移动即选中，FormField 内自动关联标签与错误。',
    summaryEn: 'Single choice among a few options; arrow keys move and select, and FormField associates the label and error automatically.',
  },
  {
    id: 'avatar', name: 'Avatar', group: 'selection', status: 'stable', detail: true,
    summary: '首字 / 图片头像，圆形或方形，三档尺寸；纯展示不进入 Tab 顺序。',
    summaryEn: 'Initial- or image-based avatar, circle or square, three sizes; purely presentational and stays out of the Tab order.',
  },
  {
    id: 'tag', name: 'Tag', group: 'selection', status: 'stable', detail: true,
    summary: '中性标签文本；纯展示，状态语义用 StatusBadge 而不是 Tag。',
    summaryEn: 'Neutral tag text; purely presentational, so use StatusBadge rather than Tag for status semantics.',
  },
  {
    id: 'toggle-group', name: 'ToggleGroup', group: 'selection', status: 'stable', detail: true,
    summary: '单选 / 多选的分段切换；单选方向键即选中，多选以 aria-pressed 表达。',
    summaryEn: 'Segmented single- or multi-select toggle; in single mode, arrow keys select, and multi-select expresses state with aria-pressed.',
  },
  {
    id: 'checkbox', name: 'Checkbox', group: 'selection', status: 'stable', detail: true,
    summary: '原生复选框与键盘行为；标签、禁用与焦点由调用方提供。',
    summaryEn: 'Native checkbox and keyboard behavior; the caller provides the label, disabled state, and focus.',
  },
  {
    id: 'switch', name: 'Switch', group: 'selection', status: 'stable', detail: true,
    summary: '即时布尔开关；Space / Enter 切换，标签由调用方显式关联。',
    summaryEn: 'Boolean switch that applies immediately; Space / Enter toggles, and the caller associates the label explicitly.',
  },
  {
    id: 'tabs', name: 'Tabs', group: 'selection', status: 'stable', detail: true,
    summary: 'tab / tabpanel 关联、方向键、选中与焦点；列表在窄屏可换行。',
    summaryEn: 'tab / tabpanel association, arrow keys, selection, and focus; the list can wrap on narrow screens.',
  },
  {
    id: 'status-badge', name: 'StatusBadge', group: 'selection', status: 'stable', detail: true,
    summary: 'neutral / info / success / warning / danger 状态标签；文字与图标由调用方提供。',
    summaryEn: 'neutral / info / success / warning / danger status labels; the caller provides the text and icon.',
  },
  {
    id: 'dialog', name: 'Dialog', group: 'feedback', status: 'stable', detail: true,
    summary: '受控对话框，Escape、焦点约束、初始焦点与关闭回焦。',
    summaryEn: 'Controlled dialog with Escape, focus containment, initial focus, and focus return on close.',
  },
  {
    id: 'confirm-dialog', name: 'ConfirmDialog', group: 'feedback', status: 'stable', detail: true,
    summary: '基于 Dialog 的确认组合；初始焦点取消，loading 时拦截关闭。',
    summaryEn: 'Confirmation built on Dialog; initial focus is on cancel, and loading blocks dismissal.',
  },
  {
    id: 'accordion', name: 'Accordion', group: 'feedback', status: 'stable', detail: true,
    summary: '单选 / 多选折叠面板；标题按钮与内容区域由 Radix 维护。',
    summaryEn: 'Single- or multiple-open accordion; Radix maintains the trigger buttons and content regions.',
  },
  {
    id: 'drawer', name: 'Drawer', group: 'feedback', status: 'stable', detail: true,
    summary: '与 Dialog 同一合同的侧向浮层；适合辅助内容与移动编排。',
    summaryEn: 'Side overlay with the same contract as Dialog; suited to supporting content and mobile layouts.',
  },
  {
    id: 'menu', name: 'Menu', group: 'feedback', status: 'stable', detail: true,
    summary: '触发器具名菜单，支持禁用、危险项、链接与分隔；焦点由行为基础维护。',
    summaryEn: 'Named menu on a trigger, supporting disabled items, danger items, links, and separators; focus is maintained by the behavior foundation.',
  },
  {
    id: 'inline-alert', name: 'InlineAlert', group: 'feedback', status: 'stable', detail: true,
    summary: '持久的上下文提示；danger 用 alert，其余状态用 status 播报。',
    summaryEn: 'Persistent contextual alert; danger is announced with alert, and the other tones with status.',
  },
  {
    id: 'empty', name: 'Empty', group: 'feedback', status: 'stable', detail: true,
    summary: '空结果 / 首次使用提示：图标、标题、说明与操作；行内与居中两种对齐，可填满列表区域。',
    summaryEn: 'Empty-result or first-use state: icon, title, description, and action; start or center alignment, and it can fill the list area.',
  },
  {
    id: 'skeleton', name: 'Skeleton', group: 'feedback', status: 'stable', detail: true,
    summary: '静态占位，aria-hidden；由外层 aria-busy / status 说明加载中。',
    summaryEn: 'Static placeholder with aria-hidden; the surrounding aria-busy / status communicates loading.',
  },
  {
    id: 'toast', name: 'Toast', group: 'feedback', status: 'stable', detail: true,
    summary: '顶部胶囊短时反馈，关闭按钮显示剩余时间；F8 进入、关闭回焦并自动消失。',
    summaryEn: 'Short-lived capsule feedback at the top; the close button shows the remaining time; F8 enters, closing returns focus, and it dismisses automatically.',
  },
  {
    id: 'tooltip', name: 'Tooltip', group: 'feedback', status: 'stable', detail: true,
    summary: '短文字提示，补充可访问名称；不替代 label、字段帮助或必要操作入口。',
    summaryEn: 'Short text hint that supplements an accessible name; it does not replace a label, field help, or a required action entry point.',
  },
  {
    id: 'pagination', name: 'Pagination', group: 'navigation', status: 'stable', detail: true,
    summary: '页码、页大小与跳页；桌面 / 移动尺度随密度，单页渐进披露。',
    summaryEn: 'Page numbers, page size, and jump; desktop / mobile sizing follows density, and single-page states use progressive disclosure.',
  },
  {
    id: 'table-of-contents', name: 'TableOfContents', group: 'navigation', status: 'stable', detail: true,
    summary: '文档目录，当前章节用 aria-current；hrefFor 与 onNavigate 交回页面处理。',
    summaryEn: 'Document outline with aria-current on the current section; hrefFor and onNavigate leave navigation to the page.',
  },
  {
    id: 'card', name: 'Card', group: 'primitives', status: 'stable', detail: true,
    summary: '内容表面：默认、muted 与 app 三种角色；padding 与 asChild 链接卡片。',
    summaryEn: 'Content surface with default, muted, and app roles; padding options and asChild link cards.',
  },
  {
    id: 'section', name: 'Section', group: 'primitives', status: 'stable', detail: true,
    summary: '页面分区：标题、eyebrow、说明与 sm / md 两档。',
    summaryEn: 'Page section: title, eyebrow, description, and sm / md sizes.',
  },
  {
    id: 'description-list', name: 'DescriptionList', group: 'primitives', status: 'stable', detail: true,
    summary: '元数据描述列表：原生 dl 语义、标签 / 值成对；窄栏次要信息排版，值可为状态或标签。',
    summaryEn: 'Metadata description list: native dl semantics with label / value pairs; narrow-column layout for secondary information, where values can be a status or a tag.',
  },
  {
    id: 'table', name: 'Table', group: 'primitives', status: 'stable', detail: true,
    summary: '原生表格：可访问名称与可选吸顶表头。',
    summaryEn: 'Native table with an accessible name and an optional sticky header.',
  },
] as const;

export function findComponent(id: string): ComponentEntry | undefined {
  return componentCatalog.find(component => component.id === id);
}

export function groupLabel(group: ComponentGroupId, locale: 'zh-CN' | 'en' = 'zh-CN'): string {
  const entry = componentGroups.find(item => item.id === group);
  if (!entry) return group;
  return locale === 'en' ? entry.labelEn : entry.label;
}

export function filterComponents(query: string): ComponentEntry[] {
  const search = query.trim().toLocaleLowerCase();
  if (!search) return [...componentCatalog];
  // Search both locales regardless of the current language so an English query finds a
  // Chinese-summary entry and vice versa; the input placeholder promises name, summary,
  // or group, not a locale-limited index.
  return componentCatalog.filter(component => [component.name, component.summary, component.summaryEn,
    groupLabel(component.group), groupLabel(component.group, 'en')]
    .some(value => value.toLocaleLowerCase().includes(search)));
}
