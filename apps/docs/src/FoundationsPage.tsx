import { Button, FormField, Input, StatusBadge, Tag } from '@radish-ui/react';
import { ArrowLeft, Check, FileText, Palette, Search, ShieldCheck, SlidersHorizontal, SunMoon } from 'lucide-react';
import type { Translate } from './model';
import './foundations.css';

const colorTokens = ['brand-primary', 'action-primary', 'bg-app', 'bg-surface', 'bg-muted', 'bg-selected', 'text-primary', 'text-secondary', 'text-action', 'border-soft', 'border-control', 'state-success', 'state-warning', 'state-danger'] as const;
const icons = [
  { Icon: Palette, label: 'Palette' }, { Icon: SunMoon, label: 'SunMoon' }, { Icon: SlidersHorizontal, label: 'Sliders' },
  { Icon: Search, label: 'Search' }, { Icon: FileText, label: 'FileText' }, { Icon: ShieldCheck, label: 'ShieldCheck' },
] as const;
const spaces = ['space-1', 'space-2', 'space-3', 'space-4', 'space-6'] as const;
const radii = ['radius-small', 'radius-control', 'radius-panel', 'radius-shell', 'radius-pill'] as const;

export function FoundationsPage({ t }: { t: Translate }) {
  return <section className="foundations-page">
    <div className="page-title"><h1>{t('视觉基础', 'Foundations')}</h1><a className="text-link foundations-back" href="#/components"><ArrowLeft size={16} aria-hidden="true" />{t('组件用法', 'Components')}</a></div>
    <p className="foundations-intro">{t('本页使用当前 --rd-* 语义 token 与共享组件，展示家族视觉基础；不是新的组件清单，也不替代设计文档。', 'This page uses the current --rd-* semantic tokens and shared components to document the family visual foundation. It is not a new component list or a replacement for the design docs.')}</p>

    <section className="foundation-section" aria-labelledby="foundation-color">
      <header className="foundation-heading"><span className="foundation-eyebrow">01 / Color</span><h2 id="foundation-color">{t('语义颜色', 'Semantic color')}</h2><p>{t('浅色 / 深色使用同一组角色名；品牌色负责识别，操作色负责操作，状态色只表达状态。', 'Light and dark share the same role names. Brand identifies, action acts, and state colors only describe state.')}</p></header>
      <div className="foundation-theme-grid">
        {(['light', 'dark'] as const).map(theme => <div className="foundation-theme-card" data-rd-theme={theme} key={theme}>
          <div className="foundation-theme-head"><strong>{theme === 'light' ? t('浅色', 'Light') : t('深色', 'Dark')}</strong><code>data-rd-theme=&quot;{theme}&quot;</code></div>
          <div className="foundation-swatches">{colorTokens.map(token => <div className="foundation-swatch" key={token}>
            <span className="foundation-swatch-color" style={{ background: `var(--rd-${token})` }} aria-hidden="true" />
            <span><strong>{token}</strong><code>--rd-{token}</code></span>
          </div>)}</div>
        </div>)}
      </div>
    </section>

    <section className="foundation-section" aria-labelledby="foundation-type">
      <header className="foundation-heading"><span className="foundation-eyebrow">02 / Type</span><h2 id="foundation-type">{t('字体与字阶', 'Type & scale')}</h2><p>{t('Inter Variable 负责界面与正文，系统 CJK 回退；JetBrains Mono Variable 负责代码、路径与数值。', 'Inter Variable handles UI and body, with system CJK fallback. JetBrains Mono Variable handles code, paths, and figures.')}</p></header>
      <div className="foundation-type-grid">
        <div className="foundation-type-card"><span className="foundation-meta">Display / title</span><p className="foundation-type-title">{t('让界面回到内容本身', 'Let the interface return to content')}</p><code>--rd-font-size-title</code></div>
        <div className="foundation-type-card"><span className="foundation-meta">Body</span><p className="foundation-type-body">{t('中文与 English 自然并排，正文随可用宽度编排，保留清楚的阅读节奏。', 'Chinese and English sit together naturally; body text follows the available width and keeps a clear reading rhythm.')}</p><code>--rd-font-size-body</code></div>
        <div className="foundation-type-card"><span className="foundation-meta">UI / small</span><p className="foundation-type-ui">{t('按钮、标签、表格和设置字段使用稳定的界面字号。', 'Buttons, labels, tables, and settings use a stable UI size.')}</p><code>--rd-font-size-sm</code></div>
        <div className="foundation-type-card"><span className="foundation-meta">Mono</span><p className="foundation-type-mono">v26.11.1 · #/foundations · 16 / 18 / 20</p><code>--rd-font-mono</code></div>
      </div>
      <div className="foundation-font-stack"><div><strong>Sans</strong><code>Inter Variable, Inter, system CJK</code></div><div><strong>Mono</strong><code>JetBrains Mono Variable, system mono</code></div></div>
    </section>

    <section className="foundation-section" aria-labelledby="foundation-icons">
      <header className="foundation-heading"><span className="foundation-eyebrow">03 / Icons</span><h2 id="foundation-icons">{t('图标', 'Icons')}</h2><p>{t('运行时统一 lucide-react；16 / 18 / 20 三档，stroke 2，currentColor。品牌 Logo 与插画不进入通用图标。', 'Runtime icons use lucide-react only: 16 / 18 / 20, stroke 2, currentColor. Brand logos and illustrations are separate assets.')}</p></header>
      <div className="foundation-icon-grid">{icons.map(({ Icon, label }) => <div className="foundation-icon" key={label}><Icon size={18} aria-hidden="true" /><span>{label}</span></div>)}</div>
      <div className="foundation-icon-sizes"><span><Check size={16} aria-hidden="true" />16</span><span><Check size={18} aria-hidden="true" />18</span><span><Check size={20} aria-hidden="true" />20</span></div>
    </section>

    <section className="foundation-section" aria-labelledby="foundation-shape">
      <header className="foundation-heading"><span className="foundation-eyebrow">04 / Space & shape</span><h2 id="foundation-shape">{t('空间、圆角与层级', 'Space, radius & elevation')}</h2><p>{t('4px 基础网格；圆角按控件、面板和外壳分层；阴影只用来表达浮层与抬升。', 'A 4px base grid; radii separate controls, panels, and shells; shadows only express layers and elevation.')}</p></header>
      <div className="foundation-shape-grid">
        <div className="foundation-shape-card"><span className="foundation-meta">{t('间距', 'Spacing')}</span>{spaces.map(space => <div className="foundation-space-row" key={space}><code>{space}</code><span className="foundation-space-bar" style={{ width: `var(--rd-${space})` }} aria-hidden="true" /></div>)}</div>
        <div className="foundation-shape-card"><span className="foundation-meta">{t('圆角', 'Radius')}</span><div className="foundation-radius-grid">{radii.map(radius => <div className="foundation-radius" key={radius} style={{ borderRadius: `var(--rd-${radius})` }}><code>{radius}</code></div>)}</div></div>
        <div className="foundation-shape-card"><span className="foundation-meta">{t('层级', 'Elevation')}</span><div className="foundation-shadow-grid"><div className="foundation-shadow" style={{ boxShadow: 'var(--rd-shadow-raised)' }}><code>shadow-raised</code></div><div className="foundation-shadow" style={{ boxShadow: 'var(--rd-shadow-popup)' }}><code>shadow-popup</code></div></div></div>
      </div>
    </section>

    <section className="foundation-section" aria-labelledby="foundation-states">
      <header className="foundation-heading"><span className="foundation-eyebrow">05 / States</span><h2 id="foundation-states">{t('组件状态', 'Component states')}</h2><p>{t('状态不只靠颜色：动作、文字、边框和焦点共同说明当前可做什么。', 'State is not color alone: action, text, border, and focus together explain what can be done.')}</p></header>
      <div className="foundation-state-grid">
        <div className="foundation-state-card"><span className="foundation-meta">{t('按钮', 'Buttons')}</span><div className="foundation-state-row"><Button>主要</Button><Button variant="secondary">次要</Button><Button variant="ghost">幽灵</Button><Button variant="danger">危险</Button><Button loading>处理中</Button><Button disabled>不可用</Button></div></div>
        <div className="foundation-state-card"><FormField label={t('错误字段', 'Invalid field')} error={t('请补充适用范围。', 'Add the applicable scope.')}><Input readOnly value={t('保留输入，说明原因', 'Input stays, explain why')} /></FormField></div>
        <div className="foundation-state-card"><span className="foundation-meta">{t('标签与状态', 'Tags & status')}</span><div className="foundation-state-row"><Tag>排版</Tag><Tag>English tag</Tag><StatusBadge tone="success">已就绪</StatusBadge><StatusBadge tone="warning">草稿</StatusBadge><StatusBadge tone="danger">失败</StatusBadge></div></div>
      </div>
    </section>
  </section>;
}
