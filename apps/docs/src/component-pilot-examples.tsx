import { useRef, useState, type ReactNode } from 'react';
import { Accordion, Button, Checkbox, ConfirmDialog, Dialog, Drawer, FormField, Input, InputOTP, Menu, RadioGroup, Select, Switch, Tabs, TabsContent, TabsList, TagInput, Textarea } from '@radish-ui/react';

export interface PilotExample {
  id: string;
  title: string;
  description: string;
  code: string;
  preview: ReactNode;
}

const typeOptions = [
  { value: 'document', label: '文档' },
  { value: 'checklist', label: '清单' },
  { value: 'example', label: '范例' },
];

const longOptions = [
  { value: 'document', label: '文档：产品说明、规范与发布记录' },
  { value: 'checklist', label: '清单：发布前检查与验收步骤' },
  { value: 'example', label: '范例：可运行的页面与组件示例' },
  { value: 'unavailable', label: '暂不可选的归档类型', disabled: true },
];

function ButtonVariants() {
  return <div className="doc-example-row">
    <Button>发布资源</Button>
    <Button variant="secondary">保存草稿</Button>
    <Button variant="ghost">取消</Button>
    <Button variant="danger">删除</Button>
  </div>;
}

function ButtonSizes() {
  return <div className="doc-example-row">
    <Button size="sm">小号操作</Button>
    <Button>标准操作</Button>
  </div>;
}

function ButtonStates() {
  return <div className="doc-example-row">
    <Button loading>保存中</Button>
    <Button disabled>不可用</Button>
  </div>;
}

function FormFieldBasic() {
  return <FormField label="资源名称" hint="显示在资源列表与详情页。">
    <Input placeholder="例如：发布检查清单" />
  </FormField>;
}

function FormFieldError() {
  return <FormField label="资源名称" required error="名称不能为空。">
    <Input placeholder="请输入资源名称" />
  </FormField>;
}

function FormFieldGroup() {
  return <div className="doc-example-stack">
    <FormField label="资源名称" hint="显示在资源列表与详情页。">
      <Input placeholder="例如：发布检查清单" />
    </FormField>
    <FormField label="资源说明" hint="可选，支持多行。">
      <Textarea rows={3} placeholder="一句话说明用途" />
    </FormField>
  </div>;
}

function InputBasic() {
  return <FormField label="资源名称" hint="最多 60 个字符。">
    <Input placeholder="例如：发布检查清单" />
  </FormField>;
}

function InputSurface() {
  return <div className="doc-example-stack">
    <FormField label="描边表面"><Input placeholder="outline（默认）" /></FormField>
    <FormField label="填充表面"><Input surface="filled" placeholder="filled" /></FormField>
  </div>;
}

function InputStates() {
  return <div className="doc-example-stack">
    <FormField label="资源名称" required error="名称不能为空。">
      <Input placeholder="请输入资源名称" />
    </FormField>
    <FormField label="资源 ID">
      <Input readOnly value="resource-042" />
    </FormField>
  </div>;
}

function TextareaBasic() {
  return <FormField label="资源说明" hint="支持多行；保留垂直 resize。">
    <Textarea rows={4} placeholder="一句话说明用途" />
  </FormField>;
}

function TextareaSurface() {
  return <div className="doc-example-stack">
    <FormField label="描边表面"><Textarea rows={3} placeholder="outline（默认）" /></FormField>
    <FormField label="填充表面"><Textarea rows={3} surface="filled" placeholder="filled" /></FormField>
  </div>;
}

function TextareaStates() {
  return <div className="doc-example-stack">
    <FormField label="资源说明" error="说明不能超过 500 个字符。">
      <Textarea rows={3} defaultValue="超出长度限制的说明示例。" />
    </FormField>
    <FormField label="只读说明">
      <Textarea rows={3} readOnly value="只读内容保留选择与复制。" />
    </FormField>
  </div>;
}

function InputOTPBasic() {
  const [code, setCode] = useState('');
  return <InputOTP label="验证码" value={code} onValueChange={setCode} hint="6 位数字；粘贴会从当前位填充。" />;
}

function InputOTPError() {
  return <InputOTP label="验证码" value="123" onValueChange={() => {}} required error="验证码应为 6 位。" />;
}

function InputOTPForm() {
  const [code, setCode] = useState('');
  const [submitted, setSubmitted] = useState('');
  return <form className="doc-example-stack" onSubmit={event => { event.preventDefault(); setSubmitted(code); }}>
    <InputOTP label="验证码" value={code} onValueChange={setCode} name="code" onEnterPress={() => setSubmitted(code)} />
    <div className="doc-example-row"><Button type="submit">提交验证码</Button></div>
    <p className="doc-example-note">{submitted ? `已提交：${submitted}` : 'Enter 触发 onEnterPress；提交按钮走表单提交。'}</p>
  </form>;
}

function TagInputBasic() {
  const [tags, setTags] = useState(['发布', '验收']);
  const [draft, setDraft] = useState('');
  const add = () => {
    const next = draft.trim();
    if (!next) return;
    if (!tags.includes(next)) setTags([...tags, next]);
    setDraft('');
  };
  return <FormField label="标签" hint="Enter 或按钮添加；空输入 Backspace 删除末项。">
    <TagInput value={tags} onValueChange={setTags} draft={draft} onDraftChange={setDraft} onAdd={add} addLabel="添加" removeLabel={tag => `移除标签 ${tag}`} />
  </FormField>;
}

function TagInputDelete() {
  const [tags, setTags] = useState(['组件', '令牌']);
  const [draft, setDraft] = useState('');
  return <FormField label="标签" hint="输入为空时按 Backspace 删除最后一个标签。">
    <TagInput value={tags} onValueChange={setTags} draft={draft} onDraftChange={setDraft} onAdd={() => {}} addLabel="添加" removeLabel={tag => `移除标签 ${tag}`} />
  </FormField>;
}

