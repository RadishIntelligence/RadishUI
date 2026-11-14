import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type RefObject } from 'react';
import { Accordion, Button, Card, ConfirmDialog, Dialog, FormField, InlineAlert, Input, StatusBadge, TableOfContents, Textarea, Tag } from '@radish-ui/react';
import { Check, ChevronLeft, Copy, Info, LockKeyhole, Pencil, Share2 } from 'lucide-react';
import { articleForResource, welcomeArticle } from './document-seed';
import { formatDate, isArticles, parseArticle, type Article, type Preferences, type Resource, type Translate } from './model';
import { readStored, storageKeys, writeStored } from './storage';

interface ArticlePageProps {
  resourceId?: string; resources?: Resource[]; resourcesError?: string; preferences: Preferences; section?: string;
  scrollRoot: RefObject<HTMLElement | null>; t: Translate; notify(message: string): void;
  onDirtyChange(dirty: boolean): void; externalChange: boolean;
}

function headingScrollTop(root: HTMLElement, heading: HTMLElement) {
  const padding = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
  const margin = parseFloat(getComputedStyle(heading).scrollMarginTop) || 0;
  const offset = root.scrollTop + heading.getBoundingClientRect().top - root.getBoundingClientRect().top - padding - margin;
  return Math.max(0, Math.min(offset, root.scrollHeight - root.clientHeight));
}

export function ArticlePage(props: ArticlePageProps) {
  const resource = props.resources?.find(item => item.id === props.resourceId);
  if (props.resourceId && props.resourceId !== 'welcome' && !resource) {
    if (props.resources === undefined && !props.resourcesError) return <p role="status">{props.t('正在读取文档…', 'Loading document…')}</p>;
    return <div className="resource-state"><InlineAlert tone="danger">{props.t('资源不存在或未能读取。', 'This resource is missing or could not be read.')}</InlineAlert><a className="text-link" href="#/resources">{props.t('返回资源库', 'Back to resources')}</a></div>;
  }
  return <DocumentReader {...props} key={props.resourceId ?? 'welcome'} resource={resource} />;
}

