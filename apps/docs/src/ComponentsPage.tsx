import { useRef, useState, type ReactNode } from 'react';
import { Accordion, Avatar, Button, IconButton, FormField, Input, InputOTP, TagInput, Textarea, Select, RadioGroup, Checkbox, Switch, Tabs, TabsList, TabsContent, ToggleGroup, StatusBadge, Tag, Skeleton, ConfirmDialog, Dialog, Drawer, Menu, InlineAlert, Toast, Tooltip } from '@radish-ui/react';
import { ArrowLeft, Check, MoreHorizontal, Plus } from 'lucide-react';
import { appendResourceTags, resourceTagError, type Translate } from './model';
import './components.css';

function Example({ name, contract, keyboard, code, children }: { name: string; contract: string; keyboard: string; code: string; children: ReactNode }) {
  return <section className="component-example" aria-label={name}>
    <h2>{name}</h2>
    <div className="component-demo">{children}</div>
    <dl className="component-contract"><div><dt>Props / Events</dt><dd>{contract}</dd></div><div><dt>键盘 / 状态</dt><dd>{keyboard}</dd></div></dl>
    <details className="component-code"><summary>用法代码</summary><pre><code>{code}</code></pre></details>
  </section>;
}

function ActionExamples() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [iconLoading, setIconLoading] = useState(false);
  return <>
    <Example name="Button" contract="variant: primary | secondary | ghost | danger；size: sm | md；loading、disabled；原生 onClick / type / ref。默认 type=button。"
      keyboard="Tab 聚焦；Enter / Space 触发。悬停、按下和焦点可直接体验；loading 同时禁用并设置 aria-busy。示例开关只用于展示加载外观。"
      code={'<Button variant="secondary" onClick={() => setCount(n => n + 1)}>增加计数</Button>\n<Button loading={loading}>处理中</Button>'}>
      <div className="component-row">{(['primary', 'secondary', 'ghost', 'danger'] as const).map(variant => <Button key={variant} variant={variant} onClick={() => setCount(n => n + 1)}>{variant}</Button>)}</div>
      <div className="component-row"><Button size="sm" onClick={() => setCount(n => n + 1)}>小号按钮</Button><Button disabled>不可用</Button><Button loading={loading} onClick={() => setCount(n => n + 1)}>{loading ? '处理中' : '增加计数'}</Button></div>
      <Button variant="secondary" onClick={() => setCount(n => n + 1)}>查看中文与 English 资源的详细配置</Button>
      <Checkbox checked={loading} onChange={event => setLoading(event.target.checked)}>展示 loading 状态</Checkbox>
      <p role="status">已触发 {count} 次</p>
    </Example>
    <Example name="IconButton" contract="label 必填，提供可访问名称；children 为图标。其余 props 与 Button 相同，默认 ghost。"
      keyboard="Tab 聚焦；Enter / Space 触发。必要名称放在 label 中；禁用与加载不可触发。"
      code={'<IconButton label="增加计数" onClick={() => setCount(n => n + 1)}><Plus /></IconButton>'}>
      <div className="component-row"><IconButton label="增加计数" onClick={() => setCount(n => n + 1)}><Plus /></IconButton><IconButton label="不可用的新增操作" disabled><Plus /></IconButton><IconButton label={iconLoading ? '正在处理新增操作' : '增加计数（加载示例）'} loading={iconLoading} onClick={() => { setCount(n => n + 1); setIconLoading(true); window.setTimeout(() => setIconLoading(false), 900); }}><Plus /></IconButton></div>
    </Example>
  </>;
}

