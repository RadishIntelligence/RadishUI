import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Button, ConfirmDialog, Dialog, InlineAlert, Toast } from '@radish-ui/react';
import { Shell } from './Shell';
import { SettingsPage } from './SettingsPage';
import { ResourcesPage } from './ResourcesPage';
import { ArticlePage } from './ArticlePage';
import { ComponentsPage } from './ComponentsPage';
const CatalogPage = lazy(() => import('./CatalogPage').then(module => ({ default: module.CatalogPage })));
const ComponentDetailPage = lazy(() => import('./ComponentDetailPage').then(module => ({ default: module.ComponentDetailPage })));
const ChangelogPage = lazy(() => import('./ChangelogPage').then(module => ({ default: module.ChangelogPage })));
const SearchPage = lazy(() => import('./SearchPage').then(module => ({ default: module.SearchPage })));
const IconsPage = lazy(() => import('./IconsPage').then(module => ({ default: module.IconsPage })));
import { FoundationsPage } from './FoundationsPage';
import { OverviewPage } from './OverviewPage';
import { PlatformsPage } from './PlatformsPage';
import { defaultPreferences, isResources, parseRoute, type Preferences, type Resource } from './model';
import { findComponent } from './component-catalog';
import { readPreferences, readStored, storageKeys, writeStored } from './storage';

