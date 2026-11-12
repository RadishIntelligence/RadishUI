import { StatusBadge } from '@radish-ui/react';
import { ArrowRight, ArrowUpRight, FileText, FolderOpen, Layers, Palette, SlidersHorizontal, Sparkles } from 'lucide-react';
import type { Translate } from './model';
import './site-pages.css';

const swatches = [
  ['bg-app', '页面', 'Page'], ['bg-surface', '表面', 'Surface'], ['brand-primary', '品牌', 'Brand'],
  ['action-primary', '操作', 'Action'], ['text-primary', '文字', 'Text'], ['state-danger', '危险', 'Danger'],
] as const;

export function OverviewPage({ t }: { t: Translate }) {
  const system = [
    { href: '#/foundations', icon: Palette, title: t('视觉基础', 'Foundations'), text: t('颜色、字体、图标、空间与状态。', 'Color, type, icons, space, and states.'), meta: 'F-02.4' },
    { href: '#/components', icon: Layers, title: t('组件用法', 'Components'), text: t('25 个共享组件的实际用法与键盘说明。', 'Practical usage and keyboard notes for 25 shared components.'), meta: 'C-02.4' },
    { href: '#/platforms', icon: Sparkles, title: t('平台与接入', 'Platforms'), text: t('Tokens、React、Flutter 与产品接入边界。', 'Tokens, React, Flutter, and product adoption boundaries.'), meta: 'F-01 · C-02' },
  ] as const;
  const demo = [
    { href: '#/resources', icon: FolderOpen, title: t('资源库', 'Resources'), text: t('扫描、筛选、详情与本地操作。', 'Scan, filter, detail, and local actions.') },
    { href: '#/document', icon: FileText, title: t('文档', 'Documents'), text: t('目录、阅读、编辑与本地保存。', 'Outline, reading, editing, and local saving.') },
    { href: '#/settings', icon: SlidersHorizontal, title: t('偏好设置', 'Preferences'), text: t('外观、密度、阅读与保存反馈。', 'Appearance, density, reading, and save feedback.') },
  ] as const;
  return <section className="overview-page">
    <div className="overview-hero">
      <div className="overview-copy">
        <div className="overview-badge"><StatusBadge tone="info">{t('工程预览 · 26.11.1', 'Engineering preview · 26.11.1')}</StatusBadge></div>
        <h1>{t('共同的设计，', 'Shared design,')}<br /><span>{t('落在每个细节。', 'in every detail.')}</span></h1>
        <p>{t('Radish 家族的共享设计系统。从视觉基础到真实组件，让每个产品拥有熟悉而连贯的体验。', 'The shared design system for the Radish family. From visual foundations to real components, every product should feel familiar and coherent.')}</p>
        <div className="overview-actions">
          <a className="rd-button rd-button--primary rd-button--md" href="#/resources">{t('进入演示', 'Open the demo')}<ArrowRight size={16} aria-hidden="true" /></a>
          <a className="rd-button rd-button--secondary rd-button--md" href="#/components">{t('浏览组件', 'Browse components')}</a>
        </div>
      </div>
      <div className="overview-palette" aria-label={t('视觉基础颜色', 'Foundation colors')}>
        <div className="overview-palette-head"><span>{t('视觉基础', 'Foundations')}</span><a href="#/foundations">{t('查看全部', 'View all')}<ArrowUpRight size={16} aria-hidden="true" /></a></div>
        <div className="overview-swatches">{swatches.map(([token, zh, en]) => <div className="overview-swatch" key={token}><span className="overview-swatch-color" style={{ background: `var(--rd-${token})` }} aria-hidden="true" /><strong>{t(zh, en)}</strong><code>--rd-{token}</code></div>)}</div>
        <p className="overview-palette-note">{t('同一组语义，浅色与深色各自成对。', 'One set of roles, paired across light and dark.')}</p>
      </div>
    </div>
    <div className="overview-section-head"><h2>{t('设计系统', 'Design system')}</h2><a className="overview-link" href="#/components">{t('全部组件', 'All components')}<ArrowRight size={16} aria-hidden="true" /></a></div>
    <div className="overview-card-grid">{system.map(({ href, icon: Icon, title, text, meta }) => <a className="overview-card" href={href} key={href}>
      <div className="overview-card-icon"><Icon size={20} aria-hidden="true" /></div><div><h3>{title}</h3><p>{text}</p><code>{meta}</code></div><ArrowUpRight className="overview-card-arrow" size={18} aria-hidden="true" />
    </a>)}</div>
    <div className="overview-section-head"><h2>{t('Workbench 演示', 'Workbench demo')}</h2><span>{t('本地合成数据', 'Local synthetic data')}</span></div>
    <div className="overview-demo-grid">{demo.map(({ href, icon: Icon, title, text }) => <a className="overview-demo" href={href} key={href}>
      <Icon size={20} aria-hidden="true" /><div><h3>{title}</h3><p>{text}</p></div><ArrowUpRight size={16} aria-hidden="true" />
    </a>)}</div>
    <footer className="overview-footer"><span>{t('工程预览 · v26.11.1', 'Engineering preview · v26.11.1')}</span><span>{t('F-02.4 第二版 · 2026-11-08', 'F-02.4 revision 2 · 2026-11-08')}</span><a href="https://github.com/RadishIntelligence/RadishUI">{t('项目文档', 'Project docs')} ↗</a></footer>
  </section>;
}
