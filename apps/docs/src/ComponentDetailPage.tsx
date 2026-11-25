import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Card, Drawer, IconButton, StatusBadge, TableOfContents } from '@radish-ui/react';
import { ListTree } from 'lucide-react';
import type { Locale, Translate } from './model';
import { PageHeader } from './PageHeader';
import { CopyButton } from './CopyButton';
import { findComponent, type ComponentEntry } from './component-catalog';
import { pilotDocs } from './component-api.generated';
import { highlightedCode } from './component-code.generated';
import { behaviorSourceLabels, behaviorTopicLabels } from './component-api-types';
import { pilotExamples } from './component-pilot-examples';
import './component-site.css';

type PreviewTheme = 'system' | 'light' | 'dark';
type PreviewDensity = 'system' | 'compact' | 'standard' | 'spacious';

const previewThemeOptions: readonly { value: PreviewTheme; zh: string; en: string }[] = [
  { value: 'system', zh: '跟随站点', en: 'Site default' },
  { value: 'light', zh: '明', en: 'Light' },
  { value: 'dark', zh: '暗', en: 'Dark' },
];
const previewDensityOptions: readonly { value: PreviewDensity; zh: string; en: string }[] = [
  { value: 'system', zh: '跟随站点', en: 'Site default' },
  { value: 'compact', zh: '紧凑', en: 'Compact' },
  { value: 'standard', zh: '标准', en: 'Standard' },
  { value: 'spacious', zh: '宽松', en: 'Spacious' },
];

const documentationSectionIds = ['doc-import', 'doc-examples', 'doc-api', 'doc-keyboard'] as const;

// The component page shares the workspace scroll container; keep the same offset math
// as the document reader so a section heading lands below the container padding.
function sectionScrollTop(root: HTMLElement, target: HTMLElement) {
  const padding = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
  const offset = root.scrollTop + target.getBoundingClientRect().top - root.getBoundingClientRect().top - padding;
  return Math.max(0, Math.min(offset, root.scrollHeight - root.clientHeight));
}

function ExamplePreview({ title, preview, t }: { title: string; preview: ReactNode; t: Translate }) {
  const [theme, setTheme] = useState<PreviewTheme>('system');
  const [density, setDensity] = useState<PreviewDensity>('system');
  return <div className="doc-preview-shell">
    <div className="doc-preview-toolbar">
      <span className="doc-preview-toolbar__hint">{t('预览设置', 'Preview settings')}</span>
      <label className="doc-preview-control">
        <span>{t('主题', 'Theme')}</span>
        <select value={theme} aria-label={t(`预览主题：${title}`, `Preview theme: ${title}`)}
          onChange={event => setTheme(event.target.value as PreviewTheme)}>
          {previewThemeOptions.map(option => <option key={option.value} value={option.value}>{t(option.zh, option.en)}</option>)}
        </select>
      </label>
      <label className="doc-preview-control">
        <span>{t('密度', 'Density')}</span>
        <select value={density} aria-label={t(`预览密度：${title}`, `Preview density: ${title}`)}
          onChange={event => setDensity(event.target.value as PreviewDensity)}>
          {previewDensityOptions.map(option => <option key={option.value} value={option.value}>{t(option.zh, option.en)}</option>)}
        </select>
      </label>
    </div>
    <div className="doc-preview" data-rd-theme={theme === 'system' ? undefined : theme}
      data-preview-density={density === 'system' ? undefined : density}>
      {preview}
    </div>
  </div>;
}

function DocCode({ code, html, label, t }: { code: string; html: string; label: string; t: Translate }) {
  return <div className="doc-code">
    <CopyButton text={code} label={label} t={t} />
    <pre tabIndex={0}><code dangerouslySetInnerHTML={{ __html: html }} /></pre>
  </div>;
}

function RelatedLink({ entry }: { entry: ComponentEntry }) {
  return <a className="doc-related__link" href={entry.detail ? `#/components/${entry.id}` : '#/components'}>
    <span>{entry.name}</span>
    <span aria-hidden="true">→</span>
  </a>;
}