function FieldExamples() {
  const [name, setName] = useState('');
  const [nameTouched, setNameTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [selection, setSelection] = useState('');
  const [selectionChecked, setSelectionChecked] = useState(false);
  const [otp, setOtp] = useState('');
  const options = [{ value: 'document', label: '文档' }, { value: 'long', label: '中文与 English 长名称：用于验证选择器浮层的折行与边界' }, { value: 'unavailable', label: '暂不可选', disabled: true }];
  const nameInvalid = (submitted || nameTouched) && !name.trim();
  return <>
    <Example name="FormField" contract="label、hint / error、required、id、children。Input / Textarea / Select 自动关联标签、说明与错误；其他控件显式关联 id。"
      keyboard="点击标签聚焦控件；失焦或提交时校验，错误保留输入。error 优先于 hint；required 同时传给支持字段上下文的控件。"
      code={'<FormField label="名称" required error={error}><Input value={name} onBlur={validate} onChange={e => setName(e.target.value)} /></FormField>'}>
      <form className="component-stack" noValidate onSubmit={event => { event.preventDefault(); setSubmitted(true); setMessage(name.trim() ? `本地校验通过：${name.trim()}` : ''); }}>
        <FormField label="示例名称" required hint="必填，最多 120 个字符；失焦或提交时校验。" error={nameInvalid ? '请输入名称，已输入内容会保留。' : undefined}>
          <Input value={name} maxLength={120} onBlur={() => setNameTouched(true)} onChange={event => { setName(event.target.value); setMessage(''); }} />
        </FormField>
        <div className="component-row"><Button type="submit">校验名称</Button><Button variant="secondary" onClick={() => { setName(''); setNameTouched(false); setSubmitted(false); setMessage(''); }}>重置</Button></div>
        <p role="status">{message}</p>
      </form>
    </Example>
    <Example name="Input" contract="原生 input 属性：value / defaultValue、onChange、disabled、readOnly、type、ref；surface: outline（默认）| filled；可独立提供 aria-label。"
      keyboard="Tab 聚焦并输入；只读可聚焦、选择和复制，disabled 不进入 Tab 顺序。独立使用时由调用方提供标签与错误关联。"
      code={'<Input aria-label="搜索" placeholder="输入关键词" />\n<Input aria-label="版本" value="v0.1" readOnly />'}>
      <div className="component-fields"><FormField label="可编辑文本"><Input placeholder="输入中文或 English" /></FormField><FormField label="只读版本"><Input value="v0.1 / 内部预览" readOnly /></FormField><FormField label="禁用字段" hint="此字段在当前示例中不可编辑。"><Input value="不可编辑" disabled /></FormField></div>
    </Example>
    <Example name="Textarea" contract="原生 textarea 属性与字段上下文；surface: outline（默认）| filled；rows、maxLength、readOnly、disabled、onChange / ref。"
      keyboard="Enter 换行，Tab 离开；错误不清空内容。长正文在输入区滚动，支持拖动调整高度。"
      code={'<FormField label="说明"><Textarea rows={4} maxLength={1000} /></FormField>'}>
      <div className="component-fields"><FormField label="多行说明"><Textarea rows={3} defaultValue={'第一行中文说明。\nSecond line in English.'} /></FormField><FormField label="只读摘要"><Textarea rows={3} readOnly value="这是可以选择和复制的只读长文案。内容按可用宽度自然换行。" /></FormField><FormField label="禁用正文"><Textarea rows={3} disabled value="不可编辑" /></FormField><FormField label="待修订说明" error="示例错误：请补充适用范围。"><Textarea rows={3} defaultValue="保留这段草稿继续修改。" /></FormField><FormField label="填充说明（候选）" hint="surface=&quot;filled&quot;；默认仍是 outline。"><Textarea surface="filled" rows={3} defaultValue="填充表面只作为可选形态，不改变默认字段。" /></FormField></div>
    </Example>
    <Example name="InputOTP" contract="受控 value / onValueChange，label 必填，length（默认 6）、hint / error、required、disabled、autoFocus、name、onEnterPress。数字输入、自动前进、退格 / 方向键、粘贴填充。"
      keyboard="每个数字格可聚焦；输入自动前进，Backspace 清除当前或上一格，方向键 / Home / End 移动，粘贴按位填充；错误通过 aria-describedby 关联。"
      code={'<InputOTP label="六位验证码" value={otp} onValueChange={setOtp} />'}>
      <div className="component-fields">
        <InputOTP label="六位验证码" hint="输入发送到当前账号的 6 位数字。" value={otp} onValueChange={setOtp} />
        <InputOTP label="验证码错误" value="123" error="请输入完整的 6 位验证码。" onValueChange={() => {}} />
        <InputOTP label="验证码禁用" value="123456" disabled onValueChange={() => {}} />
      </div>
      <p role="status">已输入 {otp.length} / 6 位</p>
    </Example>
    <Example name="Select" contract="受控 value / onValueChange；options: { value, label, disabled? }[]；placeholder、disabled、required、name。无 readOnly prop。"
      keyboard="Space / Enter 展开；方向键、Home / End 选择；Enter 确认；Escape 关闭并恢复焦点。只读场景可直接显示已选文字。"
      code={'<FormField label="类型"><Select value={value} onValueChange={setValue} options={options} placeholder="请选择" /></FormField>'}>
      <div className="component-fields"><FormField label="示例类型" required error={selectionChecked && !selection ? '请选择一个类型。' : undefined}>
        <Select value={selection} onValueChange={setSelection} options={options} placeholder="请选择类型" />
      </FormField><FormField label="禁用选择器"><Select value="document" onValueChange={() => {}} options={options} disabled /></FormField></div>
      <div className="component-row"><Button variant="secondary" onClick={() => setSelectionChecked(true)}>校验选择</Button><Button variant="ghost" onClick={() => { setSelection(''); setSelectionChecked(false); }}>清空选择</Button></div>
      <p>当前值：{selection || '未选择'}</p>
    </Example>
    <TagInputExample />
  </>;
}

function TagInputExample() {
  const [tags, setTags] = useState(['组件']);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const removeLabel = (tag: string) => `移除标签 ${tag}`;
  function add() {
    const result = appendResourceTags(tags, draft);
    if (result.error) { setError(resourceTagError(result.error, chinese => chinese)); return; }
    setTags(result.tags);
    setDraft('');
    setError('');
  }
  return <Example name="TagInput" contract="受控 value / onValueChange、draft / onDraftChange、onAdd；addLabel、removeLabel、label、disabled。FormField 提供标签、帮助和错误关联。"
    keyboard="Enter 或添加按钮提交草稿；输入为空时 Backspace 移除末项；Tab 到逐项移除按钮，删除后回到输入框。"
    code={'<FormField label="标签">\n  <TagInput value={tags} onValueChange={setTags} draft={draft} onDraftChange={setDraft}\n    onAdd={add} addLabel="添加" removeLabel={tag => `移除标签 ${tag}`} />\n</FormField>'}>
    <div className="component-fields">
      <FormField label="示例标签" hint="用逗号分隔。每个标签最多 40 个字符，共 8 个。" error={error}>
        <TagInput value={tags} onValueChange={value => { setTags(value); setError(''); }}
          draft={draft} onDraftChange={value => { setDraft(value); setError(''); }} onAdd={add} addLabel="添加" removeLabel={removeLabel} />
      </FormField>
      <FormField label="不可用的标签" hint="禁用时仍可阅读现有标签。">
        <TagInput value={['只读示例']} onValueChange={() => {}} draft="" onDraftChange={() => {}} onAdd={() => {}} addLabel="添加" removeLabel={removeLabel} disabled />
      </FormField>
    </div>
  </Example>;
}

const avatarImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%232B3F55'/%3E%3Ccircle cx='32' cy='23' r='11' fill='%23DCE6F1'/%3E%3Cpath d='M12 62c3-14 11-20 20-20s17 6 20 20' fill='%23DCE6F1'/%3E%3C/svg%3E";

function SelectionExamples() {
  const [checked, setChecked] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [radio, setRadio] = useState('standard');
  const [radioHorizontal, setRadioHorizontal] = useState('compact');
  const [displayOptions, setDisplayOptions] = useState<string[]>(['standard']);
  const displayLabels: Record<string, string> = { compact: '紧凑', standard: '标准', spacious: '宽松', unavailable: '不可用' };
  return <>
    <Example name="RadioGroup" contract="受控 value / onValueChange；options: { value, label, disabled? }[]；orientation: vertical（默认）| horizontal；name、required、disabled。FormField 内自动关联标签、说明与错误。"
      keyboard="Tab 进入当前项，方向键移动并选中，Space 选中；禁用项跳过。"
      code={'<FormField label="显示密度"><RadioGroup value={radio} onValueChange={setRadio} options={[...]} /></FormField>'}>
      <div className="component-stack">
        <FormField label="示例密度" hint="单选组在 FormField 内共享标签与说明。">
          <RadioGroup value={radio} onValueChange={setRadio} options={[
            { value: 'compact', label: '紧凑' }, { value: 'standard', label: '标准' }, { value: 'spacious', label: '宽松' }, { value: 'unavailable', label: '不可用', disabled: true }, { value: 'disabled', label: '不可用示例', disabled: true },
          ]} />
        </FormField>
        <FormField label="水平单选">
          <RadioGroup orientation="horizontal" value={radioHorizontal} onValueChange={setRadioHorizontal} options={[{ value: 'compact', label: '紧凑' }, { value: 'standard', label: '标准' }]} />
        </FormField>
        <p role="status">当前密度：{radio}；水平示例：{radioHorizontal}</p>
      </div>
    </Example>
    <Example name="Avatar" contract="name（可访问名称与首字回退）、src、fallback、shape: circle（默认）/ square、size: sm / md / lg、decorative。图片加载失败时回退；纯展示不进入 Tab 顺序。"
      keyboard="不进入 Tab 顺序；非装饰用法用 name 提供可访问名称，装饰用法设置 decorative。"
      code={'<Avatar name="林杏" size="md" /><Avatar name="Lin Xing" src={src} shape="square" decorative />'}>
      <div className="component-row"><Avatar name="林杏" size="sm" /><Avatar name="Lin Xing" size="md" /><Avatar name="周远" size="lg" shape="square" /><Avatar name="Lin Xing" src={avatarImage} size="lg" /></div>
      <p role="status">首字回退、图片、圆形 / 方形与三档尺寸。</p>
    </Example>
    <Example name="Tag" contract="children 标签文本；className；纯展示，不进入 Tab 顺序。状态请用 StatusBadge，不用 Tag 伪装状态。"
      keyboard="不进入 Tab 顺序；标签不是操作，除非外层提供真实操作。"
      code={'<Tag>排版</Tag><Tag>English tag</Tag>'}>
      <div className="component-row"><Tag>排版</Tag><Tag>English tag</Tag><Tag>较长标签用于检查窄屏换行与边界</Tag></div>
    </Example>
    <Example name="ToggleGroup" contract="type: single（默认）| multiple；value / onValueChange；items: { value, label, disabled? }[]；label、disabled。单选返回 string，多选返回 string[]。"
      keyboard="Tab 进入组；方向键在项间移动，Space / Enter 切换；禁用项跳过。"
      code={'<ToggleGroup type="multiple" label="显示选项" value={value} onValueChange={setValue} items={items} />'}>
      <ToggleGroup type="multiple" label="显示选项" value={displayOptions} onValueChange={setDisplayOptions} items={[
        { value: 'compact', label: '紧凑' }, { value: 'standard', label: '标准' }, { value: 'spacious', label: '宽松' }, { value: 'unavailable', label: '不可用', disabled: true },
      ]} />
      <p role="status">当前：{displayOptions.length ? displayOptions.map(value => displayLabels[value]).join('、') : '未选择'}</p>
    </Example>
    <Example name="Checkbox" contract="原生 checked / defaultChecked、onChange、disabled、required；children 提供可见标签。"
      keyboard="Tab 聚焦、Space 切换；点击整段标签可切换。不提供只读交互，静态结果用文字表达。"
      code={'<Checkbox checked={checked} onChange={e => setChecked(e.target.checked)}>包含归档</Checkbox>'}>
      <div className="component-stack"><Checkbox checked={checked} onChange={event => setChecked(event.target.checked)}>包含归档资源：这是一段用于验证中文与 English 换行的较长标签</Checkbox><Checkbox disabled>不可用的选项</Checkbox><Checkbox checked disabled>已选择且不可用</Checkbox><p role="status">{checked ? '包含归档' : '仅当前资源'}</p></div>
    </Example>
    <Example name="Switch" contract="Radix Switch Root 属性：checked / onCheckedChange、disabled、id、aria-describedby。标签由调用方显式关联。"
      keyboard="Tab 聚焦；Space / Enter 切换。开关表达即时布尔状态；禁用时不可操作。"
      code={'<label htmlFor="notifications">操作通知</label>\n<Switch id="notifications" checked={enabled} onCheckedChange={setEnabled} />'}>
      <div className="component-row"><label htmlFor="example-switch">示例通知</label><Switch id="example-switch" checked={enabled} onCheckedChange={setEnabled} /><span role="status">{enabled ? '已开启' : '已关闭'}</span></div>
      <div className="component-row"><label htmlFor="example-switch-disabled">不可用的开关</label><Switch id="example-switch-disabled" disabled /><Switch aria-label="已开启且不可用" checked disabled /></div>
    </Example>
    <Example name="Tabs" contract="Tabs 接受 value / onValueChange 或 defaultValue；TabsList 的 label 与 items 定义具名标签；TabsContent 的 value 对应面板。"
      keyboard="Tab 进入当前项，左右方向键切换，Home / End 到首尾；禁用项跳过。焦点与选中分别呈现。"
      code={'<Tabs defaultValue="overview">\n  <TabsList label="详情分组" items={[{ value: "overview", label: "概览" }, { value: "history", label: "历史" }]} />\n  <TabsContent value="overview">概览内容</TabsContent>\n  <TabsContent value="history">历史内容</TabsContent>\n</Tabs>'}>
      <Tabs defaultValue="overview"><TabsList label="示例详情分组" items={[{ value: 'overview', label: '概览' }, { value: 'history', label: '历史' }, { value: 'locked', label: '不可用', disabled: true }]} /><TabsContent value="overview"><p className="component-tab-copy">概览：当前页面展示共享组件的实际运行状态。</p></TabsContent><TabsContent value="history"><p className="component-tab-copy">历史：这里只显示合成示例内容。</p></TabsContent></Tabs>
    </Example>
    <Example name="StatusBadge" contract="tone: neutral | info | success | warning | danger；children 为标签内容。纯展示，不接收点击事件。"
      keyboard="不进入 Tab 顺序，无 disabled / loading / readonly 交互状态。状态由文字表达，图标可辅助，不能只靠颜色。"
      code={'<StatusBadge tone="success"><Check aria-hidden="true" />已就绪</StatusBadge>'}>
      <div className="component-row"><StatusBadge>只读</StatusBadge><StatusBadge tone="info">处理中</StatusBadge><StatusBadge tone="success"><Check aria-hidden="true" />已就绪</StatusBadge><StatusBadge tone="warning">待确认</StatusBadge><StatusBadge tone="danger">失败</StatusBadge></div>
    </Example>
  </>;
}

function FeedbackExamples() {
  const [dialog, setDialog] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [draft, setDraft] = useState('示例资源');
  const [saved, setSaved] = useState('示例资源');
  const [error, setError] = useState('');
  const [category, setCategory] = useState('document');
  const [menuResult, setMenuResult] = useState('尚未执行菜单动作');
  const [toast, setToast] = useState(false);
  const [toastCount, setToastCount] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmResult, setConfirmResult] = useState('尚未确认');
  const [loadingConfirmOpen, setLoadingConfirmOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  return <>
    <Example name="Dialog" contract="open / onOpenChange、title、description、footer、closeLabel；initialFocusRef 指定初始焦点。保存逻辑由调用方处理。"
      keyboard="打开后焦点进入，Tab / Shift+Tab 留在浮层内；Escape 关闭并恢复入口。可在内部使用 Select。错误保留输入。"
      code={'<Dialog open={open} onOpenChange={setOpen} title="编辑名称" initialFocusRef={inputRef}>\n  <FormField label="名称"><Input ref={inputRef} /></FormField>\n</Dialog>'}>
      <div className="component-row"><Button variant="secondary" onClick={() => { setDraft(saved); setError(''); setDialog(true); }}>打开对话框</Button><span>本页名称：{saved}</span></div>
      <Dialog open={dialog} onOpenChange={setDialog} title="编辑示例名称" description="仅更新本页内存，刷新后恢复初值。关闭将放弃此次草稿。" initialFocusRef={nameRef}
        footer={<><Button variant="secondary" onClick={() => setDialog(false)}>取消</Button><Button onClick={() => { if (!draft.trim()) { setError('名称不能为空。'); nameRef.current?.focus(); return; } setSaved(draft.trim()); setDialog(false); }}>应用名称</Button></>}>
        <div className="component-stack"><FormField label="浮层名称" error={error}><Input ref={nameRef} value={draft} maxLength={120} onChange={event => { setDraft(event.target.value); setError(''); }} /></FormField>
          <FormField label="浮层类型"><Select value={category} onValueChange={setCategory} options={[{ value: 'document', label: '文档' }, { value: 'checklist', label: '清单' }]} /></FormField></div>
      </Dialog>
    </Example>
    <Example name="ConfirmDialog" contract="基于 Dialog 的确认组合：open / onOpenChange、title、description、confirmLabel、cancelLabel、tone: default | danger、loading、onConfirm；初始焦点在取消，loading 时关闭被拦截。"
      keyboard="打开后焦点进入取消按钮；Tab 在两个操作间移动，Escape / 关闭按钮关闭并回到入口；确认动作由调用方执行。"
      code={'<ConfirmDialog open={open} onOpenChange={setOpen} title="删除资源？" confirmLabel="删除" cancelLabel="取消" tone="danger" onConfirm={remove} />'}>
      <div className="component-row"><Button variant="danger" onClick={() => setConfirmOpen(true)}>删除示例资源</Button><Button variant="secondary" onClick={() => { setConfirming(false); setLoadingConfirmOpen(true); }}>打开加载确认</Button><span>{confirmResult}</span></div>
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="删除示例资源？" description="仅修改本页内存，刷新后恢复。" confirmLabel="删除" cancelLabel="取消" tone="danger" onConfirm={() => { setConfirmOpen(false); setConfirmResult('已确认删除（仅本页状态）'); }}>
        <p>此操作无法撤销。示例不会写入浏览器数据。</p>
      </ConfirmDialog>
      <ConfirmDialog open={loadingConfirmOpen} onOpenChange={setLoadingConfirmOpen} title="发布更新？" description="本页模拟 900ms 处理；loading 时不能关闭。" confirmLabel="发布" cancelLabel="取消" loading={confirming} onConfirm={() => { setConfirming(true); window.setTimeout(() => { setConfirming(false); setLoadingConfirmOpen(false); setConfirmResult('模拟确认完成'); }, 900); }}>
        <p>这是状态示例，不写入浏览器数据。</p>
      </ConfirmDialog>
    </Example>
    <Example name="Accordion" contract="type: single（默认）| multiple；items: { value, label, content, disabled? }[]；value / defaultValue / onValueChange；single 可 collapsible。"
      keyboard="Tab 到标题，Enter / Space 展开或收起；标题间方向键移动；禁用项跳过。"
      code={'<Accordion type="single" defaultValue="basics" collapsible items={items} />'}>
      <Accordion type="single" defaultValue="basics" collapsible items={[
        { value: 'basics', label: '选择依据', content: <p>用内容层级决定是否折叠，不把必要状态藏进折叠区。</p> },
        { value: 'states', label: '状态说明', content: <p>展开后仍保留标题、焦点与当前项；单次只展开一项。</p> },
        { value: 'keyboard', label: '键盘操作', content: <p>Tab 进入标题，Enter / Space 切换；方向键在标题间移动。</p> },
        { value: 'unavailable', label: '不可用项', content: <p>禁用项不进入键盘顺序。</p>, disabled: true },
      ]} />
    </Example>
    <Example name="Drawer" contract="与 Dialog 相同的输入与关闭合同，以侧向浮层展示辅助内容。"
      keyboard="焦点进入 / 约束 / 恢复、Escape 与 Dialog 一致；长内容在浮层正文内滚动。"
      code={'<Drawer open={open} onOpenChange={setOpen} title="资源详情">详情正文</Drawer>'}>
      <Button variant="secondary" onClick={() => setDrawer(true)}>打开抽屉</Button>
      <Drawer open={drawer} onOpenChange={setDrawer} title="资源详情与长内容" description="合成内容，用于检查正文滚动与关闭入口。" footer={<Button variant="secondary" onClick={() => setDrawer(false)}>关闭详情</Button>}>
        <div className="component-stack">{Array.from({ length: 12 }, (_, index) => <p key={index}>第 {index + 1} 段：中文与 English 共同组成长内容。辅助信息围绕当前对象展开，保留可识别的关闭入口与自然的阅读顺序。</p>)}</div>
      </Drawer>
    </Example>
    <Example name="Menu" contract="trigger 为可接收 ref / 事件的元素；items 含 id、label、onSelect / href、disabled、danger、separatorBefore；align 控制对齐。"
      keyboard="Enter / Space / 向下键展开；方向键移动并跳过禁用项；Escape 关闭恢复入口。危险项只表达语义，确认逻辑由调用方负责。"
      code={'<Menu trigger={<Button>更多</Button>} items={[{ id: "view", label: "查看", onSelect: showDetails }]} />'}>
      <div className="component-row"><Menu label="示例动作" trigger={<Button variant="secondary"><MoreHorizontal aria-hidden="true" />打开菜单</Button>} items={[
        { id: 'view', label: '查看示例详情', onSelect: () => setMenuResult('已选择查看详情') },
        { id: 'unavailable', label: '不可用的操作', disabled: true },
        { id: 'resources', label: '返回资源库', href: '#/resources' },
        { id: 'clear', label: '清空本页动作记录', danger: true, separatorBefore: true, onSelect: () => setMenuResult('本页动作记录已清空') },
      ]} /><p role="status">{menuResult}</p></div>
    </Example>
    <Example name="InlineAlert" contract="tone: info | success | warning | danger；title 可选；children 承载正文。danger 使用 alert，其余使用 status。"
      keyboard="提示本身不进入 Tab 顺序；可内嵌真实的恢复操作。持久错误保留在页面中，不用 Toast 替代。"
      code={'<InlineAlert tone="danger" title="未能保存">草稿已保留，请检查后重试。</InlineAlert>'}>
      <div className="component-stack"><InlineAlert title="信息示例">这里展示持久的上下文说明。</InlineAlert><InlineAlert tone="success" title="成功状态示例">成功说明应对应实际操作结果。</InlineAlert><InlineAlert tone="warning" title="警告状态示例">此处说明操作前需要注意的具体影响。</InlineAlert><InlineAlert tone="danger" title="错误状态示例">输入应保留，并提供继续处理的方法。</InlineAlert></div>
    </Example>
    <Example name="Skeleton" contract="width / height（CSS 长度或数字）、className / style；纯展示占位，aria-hidden；由外层用 aria-busy / status 说明加载中，加载完成移除占位。"
      keyboard="不进入 Tab 顺序；减少动效时保留静态占位，不依赖动画表达加载。"
      code={'<div aria-busy="true"><Skeleton width={180} height={12} /><Skeleton width="60%" height={12} /></div>'}>
      <div className="component-stack" role="status" aria-busy="true" aria-label="加载占位示例">
        <Skeleton width={180} height={12} />
        <Skeleton width="60%" height={12} />
        <div className="component-row"><Skeleton width={40} height={40} style={{ borderRadius: '50%' }} /><Skeleton width={120} height={12} /></div>
      </div>
    </Example>
    <Example name="Toast" contract="open / onOpenChange、message、label、closeLabel；顶部胶囊提示，关闭按钮显示剩余时间，4500ms 后自动关闭。"
      keyboard="F8 进入通知区域，可聚焦关闭按钮；Escape 或关闭按钮关闭，支持向上滑动。悬停 / 聚焦时暂停自动关闭与倒计时。"
      code={'<Toast open={open} onOpenChange={setOpen} message="本页计数已增加" closeLabel="关闭提示" />'}>
      <div className="component-row"><Button variant="secondary" onClick={() => { setToastCount(n => n + 1); setToast(true); }}>增加通知计数</Button><span>本页计数：{toastCount}</span></div>
      <Toast key={toastCount} open={toast} onOpenChange={setToast} message={`本页计数已增加到 ${toastCount}`} closeLabel="关闭示例通知" />
    </Example>
    <Example name="Tooltip" contract="content 为简短文字；children 为单个可聚焦入口。补充信息，不替代 label 或必要帮助。"
      keyboard="悬停约 400ms 或键盘聚焦时显示，Escape 关闭；触屏用户仍能从入口名称和附近文字理解功能。"
      code={'<Tooltip content="增加计数"><IconButton label="增加计数" onClick={increment}><Plus /></IconButton></Tooltip>'}>
      <div className="component-row"><Tooltip content="增加本页计数，并显示操作提示"><IconButton label="增加计数并提示" onClick={() => { setToastCount(n => n + 1); setToast(true); }}><Plus /></IconButton></Tooltip><span>增加本页计数，并显示操作提示</span></div>
    </Example>
  </>;
}

export function ComponentsPage({ t }: { t: Translate }) {
  return <section className="components-page">
    <div className="page-title"><h1>{t('组件用法', 'Components')}</h1><a className="text-link component-back" href="#/overview"><ArrowLeft size={16} aria-hidden="true" />{t('概览', 'Overview')}</a></div>
    <Tabs defaultValue="actions" className="component-groups">
      <TabsList label={t('组件分组', 'Component groups')} items={[{ value: 'actions', label: t('操作', 'Actions') }, { value: 'fields', label: t('字段', 'Fields') }, { value: 'selection', label: t('选择', 'Choice') }, { value: 'feedback', label: t('反馈', 'Feedback') }]} />
      <p className="component-scope">25 个共享组件 · React 19 内部预览。示例状态仅保留在当前分组，切换分组或离开页面会重置；文案使用中文与 English 合成内容。</p>
      <TabsContent value="actions"><ActionExamples /></TabsContent><TabsContent value="fields"><FieldExamples /></TabsContent><TabsContent value="selection"><SelectionExamples /></TabsContent><TabsContent value="feedback"><FeedbackExamples /></TabsContent>
    </Tabs>
  </section>;
}
