import type { Resource } from './model';

export const initialResources: Resource[] = [
  { id: 'release-notes', name: '发布说明模板', kind: 'document', status: 'ready', summary: '记录版本变化、兼容说明与升级步骤，让每次交付都有清晰的上下文。', creator: '林杏', updatedAt: '2026-11-04T02:24:00+08:00', version: 'v1.2', tags: ['发布', '团队规范'] },
  { id: 'theme-colors', name: '主题与配色', kind: 'spec', status: 'ready', summary: '用语义颜色组织明暗主题，让状态、内容和操作各有自己的位置。', creator: '林杏', updatedAt: '2026-11-04T09:42:00+08:00', version: 'v0.2', tags: ['视觉基础'] },
  { id: 'control-states', name: '控件状态检查表', kind: 'checklist', status: 'draft', summary: '逐项检查默认、焦点、加载、错误与不可用状态。', creator: '林杏', updatedAt: '2026-11-03T16:30:00+08:00', version: 'v0.1', tags: ['交互'] },
  { id: 'settings-example', name: '设置页面示例', kind: 'example', status: 'ready', summary: '外观、阅读与通知偏好的组合示例。', creator: '林杏', updatedAt: '2026-11-03T11:05:00+08:00', version: 'v0.1', tags: ['范例'] },
  { id: 'adoption-checklist', name: '接入检查清单', kind: 'checklist', status: 'draft', summary: '在有限范围内确认组件、主题、状态与退出方式。', creator: '林杏', updatedAt: '2026-11-02T10:00:00+08:00', version: 'v0.1', tags: ['接入'] },
  { id: 'typography', name: '中文与 English 排版样例', kind: 'document', status: 'ready', summary: '检查中英文、长名称、代码和数值在真实内容中的排版。', creator: '林杏', updatedAt: '2026-11-01T10:00:00+08:00', version: 'v0.2', tags: ['排版'] },
  { id: 'migration-log', name: '版本迁移记录', kind: 'document', status: 'ready', summary: '记录每一轮调整的范围、影响与验证。', creator: '林杏', updatedAt: '2026-10-29T10:00:00+08:00', version: 'v0.1', tags: ['版本'] },
  { id: 'readonly-note', name: '只读资源说明', kind: 'document', status: 'readonly', summary: '这份合成资源用于检查只读展示：可以阅读和定位章节，编辑入口不可用。', creator: '林杏', updatedAt: '2026-10-28T10:00:00+08:00', version: 'v1.0', tags: ['只读'] },
];
