import { useRef, useState, type ReactNode } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Accordion, Avatar, Button, Card, Checkbox, ConfirmDialog, Dialog, Drawer, FormField, IconButton, InlineAlert, Input, InputOTP, Menu, Pagination, RadioGroup, Section, Select, Skeleton, StatusBadge, Switch, Table, TableOfContents, Tabs, TabsContent, TabsList, Tag, TagInput, Textarea, Toast, ToggleGroup, Tooltip } from '@radish-ui/react';

export interface PilotExample {
  id: string;
  title: string;
  description: string;
  code: string;
  preview: ReactNode;
}

const avatarImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%232B3F55'/%3E%3Ccircle cx='32' cy='23' r='11' fill='%23DCE6F1'/%3E%3Cpath d='M12 62c3-14 11-20 20-20s17 6 20 20' fill='%23DCE6F1'/%3E%3C/svg%3E";

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

function InlineAlertTones() {
  return <div className="doc-example-stack">
    <InlineAlert tone="info">资源会在保存后同步。</InlineAlert>
    <InlineAlert tone="success">发布成功。</InlineAlert>
    <InlineAlert tone="warning">有 2 个标签待确认。</InlineAlert>
    <InlineAlert tone="danger">保存失败，请重试。</InlineAlert>
  </div>;
}

function InlineAlertTitle() {
  return <InlineAlert tone="warning" title="待处理">有 2 个标签待确认，确认后才能发布。</InlineAlert>;
}

function InlineAlertLong() {
  return <InlineAlert tone="danger" title="同步失败">
    <p>服务器暂时不可用，本地草稿已保留。恢复网络后重试，或稍后再打开此页。</p>
  </InlineAlert>;
}

function SkeletonBasic() {
  return <div className="doc-example-stack">
    <Skeleton width={240} height={16} />
    <Skeleton width="60%" height={12} />
  </div>;
}

function SkeletonText() {
  return <div className="doc-example-stack">
    <Skeleton width="100%" height={14} />
    <Skeleton width="80%" height={14} />
    <Skeleton width="60%" height={14} />
  </div>;
}

function SkeletonCard() {
  return <div className="doc-example-row" style={{ alignItems: 'stretch' }}>
    <Skeleton width={40} height={40} />
    <div className="doc-example-stack" style={{ flex: 1 }}>
      <Skeleton width="70%" height={14} />
      <Skeleton width="40%" height={14} />
    </div>
  </div>;
}

function ToastBasic() {
  const [open, setOpen] = useState(false);
  return <>
    <div className="doc-example-row"><Button onClick={() => setOpen(true)}>显示通知</Button></div>
    <Toast open={open} onOpenChange={setOpen} message="资源已保存" />
  </>;
}

function ToastLabel() {
  const [open, setOpen] = useState(false);
  return <>
    <div className="doc-example-row"><Button onClick={() => setOpen(true)}>显示发布通知</Button></div>
    <Toast open={open} onOpenChange={setOpen} message="发布完成" label="发布通知" closeLabel="关闭发布通知" />
  </>;
}

function ToastManual() {
  const [open, setOpen] = useState(false);
  return <>
    <div className="doc-example-row"><Button onClick={() => setOpen(true)}>显示可关闭通知</Button></div>
    <Toast open={open} onOpenChange={setOpen} message="标签已添加，可在列表继续编辑" closeLabel="关闭标签通知" />
  </>;
}

function TooltipBasic() {
  return <div className="doc-example-row"><Tooltip content="保存当前修改"><Button>保存</Button></Tooltip></div>;
}

function TooltipIcon() {
  return <div className="doc-example-row"><Tooltip content="添加资源"><IconButton label="添加资源"><Plus size={16} /></IconButton></Tooltip></div>;
}

function TooltipLink() {
  return <div className="doc-example-row"><Tooltip content="返回组件目录"><a className="text-link" href="#/catalog">组件目录</a></Tooltip></div>;
}

function IconButtonBasic() {
  return <div className="doc-example-row">
    <IconButton label="添加资源"><Plus size={16} /></IconButton>
    <IconButton label="删除资源"><Trash2 size={16} /></IconButton>
  </div>;
}

function IconButtonVariants() {
  return <div className="doc-example-row">
    <IconButton label="添加资源" variant="secondary"><Plus size={16} /></IconButton>
    <IconButton label="删除资源" variant="danger"><Trash2 size={16} /></IconButton>
  </div>;
}

