import type { Resource } from './model';

export const initialResources: Resource[] = [
  { id: 'release-notes', name: 'Release notes · v0.3', kind: 'document', status: 'ready', summary: '本轮 token、组件与页面范例的变更、兼容范围与验证记录。', creator: '林杏', updatedAt: '2026-11-05T09:20:00+08:00', version: 'v0.3', tags: ['发布', '变更'] },
  { id: 'theme-colors', name: '主题与配色', kind: 'spec', status: 'ready', summary: '语义颜色、明暗映射与使用边界；品牌色只承担识别，操作色只承担操作。', creator: '周远', updatedAt: '2026-11-04T15:10:00+08:00', version: 'v0.4', tags: ['视觉基础', 'token'] },
  { id: 'control-states', name: '控件状态检查表', kind: 'checklist', status: 'draft', summary: '逐项检查默认、悬停、焦点、加载、错误、只读与不可用状态。', creator: '陈默', updatedAt: '2026-11-04T11:30:00+08:00', version: 'v0.2', tags: ['交互', '状态'] },
  { id: 'spacing-scale', name: 'Spacing scale', kind: 'spec', status: 'draft', summary: '4px 基础网格、容器与控件内边距，以及页面组合的间距约定。', creator: '周远', updatedAt: '2026-11-03T17:40:00+08:00', version: 'v0.2', tags: ['布局', '密度'] },
  { id: 'button-guidelines', name: 'Button 使用规范', kind: 'document', status: 'ready', summary: '主次操作、尺寸、图标、加载与禁用状态的选择和组合。', creator: '林杏', updatedAt: '2026-11-03T10:15:00+08:00', version: 'v1.1', tags: ['组件', '操作'] },
  { id: 'accessibility-baseline', name: 'Accessibility baseline', kind: 'checklist', status: 'ready', summary: '键盘、焦点、对比度、缩放与非颜色表达的最低检查项。', creator: '陈默', updatedAt: '2026-11-02T16:00:00+08:00', version: 'v1.0', tags: ['键盘', '对比度'] },
  { id: 'typography', name: '中文与 English 排版', kind: 'document', status: 'ready', summary: '检查中英文、长名称、代码和数值在真实内容中的排版。', creator: '林杏', updatedAt: '2026-11-01T10:00:00+08:00', version: 'v0.2', tags: ['排版'] },
  { id: 'motion', name: 'Motion & feedback', kind: 'spec', status: 'draft', summary: '时长、缓动与反馈的出现边界；状态变化应清楚但不打断阅读。', creator: '周远', updatedAt: '2026-10-31T14:20:00+08:00', version: 'v0.1', tags: ['动效', '反馈'] },
  { id: 'mobile-navigation', name: 'Mobile navigation', kind: 'document', status: 'ready', summary: '移动底栏、底部弹层与安全区的组合规则和触控命中范围。', creator: '林杏', updatedAt: '2026-10-30T11:05:00+08:00', version: 'v0.2', tags: ['移动', '导航'] },
  { id: 'migration-log', name: '版本迁移记录', kind: 'document', status: 'ready', summary: '记录每一轮调整的范围、影响、验证与回滚方式。', creator: '林杏', updatedAt: '2026-10-29T10:00:00+08:00', version: 'v0.1', tags: ['版本'] },
  { id: 'settings-example', name: '外观与偏好示例', kind: 'example', status: 'ready', summary: '外观、阅读与通知偏好的组合示例。', creator: '林杏', updatedAt: '2026-10-28T16:30:00+08:00', version: 'v0.1', tags: ['范例'] },
  { id: 'readonly-note', name: '只读资源说明', kind: 'document', status: 'readonly', summary: '这份合成资源用于检查只读展示：可以阅读和定位章节，编辑入口不可用。', creator: '林杏', updatedAt: '2026-10-28T10:00:00+08:00', version: 'v1.0', tags: ['只读'] },
];
