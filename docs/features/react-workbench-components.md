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
| Button / IconButton | 保留原生 button 属性、ref、四种 variant 与 loading，增加 sm / md；默认 type=button，loading 禁用并带 aria-busy。IconButton 的 label 必填 |
| FormField / Input / Textarea | FormField 提供 label、hint / error、required 与稳定 id；Input / Textarea 读取字段上下文关联 aria-describedby / aria-invalid，也可独立传入原生属性。Switch 等其他控件由调用方显式关联 id / 标签及所需说明。失败不清空输入 |
| Select | 受控 value / onValueChange、options、placeholder、disabled / required；触发值和箭头分离，浮层不透明，支持当前值、键盘、滚动与碰撞避让 |
| Checkbox / Switch | Checkbox 保留原生表单与键盘行为，Switch 使用受控 checked / onCheckedChange；标签、禁用、焦点与选择状态分别表达 |
| Tabs | 受控或非受控 Root，配合 TabsList / TabsContent，保持 tab / tabpanel 关联、方向键、选择与焦点；列表在极窄 + 大字号下可换行，避免入口被裁切；辅助导出不另算组件数量 |
| StatusBadge | neutral / info / success / warning / danger 表达展示语义，文字与图标由调用方提供，不伪装为交互按钮 |
| Dialog / Drawer | 受控 open / onOpenChange，标题、可选说明、正文与 footer；支持 Escape、焦点约束、可指定初始焦点并恢复入口；关闭按钮 32px 可视、44px 命中由共享组件提供。Drawer 是同一弹层合同的侧向编排 |
| Menu | trigger 与具名 items，支持禁用、危险项、分隔与链接 / 动作；键盘、关闭与焦点由行为基础维护 |
| InlineAlert | info / success / warning / danger，错误以 alert 播报，其余状态使用 status；必要说明不只放在 Tooltip |
| Toast / Tooltip | Toast 以顶部胶囊提供可关闭的短时反馈，关闭按钮显示剩余时间，悬停 / 聚焦暂停，超时自动关闭；Tooltip 补充已有可访问名称；不替代持久错误、字段帮助或必要操作入口 |

A 批 10 个基础组件与 B 批 6 个反馈 / 浮层组件由三代表页实际消费；AppShell、表格、分页、目录和业务数据仍属于展示站组合，不提前承诺通用 DataGrid、服务器分页、富文本或权限能力。

## 视觉与失败路径

现代圆角和紧凑留白按[设计条例](../design/design-rules.md)，具体 token 映射按 [F-01](token-foundation.md)。桌面组件控件密度可调（紧凑 / 标准 / 宽松，默认标准），粗指针 / 无指针设备保持至少 44px 的主要控件范围，窄桌面窗口沿用所选桌面密度；焦点与选中不同，浮层可在 Dialog 内正常使用。

组件只输出事件，不替调用方宣称保存成功。IO 失败由页面明确反馈，表单保留输入；只读、禁用、loading 与错误分别判断。Dialog / Menu 的焦点恢复、Select 的键盘、长中文 / English、窄屏与明暗必须在组合页面检查，不能只凭引用 Radix 推断验收通过。

## 实施与验收

| 工作项 | 状态 | 依据与限制 |
| --- | --- | --- |
| C-02.1 A 批控件与语义样式 | 已完成（本地 React 19 范例） | 十个基础组件由三页直接消费；类型、真实表单与明暗 / 窄屏检查通过 |
| C-02.2 B 批浮层与反馈 | 已完成（本地 React 19 范例） | 六个反馈 / 浮层组件由 E-02 消费；Select 键盘、不透明菜单、Dialog / Drawer 焦点约束与恢复、失败反馈通过 |
| C-02.3 状态与兼容验证 | 已完成（本轮限定范围） | 模型测试、浏览器流程和组合检查通过；具体证据与其他平台 / 辅助技术等未覆盖面归开发记录 |
| C-02.4 组件用法与状态展示 | 已完成（本地 React 19 用例） | `#/components` 提供 16 个共享组件的实际用例、关键 props / 事件、代码与键盘说明；适用的禁用 / 加载 / 错误 / 只读和长内容可操作；11 月 7 日同步顶部通知与倒计时说明，明暗 / 窄屏验证见开发记录 |