function IconButtonStates() {
  return <div className="doc-example-row">
    <IconButton label="添加资源（处理中）" loading><Plus size={16} /></IconButton>
    <IconButton label="添加资源（不可用）" disabled><Plus size={16} /></IconButton>
  </div>;
}

function AvatarFallback() {
  return <div className="doc-example-row">
    <Avatar name="林杏" />
    <Avatar name="Ada Lovelace" />
  </div>;
}

function AvatarImage() {
  return <div className="doc-example-row">
    <Avatar name="林杏" src={avatarImage} />
    <Avatar name="林杏" src={avatarImage} shape="square" />
  </div>;
}

function AvatarSizes() {
  return <div className="doc-example-row">
    <Avatar name="林杏" size="sm" />
    <Avatar name="林杏" size="md" />
    <Avatar name="林杏" size="lg" />
    <Avatar name="装饰头像" decorative size="sm" />
  </div>;
}

function TagBasic() {
  return <div className="doc-example-row">
    <Tag>组件</Tag>
    <Tag>令牌</Tag>
    <Tag>可访问性</Tag>
  </div>;
}

function TagLong() {
  return <div style={{ maxWidth: 220 }}>
    <Tag>这是一段较长的标签文本，用于检查换行与容器宽度</Tag>
  </div>;
}

function TagInline() {
  return <p>筛选条件：<Tag>文档</Tag> <Tag>清单</Tag>，共 2 项。</p>;
}

function StatusBadgeTones() {
  return <div className="doc-example-row">
    <StatusBadge tone="neutral">草稿</StatusBadge>
    <StatusBadge tone="info">审核中</StatusBadge>
    <StatusBadge tone="success">已发布</StatusBadge>
    <StatusBadge tone="warning">待确认</StatusBadge>
    <StatusBadge tone="danger">失败</StatusBadge>
  </div>;
}

function StatusBadgeList() {
  return <div className="doc-example-stack">
    <div className="doc-example-row"><span>发布检查清单</span><StatusBadge tone="success">已发布</StatusBadge></div>
    <div className="doc-example-row"><span>接口规范</span><StatusBadge tone="info">审核中</StatusBadge></div>
    <div className="doc-example-row"><span>迁移记录</span><StatusBadge tone="warning">待确认</StatusBadge></div>
  </div>;
}

function StatusBadgeCompare() {
  return <div className="doc-example-row">
    <Tag>文档</Tag>
    <StatusBadge tone="success">已发布</StatusBadge>
    <span className="doc-example-note">Tag 表达分类，StatusBadge 表达状态。</span>
  </div>;
}

function ToggleGroupSingle() {
  const [value, setValue] = useState('list');
  return <ToggleGroup type="single" label="视图" value={value} onValueChange={setValue} items={[
    { value: 'list', label: '列表' },
    { value: 'grid', label: '网格' },
  ]} />;
}

function ToggleGroupMultiple() {
  const [value, setValue] = useState<string[]>(['bold']);
  return <ToggleGroup type="multiple" label="文本格式" value={value} onValueChange={setValue} items={[
    { value: 'bold', label: '粗体' },
    { value: 'italic', label: '斜体' },
    { value: 'underline', label: '下划线' },
  ]} />;
}

function ToggleGroupSizes() {
  const [value, setValue] = useState('day');
  return <div className="doc-example-stack">
    <ToggleGroup type="single" label="范围" size="sm" value={value} onValueChange={setValue} items={[
      { value: 'day', label: '日' },
      { value: 'week', label: '周' },
      { value: 'month', label: '月' },
      { value: 'year', label: '年', disabled: true },
    ]} />
    <p className="doc-example-note">禁用项被方向键跳过。</p>
  </div>;
}

function PaginationBasic() {
  const [page, setPage] = useState(2);
  const [pageSize, setPageSize] = useState(10);
  const total = 42;
  return <Pagination page={page} pageCount={Math.ceil(total / pageSize)} pageSize={pageSize} totalItems={total}
    onPageChange={setPage} onPageSizeChange={size => { setPageSize(size); setPage(1); }} />;
}

