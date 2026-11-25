import type { BehaviorEntry } from './component-api-types';

/**
 * Per-component behavior attribution and accessibility declarations. Each entry
 * records one keyboard / focus / ARIA / limitation fact and the layer responsible:
 * the browser's native semantics, Radix Primitives, or RadishUI's own composition.
 * Combined interactions are split per layer instead of merged into one sentence, and
 * every entry carries the Chinese and English declaration together so the two cannot
 * drift apart while the component page can localize.
 *
 * `scripts/generate-api.mjs` validates that every catalog component is covered and
 * writes the declarations into `component-api.generated.ts`; component pages and
 * `llms.txt` consume the generated output. Do not import this module from the site.
 */
export const authoredBehavior: Record<string, readonly BehaviorEntry[]> = {
  button: [
    { topic: 'keyboard', source: 'native', text: 'Tab 聚焦，Enter / Space 触发。', textEn: 'Tab moves focus to the button; Enter / Space activates it.' },
    { topic: 'focus', source: 'radish', text: 'loading 时保留焦点，重复激活被拦截。', textEn: 'loading keeps focus and blocks repeated activation.' },
    { topic: 'aria', source: 'radish', text: 'loading 时设置 aria-disabled / aria-busy。', textEn: 'loading sets aria-disabled / aria-busy.' },
    { topic: 'keyboard', source: 'native', text: 'disabled 使用原生 disabled，不进入 Tab 顺序。', textEn: 'disabled uses the native disabled attribute and stays out of the Tab order.' },
  ],
  'icon-button': [
    { topic: 'keyboard', source: 'native', text: 'Tab 聚焦，Enter / Space 触发。', textEn: 'Tab moves focus to the button; Enter / Space activates it.' },
    { topic: 'aria', source: 'radish', text: 'label 提供可访问名称；不要用图标替代名称。', textEn: 'label provides the accessible name; do not let the icon replace the name.' },
    { topic: 'focus', source: 'radish', text: 'loading 时保留焦点并只显示 spinner，重复激活被拦截。', textEn: 'loading keeps focus, shows only the spinner, and blocks repeated activation.' },
    { topic: 'keyboard', source: 'native', text: 'disabled 使用原生 disabled，不进入 Tab 顺序。', textEn: 'disabled uses the native disabled attribute and stays out of the Tab order.' },
  ],
  form: [
    { topic: 'keyboard', source: 'native', text: '单行输入内按 Enter 触发表单提交，提交事件由 Form 接管。', textEn: 'Pressing Enter in a single-line input triggers form submission, and Form handles the submit event.' },
    { topic: 'focus', source: 'radish', text: '校验未通过时把焦点移到 DOM 顺序中的第一个错误字段。', textEn: 'When validation fails, focus moves to the first invalid field in DOM order.' },
    { topic: 'aria', source: 'native', text: '原生 form 提供表单语义；字段错误由 FormField 的 role=alert 播报。', textEn: 'The native form provides form semantics; field errors are announced by FormField\'s role=alert.' },
    { topic: 'limitation', source: 'radish', text: 'Form 不计算校验规则、不渲染错误文案；规则、错误状态与 FormField error 由调用方维护。', textEn: 'Form does not compute validation rules and does not render error text; the caller maintains the rules, error state, and FormField error.' },
  ],
  'form-field': [
    { topic: 'keyboard', source: 'native', text: '字段原语不承担键盘行为；点击标签聚焦关联控件。', textEn: 'The field primitive adds no keyboard behavior; clicking the label focuses the associated control.' },
    { topic: 'aria', source: 'radish', text: '错误以 role=alert 播报，说明与错误通过 aria-describedby 关联。', textEn: 'Errors are announced with role=alert, and both the description and the error are associated through aria-describedby.' },
    { topic: 'aria', source: 'radish', text: '必填标记对辅助技术隐藏，required 由字段内控件原生表达。', textEn: 'The required marker is hidden from assistive technology; required is expressed natively by the control inside the field.' },
    { topic: 'limitation', source: 'radish', text: 'error 存在时不显示 hint；两者都需要时由调用方组织文案。', textEn: 'When error is present, hint is not shown; when both are needed, the caller composes the text.' },
  ],
  input: [
    { topic: 'keyboard', source: 'native', text: '原生文本输入：Tab 聚焦，方向键 / Home / End 移动光标，编辑快捷键沿用浏览器。', textEn: 'As a native text input, it takes focus with Tab, moves the caret with arrow keys / Home / End, and follows browser editing shortcuts.' },
    { topic: 'aria', source: 'radish', text: '错误以 role=alert 播报，说明与错误通过 aria-describedby 关联。', textEn: 'Errors are announced with role=alert, and both the description and the error are associated through aria-describedby.' },
    { topic: 'aria', source: 'native', text: 'required 使用原生属性，由表单校验与辅助技术识别。', textEn: 'required uses the native attribute and is recognized by form validation and assistive technology.' },
    { topic: 'aria', source: 'radish', text: '在 FormField 内自动继承 id、required、aria-describedby 与 aria-invalid。', textEn: 'Inside FormField it automatically inherits id, required, aria-describedby, and aria-invalid.' },
  ],
  'input-number': [
    { topic: 'keyboard', source: 'native', text: '输入框沿用原生文本编辑：Tab 聚焦，Home / End 与编辑快捷键按浏览器处理。', textEn: 'The input follows native text editing: Tab focuses it, while Home / End and editing shortcuts are handled by the browser.' },
    { topic: 'keyboard', source: 'radish', text: '方向键上 / 下按 step 调整并阻止光标移动；上下按钮不进入 Tab 顺序，点击同样按 min / max 钳制。', textEn: 'The Up / Down arrow keys adjust by step and prevent caret movement; the up and down buttons stay out of the Tab order, and clicks are clamped by min / max as well.' },
    { topic: 'focus', source: 'radish', text: '失焦时把空值还原为最近一次有效值，越界值钳制到 min / max。', textEn: 'On blur, an empty value returns to the last valid value, and out-of-range values are clamped to min / max.' },
    { topic: 'aria', source: 'radish', text: '输入框使用 role=spinbutton 与 aria-valuenow / min / max；FormField 的标签、说明与错误自动关联。', textEn: 'The input uses role=spinbutton with aria-valuenow / min / max; FormField\'s label, description, and error are associated automatically.' },
    { topic: 'limitation', source: 'radish', text: '受控值由调用方持有；不做千分位、货币前缀、精度格式化、异步校验或空值提交。', textEn: 'The caller owns the controlled value; the component does not add thousands separators, currency prefixes, or precision formatting, and does not perform async validation or empty-value submission.' },
    { topic: 'limitation', source: 'radish', text: '粗指针 / 触屏隐藏上下步进按钮，改用数字键盘输入；控件本身不扩大触控命中。', textEn: 'With a coarse pointer / touch, the up and down step buttons are hidden and input switches to the numeric keypad; the control itself does not enlarge the touch target.' },
  ],
  textarea: [
    { topic: 'keyboard', source: 'native', text: 'Tab 聚焦，Enter 换行；编辑快捷键沿用原生 textarea。', textEn: 'Tab focuses it and Enter inserts a line break; editing shortcuts follow the native textarea.' },
    { topic: 'limitation', source: 'radish', text: '保留垂直 resize，页面布局需允许高度变化；拖拽尺寸不改变键盘行为。', textEn: 'Vertical resize is kept, so page layout must allow height changes; dragging the size does not change keyboard behavior.' },
    { topic: 'aria', source: 'radish', text: '说明与错误通过 aria-describedby 关联，错误以 role=alert 播报。', textEn: 'The description and error are associated through aria-describedby, and the error is announced with role=alert.' },
    { topic: 'aria', source: 'radish', text: '在 FormField 内自动继承 id、required、aria-describedby 与 aria-invalid。', textEn: 'Inside FormField it automatically inherits id, required, aria-describedby, and aria-invalid.' },
  ],
  select: [
    { topic: 'keyboard', source: 'radix', text: 'Space / Enter 展开，方向键与 Home / End 移动。', textEn: 'Space / Enter expands it, and arrow keys with Home / End move through the options.' },
    { topic: 'keyboard', source: 'radix', text: 'Enter 确认，Escape 关闭并把焦点还给触发器。', textEn: 'Enter confirms, and Escape closes it and returns focus to the trigger.' },
    { topic: 'focus', source: 'radix', text: '选项的键盘焦点由 Radix 设置 data-highlighted 表达。', textEn: 'Keyboard focus on an option is expressed by data-highlighted, which Radix sets.' },
    { topic: 'aria', source: 'radish', text: '选项高亮不叠加 1px 环；强制颜色下改用 2px 系统色描边。', textEn: 'The option highlight does not add a 1px ring; under forced colors it uses a 2px system-color outline instead.' },
  ],
  'input-otp': [
    { topic: 'keyboard', source: 'radish', text: '输入数字自动进入下一位；粘贴多位数字会从当前位起填充。', textEn: 'Typing a digit advances to the next slot automatically; pasting multiple digits fills from the current slot onward.' },
    { topic: 'keyboard', source: 'radish', text: 'Backspace 删除当前位或回退删除前一位；Delete 清空当前位；方向键与 Home / End 可逐位移动。', textEn: 'Backspace deletes the current slot or moves back to delete the previous one; Delete clears the current slot; arrow keys and Home / End move one slot at a time.' },
    { topic: 'keyboard', source: 'radish', text: '有 onEnterPress 时 Enter 只触发回调；没有回调时 Enter 交给表单提交；非数字键被忽略。', textEn: 'With onEnterPress, Enter only triggers the callback; without a callback, Enter is left to form submission; non-digit keys are ignored.' },
    { topic: 'aria', source: 'radish', text: '错误用 role=alert，并通过 aria-describedby 关联到每一位输入。', textEn: 'The error uses role=alert and is associated with every input slot through aria-describedby.' },
    { topic: 'aria', source: 'radish', text: 'required 以 group aria-required 表达，原生表单校验由调用方基于受控值处理。', textEn: 'required is expressed with aria-required on the group, and native form validation is handled by the caller based on the controlled value.' },
  ],
  'tag-input': [
    { topic: 'keyboard', source: 'radish', text: 'Enter 添加当前草稿；输入框为空时 Backspace 删除最后一个标签。', textEn: 'Enter adds the current draft; when the input is empty, Backspace removes the last tag.' },
    { topic: 'keyboard', source: 'native', text: '每个标签的删除按钮可 Tab 到达，也可用 Enter / Space 触发。', textEn: 'Each tag\'s remove button is reachable with Tab and can also be triggered with Enter / Space.' },
    { topic: 'keyboard', source: 'radish', text: '中文输入法组合期间不触发添加；Safari 的组合确认键同样被忽略。', textEn: 'No tag is added during Chinese IME composition; Safari\'s composition-confirm key is ignored as well.' },
    { topic: 'aria', source: 'radish', text: '每个删除按钮通过 removeLabel 获得独立可访问名称。', textEn: 'Each remove button gets an independent accessible name through removeLabel.' },
    { topic: 'limitation', source: 'radish', text: '是否去重、限长与表单提交由调用方负责。', textEn: 'Deduplication, length limits, and form submission are the caller\'s responsibility.' },
  ],
  'radio-group': [
    { topic: 'keyboard', source: 'radix', text: '方向键在选项间移动，禁用项被跳过。', textEn: 'Arrow keys move between options, and disabled options are skipped.' },
    { topic: 'focus', source: 'radish', text: '程序化聚焦到选项时同步选中值；方向键选中由 Radix 完成。', textEn: 'Programmatic focus on an option also selects it; arrow-key selection is handled by Radix.' },
    { topic: 'keyboard', source: 'radix', text: 'Tab 进入整组一次，离开时不会逐个经过选项。', textEn: 'Tab enters the group once and does not step through the options on the way out.' },
    { topic: 'aria', source: 'radish', text: '错误通过 FormField 关联，role=alert 播报。', textEn: 'Errors are associated through FormField and announced with role=alert.' },
    { topic: 'aria', source: 'radish', text: '每项 label 使用字符串，保证独立可访问名称。', textEn: 'Each item\'s label is a string, ensuring an independent accessible name.' },
  ],
  avatar: [
    { topic: 'keyboard', source: 'native', text: '纯展示，不进入 Tab 顺序。', textEn: 'It is purely presentational and stays out of the Tab order.' },
    { topic: 'aria', source: 'radish', text: 'name 提供可访问名称；decorative 时移除 role / aria-label 并 aria-hidden。', textEn: 'name provides the accessible name; when decorative, role / aria-label are removed and aria-hidden is applied.' },
    { topic: 'aria', source: 'radish', text: 'decorative 时旁边需有等价的可见名称。', textEn: 'When decorative, an equivalent visible name must be present nearby.' },
    { topic: 'limitation', source: 'radish', text: '图片加载失败时保留布局并回退到首字；重试由调用方替换 src 触发。', textEn: 'If the image fails to load, layout is preserved and it falls back to initials; a retry is triggered by the caller replacing src.' },
  ],
  tag: [
    { topic: 'keyboard', source: 'native', text: '纯展示，不进入 Tab 顺序。', textEn: 'It is purely presentational and stays out of the Tab order.' },
    { topic: 'aria', source: 'native', text: '渲染为原生 span，不声明额外 role；语义由文本承担。', textEn: 'Tag renders as a native span with no extra role; the text carries the meaning.' },
    { topic: 'limitation', source: 'radish', text: '不作为按钮或筛选器；需要交互时使用 Button 或 ToggleGroup。', textEn: 'The tag is not a button or filter; use Button or ToggleGroup when interaction is needed.' },
    { topic: 'limitation', source: 'radish', text: '长文本换行由容器宽度决定，不截断内容。', textEn: 'Long text wraps according to container width and is not truncated.' },
  ],
  'toggle-group': [
    { topic: 'keyboard', source: 'radix', text: '单选方向键移动焦点；多选方向键只移动焦点。', textEn: 'In single-select mode, arrow keys move focus; in multi-select mode, arrow keys only move focus.' },
    { topic: 'keyboard', source: 'radish', text: '单选在可用项获得焦点时同步选中值。', textEn: 'In single-select mode, the selected value follows the enabled item that receives focus.' },
    { topic: 'keyboard', source: 'native', text: '多选项通过原生 button 响应 Space / Enter 激活。', textEn: 'Multi-select items activate with Space / Enter through native buttons.' },
    { topic: 'keyboard', source: 'radix', text: '激活时由 Radix 切换 aria-pressed 与选中值。', textEn: 'On activation, Radix toggles aria-pressed and the selected value.' },
    { topic: 'keyboard', source: 'radix', text: '禁用项跳过；Tab 进入整组一次。', textEn: 'Disabled items are skipped; Tab enters the group once.' },
    { topic: 'aria', source: 'radix', text: '单选用 radiogroup / radio，多选用 toolbar / button + aria-pressed。', textEn: 'Single-select uses radiogroup / radio, while multi-select uses toolbar / button + aria-pressed.' },
    { topic: 'limitation', source: 'radish', text: '受控 value / onValueChange 由调用方维护。', textEn: 'The caller maintains the controlled value / onValueChange.' },
  ],
  checkbox: [
    { topic: 'keyboard', source: 'native', text: '原生复选框：Space 切换选中，Tab 聚焦。', textEn: 'The native checkbox toggles the selected state with Space and takes focus with Tab.' },
    { topic: 'keyboard', source: 'native', text: '禁用项不进入 Tab 顺序。', textEn: 'Disabled items stay out of the Tab order.' },
    { topic: 'keyboard', source: 'native', text: '标签点击与 Space 等价。', textEn: 'Clicking the label is equivalent to Space.' },
    { topic: 'focus', source: 'radish', text: '焦点环使用共享 1px token，仅键盘焦点显示。', textEn: 'The focus ring uses the shared 1px token and shows only for keyboard focus.' },
  ],
  switch: [
    { topic: 'keyboard', source: 'native', text: 'Tab 聚焦；Space / Enter 由原生 button 转为点击。', textEn: 'Tab focuses it; the native button turns Space / Enter into a click.' },
    { topic: 'keyboard', source: 'radix', text: 'Radix 在点击时切换 checked 并触发 onCheckedChange。', textEn: 'Radix toggles checked on click and fires onCheckedChange.' },
    { topic: 'keyboard', source: 'native', text: '禁用后不进入 Tab 顺序。', textEn: 'When disabled it stays out of the Tab order.' },
    { topic: 'aria', source: 'radish', text: 'Switch 本身不带可见标签，调用方用 label 显式关联或提供 aria-label。', textEn: 'Switch has no visible label of its own; the caller associates a label explicitly or provides aria-label.' },
    { topic: 'focus', source: 'radish', text: '焦点环使用共享 1px token，仅键盘焦点显示。', textEn: 'The focus ring uses the shared 1px token and shows only for keyboard focus.' },
  ],
  tabs: [
    { topic: 'keyboard', source: 'radix', text: 'Tab 进入当前标签，左右方向键切换，Home / End 到首尾。', textEn: 'Tab enters the current tab, Left / Right arrow keys switch tabs, and Home / End go to the first and last.' },
    { topic: 'keyboard', source: 'radix', text: '禁用标签被跳过；焦点与选中分别呈现。', textEn: 'Disabled tabs are skipped; focus and selected state are presented separately.' },
    { topic: 'focus', source: 'radish', text: '指针点击不保留焦点环；键盘重新进入时列表把焦点交给当前标签。', textEn: 'Pointer clicks do not leave a focus ring; when keyboard focus re-enters, the list gives focus to the current tab.' },
    { topic: 'aria', source: 'radix', text: '标签与面板通过 tab / tabpanel 角色与 aria-controls 关联。', textEn: 'Tabs and panels are associated through the tab / tabpanel roles and aria-controls.' },
    { topic: 'limitation', source: 'radish', text: '极窄屏 + 大字号下标签组换行，不横向滚动。', textEn: 'On very narrow screens with large text, the tab group wraps instead of scrolling horizontally.' },
  ],
  'status-badge': [
    { topic: 'keyboard', source: 'native', text: '纯展示，不进入 Tab 顺序。', textEn: 'It is purely presentational and stays out of the Tab order.' },
    { topic: 'aria', source: 'native', text: '渲染为原生 span，不声明额外 role。', textEn: 'StatusBadge renders as a native span with no extra role.' },
    { topic: 'aria', source: 'radish', text: '状态语义由文字表达，不能只靠颜色。', textEn: 'Status meaning is carried by text and never by color alone.' },
    { topic: 'limitation', source: 'radish', text: '可筛选的状态入口应使用 ToggleGroup 或 Button，而不是给徽标加点击。', textEn: 'A filterable status entry point should use ToggleGroup or Button, not a clickable badge.' },
  ],
  dialog: [
    { topic: 'keyboard', source: 'radix', text: 'Escape 关闭；Tab / Shift+Tab 在对话框内循环，焦点不落到页面其他区域。', textEn: 'Escape closes it; Tab / Shift+Tab cycle inside the dialog, and focus does not land on other regions of the page.' },
    { topic: 'focus', source: 'radish', text: '关闭后焦点回到打开它的入口；从菜单项打开时回到菜单触发器。', textEn: 'After closing, focus returns to the entry point that opened it; when opened from a menu item, it returns to the menu trigger.' },
    { topic: 'focus', source: 'radish', text: 'initialFocusRef 可指定打开时的初始焦点。', textEn: 'initialFocusRef can set the initial focus when the dialog opens.' },
    { topic: 'focus', source: 'radix', text: '未指定初始焦点时 Radix 聚焦第一个可交互元素。', textEn: 'When no initial focus is specified, Radix focuses the first interactive element.' },
    { topic: 'aria', source: 'radix', text: '标题与说明分别关联 aria-labelledby 与 aria-describedby。', textEn: 'The title and description are associated with aria-labelledby and aria-describedby respectively.' },
    { topic: 'limitation', source: 'radish', text: 'closeDisabled 只禁用头部关闭按钮并保留在 DOM；loading 时是否拦截 Escape 与遮罩由调用方决定。', textEn: 'closeDisabled only disables the header close button and keeps it in the DOM; the caller decides whether loading blocks Escape and the overlay.' },
  ],
  'confirm-dialog': [
    { topic: 'focus', source: 'radish', text: '初始焦点在取消按钮；Escape 与遮罩关闭等同于取消。', textEn: 'Initial focus is on the cancel button; closing with Escape or the overlay is equivalent to cancel.' },
    { topic: 'keyboard', source: 'radish', text: 'loading 时取消与关闭按钮禁用，确认按钮保留焦点并拦截重复激活。', textEn: 'While loading, the cancel and close buttons are disabled, and the confirm button keeps focus and blocks repeated activation.' },
    { topic: 'aria', source: 'radish', text: '使用 role=alertdialog，标题与说明由 Dialog 关联。', textEn: 'The confirm dialog uses role=alertdialog, and Dialog associates the title and description.' },
    { topic: 'aria', source: 'radish', text: '确认按钮 loading 时设置 aria-disabled / aria-busy。', textEn: 'The confirm button sets aria-disabled / aria-busy while it is loading.' },
    { topic: 'limitation', source: 'radish', text: '确认成功后由调用方关闭对话框；关闭时 Dialog 自动恢复入口焦点。', textEn: 'The caller closes the dialog after confirmation; on close, Dialog automatically restores focus to the entry point.' },
  ],
  accordion: [
    { topic: 'keyboard', source: 'radix', text: 'Tab 到达标题按钮，Enter / Space 展开或收起。', textEn: 'Tab reaches the heading button, and Enter / Space expand or collapse it.' },
    { topic: 'keyboard', source: 'radix', text: '方向键在标题间移动；Home / End 到首尾。', textEn: 'Arrow keys move between headings; Home / End go to the first and last.' },
    { topic: 'keyboard', source: 'radix', text: '禁用项不可聚焦；内容区域展开后按 DOM 顺序继续 Tab。', textEn: 'Disabled items are not focusable; after a content region expands, Tab continues in DOM order.' },
    { topic: 'aria', source: 'radix', text: '标题按钮通过 aria-expanded / aria-controls 关联内容区域。', textEn: 'The heading button is associated with its content region through aria-expanded / aria-controls.' },
    { topic: 'limitation', source: 'radix', text: 'single 模式且 collapsible=false 时不能收起当前项。', textEn: 'In single mode with collapsible=false, the current item cannot be collapsed.' },
  ],
  drawer: [
    { topic: 'keyboard', source: 'radix', text: '与 Dialog 使用同一弹层合同：Escape 关闭，Tab 在抽屉内循环。', textEn: 'Drawer uses the same overlay contract as Dialog: Escape closes it, and Tab cycles within the drawer.' },
    { topic: 'focus', source: 'radish', text: '关闭后焦点回到入口；从菜单项打开时回到菜单触发器。', textEn: 'After closing, focus returns to the entry point; when opened from a menu item, it returns to the menu trigger.' },
    { topic: 'aria', source: 'radix', text: '标题作为可访问名称，说明关联 aria-describedby。', textEn: 'The title serves as the accessible name, and the description is associated through aria-describedby.' },
    { topic: 'limitation', source: 'radish', text: '抽屉用于辅助内容，不改变页面的主流程语义。', textEn: 'The drawer is for supporting content and does not change the page\'s main flow semantics.' },
    { topic: 'aria', source: 'radish', text: '底部编排只改变出现方位，可访问名称、说明与焦点约束与侧向一致。', textEn: 'Bottom placement only changes where the drawer appears; the accessible name, description, and focus constraints match side placement.' },
    { topic: 'limitation', source: 'radish', text: '侧向与底部共用同一弹层合同；底部编排在窄屏占满宽度，从 481px 起居中，正文滚动、footer 保持可见。', textEn: 'Side and bottom share the same overlay contract; bottom placement fills the width on narrow screens, is centered from 481px up, and scrolls the body while keeping the footer visible.' },
  ],
  menu: [
    { topic: 'keyboard', source: 'radix', text: 'Enter / Space / ArrowDown 打开菜单；方向键在项间移动。', textEn: 'Enter / Space / ArrowDown open the menu; arrow keys move between items.' },
    { topic: 'keyboard', source: 'radix', text: 'Enter 执行当前项，Escape 关闭并把焦点还给触发器。', textEn: 'Enter runs the current item, and Escape closes the menu and returns focus to the trigger.' },
    { topic: 'keyboard', source: 'radix', text: '禁用项跳过。', textEn: 'Disabled items are skipped.' },
    { topic: 'focus', source: 'radix', text: '选项以 data-highlighted 高亮表达键盘焦点。', textEn: 'An option expresses keyboard focus by being highlighted with data-highlighted.' },
    { topic: 'aria', source: 'radish', text: '高亮不叠加 1px 环；强制颜色下改用 2px 系统色描边。', textEn: 'The highlight does not add a 1px ring; under forced colors it uses a 2px system-color outline instead.' },
    { topic: 'aria', source: 'radish', text: '链接项由 href 导航并渲染为 a，动作项由 onSelect 处理，二者不重复触发。', textEn: 'Link items navigate through href and render as a, action items are handled through onSelect, and the two do not double-fire.' },
  ],
  'inline-alert': [
    { topic: 'keyboard', source: 'native', text: '静态提示不进入 Tab 顺序；内部操作按钮可聚焦。', textEn: 'A static inline alert stays out of the Tab order; action buttons inside it are focusable.' },
    { topic: 'aria', source: 'radish', text: 'danger 使用 role=alert 立即播报，其余状态使用 role=status。', textEn: 'The danger tone uses role=alert for immediate announcement, and the other tones use role=status.' },
    { topic: 'limitation', source: 'radish', text: '错误不应只放在 Tooltip 或瞬时 Toast 中，需保留为页面内容。', textEn: 'Errors should not live only in a Tooltip or a transient Toast; they must remain as page content.' },
  ],
  empty: [
    { topic: 'keyboard', source: 'native', text: '空态本身不进入 Tab 顺序；action 中的按钮 / 链接按 DOM 顺序聚焦。', textEn: 'The empty state itself stays out of the Tab order; buttons / links in action are focused in DOM order.' },
    { topic: 'aria', source: 'radish', text: '主文案渲染为 h2，装饰图标统一 aria-hidden；组件不默认添加 status / alert role。', textEn: 'The main copy renders as h2 and decorative icons are all aria-hidden; the component does not add a status / alert role by default.' },
    { topic: 'aria', source: 'radish', text: '空态文案与操作由调用方提供，不替代字段错误、保存结果或列表计数播报。', textEn: 'The caller provides the empty-state copy and actions; they do not replace announcements of field errors, save results, or list counts.' },
    { topic: 'limitation', source: 'radish', text: '只有 start / center 两种对齐与 fill 选项，不含插画、缩略图或自动播报。', textEn: 'Only start / center alignment and a fill option exist; there are no illustrations, thumbnails, or automatic announcements.' },
  ],
  skeleton: [
    { topic: 'keyboard', source: 'native', text: '纯展示占位，不进入 Tab 顺序。', textEn: 'It is a purely presentational placeholder and stays out of the Tab order.' },
    { topic: 'aria', source: 'radish', text: '占位整体 aria-hidden，不参与可访问名称与播报。', textEn: 'The whole placeholder is aria-hidden and takes no part in accessible names or announcements.' },
    { topic: 'aria', source: 'radish', text: '加载状态由外层 aria-busy 或 role=status 表达，不依赖骨架本身播报。', textEn: 'Loading state is expressed by an outer aria-busy or role=status; the skeleton itself does not announce.' },
    { topic: 'limitation', source: 'radish', text: '减少动效时保持静态，不播放扫光动画。', textEn: 'Under reduced motion it stays static and plays no shimmer animation.' },
    { topic: 'limitation', source: 'radish', text: '尺寸由调用方给定，不随内容自适应。', textEn: 'Sizes are set by the caller and do not adapt to content.' },
  ],
  toast: [
    { topic: 'keyboard', source: 'radix', text: 'F8 或 Tab 进入通知区域。', textEn: 'F8 or Tab enters the notification region.' },
    { topic: 'keyboard', source: 'radix', text: '悬停或聚焦暂停 4.5 秒倒计时；Escape 关闭。', textEn: 'Hovering or focus pauses the 4.5-second countdown; Escape closes it.' },
    { topic: 'focus', source: 'radish', text: '关闭后焦点先回到打开它的控件，其次回到进入提示前的位置；自动关闭不抢焦点。', textEn: 'After closing, focus first returns to the control that opened it, then to the position focus came from before entering the toast; auto-dismiss does not steal focus.' },
    { topic: 'aria', source: 'radish', text: '区域名随 label 本地化并带 F8 提示，viewport 使用 aria-label 命名。', textEn: 'The region name is localized with label and includes the F8 hint; the viewport is named with aria-label.' },
    { topic: 'limitation', source: 'radish', text: '非模态提示，不阻塞页面操作，也不替调用方声明保存成功。', textEn: 'It is a non-modal notification: it does not block page interaction and does not claim save success on the caller\'s behalf.' },
  ],
  tooltip: [
    { topic: 'keyboard', source: 'radix', text: '悬停 400ms 或键盘聚焦显示；Escape 关闭。', textEn: 'The tooltip shows on hover after 400ms or on keyboard focus; Escape closes it.' },
    { topic: 'focus', source: 'radix', text: '显示时焦点保留在触发器上，触发器需可聚焦。', textEn: 'While shown, focus stays on the trigger, which must be focusable.' },
    { topic: 'aria', source: 'radish', text: 'Tooltip 补充已有可访问名称，不替代 label、字段帮助或必要操作入口。', textEn: 'Tooltip supplements an existing accessible name; it does not replace a label, field help, or a required action entry point.' },
    { topic: 'limitation', source: 'native', text: '触屏没有悬停，必要的说明不能只放在 Tooltip 中。', textEn: 'Touch has no hover, so essential descriptions must not live only in a Tooltip.' },
  ],
  pagination: [
    { topic: 'keyboard', source: 'native', text: '页码与前后翻页可 Tab 到达，Enter / Space 触发。', textEn: 'Page numbers and previous / next controls are reachable with Tab and triggered with Enter / Space.' },
    { topic: 'keyboard', source: 'radish', text: '跳页输入按 Enter 提交；非法值提示 1–总页数之间的整数。', textEn: 'The page-jump input submits on Enter; an invalid value prompts for an integer between 1 and the total page count.' },
    { topic: 'aria', source: 'radish', text: '当前页用 aria-current="page"，分页导航与摘要使用可访问名称。', textEn: 'The current page uses aria-current="page"; the pagination navigation and the position summary use accessible names.' },
    { topic: 'limitation', source: 'radish', text: '单页时隐藏页码与跳页，保留摘要与每页条数。', textEn: 'With a single page, page numbers and the jump input are hidden while the summary and page-size selector remain.' },
    { topic: 'limitation', source: 'radish', text: '页码范围由 page / pageCount 决定，组件不自动钳制传入值。', textEn: 'The page range is determined by page / pageCount; the component does not clamp the values passed in.' },
  ],
  'table-of-contents': [
    { topic: 'keyboard', source: 'native', text: '链接按 DOM 顺序 Tab 到达，Enter 跳转。', textEn: 'Links are reached with Tab in DOM order, and Enter jumps to the section.' },
    { topic: 'aria', source: 'radish', text: '当前章节用 aria-current="location" 表达，不只靠颜色。', textEn: 'The current section is expressed with aria-current="location", not by color alone.' },
    { topic: 'aria', source: 'radish', text: '导航使用 nav + aria-label 命名，层级只影响缩进，不额外声明 aria-level。', textEn: 'The navigation uses nav and is named with aria-label; hierarchy only affects indentation and does not declare aria-level.' },
    { topic: 'limitation', source: 'radish', text: '目录更新由页面驱动的 currentId 控制，组件不监听滚动。', textEn: 'Outline updates are controlled by a page-driven currentId; the component does not listen to scrolling.' },
  ],
  card: [
    { topic: 'keyboard', source: 'native', text: '纯容器不承担键盘行为；asChild 链接卡片保留链接的 Tab 与 Enter。', textEn: 'A pure container adds no keyboard behavior; an asChild link card keeps the link\'s Tab stop and Enter activation.' },
    { topic: 'aria', source: 'radix', text: '默认渲染为 div；asChild 时把表面交给唯一子元素并保留其语义。', textEn: 'Card renders as a div by default; with asChild the surface is handed to the single child element and its semantics are preserved.' },
    { topic: 'aria', source: 'radish', text: '卡片本身不加点击或 role，交互入口放在子元素上。', textEn: 'The card itself adds no click handler or role; interactive entry points live in child elements.' },
    { topic: 'limitation', source: 'radish', text: '长内容与窄屏由内容决定高度，不固定卡片高度。', textEn: 'With long content and narrow screens the content determines height; card height is not fixed.' },
  ],
  section: [
    { topic: 'keyboard', source: 'native', text: '区块是地标容器，不进入 Tab 顺序。', textEn: 'The section is a landmark container and stays out of the Tab order.' },
    { topic: 'aria', source: 'radish', text: '标题通过 aria-labelledby 关联区块；未传时使用生成的标题 id。', textEn: 'The heading is associated with the section through aria-labelledby; when not passed, a generated heading id is used.' },
    { topic: 'limitation', source: 'radish', text: '标题层级固定为 h2，页面主标题仍由 PageHeader 提供。', textEn: 'The heading level is fixed at h2; the page title still comes from PageHeader.' },
    { topic: 'limitation', source: 'radish', text: '说明文字不作为必填项；需要时再传 description。', textEn: 'The description text is not required; pass description only when needed.' },
  ],
  'description-list': [
    { topic: 'keyboard', source: 'native', text: '描述列表是展示语义，不进入 Tab 顺序；值中的链接与按钮按 DOM 顺序聚焦。', textEn: 'The description list carries presentational semantics and stays out of the Tab order; links and buttons in values are focused in DOM order.' },
    { topic: 'aria', source: 'native', text: '渲染为原生 dl / dt / dd，辅助技术按描述列表成对朗读标签与值。', textEn: 'The description list renders as native dl / dt / dd, so assistive technology reads each label and value pair as a description list.' },
    { topic: 'aria', source: 'radish', text: '组件不额外生成 role 或读屏文案；值的含义写在 value 中，标签只说明值的含义。', textEn: 'The component generates no extra role or screen reader text; the meaning of the value lives in value, and the label only explains what the value means.' },
    { topic: 'limitation', source: 'radish', text: '每条一行、标签在左值在右；宽度与分隔线由页面组合，组件不含多列或折叠变体。', textEn: 'One entry per line, with the label on the left and the value on the right; width and dividers are composed by the page, and the component has no multi-column or collapsible variants.' },
    { topic: 'limitation', source: 'radish', text: '值需要可操作时由调用方组合按钮或链接，组件本身不加点击行为。', textEn: 'When a value needs to be actionable, the caller composes buttons or links; the component itself adds no click behavior.' },
  ],
  table: [
    { topic: 'keyboard', source: 'native', text: '表格本身不进入 Tab 顺序；内部链接与按钮按 DOM 顺序聚焦。', textEn: 'The table itself stays out of the Tab order; links and buttons inside it are focused in DOM order.' },
    { topic: 'aria', source: 'radish', text: 'caption 对视觉隐藏但对辅助技术可见，始终提供 label。', textEn: 'The caption is visually hidden but available to assistive technology; a label is always provided.' },
    { topic: 'limitation', source: 'radish', text: '表头吸顶只影响滚动呈现，不改变阅读顺序。', textEn: 'A sticky header only affects scroll presentation and does not change reading order.' },
    { topic: 'limitation', source: 'native', text: '列宽与对齐由原生 table 布局和页面 CSS 决定。', textEn: 'Column widths and alignment are determined by native table layout and page CSS.' },
    { topic: 'limitation', source: 'radish', text: '组件不提供排序、筛选或虚拟滚动。', textEn: 'The component does not provide sorting, filtering, or virtual scrolling.' },
  ],
};