前三项完成指本轮真实页面的有限组合验收，C-02.4 已补齐独立用法页；这仍不等于每个组件的所有组合或所有消费环境均已验收。之后按页面需求决定新增组件，不以复制组件实现或静态截图替代运行用例。

定向检查为 `npm run type-check`、`npm run test:workbench`、`npm run check:tokens`、`npm run check:notices`；完整基线使用 `npm run build`。浏览器验收由 E-02 的矩阵驱动，日期化证据见[本周记录](../devlogs/2026-W45.md)。不推断 Flutter、其他 React 主版本或产品接入可用。

## 组件用法页与本轮收敛

2026-11-05，`apps/docs/src/ComponentsPage.tsx` 直接导入共享组件，按操作、字段、选择、反馈四组展示。桌面从“开发参考 → 组件用法”进入，移动端从账号菜单进入；保留三代表页的主导航。示例仅在当前分组内保留内存状态，离开分组 / 页面即重置，不写入资源、正文或偏好。关键 props 与代码示例帮助理解用法，完整类型仍以共享包导出为准；示例内容以中文和 English 合成文案为主，不承诺文档全文英文化。

2026-11-07 在 F-02.4 基准登记后，组件页顶部加入临时 **Surface & state spike**：同一偏好卡片的“当前”与“候选”并排对照，候选只在本页试验填充字段、分组表面与状态层（不可用 / 处理中 / 保存 loading），不改共享 token、组件 API 或依赖；桌面双列、移动堆叠，320px 与 200% 字号下容器不溢出。该区块待所有者评审：接受则单独进入 B2 并说明 token / 组件变更范围，不接受则移除，不把页面本地样式当作共享契约。

按所有者“桌面按钮、输入框、选择器偏大”的反馈，展示站默认偏好改用已有 compact 档；共享 token 值与 API 未改。Input / Select 的纵向内边距随现有高度计算，普通字号时三档实际对齐到 28 / 32 / 36px（2026-11-07 重命名为紧凑 / 标准 / 宽松）；Textarea 保留多行留白，大字号允许自然撑高，coarse / none pointer 保留至少 44px 控件范围，fine pointer 不再仅因窗口变窄而放大。Button 长文案可换行，避免大字号溢出。

Safari 的指针激活不一定自动聚焦按钮；Button 在执行 onClick 前显式聚焦自身（preventScroll），资源详情的原生按钮采用同一方式，保证 Dialog / Drawer 能记录并恢复真实入口。消费者仍可在 onClick 内主动移动焦点。Safari 原生窗口已复验这两条关闭路径，其他浮层组合仍按具体环境判断。

## 顶部通知与倒计时（2026-11-07）

按所有者对底部通知的反馈，Toast 改为顶部居中的深色胶囊：关闭按钮的边框即 4500ms 倒计时环，走完后自动关闭；悬停或聚焦时暂停，离开后继续。Escape、关闭按钮与向上滑动都可关闭，F8 仍进入通知区域；`prefers-reduced-motion` 下取消进出场动画但保留倒计时。公开 API（open / onOpenChange / message / label / closeLabel）未变，其他页面与 ComponentsPage 示例直接获得同一形态。

倒计时环使用 `pathLength="1"` 的圆角矩形描边，随时间增加 `stroke-dashoffset`；暂停状态由 Radix Toast 的 `onPause` / `onResume` 同步到 `data-paused`，避免动画与自动关闭时间脱节。通知不进入页面布局，也不改变固定单屏的滚动所有者。

## 对话框关闭尺寸与 chrome（2026-11-07）

此前关闭按钮只在展示站 ≤799px 覆盖；本轮把 32px 可视、44px 命中的关闭按钮收进共享 Dialog / Drawer（`.rd-dialog-close`，`::after` 外扩），展示站删除重复覆盖。footer 按钮由展示站按 [DR-17](../design/design-rules.md#dr-17) 设为桌面 32 / 移动 36（触屏 44 命中）；Dialog 正文表单仍按密度 28 / 32 / 36，不随 chrome 缩小。公开 props 未变，键盘、焦点恢复与 Escape 行为沿用原合同。