function PaginationSizes() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const total = 42;
  return <div className="doc-example-stack">
    <Pagination page={page} pageCount={Math.ceil(total / pageSize)} pageSize={pageSize} totalItems={total}
      pageSizeOptions={[5, 10, 20]} onPageChange={setPage} onPageSizeChange={size => { setPageSize(size); setPage(1); }} />
    <p className="doc-example-note">当前第 {page} 页，每页 {pageSize} 条。</p>
  </div>;
}

function PaginationSingle() {
  return <Pagination page={1} pageCount={1} pageSize={10} totalItems={8} onPageChange={() => {}} onPageSizeChange={() => {}} />;
}

function TocBasic() {
  const [current, setCurrent] = useState('import');
  return <TableOfContents label="页内目录" currentId={current} onNavigate={(id, event) => { event.preventDefault(); setCurrent(id); }} items={[
    { id: 'import', text: '导入' },
    { id: 'examples', text: '示例' },
    { id: 'api', text: 'API' },
  ]} />;
}

function TocLevels() {
  return <TableOfContents label="章节" currentId="api" onNavigate={(_, event) => event.preventDefault()} items={[
    { id: 'import', text: '导入' },
    { id: 'examples', text: '示例' },
    { id: 'api', text: 'API', level: 3 },
    { id: 'keyboard', text: '键盘与可访问性', level: 3 },
  ]} />;
}

function TocNavigate() {
  const [current, setCurrent] = useState('overview');
  return <div className="doc-example-stack">
    <TableOfContents label="目录" currentId={current} onNavigate={(id, event) => { event.preventDefault(); setCurrent(id); }} items={[
      { id: 'overview', text: '概览' },
      { id: 'settings', text: '设置' },
    ]} />
    <p className="doc-example-note">当前：{current}</p>
  </div>;
}

function CardBasic() {
  return <Card>
    <h3>发布检查清单</h3>
    <p className="doc-example-note">默认表面与 16px 内边距。</p>
  </Card>;
}

function CardTones() {
  return <div className="doc-example-stack">
    <Card tone="muted" padding="sm"><p>muted · sm</p></Card>
    <Card tone="app" padding="sm"><p>app · sm</p></Card>
    <Card padding="none"><div style={{ padding: 16 }}>none · 由内容自管内边距</div></Card>
  </div>;
}

function CardLink() {
  return <Card asChild padding="sm">
    <a href="#/catalog">打开组件目录 →</a>
  </Card>;
}

function SectionBasic() {
  return <Section title="资源信息">
    <p>区块用于页面分区，标题由组件生成并关联 aria-labelledby。</p>
  </Section>;
}

function SectionMeta() {
  return <Section eyebrow="发布流程" title="检查清单" description="发布前逐项确认。">
    <p>说明只在该文档区块使用。</p>
  </Section>;
}

function SectionSmall() {
  return <Section title="紧凑区块" size="sm">
    <p>sm 用于密集参考区，20px 内边距、16px 标题。</p>
  </Section>;
}

function TableBasic() {
  return <Table label="资源列表">
    <thead><tr><th scope="col">名称</th><th scope="col">类型</th><th scope="col">状态</th></tr></thead>
    <tbody>
      <tr><td>发布检查清单</td><td>清单</td><td>已发布</td></tr>
      <tr><td>接口规范</td><td>文档</td><td>审核中</td></tr>
    </tbody>
  </Table>;
}

function TableNoSticky() {
  return <Table label="资源列表（不吸顶）" stickyHeader={false}>
    <thead><tr><th scope="col">名称</th><th scope="col">类型</th><th scope="col">状态</th></tr></thead>
    <tbody>
      <tr><td>迁移记录</td><td>文档</td><td>待确认</td></tr>
      <tr><td>发布检查清单</td><td>清单</td><td>已发布</td></tr>
    </tbody>
  </Table>;
}