function DocumentReader({ resourceId = 'welcome', resource, preferences, section, scrollRoot, t, notify, onDirtyChange, externalChange }: ArticlePageProps & { resource?: Resource }) {
  const fallback = useMemo(() => resource ? articleForResource(resource) : welcomeArticle, [resource]);
  const [initial] = useState(() => readStored(storageKeys.articles, isArticles));
  const [article, setArticle] = useState<Article>(initial.value && Object.hasOwn(initial.value, resourceId) ? initial.value[resourceId] : fallback);
  const [draft, setDraft] = useState(article);
  const [storeError, setStoreError] = useState(initial.error);
  const [formError, setFormError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [editing, setEditing] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [restoreError, setRestoreError] = useState('');
  const [shareOpen, setShareOpen] = useState(false);
  const [copyError, setCopyError] = useState('');
  const [copying, setCopying] = useState(false);
  const [copied, setCopied] = useState(false);
  const editButton = useRef<HTMLButtonElement>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  const headingScroll = useRef<{
    target: HTMLElement; start: number; top: number; phase: 'pending' | 'scrolling' | 'settled';
  } | undefined>(undefined);
  const blocks = useMemo(() => parseArticle(article.body), [article.body]);
  const headings = blocks.filter(block => block.type === 'heading');
  const [activeHeading, setActiveHeading] = useState('');
  const dirty = editing && (draft.title !== article.title || draft.body !== article.body);
  const readonly = resource?.status === 'readonly';
  const shareUrl = `${window.location.origin}${window.location.pathname}${window.location.search}#/document/${resourceId}`;

  useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange]);
  useEffect(() => () => onDirtyChange(false), [onDirtyChange]);
  useEffect(() => { if (editing) titleInput.current?.focus(); }, [editing]);
  const scrollToHeading = useCallback((id: string) => {
    const root = scrollRoot.current;
    const target = document.getElementById(id);
    if (!root || !target || !root.contains(target)) return;
    const top = headingScrollTop(root, target);
    const start = root.scrollTop;
    const smooth = 'onscrollend' in root && Math.abs(start - top) > 1
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    headingScroll.current = { target, start, top, phase: smooth ? 'pending' : 'settled' };
    setActiveHeading(id);
    root.scrollTo({ top, behavior: smooth ? 'smooth' : 'instant' });
  }, [scrollRoot]);
  useEffect(() => {
    if (editing) return;
    const root = scrollRoot.current;
    if (!root) return;
    const articleHeadings = Array.from(root.querySelectorAll<HTMLElement>('.article-heading')).reverse();
    const updateActiveHeading = () => {
      const requested = headingScroll.current;
      if (requested?.phase === 'pending' && Math.abs(root.scrollTop - requested.start) > 1) requested.phase = 'scrolling';
      // Expanding the outline can move the destination while the browser keeps the old offset.
      if (requested && (requested.phase !== 'settled' || Math.abs(root.scrollTop - requested.top) <= 1
        || Math.abs(root.scrollTop - headingScrollTop(root, requested.target)) <= 1)) return;
      headingScroll.current = undefined;
      const readingLine = root.getBoundingClientRect().top + 32;
      const current = articleHeadings.find(heading => heading.getBoundingClientRect().top <= readingLine)
        ?? articleHeadings[articleHeadings.length - 1];
      setActiveHeading(current?.id ?? '');
    };
    const finishHeadingScroll = () => {
      // An earlier scroll can end just before the new navigation starts moving.
      if (headingScroll.current?.phase !== 'scrolling') return;
      headingScroll.current.phase = 'settled';
      updateActiveHeading();
    };
    updateActiveHeading();
    root.addEventListener('scroll', updateActiveHeading, { passive: true });
    root.addEventListener('scrollend', finishHeadingScroll);
    return () => {
      headingScroll.current = undefined;
      root.removeEventListener('scroll', updateActiveHeading);
      root.removeEventListener('scrollend', finishHeadingScroll);
    };
  }, [article.body, editing, scrollRoot]);
  useEffect(() => {
    if (!section || editing) return;
    const frame = requestAnimationFrame(() => scrollToHeading(section));
    return () => cancelAnimationFrame(frame);
  }, [section, editing, article.body, scrollToHeading]);

  function exitEditing() { onDirtyChange(false); setEditing(false); setFormError(''); setTitleError(''); requestAnimationFrame(() => editButton.current?.focus()); }
  function validateTitle() {
    if (!draft.title.trim()) { setTitleError(t('请输入文档标题。', 'Enter a document title.')); return false; }
    setTitleError('');
    return true;
  }
  function save(event: FormEvent) {
    event.preventDefault();
    if (!validateTitle()) { titleInput.current?.focus(); return; }
    if (readonly || externalChange) { setFormError(t('当前文档只读，或已在其他标签页更新，请重新载入。', 'This document is read only or changed in another tab. Reload to continue.')); return; }
    const current = readStored(storageKeys.articles, isArticles);
    if (current.error) { setStoreError(current.error); return; }
    const previous = current.value && Object.hasOwn(current.value, resourceId) ? current.value[resourceId] : undefined;
    if (previous && previous.updatedAt !== article.updatedAt) {
      setFormError(t('这份文档已在其他标签页更新。请先复制当前修改，再重新载入。', 'This document changed in another tab. Copy your edits before reloading.')); return;
    }
    if (!previous && Object.keys(current.value ?? {}).length >= 500) {
      setFormError(t('本地文档库最多保存 500 份修改。请先复制当前文字，再管理浏览器站点数据。', 'This browser can store edits for up to 500 documents. Copy your text before managing site data.')); return;
    }
    const next = { title: draft.title.trim(), body: draft.body, updatedAt: new Date().toISOString() };
    const error = writeStored(storageKeys.articles, { ...current.value, [resourceId]: next });
    if (error) { setFormError(error); return; }
    setArticle(next); setDraft(next); setStoreError(undefined); exitEditing(); notify(t('文档已保存到当前浏览器', 'Document saved in this browser'));
  }

  const currentHeading = activeHeading || headings[0]?.id;
  const outline = <TableOfContents label={t('本文目录', 'Document outline')}
    items={headings.map(heading => ({ id: heading.id, level: heading.level, text: heading.text }))}
    currentId={currentHeading} hrefFor={id => `#/document/${resourceId}/${id}`}
    onNavigate={(id, event) => {
      if (section === id && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
        event.preventDefault();
        scrollToHeading(id);
      }
    }} />;
  return <section className="document-page">
    <div className="document-toolbar"><a className="document-back" href="#/resources"><ChevronLeft size={16} aria-hidden="true" />{t('资源库', 'Resources')}</a>
      <div><Button variant="secondary" onClick={() => { setShareOpen(true); setCopied(false); setCopyError(''); }}><Share2 />{t('分享', 'Share')}</Button>
        {!editing && <Button ref={editButton} disabled={readonly || Boolean(storeError)} onClick={() => { setDraft(article); setEditing(true); }}><Pencil />{t('编辑文档', 'Edit document')}</Button>}
      </div>
    </div>
    {storeError && <div className="document-storage-error"><InlineAlert tone="danger" title={t('本地文档未能读取', 'Local documents could not be read')}>{storeError}</InlineAlert>
      <Button variant="secondary" onClick={() => { setRestoreError(''); setRestoreOpen(true); }}>{t('重新初始化文档库', 'Reinitialize documents')}</Button></div>}
    {editing ? <form className="document-editor" onSubmit={save} noValidate>
      <FormField id="document-title" label={t('文档标题', 'Document title')} hint={t('最多 120 个字符。', 'Up to 120 characters.')} error={titleError} required><Input ref={titleInput} value={draft.title} maxLength={120} onBlur={validateTitle} onChange={event => { setDraft({ ...draft, title: event.target.value }); setTitleError(''); }} /></FormField>
      <FormField id="document-body" label={t('正文', 'Content')} hint={t('使用 ## 和 ### 分别表示二、三级标题；以 > 开头添加提示。其他内容以纯文本显示。', 'Use ## and ### for section and subsection headings, or > for a callout. Other content is displayed as plain text.')}>
        <Textarea value={draft.body} maxLength={50000} rows={18} onChange={event => setDraft({ ...draft, body: event.target.value })} />
      </FormField>
      {formError && <InlineAlert tone="danger">{formError}</InlineAlert>}
      <div className="editor-actions"><Button variant="secondary" onClick={() => { if (dirty) setDiscardOpen(true); else exitEditing(); }}>{t('取消', 'Cancel')}</Button><Button type="submit" disabled={!dirty || externalChange || Boolean(storeError)}>{t('保存文档', 'Save document')}</Button></div>
    </form> : <div className="document-layout">
      <article className="article-body" data-font-size={preferences.fontSize} data-line-height={preferences.lineHeight}>
        <header className="article-header"><h1>{article.title}</h1><div className="article-meta"><span>{resource?.creator ?? t('林杏', 'Lin Xing')}</span><span>·</span><time dateTime={article.updatedAt}>{formatDate(article.updatedAt, preferences.locale)}</time><span>·</span><span>{t(`约 ${Math.max(1, Math.ceil(article.body.length / 350))} 分钟`, `${Math.max(1, Math.ceil(article.body.length / 350))} min read`)}</span><StatusBadge tone={readonly ? 'neutral' : dirty ? 'warning' : 'success'}>{readonly ? <LockKeyhole /> : dirty ? <Pencil /> : <Check />}{readonly ? t('只读', 'Read only') : dirty ? t('未保存', 'Unsaved') : t('已保存', 'Saved')}</StatusBadge><StatusBadge tone="info">Workbench</StatusBadge></div></header>
        {blocks.length ? blocks.map((block, index) => block.type === 'heading' ? block.level === 2
          ? <h2 className="article-heading" id={block.id} key={block.id}>{block.text}</h2>
          : <h3 className="article-heading" id={block.id} key={block.id}>{block.text}</h3>
          : block.type === 'callout' ? <aside className="article-callout" key={index}><Info size={18} aria-hidden="true" /><p>{block.text}</p></aside>
          : <p key={index} className={index === 0 ? 'article-lead' : undefined}>{block.text}</p>)
          : <p className="field-help">{t('文档暂无内容。', 'This document is empty.')}</p>}
      </article>
      <aside className="document-aside">
        {preferences.showToc && headings.length > 0 && <><Card tone="muted" padding="sm" className="document-outline"><span>{t('本文目录', 'On this page')}</span>{outline}</Card>
          <Accordion className="mobile-outline" type="single" collapsible items={[{ value: 'toc', label: t('本文目录', 'On this page'), content: outline }]} /></>}
        <div className="document-properties"><span>{t('文档属性', 'Document properties')}</span><dl className="property-list"><div><dt>{t('状态', 'Status')}</dt><dd>{readonly ? t('只读', 'Read only') : t('已保存', 'Saved')}</dd></div><div><dt>{t('创建者', 'Created by')}</dt><dd>{resource?.creator ?? t('林杏', 'Lin Xing')}</dd></div><div><dt>{t('最近更新', 'Updated')}</dt><dd>{formatDate(article.updatedAt, preferences.locale)}</dd></div></dl><div className="document-tags"><Tag>{t('排版', 'Typography')}</Tag><Tag>{t('交互', 'Interaction')}</Tag></div></div>
      </aside>
    </div>}
    <ConfirmDialog open={discardOpen} onOpenChange={setDiscardOpen} title={t('放弃文档修改？', 'Discard document edits?')} closeLabel={t('关闭', 'Close')}
      description={t('当前未保存的文字会丢失。', 'Your unsaved text will be lost.')}
      confirmLabel={t('放弃修改', 'Discard edits')} cancelLabel={t('继续编辑', 'Keep editing')} tone="danger" onConfirm={() => { setDiscardOpen(false); setDraft(article); exitEditing(); }} />
    <Dialog open={shareOpen} onOpenChange={setShareOpen} title={t('分享文档链接', 'Share document link')} closeLabel={t('关闭', 'Close')}
      description={t('链接打开这份范例；你在本机保存的修改不会随链接发送。', 'The link opens this example. Edits saved in your browser are not included.')}>
      <div className="resource-form"><FormField label={t('链接', 'Link')}><Input readOnly value={shareUrl} onFocus={event => event.currentTarget.select()} /></FormField>
        <Button loading={copying} onClick={async () => {
          setCopying(true); setCopyError('');
          try { await navigator.clipboard.writeText(shareUrl); setCopied(true); }
          catch (error) { setCopyError(t('未能自动复制。请选中上方链接手动复制。', 'Could not copy automatically. Select the link above and copy it manually.') + (error instanceof DOMException ? ` (${error.name})` : '')); }
          finally { setCopying(false); }
        }}>{copied ? <Check /> : <Copy />}{copied ? t('已复制', 'Copied') : t('复制链接', 'Copy link')}</Button>
        {copyError && <InlineAlert tone="danger">{copyError}</InlineAlert>}
      </div>
    </Dialog>
    <Dialog open={restoreOpen} onOpenChange={setRestoreOpen} title={t('重新初始化文档库？', 'Reinitialize local documents?')} closeLabel={t('关闭', 'Close')}
      description={t('这会清除当前浏览器中所有文档的已保存修改，恢复示例正文，不影响资源列表与偏好。', 'This clears saved document edits in this browser and restores the example text. Resources and preferences are not affected.')}
      footer={<><Button variant="secondary" onClick={() => setRestoreOpen(false)}>{t('取消', 'Cancel')}</Button><Button variant="danger" onClick={() => {
        if (externalChange) { setRestoreError(t('其他标签页已更新，请重新载入后再初始化文档库。', 'Another tab made changes. Reload before reinitializing documents.')); return; }
        const error = writeStored(storageKeys.articles, {});
        if (error) setRestoreError(error); else { setArticle(fallback); setDraft(fallback); setStoreError(undefined); setRestoreOpen(false); setRestoreError(''); exitEditing(); }
      }}>{t('恢复示例正文', 'Restore example text')}</Button></>}>
      <p>{t('此操作无法撤销。', 'This cannot be undone.')}</p>
      {restoreError && <InlineAlert tone="danger">{restoreError}</InlineAlert>}
    </Dialog>
  </section>;
}
