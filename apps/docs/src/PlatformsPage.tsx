import { Card, StatusBadge, Tag } from '@radish-ui/react';
import { ArrowUpRight, Boxes, Code2, Layers, Package } from 'lucide-react';
import type { Translate } from './model';
import { PageHeader } from './PageHeader';
import './site-pages.css';

export function PlatformsPage({ t }: { t: Translate }) {
  const platforms = [
    { icon: Package, title: 'Tokens', text: t('JSON 单一来源，生成 CSS 语义变量；颜色、字体、间距、圆角与状态共用一套角色。', 'A single JSON source generates CSS semantic variables for color, type, space, radius, and state.'), status: t('已建立', 'Established'), tone: 'success' as const, href: 'https://github.com/RadishIntelligence/RadishUI/tree/master/packages/tokens' },
    { icon: Code2, title: 'React', text: t('25 个共享组件，展示站直接引用 workspace 源码。当前为内部预览。', 'The preview imports 25 shared components directly from the workspace.'), status: t('内部预览', 'Internal preview'), tone: 'info' as const, href: '#/components' },
    { icon: Layers, title: 'Flutter', text: t('预留主题与组件适配目录；等真实试点、范围和产物格式确认。', 'Reserved theme and component adapter directory, pending a real pilot, scope, and output format.'), status: t('待建设', 'Planned'), tone: 'neutral' as const, href: 'https://github.com/RadishIntelligence/RadishUI/tree/master/packages/flutter' },
  ] as const;
  return <section className="platforms-page">
    <PageHeader title={t('平台与接入', 'Platforms & adoption')} back={{ href: '#/overview', label: t('概览', 'Overview') }} />
    <p className="platforms-intro">{t('同源设计，分别实现。RadishUI 先提供通用视觉基础与 React 范例；产品采用、Flutter 与正式发行分别评估。', 'Shared design, separate implementations. RadishUI starts with visual foundations and React examples; product adoption, Flutter, and release are evaluated separately.')}</p>
    <div className="platforms-grid">{platforms.map(({ icon: Icon, title, text, status, tone, href }) => <Card asChild key={title}><a className="platform-card" href={href}>
      <div className="platform-card-head"><span className="platform-icon"><Icon size={20} aria-hidden="true" /></span><StatusBadge tone={tone}>{status}</StatusBadge></div>
      <h2>{title}</h2><p>{text}</p><span className="platform-link">{t('查看范围', 'View scope')}<ArrowUpRight size={16} aria-hidden="true" /></span>
    </a></Card>)}</div>
    <section className="platform-boundary" aria-labelledby="platform-boundary-title"><div><span className="platform-eyebrow">Boundary</span><h2 id="platform-boundary-title">{t('接入边界', 'Adoption boundary')}</h2></div><div>
      <p>{t('RadishUI 是家族通用 UI 源；产品仓只读参考，不自动接入、不建迁移分支、不做 P2 外部试点。', 'RadishUI is the family UI source; product repos are read-only references. No automatic adoption, migration branch, or external P2 pilot.')}</p>
      <div className="platform-tags"><Tag>{t('内部预览', 'Internal preview')}</Tag><Tag>{t('未发行', 'Unreleased')}</Tag><Tag>{t('产品只读', 'Products read-only')}</Tag></div>
      <a className="platforms-doc-link" href="https://github.com/RadishIntelligence/RadishUI/tree/master/docs">{t('阅读架构与接入文档', 'Read architecture and adoption docs')}<ArrowUpRight size={16} aria-hidden="true" /></a>
    </div></section>
    <div className="platform-footer"><span>v26.11.1</span><span>{t('React 19 内部预览', 'React 19 internal preview')}</span><span><Boxes size={16} aria-hidden="true" />{t('Flutter 预留', 'Flutter reserved')}</span></div>
  </section>;
}
