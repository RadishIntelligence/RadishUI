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
  'input-otp': {
    importCode: "import { InputOTP } from '@radish-ui/react';\nimport '@radish-ui/react/styles.css';",
    api: [
      { name: 'value', type: 'string', required: true, description: '受控验证码；按数字字符保存，空位不占位。' },
      { name: 'onValueChange', type: '(value: string) => void', required: true, description: '输入、删除或粘贴后回传完整数字串。' },
      { name: 'label', type: 'string', required: true, description: '字段标签，并用于逐位输入的可访问名称。' },
      { name: 'length', type: 'number', defaultValue: '6', required: false, description: '位数；小于 1 时按 1 处理。' },
      { name: 'hint', type: 'string', required: false, description: '说明文本；error 存在时不显示。' },
      { name: 'error', type: 'string', required: false, description: '错误文本；role=alert，并关联到每一位输入。' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', required: false, description: '禁用全部输入位与隐藏字段。' },
      { name: 'required', type: 'boolean', defaultValue: 'false', required: false, description: '显示必填标记，并以 group aria-required 表达。' },
      { name: 'autoFocus', type: 'boolean', defaultValue: 'false', required: false, description: '挂载后聚焦第一个空位。' },
      { name: 'autoComplete', type: 'string', defaultValue: "'one-time-code'", required: false, description: '仅第一位设置，供浏览器自动填充验证码。' },
      { name: 'name', type: 'string', required: false, description: '表单提交用的隐藏字段名；值始终是完整数字串。' },
      { name: 'id', type: 'string', required: false, description: '第一位输入的 id；其余位由组件生成。' },
      { name: 'className', type: 'string', defaultValue: "''", required: false, description: '附加类名。' },
      { name: 'onEnterPress', type: '() => void', required: false, description: '提供时 Enter 只触发回调并阻止表单提交；未提供时保留浏览器默认提交。' },
    ],
    keyboard: [
      '输入数字自动进入下一位；粘贴多位数字会从当前位起填充。',
      'Backspace 删除当前位或回退删除前一位；Delete、方向键与 Home / End 可逐位移动。',
      '有 onEnterPress 时 Enter 只触发回调；没有回调时 Enter 交给表单提交；非数字键被忽略。',
    ],
    related: ['input', 'form-field'],
  },
  'tag-input': {
    importCode: "import { FormField, TagInput } from '@radish-ui/react';\nimport '@radish-ui/react/styles.css';",
    api: [
      { name: 'value', type: 'readonly string[]', required: true, description: '已保存的标签；渲染与删除都以此为准。' },
      { name: 'onValueChange', type: '(value: string[]) => void', required: true, description: '删除标签时回传新数组；添加由 onAdd 处理。' },
      { name: 'draft', type: 'string', required: true, description: '输入框草稿；由调用方持有。' },
      { name: 'onDraftChange', type: '(draft: string) => void', required: true, description: '草稿变化回调。' },
      { name: 'onAdd', type: '() => void', required: true, description: 'Enter 或添加按钮触发；是否去重、限长由调用方决定。' },
      { name: 'addLabel', type: 'string', required: true, description: '添加按钮文案。' },
      { name: 'removeLabel', type: '(tag: string) => string', required: true, description: '每个删除按钮的可访问名称。' },
      { name: 'label', type: 'string', required: false, description: '独立使用时的可访问名称；在 FormField 内由字段标签关联。' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', required: false, description: '禁用输入、添加与删除。' },
    ],
    keyboard: [
      'Enter 添加当前草稿；输入框为空时 Backspace 删除最后一个标签。',
      '每个标签的删除按钮可 Tab 到达，也可用 Enter / Space 触发。',
      '中文输入法组合期间不触发添加；Safari 的组合确认键同样被忽略。',
    ],
    related: ['tag', 'form-field', 'input'],
  },
  'radio-group': {
    importCode: "import { FormField, RadioGroup } from '@radish-ui/react';\nimport '@radish-ui/react/styles.css';",
    api: [
      { name: 'value', type: 'string', required: true, description: '受控当前值。' },
      { name: 'onValueChange', type: '(value: string) => void', required: true, description: '选择或方向键移动时回传。' },
      { name: 'options', type: 'readonly { value: string; label: string; disabled?: boolean }[]', required: true, description: '选项列表；label 为字符串，保证可访问名称。' },
      { name: 'label', type: 'string', required: false, description: '独立使用时的可访问名称；FormField 内由字段标签关联。' },
      { name: 'name', type: 'string', required: false, description: '表单提交字段名。' },
      { name: 'disabled', type: 'boolean', required: false, description: '禁用整组；禁用项不进入方向键顺序。' },
      { name: 'required', type: 'boolean', required: false, description: '未传时继承 FormField 的 required。' },
      { name: 'orientation', type: "'vertical' | 'horizontal'", defaultValue: "'vertical'", required: false, description: '排列方向；水平用于紧凑选项。' },
      { name: 'className', type: 'string', defaultValue: "''", required: false, description: '附加类名。' },
      { name: 'id', type: 'string', required: false, description: '组内第一项的 id 基准；FormField 内自动继承。' },
    ],
    keyboard: [
      '方向键在选项间移动并立即选中；禁用项被跳过。',
      'Tab 进入整组一次，离开时不会逐个经过选项。',
      '错误通过 FormField 关联，role=alert 播报。',
    ],
    related: ['form-field', 'checkbox', 'select'],
  },
  checkbox: {
    importCode: "import { Checkbox } from '@radish-ui/react';\nimport '@radish-ui/react/styles.css';",
    api: [
      { name: 'checked', type: 'boolean', required: false, description: '受控选中状态；与 defaultChecked 二选一。' },
      { name: 'defaultChecked', type: 'boolean', required: false, description: '非受控初始状态。' },
      { name: 'onChange', type: 'ChangeEventHandler<HTMLInputElement>', required: false, description: '原生 change 回调。' },
      { name: 'children', type: 'ReactNode', required: false, description: '可见标签文字；无文字时必须提供可访问名称。' },
      { name: 'disabled', type: 'boolean', required: false, description: '原生禁用；不进入 Tab 顺序。' },
      { name: 'required', type: 'boolean', required: false, description: '原生必填；组内多个复选框需调用方自行校验。' },
      { name: 'name', type: 'string', required: false, description: '表单提交字段名。' },
      { name: 'value', type: 'string', required: false, description: '提交值；未传时浏览器默认 on。' },
      { name: 'className', type: 'string', defaultValue: "''", required: false, description: '附加类名。' },
      { name: 'ref', type: 'Ref<HTMLInputElement>', required: false, description: '转发到原生 input。' },
    ],
    keyboard: [
      '原生复选框：Space 切换选中，Tab 聚焦。',
      '禁用项不进入 Tab 顺序。',
      '标签点击与 Space 等价；焦点环使用共享 1px token。',
    ],
    related: ['radio-group', 'switch', 'form-field'],
  },
  switch: {
    importCode: "import { Switch } from '@radish-ui/react';\nimport '@radish-ui/react/styles.css';",
    api: [
      { name: 'checked', type: 'boolean', required: false, description: '受控开关状态；与 defaultChecked 二选一。' },
      { name: 'defaultChecked', type: 'boolean', required: false, description: '非受控初始状态。' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', required: false, description: '状态变化回调；点击或键盘切换时触发。' },
      { name: 'disabled', type: 'boolean', required: false, description: '禁用；不进入 Tab 顺序。' },
      { name: 'required', type: 'boolean', required: false, description: '原生必填语义。' },
      { name: 'name', type: 'string', required: false, description: '表单提交字段名。' },
      { name: 'value', type: 'string', required: false, description: '提交值。' },
      { name: 'id', type: 'string', required: false, description: '开关 id；用于与外部 label 关联。' },
      { name: 'className', type: 'string', defaultValue: "''", required: false, description: '附加类名。' },
      { name: 'ref', type: 'Ref<HTMLButtonElement>', required: false, description: '转发到 Radix Root 的 button。' },
    ],
    keyboard: [
      'Space / Enter 切换状态；Tab 聚焦。',
      'Switch 本身不带可见标签，调用方用 label 显式关联或提供 aria-label。',
      '禁用后不进入 Tab 顺序。',
    ],
    related: ['checkbox', 'radio-group'],
  },
};
