import { StatusBadge } from '@radish-ui/react';
import type { Translate } from './model';
import { PageHeader } from './PageHeader';
import { CopyButton } from './CopyButton';
import { findComponent, type ComponentEntry } from './component-catalog';
import { pilotDocs } from './component-api.generated';
import { behaviorSourceLabels, behaviorTopicLabels } from './component-api-types';
import { pilotExamples } from './component-pilot-examples';
import './component-site.css';

function DocCode({ code, label }: { code: string; label: string }) {
  return <div className="doc-code">
    <CopyButton text={code} label={label} />
    <pre tabIndex={0}><code>{code}</code></pre>
  </div>;
}

function RelatedLink({ entry }: { entry: ComponentEntry }) {
  return <a className="doc-related__link" href={entry.detail ? `#/components/${entry.id}` : '#/components'}>
    <span>{entry.name}</span>
    <span aria-hidden="true">→</span>
  </a>;
}

export function ComponentDetailPage({ id, t }: { id: string; t: Translate }) {
  const entry = findComponent(id);
  const doc = pilotDocs[id];
  const examples = pilotExamples[id];
  if (!entry || !entry.detail || !doc || !examples) {
    return <section className="component-doc">
      <PageHeader title={t('组件未找到', 'Component not found')} back={{ href: '#/catalog', label: t('组件目录', 'Component catalog') }} />
      <p className="component-doc__summary">{t('这个组件还没有独立文档页，或链接已过期。', 'This component does not have a dedicated page yet, or the link is out of date.')}</p>
      <p><a className="text-link" href="#/catalog">{t('返回组件目录', 'Back to the component catalog')}</a></p>
    </section>;
  }

  const related = doc.related.map(findComponent).filter((item): item is ComponentEntry => Boolean(item));
  const hasComponentColumn = doc.api.some(row => row.component);

  return <section className="component-doc">
    <PageHeader title={entry.name} back={{ href: '#/catalog', label: t('组件目录', 'Component catalog') }}
      actions={<div className="component-doc__actions">
        <StatusBadge tone="info">{t('内部稳定', 'Internal stable')}</StatusBadge>
        <a className="rd-button rd-button--secondary rd-button--sm" href="#/components">{t('全部示例', 'All examples')}</a>
      </div>} />
    <p className="component-doc__summary">{entry.summary}</p>

    <section className="doc-section" aria-labelledby="doc-import">
      <h2 id="doc-import">{t('导入', 'Import')}</h2>
      <DocCode code={doc.importCode} label={t('复制导入代码', 'Copy import code')} />
      <p className="component-doc__note">{t('当前包为 private workspace 预览，尚未发布 npm；正式发行后改用包名与版本。',
        'The package is a private workspace preview, not yet published to npm. Use the package name and version once it is released.')}</p>
    </section>

    <section className="doc-section" aria-labelledby="doc-examples">
      <h2 id="doc-examples">{t('示例', 'Examples')}</h2>
      {examples.map(example => <article className="doc-example" key={example.id}>
        <div className="doc-example__head">
          <h3>{example.title}</h3>
          <p>{example.description}</p>
        </div>
        <div className="doc-preview">{example.preview}</div>
        <DocCode code={example.code} label={t(`复制 ${example.title} 代码`, `Copy ${example.title} code`)} />
      </article>)}
    </section>

    <section className="doc-section" aria-labelledby="doc-api">
      <h2 id="doc-api">{t('API', 'API')}</h2>
      <div className="doc-api-scroll" tabIndex={0} role="region" aria-label={t('API 表，可横向滚动', 'API table, horizontally scrollable')}>
        <table className="doc-api">
          <caption className="sr-only">{t(`${entry.name} 的属性与事件`, `${entry.name} props and events`)}</caption>
          <thead><tr>
            {hasComponentColumn && <th scope="col">{t('组件', 'Component')}</th>}
            <th scope="col">{t('属性', 'Prop')}</th>
            <th scope="col">{t('类型', 'Type')}</th>
            <th scope="col">{t('默认值', 'Default')}</th>
            <th scope="col">{t('必填', 'Required')}</th>
            <th scope="col">{t('说明', 'Description')}</th>
          </tr></thead>
          <tbody>
            {doc.api.map(row => <tr key={`${row.component ?? ''}-${row.name}`}>
              {hasComponentColumn && <td>{row.component ? <code>{row.component}</code> : '—'}</td>}
              <th scope="row"><code>{row.name}</code></th>
              <td><code>{row.type}</code></td>
              <td>{row.defaultValue ? <code>{row.defaultValue}</code> : '—'}</td>
              <td>{row.required ? t('是', 'Yes') : t('否', 'No')}</td>
              <td>{row.description}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </section>

    <section className="doc-section" aria-labelledby="doc-keyboard">
      <h2 id="doc-keyboard">{t('键盘与可访问性', 'Keyboard and accessibility')}</h2>
      <div className="doc-behavior-scroll" tabIndex={0} role="region"
        aria-label={t('行为与可访问性声明，可横向滚动', 'Behavior and accessibility declarations, horizontally scrollable')}>
        <table className="doc-behavior">
          <caption className="sr-only">{t(`${entry.name} 的行为来源与可访问性声明`, `${entry.name} behavior sources and accessibility declarations`)}</caption>
          <thead><tr>
            <th scope="col">{t('主题', 'Topic')}</th>
            <th scope="col">{t('来源', 'Source')}</th>
            <th scope="col">{t('说明', 'Description')}</th>
          </tr></thead>
          <tbody>
            {doc.behavior.map((item, index) => <tr key={`${item.topic}-${item.source}-${index}`}>
              <th scope="row">{behaviorTopicLabels[item.topic]}</th>
              <td>{behaviorSourceLabels[item.source]}</td>
              <td>{item.text}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </section>

    {related.length > 0 && <section className="doc-section" aria-labelledby="doc-related">
      <h2 id="doc-related">{t('相关组件', 'Related components')}</h2>
      <div className="doc-related">{related.map(item => <RelatedLink key={item.id} entry={item} />)}</div>
    </section>}
  </section>;
}
