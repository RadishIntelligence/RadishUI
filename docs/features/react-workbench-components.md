# C-02：Workbench 首批 React 组件

主要归属：[C：跨平台通用组件](../planning/topics.md#components)，协同 F-01 / F-02 与 [E-02 三代表页](workbench-preview.md)。2026-11-04 萝卜SAMA明确授权在本仓 Web 展示站实施；当前现代圆角版作为首轮实现起点，后续视觉仍可调整，不代表产品采用或正式包发行。

## 范围与依赖

实现位于 `packages/react/src/`，展示站直接导入 `@radish-ui/react`，无第二份演示组件。React / React DOM 19 范围先行；Flutter、React 18、正式包构建和跨产品迁移不在本轮范围。

- `radix-ui@1.8.1`：MIT，采用其 Select、Switch、Tabs、Dialog、DropdownMenu、Tooltip、Toast 行为；RadishUI 负责语义 token、视觉、公开组合及真实页面验证。未采用 Radix Themes、antd 或产品业务依赖。
- `lucide-react@1.68.0`：ISC，部分 Feather 派生图标保留 MIT 声明；按需导入，统一默认尺寸和语义，不使用运行时全量图标注册表。
- 两者的 peer 范围包含 React 19，实际运行验证以本仓锁定的 React 19.2.7 为准。完整版本由 lockfile 固定，来源与声明见[第三方依赖](../development/third-party-dependencies.md)。

## 组件合同

所有样式消费 `@radish-ui/tokens` 的语义变量，不引用产品接口、权限、路由或业务模型。当前导出为内部 workspace API；之后的稳定发行另行处理类型构建与消费兼容。

| 组件 | 输入 / 输出与行为 |
| --- | --- |
| Button / IconButton | 保留原生 button 属性、ref、四种 variant 与 loading，增加 sm / md；默认 type=button，loading 禁用并带 aria-busy。IconButton 的 label 必填；loading 时仅显示 spinner 并替换图标，不与图标叠加 |
| FormField / Input / Textarea | FormField 提供 label、hint / error、required 与稳定 id；Input / Textarea 读取字段上下文关联 aria-describedby / aria-invalid，也可独立传入原生属性；可选 surface: outline（默认）| filled。Switch 等其他控件由调用方显式关联 id / 标签及所需说明。失败不清空输入 |
| Select | 受控 value / onValueChange、options、placeholder、disabled / required；可选 surface: outline（默认）| filled；触发值和箭头分离，浮层不透明，支持当前值、键盘、滚动与碰撞避让；已展开时再次点按触发器收起，触控关闭以同一次点按开始时的展开状态为准 |
| Checkbox / Switch | Checkbox 保留原生表单与键盘行为，Switch 使用受控 checked / onCheckedChange；标签、禁用、焦点与选择状态分别表达 |
| InputOTP | 受控 value / onValueChange、label、length（默认 6）、hint / error、required、disabled、autoFocus、name、onEnterPress；数字输入、自动前进、退格 / 方向键 / Home / End、粘贴；每格为标准正方格并可访问，`name` 提交隐藏的完整值 |
| RadioGroup | 受控 value / onValueChange，options: { value, label, disabled? }[]；orientation: vertical（默认）/ horizontal；name、required、disabled；FormField 内自动关联标签、说明与错误；方向键移动即选中，单项 label 使用字符串保证可访问名称 |
| ToggleGroup | 单选使用 radiogroup / radio 语义，多选使用 toolbar / button + aria-pressed；受控 value / onValueChange，items: { value, label, disabled? }[]，label、disabled |
| Accordion | type: single（默认）/ multiple；items: { value, label, content, disabled? }[]；value / defaultValue / onValueChange；single 可 collapsible；标题按钮与内容区域由 Radix 维护，键盘可展开 / 收起 |
| Tabs | 受控或非受控 Root，配合 TabsList / TabsContent，保持 tab / tabpanel 关联、方向键、选择与焦点；列表在极窄 + 大字号下可换行，避免入口被裁切；辅助导出不另算组件数量 |
| StatusBadge | neutral / info / success / warning / danger 表达展示语义，文字与图标由调用方提供，不伪装为交互按钮 |
| Avatar | name 提供可访问名称与首字回退；src、fallback、shape: circle（默认）/ square、size: sm / md / lg、decorative；图片加载失败回退；纯展示不进入 Tab 顺序 |
| Tag | 中性标签文本；纯展示，不进入 Tab 顺序；状态用 StatusBadge，不用 Tag 伪装状态 |
| Skeleton | width / height（CSS 长度或数字）、className / style；纯展示占位并 aria-hidden；外层用 aria-busy / status 说明加载中，加载完成移除；减少动效时保持静态 |
| Dialog / Drawer | 受控 open / onOpenChange，标题、可选说明、正文与 footer；role: dialog（默认）/ alertdialog；支持 Escape、焦点约束、可指定初始焦点并恢复入口；关闭按钮 32px 可视、44px 命中由共享组件提供。Drawer 是同一弹层合同的侧向编排 |
| Menu | trigger 与具名 items，支持禁用、危险项、分隔与链接 / 动作；键盘、关闭与焦点由行为基础维护 |
| ConfirmDialog | 基于 Dialog 的确认组合：open / onOpenChange、title、description、children、confirmLabel / cancelLabel、tone: default | danger、loading、onConfirm；初始焦点在取消，loading 时拦截关闭，role=alertdialog |
| InlineAlert | info / success / warning / danger，错误以 alert 播报，其余状态使用 status；必要说明不只放在 Tooltip |
| Toast / Tooltip | Toast 以顶部胶囊提供可关闭的短时反馈，关闭按钮显示剩余时间，悬停 / 聚焦暂停，超时自动关闭；Tooltip 补充已有可访问名称；不替代持久错误、字段帮助或必要操作入口 |

A 批 10 个基础组件与 B 批 6 个反馈 / 浮层组件由三代表页实际消费；当前共 24 个共享组件；RadioGroup 是 2026-11-08 为设置页新增的第 17 个，Avatar / Tag 是第 18 / 19 个，Skeleton 是第 20 个，InputOTP 是第 21 个，ConfirmDialog 是第 22 个，ToggleGroup 是第 23 个，Accordion 是第 24 个；AppShell、表格、分页、目录和业务数据仍属于展示站组合，不提前承诺通用 DataGrid、服务器分页、富文本或权限能力。

## 视觉与失败路径

现代圆角和紧凑留白按[设计条例](../design/design-rules.md)，具体 token 映射按 [F-01](token-foundation.md)。桌面组件控件密度可调（紧凑 / 标准 / 宽松，默认标准），粗指针 / 无指针设备保持至少 44px 的主要控件范围，窄桌面窗口沿用所选桌面密度；焦点与选中不同，浮层可在 Dialog 内正常使用。

组件只输出事件，不替调用方宣称保存成功。IO 失败由页面明确反馈，表单保留输入；只读、禁用、loading 与错误分别判断。Dialog / Menu 的焦点恢复、Select 的键盘、长中文 / English、窄屏与明暗必须在组合页面检查，不能只凭引用 Radix 推断验收通过。

## 实施与验收

| 工作项 | 状态 | 依据与限制 |
| --- | --- | --- |
| C-02.1 A 批控件与语义样式 | 已完成（本地 React 19 范例） | 十个基础组件由三页直接消费；类型、真实表单与明暗 / 窄屏检查通过 |
| C-02.2 B 批浮层与反馈 | 已完成（本地 React 19 范例） | 六个反馈 / 浮层组件由 E-02 消费；Select 键盘、不透明菜单、Dialog / Drawer 焦点约束与恢复、失败反馈通过 |
| C-02.3 状态与兼容验证 | 已完成（本轮限定范围） | 模型测试、浏览器流程和组合检查通过；具体证据与其他平台 / 辅助技术等未覆盖面归开发记录 |
| C-02.4 组件用法与状态展示 | 已完成（本地 React 19 用例） | `#/components` 提供 24 个共享组件的实际用例、关键 props / 事件、代码与键盘说明；适用的禁用 / 加载 / 错误 / 只读和长内容可操作；11 月 7 日同步顶部通知与倒计时说明，明暗 / 窄屏验证见开发记录 |

前三项完成指本轮真实页面的有限组合验收，C-02.4 已补齐独立用法页；这仍不等于每个组件的所有组合或所有消费环境均已验收。之后按页面需求决定新增组件，不以复制组件实现或静态截图替代运行用例。

定向检查为 `npm run type-check`、`npm run test:workbench`、`npm run check:tokens`、`npm run check:notices`；完整基线使用 `npm run build`。浏览器验收由 E-02 的矩阵驱动，日期化证据见[本周记录](../devlogs/2026-W45.md)。不推断 Flutter、其他 React 主版本或产品接入可用。

## 组件用法页与本轮收敛

2026-11-05，`apps/docs/src/ComponentsPage.tsx` 直接导入共享组件，按操作、字段、选择、反馈四组展示。桌面从“开发参考 → 组件用法”进入，移动端从账号菜单进入；保留三代表页的主导航。示例仅在当前分组内保留内存状态，离开分组 / 页面即重置，不写入资源、正文或偏好。关键 props 与代码示例帮助理解用法，完整类型仍以共享包导出为准；示例内容以中文和 English 合成文案为主，不承诺文档全文英文化。

2026-11-07 的 B2 采用：组件页临时 Surface & state spike 在候选方向确认后已移除，共享变更与示例保留如下：

- 新增 `control-surface-filled` token（浅色 `#F0F2F5` / 深色 `#272C33`），由 token 管线生成。
- `Input` / `Textarea` / `Select` 增加可选 `surface?: 'outline' | 'filled'`，默认仍为 `outline`；填充态使用 token 表面、透明边框，hover 用 85% 表面 + 文本色混合，focus 回到 surface + `border-control`，invalid 保持 danger 边框，readonly 使用 muted。
- 组件示例使用真实 `surface="filled"`；Textarea 示例保留一条填充字段。分组表面与状态层未进入共享组件，Button 沿用现有 action / bg-selected / inset 状态，不新增状态 token。
- 设置页当时作为首个采用页面，4 个 Select 改为 filled；资源库搜索、文档与其他页面仍为 outline。所有者已确认该采用，设置页 filled 纳入 F-02.4 基准修订。
- 2026-11-08 RadioGroup 修订：设置页界面语言、显示密度、正文字号、段落行距改为横向 RadioGroup；设置页不再使用 filled Select，filled 字段保留在组件示例与其他页面。原 B2 记录保留为历史采用，不删除 token 或 API。

按所有者“桌面按钮、输入框、选择器偏大”的反馈，展示站默认偏好改用已有 compact 档；共享 token 值与 API 未改。Input / Select 的纵向内边距随现有高度计算，普通字号时三档实际对齐到 28 / 32 / 36px（2026-11-07 重命名为紧凑 / 标准 / 宽松）；Textarea 保留多行留白，大字号允许自然撑高，coarse / none pointer 保留至少 44px 控件范围，fine pointer 不再仅因窗口变窄而放大。Button 长文案可换行，避免大字号溢出。

Safari 的指针激活不一定自动聚焦按钮；Button 在执行 onClick 前显式聚焦自身（preventScroll），资源详情的原生按钮采用同一方式，保证 Dialog / Drawer 能记录并恢复真实入口。消费者仍可在 onClick 内主动移动焦点。Safari 原生窗口已复验这两条关闭路径，其他浮层组合仍按具体环境判断。

## 顶部通知与倒计时（2026-11-07）

按所有者对底部通知的反馈，Toast 改为顶部居中的深色胶囊：关闭按钮的边框即 4500ms 倒计时环，走完后自动关闭；悬停或聚焦时暂停，离开后继续。Escape、关闭按钮与向上滑动都可关闭，F8 仍进入通知区域。减少动效时，进出场动画和边框进度动画停止，关闭按钮显示静态边框，仍在 4500ms 后自动关闭。其他页面与 ComponentsPage 示例直接获得同一形态。

倒计时环使用 `pathLength="1"` 的圆角矩形描边，随时间增加 `stroke-dashoffset`；暂停状态由 Radix Toast 的 `onPause` / `onResume` 同步到 `data-paused`，避免动画与自动关闭时间脱节。通知不进入页面布局，也不改变固定单屏的滚动所有者。

## 对话框关闭尺寸与 chrome（2026-11-07）

此前关闭按钮只在展示站 ≤799px 覆盖；本轮把 32px 可视、44px 命中的关闭按钮收进共享 Dialog / Drawer（`.rd-dialog-close`，`::after` 外扩），展示站删除重复覆盖。footer 按钮由展示站按 [DR-17](../design/design-rules.md#dr-17) 设为桌面 32 / 移动 36（触屏 44 命中）；Dialog 正文表单仍按密度 28 / 32 / 36，不随 chrome 缩小。公开 props 未变，键盘、焦点恢复与 Escape 行为沿用原合同。


## 表单可用性吸纳（2026-11-08）

按外部移动端表单清单一轮评估，只落地现有页面可验证的部分，详细判断见[表单可用性规则](../design/patterns/forms.md)：

- `FormField` 必填星号使用 danger 色；不改变标签、hint、error 结构和公开 props。
- 资源新建弹窗：名称在失焦时校验空值与重名，提交复用同一规则；名称与摘要补常驻 hint。
- 文档编辑：标题在失焦时校验空值，保存复用；标题补常驻 hint。
- 组件用法页的 FormField 示例改为失焦或提交校验，展示输入时清除、失焦显示的节奏。
- 验证码、上传、日期、滑块、自动补全、级联、标签、密码与单选组只登记为候选，等真实页面需要时再进入 C-02；本轮不因截图新增组件。
- 验证：`npm run type-check`、`npm run build` 通过；资源弹窗、文档标题、组件示例定向浏览器检查 19/19；未覆盖 Safari / Firefox、屏幕阅读器与复杂表单组件。必填星号颜色已纳入 F-02.4 第二版运行基线。


## RadioGroup 与设置页单选（2026-11-08）

按表单可用性规则 #10，新增 `RadioGroup` 并替换设置页 4 个 2–4 项字段；5 项以上仍用 Select，可搜索 Combobox 仍为候选。

- API：受控 `value` / `onValueChange`，`options: { value, label, disabled? }[]`，`orientation: vertical（默认）| horizontal`，`name`、`required`、`disabled`；FormField 内自动关联 label、hint / error 与 invalid 状态。
- 键盘：Tab 进入当前选中项；方向键移动并选中，鼠标点选后改用方向键也会显示焦点环；Space 选中；禁用项跳过。字段标签的 `htmlFor` 锚定当前选中项，点击字段标签不会误选第一项。
- 视觉：列表单选使用 18px 圆点，选中用 action 色填充；粗指针 / 无指针设备每个选项至少 44px 行高。设置页使用横向单选组，桌面控件列放宽到 320px 并右对齐，窄容器换行；移动单列左对齐。
- 验证：type-check、build 通过；设置页与组件页定向浏览器检查 28/28（四组单选、方向键即选中、字段标签不误选、保存、语言切换、桌面右对齐 / 移动左对齐、390 / 514 / 1440、514 + 200% 基础字号、无溢出、无 pageerror / 4xx）。
- Safari / Firefox 后续复验见 [E-02.5](workbench-preview.md#e-025-补验检查项)。设置页 RadioGroup 视觉已纳入 F-02.4 第二版运行基线。


## Avatar 与 Tag（2026-11-08）

按家族 UI 盘点与 shadcn/ui 参考，新增两个展示组件；Avatar 用于侧栏账号 / 工作区，Tag 用于资源与文档标签，组件用法页扩到 19 个。

- Avatar：`name` 用于可访问名称与首字回退，`src` 图片加载失败回退，`fallback` 可覆盖回退文字，`shape: circle（默认）/ square`，`size: sm / md / lg`；装饰性用法设置 `decorative`，避免与父级按钮名称重复。
- Tag：中性标签，`children` 文本；只负责标签，不承担状态语义；状态继续用 StatusBadge。两者都是纯展示，不进入 Tab 顺序。
- 接入：侧栏账号 / 工作区头像、资源详情标签、文档属性标签；组件用法页提供回退、图片、方形 / 圆形、尺寸与长文本示例。
- 验证：`npm run type-check`、`npm run build` 通过；定向浏览器检查 19/19（侧栏头像回退 / 装饰性、资源与文档标签、组件页图片加载、明暗、390 无横向溢出、无 pageerror / 4xx）。
- 未覆盖：图片加载失败路径未做浏览器定向；屏幕阅读器实际朗读、Safari / Firefox 本轮未单独复验。视觉已纳入 F-02.4 第二版运行基线。


## Skeleton（2026-11-08）

- 目标：为家族工作区加载提供通用占位；不把动画当作唯一加载反馈。
- API：`width` / `height` 接受 CSS 长度或数字，`className` / `style` 可覆盖；组件自身 `aria-hidden`，外层用 `aria-busy` / `role="status"` 说明正在加载，完成后移除占位。
- 视觉：`--rd-bg-muted` 表面 + 低对比高光扫过；`prefers-reduced-motion: reduce` 时保留静态占位、停止动画。
- 接入：组件用法页反馈组；本仓没有真实异步页面，未伪造加载态。家族 Radish 工作区有 Skeleton 使用位置，后续真实页面需要时再接入。
- 验证：`npm run type-check`、`npm run build` 通过；定向浏览器 26/26（含 Avatar / Tag / Skeleton、正常 / 减少动效、390 无横向溢出）；表单 19/19、RadioGroup 28/28 复跑通过。


## InputOTP（2026-11-08）

- 目标：为家族登录 / 验证码类场景提供通用输入；参考 Radish `@radish/ui` 的 PasscodeInput 行为，但不搬产品实现。
- API：受控 `value` / `onValueChange`；`label` 必填，`length` 默认 6；`hint` / `error`、`required`、`disabled`、`autoFocus`、`name`、`onEnterPress`。
- 视觉：每格为正方形，与标准控件同高；细指针 32×32（`--rd-control-height`），粗指针 44×44（`--rd-touch-height`）；数字使用 mono 字体。
- 键盘 / 输入：数字自动前进，Backspace 清除当前或上一格，Delete 清除当前格。清空中间格时，右侧数字保留原位，`onValueChange` 继续返回连续数字字符串。支持方向键、Home / End 和系统粘贴快捷键，粘贴按位填充。每格有独立可访问名称，组用 `aria-labelledby` / `aria-describedby` 关联标签与说明。
- 表单：`name` 时额外提交完整值的隐藏字段；错误状态通过 `aria-invalid` 与 danger 边框表达。
- 接入：组件用法页字段组示例；本仓暂无真实登录页，未伪造验证码页面。家族 Radish 的 PasscodeInput 是后续真实接入参考。
- 验证：`type-check` / `build` 通过；定向浏览器 21/21（6 格、正方形、与标准控件同高、自动前进、Backspace、粘贴、无障碍名称、错误 / 禁用状态、Inter / JetBrains 字体、390 无溢出、无 pageerror / 4xx）。
- 未覆盖：真实登录 / 验证码流程、`name` 隐藏字段在真实表单中的提交、屏幕阅读器实际朗读、Safari / Firefox 单独复验。


## ConfirmDialog（2026-11-08）

- 定位：基于现有 `Dialog` 的确认组合，不新增浮层原语；复用叠层、焦点约束、关闭与恢复。
- API：`open` / `onOpenChange`、`title`、`description`、`children`、`confirmLabel` / `cancelLabel`、`tone: default | danger`、`loading`、`onConfirm`、`closeLabel`。
- 交互：`role="alertdialog"`；初始焦点在取消按钮；Tab 在两个操作间移动；Escape / 关闭按钮关闭并回到入口；`loading` 时取消、关闭与遮罩关闭被拦截，确认按钮显示加载。
- 接入：组件页反馈组、资源删除、文档放弃修改；危险操作用 danger tone，破坏性说明放在 description / children。
- 验证：`type-check` / `build` 通过；定向浏览器 24/24（alertdialog、标题 / 描述、初始焦点取消、确认结果、Escape 与回焦、loading 拦截关闭、真实文档放弃 / 继续编辑、390 无溢出、无 pageerror / 4xx）。
- 未覆盖：`loading` 异步确认的实际业务路径、屏幕阅读器实际朗读、Safari / Firefox 单独复验。


## ToggleGroup（2026-11-08）

- 定位：单选 / 多选分段组，参考 shadcn/ui ToggleGroup 与 Radix 语义；不新增运行时依赖。
- API：`type: single（默认）| multiple`、`value` / `onValueChange`、`items: { value, label, disabled? }[]`、`label`、`disabled`、`className`。
- 语义：单选由 Radix 提供 `radiogroup` / `radio` 与 `aria-checked`；多选使用 `toolbar` / `button` + `aria-pressed`；`label` 必填，禁用项不响应。
- 接入：资源库类型筛选使用单选（全部 / 文档 / 清单），保留原筛选结果；组件页展示多选、方向键、Space 与状态文本。它替代了原资源页的 Tabs 过滤，Tabs 仍用于设置 / 组件页。
- 验证：`type-check` / `build` 通过；定向浏览器 16/16（单选筛选、多选追加 / 取消、禁用项、方向键、Space、390 无横向溢出、无 pageerror / 4xx）。
- 未覆盖：多选在真实产品页面、屏幕阅读器实际朗读、Safari / Firefox 单独复验。


## Accordion（2026-11-08）

- 定位：单选 / 多选折叠组，参考 shadcn/ui Accordion 与 Radix；不新增运行时依赖。
- API：`type: single（默认）/ multiple`、`items: { value, label, content, disabled? }[]`、`value` / `defaultValue` / `onValueChange`、`label`、`className`；single 可 `collapsible`。
- 交互：标题为 button，Tab 进入，Enter / Space 展开 / 收起，方向键在标题间移动；内容区域由 Radix 关联，禁用项跳过；减少动效时箭头不旋转。
- 接入：文档页移动端“本文目录”取代原生 `<details>`，保留原目录链接与 44px 顶栏；组件页新增单选折叠示例。桌面目录仍是常驻侧栏。
- 验证：`type-check` / `build` 通过；定向浏览器 14/14（默认可展开项、单次一项、禁用项、Space、移动目录展开 / 收起、390 无横向溢出、无 pageerror / 4xx）。
- 未覆盖：多选折叠在真实产品页面、屏幕阅读器实际朗读、Safari / Firefox 单独复验。Progress 暂缓，等真实异步进度流程。
