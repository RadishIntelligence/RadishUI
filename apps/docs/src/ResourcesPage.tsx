import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from 'react';
import { Button, Checkbox, ConfirmDialog, Dialog, Drawer, FormField, IconButton, InlineAlert, Input, Menu, Pagination, Select, Textarea, Tag, TagInput, ToggleGroup } from '@radish-ui/react';
import { ArrowUpRight, FileText, History, ListChecks, LockKeyhole, MoreHorizontal, Palette, PanelsTopLeft, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { PageHeader } from './PageHeader';
import { appendResourceTags, filterResources, formatDate, kindLabel, pageCount, resourceTagError, resourceTagLimits, statusLabel, type Preferences, type Resource, type ResourceKind, type Translate } from './model';

const kindIcons = { document: FileText, spec: Palette, checklist: ListChecks, example: PanelsTopLeft };
function openResource(resource: Resource) { window.location.hash = resource.id === 'settings-example' ? '/settings' : `/document/${resource.id}`; }
function ResourceStatus({ resource, t }: { resource: Resource; t: Translate }) {
  return <span className={`resource-status is-${resource.status}`}>
    {resource.status === 'readonly' ? <LockKeyhole size={16} aria-hidden="true" /> : <span className="resource-status-dot" aria-hidden="true" />}
    {statusLabel(resource.status, t)}
  </span>;
}

interface ResourcesPageProps {
  resources?: Resource[]; error?: string; save(next: Resource[]): string | undefined; retry(): void;
  t: Translate; locale: Preferences['locale']; notify(message: string): void;
}
export function ResourcesPage({ resources, error, save, retry, t, locale, notify }: ResourcesPageProps) {
  const [kind, setKind] = useState('all');
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [selectedId, setSelectedId] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Resource>();
  const [versionTarget, setVersionTarget] = useState<Resource>();
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [mutationError, setMutationError] = useState('');
  const [scrollFallback, setScrollFallback] = useState(false);
  const pageRef = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const filtered = filterResources(resources ?? [], query, kind, status);
  const totalPages = pageCount(filtered.length, size);
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * size, currentPage * size);
  const selected = visible.find(item => item.id === selectedId) ?? visible[0];

  // The workbench keeps one screen while the list stays usable; extreme text or a very short
  // viewport falls back to a page-level scroll instead of squeezing the list to nothing.
  useLayoutEffect(() => {
    const page = pageRef.current;
    const main = page?.closest('main');
    const list = page?.querySelector<HTMLElement>('.resource-table-scroll');
    if (!page || !main || !list) { setScrollFallback(false); return; }
    const measure = () => {
      const mainStyle = getComputedStyle(main);
      const available = main.clientHeight - parseFloat(mainStyle.paddingTop) - parseFloat(mainStyle.paddingBottom);
      const chrome = page.getBoundingClientRect().height - list.getBoundingClientRect().height;
      const minList = parseFloat(getComputedStyle(document.documentElement).fontSize) * 8;
      setScrollFallback(available > 0 && available < chrome + minList);
    };
    measure();
    const observer = new ResizeObserver(measure);
    for (const element of [main, page, list]) observer.observe(element);
    window.addEventListener('resize', measure);
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); };
  }, [resources, error]);

  function select(item: Resource) {
    setSelectedId(item.id);
    if (window.matchMedia('(max-width: 1099px)').matches) setDrawerOpen(true);
  }
  function resetPage() { setPage(1); }
  function remove() {
    if (!resources || !deleteTarget) return;
    const failure = save(resources.filter(item => item.id !== deleteTarget.id));
    if (failure) { setMutationError(failure); return; }
    setDeleteTarget(undefined); setDrawerOpen(false); setMutationError('');
    notify(t('资源已从当前浏览器删除', 'Resource deleted from this browser'));
    requestAnimationFrame(() => title.current?.focus());
  }
  const details = selected && <ResourceDetails resource={selected} t={t} locale={locale}
    onVersion={() => setVersionTarget(selected)} onDelete={() => { setMutationError(''); setDeleteTarget(selected); }} />;
  const drawerDetails = selected && <ResourceDetails variant="drawer" resource={selected} t={t} locale={locale}
    onVersion={() => setVersionTarget(selected)} onDelete={() => { setMutationError(''); setDeleteTarget(selected); }} />;

  const content = error ? <div className="resource-state"><InlineAlert tone="danger" title={t('资源未能载入', 'Resources could not be loaded')}>{error}</InlineAlert>
    <div className="state-actions"><Button variant="secondary" onClick={retry}>{t('重试', 'Retry')}</Button><Button variant="secondary" onClick={() => setRestoreOpen(true)}>{t('恢复演示数据', 'Restore demo data')}</Button></div>
  </div> : resources === undefined ? <div className="resource-state" role="status">{t('正在读取本地资源…', 'Loading local resources…')}</div>
    : <div className={`resources-layout ${selected ? '' : 'is-empty'}`}>
      <div className="resource-table-panel">
        <div className="resource-table-scroll">
        {visible.length ? <>
          <table className="resource-table"><caption className="sr-only">{t('资源列表', 'Resource list')}</caption>
            <colgroup><col /><col className="status-column" /><col className="updated-column" /><col className="action-column" /></colgroup>
            <thead><tr><th scope="col">{t('资源名称', 'Resource name')}</th><th scope="col">{t('状态', 'Status')}</th><th scope="col">{t('最近更新', 'Updated')}</th><th scope="col"><span className="sr-only">{t('操作', 'Open')}</span></th></tr></thead>
            <tbody>{visible.map(item => {
              const Icon = kindIcons[item.kind];
              return <tr key={item.id} className={selected?.id === item.id ? 'is-selected' : ''} onClick={() => setSelectedId(item.id)}>
                <td><button className="resource-select" onClick={event => { event.currentTarget.focus({ preventScroll: true }); select(item); }} aria-label={t(`查看 ${item.name} 的详情`, `Details for ${item.name}`)} aria-pressed={selected?.id === item.id}>
                  <span className="resource-kind-icon"><Icon size={16} aria-hidden="true" /></span><span className="resource-name"><strong>{item.name}</strong><span>{kindLabel(item.kind, t)}</span></span>
                </button></td>
                <td><ResourceStatus resource={item} t={t} /></td><td className="resource-date">{formatDate(item.updatedAt, locale)}</td>
                <td><IconButton className="resource-open" label={t(`打开 ${item.name}`, `Open ${item.name}`)} onClick={event => { event.stopPropagation(); openResource(item); }}><ArrowUpRight /></IconButton></td>
              </tr>;
            })}</tbody>
          </table>
          <ul className="resource-mobile-list" aria-label={t('资源列表', 'Resource list')}>
            {visible.map(item => {
              const Icon = kindIcons[item.kind];
              return <li key={item.id} className={selected?.id === item.id ? 'is-selected' : ''}>
                <button className="resource-mobile-select" onClick={event => { event.currentTarget.focus({ preventScroll: true }); select(item); }} aria-label={t(`查看 ${item.name} 的详情`, `Details for ${item.name}`)}>
                  <span className="resource-kind-icon"><Icon size={16} aria-hidden="true" /></span><span className="resource-name"><strong>{item.name}</strong><span>{kindLabel(item.kind, t)} <ResourceStatus resource={item} t={t} /></span></span>
                </button><IconButton className="resource-open" label={t(`打开 ${item.name}`, `Open ${item.name}`)} onClick={() => openResource(item)}><ArrowUpRight /></IconButton>
              </li>;
            })}
          </ul>
        </> : <div className="empty-state"><Search aria-hidden="true" /><h2>{resources.length ? t('没有匹配的资源', 'No matching resources') : t('还没有资源', 'No resources yet')}</h2>
          <Button variant="secondary" onClick={() => { if (resources.length) { setQuery(''); setStatus('all'); setKind('all'); resetPage(); } else setCreateOpen(true); }}>{resources.length ? t('清除筛选', 'Clear filters') : t('新建资源', 'New resource')}</Button>
        </div>}
        </div>
        {visible.length > 0 && <Pagination page={currentPage} pageCount={totalPages} pageSize={size} totalItems={filtered.length}
          onPageChange={setPage} onPageSizeChange={next => { setSize(next); resetPage(); }}
          labels={{
            nav: t('资源分页', 'Resource pagination'),
            summary: total => t(`共 ${total} 项`, `${total} items`),
            pageSize: t('每页条数', 'Items per page'),
            pageSizeOption: value => t(`${value} 条/页`, `${value} / page`),
            previous: t('上一页', 'Previous page'),
            next: t('下一页', 'Next page'),
            page: value => t(`第 ${value} 页`, `Page ${value}`),
            position: (value, total) => t(`第 ${value} 页，共 ${total} 页`, `Page ${value} of ${total}`),
            jump: t('前往', 'Go to'),
            jumpUnit: t('页', ''),
            jumpAction: t('跳转', 'Go'),
            jumpError: total => t(`请输入 1–${total} 之间的整数。`, `Enter a whole number from 1 to ${total}.`),
          }} />}
      </div>
      {selected && <aside className="resource-detail-panel" aria-label={t('当前资源', 'Current resource')}>{details}</aside>}
    </div>;

  return <section className={`resources-page${scrollFallback ? ' is-scroll-fallback' : ''}`} ref={pageRef}>
    <PageHeader title={t('资源库', 'Resources')} titleRef={title} actions={<>
      <Menu trigger={<IconButton className="page-menu" label={t('页面操作', 'Page actions')}><MoreHorizontal /></IconButton>} items={[
        { id: 'restore', label: t('恢复演示数据', 'Restore demo data'), icon: <RefreshCw />, onSelect: () => setRestoreOpen(true) },
      ]} />
      <Button onClick={() => setCreateOpen(true)} disabled={resources === undefined || Boolean(error)}><Plus />{t('新建资源', 'New resource')}</Button>
    </>} />
    <div className="resources-tabs">
      <div className="resource-toolbar"><ToggleGroup label={t('资源类型', 'Resource type')} size="lg" value={kind} onValueChange={value => { setKind(value); resetPage(); }} items={[
        { value: 'all', label: t('全部', 'All') },
        { value: 'document', label: t('文档', 'Docs') },
        { value: 'checklist', label: t('清单', 'Lists') },
      ]} />
        <div className="resource-search-tools"><label className="resource-search" htmlFor="resource-search"><span className="sr-only">{t('搜索资源', 'Search resources')}</span><Search size={18} aria-hidden="true" /><Input id="resource-search" type="search" value={query} placeholder={t('搜索资源…', 'Search resources…')} onChange={event => { setQuery(event.target.value); resetPage(); }} /></label>
          <Select value={status} onValueChange={value => { setStatus(value); resetPage(); }} label={t('筛选资源状态', 'Filter resource status')} options={[
            { value: 'all', label: t('所有状态', 'All statuses') }, { value: 'ready', label: t('已就绪', 'Ready') }, { value: 'draft', label: t('草稿', 'Draft') }, { value: 'readonly', label: t('只读', 'Read only') },
          ]} />
        </div>
      </div>
      {content}
    </div>
    <Drawer className="resource-sheet" open={drawerOpen && Boolean(selected)} onOpenChange={setDrawerOpen} title={selected?.name ?? t('资源详情', 'Resource details')} closeLabel={t('关闭', 'Close')}>{drawerDetails}</Drawer>
    <CreateResource open={createOpen} onOpenChange={setCreateOpen} t={t} resources={resources ?? []} save={next => {
      const failure = save(next);
      if (!failure) { setQuery(''); setKind('all'); setStatus('all'); resetPage(); setSelectedId(next[0].id); notify(t('资源已创建', 'Resource created')); }
      return failure;
    }} />
    <ConfirmDialog open={Boolean(deleteTarget)} onOpenChange={open => { if (!open) setDeleteTarget(undefined); }} title={t('删除资源？', 'Delete resource?')}
      description={t('这会删除当前浏览器中的资源记录，无法撤销。', 'This removes the resource record from this browser and cannot be undone.')} closeLabel={t('关闭', 'Close')}
      confirmLabel={t('删除资源', 'Delete resource')} cancelLabel={t('取消', 'Cancel')} tone="danger" onConfirm={remove}>
      <p className="break-word">{deleteTarget?.name}</p>{mutationError && <InlineAlert tone="danger">{mutationError}</InlineAlert>}
    </ConfirmDialog>
    <Dialog open={Boolean(versionTarget)} onOpenChange={open => { if (!open) setVersionTarget(undefined); }} title={t('版本信息', 'Version information')} closeLabel={t('关闭', 'Close')}>
      {versionTarget && <><dl className="property-list"><div><dt>{t('版本', 'Version')}</dt><dd>{versionTarget.version}</dd></div><div><dt>{t('最近更新', 'Updated')}</dt><dd>{formatDate(versionTarget.updatedAt, locale)}</dd></div></dl><p className="field-help">{t('此本地范例只提供当前版本，没有远端版本历史。', 'This local example provides only the current version, without remote history.')}</p></>}
    </Dialog>
    <Dialog open={restoreOpen} onOpenChange={setRestoreOpen} title={t('恢复演示数据？', 'Restore demo data?')} closeLabel={t('关闭', 'Close')}
      description={t('这会覆盖当前浏览器中的资源列表，不影响偏好或文档。', 'This replaces the local resource list. Preferences and documents are not affected.')}
      footer={<><Button variant="secondary" onClick={() => setRestoreOpen(false)}>{t('取消', 'Cancel')}</Button><Button onClick={async () => {
        try {
          const { initialResources } = await import('./seed');
          const failure = save(initialResources);
          if (failure) setMutationError(failure); else { setRestoreOpen(false); setMutationError(''); resetPage(); }
        } catch (error) { setMutationError(error instanceof Error ? error.message : String(error)); }
      }}>{t('恢复', 'Restore')}</Button></>}>
      {mutationError && <InlineAlert tone="danger">{mutationError}</InlineAlert>}
    </Dialog>
  </section>;
}