function TagInputDisabled() {
  return <FormField label="标签" hint="禁用时仍可阅读现有标签。">
    <TagInput value={['只读示例']} onValueChange={() => {}} draft="" onDraftChange={() => {}} onAdd={() => {}} addLabel="添加" removeLabel={tag => `移除标签 ${tag}`} disabled />
  </FormField>;
}

function RadioGroupBasic() {
  const [value, setValue] = useState('document');
  return <FormField label="资源类型" hint="方向键移动即选中。">
    <RadioGroup value={value} onValueChange={setValue} options={[
      { value: 'document', label: '文档' },
      { value: 'checklist', label: '清单' },
      { value: 'example', label: '范例' },
    ]} />
  </FormField>;
}

function RadioGroupHorizontal() {
  const [value, setValue] = useState('standard');
  return <FormField label="显示密度">
    <RadioGroup value={value} onValueChange={setValue} orientation="horizontal" options={[
      { value: 'compact', label: '紧凑' },
      { value: 'standard', label: '标准' },
      { value: 'spacious', label: '宽松' },
    ]} />
  </FormField>;
}

function RadioGroupStates() {
  const [value, setValue] = useState('');
  return <FormField label="资源类型" required error="请选择一个类型。">
    <RadioGroup value={value} onValueChange={setValue} options={[
      { value: 'document', label: '文档' },
      { value: 'checklist', label: '清单' },
      { value: 'archived', label: '已归档（不可选）', disabled: true },
    ]} />
  </FormField>;
}

function CheckboxBasic() {
  const [checked, setChecked] = useState(false);
  return <Checkbox checked={checked} onChange={event => setChecked(event.target.checked)}>接收发布通知</Checkbox>;
}

function CheckboxGroup() {
  const [selected, setSelected] = useState<string[]>(['document']);
  const toggle = (value: string) => setSelected(current => current.includes(value) ? current.filter(item => item !== value) : [...current, value]);
  return <div className="doc-example-stack">
    <Checkbox checked={selected.includes('document')} onChange={() => toggle('document')}>文档</Checkbox>
    <Checkbox checked={selected.includes('checklist')} onChange={() => toggle('checklist')}>清单</Checkbox>
    <Checkbox checked={selected.includes('example')} onChange={() => toggle('example')}>范例</Checkbox>
  </div>;
}

function CheckboxStates() {
  return <div className="doc-example-stack">
    <Checkbox checked onChange={() => {}}>已选中的复选框</Checkbox>
    <Checkbox disabled>不可用的复选框</Checkbox>
  </div>;
}

function SwitchBasic() {
  const [enabled, setEnabled] = useState(true);
  return <div className="doc-example-stack">
    <div className="doc-example-row">
      <label htmlFor="pref-notifications">接收通知</label>
      <Switch id="pref-notifications" checked={enabled} onCheckedChange={setEnabled} />
    </div>
    <p className="doc-example-note">当前：{enabled ? '开启' : '关闭'}</p>
  </div>;
}

function SwitchLabels() {
  const [enabled, setEnabled] = useState(false);
  return <div className="doc-example-stack">
    <div className="doc-example-row">
      <label htmlFor="pref-digest">每日摘要</label>
      <Switch id="pref-digest" checked={enabled} onCheckedChange={setEnabled} />
    </div>
    <p className="doc-example-note">用外部 label 显式关联，开关本身不渲染文字。</p>
  </div>;
}

function SwitchStates() {
  return <div className="doc-example-stack">
    <div className="doc-example-row"><label htmlFor="switch-on">已开启</label><Switch id="switch-on" defaultChecked /></div>
    <div className="doc-example-row"><label htmlFor="switch-off">已关闭</label><Switch id="switch-off" /></div>
    <div className="doc-example-row"><label htmlFor="switch-disabled">不可用</label><Switch id="switch-disabled" disabled /></div>
  </div>;
}

function DialogBasic() {
  const [open, setOpen] = useState(false);
  return <>
    <div className="doc-example-row"><Button onClick={() => setOpen(true)}>打开对话框</Button></div>
    <Dialog open={open} onOpenChange={setOpen} title="发布资源" description="发布后资源对当前工作区可见。"
      footer={<>
        <Button variant="secondary" onClick={() => setOpen(false)}>取消</Button>
        <Button onClick={() => setOpen(false)}>发布</Button>
      </>}>
      <p>确认发布这条资源？发布后仍可撤回。</p>
    </Dialog>
  </>;
}

function DialogFocus() {
  const [open, setOpen] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  return <>
    <div className="doc-example-row"><Button onClick={() => setOpen(true)}>重命名资源</Button></div>
    <Dialog open={open} onOpenChange={setOpen} title="重命名资源" initialFocusRef={nameRef}
      footer={<>
        <Button variant="secondary" onClick={() => setOpen(false)}>取消</Button>
        <Button onClick={() => setOpen(false)}>保存</Button>
      </>}>
      <FormField label="资源名称"><Input ref={nameRef} defaultValue="发布检查清单" /></FormField>
    </Dialog>
  </>;
}

function DialogLoading() {
  const [open, setOpen] = useState(false);
  return <>
    <div className="doc-example-row"><Button onClick={() => setOpen(true)}>查看处理中状态</Button></div>
    <Dialog open={open} onOpenChange={setOpen} title="正在发布" closeDisabled
      footer={<Button loading>发布中</Button>}>
      <p>处理中不能使用头部关闭按钮；完成后才能关闭。</p>
    </Dialog>
  </>;
}

