import { useState, type ReactNode } from 'react';
import { Button, FormField, Input, Select, Tabs, TabsContent, TabsList, Textarea } from '@radish-ui/react';

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
};
