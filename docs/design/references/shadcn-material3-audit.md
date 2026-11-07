# shadcn/ui 与 Material 3 参考拆解

日期：2026-11-06。状态：设计参考研究；不改 token、组件 API、依赖、页面或正式视觉基准。

## 背景与边界

2026-11-06 所有者提供一张 shadcn/ui 风格的产品 dashboard 截图，并询问 [shadcn/ui](https://ui.shadcn.com/docs) 与 [Material 3](https://m3.material.io/) 是否适合作为参考。截图只用于内部观察，未保存到本仓；按[参考索引](README.md)的边界，不采集 Ledger 私人材料，也不复制图中的品牌、文案、图表或页面组合。

本次要回答的是“怎么参考”，不是“换成 shadcn 或 Material 3”。现有默认原则、[DR-15](../design-rules.md#dr-15) 固定单屏和 [DR-16](../design-rules.md#dr-16) 输入方式适配继续有效；[现代圆角运行版](../patterns/modern-rounded-v1.md)与 B1 仍是当前基准候选。

## 结论

1. **shadcn/ui 作为第一视觉 / 组件参考。** 它的中性表面、细边界、低阴影、高对比文字和完整组件状态，和 RadishUI 当前 B1 的方向最接近；但只借模式和状态，不引入 Tailwind / CVA、不复制整套源码、不照搬 dashboard 骨架。
2. **Material 3 作为第二层方法论参考。** 取 state layer、tonal roles、adaptive layout、动效与可访问性语义；不取 dynamic color、elevation 体系、FAB / Top App Bar、大形状和 48dp 全量尺寸。
3. **截图参考的是表面与组件，不是页面结构。** 图里的 KPI、卡片网格、图表和聊天区是产品 dashboard；资源库是固定单屏工作台，不把卡片堆叠找回来。

参考层级固定为：

1. RadishUI 自己的设计原则、token、DR-15 / DR-16 与正式基准。
2. shadcn/ui：组件完整性、表面、表单、状态与代码组织方式。
3. Material 3：状态层、色调角色、自适应、动效和可访问性方法。

## 视觉与结构取舍

| 层面 | 可借鉴 | 需要转译 | 不采纳 |
| --- | --- | --- | --- |
| 表面 | 1px 细边界、低阴影、白 / 浅灰中性层次、16px 左右面板圆角 | 映射到现有 `bg-surface`、`bg-muted`、`border-soft` 与 10 / 12 / 16 圆角 | 每个区块都套卡片；大面积灰底；高 elevation |
| 排版 | 小号辅助标签、强标题 / 弱元信息、清晰数字 | 保留 28 / 14 / 12 与移动 26；英文长标签实宽验证 | M3 的大字号、展示型标题；全大写英文标签照搬 |
| 颜色 | 中性色承担层级、单一强调色 | 黑色主按钮改为现有品牌深蓝；状态仍用语义色 | shadcn 默认纯黑白品牌；M3 dynamic color |
| 密度 | 紧凑表单行、连续列表、分组侧栏 | 保留 32 / 36 / 40px 控件与标准工作区 | dashboard 的大留白卡片网格、48dp 全量放大 |
| 交互 | focus / disabled / loading / empty / error 成套；键盘与焦点返回 | 用现有 Radix + CSS 实现，不引入新依赖 | 只换外观、不补状态 |

## 组件审计

审计对象覆盖所有者提出的八类；结论只用于后续 spike，不代表本轮会改共享组件。

| 对象 | 当前实现 | 参考观察 | 结论 |
| --- | --- | --- | --- |
| Button | 共享 `Button`：`primary` / `secondary` / `ghost` / `danger`，`sm` / `md`，`loading` | shadcn 的 default / secondary / outline / ghost / destructive；M3 filled / tonal / outlined / text | **Adopt** 状态完整性与 keyboard / disabled；**Adapt** outline、button group 只在确有场景时作为后续变体；**Reject** 现在新增 API 或纯黑品牌 |
| Input / Field | 共享 `Input`、`Textarea`、`FormField`，含 label / hint / error / required / aria 关联 | shadcn 的填充式输入与 Field 组合；M3 filled / outlined | **Adopt** 错误、必填、辅助文本与焦点关联；**Adapt** 填充表面只作为 spike 候选，当前边框形态先保留；**Reject** 改 token 或表单语义 |
| Select | 共享 `Select`，基于 Radix；选项可 disabled，带勾选与滚动 | shadcn Select 的空态、disabled、check、键盘路径 | **Adopt** 空态 / disabled / check / 键盘；**Adapt** 当前 popper 表面与密度；不新增 Select API |
| Dialog / Drawer | 共享 `Dialog`、`Drawer`；标题 / 描述 / footer / `initialFocusRef`；关闭按钮视觉 32px、展示站移动端 44px 热区 | shadcn Dialog / Sheet 的 overlay、焦点返回、关闭位置；M3 dialog 的层级与状态 | **Adopt** 初始焦点与关闭后焦点返回；**Adapt** 关闭尺寸是否进入共享组件仍是开放项；**Reject** 在展示站已有覆盖时再加第二套 Dialog |
| Tabs | 共享 `Tabs` / `TabsList` / `TabsContent`，Radix 键盘行为 | shadcn Tabs 的 indicator、disabled、键盘 | **Adopt** indicator / disabled / 键盘一致性；**Adapt** 保持当前分段柔底，不改结构 |
| Table | 资源表是 `apps/docs` 页面级 `.resource-table`，不是共享组件 | shadcn Data Table 的列、空态、行操作、排序；M3 data table | **Adopt** 表头 / 行操作 / 空态 / 加载的表达；**Reject** 在只有一个消费者时新增共享 Data Table；先记录候选 |
| Empty | 页面级 `.empty-state`：图标 + 标题 + 说明 + 操作 | shadcn Empty 的组合与留白 | **Adopt** 组合完整性；**Reject** 现在新增共享 Empty；等第二个消费者再抽象 |
| Sidebar | 展示站 `Shell` 的 rail：品牌、工作区、入口、账号；不是共享组件 | shadcn Sidebar 的分组 / 折叠 / 移动抽屉；M3 navigation rail | **Adopt** 分组标签与当前项表达的可读性；**Adapt** 折叠 / 二级分组只在真实导航层级出现时评估；**Reject** 直接套 dashboard 侧栏或改变全局 rail |

补充：共享 `StatusBadge` 已覆盖中性 / 成功 / 警告 / 危险 / 信息，和截图的 badge 语义接近；本轮不因参考图增加颜色或胶囊变体。

## 页面结构判断

截图是 dashboard：左侧组件 / 导航，中间图表与指标，右侧表单、二维码和聊天，外层是卡片网格。它适合展示一套产品分析台，不适合直接套到资源库：

- 资源库的主任务是扫描、选择和打开资源，[DR-15](../design-rules.md#dr-15) 已固定标题 / 筛选 / 分页 / 底栏，仅让列表内滚；卡片网格会破坏扫描密度。
- [01 设计原则](../foundations/01-principles.md)明确避免 KPI 卡带、营销 Hero、无职责的巨大容器和卡片套卡片。
- 参考图的可取部分是**表面、表单、按钮层级、badge / empty / loading 状态和分组导航**；不是它的 KPI / 图表 / 四栏卡片组合。

## Material 3 的转译

| M3 方法 | RadishUI 的用法 | 边界 |
| --- | --- | --- |
| State layer | hover / focus / pressed 使用现有语义色的状态层，补足键盘与按下反馈 | 不新增一套 M3 状态 token；不改变现有 `:focus-visible` 可见性 |
| Tonal roles | 把 surface / on-surface / outline 的角色关系映射到现有 `bg-surface` / `text` / `border` | 不启用 dynamic color，不从壁纸取色 |
| Adaptive layout | 按可用宽度重排，继续遵守 DR-16 的 fine / coarse 配对验证 | 不引入 M3 的 compact / medium / expanded 命名作为新断点体系 |
| Elevation | 只在浮层 / 菜单保留必要抬升，继续低阴影 | 不把 elevation 层级当页面层次的主要手段 |
| Motion / a11y | 控制动效时长、焦点顺序、命中区与减少动态效果 | 不照搬 48dp 全量尺寸；现有 44px 触控底线保留 |

## 风险与不采纳项

- **品牌稀释**：纯黑主按钮、shadcn 默认色板与 Tailwind 语义名会绕开现有品牌色和 token。
- **结构回退**：把 dashboard 卡片网格、KPI、图表搬进资源库，会与固定单屏、无卡片堆叠的既定方向冲突。
- **依赖扩张**：shadcn 的源码复制 / Tailwind / CVA 会改变现有 Radix + CSS 分层；本轮不引入。
- **过早抽象**：Table、Empty、Sidebar 目前只有展示站一个消费者；不因参考图立即提升为共享组件。
- **M3 表达性**：dynamic color、FAB、Top App Bar、大圆角和大字号不作为默认；仅保留交互与适配方法。
- **素材边界**：所有者截图不入库、不复制、不再分发；后续若复制 shadcn 组件源码，按 MIT 记录来源、版本与采用范围。

## 建议的下一步

1. 先完成 F-02.4 对 A / B1 / 固定单屏 / 移动底栏的基准复评，不把参考图当成新基准。
2. 在 `#/components` 做一次**小范围 visual spike**：只借表面、表单与状态，使用现有 token 和共享组件，不改 token / API / 依赖；覆盖明暗、390 / 768 / 1024、focus / disabled / loading / empty。
3. 把 M3 的 state layer、adaptive、motion 和 a11y 检查项补进 E-02.5，不先改视觉。
4. Spike 经所有者确认后，再决定是否进入 B2；若进入，单独列 token / 组件变更与迁移范围，不把本轮研究直接当实现授权。

## 参考

- [shadcn/ui Docs](https://ui.shadcn.com/docs)、[Theming](https://ui.shadcn.com/docs/theming)、[Button](https://ui.shadcn.com/docs/components/button)
- [Material 3](https://m3.material.io/)、[State layers](https://m3.material.io/foundations/interaction/states/state-layers)、[Color roles](https://m3.material.io/styles/color/roles)
- [参考索引](README.md)、[设计原则](../foundations/01-principles.md)、[设计条例](../design-rules.md)、[E-02](../../features/workbench-preview.md)、[F-02](../../features/visual-baseline-proposal.md)
- 所有者提供的 dashboard 截图：仅内部观察，未保存、未纳入版本管理；不采集 Ledger 私人材料。
