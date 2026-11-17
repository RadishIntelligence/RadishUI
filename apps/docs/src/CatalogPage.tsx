import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Button, Input } from '@radish-ui/react';
import type { Translate } from './model';
import { PageHeader } from './PageHeader';
import { componentCatalog, componentGroups, filterComponents, groupLabel, type ComponentEntry } from './component-catalog';
import './component-site.css';

function ComponentCard({ entry, t }: { entry: ComponentEntry; t: Translate }) {
  const href = entry.detail ? `#/components/${entry.id}` : '#/components';
  return <a className="catalog-card" href={href}>
    <span className="catalog-card__group">{groupLabel(entry.group, 'zh-CN')}</span>
    <strong className="catalog-card__name">{entry.name}</strong>
    <span className="catalog-card__summary">{entry.summary}</span>
    <span className="catalog-card__meta">
      {entry.detail ? t('独立文档页', 'Dedicated page') : t('在组件用法中查看', 'In the component reference')}
      <span aria-hidden="true">→</span>
    </span>
  </a>;
}

export function CatalogPage({ t }: { t: Translate }) {
  const [query, setQuery] = useState('');
  const entries = useMemo(() => filterComponents(query), [query]);
  const groups = useMemo(() => componentGroups
    .map(group => ({ ...group, entries: entries.filter(entry => entry.group === group.id) }))
    .filter(group => group.entries.length > 0), [entries]);

  return <section className="catalog-page">
    <PageHeader title={t('组件目录', 'Component catalog')} back={{ href: '#/overview', label: t('概览', 'Overview') }}
      actions={<a className="rd-button rd-button--secondary rd-button--sm" href="#/components">{t('全部示例', 'All examples')}</a>} />
    <p className="catalog-intro">
      {t('按能力浏览共享组件。Button、Select、Tabs 已提供独立文档页；其余组件暂时先进入当前的组件用法页。',
        'Browse shared components by capability. Button, Select and Tabs have dedicated pages; the rest currently open the single-page reference.')}
    </p>
    <div className="catalog-toolbar">
      <div className="catalog-search">
        <Search size={16} aria-hidden="true" />
        <Input aria-label={t('搜索组件', 'Search components')} value={query} onChange={event => setQuery(event.target.value)}
          placeholder={t('搜索名称、说明或分组', 'Search name, summary, or group')} />
      </div>
      <span className="catalog-count" role="status">{t(`${entries.length} 个组件`, `${entries.length} components`)}</span>
      {query && <Button variant="ghost" size="sm" onClick={() => setQuery('')}>{t('清除', 'Clear')}</Button>}
    </div>
    {groups.length === 0 && <div className="catalog-empty">
      <p>{t('没有匹配的组件。', 'No components match.')}</p>
      <Button variant="secondary" size="sm" onClick={() => setQuery('')}>{t('清除搜索', 'Clear search')}</Button>
    </div>}
    {groups.map(group => <section className="catalog-group" key={group.id}>
      <div className="catalog-group__head">
        <h2>{group.label}</h2>
        <span>{group.entries.length}</span>
      </div>
      <div className="catalog-grid">
        {group.entries.map(entry => <ComponentCard key={entry.id} entry={entry} t={t} />)}
      </div>
    </section>)}
    <p className="catalog-footnote">
      {t(`目录共 ${componentCatalog.length} 个组件；全部为当前内部稳定范围，发行状态另见版本策略。Card / Section / Table 是页面原语，随 P1 纳入。`,
        `${componentCatalog.length} components in the catalog; all are in the current internal stable scope. Card, Section and Table are page primitives and join in P1.`)}
    </p>
  </section>;
}
