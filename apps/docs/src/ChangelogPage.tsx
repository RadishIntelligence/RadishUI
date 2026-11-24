import { Card, StatusBadge, Tag } from '@radish-ui/react';
import type { Translate } from './model';
import { PageHeader } from './PageHeader';
import { changelog, changelogKindLabels, siteVersion } from './changelog';
import { componentCatalog } from './component-catalog';
import './changelog.css';

export function ChangelogPage({ t }: { t: Translate }) {
  const primitiveCount = componentCatalog.filter(entry => entry.group === 'primitives').length;
  const componentCount = componentCatalog.length - primitiveCount;
  return <section className="changelog-page">
    <PageHeader title={t('变更记录', 'Changelog')} back={{ href: '#/overview', label: t('概览', 'Overview') }} />
    <p className="changelog-intro">{t('共享组件与展示站的可追溯变更。条目来自开发记录；正式版本、Git tag 与 Release 在发行任务中另行创建。',
      'Traceable changes for shared components and the showcase. Entries come from the development records; tagged releases and formal versions are created in release tasks.')}</p>
    <Card tone="muted" padding="sm" className="changelog-version">
      <div className="changelog-version-head">
        <span>{t('内部版本', 'Internal version')}</span>
        <strong>v{siteVersion}</strong>
        <StatusBadge tone="info">{t('内部预览 · 未发布', 'Internal preview · unreleased')}</StatusBadge>
      </div>
      <p>{t(`目录 ${componentCatalog.length} 个条目（${componentCount} 个组件与 ${primitiveCount} 个页面原语），全部为内部稳定；React 19 内部预览，包未发布 npm。`,
        `The catalog has ${componentCatalog.length} entries (${componentCount} components and ${primitiveCount} page primitives), all internally stable; the React 19 package is an internal preview and is not published to npm.`)}</p>
    </Card>
    <ol className="changelog-list">
      {changelog.map(entry => <li key={`${entry.date}-${entry.title.en}`}>
        <Card padding="md" className="changelog-entry">
          <div className="changelog-entry-head">
            <time dateTime={entry.date}>{entry.date}</time>
            <Tag>{t(changelogKindLabels[entry.kind].zh, changelogKindLabels[entry.kind].en)}</Tag>
          </div>
          <h2>{t(entry.title.zh, entry.title.en)}</h2>
          <ul className="changelog-items">
            {entry.items.map(item => <li key={item.zh}>{item.href ? <a className="text-link" href={item.href}>{t(item.zh, item.en)}</a> : t(item.zh, item.en)}</li>)}
          </ul>
        </Card>
      </li>)}
    </ol>
    <p className="changelog-note">{t('版本格式遵循家族日历版本 vYY.M.RELEASE。当前 26.11.1 为内部预览，不是公开发布，也不代表已创建 tag；兼容性承诺仍按设计系统契约记录。',
      'Versions follow the family calendar format vYY.M.RELEASE. The current 26.11.1 is an internal preview, not a public release, and no tag has been created; compatibility promises still follow the design system contract.')}</p>
  </section>;
}
