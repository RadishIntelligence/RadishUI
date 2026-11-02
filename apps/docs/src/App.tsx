import { useEffect, useRef, useState } from 'react';
import { Button } from '@radish-ui/react';

const repository = 'https://github.com/RadishIntelligence/RadishUI';
const colors = [
  ['bg-app', '页面'], ['bg-surface', '表面'], ['brand-primary', '品牌'],
  ['action-primary', '操作'], ['text-primary', '文字'], ['state-danger', '危险'],
] as const;

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('点击按钮，体验加载与完成状态。');
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => { document.documentElement.dataset.rdTheme = theme; }, [theme]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  function runExample() {
    setSaving(true);
    setMessage('正在运行本地交互示例…');
    timer.current = window.setTimeout(() => {
      setSaving(false);
      setMessage('示例已完成。此操作只演示组件状态。');
    }, 900);
  }

  return (
    <>
      <a className="skip-link" href="#main">跳到主要内容</a>
      <header className="site-header">
        <a className="wordmark" href="#main"><span className="brand-mark" aria-hidden="true">r.</span>RadishUI</a>
        <div className="header-actions">
          <Button variant="ghost" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={`切换至${theme === 'light' ? '深色' : '浅色'}主题`}>
            {theme === 'light' ? '深色模式' : '浅色模式'}
          </Button>
          <a className="repository-link" href={repository}>GitHub ↗</a>
        </div>
      </header>
      <div className="layout">
        <aside className="sidebar">
          <span className="sidebar-label">设计系统</span>
          <nav aria-label="页面导航">
            <a href="#overview">概览 <span>01</span></a>
            <a href="#foundations">视觉基础 <span>02</span></a>
            <a href="#components">组件 <span>03</span></a>
            <a href="#platforms">平台与接入 <span>04</span></a>
          </nav>
          <p className="sidebar-note">工程预览 · 0.1.0<br />视觉基准持续打磨中</p>
        </aside>
        <main id="main">
          <section className="intro" id="overview">
            <div className="intro-title"><h1>共同的设计，<br /><span>落在每个细节。</span></h1><span className="preview-badge">工程预览</span></div>
            <p>Radish 家族的共享设计系统。从视觉基础到真实组件，让每个产品拥有熟悉而连贯的体验。</p>
            <a className="text-link" href="#components">探索第一个组件 <span aria-hidden="true">↘</span></a>
          </section>
          <section className="section" id="foundations" aria-labelledby="foundations-title">
            <div className="section-heading"><h2 id="foundations-title">视觉基础</h2><span>温润 · 克制 · 清晰</span></div>
            <div className="swatches">
              {colors.map(([token, label]) => <div className="swatch" key={token}>
                <div className="swatch-color" style={{ background: `var(--rd-${token})` }} />
                <strong>{label}</strong><code>{token}</code>
              </div>)}
            </div>
            <p className="section-note">亮暗主题使用同一组语义。当前取值是首版探索，尚未冻结为家族正式视觉标准。</p>
          </section>
          <section className="section" id="components" aria-labelledby="components-title">
            <div className="section-heading"><h2 id="components-title">Button</h2><span>React · 首个组件</span></div>
            <div className="component-preview">
              <div className="preview-toolbar"><span>层级与状态</span><code>@radish-ui/react</code></div>
              <div className="button-examples">
                <Button onClick={runExample}>主要操作</Button>
                <Button variant="secondary" onClick={() => setMessage('已触发次要操作示例。')}>次要操作</Button>
                <Button variant="ghost" onClick={() => setMessage('已触发轻量操作示例。')}>轻量操作</Button>
                <Button variant="danger" onClick={() => setMessage('危险样式示例，不执行删除。')}>危险操作</Button>
                <Button disabled>暂不可用</Button>
              </div>
              <div className="interactive-example">
                <div><h3>让状态有迹可循</h3><p role="status" aria-live="polite">{message}</p></div>
                <Button loading={saving} onClick={runExample}>{saving ? '运行中' : '运行示例'}</Button>
              </div>
            </div>
            <pre className="code-example"><code>{`import { Button } from '@radish-ui/react';\n\n<Button loading={saving} onClick={save}>保存更改</Button>`}</code></pre>
          </section>
          <section className="section" id="platforms" aria-labelledby="platforms-title">
            <div className="section-heading"><h2 id="platforms-title">平台与接入</h2><span>同源设计，分别实现</span></div>
            <div className="platform-row"><strong>Tokens</strong><p>JSON 单一来源，生成 CSS 语义变量。</p><span className="platform-status">已建立</span></div>
            <div className="platform-row"><strong>React</strong><p>展示站直接引用 workspace 组件。</p><span className="platform-status">Button 预览</span></div>
            <div className="platform-row"><strong>Flutter</strong><p>预留主题与组件适配目录。</p><span className="platform-status neutral">待建设</span></div>
            <a className="text-link" href={`${repository}/tree/master/docs`}>阅读项目文档 ↗</a>
          </section>
          <footer className="site-footer"><span>Radish Intelligence</span><span>细节共享，体验连贯。</span></footer>
        </main>
      </div>
    </>
  );
}
