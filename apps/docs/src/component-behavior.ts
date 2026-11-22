import type { BehaviorEntry } from './component-api-types';

/**
 * Per-component behavior attribution and accessibility declarations. Each entry
 * records one keyboard / focus / ARIA / limitation fact and the layer responsible:
 * the browser's native semantics, Radix Primitives, or RadishUI's own composition.
 * Combined interactions are split per layer instead of merged into one sentence.
 *
 * `scripts/generate-api.mjs` validates that every catalog component is covered and
 * writes the declarations into `component-api.generated.ts`; component pages and
 * `llms.txt` consume the generated output. Do not import this module from the site.
 */
export const authoredBehavior: Record<string, readonly BehaviorEntry[]> = {
  button: [
    { topic: 'keyboard', source: 'native', text: 'Tab 聚焦，Enter / Space 触发。' },
    { topic: 'focus', source: 'radish', text: 'loading 时保留焦点，重复激活被拦截。' },
    { topic: 'aria', source: 'radish', text: 'loading 时设置 aria-disabled / aria-busy。' },
    { topic: 'keyboard', source: 'native', text: 'disabled 使用原生 disabled，不进入 Tab 顺序。' },
  ],
  'icon-button': [
    { topic: 'keyboard', source: 'native', text: 'Tab 聚焦，Enter / Space 触发。' },
    { topic: 'aria', source: 'radish', text: 'label 提供可访问名称；不要用图标替代名称。' },
    { topic: 'focus', source: 'radish', text: 'loading 时保留焦点并只显示 spinner，重复激活被拦截。' },
    { topic: 'keyboard', source: 'native', text: 'disabled 使用原生 disabled，不进入 Tab 顺序。' },
  ],
  form: [
    { topic: 'keyboard', source: 'native', text: '单行输入内按 Enter 触发表单提交，提交事件由 Form 接管。' },
    { topic: 'focus', source: 'radish', text: '校验未通过时把焦点移到 DOM 顺序中的第一个错误字段。' },
    { topic: 'aria', source: 'native', text: '原生 form 提供表单语义；字段错误由 FormField 的 role=alert 播报。' },
    { topic: 'limitation', source: 'radish', text: 'Form 不计算校验规则、不渲染错误文案；规则、错误状态与 FormField error 由调用方维护。' },
  ],
  'form-field': [
    { topic: 'keyboard', source: 'native', text: '字段原语不承担键盘行为；点击标签聚焦关联控件。' },
    { topic: 'aria', source: 'radish', text: '错误以 role=alert 播报，说明与错误通过 aria-describedby 关联。' },
    { topic: 'aria', source: 'radish', text: '必填标记对辅助技术隐藏，required 由字段内控件原生表达。' },
    { topic: 'limitation', source: 'radish', text: 'error 存在时不显示 hint；两者都需要时由调用方组织文案。' },
  ],
  input: [
    { topic: 'keyboard', source: 'native', text: '原生文本输入：Tab 聚焦，方向键 / Home / End 移动光标，编辑快捷键沿用浏览器。' },
    { topic: 'aria', source: 'radish', text: '错误以 role=alert 播报，说明与错误通过 aria-describedby 关联。' },
    { topic: 'aria', source: 'native', text: 'required 使用原生属性，由表单校验与辅助技术识别。' },
    { topic: 'aria', source: 'radish', text: '在 FormField 内自动继承 id、required、aria-describedby 与 aria-invalid。' },
  ],
  textarea: [
    { topic: 'keyboard', source: 'native', text: 'Tab 聚焦，Enter 换行；编辑快捷键沿用原生 textarea。' },
    { topic: 'limitation', source: 'radish', text: '保留垂直 resize，页面布局需允许高度变化；拖拽尺寸不改变键盘行为。' },
    { topic: 'aria', source: 'radish', text: '说明与错误通过 aria-describedby 关联，错误以 role=alert 播报。' },
    { topic: 'aria', source: 'radish', text: '在 FormField 内自动继承 id、required、aria-describedby 与 aria-invalid。' },
  ],
  select: [
    { topic: 'keyboard', source: 'radix', text: 'Space / Enter 展开，方向键与 Home / End 移动。' },
    { topic: 'keyboard', source: 'radix', text: 'Enter 确认，Escape 关闭并把焦点还给触发器。' },
    { topic: 'focus', source: 'radix', text: '选项的键盘焦点由 Radix 设置 data-highlighted 表达。' },
    { topic: 'aria', source: 'radish', text: '选项高亮不叠加 1px 环；强制颜色下改用 2px 系统色描边。' },
  ],
  'input-otp': [
    { topic: 'keyboard', source: 'radish', text: '输入数字自动进入下一位；粘贴多位数字会从当前位起填充。' },
    { topic: 'keyboard', source: 'radish', text: 'Backspace 删除当前位或回退删除前一位；Delete 清空当前位；方向键与 Home / End 可逐位移动。' },
    { topic: 'keyboard', source: 'radish', text: '有 onEnterPress 时 Enter 只触发回调；没有回调时 Enter 交给表单提交；非数字键被忽略。' },
    { topic: 'aria', source: 'radish', text: '错误用 role=alert，并通过 aria-describedby 关联到每一位输入。' },
    { topic: 'aria', source: 'radish', text: 'required 以 group aria-required 表达，原生表单校验由调用方基于受控值处理。' },
  ],
  'tag-input': [
    { topic: 'keyboard', source: 'radish', text: 'Enter 添加当前草稿；输入框为空时 Backspace 删除最后一个标签。' },
    { topic: 'keyboard', source: 'native', text: '每个标签的删除按钮可 Tab 到达，也可用 Enter / Space 触发。' },
    { topic: 'keyboard', source: 'radish', text: '中文输入法组合期间不触发添加；Safari 的组合确认键同样被忽略。' },
    { topic: 'aria', source: 'radish', text: '每个删除按钮通过 removeLabel 获得独立可访问名称。' },
    { topic: 'limitation', source: 'radish', text: '是否去重、限长与表单提交由调用方负责。' },
  ],
  'radio-group': [
    { topic: 'keyboard', source: 'radix', text: '方向键在选项间移动，禁用项被跳过。' },
    { topic: 'focus', source: 'radish', text: '程序化聚焦到选项时同步选中值；方向键选中由 Radix 完成。' },
    { topic: 'keyboard', source: 'radix', text: 'Tab 进入整组一次，离开时不会逐个经过选项。' },
    { topic: 'aria', source: 'radish', text: '错误通过 FormField 关联，role=alert 播报。' },
    { topic: 'aria', source: 'radish', text: '每项 label 使用字符串，保证独立可访问名称。' },
  ],
  avatar: [
    { topic: 'keyboard', source: 'native', text: '纯展示，不进入 Tab 顺序。' },
    { topic: 'aria', source: 'radish', text: 'name 提供可访问名称；decorative 时移除 role / aria-label 并 aria-hidden。' },
    { topic: 'aria', source: 'radish', text: 'decorative 时旁边需有等价的可见名称。' },
    { topic: 'limitation', source: 'radish', text: '图片加载失败时保留布局并回退到首字；重试由调用方替换 src 触发。' },
  ],
  tag: [
    { topic: 'keyboard', source: 'native', text: '纯展示，不进入 Tab 顺序。' },
    { topic: 'aria', source: 'native', text: '渲染为原生 span，不声明额外 role；语义由文本承担。' },
    { topic: 'limitation', source: 'radish', text: '不作为按钮或筛选器；需要交互时使用 Button 或 ToggleGroup。' },
    { topic: 'limitation', source: 'radish', text: '长文本换行由容器宽度决定，不截断内容。' },
  ],
  'toggle-group': [
    { topic: 'keyboard', source: 'radix', text: '单选方向键移动焦点；多选方向键只移动焦点。' },
    { topic: 'keyboard', source: 'radish', text: '单选在可用项获得焦点时同步选中值。' },
    { topic: 'keyboard', source: 'native', text: '多选项通过原生 button 响应 Space / Enter 激活。' },
    { topic: 'keyboard', source: 'radix', text: '激活时由 Radix 切换 aria-pressed 与选中值。' },
    { topic: 'keyboard', source: 'radix', text: '禁用项跳过；Tab 进入整组一次。' },
    { topic: 'aria', source: 'radix', text: '单选用 radiogroup / radio，多选用 toolbar / button + aria-pressed。' },
    { topic: 'limitation', source: 'radish', text: '受控 value / onValueChange 由调用方维护。' },
  ],
  checkbox: [
    { topic: 'keyboard', source: 'native', text: '原生复选框：Space 切换选中，Tab 聚焦。' },
    { topic: 'keyboard', source: 'native', text: '禁用项不进入 Tab 顺序。' },
    { topic: 'keyboard', source: 'native', text: '标签点击与 Space 等价。' },
    { topic: 'focus', source: 'radish', text: '焦点环使用共享 1px token，仅键盘焦点显示。' },
  ],
  switch: [
    { topic: 'keyboard', source: 'native', text: 'Tab 聚焦；Space / Enter 由原生 button 转为点击。' },
    { topic: 'keyboard', source: 'radix', text: 'Radix 在点击时切换 checked 并触发 onCheckedChange。' },
    { topic: 'keyboard', source: 'native', text: '禁用后不进入 Tab 顺序。' },
    { topic: 'aria', source: 'radish', text: 'Switch 本身不带可见标签，调用方用 label 显式关联或提供 aria-label。' },
    { topic: 'focus', source: 'radish', text: '焦点环使用共享 1px token，仅键盘焦点显示。' },
  ],
  tabs: [
    { topic: 'keyboard', source: 'radix', text: 'Tab 进入当前标签，左右方向键切换，Home / End 到首尾。' },
    { topic: 'keyboard', source: 'radix', text: '禁用标签被跳过；焦点与选中分别呈现。' },
    { topic: 'focus', source: 'radish', text: '指针点击不保留焦点环；键盘重新进入时列表把焦点交给当前标签。' },
    { topic: 'aria', source: 'radix', text: '标签与面板通过 tab / tabpanel 角色与 aria-controls 关联。' },
    { topic: 'limitation', source: 'radish', text: '极窄屏 + 大字号下标签组换行，不横向滚动。' },
  ],
  'status-badge': [
    { topic: 'keyboard', source: 'native', text: '纯展示，不进入 Tab 顺序。' },
    { topic: 'aria', source: 'native', text: '渲染为原生 span，不声明额外 role。' },
    { topic: 'aria', source: 'radish', text: '状态语义由文字表达，不能只靠颜色。' },
    { topic: 'limitation', source: 'radish', text: '可筛选的状态入口应使用 ToggleGroup 或 Button，而不是给徽标加点击。' },
  ],
  dialog: [
    { topic: 'keyboard', source: 'radix', text: 'Escape 关闭；Tab / Shift+Tab 在对话框内循环，焦点不落到页面其他区域。' },
    { topic: 'focus', source: 'radish', text: '关闭后焦点回到打开它的入口；从菜单项打开时回到菜单触发器。' },
    { topic: 'focus', source: 'radish', text: 'initialFocusRef 可指定打开时的初始焦点。' },
    { topic: 'focus', source: 'radix', text: '未指定初始焦点时 Radix 聚焦第一个可交互元素。' },
    { topic: 'aria', source: 'radix', text: '标题与说明分别关联 aria-labelledby 与 aria-describedby。' },
    { topic: 'limitation', source: 'radish', text: 'closeDisabled 只禁用头部关闭按钮并保留在 DOM；loading 时是否拦截 Escape 与遮罩由调用方决定。' },
  ],
  'confirm-dialog': [
    { topic: 'focus', source: 'radish', text: '初始焦点在取消按钮；Escape 与遮罩关闭等同于取消。' },
    { topic: 'keyboard', source: 'radish', text: 'loading 时取消与关闭按钮禁用，确认按钮保留焦点并拦截重复激活。' },
    { topic: 'aria', source: 'radish', text: '使用 role=alertdialog，标题与说明由 Dialog 关联。' },
    { topic: 'aria', source: 'radish', text: '确认按钮 loading 时设置 aria-disabled / aria-busy。' },
    { topic: 'limitation', source: 'radish', text: '确认成功后由调用方关闭对话框；关闭时 Dialog 自动恢复入口焦点。' },
  ],
  accordion: [
    { topic: 'keyboard', source: 'radix', text: 'Tab 到达标题按钮，Enter / Space 展开或收起。' },
    { topic: 'keyboard', source: 'radix', text: '方向键在标题间移动；Home / End 到首尾。' },
    { topic: 'keyboard', source: 'radix', text: '禁用项不可聚焦；内容区域展开后按 DOM 顺序继续 Tab。' },
    { topic: 'aria', source: 'radix', text: '标题按钮通过 aria-expanded / aria-controls 关联内容区域。' },
    { topic: 'limitation', source: 'radix', text: 'single 模式且 collapsible=false 时不能收起当前项。' },
  ],
  drawer: [
    { topic: 'keyboard', source: 'radix', text: '与 Dialog 使用同一弹层合同：Escape 关闭，Tab 在抽屉内循环。' },
    { topic: 'focus', source: 'radish', text: '关闭后焦点回到入口；从菜单项打开时回到菜单触发器。' },
    { topic: 'aria', source: 'radix', text: '标题作为可访问名称，说明关联 aria-describedby。' },
    { topic: 'limitation', source: 'radish', text: '抽屉用于辅助内容，不改变页面的主流程语义。' },
    { topic: 'aria', source: 'radish', text: '底部编排只改变出现方位，可访问名称、说明与焦点约束与侧向一致。' },
    { topic: 'limitation', source: 'radish', text: '侧向与底部共用同一弹层合同；底部编排在窄屏占满宽度，从 481px 起居中，正文滚动、footer 保持可见。' },
  ],
  menu: [
    { topic: 'keyboard', source: 'radix', text: 'Enter / Space / ArrowDown 打开菜单；方向键在项间移动。' },
    { topic: 'keyboard', source: 'radix', text: 'Enter 执行当前项，Escape 关闭并把焦点还给触发器。' },
    { topic: 'keyboard', source: 'radix', text: '禁用项跳过。' },
    { topic: 'focus', source: 'radix', text: '选项以 data-highlighted 高亮表达键盘焦点。' },
    { topic: 'aria', source: 'radish', text: '高亮不叠加 1px 环；强制颜色下改用 2px 系统色描边。' },
    { topic: 'aria', source: 'radish', text: '链接项由 href 导航并渲染为 a，动作项由 onSelect 处理，二者不重复触发。' },
  ],
  'inline-alert': [
    { topic: 'keyboard', source: 'native', text: '静态提示不进入 Tab 顺序；内部操作按钮可聚焦。' },
    { topic: 'aria', source: 'radish', text: 'danger 使用 role=alert 立即播报，其余状态使用 role=status。' },
    { topic: 'limitation', source: 'radish', text: '错误不应只放在 Tooltip 或瞬时 Toast 中，需保留为页面内容。' },
  ],
  skeleton: [
    { topic: 'keyboard', source: 'native', text: '纯展示占位，不进入 Tab 顺序。' },
    { topic: 'aria', source: 'radish', text: '占位整体 aria-hidden，不参与可访问名称与播报。' },
    { topic: 'aria', source: 'radish', text: '加载状态由外层 aria-busy 或 role=status 表达，不依赖骨架本身播报。' },
    { topic: 'limitation', source: 'radish', text: '减少动效时保持静态，不播放扫光动画。' },
    { topic: 'limitation', source: 'radish', text: '尺寸由调用方给定，不随内容自适应。' },
  ],
  toast: [
    { topic: 'keyboard', source: 'radix', text: 'F8 或 Tab 进入通知区域。' },
    { topic: 'keyboard', source: 'radix', text: '悬停或聚焦暂停 4.5 秒倒计时；Escape 关闭。' },
    { topic: 'focus', source: 'radish', text: '关闭后焦点先回到打开它的控件，其次回到进入提示前的位置；自动关闭不抢焦点。' },
    { topic: 'aria', source: 'radish', text: '区域名随 label 本地化并带 F8 提示，viewport 使用 aria-label 命名。' },
    { topic: 'limitation', source: 'radish', text: '非模态提示，不阻塞页面操作，也不替调用方声明保存成功。' },
  ],
  tooltip: [
    { topic: 'keyboard', source: 'radix', text: '悬停 400ms 或键盘聚焦显示；Escape 关闭。' },
    { topic: 'focus', source: 'radix', text: '显示时焦点保留在触发器上，触发器需可聚焦。' },
    { topic: 'aria', source: 'radish', text: 'Tooltip 补充已有可访问名称，不替代 label、字段帮助或必要操作入口。' },
    { topic: 'limitation', source: 'native', text: '触屏没有悬停，必要的说明不能只放在 Tooltip 中。' },
  ],
  pagination: [
    { topic: 'keyboard', source: 'native', text: '页码与前后翻页可 Tab 到达，Enter / Space 触发。' },
    { topic: 'keyboard', source: 'radish', text: '跳页输入按 Enter 提交；非法值提示 1–总页数之间的整数。' },
    { topic: 'aria', source: 'radish', text: '当前页用 aria-current="page"，分页导航与摘要使用可访问名称。' },
    { topic: 'limitation', source: 'radish', text: '单页时隐藏页码与跳页，保留摘要与每页条数。' },
    { topic: 'limitation', source: 'radish', text: '页码范围由 page / pageCount 决定，组件不自动钳制传入值。' },
  ],
  'table-of-contents': [
    { topic: 'keyboard', source: 'native', text: '链接按 DOM 顺序 Tab 到达，Enter 跳转。' },
    { topic: 'aria', source: 'radish', text: '当前章节用 aria-current="location" 表达，不只靠颜色。' },
    { topic: 'aria', source: 'radish', text: '导航使用 nav + aria-label 命名，层级只影响缩进，不额外声明 aria-level。' },
    { topic: 'limitation', source: 'radish', text: '目录更新由页面驱动的 currentId 控制，组件不监听滚动。' },
  ],
  card: [
    { topic: 'keyboard', source: 'native', text: '纯容器不承担键盘行为；asChild 链接卡片保留链接的 Tab 与 Enter。' },
    { topic: 'aria', source: 'radix', text: '默认渲染为 div；asChild 时把表面交给唯一子元素并保留其语义。' },
    { topic: 'aria', source: 'radish', text: '卡片本身不加点击或 role，交互入口放在子元素上。' },
    { topic: 'limitation', source: 'radish', text: '长内容与窄屏由内容决定高度，不固定卡片高度。' },
  ],
  section: [
    { topic: 'keyboard', source: 'native', text: '区块是地标容器，不进入 Tab 顺序。' },
    { topic: 'aria', source: 'radish', text: '标题通过 aria-labelledby 关联区块；未传时使用生成的标题 id。' },
    { topic: 'limitation', source: 'radish', text: '标题层级固定为 h2，页面主标题仍由 PageHeader 提供。' },
    { topic: 'limitation', source: 'radish', text: '说明文字不作为必填项；需要时再传 description。' },
  ],
  table: [
    { topic: 'keyboard', source: 'native', text: '表格本身不进入 Tab 顺序；内部链接与按钮按 DOM 顺序聚焦。' },
    { topic: 'aria', source: 'radish', text: 'caption 对视觉隐藏但对辅助技术可见，始终提供 label。' },
    { topic: 'limitation', source: 'radish', text: '表头吸顶只影响滚动呈现，不改变阅读顺序。' },
    { topic: 'limitation', source: 'native', text: '列宽与对齐由原生 table 布局和页面 CSS 决定。' },
    { topic: 'limitation', source: 'radish', text: '组件不提供排序、筛选或虚拟滚动。' },
  ],
};