function ResourceDetails({ resource, t, locale, onVersion, onDelete, variant = 'aside' }: { resource: Resource; t: Translate; locale: Preferences['locale']; onVersion(): void; onDelete(): void; variant?: 'aside' | 'drawer' }) {
  const Icon = kindIcons[resource.kind];
  const actions = <div className="detail-caption-actions">
    <Button variant="secondary" size="sm" className="detail-open" onClick={() => openResource(resource)}><ArrowUpRight />{t('打开', 'Open')}</Button>
    <Menu trigger={<IconButton className="detail-menu" label={t('资源操作', 'Resource actions')}><MoreHorizontal /></IconButton>} items={[
      { id: 'version', label: t('版本信息', 'Version information'), icon: <History />, onSelect: onVersion },
      { id: 'delete', label: t('删除资源', 'Delete resource'), icon: <Trash2 />, onSelect: onDelete, disabled: resource.status === 'readonly', danger: true, separatorBefore: true },
    ]} />
  </div>;
  return <div className={`resource-detail ${variant === 'drawer' ? 'is-drawer-detail' : ''}`}>
    {variant === 'aside'
      ? <div className="detail-caption"><span>{t('当前资源', 'Current resource')}</span>{actions}</div>
      : <div className="detail-sheet-bar"><ResourceStatus resource={resource} t={t} />{actions}</div>}
    {variant === 'aside' && <div className="detail-title"><Icon size={18} aria-hidden="true" /><h2>{resource.name}</h2></div>}
    {variant === 'aside' && <ResourceStatus resource={resource} t={t} />}
    <p className="resource-summary">{resource.summary || t('暂无摘要', 'No summary')}</p>
    <dl className="property-list"><div><dt>{t('类型', 'Type')}</dt><dd>{kindLabel(resource.kind, t)}</dd></div><div><dt>{t('创建者', 'Created by')}</dt><dd>{resource.creator}</dd></div><div><dt>{t('最近更新', 'Updated')}</dt><dd>{formatDate(resource.updatedAt, locale)}</dd></div><div><dt>{t('版本', 'Version')}</dt><dd>{resource.version}</dd></div></dl>
    {resource.tags.length > 0 && <div className="resource-tags"><span>{t('标签', 'Tags')}</span><div>{resource.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}</div></div>}
  </div>;
}

