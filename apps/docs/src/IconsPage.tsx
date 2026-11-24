import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@radish-ui/react';
import type { Translate } from './model';
import { PageHeader } from './PageHeader';
import { CopyButton } from './CopyButton';
import { iconReference, iconReferenceGroupLabels, iconReferenceGroups } from './icon-reference';
import './component-site.css';
import './icons.css';

export function IconsPage({ t }: { t: Translate }) {
  const [query, setQuery] = useState('');
  const search = query.trim().toLocaleLowerCase();
  const filtered = iconReference.filter(icon => !search
    || [icon.name, icon.zh, icon.en].some(value => value.toLocaleLowerCase().includes(search)));
  const groups = iconReferenceGroups.map(group => ({ group, label: t(iconReferenceGroupLabels[group].zh, iconReferenceGroupLabels[group].en), icons: filtered.filter(icon => icon.group === group) }))
    .filter(entry => entry.icons.length > 0);
  return <section className="icons-page">
    <PageHeader title={t('图标参考', 'Icon reference')} back={{ href: '#/overview', label: t('概览', 'Overview') }} />
    <p className="icons-intro">{t('图标沿用 lucide-react，不新增第二套图标依赖。下表是展示站与组件示例实际使用的图标，按用途分组；尺寸 16 / 18 / 20，颜色消费当前文字色，纯装饰图标对辅助技术隐藏。',
      'Icons come from lucide-react; no second icon dependency is introduced. This list covers the icons actually used by the showcase and component examples, grouped by role. Sizes follow 16 / 18 / 20, color follows the current text color, and decorative icons are hidden from assistive technology.')}</p>
    <div className="icons-toolbar">
      <label className="icons-search" htmlFor="icon-search">
        <span className="sr-only">{t('搜索图标', 'Search icons')}</span>
        <Search size={18} aria-hidden="true" />
        <Input id="icon-search" type="search" value={query} placeholder={t('按名称或用途搜索…', 'Search by name or role…')}
          onChange={event => setQuery(event.target.value)} />
      </label>
      <span className="icons-count" role="status">{t(`共 ${filtered.length} 个图标`, `${filtered.length} icons`)}</span>
    </div>
    {groups.length === 0 ? <p className="icons-empty" role="status">{t('没有匹配的图标。', 'No icons match.')}</p> : <div className="icons-groups">
      {groups.map(({ group, label, icons }) => <section className="icons-group" key={group} aria-labelledby={`icons-${group}`}>
        <h2 id={`icons-${group}`}>{label}</h2>
        <ul className="icons-grid">
          {icons.map(icon => <li className="icon-card" key={icon.name}>
            <span className="icon-glyph"><icon.Icon size={20} aria-hidden="true" /></span>
            <div className="icon-meta"><code>{icon.name}</code><span className="icon-zh">{t(icon.zh, icon.en)}</span></div>
            <CopyButton text={`import { ${icon.name} } from 'lucide-react';`} label={t(`复制 ${icon.name} 导入`, `Copy ${icon.name} import`)} />
          </li>)}
        </ul>
      </section>)}
    </div>}
    <p className="icons-note">{t('使用图标时保持图标与文字一致：纯装饰图标设置 aria-hidden，图标按钮必须提供可访问名称（IconButton 的 label），状态含义不要只靠图标传达。',
      'Keep icon and text consistent: hide decorative icons with aria-hidden, always give icon buttons an accessible name (IconButton label), and never convey status by icon alone.')}</p>
  </section>;
}
