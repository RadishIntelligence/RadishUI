export type ComponentGroupId = 'actions' | 'fields' | 'selection' | 'feedback' | 'navigation' | 'primitives';
export type ComponentStatus = 'stable' | 'preview';

export interface ComponentEntry {
  id: string;
  name: string;
  group: ComponentGroupId;
  summary: string;
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
  { id: 'button', name: 'Button', group: 'actions', status: 'stable', detail: true, summary: '主要、次要、幽灵与危险操作；sm / md 两档，loading 保留焦点并拦截重复激活。' },
  { id: 'icon-button', name: 'IconButton', group: 'actions', status: 'stable', detail: true, summary: '纯图标按钮，label 必填；默认 ghost，继承 Button 的尺寸、loading 与焦点。' },
  { id: 'form-field', name: 'FormField', group: 'fields', status: 'stable', detail: true, summary: '字段标签、说明与错误关联；Input / Textarea / Select 自动读取字段上下文。' },
  { id: 'form', name: 'Form', group: 'fields', status: 'stable', detail: true, summary: '原生 form 语义与提交门禁：noValidate、调用方校验、首个错误字段聚焦；不渲染错误文案。' },
  { id: 'input', name: 'Input', group: 'fields', status: 'stable', detail: true, summary: '单行文本输入，outline / filled 表面；原生 input 属性与 ref 透传。' },
  { id: 'input-number', name: 'InputNumber', group: 'fields', status: 'stable', detail: true, summary: '受控数字输入与步进：min / max / step、方向键与失焦钳制；上下按钮不占 Tab。' },
  { id: 'textarea', name: 'Textarea', group: 'fields', status: 'stable', detail: true, summary: '多行文本输入，支持只读、禁用与字段错误；保留垂直 resize。' },
  { id: 'input-otp', name: 'InputOTP', group: 'fields', status: 'stable', detail: true, summary: '六位验证码输入，自动前进、粘贴与逐格错误关联；Enter 回调可接管提交。' },
  { id: 'select', name: 'Select', group: 'fields', status: 'stable', detail: true, summary: '受控选择器，键盘高亮、碰撞避让与字段关联；chrome 用 sm，表单用 md。' },
  { id: 'tag-input', name: 'TagInput', group: 'fields', status: 'stable', detail: true, summary: '标签草稿与去重、删除；Enter / 按钮添加，空输入 Backspace 移除末项。' },
  { id: 'radio-group', name: 'RadioGroup', group: 'selection', status: 'stable', detail: true, summary: '少量选项的单选；方向键移动即选中，FormField 内自动关联标签与错误。' },
  { id: 'avatar', name: 'Avatar', group: 'selection', status: 'stable', detail: true, summary: '首字 / 图片头像，圆形或方形，三档尺寸；纯展示不进入 Tab 顺序。' },
  { id: 'tag', name: 'Tag', group: 'selection', status: 'stable', detail: true, summary: '中性标签文本；纯展示，状态语义用 StatusBadge 而不是 Tag。' },
  { id: 'toggle-group', name: 'ToggleGroup', group: 'selection', status: 'stable', detail: true, summary: '单选 / 多选的分段切换；单选方向键即选中，多选以 aria-pressed 表达。' },
  { id: 'checkbox', name: 'Checkbox', group: 'selection', status: 'stable', detail: true, summary: '原生复选框与键盘行为；标签、禁用与焦点由调用方提供。' },
  { id: 'switch', name: 'Switch', group: 'selection', status: 'stable', detail: true, summary: '即时布尔开关；Space / Enter 切换，标签由调用方显式关联。' },
  { id: 'tabs', name: 'Tabs', group: 'selection', status: 'stable', detail: true, summary: 'tab / tabpanel 关联、方向键、选中与焦点；列表在窄屏可换行。' },
  { id: 'status-badge', name: 'StatusBadge', group: 'selection', status: 'stable', detail: true, summary: 'neutral / info / success / warning / danger 状态标签；文字与图标由调用方提供。' },
  { id: 'dialog', name: 'Dialog', group: 'feedback', status: 'stable', detail: true, summary: '受控对话框，Escape、焦点约束、初始焦点与关闭回焦。' },
  { id: 'confirm-dialog', name: 'ConfirmDialog', group: 'feedback', status: 'stable', detail: true, summary: '基于 Dialog 的确认组合；初始焦点取消，loading 时拦截关闭。' },
  { id: 'accordion', name: 'Accordion', group: 'feedback', status: 'stable', detail: true, summary: '单选 / 多选折叠面板；标题按钮与内容区域由 Radix 维护。' },
  { id: 'drawer', name: 'Drawer', group: 'feedback', status: 'stable', detail: true, summary: '与 Dialog 同一合同的侧向浮层；适合辅助内容与移动编排。' },
  { id: 'menu', name: 'Menu', group: 'feedback', status: 'stable', detail: true, summary: '触发器具名菜单，支持禁用、危险项、链接与分隔；焦点由行为基础维护。' },
  { id: 'inline-alert', name: 'InlineAlert', group: 'feedback', status: 'stable', detail: true, summary: '持久的上下文提示；danger 用 alert，其余状态用 status 播报。' },
  { id: 'skeleton', name: 'Skeleton', group: 'feedback', status: 'stable', detail: true, summary: '静态占位，aria-hidden；由外层 aria-busy / status 说明加载中。' },
  { id: 'toast', name: 'Toast', group: 'feedback', status: 'stable', detail: true, summary: '顶部胶囊短时反馈，关闭按钮显示剩余时间；F8 进入、关闭回焦并自动消失。' },
  { id: 'tooltip', name: 'Tooltip', group: 'feedback', status: 'stable', detail: true, summary: '短文字提示，补充可访问名称；不替代 label、字段帮助或必要操作入口。' },
  { id: 'pagination', name: 'Pagination', group: 'navigation', status: 'stable', detail: true, summary: '页码、页大小与跳页；桌面 / 移动尺度随密度，单页渐进披露。' },
  { id: 'table-of-contents', name: 'TableOfContents', group: 'navigation', status: 'stable', detail: true, summary: '文档目录，当前章节用 aria-current；hrefFor 与 onNavigate 交回页面处理。' },
  { id: 'card', name: 'Card', group: 'primitives', status: 'stable', detail: true, summary: '内容表面：默认、muted 与 app 三种角色；padding 与 asChild 链接卡片。' },
  { id: 'section', name: 'Section', group: 'primitives', status: 'stable', detail: true, summary: '页面分区：标题、eyebrow、说明与 sm / md 两档。' },
  { id: 'description-list', name: 'DescriptionList', group: 'primitives', status: 'stable', detail: true, summary: '元数据描述列表：原生 dl 语义、标签 / 值成对；窄栏次要信息排版，值可为状态或标签。' },
  { id: 'table', name: 'Table', group: 'primitives', status: 'stable', detail: true, summary: '原生表格：可访问名称与可选吸顶表头。' },
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
  return componentCatalog.filter(component => [component.name, component.summary, groupLabel(component.group), groupLabel(component.group, 'en')]
    .some(value => value.toLocaleLowerCase().includes(search)));
}
