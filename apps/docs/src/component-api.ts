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