function TableLong() {
  return <Table label="长内容表格">
    <thead><tr><th scope="col">名称</th><th scope="col">说明</th></tr></thead>
    <tbody>
      <tr><td>发布检查清单</td><td>这是一段较长的说明，用于检查单元格换行与行高。</td></tr>
      <tr><td>接口规范与迁移记录</td><td>第二行内容。</td></tr>
    </tbody>
  </Table>;
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
  'inline-alert': [
    {
      id: 'tones',
      title: '状态层级',
      description: '四种语气对应不同图标与播报角色；danger 立即播报。',
      code: `<div>
  <InlineAlert tone="info">资源会在保存后同步。</InlineAlert>
  <InlineAlert tone="success">发布成功。</InlineAlert>
  <InlineAlert tone="warning">有 2 个标签待确认。</InlineAlert>
  <InlineAlert tone="danger">保存失败，请重试。</InlineAlert>
</div>`,
      preview: <InlineAlertTones />,
    },
    {
      id: 'title',
      title: '带标题',
      description: 'title 提供加粗摘要，正文保持简短。',
      code: `<InlineAlert tone="warning" title="待处理">有 2 个标签待确认，确认后才能发布。</InlineAlert>`,
      preview: <InlineAlertTitle />,
    },
    {
      id: 'long',
      title: '长内容',
      description: '错误保留为页面内容，不只放在 Toast 或 Tooltip 中。',
      code: `<InlineAlert tone="danger" title="同步失败">
  <p>服务器暂时不可用，本地草稿已保留。恢复网络后重试，或稍后再打开此页。</p>
</InlineAlert>`,
      preview: <InlineAlertLong />,
    },
  ],
  skeleton: [
    {
      id: 'basic',
      title: '基础占位',
      description: '宽高由 width / height 控制；纯展示且 aria-hidden。',
      code: `<div>
  <Skeleton width={240} height={16} />
  <Skeleton width="60%" height={12} />
</div>`,
      preview: <SkeletonBasic />,
    },
    {
      id: 'text',
      title: '文本骨架',
      description: '多行文本用百分比宽度模拟段落。',
      code: `<div>
  <Skeleton width="100%" height={14} />
  <Skeleton width="80%" height={14} />
  <Skeleton width="60%" height={14} />
</div>`,
      preview: <SkeletonText />,
    },
    {
      id: 'card',
      title: '卡片骨架',
      description: '组合头像与两行文本骨架；加载完成后移除。',
      code: `<div>
  <Skeleton width={40} height={40} />
  <div>
    <Skeleton width="70%" height={14} />
    <Skeleton width="40%" height={14} />
  </div>
</div>`,
      preview: <SkeletonCard />,
    },
  ],
  toast: [
    {
      id: 'basic',
      title: '基础通知',
      description: 'open / onOpenChange 控制显示；4.5 秒后自动关闭。',
      code: `import { useState } from 'react';

const [open, setOpen] = useState(false);

<>
  <div><Button onClick={() => setOpen(true)}>显示通知</Button></div>
  <Toast open={open} onOpenChange={setOpen} message="资源已保存" />
</>`,
      preview: <ToastBasic />,
    },
    {
      id: 'label',
      title: '自定义区域名',
      description: 'label 同时用于区域名与 F8 提示。',
      code: `const [open, setOpen] = useState(false);

<>
  <div><Button onClick={() => setOpen(true)}>显示发布通知</Button></div>
  <Toast open={open} onOpenChange={setOpen} message="发布完成" label="发布通知" closeLabel="关闭发布通知" />
</>`,
      preview: <ToastLabel />,
    },
    {
      id: 'manual',
      title: '手动关闭',
      description: '关闭按钮显示剩余时间；悬停或聚焦暂停倒计时。',
      code: `const [open, setOpen] = useState(false);

<>
  <div><Button onClick={() => setOpen(true)}>显示可关闭通知</Button></div>
  <Toast open={open} onOpenChange={setOpen} message="标签已添加，可在列表继续编辑" closeLabel="关闭标签通知" />
</>`,
      preview: <ToastManual />,
    },
  ],
  tooltip: [
    {
      id: 'button',
      title: '按钮提示',
      description: '悬停 400ms 或键盘聚焦显示。',
      code: `<Tooltip content="保存当前修改">
  <Button>保存</Button>
</Tooltip>`,
      preview: <TooltipBasic />,
    },
    {
      id: 'icon',
      title: '图标按钮',
      description: '补充已有可访问名称，不替代 label。',
      code: `<Tooltip content="添加资源">
  <IconButton label="添加资源"><Plus size={16} /></IconButton>
</Tooltip>`,
      preview: <TooltipIcon />,
    },
    {
      id: 'link',
      title: '链接提示',
      description: 'Escape 关闭；触屏没有悬停，必要说明不能只放这里。',
      code: `<Tooltip content="返回组件目录">
  <a href="#/catalog">组件目录</a>
</Tooltip>`,
      preview: <TooltipLink />,
    },
  ],
  'icon-button': [
    {
      id: 'basic',
      title: '基础图标按钮',
      description: 'label 必填；图标只作视觉，名称由 label 提供。',
      code: `<div>
  <IconButton label="添加资源"><Plus size={16} /></IconButton>
  <IconButton label="删除资源"><Trash2 size={16} /></IconButton>
</div>`,
      preview: <IconButtonBasic />,
    },
    {
      id: 'variants',
      title: '变体',
      description: '默认 ghost；危险操作使用 danger。',
      code: `<div>
  <IconButton label="添加资源" variant="secondary"><Plus size={16} /></IconButton>
  <IconButton label="删除资源" variant="danger"><Trash2 size={16} /></IconButton>
</div>`,
      preview: <IconButtonVariants />,
    },
    {
      id: 'states',
      title: '加载与禁用',
      description: 'loading 只显示 spinner 并保留焦点；disabled 退出 Tab 顺序。',
      code: `<div>
  <IconButton label="添加资源（处理中）" loading><Plus size={16} /></IconButton>
  <IconButton label="添加资源（不可用）" disabled><Plus size={16} /></IconButton>
</div>`,
      preview: <IconButtonStates />,
    },
  ],
  avatar: [
    {
      id: 'fallback',
      title: '首字回退',
      description: '没有图片时取名字首字；中文单字与英文缩写都可用。',
      code: `<div>
  <Avatar name="林杏" />
  <Avatar name="Ada Lovelace" />
</div>`,
      preview: <AvatarFallback />,
    },
    {
      id: 'image',
      title: '图片与形状',
      description: 'src 加载失败回退到首字；shape 控制圆形或圆角方形。',
      code: `const avatarImage = '/avatar.svg';

<Avatar name="林杏" src={avatarImage} />
<Avatar name="林杏" src={avatarImage} shape="square" />`,
      preview: <AvatarImage />,
    },
    {
      id: 'sizes',
      title: '尺寸与装饰',
      description: '三档尺寸；decorative 时对辅助技术隐藏。',
      code: `<div>
  <Avatar name="林杏" size="sm" />
  <Avatar name="林杏" size="md" />
  <Avatar name="林杏" size="lg" />
  <Avatar name="装饰头像" decorative size="sm" />
</div>`,
      preview: <AvatarSizes />,
    },
  ],
  tag: [
    {
      id: 'basic',
      title: '基础标签',
      description: '中性文本标签；状态语义请用 StatusBadge。',
      code: `<div>
  <Tag>组件</Tag>
  <Tag>令牌</Tag>
  <Tag>可访问性</Tag>
</div>`,
      preview: <TagBasic />,
    },
    {
      id: 'long',
      title: '长文本',
      description: '容器宽度决定换行，不截断内容。',
      code: `<div style={{ maxWidth: 220 }}>
  <Tag>这是一段较长的标签文本，用于检查换行与容器宽度</Tag>
</div>`,
      preview: <TagLong />,
    },
    {
      id: 'inline',
      title: '行内组合',
      description: '行内与文本混排时保持基线对齐。',
      code: `<p>筛选条件：<Tag>文档</Tag> <Tag>清单</Tag>，共 2 项。</p>`,
      preview: <TagInline />,
    },
  ],
  'status-badge': [
    {
      id: 'tones',
      title: '状态层级',
      description: '五个语气；文字本身要能说明状态，不能只靠颜色。',
      code: `<div>
  <StatusBadge tone="neutral">草稿</StatusBadge>
  <StatusBadge tone="info">审核中</StatusBadge>
  <StatusBadge tone="success">已发布</StatusBadge>
  <StatusBadge tone="warning">待确认</StatusBadge>
  <StatusBadge tone="danger">失败</StatusBadge>
</div>`,
      preview: <StatusBadgeTones />,
    },
    {
      id: 'list',
      title: '列表中的状态',
      description: '名称与状态分列，状态不抢主信息的层级。',
      code: `<div>
  <div><span>发布检查清单</span><StatusBadge tone="success">已发布</StatusBadge></div>
  <div><span>接口规范</span><StatusBadge tone="info">审核中</StatusBadge></div>
  <div><span>迁移记录</span><StatusBadge tone="warning">待确认</StatusBadge></div>
</div>`,
      preview: <StatusBadgeList />,
    },
    {
      id: 'compare',
      title: '与 Tag 的分工',
      description: 'Tag 表达分类，StatusBadge 表达状态。',
      code: `<div>
  <Tag>文档</Tag>
  <StatusBadge tone="success">已发布</StatusBadge>
  <span>Tag 表达分类，StatusBadge 表达状态。</span>
</div>`,
      preview: <StatusBadgeCompare />,
    },
  ],
  'toggle-group': [
    {
      id: 'single',
      title: '单选分段',
      description: 'radiogroup 语义，方向键移动即选中。',
      code: `const [value, setValue] = useState('list');

<ToggleGroup type="single" label="视图" value={value} onValueChange={setValue} items={[
  { value: 'list', label: '列表' },
  { value: 'grid', label: '网格' },
]} />`,
      preview: <ToggleGroupSingle />,
    },
    {
      id: 'multiple',
      title: '多选工具条',
      description: 'toolbar / aria-pressed 语义，方向键只移动焦点。',
      code: `const [value, setValue] = useState<string[]>(['bold']);

<ToggleGroup type="multiple" label="文本格式" value={value} onValueChange={setValue} items={[
  { value: 'bold', label: '粗体' },
  { value: 'italic', label: '斜体' },
  { value: 'underline', label: '下划线' },
]} />`,
      preview: <ToggleGroupMultiple />,
    },
    {
      id: 'sizes',
      title: '尺寸与禁用',
      description: 'size="sm" 用于紧凑工具条；禁用项被跳过。',
      code: `const [value, setValue] = useState('day');

<ToggleGroup type="single" label="范围" size="sm" value={value} onValueChange={setValue} items={[
  { value: 'day', label: '日' },
  { value: 'week', label: '周' },
  { value: 'month', label: '月' },
  { value: 'year', label: '年', disabled: true },
]} />`,
      preview: <ToggleGroupSizes />,
    },
  ],
  pagination: [
    {
      id: 'basic',
      title: '基础分页',
      description: '页码、页大小与跳页；pageCount 由调用方计算。',
      code: `const [page, setPage] = useState(2);
const [pageSize, setPageSize] = useState(10);
const total = 42;

<Pagination page={page} pageCount={Math.ceil(total / pageSize)} pageSize={pageSize} totalItems={total}
  onPageChange={setPage} onPageSizeChange={size => { setPageSize(size); setPage(1); }} />`,
      preview: <PaginationBasic />,
    },
    {
      id: 'sizes',
      title: '每页条数',
      description: 'pageSizeOptions 控制可选项；切换后回到第一页。',
      code: `const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(5);
const total = 42;

<Pagination page={page} pageCount={Math.ceil(total / pageSize)} pageSize={pageSize} totalItems={total}
  pageSizeOptions={[5, 10, 20]} onPageChange={setPage}
  onPageSizeChange={size => { setPageSize(size); setPage(1); }} />`,
      preview: <PaginationSizes />,
    },
    {
      id: 'single',
      title: '单页',
      description: '只有一页时隐藏页码与跳页，保留当前位置。',
      code: `<Pagination page={1} pageCount={1} pageSize={10} totalItems={8}
  onPageChange={() => {}} onPageSizeChange={() => {}} />`,
      preview: <PaginationSingle />,
    },
  ],
  'table-of-contents': [
    {
      id: 'basic',
      title: '基础目录',
      description: 'currentId 标记当前章节；onNavigate 可拦截跳转。',
      code: `const [current, setCurrent] = useState('import');

<TableOfContents label="页内目录" currentId={current}
  onNavigate={(id, event) => { event.preventDefault(); setCurrent(id); }} items={[
    { id: 'import', text: '导入' },
    { id: 'examples', text: '示例' },
    { id: 'api', text: 'API' },
  ]} />`,
      preview: <TocBasic />,
    },
    {
      id: 'levels',
      title: '层级',
      description: 'level 控制缩进；当前项不只靠颜色。',
      code: `<TableOfContents label="章节" currentId="api"
  onNavigate={(_, event) => event.preventDefault()} items={[
    { id: 'import', text: '导入' },
    { id: 'examples', text: '示例' },
    { id: 'api', text: 'API', level: 3 },
    { id: 'keyboard', text: '键盘与可访问性', level: 3 },
  ]} />`,
      preview: <TocLevels />,
    },
    {
      id: 'navigate',
      title: '当前项联动',
      description: '点击后更新 currentId，用 aria-current 表达位置。',
      code: `const [current, setCurrent] = useState('overview');

<TableOfContents label="目录" currentId={current}
  onNavigate={(id, event) => { event.preventDefault(); setCurrent(id); }} items={[
    { id: 'overview', text: '概览' },
    { id: 'settings', text: '设置' },
  ]} />`,
      preview: <TocNavigate />,
    },
  ],
  card: [
    {
      id: 'basic',
      title: '基础表面',
      description: '默认 surface 与 16px 内边距，用于内容分组。',
      code: `<Card>
  <h3>发布检查清单</h3>
  <p>默认表面与 16px 内边距。</p>
</Card>`,
      preview: <CardBasic />,
    },
    {
      id: 'tones',
      title: '表面与内边距',
      description: 'muted 用于弱化内嵌，app 用于预览画布；padding="none" 由内容自管。',
      code: `<div>
  <Card tone="muted" padding="sm"><p>muted · sm</p></Card>
  <Card tone="app" padding="sm"><p>app · sm</p></Card>
  <Card padding="none"><div style={{ padding: 16 }}>none · 由内容自管内边距</div></Card>
</div>`,
      preview: <CardTones />,
    },
    {
      id: 'link',
      title: '链接卡片',
      description: 'asChild 把表面挂到链接上，保留链接语义与键盘行为。',
      code: `<Card asChild padding="sm">
  <a href="#/catalog">打开组件目录 →</a>
</Card>`,
      preview: <CardLink />,
    },
  ],
  section: [
    {
      id: 'basic',
      title: '基础区块',
      description: '标题由组件生成并关联 aria-labelledby。',
      code: `<Section title="资源信息">
  <p>区块用于页面分区，标题由组件生成并关联 aria-labelledby。</p>
</Section>`,
      preview: <SectionBasic />,
    },
    {
      id: 'meta',
      title: 'eyebrow 与说明',
      description: 'eyebrow 提供流程标签；description 仅用于文档区块。',
      code: `<Section eyebrow="发布流程" title="检查清单" description="发布前逐项确认。">
  <p>说明只在该文档区块使用。</p>
</Section>`,
      preview: <SectionMeta />,
    },
    {
      id: 'small',
      title: '紧凑区块',
      description: 'size="sm" 降低标题与内边距，用于密集参考区。',
      code: `<Section title="紧凑区块" size="sm">
  <p>sm 用于密集参考区，20px 内边距、16px 标题。</p>
</Section>`,
      preview: <SectionSmall />,
    },
  ],
  table: [
    {
      id: 'basic',
      title: '基础表格',
      description: 'label 渲染为视觉隐藏的 caption；表头默认吸顶。',
      code: `<Table label="资源列表">
  <thead><tr><th scope="col">名称</th><th scope="col">类型</th><th scope="col">状态</th></tr></thead>
  <tbody>
    <tr><td>发布检查清单</td><td>清单</td><td>已发布</td></tr>
    <tr><td>接口规范</td><td>文档</td><td>审核中</td></tr>
  </tbody>
</Table>`,
      preview: <TableBasic />,
    },
    {
      id: 'no-sticky',
      title: '不吸顶',
      description: '页面级滚动退化时关闭 stickyHeader。',
      code: `<Table label="资源列表（不吸顶）" stickyHeader={false}>
  <thead><tr><th scope="col">名称</th><th scope="col">类型</th><th scope="col">状态</th></tr></thead>
  <tbody>
    <tr><td>迁移记录</td><td>文档</td><td>待确认</td></tr>
    <tr><td>发布检查清单</td><td>清单</td><td>已发布</td></tr>
  </tbody>
</Table>`,
      preview: <TableNoSticky />,
    },
    {
      id: 'long',
      title: '长内容',
      description: '单元格长文本换行由内容决定，列宽由页面控制。',
      code: `<Table label="长内容表格">
  <thead><tr><th scope="col">名称</th><th scope="col">说明</th></tr></thead>
  <tbody>
    <tr><td>发布检查清单</td><td>这是一段较长的说明，用于检查单元格换行与行高。</td></tr>
    <tr><td>接口规范与迁移记录</td><td>第二行内容。</td></tr>
  </tbody>
</Table>`,
      preview: <TableLong />,
    },
  ],
};
