export type SiteSearchKind = 'page' | 'component' | 'icon' | 'changelog';

export interface SiteSearchText {
  zh: string;
  en: string;
}

export interface SiteSearchEntry {
  /** 稳定 id，供断言与结果 key 使用。 */
  id: string;
  kind: SiteSearchKind;
  /** 结果的作用域，例如组件分组、图标用途或变更类型。 */
  group: SiteSearchText;
  title: SiteSearchText;
  description: SiteSearchText;
  href: string;
  /** 参与匹配但不直接展示的别名、用途和正文。 */
  keywords: readonly string[];
  /** 可选的正文条目，命中时优先展示，例如变更记录的一条说明。 */
  details?: readonly SiteSearchText[];
}

export const siteSearchKindOrder: readonly SiteSearchKind[] = ['page', 'component', 'icon', 'changelog'];

export const siteSearchKindLabels: Record<SiteSearchKind, SiteSearchText> = {
  page: { zh: '页面', en: 'Pages' },
  component: { zh: '组件', en: 'Components' },
  icon: { zh: '图标', en: 'Icons' },
  changelog: { zh: '变更记录', en: 'Changelog' },
};

function normalize(value: string) {
  return value.toLocaleLowerCase();
}

function queryTerms(query: string) {
  return normalize(query).trim().split(/\s+/).filter(Boolean);
}

function matchesWholeTerm(value: string, term: string) {
  // Latin terms match whole words so「arrow」does not hit「narrow」; CJK has no word
  // boundaries, so it keeps substring matching.
  if (!/^[\x00-\x7F]+$/.test(term)) return value.includes(term);
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z0-9])${escaped}(?=[^a-z0-9]|$)`, 'i').test(value);
}

function entryText(entry: SiteSearchEntry) {
  return [entry.title.zh, entry.title.en, entry.description.zh, entry.description.en,
    entry.group.zh, entry.group.en, ...entry.keywords,
    ...(entry.details?.flatMap(detail => [detail.zh, detail.en]) ?? [])].map(normalize);
}

function scoreEntry(entry: SiteSearchEntry, terms: readonly string[]) {
  const titles = [normalize(entry.title.zh), normalize(entry.title.en)];
  const text = entryText(entry);
  let score = 0;
  for (const term of terms) {
    if (titles.some(title => title === term)) score += 100;
    else if (titles.some(title => title.startsWith(term))) score += 70;
    else if (titles.some(title => title.includes(term))) score += 50;
    else if (text.some(value => matchesWholeTerm(value, term))) score += 20;
    else return -1;
  }
  return score;
}

function compareEntries(left: SiteSearchEntry, right: SiteSearchEntry) {
  const kind = siteSearchKindOrder.indexOf(left.kind) - siteSearchKindOrder.indexOf(right.kind);
  return kind || left.title.zh.localeCompare(right.title.zh, 'zh-CN');
}

/**
 * 按空格拆分查询词，全部命中才返回；标题优先于描述、分组与正文。
 * 空查询返回完整索引（生成物已按页面 / 组件 / 图标 / 变更记录分组）。
 */
export function searchSite(entries: readonly SiteSearchEntry[], query: string): SiteSearchEntry[] {
  const terms = queryTerms(query);
  if (!terms.length) return [...entries];
  return entries
    .map(entry => ({ entry, score: scoreEntry(entry, terms) }))
    .filter(result => result.score >= 0)
    .sort((left, right) => right.score - left.score || compareEntries(left.entry, right.entry))
    .map(result => result.entry);
}

/** 命中查询词的第一条正文，用于变更记录等长条目结果的上下文。 */
export function searchMatchDetail(entry: SiteSearchEntry, query: string): SiteSearchText | undefined {
  const terms = queryTerms(query);
  if (!terms.length || !entry.details) return undefined;
  return entry.details.find(detail => terms.every(term => matchesWholeTerm(normalize(`${detail.zh} ${detail.en}`), term)));
}