function DrawerBasic() {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState('document');
  return <>
    <div className="doc-example-row"><Button onClick={() => setOpen(true)}>打开筛选抽屉</Button></div>
    <Drawer open={open} onOpenChange={setOpen} title="筛选" description="侧向浮层，适合辅助内容。"
      footer={<Button onClick={() => setOpen(false)}>应用筛选</Button>}>
      <FormField label="资源类型">
        <Select value={kind} onValueChange={setKind} options={[
          { value: 'document', label: '文档' },
          { value: 'checklist', label: '清单' },
          { value: 'example', label: '范例' },
        ]} />
      </FormField>
    </Drawer>
  </>;
}

function DrawerLong() {
  const [open, setOpen] = useState(false);
  return <>
    <div className="doc-example-row"><Button onClick={() => setOpen(true)}>打开长内容抽屉</Button></div>
    <Drawer open={open} onOpenChange={setOpen} title="资源详情" footer={<Button onClick={() => setOpen(false)}>关闭</Button>}>
      <div className="doc-example-stack">
        <p>正文可滚动，footer 保持可见。</p>
        <p>这里是较长的说明内容，用于检查抽屉在窄屏与长文本下的滚动与留白。</p>
        <p>抽屉关闭后焦点回到打开它的按钮。</p>
      </div>
    </Drawer>
  </>;
}

function DrawerLoading() {
  const [open, setOpen] = useState(false);
  return <>
    <div className="doc-example-row"><Button onClick={() => setOpen(true)}>查看处理中抽屉</Button></div>
    <Drawer open={open} onOpenChange={setOpen} title="正在同步" closeDisabled
      footer={<Button loading>同步中</Button>}>
      <p>同步期间禁用头部关闭按钮。</p>
    </Drawer>
  </>;
}

function ConfirmDialogDanger() {
  const [open, setOpen] = useState(false);
  return <>
    <div className="doc-example-row"><Button onClick={() => setOpen(true)}>删除资源</Button></div>
    <ConfirmDialog open={open} onOpenChange={setOpen} title="删除资源" description="删除后不可恢复。"
      confirmLabel="删除" cancelLabel="取消" tone="danger" onConfirm={() => setOpen(false)}>
      <p>“发布检查清单”将被永久删除。</p>
    </ConfirmDialog>
  </>;
}

function ConfirmDialogDefault() {
  const [open, setOpen] = useState(false);
  return <>
    <div className="doc-example-row"><Button onClick={() => setOpen(true)}>发布资源</Button></div>
    <ConfirmDialog open={open} onOpenChange={setOpen} title="发布资源" description="发布后对当前工作区可见。"
      confirmLabel="发布" cancelLabel="取消" onConfirm={() => setOpen(false)}>
      <p>确认发布这条资源？</p>
    </ConfirmDialog>
  </>;
}

function ConfirmDialogLoading() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  return <>
    <div className="doc-example-row"><Button onClick={() => setOpen(true)}>查看加载状态</Button></div>
    <ConfirmDialog open={open} onOpenChange={setOpen} title="发布资源" description="确认中会禁用关闭与取消。"
      confirmLabel="发布" cancelLabel="取消" loading={loading}
      onConfirm={() => { setLoading(true); window.setTimeout(() => { setLoading(false); setOpen(false); }, 1200); }}>
      <p>加载期间不能关闭或取消。</p>
    </ConfirmDialog>
  </>;
}

function MenuBasic() {
  return <div className="doc-example-row"><Menu trigger={<Button variant="secondary">更多操作</Button>} items={[
    { id: 'edit', label: '编辑', onSelect: () => {} },
    { id: 'duplicate', label: '复制', onSelect: () => {} },
    { id: 'delete', label: '删除', danger: true, separatorBefore: true, onSelect: () => {} },
  ]} /></div>;
}

function MenuGrouped() {
  return <div className="doc-example-row"><Menu trigger={<Button variant="secondary">归档操作</Button>} label="资源" items={[
    { id: 'open', label: '打开', onSelect: () => {} },
    { id: 'download', label: '下载', disabled: true },
    { id: 'archive', label: '归档', separatorBefore: true, onSelect: () => {} },
  ]} /></div>;
}

function MenuLinks() {
  return <div className="doc-example-row"><Menu trigger={<Button variant="secondary">前往</Button>} items={[
    { id: 'catalog', label: '组件目录', href: '#/catalog' },
    { id: 'button', label: 'Button 文档', href: '#/components/button' },
  ]} /></div>;
}

function AccordionSingle() {
  return <Accordion type="single" collapsible defaultValue="basics" items={[
    { value: 'basics', label: '基础说明', content: <p>折叠面板一次只展开一组内容。</p> },
    { value: 'rules', label: '使用规则', content: <p>标题按钮由键盘操作，内容区域按 DOM 顺序继续 Tab。</p> },
  ]} />;
}

function AccordionMultiple() {
  return <Accordion type="multiple" defaultValue={['tokens', 'a11y']} items={[
    { value: 'tokens', label: '设计 token', content: <p>颜色、尺度与状态由 token 驱动。</p> },
    { value: 'a11y', label: '可访问性', content: <p>标题按钮与内容区域由 Radix 维护。</p> },
  ]} />;
}

function AccordionDisabled() {
  const [value, setValue] = useState('overview');
  return <Accordion type="single" collapsible value={value} onValueChange={setValue} label="资源信息" items={[
    { value: 'overview', label: '概览', content: <p>受控展开项；由调用方保存当前值。</p> },
    { value: 'history', label: '历史（不可用）', content: <p>禁用内容。</p>, disabled: true },
  ]} />;
}

