import type { ReactNode } from 'react';
import { Avatar, IconButton, Menu, Tooltip } from '@radish-ui/react';
import { BookOpen, Check, ChevronDown, Compass, FileText, FolderOpen, LifeBuoy, Package, Palette, PanelLeftClose, PanelLeftOpen, SlidersHorizontal, Star, SunMoon } from 'lucide-react';
import type { Page, Translate } from './model';

interface ShellProps {
  page: Page; collapsed: boolean; onCollapse(): void; onHelp(): void; onTheme(): void;
  t: Translate; children: ReactNode;
}
export function Shell({ page, collapsed, onCollapse, onHelp, onTheme, t, children }: ShellProps) {
  const designLinks = [
    { page: 'overview', href: '#/overview', label: t('概览', 'Overview'), Icon: Compass },
    { page: 'foundations', href: '#/foundations', label: t('视觉基础', 'Foundations'), Icon: Palette },
    { page: 'components', href: '#/components', label: t('组件用法', 'Components'), Icon: BookOpen },
    { page: 'platforms', href: '#/platforms', label: t('平台与接入', 'Platforms'), Icon: Package },
  ] as const;
  const links = [
    { page: 'resources', href: '#/resources', label: t('资源库', 'Resources'), mobile: t('资源', 'Resources'), Icon: FolderOpen },
    { page: 'document', href: '#/document', label: t('文档', 'Documents'), mobile: t('文档', 'Docs'), Icon: FileText },
    { page: 'settings', href: '#/settings', label: t('偏好设置', 'Preferences'), mobile: t('偏好', 'Settings'), Icon: SlidersHorizontal },
  ] as const;
  const workspace = <Menu align="start" label={t('当前工作区', 'Current workspace')} trigger={
    <button className="workspace-switch" aria-label={t('工作区菜单', 'Workspace menu')}>
      <Avatar name={t('演示空间', 'Demo space')} fallback={t('演', 'D')} shape="square" size="md" decorative />
      <strong className="rail-label">{t('演示空间', 'Demo space')}</strong><ChevronDown className="rail-label" size={15} />
    </button>
  } items={[
    { id: 'demo', label: t('演示空间', 'Demo space'), icon: <Check />, disabled: true },
    { id: 'help', label: t('关于本地演示', 'About this demo'), icon: <LifeBuoy />, onSelect: onHelp },
  ]} />;
  const account = <Menu label={t('林杏 · 示例成员', 'Lin Xing · Demo member')} trigger={
    <button className="account-switch" aria-label={t('账号菜单', 'Account menu')}>
      <Avatar name={t('林杏', 'Lin Xing')} fallback={t('林', 'L')} size="lg" decorative />
      <span className="account-text rail-label"><strong>{t('林杏', 'Lin Xing')}</strong><span>{t('示例成员', 'Demo member')}</span></span>
      <ChevronDown className="rail-label" size={15} />
    </button>
  } items={[
    { id: 'overview', label: t('概览', 'Overview'), icon: <Compass />, href: '#/overview' },
    { id: 'foundations', label: t('视觉基础', 'Foundations'), icon: <Palette />, href: '#/foundations' },
    { id: 'components', label: t('组件用法', 'Components'), icon: <BookOpen />, href: '#/components' },
    { id: 'platforms', label: t('平台与接入', 'Platforms'), icon: <Package />, href: '#/platforms' },
    { id: 'preferences', label: t('外观与偏好', 'Appearance & preferences'), icon: <SlidersHorizontal />, href: '#/settings', separatorBefore: true },
    { id: 'project', label: t('项目文档', 'Project documentation'), icon: <BookOpen />, href: 'https://github.com/RadishIntelligence/RadishUI/tree/master/docs', separatorBefore: true },
  ]} />;
  return <div className={`workbench ${collapsed ? 'is-collapsed' : ''}`}>
    <a className="skip-link" href="#main" onClick={event => { event.preventDefault(); document.getElementById('main')?.focus(); }}>{t('跳到主要内容', 'Skip to content')}</a>
    <aside className="app-rail" aria-label={t('工作区侧栏', 'Workspace sidebar')}>
      <div className="rail-surface">
        <div className="rail-brand"><a href="#/overview" aria-label="RadishUI"><span className="brand-full">RadishUI</span><span className="brand-short">R</span></a>
          <div className="rail-brand-actions">
            <Tooltip content={t('切换明暗外观', 'Toggle appearance')}><IconButton className="rail-theme" label={t('切换明暗外观', 'Toggle appearance')} onClick={onTheme}><SunMoon /></IconButton></Tooltip>
            <Tooltip content={collapsed ? t('展开侧栏', 'Expand sidebar') : t('收起侧栏', 'Collapse sidebar')}>
              <IconButton label={collapsed ? t('展开侧栏', 'Expand sidebar') : t('收起侧栏', 'Collapse sidebar')} onClick={onCollapse}>
                {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
              </IconButton>
            </Tooltip>
          </div>
        </div>
        {workspace}
        <nav className="rail-navigation" aria-label={t('设计系统', 'Design system')}>
          <span className="rail-group-label rail-label">{t('设计系统', 'Design system')}</span>
          {designLinks.map(({ href, page: key, label, Icon }) => <a className={`rail-link ${page === key ? 'is-active' : ''}`} key={key} href={href}
            aria-current={page === key ? 'page' : undefined} aria-label={label}>
            <Icon aria-hidden="true" /><span className="rail-label">{label}</span>
          </a>)}
        </nav>
        <nav className="rail-navigation" aria-label={t('演示', 'Demo')}>
          <span className="rail-group-label rail-label">{t('演示', 'Demo')}</span>
          {links.map(({ href, page: key, label, Icon }) => <a className={`rail-link ${page === key ? 'is-active' : ''}`} key={key} href={href}
            aria-current={page === key ? 'page' : undefined} aria-label={label}>
            <Icon aria-hidden="true" /><span className="rail-label">{label}</span>
          </a>)}
        </nav>
        <nav className="rail-favorites" aria-label={t('收藏', 'Favorites')}>
          <span className="rail-group-label rail-label">{t('收藏', 'Favorites')}</span>
          <a className="rail-link" href="#/document/theme-colors" aria-label={t('主题与配色', 'Theme & colors')}><Star aria-hidden="true" /><span className="rail-label">{t('主题与配色', 'Theme & colors')}</span></a>
          <a className="rail-link" href="#/document/control-states" aria-label={t('控件状态检查表', 'Control states')}><Star aria-hidden="true" /><span className="rail-label">{t('控件状态检查表', 'Control states')}</span></a>
        </nav>
        <div className="rail-spacer" />
        <button className="rail-link help-link" onClick={onHelp} aria-label={t('帮助与反馈', 'Help & feedback')}><LifeBuoy aria-hidden="true" /><span className="rail-label">{t('帮助与反馈', 'Help & feedback')}</span></button>
        {account}
      </div>
    </aside>
    <section className="workspace-panel" aria-label={t('演示空间', 'Demo space')}>
      <header className="workspace-header">
        <div className="mobile-workspace">{workspace}</div>
        <div className="header-actions">
          <Tooltip content={t('切换明暗外观', 'Toggle appearance')}><IconButton label={t('切换明暗外观', 'Toggle appearance')} onClick={onTheme}><SunMoon /></IconButton></Tooltip>
          <div className="mobile-account">{account}</div>
        </div>
      </header>
      {children}
    </section>
    <nav className="mobile-navigation" aria-label={t('底部导航', 'Bottom navigation')}>
      {links.map(({ href, page: key, mobile, Icon }) => <a key={key} className={page === key ? 'is-active' : ''} href={href} aria-current={page === key ? 'page' : undefined}>
        <Icon aria-hidden="true" /><span>{mobile}</span>
      </a>)}
    </nav>
  </div>;
}