export function ComponentDetailPage({ id, section, scrollRoot, t, locale }: { id: string; section?: string; scrollRoot: RefObject<HTMLElement | null>; t: Translate; locale: Locale }) {
  const entry = findComponent(id);
  const doc = pilotDocs[id];
  const examples = pilotExamples[id];
  const related = (doc?.related ?? []).map(relatedId => findComponent(relatedId)).filter((item): item is ComponentEntry => Boolean(item));
  const sectionIds = related.length ? [...documentationSectionIds, 'doc-related'] : [...documentationSectionIds];
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0]);
  const requestedScroll = useRef<{ target: HTMLElement; start: number; top: number; phase: 'pending' | 'scrolling' | 'settled' } | undefined>(undefined);

  const scrollToSection = useCallback((sectionId: string, focusHeading = false) => {
    const root = scrollRoot.current;
    const target = document.getElementById(sectionId);
    if (!root || !target || !root.contains(target)) return;
    const top = sectionScrollTop(root, target);
    const smooth = 'onscrollend' in root && Math.abs(root.scrollTop - top) > 1
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    requestedScroll.current = { target, start: root.scrollTop, top, phase: smooth ? 'pending' : 'settled' };
    setActiveSection(sectionId);
    root.scrollTo({ top, behavior: smooth ? 'smooth' : 'instant' });
    if (focusHeading) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
  }, [scrollRoot]);

  useEffect(() => {
    const root = scrollRoot.current;
    if (!root) return;
    const updateActiveSection = () => {
      const requested = requestedScroll.current;
      if (requested?.phase === 'pending' && Math.abs(root.scrollTop - requested.start) > 1) requested.phase = 'scrolling';
      // Keep the clicked section while its scroll is in flight or already at the target;
      // a section near the page end cannot always reach the reading line, so the target
      // scroll is also compared with the current offset.
      if (requested && (requested.phase !== 'settled' || Math.abs(root.scrollTop - requested.top) <= 1
        || Math.abs(root.scrollTop - sectionScrollTop(root, requested.target)) <= 1)) return;
      requestedScroll.current = undefined;
      // The last section cannot always cross the reading line on short pages; at the
      // page end the outline follows the last section instead of the previous one.
      const atEnd = root.scrollTop + root.clientHeight >= root.scrollHeight - 2;
      const readingLine = root.getBoundingClientRect().top + 96;
      let current = sectionIds[0];
      for (const sectionId of sectionIds) {
        const target = document.getElementById(sectionId);
        if (target && target.getBoundingClientRect().top <= readingLine) current = sectionId;
      }
      if (atEnd) current = sectionIds[sectionIds.length - 1];
      setActiveSection(current);
    };
    const finishSectionScroll = () => {
      // An earlier scroll can end just before the new navigation starts moving.
      if (requestedScroll.current?.phase !== 'scrolling') return;
      requestedScroll.current.phase = 'settled';
      updateActiveSection();
    };
    requestedScroll.current = undefined;
    setActiveSection(sectionIds[0]);
    updateActiveSection();
    root.addEventListener('scroll', updateActiveSection, { passive: true });
    root.addEventListener('scrollend', finishSectionScroll);
    return () => {
      root.removeEventListener('scroll', updateActiveSection);
      root.removeEventListener('scrollend', finishSectionScroll);
    };
  }, [scrollRoot, id, related.length]);

  useEffect(() => {
    if (!section) return;
    const frame = requestAnimationFrame(() => scrollToSection(section));
    return () => cancelAnimationFrame(frame);
  }, [section, id, scrollToSection]);

  if (!entry || !entry.detail || !doc || !examples) {
    return <section className="component-doc">
      <PageHeader title={t('组件未找到', 'Component not found')} back={{ href: '#/catalog', label: t('组件目录', 'Component catalog') }} />
      <p className="component-doc__summary">{t('这个组件还没有独立文档页，或链接已过期。', 'This component does not have a dedicated page yet, or the link is out of date.')}</p>
      <p><a className="text-link" href="#/catalog">{t('返回组件目录', 'Back to the component catalog')}</a></p>
    </section>;
  }

  const hasComponentColumn = doc.api.some(row => row.component);
  const outlineItems = [
    { id: 'doc-import', text: t('导入', 'Import') },
    { id: 'doc-examples', text: t('示例', 'Examples') },
    { id: 'doc-api', text: t('API', 'API') },
    { id: 'doc-keyboard', text: t('键盘与可访问性', 'Keyboard and accessibility') },
    ...(related.length ? [{ id: 'doc-related', text: t('相关组件', 'Related components') }] : []),
  ];
  const outline = (inDrawer: boolean) => <TableOfContents label={t('本页内容', 'On this page')} items={outlineItems}
    currentId={activeSection} hrefFor={sectionId => `#/components/${entry.id}/${sectionId}`}
    onNavigate={(sectionId, event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (section === sectionId) event.preventDefault();
      if (inDrawer) {
        setOutlineOpen(false);
        // Radix returns focus to the trigger when the drawer closes; wait for that, then move focus to the heading.
        window.setTimeout(() => scrollToSection(sectionId, true), 50);
      } else {
        scrollToSection(sectionId);
      }
    }} />;

  return <section className="component-doc" data-component={entry.id}>
    <PageHeader title={entry.name} back={{ href: '#/catalog', label: t('组件目录', 'Component catalog') }}
      actions={<div className="component-doc__actions">
        <IconButton className="component-doc__outline-trigger" label={t('本页内容', 'On this page')} title={t('本页内容', 'On this page')}
          aria-haspopup="dialog" aria-expanded={outlineOpen} onClick={() => setOutlineOpen(true)}><ListTree /></IconButton>
        <StatusBadge tone="info">{t('内部稳定', 'Internal stable')}</StatusBadge>
      </div>} />
    <div className="component-doc__layout">
      <div className="component-doc__main">
        <p className="component-doc__summary">{locale === 'en' ? entry.summaryEn : entry.summary}</p>

        <section className="doc-section" aria-labelledby="doc-import">
          <h2 id="doc-import">{t('导入', 'Import')}</h2>
          <DocCode code={doc.importCode} html={highlightedCode[`${entry.id}/import`]} label={t('复制导入代码', 'Copy import code')} t={t} />
          <p className="component-doc__note">{t('当前包为 private workspace 预览，尚未发布 npm；正式发行后改用包名与版本。',
            'The package is a private workspace preview, not yet published to npm. Use the package name and version once it is released.')}</p>
        </section>

        <section className="doc-section" aria-labelledby="doc-examples">
          <h2 id="doc-examples">{t('示例', 'Examples')}</h2>
          {examples.map(example => {
            const title = locale === 'en' ? example.titleEn : example.title;
            return <article className="doc-example" key={`${entry.id}-${example.id}`} data-example={example.id}>
              <div className="doc-example__head">
                <h3>{title}</h3>
                <p>{locale === 'en' ? example.descriptionEn : example.description}</p>
              </div>
              <ExamplePreview title={title} preview={example.preview} t={t} />
              <DocCode code={example.code} html={highlightedCode[`${entry.id}/${example.id}`]} label={t(`复制 ${example.title} 代码`, `Copy ${title} code`)} t={t} />
            </article>;
          })}
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
                  <td>{locale === 'en' ? row.descriptionEn : row.description}</td>
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
                  <th scope="row">{t(behaviorTopicLabels[item.topic].zh, behaviorTopicLabels[item.topic].en)}</th>
                  <td>{t(behaviorSourceLabels[item.source].zh, behaviorSourceLabels[item.source].en)}</td>
                  <td>{locale === 'en' ? item.textEn : item.text}</td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </section>

        {related.length > 0 && <section className="doc-section" aria-labelledby="doc-related">
          <h2 id="doc-related">{t('相关组件', 'Related components')}</h2>
          <div className="doc-related">{related.map(item => <RelatedLink key={item.id} entry={item} />)}</div>
        </section>}
      </div>
      <aside className="component-doc__aside">
        <Card tone="muted" padding="sm">
          <div className="component-doc__outline"><span>{t('本页内容', 'On this page')}</span>{outline(false)}</div>
        </Card>
      </aside>
    </div>
    <Drawer className="component-doc__outline-drawer" open={outlineOpen} onOpenChange={setOutlineOpen}
      title={t('本页内容', 'On this page')} closeLabel={t('关闭', 'Close')}>{outline(true)}</Drawer>
  </section>;
}
