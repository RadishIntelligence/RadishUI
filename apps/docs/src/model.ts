export type Page = 'resources' | 'settings' | 'document';
export type Translate = (chinese: string, english: string) => string;
export interface Preferences {
  theme: 'light' | 'dark' | 'system';
  locale: 'zh-CN' | 'en';
  density: 'compact' | 'comfortable' | 'spacious';
  fontSize: 'small' | 'standard' | 'large';
  hints: boolean;
  showToc: boolean;
  lineHeight: 'standard' | 'relaxed';
  notifications: boolean;
}
export const defaultPreferences: Preferences = {
  theme: 'system', locale: 'zh-CN', density: 'comfortable', fontSize: 'standard',
  hints: true, showToc: true, lineHeight: 'standard', notifications: true,
};
export type ResourceKind = 'document' | 'spec' | 'checklist' | 'example';
export type ResourceStatus = 'ready' | 'draft' | 'readonly';
export interface Resource {
  id: string; name: string; kind: ResourceKind; status: ResourceStatus;
  summary: string; creator: string; updatedAt: string; version: string; tags: string[];
}
export interface Article { title: string; body: string; updatedAt: string }
export type ArticleBlock = { type: 'heading'; level: 2 | 3; text: string; id: string }
  | { type: 'paragraph' | 'callout'; text: string };

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === 'object' && !Array.isArray(value));
const isDate = (value: unknown): value is string => typeof value === 'string' && Number.isFinite(Date.parse(value));
const oneOf = (value: unknown, values: readonly string[]): value is string => typeof value === 'string' && values.includes(value);
export function isPreferences(value: unknown): value is Preferences {
  return isRecord(value) && oneOf(value.theme, ['light', 'dark', 'system'])
    && oneOf(value.locale, ['zh-CN', 'en']) && oneOf(value.density, ['compact', 'comfortable', 'spacious'])
    && oneOf(value.fontSize, ['small', 'standard', 'large']) && oneOf(value.lineHeight, ['standard', 'relaxed'])
    && ['hints', 'showToc', 'notifications'].every(key => typeof value[key] === 'boolean');
}
export function isResource(value: unknown): value is Resource {
  return isRecord(value) && typeof value.id === 'string' && /^[a-zA-Z0-9-]{1,80}$/.test(value.id)
    && typeof value.name === 'string' && value.name.trim().length > 0 && value.name.length <= 120
    && oneOf(value.kind, ['document', 'spec', 'checklist', 'example'])
    && oneOf(value.status, ['ready', 'draft', 'readonly']) && isDate(value.updatedAt)
    && typeof value.summary === 'string' && value.summary.length <= 1000 && typeof value.creator === 'string' && value.creator.length <= 120
    && typeof value.version === 'string' && value.version.length <= 40 && Array.isArray(value.tags) && value.tags.length <= 8
    && value.tags.every(tag => typeof tag === 'string' && tag.length <= 40);
}
export function isResources(value: unknown): value is Resource[] {
  return Array.isArray(value) && value.length <= 500 && value.every(isResource)
    && new Set(value.map(item => item.id)).size === value.length;
}
export function isArticle(value: unknown): value is Article {
  return isRecord(value) && typeof value.title === 'string' && value.title.trim().length > 0 && value.title.length <= 120
    && typeof value.body === 'string' && value.body.length <= 50000 && isDate(value.updatedAt);
}
export function isArticles(value: unknown): value is Record<string, Article> {
  return isRecord(value) && Object.keys(value).length <= 500
    && Object.entries(value).every(([key, article]) => /^[a-zA-Z0-9-]{1,80}$/.test(key) && isArticle(article));
}

export function filterResources(resources: readonly Resource[], query: string, kind: string, status: string): Resource[] {
  const search = query.trim().toLocaleLowerCase();
  return resources.filter(item => (kind === 'all' || item.kind === kind) && (status === 'all' || item.status === status)
    && (!search || `${item.name} ${item.summary} ${item.tags.join(' ')}`.toLocaleLowerCase().includes(search)));
}
export function pageCount(count: number, size: number) { return Math.max(1, Math.ceil(count / Math.max(1, size))); }
export function validatePage(input: string, total: number): number | undefined {
  if (!/^\d+$/.test(input.trim())) return undefined;
  const page = Number(input);
  return Number.isSafeInteger(page) && page >= 1 && page <= total ? page : undefined;
}
export function pageNumbers(page: number, total: number): (number | 'gap')[] {
  const numbers = [...new Set([1, total, page - 1, page, page + 1])].filter(n => n >= 1 && n <= total).sort((a, b) => a - b);
  const result: (number | 'gap')[] = [];
  numbers.forEach((n, i) => { if (i > 0 && n - numbers[i - 1] > 1) result.push('gap'); result.push(n); });
  return result;
}
export function parseArticle(body: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  let paragraph: string[] = [];
  const flush = () => { if (paragraph.length) { blocks.push({ type: 'paragraph', text: paragraph.join('\n') }); paragraph = []; } };
  for (const line of body.replace(/\r\n?/g, '\n').split('\n')) {
    const heading = /^(#{2,3})\s+(.+)$/.exec(line);
    if (heading) { flush(); blocks.push({ type: 'heading', level: heading[1].length as 2 | 3, text: heading[2].trim(), id: `section-${blocks.length}` }); }
    else if (line.startsWith('> ')) { flush(); blocks.push({ type: 'callout', text: line.slice(2) }); }
    else if (line.trim() === '') flush();
    else paragraph.push(line);
  }
  flush();
  return blocks;
}
export function parseRoute(hash: string): { page: Page; resourceId?: string; section?: string } {
  const parts = hash.replace(/^#\/?/, '').split('/');
  const page: Page = parts[0] === 'settings' ? 'settings' : parts[0] === 'document' ? 'document' : 'resources';
  return { page, resourceId: page === 'document' && parts[1] && /^[a-zA-Z0-9-]+$/.test(parts[1]) ? parts[1] : undefined,
    section: page === 'document' && /^section-\d+$/.test(parts[2] ?? '') ? parts[2] : undefined };
}
export function kindLabel(kind: ResourceKind, t: Translate) {
  return { document: t('文档', 'Document'), spec: t('规范', 'Guideline'), checklist: t('清单', 'Checklist'), example: t('范例', 'Example') }[kind];
}
export function statusLabel(status: ResourceStatus, t: Translate) {
  return { ready: t('已就绪', 'Ready'), draft: t('草稿', 'Draft'), readonly: t('只读', 'Read only') }[status];
}
export function formatDate(value: string, locale: Preferences['locale']) {
  return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}