export function App() {
  const [initialPreferences] = useState(() => readPreferences());
  const [preferences, setPreferences] = useState(initialPreferences.value ?? defaultPreferences);
  const [preferenceError, setPreferenceError] = useState(initialPreferences.error);
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  const [collapsed, setCollapsed] = useState(false);
  const [resources, setResources] = useState<Resource[] | undefined>();
  const [resourceError, setResourceError] = useState<string>();
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [externalChange, setExternalChange] = useState(false);
  const [conflictOpen, setConflictOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;
  const updateDirty = useCallback((value: boolean) => { dirtyRef.current = value; setDirty(value); }, []);
  const currentHash = useRef(window.location.hash);
  const [pendingNavigation, setPendingNavigation] = useState<string>();
  const [notice, setNotice] = useState({ id: 0, message: '' });
  const [toastOpen, setToastOpen] = useState(false);
  const main = useRef<HTMLElement>(null);
  const t = useCallback((zh: string, en: string) => preferences.locale === 'en' ? en : zh, [preferences.locale]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      document.documentElement.dataset.rdTheme = preferences.theme === 'system' ? media.matches ? 'dark' : 'light' : preferences.theme;
      document.documentElement.dataset.density = preferences.density;
      document.documentElement.lang = preferences.locale === 'en' ? 'en' : 'zh-CN';
    };
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [preferences]);

  useEffect(() => {
    let active = true;
    setResourceError(undefined);
    import('./seed').then(({ initialResources }) => {
      if (!active) return;
      const stored = readStored(storageKeys.resources, isResources);
      setResourceError(stored.error);
      setResources(stored.error ? undefined : stored.value ?? initialResources);
    }).catch(error => {
      if (active) setResourceError(error instanceof Error ? error.message : String(error));
    });
    return () => { active = false; };
  }, [loadAttempt]);

  useEffect(() => {
    const onHashChange = () => {
      const nextHash = window.location.hash;
      const next = parseRoute(nextHash);
      const previous = parseRoute(currentHash.current);
      if (dirtyRef.current && (next.page !== previous.page || next.resourceId !== previous.resourceId || next.componentId !== previous.componentId || next.catalog !== previous.catalog)) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${currentHash.current}`);
        setPendingNavigation(nextHash);
        return;
      }
      currentHash.current = nextHash;
      setRoute(next);
    };
    const onBeforeUnload = (event: BeforeUnloadEvent) => { if (dirtyRef.current) { event.preventDefault(); event.returnValue = ''; } };
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || Object.values(storageKeys).includes(event.key as typeof storageKeys[keyof typeof storageKeys])) {
        setExternalChange(true); setConflictOpen(true);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('beforeunload', onBeforeUnload);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  useEffect(() => { main.current?.scrollTo({ top: 0 }); main.current?.focus({ preventScroll: true }); }, [route.page, route.resourceId ?? 'welcome', route.componentId, route.catalog]);
  useEffect(() => {
    const title = route.catalog ? t('组件目录', 'Component catalog')
      : route.componentId ? findComponent(route.componentId)?.name ?? t('组件用法', 'Components')
        : { resources: t('资源库', 'Resources'), settings: t('外观与偏好', 'Preferences'), document: t('文档', 'Document'), overview: t('概览', 'Overview'), components: t('组件用法', 'Components'), foundations: t('视觉基础', 'Foundations'), platforms: t('平台与接入', 'Platforms'), changelog: t('变更记录', 'Changelog'), icons: t('图标参考', 'Icon reference'), search: t('搜索', 'Search') }[route.page];
    document.title = `${title} · RadishUI`;
  }, [route.page, route.catalog, route.componentId, t]);

  function notify(message: string, enabled = preferences.notifications) {
    if (!enabled) return;
    setNotice({ id: Date.now(), message }); setToastOpen(true);
  }
  function savePreferences(next: Preferences) {
    if (externalChange) return t('其他标签页已更新，请重新载入后再保存。', 'Another tab made changes. Reload before saving.');
    const error = writeStored(storageKeys.preferences, next, 2);
    if (!error) { setPreferences(next); setPreferenceError(undefined); notify(next.locale === 'en' ? 'Preferences saved in this browser' : '偏好已保存到当前浏览器', next.notifications); }
    return error;
  }
  function saveResources(next: Resource[]) {
    if (externalChange) return t('其他标签页已更新，请重新载入后再保存。', 'Another tab made changes. Reload before saving.');
    const error = writeStored(storageKeys.resources, next);
    if (!error) { setResources(next); setResourceError(undefined); }
    return error;
  }

  return <Shell page={route.page} collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} onHelp={() => setHelpOpen(true)} t={t}
    notice={<Toast key={notice.id} message={notice.message} open={toastOpen} onOpenChange={setToastOpen} label={t('通知', 'Notification')} closeLabel={t('关闭通知', 'Dismiss notification')} />}
    onTheme={() => {
      if (dirty) { setPreferenceError(t('请先保存或取消当前更改，再切换快捷外观。', 'Save or cancel your edits before using the appearance shortcut.')); return; }
      const next = document.documentElement.dataset.rdTheme === 'dark' ? 'light' : 'dark';
      const error = savePreferences({ ...preferences, theme: next });
      if (error) setPreferenceError(error);
    }}>
    <main className={`workspace-main ${route.page === 'resources' ? 'is-fixed-page' : ''}`} id="main" tabIndex={-1} ref={main}>
      {preferenceError && <InlineAlert tone="danger" title={t('偏好未能读取或保存', 'Preferences could not be read or saved')}>{preferenceError} <Button variant="secondary" size="sm" onClick={() => {
        const error = savePreferences(preferences); if (error) setPreferenceError(error);
      }}>{t('重新保存当前偏好', 'Save current preferences again')}</Button></InlineAlert>}
      {route.page === 'overview' && <OverviewPage t={t} />}
      <Suspense fallback={<p className="page-loading">{t('正在加载组件文档…', 'Loading component docs…')}</p>}>
        {route.catalog && <CatalogPage t={t} />}
        {route.page === 'components' && route.componentId && <ComponentDetailPage id={route.componentId} section={route.componentSection} scrollRoot={main} t={t} />}
      </Suspense>
      {route.page === 'components' && !route.componentId && !route.catalog && <ComponentsPage t={t} />}
      {route.page === 'foundations' && <FoundationsPage t={t} />}
      {route.page === 'platforms' && <PlatformsPage t={t} />}
      <Suspense fallback={<p className="page-loading">{t('正在加载页面…', 'Loading page…')}</p>}>
        {route.page === 'changelog' && <ChangelogPage t={t} />}
        {route.page === 'icons' && <IconsPage t={t} />}
        {route.page === 'search' && <SearchPage t={t} />}
      </Suspense>
      {route.page === 'settings' && <SettingsPage preferences={preferences} save={savePreferences} t={t} onDirtyChange={updateDirty} />}
      {route.page === 'resources' && <ResourcesPage resources={resources} error={resourceError} save={saveResources} retry={() => setLoadAttempt(loadAttempt + 1)} t={t} locale={preferences.locale} density={preferences.density} notify={notify} />}
      {route.page === 'document' && <ArticlePage key={route.resourceId ?? 'welcome'} resourceId={route.resourceId} resources={resources} resourcesError={resourceError}
        preferences={preferences} section={route.section} scrollRoot={main} t={t} notify={notify} onDirtyChange={updateDirty} externalChange={externalChange} />}
    </main>
    <Dialog open={conflictOpen && externalChange} onOpenChange={setConflictOpen} title={t('其他标签页已更新本地数据', 'Local data changed in another tab')}
      description={t('重新载入会放弃当前未保存的更改。', 'Reloading discards unsaved changes.')} closeLabel={t('关闭', 'Close')}
      footer={<><Button variant="secondary" onClick={() => setConflictOpen(false)}>{t('稍后处理', 'Later')}</Button>
        <Button onClick={() => window.location.reload()}>{t('重新载入', 'Reload')}</Button></>}>
      <p>{t('当前页面已阻止覆盖写入，避免覆盖另一个标签页保存的内容。重新载入后会使用最新数据。', 'Saving is blocked here so the other tab’s changes are not overwritten. Reload to continue with the latest data.')}</p>
    </Dialog>
    <Dialog open={helpOpen} onOpenChange={setHelpOpen} title={t('关于演示空间', 'About the demo space')} closeLabel={t('关闭', 'Close')}>
      <div className="help-content"><p>{t('这里使用合成资源与示例成员。资源、文档和偏好仅保存在当前浏览器，不会发送到产品服务，也没有真实账号登录。', 'This space uses synthetic resources and a demo member. Resources, documents and preferences are saved only in this browser. There is no product service or real sign-in.')}</p>
        <p>{t('你可以尝试搜索、筛选、新建资源、编辑文档和切换外观。浏览器清除站点数据后，本地修改也会移除。', 'Try searching, filtering, creating resources, editing documents and changing appearance. Clearing site data also removes your local changes.')}</p>
        <a className="text-link" href="https://github.com/RadishIntelligence/RadishUI">{t('查看 RadishUI 项目', 'View the RadishUI project')} ↗</a>
        <a className="text-link" href={`${import.meta.env.BASE_URL}third-party-notices.txt`}>{t('第三方许可声明', 'Third-party license notices')}</a>
      </div>
    </Dialog>
    <ConfirmDialog open={pendingNavigation !== undefined} onOpenChange={open => { if (!open) setPendingNavigation(undefined); }} title={t('放弃未保存的更改？', 'Discard unsaved changes?')}
      description={t('离开此页后，当前未保存的修改会丢失。', 'Your unsaved edits will be lost when you leave this page.')} closeLabel={t('关闭', 'Close')}
      confirmLabel={t('放弃并离开', 'Discard & leave')} cancelLabel={t('继续编辑', 'Keep editing')} tone="danger"
      onConfirm={() => {
        const destination = pendingNavigation; setPendingNavigation(undefined); dirtyRef.current = false; setDirty(false);
        if (destination !== undefined) window.location.hash = destination;
      }}>
      <p>{t('已经保存的内容不会受影响。', 'Saved content is not affected.')}</p>
    </ConfirmDialog>
  </Shell>;
}