function SelectBasic() {
  const [type, setType] = useState('');
  return <div className="doc-example-stack">
    <FormField label="资源类型" hint="选择后立即生效，当前值会保留在本页。">
      <Select value={type} onValueChange={setType} options={typeOptions} placeholder="请选择类型" />
    </FormField>
    <p className="doc-example-note">当前值：{type || '未选择'}</p>
  </div>;
}

function SelectStates() {
  return <div className="doc-example-stack">
    <FormField label="资源类型" required error="请选择一个类型。">
      <Select value="" onValueChange={() => {}} options={typeOptions} placeholder="请选择类型" />
    </FormField>
    <FormField label="不可用的选择器">
      <Select value="document" onValueChange={() => {}} options={typeOptions} disabled />
    </FormField>
  </div>;
}

function SelectLongOptions() {
  const [type, setType] = useState('document');
  return <FormField label="资源类型" hint="长名称会在浮层内换行，不撑破页面宽度。">
    <Select value={type} onValueChange={setType} options={longOptions} />
  </FormField>;
}

function TabsBasic() {
  return <Tabs defaultValue="overview">
    <TabsList label="资源详情分组" items={[
      { value: 'overview', label: '概览' },
      { value: 'history', label: '历史' },
    ]} />
    <TabsContent value="overview"><p className="doc-example-note">概览：当前资源的摘要与关键状态。</p></TabsContent>
    <TabsContent value="history"><p className="doc-example-note">历史：只显示合成示例内容。</p></TabsContent>
  </Tabs>;
}

function TabsControlled() {
  const [tab, setTab] = useState('overview');
  return <div className="doc-example-stack">
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList label="受控标签组" items={[
        { value: 'overview', label: '概览' },
        { value: 'history', label: '历史' },
      ]} />
      <TabsContent value="overview"><p className="doc-example-note">概览面板。</p></TabsContent>
      <TabsContent value="history"><p className="doc-example-note">历史面板。</p></TabsContent>
    </Tabs>
    <p className="doc-example-note">当前标签：{tab}</p>
  </div>;
}

function TabsDisabled() {
  return <Tabs defaultValue="overview">
    <TabsList label="带禁用项的标签组" items={[
      { value: 'overview', label: '概览' },
      { value: 'history', label: '历史' },
      { value: 'locked', label: '不可用', disabled: true },
    ]} />
    <TabsContent value="overview"><p className="doc-example-note">禁用项不会进入方向键与 Tab 顺序。</p></TabsContent>
    <TabsContent value="history"><p className="doc-example-note">历史面板。</p></TabsContent>
  </Tabs>;
}