function CreateResource({ open, onOpenChange, t, resources, save }: { open: boolean; onOpenChange(open: boolean): void; t: Translate; resources: Resource[]; save(resources: Resource[]): string | undefined }) {
  const [name, setName] = useState('');
  const [kind, setKind] = useState<ResourceKind>('document');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagDraft, setTagDraft] = useState('');
  const [tagError, setTagError] = useState('');
  const [ready, setReady] = useState(false);
  const [nameError, setNameError] = useState('');
  const [saveError, setSaveError] = useState('');
  const nameInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!open) return;
    setName(''); setSummary(''); setKind('document'); setReady(false); setNameError(''); setSaveError('');
    setTags([]); setTagDraft(''); setTagError('');
  }, [open]);
  function validateName() {
    const trimmed = name.trim();
    if (!trimmed) { setNameError(t('请输入资源名称。', 'Enter a resource name.')); return false; }
    if (resources.some(item => item.name.toLocaleLowerCase() === trimmed.toLocaleLowerCase())) { setNameError(t('这个名称已存在，请换一个。', 'That name already exists. Choose another.')); return false; }
    setNameError('');
    return true;
  }
  function validateTags() {
    const result = appendResourceTags(tags, tagDraft);
    setTagError(result.error ? resourceTagError(result.error, t) : '');
    return result.tags;
  }
  function addTags() {
    const next = validateTags();
    if (!next) return;
    setTags(next);
    setTagDraft('');
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateName()) { nameInput.current?.focus(); return; }
    const nextTags = validateTags();
    if (!nextTags) { event.currentTarget.querySelector<HTMLInputElement>('#resource-tags')?.focus(); return; }
    if (resources.length >= 500) { setSaveError(t('本地演示最多保存 500 项资源。', 'The local demo supports up to 500 resources.')); return; }
    const trimmed = name.trim();
    const resource: Resource = { id: crypto.randomUUID(), name: trimmed, kind, status: ready ? 'ready' : 'draft', summary: summary.trim(), creator: '林杏', updatedAt: new Date().toISOString(), version: 'v0.1', tags: nextTags };
    const failure = save([resource, ...resources]);
    if (failure) setSaveError(failure); else onOpenChange(false);
  }
  return <Dialog open={open} onOpenChange={onOpenChange} title={t('新建资源', 'New resource')} closeLabel={t('关闭', 'Close')} initialFocusRef={nameInput}
    footer={<><Button variant="secondary" onClick={() => onOpenChange(false)}>{t('取消', 'Cancel')}</Button><Button type="submit" form="create-resource">{t('创建资源', 'Create resource')}</Button></>}>
    <form id="create-resource" className="resource-form" onSubmit={submit} noValidate>
      <FormField id="resource-name" label={t('资源名称', 'Resource name')} required hint={t('最多 120 个字符；名称不可重复。', 'Up to 120 characters; names must be unique.')} error={nameError}><Input ref={nameInput} value={name} maxLength={120} onBlur={validateName} onChange={event => { setName(event.target.value); setNameError(''); }} /></FormField>
      <FormField label={t('资源类型', 'Resource type')}><Select value={kind} onValueChange={value => setKind(value as ResourceKind)} options={(['document', 'spec', 'checklist', 'example'] as const).map(value => ({ value, label: kindLabel(value, t) }))} /></FormField>
      <FormField label={t('摘要', 'Summary')} hint={t('最多 1000 个字符。', 'Up to 1,000 characters.')}><Textarea value={summary} maxLength={1000} rows={3} onChange={event => setSummary(event.target.value)} /></FormField>
      <FormField id="resource-tags" label={t('标签', 'Tags')} error={tagError}
        hint={t(`可选。用逗号分隔，回车或点“添加”。最多 ${resourceTagLimits.count} 个，每个不超过 ${resourceTagLimits.length} 个字符。`,
          `Optional. Separate tags with commas, then press Enter or Add. Up to ${resourceTagLimits.count} tags, ${resourceTagLimits.length} characters each.`)}>
        <TagInput value={tags} onValueChange={value => { setTags(value); setTagError(''); }}
          draft={tagDraft} onDraftChange={value => { setTagDraft(value); setTagError(''); }} onAdd={addTags}
          addLabel={t('添加', 'Add')} removeLabel={tag => t(`移除标签 ${tag}`, `Remove tag ${tag}`)} />
      </FormField>
      <Checkbox checked={ready} onChange={event => setReady(event.target.checked)}>{t('标记为已就绪', 'Mark as ready')}</Checkbox>
      {saveError && <InlineAlert tone="danger">{saveError}</InlineAlert>}
    </form>
  </Dialog>;
}
