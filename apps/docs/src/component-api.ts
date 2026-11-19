export interface ComponentApiRow {
  component?: string;
  name: string;
  type: string;
  defaultValue?: string;
  required: boolean;
  description: string;
}

export interface PilotDoc {
  api: readonly ComponentApiRow[];
  importCode: string;
  keyboard: readonly string[];
  related: readonly string[];
}

/**
 * The pilot entries are the first per-component pages. Their API rows mirror
 * the exported TypeScript types; the next phase replaces this file with a
 * generator that reads the source interfaces directly.
 */
export const pilotDocs: Record<string, PilotDoc> = {
  button: {
    importCode: "import { Button } from '@radish-ui/react';\nimport '@radish-ui/react/styles.css';",
    api: [
      { name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'danger'", defaultValue: "'primary'", required: false, description: '操作层级；一个区域只保留一个主要操作。' },
      { name: 'size', type: "'sm' | 'md'", defaultValue: "'md'", required: false, description: 'sm 用于工具栏与紧凑行，md 用于页面和表单操作。' },
      { name: 'loading', type: 'boolean', defaultValue: 'false', required: false, description: '保留焦点，设置 aria-disabled / aria-busy，并拦截重复激活。' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', required: false, description: '使用原生 disabled，不进入 Tab 顺序。' },
      { name: 'type', type: "'button' | 'submit' | 'reset'", defaultValue: "'button'", required: false, description: '默认不触发表单提交；提交按钮显式传 submit。' },
      { name: 'children', type: 'ReactNode', required: true, description: '可见操作文案；图标按钮请使用 IconButton。' },
      { name: 'onClick', type: 'MouseEventHandler<HTMLButtonElement>', required: false, description: '原生点击回调；loading 时不执行。' },
      { name: 'className', type: 'string', defaultValue: "''", required: false, description: '附加类名，不替代 variant / size。' },
      { name: 'ref', type: 'Ref<HTMLButtonElement>', required: false, description: '转发到原生 button；其余原生属性一并透传。' },
    ],
    keyboard: ['Tab 聚焦，Enter / Space 触发。', 'loading 时焦点保留在按钮上，重复激活被拦截。', 'disabled 不进入 Tab 顺序。'],
    related: ['icon-button', 'dialog'],
  },
  'form-field': {
    importCode: "import { FormField, Input } from '@radish-ui/react';\nimport '@radish-ui/react/styles.css';",
    api: [
      { name: 'label', type: 'ReactNode', required: true, description: '字段标签；通过 htmlFor 关联字段内控件。' },
      { name: 'hint', type: 'ReactNode', required: false, description: '补充说明；error 存在时不显示。' },
      { name: 'error', type: 'ReactNode', required: false, description: '错误文本；role=alert，并把 aria-invalid 传给字段内控件。' },
      { name: 'required', type: 'boolean', defaultValue: 'false', required: false, description: '显示必填标记，并把 required 传给字段内控件。' },
      { name: 'id', type: 'string', required: false, description: '控件 id；未传时生成稳定 id。' },
      { name: 'className', type: 'string', defaultValue: "''", required: false, description: '附加类名，不改变字段结构。' },
      { name: 'children', type: 'ReactNode', required: true, description: '字段控件；Input / Textarea / Select 自动读取标签、说明、错误与必填。' },
    ],
    keyboard: [
      '字段原语不承担键盘行为；点击标签聚焦关联控件。',
      '错误以 role=alert 播报，说明与错误通过 aria-describedby 关联。',
      '必填标记对辅助技术隐藏，required 由字段内控件原生表达。',
    ],
    related: ['input', 'textarea', 'select'],
  },
  input: {
    importCode: "import { FormField, Input } from '@radish-ui/react';\nimport '@radish-ui/react/styles.css';",
    api: [
      { name: 'value', type: 'string', required: false, description: '受控值；与 defaultValue 二选一。' },
      { name: 'defaultValue', type: 'string', required: false, description: '非受控初始值。' },
      { name: 'onChange', type: 'ChangeEventHandler<HTMLInputElement>', required: false, description: '输入变化回调；其余原生 input 事件透传。' },
      { name: 'placeholder', type: 'string', required: false, description: '空值提示；不替代字段标签。' },
      { name: 'surface', type: "'outline' | 'filled'", defaultValue: "'outline'", required: false, description: '输入表面；filled 用于强调或分组背景。' },
      { name: 'id', type: 'string', required: false, description: '控件 id；在 FormField 内自动继承。' },
      { name: 'required', type: 'boolean', required: false, description: '未传时继承 FormField 的 required。' },
      { name: 'aria-describedby', type: 'string', required: false, description: '与字段说明 / 错误合并，不覆盖字段上下文。' },
      { name: 'aria-invalid', type: 'boolean', required: false, description: '显式传入时优先；FormField 有 error 时自动为 true。' },
      { name: 'className', type: 'string', defaultValue: "''", required: false, description: '附加类名，不替代 surface。' },
      { name: 'ref', type: 'Ref<HTMLInputElement>', required: false, description: '转发到原生 input；其余原生属性一并透传。' },
    ],
    keyboard: [
      '原生文本输入：Tab 聚焦，方向键 / Home / End 移动光标，编辑快捷键沿用浏览器。',
      '错误以 role=alert 播报，说明与错误通过 aria-describedby 关联。',
      'required 使用原生属性，由表单校验与辅助技术识别。',
    ],
    related: ['form-field', 'textarea', 'input-otp'],
  },
  textarea: {
    importCode: "import { FormField, Textarea } from '@radish-ui/react';\nimport '@radish-ui/react/styles.css';",
    api: [
      { name: 'value', type: 'string', required: false, description: '受控值；与 defaultValue 二选一。' },
      { name: 'defaultValue', type: 'string', required: false, description: '非受控初始值。' },
      { name: 'onChange', type: 'ChangeEventHandler<HTMLTextAreaElement>', required: false, description: '输入变化回调；其余原生 textarea 事件透传。' },
      { name: 'rows', type: 'number', required: false, description: '初始可见行数；实际高度仍可拖拽调整。' },
      { name: 'readOnly', type: 'boolean', defaultValue: 'false', required: false, description: '只读；保留选择与复制，不响应编辑。' },
      { name: 'surface', type: "'outline' | 'filled'", defaultValue: "'outline'", required: false, description: '输入表面；与 Input 使用同一组语义。' },
      { name: 'id', type: 'string', required: false, description: '控件 id；在 FormField 内自动继承。' },
      { name: 'required', type: 'boolean', required: false, description: '未传时继承 FormField 的 required。' },
      { name: 'aria-describedby', type: 'string', required: false, description: '与字段说明 / 错误合并，不覆盖字段上下文。' },
      { name: 'className', type: 'string', defaultValue: "''", required: false, description: '附加类名；保留垂直 resize。' },
      { name: 'ref', type: 'Ref<HTMLTextAreaElement>', required: false, description: '转发到原生 textarea；其余原生属性一并透传。' },
    ],
    keyboard: [
      'Tab 聚焦，Enter 换行；编辑快捷键沿用原生 textarea。',
      '保留垂直 resize，拖拽尺寸不改变键盘行为。',
      '说明与错误通过 aria-describedby 关联，错误以 role=alert 播报。',
    ],
    related: ['form-field', 'input'],
  },
  select: {
    importCode: "import { FormField, Select } from '@radish-ui/react';\nimport '@radish-ui/react/styles.css';",
    api: [
      { name: 'value', type: 'string', required: true, description: '受控当前值；空字符串表示未选择。' },
      { name: 'onValueChange', type: '(value: string) => void', required: true, description: '选择变化回调；由调用方保存状态。' },
      { name: 'options', type: 'readonly { value: string; label: string; disabled?: boolean }[]', required: true, description: '选项列表；禁用项会跳过键盘移动。' },
      { name: 'label', type: 'string', required: false, description: '独立使用时的可访问名称；在 FormField 内由字段标签关联。' },
      { name: 'placeholder', type: 'string', required: false, description: '未选择时的触发器文案。' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', required: false, description: '触发器不可用，不进入 Tab 顺序。' },
      { name: 'required', type: 'boolean', defaultValue: 'false', required: false, description: '未传时继承 FormField 的 required。' },
      { name: 'name', type: 'string', required: false, description: '表单提交用的隐藏字段名。' },
      { name: 'id', type: 'string', required: false, description: '触发器 id；在 FormField 内自动生成。' },
      { name: 'surface', type: "'outline' | 'filled'", defaultValue: "'outline'", required: false, description: '触发器表面；filled 只作为可选形态。' },
      { name: 'size', type: "'sm' | 'md'", defaultValue: "'md'", required: false, description: 'sm 用于页面 chrome，md 用于表单字段。' },
      { name: 'className', type: 'string', defaultValue: "''", required: false, description: '附加类名，不改变浮层行为。' },
    ],
    keyboard: ['Space / Enter 展开，方向键与 Home / End 移动。', 'Enter 确认，Escape 关闭并把焦点还给触发器。', '选项以高亮表达键盘焦点，不叠加 1px 环。'],
    related: ['form-field', 'radio-group'],
  },
  tabs: {
    importCode: "import { Tabs, TabsContent, TabsList } from '@radish-ui/react';\nimport '@radish-ui/react/styles.css';",
    api: [
      { component: 'Tabs', name: 'value', type: 'string', required: false, description: '受控当前标签；与 defaultValue 二选一。' },
      { component: 'Tabs', name: 'defaultValue', type: 'string', required: false, description: '非受控初始标签。' },
      { component: 'Tabs', name: 'onValueChange', type: '(value: string) => void', required: false, description: '标签变化回调。' },
      { component: 'Tabs', name: 'className', type: 'string', defaultValue: "''", required: false, description: '附加类名；其余 Radix Root 属性透传。' },
      { component: 'TabsList', name: 'label', type: 'string', required: true, description: '标签组的可访问名称。' },
      { component: 'TabsList', name: 'items', type: 'readonly { value: string; label: ReactNode; disabled?: boolean }[]', required: true, description: '标签定义；禁用项跳过键盘移动。' },
      { component: 'TabsList', name: 'size', type: "'sm' | 'md' | 'lg'", required: false, description: '标签轨道尺寸；默认随站点尺度。' },
      { component: 'TabsList', name: 'className', type: 'string', defaultValue: "''", required: false, description: '附加类名。' },
      { component: 'TabsContent', name: 'value', type: 'string', required: true, description: '与对应标签的 value 关联。' },
      { component: 'TabsContent', name: 'children', type: 'ReactNode', required: true, description: '面板内容；切换时只显示当前面板。' },
      { component: 'TabsContent', name: 'className', type: 'string', defaultValue: "''", required: false, description: '附加类名；其余 Radix Content 属性透传。' },
    ],
    keyboard: ['Tab 进入当前标签，左右方向键切换，Home / End 到首尾。', '禁用标签被跳过；焦点与选中分别呈现。', '标签组在窄屏可换行，避免入口被裁切。'],
    related: ['toggle-group', 'accordion'],
  },
};
