import { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight, Boxes, History, PanelsTopLeft, Search, Shapes } from 'lucide-react';
import { Input } from '@radish-ui/react';
import type { Locale, Translate } from './model';
import { PageHeader } from './PageHeader';
import { searchMatchDetail, searchSite, siteSearchKindLabels, siteSearchKindOrder, type SiteSearchKind } from './site-search';
import { siteSearchEntries } from './site-search.generated';
import './search.css';

const summaryTargets: Record<SiteSearchKind, { href: string; Icon: LucideIcon }> = {
  page: { href: '#/overview', Icon: PanelsTopLeft },
  component: { href: '#/catalog', Icon: Boxes },
  icon: { href: '#/icons', Icon: Shapes },
  changelog: { href: '#/changelog', Icon: History },
};

const counts = Object.fromEntries(siteSearchKindOrder.map(kind => [kind, siteSearchEntries.filter(entry => entry.kind === kind).length])) as Record<SiteSearchKind, number>;

export function SearchPage({ t, locale }: { t: Translate; locale: Locale }) {
  const [query, setQuery] = useState('');
  const trimmed = query.trim();
  const results = useMemo(() => searchSite(siteSearchEntries, query, locale), [query, locale]);
  const groups = siteSearchKindOrder
    .map(kind => ({ kind, entries: results.filter(entry => entry.kind === kind) }))
    .filter(group => group.entries.length > 0);

  return <section className="search-page">
    <PageHeader title={t('搜索', 'Search')} back={{ href: '#/overview', label: t('概览', 'Overview') }} />
    <p className="search-intro">{t('搜索展示站的页面、组件、图标与变更记录；本地资源、文档正文与示例代码不进入索引。',
      'Search pages, components, icons, and changelog entries. Local resources, document bodies, and example code are not indexed.')}</p>
    <div className="search-toolbar" role="search" aria-label={t('站点搜索', 'Site search')}>
      <label className="search-field" htmlFor="site-search">
        <span className="sr-only">{t('搜索站点', 'Search the site')}</span>
        <Search size={18} aria-hidden="true" />
        <Input id="site-search" type="search" value={query} autoComplete="off"
          placeholder={t('输入名称、用途或关键词…', 'Search by name, role, or keyword…')}
          aria-controls="site-search-results"
          onChange={event => setQuery(event.target.value)} />
      </label>
      <span className="search-count" role="status">
        {trimmed ? t(`${results.length} 个结果`, `${results.length} results`) : t(`共 ${siteSearchEntries.length} 个条目`, `${siteSearchEntries.length} entries`)}
      </span>
    </div>
    <div className="search-results" id="site-search-results">
      {!trimmed ? <div className="search-summary">
        {siteSearchKindOrder.map(kind => {
          const { href, Icon } = summaryTargets[kind];
          const label = siteSearchKindLabels[kind];
          return <a className="search-summary-card" href={href} key={kind}>
            <Icon size={20} aria-hidden="true" />
            <span><strong>{t(label.zh, label.en)}</strong><span>{t(`${counts[kind]} 个条目`, `${counts[kind]} entries`)}</span></span>
          </a>;
        })}
      </div> : groups.length === 0 ? <p className="search-empty" role="status">{t('没有匹配的条目。', 'No entries match.')}</p> : <div className="search-groups">
        {groups.map(({ kind, entries }) => {
          const label = siteSearchKindLabels[kind];
          return <section className="search-group" key={kind} aria-labelledby={`search-kind-${kind}`}>
            <h2 id={`search-kind-${kind}`}>{t(label.zh, label.en)}<span>{entries.length}</span></h2>
            <ul className="search-list">
              {entries.map(entry => {
                const detail = searchMatchDetail(entry, query, locale);
                const description = detail ?? entry.description;
                return <li key={entry.id}>
                  <a className="search-result" href={entry.href}>
                    <span className="search-result-body">
                      <strong>{t(entry.title.zh, entry.title.en)}</strong>
                      <span className="search-result-desc">{t(description.zh, description.en)}</span>
                    </span>
                    <span className="search-result-meta">{t(entry.group.zh, entry.group.en)}</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </li>;
              })}
            </ul>
          </section>;
        })}
      </div>}
    </div>
  </section>;
}