export const pilotExamples: Record<string, readonly PilotExample[]> = {
  button: [
    {
      id: 'variants',
      title: '操作层级',
      description: '一个区域只保留一个主要操作；危险操作使用 danger。',
      code: `<Button>发布资源</Button>
<Button variant="secondary">保存草稿</Button>
<Button variant="ghost">取消</Button>
<Button variant="danger">删除</Button>`,
      preview: <ButtonVariants />,
    },
    {
      id: 'sizes',
      title: '尺寸',
      description: 'sm 用于工具栏和紧凑行，md 用于页面与表单操作。',
      code: `<Button size="sm">小号操作</Button>
<Button>标准操作</Button>`,
      preview: <ButtonSizes />,
    },
    {
      id: 'states',
      title: '加载与禁用',
      description: 'loading 保留焦点并拦截重复激活；disabled 使用原生禁用语义。',
      code: `<Button loading>保存中</Button>
<Button disabled>不可用</Button>`,
      preview: <ButtonStates />,
    },
  ],
  'form-field': [
    {
      id: 'basic',
      title: '标签与说明',
      description: '标签通过 htmlFor 关联字段控件；hint 作为补充说明。',
      code: `<FormField label="资源名称" hint="显示在资源列表与详情页。">
  <Input placeholder="例如：发布检查清单" />
</FormField>`,
      preview: <FormFieldBasic />,
    },
    {
      id: 'error',
      title: '必填与错误',
      description: 'required 显示必填标记；error 优先于 hint 并以 alert 播报。',
      code: `<FormField label="资源名称" required error="名称不能为空。">
  <Input placeholder="请输入资源名称" />
</FormField>`,
      preview: <FormFieldError />,
    },
    {
      id: 'group',
      title: '成组字段',
      description: '多个 FormField 垂直排列；控件自动继承字段上下文。',
      code: `<div>
  <FormField label="资源名称" hint="显示在资源列表与详情页。">
    <Input placeholder="例如：发布检查清单" />
  </FormField>
  <FormField label="资源说明" hint="可选，支持多行。">
    <Textarea rows={3} placeholder="一句话说明用途" />
  </FormField>
</div>`,
      preview: <FormFieldGroup />,
    },
  ],
  input: [
    {
      id: 'basic',
      title: '基础输入',
      description: '标签、说明与输入由 FormField 关联；placeholder 只作提示。',
      code: `<FormField label="资源名称" hint="最多 60 个字符。">
  <Input placeholder="例如：发布检查清单" />
</FormField>`,
      preview: <InputBasic />,
    },
    {
      id: 'surface',
      title: '表面',
      description: 'outline 为默认；filled 用于强调或分组背景。',
      code: `<div>
  <FormField label="描边表面"><Input placeholder="outline（默认）" /></FormField>
  <FormField label="填充表面"><Input surface="filled" placeholder="filled" /></FormField>
</div>`,
      preview: <InputSurface />,
    },
    {
      id: 'states',
      title: '错误与只读',
      description: '错误由 FormField 传入；只读保留选择与复制。',
      code: `<div>
  <FormField label="资源名称" required error="名称不能为空。">
    <Input placeholder="请输入资源名称" />
  </FormField>
  <FormField label="资源 ID">
    <Input readOnly value="resource-042" />
  </FormField>
</div>`,
      preview: <InputStates />,
    },
  ],
  textarea: [
    {
      id: 'basic',
      title: '基础多行',
      description: 'rows 只设初始可见行数；仍保留垂直 resize。',
      code: `<FormField label="资源说明" hint="支持多行；保留垂直 resize。">
  <Textarea rows={4} placeholder="一句话说明用途" />
</FormField>`,
      preview: <TextareaBasic />,
    },
    {
      id: 'surface',
      title: '表面',
      description: '与 Input 使用同一组语义表面。',
      code: `<div>
  <FormField label="描边表面"><Textarea rows={3} placeholder="outline（默认）" /></FormField>
  <FormField label="填充表面"><Textarea rows={3} surface="filled" placeholder="filled" /></FormField>
</div>`,
      preview: <TextareaSurface />,
    },
    {
      id: 'states',
      title: '错误与只读',
      description: '错误优先于 hint；只读不响应编辑。',
      code: `<div>
  <FormField label="资源说明" error="说明不能超过 500 个字符。">
    <Textarea rows={3} defaultValue="超出长度限制的说明示例。" />
  </FormField>
  <FormField label="只读说明">
    <Textarea rows={3} readOnly value="只读内容保留选择与复制。" />
  </FormField>
</div>`,
      preview: <TextareaStates />,
    },
  ],
  select: [
    {
      id: 'basic',
      title: '受控选择',
      description: '由调用方保存当前值；FormField 自动关联标签与说明。',
      code: `import { useState } from 'react';

const typeOptions = [
  { value: 'document', label: '文档' },
  { value: 'checklist', label: '清单' },
  { value: 'example', label: '范例' },
];
const [type, setType] = useState('');

<div>
  <FormField label="资源类型" hint="选择后立即生效，当前值会保留在本页。">
    <Select value={type} onValueChange={setType} options={typeOptions} placeholder="请选择类型" />
  </FormField>
  <p>当前值：{type || '未选择'}</p>
</div>`,
      preview: <SelectBasic />,
    },
    {
      id: 'states',
      title: '错误与禁用',
      description: '错误优先于 hint；禁用选择器不进入 Tab 顺序。',
      code: `const typeOptions = [
  { value: 'document', label: '文档' },
  { value: 'checklist', label: '清单' },
  { value: 'example', label: '范例' },
];

<FormField label="资源类型" required error="请选择一个类型。">
  <Select value="" onValueChange={() => {}} options={typeOptions} placeholder="请选择类型" />
</FormField>
<FormField label="不可用的选择器">
  <Select value="document" onValueChange={() => {}} options={typeOptions} disabled />
</FormField>`,
      preview: <SelectStates />,
    },
    {
      id: 'long-options',
      title: '长选项',
      description: '浮层宽度受视口限制，长名称在选项内换行。',
      code: `import { useState } from 'react';

const longOptions = [
  { value: 'document', label: '文档：产品说明、规范与发布记录' },
  { value: 'checklist', label: '清单：发布前检查与验收步骤' },
  { value: 'example', label: '范例：可运行的页面与组件示例' },
  { value: 'unavailable', label: '暂不可选的归档类型', disabled: true },
];
const [type, setType] = useState('document');

<FormField label="资源类型" hint="长名称会在浮层内换行，不撑破页面宽度。">
  <Select value={type} onValueChange={setType} options={longOptions} />
</FormField>`,
      preview: <SelectLongOptions />,
    },
  ],
  tabs: [
    {
      id: 'basic',
      title: '非受控标签',
      description: '默认显示第一个标签；TabsList 的 items 定义标签名称。',
      code: `<Tabs defaultValue="overview">
  <TabsList label="资源详情分组" items={[
    { value: 'overview', label: '概览' },
    { value: 'history', label: '历史' },
  ]} />
  <TabsContent value="overview"><p>概览：当前资源的摘要与关键状态。</p></TabsContent>
  <TabsContent value="history"><p>历史：只显示合成示例内容。</p></TabsContent>
</Tabs>`,
      preview: <TabsBasic />,
    },
    {
      id: 'controlled',
      title: '受控标签',
      description: 'value / onValueChange 由调用方持有，适合与路由或筛选联动。',
      code: `import { useState } from 'react';

const [tab, setTab] = useState('overview');

<div>
  <Tabs value={tab} onValueChange={setTab}>
    <TabsList label="受控标签组" items={[
      { value: 'overview', label: '概览' },
      { value: 'history', label: '历史' },
    ]} />
    <TabsContent value="overview"><p>概览面板。</p></TabsContent>
    <TabsContent value="history"><p>历史面板。</p></TabsContent>
  </Tabs>
  <p>当前标签：{tab}</p>
</div>`,
      preview: <TabsControlled />,
    },
    {
      id: 'disabled',
      title: '禁用项与键盘',
      description: '禁用标签被方向键与 Tab 顺序跳过，焦点与选中分别呈现。',
      code: `<Tabs defaultValue="overview">
  <TabsList label="带禁用项的标签组" items={[
    { value: 'overview', label: '概览' },
    { value: 'history', label: '历史' },
    { value: 'locked', label: '不可用', disabled: true },
  ]} />
  <TabsContent value="overview"><p>禁用项不会进入方向键与 Tab 顺序。</p></TabsContent>
  <TabsContent value="history"><p>历史面板。</p></TabsContent>
</Tabs>`,
      preview: <TabsDisabled />,
    },
  ],
  'input-otp': [
    {
      id: 'basic',
      title: '基础验证码',
      description: '逐位输入数字并自动前进；粘贴多位会从当前位填充。',
      code: `import { useState } from 'react';

const [code, setCode] = useState('');

<InputOTP label="验证码" value={code} onValueChange={setCode} hint="6 位数字；粘贴会从当前位填充。" />`,
      preview: <InputOTPBasic />,
    },
    {
      id: 'error',
      title: '错误与必填',
      description: 'error 替代 hint 并以 alert 播报，每一位输入都关联错误。',
      code: `<InputOTP label="验证码" value="123" onValueChange={() => {}} required error="验证码应为 6 位。" />`,
      preview: <InputOTPError />,
    },
    {
      id: 'form',
      title: '表单提交',
      description: '有 onEnterPress 时 Enter 只触发回调；提交按钮保留表单提交。',
      code: `import { useState } from 'react';

const [code, setCode] = useState('');
const [submitted, setSubmitted] = useState('');

<form onSubmit={event => { event.preventDefault(); setSubmitted(code); }}>
  <InputOTP label="验证码" value={code} onValueChange={setCode} name="code" onEnterPress={() => setSubmitted(code)} />
  <div><Button type="submit">提交验证码</Button></div>
  <p>{submitted ? '已提交：' + submitted : 'Enter 触发 onEnterPress；提交按钮走表单提交。'}</p>
</form>`,
      preview: <InputOTPForm />,
    },
  ],
  'tag-input': [
    {
      id: 'basic',
      title: '基础添加',
      description: 'Enter 或添加按钮提交草稿；去重与上限由调用方决定。',
      code: `import { useState } from 'react';

const [tags, setTags] = useState(['发布', '验收']);
const [draft, setDraft] = useState('');
function add() {
  const next = draft.trim();
  if (!next) return;
  if (!tags.includes(next)) setTags([...tags, next]);
  setDraft('');
}

<FormField label="标签" hint="Enter 或按钮添加；空输入 Backspace 删除末项。">
  <TagInput value={tags} onValueChange={setTags} draft={draft} onDraftChange={setDraft}
    onAdd={add} addLabel="添加" removeLabel={tag => '移除标签 ' + tag} />
</FormField>`,
      preview: <TagInputBasic />,
    },
    {
      id: 'delete',
      title: '回退删除',
      description: '输入框为空时 Backspace 删除最后一个标签，焦点回到输入框。',
      code: `const [tags, setTags] = useState(['组件', '令牌']);
const [draft, setDraft] = useState('');

<FormField label="标签" hint="输入为空时按 Backspace 删除最后一个标签。">
  <TagInput value={tags} onValueChange={setTags} draft={draft} onDraftChange={setDraft}
    onAdd={() => {}} addLabel="添加" removeLabel={tag => '移除标签 ' + tag} />
</FormField>`,
      preview: <TagInputDelete />,
    },
    {
      id: 'disabled',
      title: '禁用',
      description: '禁用后输入、添加与删除都不可用，现有标签仍可阅读。',
      code: `<FormField label="标签" hint="禁用时仍可阅读现有标签。">
  <TagInput value={['只读示例']} onValueChange={() => {}} draft="" onDraftChange={() => {}}
    onAdd={() => {}} addLabel="添加" removeLabel={tag => '移除标签 ' + tag} disabled />
</FormField>`,
      preview: <TagInputDisabled />,
    },
  ],
  'radio-group': [
    {
      id: 'basic',
      title: '基础单选',
      description: '方向键移动即选中；FormField 自动关联标签、说明与错误。',
      code: `import { useState } from 'react';

const [value, setValue] = useState('document');

<FormField label="资源类型" hint="方向键移动即选中。">
  <RadioGroup value={value} onValueChange={setValue} options={[
    { value: 'document', label: '文档' },
    { value: 'checklist', label: '清单' },
    { value: 'example', label: '范例' },
  ]} />
</FormField>`,
      preview: <RadioGroupBasic />,
    },
    {
      id: 'horizontal',
      title: '横向排列',
      description: 'orientation="horizontal" 用于紧凑选项。',
      code: `const [value, setValue] = useState('standard');

<FormField label="显示密度">
  <RadioGroup value={value} onValueChange={setValue} orientation="horizontal" options={[
    { value: 'compact', label: '紧凑' },
    { value: 'standard', label: '标准' },
    { value: 'spacious', label: '宽松' },
  ]} />
</FormField>`,
      preview: <RadioGroupHorizontal />,
    },
    {
      id: 'states',
      title: '必填与禁用',
      description: 'error 优先于 hint；禁用项被方向键跳过。',
      code: `const [value, setValue] = useState('');

<FormField label="资源类型" required error="请选择一个类型。">
  <RadioGroup value={value} onValueChange={setValue} options={[
    { value: 'document', label: '文档' },
    { value: 'checklist', label: '清单' },
    { value: 'archived', label: '已归档（不可选）', disabled: true },
  ]} />
</FormField>`,
      preview: <RadioGroupStates />,
    },
  ],
  checkbox: [
    {
      id: 'basic',
      title: '单个复选',
      description: '原生 checkbox 与键盘行为；children 提供可见标签。',
      code: `import { useState } from 'react';

const [checked, setChecked] = useState(false);

<Checkbox checked={checked} onChange={event => setChecked(event.target.checked)}>接收发布通知</Checkbox>`,
      preview: <CheckboxBasic />,
    },
    {
      id: 'group',
      title: '复选组',
      description: '多选用受控数组维护；每个复选框独立聚焦。',
      code: `const [selected, setSelected] = useState<string[]>(['document']);
const toggle = (value: string) => setSelected(current =>
  current.includes(value) ? current.filter(item => item !== value) : [...current, value]);

<div>
  <Checkbox checked={selected.includes('document')} onChange={() => toggle('document')}>文档</Checkbox>
  <Checkbox checked={selected.includes('checklist')} onChange={() => toggle('checklist')}>清单</Checkbox>
  <Checkbox checked={selected.includes('example')} onChange={() => toggle('example')}>范例</Checkbox>
</div>`,
      preview: <CheckboxGroup />,
    },
    {
      id: 'states',
      title: '选中与禁用',
      description: '禁用不进入 Tab 顺序；选中态与焦点分别呈现。',
      code: `<div>
  <Checkbox checked onChange={() => {}}>已选中的复选框</Checkbox>
  <Checkbox disabled>不可用的复选框</Checkbox>
</div>`,
      preview: <CheckboxStates />,
    },
  ],
  switch: [
    {
      id: 'basic',
      title: '受控开关',
      description: 'checked / onCheckedChange 由调用方持有。',
      code: `import { useState } from 'react';

const [enabled, setEnabled] = useState(true);

<div>
  <div>
    <label htmlFor="pref-notifications">接收通知</label>
    <Switch id="pref-notifications" checked={enabled} onCheckedChange={setEnabled} />
  </div>
  <p>当前：{enabled ? '开启' : '关闭'}</p>
</div>`,
      preview: <SwitchBasic />,
    },
    {
      id: 'labels',
      title: '标签关联',
      description: 'Switch 不渲染文字，用外部 label 的 htmlFor 关联。',
      code: `const [enabled, setEnabled] = useState(false);

<div>
  <label htmlFor="pref-digest">每日摘要</label>
  <Switch id="pref-digest" checked={enabled} onCheckedChange={setEnabled} />
</div>`,
      preview: <SwitchLabels />,
    },
    {
      id: 'states',
      title: '状态',
      description: '非受控、选中与禁用三种状态。',
      code: `<div>
  <div><label htmlFor="switch-on">已开启</label><Switch id="switch-on" defaultChecked /></div>
  <div><label htmlFor="switch-off">已关闭</label><Switch id="switch-off" /></div>
  <div><label htmlFor="switch-disabled">不可用</label><Switch id="switch-disabled" disabled /></div>
</div>`,
      preview: <SwitchStates />,
    },
  ],
  dialog: [
    {
      id: 'basic',
      title: '基础对话框',
      description: '标题、说明与底部操作；Escape 与遮罩走同一关闭回调。',
      code: `import { useState } from 'react';

const [open, setOpen] = useState(false);

<>
  <Button onClick={() => setOpen(true)}>打开对话框</Button>
  <Dialog open={open} onOpenChange={setOpen} title="发布资源" description="发布后资源对当前工作区可见。"
    footer={<>
      <Button variant="secondary" onClick={() => setOpen(false)}>取消</Button>
      <Button onClick={() => setOpen(false)}>发布</Button>
    </>}>
    <p>确认发布这条资源？发布后仍可撤回。</p>
  </Dialog>
</>`,
      preview: <DialogBasic />,
    },
    {
      id: 'focus',
      title: '初始焦点',
      description: 'initialFocusRef 把焦点放到输入框；关闭后回到打开按钮。',
      code: `import { useRef, useState } from 'react';

const [open, setOpen] = useState(false);
const nameRef = useRef<HTMLInputElement>(null);

<>
  <Button onClick={() => setOpen(true)}>重命名资源</Button>
  <Dialog open={open} onOpenChange={setOpen} title="重命名资源" initialFocusRef={nameRef}
    footer={<>
      <Button variant="secondary" onClick={() => setOpen(false)}>取消</Button>
      <Button onClick={() => setOpen(false)}>保存</Button>
    </>}>
    <FormField label="资源名称"><Input ref={nameRef} defaultValue="发布检查清单" /></FormField>
  </Dialog>
</>`,
      preview: <DialogFocus />,
    },
    {
      id: 'loading',
      title: '关闭按钮禁用',
      description: 'closeDisabled 保留头部关闭按钮但不允许点击，适合处理中状态。',
      code: `const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen} title="正在发布" closeDisabled
  footer={<Button loading>发布中</Button>}>
  <p>处理中不能使用头部关闭按钮；完成后才能关闭。</p>
</Dialog>`,
      preview: <DialogLoading />,
    },
  ],
  drawer: [
    {
      id: 'basic',
      title: '基础抽屉',
      description: '与 Dialog 同一合同，从侧边打开；正文可放置表单。',
      code: `const [open, setOpen] = useState(false);
const [kind, setKind] = useState('document');

<>
  <Button onClick={() => setOpen(true)}>打开筛选抽屉</Button>
  <Drawer open={open} onOpenChange={setOpen} title="筛选" description="侧向浮层，适合辅助内容。"
    footer={<Button onClick={() => setOpen(false)}>应用筛选</Button>}>
    <FormField label="资源类型">
      <Select value={kind} onValueChange={setKind} options={[
        { value: 'document', label: '文档' },
        { value: 'checklist', label: '清单' },
        { value: 'example', label: '范例' },
      ]} />
    </FormField>
  </Drawer>
</>`,
      preview: <DrawerBasic />,
    },
    {
      id: 'long',
      title: '长内容',
      description: '正文滚动时 footer 保持可见；关闭后焦点回到入口。',
      code: `const [open, setOpen] = useState(false);

<>
  <Button onClick={() => setOpen(true)}>打开长内容抽屉</Button>
  <Drawer open={open} onOpenChange={setOpen} title="资源详情" footer={<Button onClick={() => setOpen(false)}>关闭</Button>}>
    <div>
      <p>正文可滚动，footer 保持可见。</p>
      <p>这里是较长的说明内容，用于检查抽屉在窄屏与长文本下的滚动与留白。</p>
      <p>抽屉关闭后焦点回到打开它的按钮。</p>
    </div>
  </Drawer>
</>`,
      preview: <DrawerLong />,
    },
    {
      id: 'loading',
      title: '关闭按钮禁用',
      description: '同步期间禁用头部关闭按钮，操作区显示 loading。',
      code: `const [open, setOpen] = useState(false);

<Drawer open={open} onOpenChange={setOpen} title="正在同步" closeDisabled
  footer={<Button loading>同步中</Button>}>
  <p>同步期间禁用头部关闭按钮。</p>
</Drawer>`,
      preview: <DrawerLoading />,
    },
  ],
  'confirm-dialog': [
    {
      id: 'danger',
      title: '危险确认',
      description: 'tone="danger" 使用危险按钮；初始焦点在取消。',
      code: `const [open, setOpen] = useState(false);

<>
  <Button onClick={() => setOpen(true)}>删除资源</Button>
  <ConfirmDialog open={open} onOpenChange={setOpen} title="删除资源" description="删除后不可恢复。"
    confirmLabel="删除" cancelLabel="取消" tone="danger" onConfirm={() => setOpen(false)}>
    <p>“发布检查清单”将被永久删除。</p>
  </ConfirmDialog>
</>`,
      preview: <ConfirmDialogDanger />,
    },
    {
      id: 'default',
      title: '默认确认',
      description: '默认 tone 使用主要按钮；确认回调由调用方关闭。',
      code: `const [open, setOpen] = useState(false);

<>
  <Button onClick={() => setOpen(true)}>发布资源</Button>
  <ConfirmDialog open={open} onOpenChange={setOpen} title="发布资源" description="发布后对当前工作区可见。"
    confirmLabel="发布" cancelLabel="取消" onConfirm={() => setOpen(false)}>
    <p>确认发布这条资源？</p>
  </ConfirmDialog>
</>`,
      preview: <ConfirmDialogDefault />,
    },
    {
      id: 'loading',
      title: '确认中',
      description: 'loading 时拦截关闭并禁用取消与头部关闭按钮。',
      code: `const [open, setOpen] = useState(false);
const [loading, setLoading] = useState(false);

<ConfirmDialog open={open} onOpenChange={setOpen} title="发布资源" description="确认中会禁用关闭与取消。"
  confirmLabel="发布" cancelLabel="取消" loading={loading}
  onConfirm={() => { setLoading(true); window.setTimeout(() => { setLoading(false); setOpen(false); }, 1200); }}>
  <p>加载期间不能关闭或取消。</p>
</ConfirmDialog>`,
      preview: <ConfirmDialogLoading />,
    },
  ],
  menu: [
    {
      id: 'basic',
      title: '基础菜单',
      description: '选择动作可用 onSelect；危险项加分隔线与 danger 样式。',
      code: `<Menu trigger={<Button variant="secondary">更多操作</Button>} items={[
  { id: 'edit', label: '编辑', onSelect: () => {} },
  { id: 'duplicate', label: '复制', onSelect: () => {} },
  { id: 'delete', label: '删除', danger: true, separatorBefore: true, onSelect: () => {} },
]} />`,
      preview: <MenuBasic />,
    },
    {
      id: 'grouped',
      title: '分组与禁用',
      description: 'label 提供分组标题；禁用项不响应选择。',
      code: `<Menu trigger={<Button variant="secondary">归档操作</Button>} label="资源" items={[
  { id: 'open', label: '打开', onSelect: () => {} },
  { id: 'download', label: '下载', disabled: true },
  { id: 'archive', label: '归档', separatorBefore: true, onSelect: () => {} },
]} />`,
      preview: <MenuGrouped />,
    },
    {
      id: 'links',
      title: '链接项',
      description: '提供 href 时渲染为链接，保留键盘与焦点行为。',
      code: `<Menu trigger={<Button variant="secondary">前往</Button>} items={[
  { id: 'catalog', label: '组件目录', href: '#/catalog' },
  { id: 'button', label: 'Button 文档', href: '#/components/button' },
]} />`,
      preview: <MenuLinks />,
    },
  ],
  accordion: [
    {
      id: 'single',
      title: '单开折叠',
      description: 'type="single" 一次只展开一项；collapsible 允许收起。',
      code: `<Accordion type="single" collapsible defaultValue="basics" items={[
  { value: 'basics', label: '基础说明', content: <p>折叠面板一次只展开一组内容。</p> },
  { value: 'rules', label: '使用规则', content: <p>标题按钮由键盘操作，内容区域按 DOM 顺序继续 Tab。</p> },
]} />`,
      preview: <AccordionSingle />,
    },
    {
      id: 'multiple',
      title: '多开折叠',
      description: 'type="multiple" 可同时展开多项，value 为数组。',
      code: `<Accordion type="multiple" defaultValue={['tokens', 'a11y']} items={[
  { value: 'tokens', label: '设计 token', content: <p>颜色、尺度与状态由 token 驱动。</p> },
  { value: 'a11y', label: '可访问性', content: <p>标题按钮与内容区域由 Radix 维护。</p> },
]} />`,
      preview: <AccordionMultiple />,
    },
    {
      id: 'disabled',
      title: '受控与禁用',
      description: '受控 value / onValueChange；禁用项不可展开。',
      code: `const [value, setValue] = useState('overview');

<Accordion type="single" collapsible value={value} onValueChange={setValue} label="资源信息" items={[
  { value: 'overview', label: '概览', content: <p>受控展开项；由调用方保存当前值。</p> },
  { value: 'history', label: '历史（不可用）', content: <p>禁用内容。</p>, disabled: true },
]} />`,
      preview: <AccordionDisabled />,
    },
  ],
};
