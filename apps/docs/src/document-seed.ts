import type { Article, Resource } from './model';

export const welcomeArticle: Article = {
  title: '让界面回到内容本身', updatedAt: '2026-11-04T10:24:00+08:00',
  body: '一个清晰的工作面，让名称、状态和下一步动作自然形成层级。温和的形态，应该帮助内容被看见。\n\n> 先给内容留出位置，再用少量的色彩与形态强调重要操作。\n\n## 先确认主任务\n\n列表负责扫描与选择，详情解释当前对象。只在任务需要时展开辅助信息，让彼此相关的内容靠近，避免用重复的外框打断阅读。\n\n## 让状态说清楚\n\n已保存、草稿和只读各有自己的含义。颜色帮助识别，文字说明结果；提交失败时保留输入，并给出可以继续的下一步。\n\n## 保持阅读节奏\n\n中文与 English 自然并排。文档内容随可用空间编排，让更长的名称换行后仍能保留清楚的层级。代码、链接与引用也沿用同一套节奏。',
};

export function articleForResource(resource: Resource): Article {
  return { title: resource.name, updatedAt: resource.updatedAt, body: `${resource.summary}\n\n## 使用范围\n\n${resource.summary}\n\n## 检查与记录\n\n记录实际变化、适用范围与检查结果，让后续阅读者可以理解这份资源。\n\n## 下一步\n\n${resource.status === 'readonly' ? '这份资源仅供阅读。' : '可以编辑本文，并将修改保存在当前浏览器中。'}` };
}
