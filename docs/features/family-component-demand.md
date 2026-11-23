# 家族组件需求盘点（2026-11-17）

状态：只读盘点完成，作为组件站 1.0 目录扩展（P4）的需求输入；2026-11-23 完成第二次只读复核并据此确认 P4-③ DescriptionList。不代表任何产品已接入，也不授权修改产品仓。
主要归属：C：跨平台通用组件 / E：展示与页面范例；协同 F：视觉基础、G：工程与交付。

## 目的与方法

回答两个问题：家族产品实际在用什么，以及 RadishUI 还缺哪些共性能力。方法是对本地 React 产品仓做静态扫描：

- 读取各仓 `package.json` 的 React / AntD / `@radish/ui` / 图标依赖；
- 扫描 `.tsx` / `.jsx` 源码中的 `import` 与 JSX 标签，统计出现次数；
- 对 Radish 的 client / console 额外统计 `@radish/ui` 根入口与子路径导入；
- 人工把同名标签归并为能力（如 `AntModal` / `Modal` / `Dialog` → 对话框），并区分产品领域组件。

数据是**静态出现次数**，不是运行时渲染次数，也不是可直接迁移的组件清单。产品仓只读；没有复制产品源码、素材或私有实现。

## 仓库与技术栈

| 产品 | React | UI 来源 | 扫描源码 | 备注 |
| --- | --- | --- | --- | --- |
| Radish client | 19.1 | `@radish/ui` 子路径 + 本地组件 | 180 个 tsx | 论坛、文档、聊天、通知、公开页；组件使用最广 |
| Radish console | 19.2 | `@radish/ui` 根入口（含 AntD 再导出） | 65 个 tsx | 管理台，表格 / 表单 / 上传密度最高 |
| RadishX | 19.2 | 内联 SVG / 本地外壳 | 18 个 tsx | 官网与入口，通用组件需求最低 |
| RadishMind web | 19 | 无 UI 库，自建样式与组件 | 91 个 tsx | 控制平面，状态、面板、流程节点多 |
| RadishMind console | 19 | 同 web | 2 个 tsx | 入口很薄 |
| RadishNexus web | 19.2 | 无 UI 库，自建 | 47 个 tsx | 工作台 / 文档 / 协作；字段与分页自建 |
| RadishInk web | 18.3 | 无 UI 库，自建 + CodeMirror | 66 个 tsx | 编辑器；颜色、滑杆、弹窗、上传自建 |
| RadishLink / Root / Memory 等 | — | 无 React 前端或无 tsx | 0 | 未纳入本次组件统计 |
| Flutter 产品 | — | Flutter | — | 本轮未盘点，留到 P3 |

Catalyst / Flow / Chat / Forge / Axiom / AxiomChecker 等不是统一 React Web 产品（部分为工具、后端或无 tsx 前端），未纳入本次组件统计，也不作为通用组件需求源。

## 高频证据

以下次数为导入或 JSX 标签出现次数；同一能力可能同时有导入与标签计数，因此只用于判断相对强弱。

**Radish client（`@radish/ui` 子路径）**：Icon 83、Toast 29、Modal 10、BottomSheet 10、MarkdownRenderer 9、MarkdownEditor 8、StickerPicker 7、ConfirmDialog 6、Button 6、ExperienceBar 5、Select 4、ReactionBar 4、Input 3、图表 8、UserMention 1、Skeleton 1、ImageLightbox 1、ImageCropper 1、ContextMenu 2、LevelUpModal 2。

**Radish console（`@radish/ui` 根入口 / 直接 AntD）**：Button 39、message 33、Input 32、Tag 26、Space 25、Modal 21、Select 20、Table 20、BottomSheet 19、Form 13、InputNumber 11、Switch 7、Popconfirm 6；直接 AntD 另有 Grid 9、Upload 7、Alert 1、Progress 1、Steps 1、Descriptions 1、Empty 1、Tabs 1。

**自建原语（Mind / Nexus / Ink）**：

- Mind：StatusBadge 134、StateNotice 9、LanguageSelector 8、StatusPill 7、MetricCard 6、RunSelect 6、PermissionCard 4、BoundaryPanel 4、LoadState 3。
- Nexus：Field 28、PageControls 13、Feedback 8、Panel 4、MarkdownView 3、EmptyState 2。
- Ink：ColorSelector 24、SliderInput 19、Modal 10、Switch 8、FloatingToolbarButton 6、Upload 3、ActionMenu 3、FileMenu 3、Toaster 2。

## 能力矩阵

“判断”列只说明 RadishUI 当前能否覆盖；是否有真实页面承载仍按 C-02 的规则逐项确认。

| 能力 | 家族证据 | RadishUI | 判断 |
| --- | --- | --- | --- |
| Button / IconButton | Radish client 6 / console 39+348；X 2 | 已有 | 文档深度，不新增 |
| Input / Textarea | console 66、client 8；Ink / Mind / Nexus 原生输入 | 已有 | 文档深度 |
| Select | console 42、client 5；Mind RunSelect / LanguageSelector | 已有 | 文档深度；搜索型选择另评估 Combobox |
| Form / 字段校验 | console Form 14 + FormInstance；Mind / Nexus 自建 Field | Form + FormField（2026-11-22） | **已补首项**：调用方校验 + 共享提交编排（noValidate、提交门禁、首个错误聚焦）；规则 DSL、异步校验与字段数组未做 |
| Modal / Dialog | client 10、console 22、Ink 10、X 1 | 已有 Dialog / ConfirmDialog | 文档深度；BottomSheet 见下 |
| BottomSheet | client 10、console 19 | Drawer 侧向 / 底部（2026-11-22） | 已给 Drawer 增加 bottom 编排并用于窄屏资源详情，不新增第二套浮层；拖拽把手 / 下滑关闭 / 半展开待真实移动场景 |
| Toast / Notification | client 29、console message 33、Ink 2 | Toast / InlineAlert | 基础已有；NotificationCenter 先作领域 |
| Menu / ContextMenu | client 2；Ink ActionMenu / FileMenu | Menu 已有 | 文档深度；不新增第二套菜单 |
| Table / DataTable | console Table 20 / 9 | Table 基础原语 | DataTable 先由 Table + Pagination 组合，不急着加壳 |
| Tabs | console 1 | 已有 | 文档深度 |
| Tag / Badge / Status | console Tag 148；Mind StatusBadge 134 | Tag / StatusBadge | 文档深度；不按产品改语义 |
| Avatar | console 11 | 已有 | 文档深度 |
| Switch / Checkbox / Radio | console 11 / 8；Ink 8 | 已有 | 文档深度 |
| InputNumber | console 18 | 无 | **候选**；数字输入与步进规则先定 |
| Slider | Ink 19 | 无 | **候选**；与 InputNumber 一起评估 |
| Upload | console 8 / 7、Ink 3、client FileUpload / 分片上传 | 无 | **候选**；通用上传与领域上传分开，不能整包搬入 |
| Progress / Steps | console 各 1 | 无 | 候选，真实流程需要时再做 |
| Descriptions | console 4 个详情页（2026-11-23 复核） | DescriptionList（2026-11-23） | **已补**：原生 dl 行式窄栏，工作台资源详情 / 文档属性 / 版本弹窗已采用；多列 / bordered 变体未做 |
| Empty | console 1、Nexus EmptyState 2 | 空态模式 | 可提炼 Empty，不急着加组件 |
| Divider / Space / Grid | console 7 / 68 / 9 | 无独立原语 | **布局原语候选**；先确认是否由 CSS / Stack 承担 |
| DatePicker / Calendar | `@radish/ui` 有再导出，本次未见高频使用 | 无 | 等真实表单需求，不提前做 |
| Combobox / 搜索选择 | 设计盘点候选；本次无直接高频导入 | Select 无搜索 | 等大选项 / 搜索场景确认真实需求 |
| ColorPicker | Ink ColorSelector 24 | 无 | 候选；Ink 真实需求明确，但是否通用待确认 |
| Pagination | Nexus PageControls 13 | 已有 | 文档深度 |
| Card / Panel / Section | console / Mind / Nexus 大量自建面板 | Card / Section | 文档深度；不把产品面板搬入 |
| Skeleton / 加载态 | client 1、Mind LoadState | Skeleton | 文档深度；加载编排仍归页面 |
| Tooltip | 各产品零散使用 | 已有 | 文档深度 |
| Breadcrumb | 本次未见高频 | 无 | 后置候选 |
| Markdown 编辑器 / 渲染器 | client 9 / 8、Ink CodeMirror、Nexus MarkdownView | 页面内简版 | **领域能力，不进入通用核心** |
| 贴纸 / 表情 / 提及 | client StickerPicker 7、ReactionBar 4、UserMention 1 | 无 | **领域能力，不进入通用核心** |
| 图片裁切 / 灯箱 | client ImageCropper 1、ImageLightbox 1 | 无 | **领域能力**；上传编排单独评估 |
| 图表 | client 8 | 无 | **领域能力**；不进入通用核心 |
| ExperienceBar / LevelUp / GlassPanel | client | 无 | **产品领域视觉**，不进入通用核心 |

## 目录扩展优先级

先完成现有组件的文档 / API / 用法深度（2026-11-23 起为 28 个组件 / 32 个条目），再按以下顺序确认目录扩展；每一件必须有真实页面、示例、API 与测试。

1. **Form 与字段校验**：与 FormField、Input、Select 的现有上下文衔接；先定校验责任在库内还是调用方，避免引入第二个表单框架。**2026-11-22 已完成首项**：所有者确认走调用方校验 + 共享提交编排，Form 已加入组件目录并用于资源新建 / 文档编辑。
2. **Upload**：通用选择 / 拖拽 / 进度 / 错误；分片、图片裁切、灯箱等留在产品侧或后续专项。
3. **InputNumber / Slider**：数字与范围输入；先定步进、精度、键盘与触控规则。
4. **BottomSheet 编排**：优先扩展现有 Drawer 的侧向 / 底部变体，不新增第二套浮层。**2026-11-22 已完成**：`DrawerProps.side` 支持 bottom，工作台窄屏资源详情已采用；拖拽 / 半展开未做。
5. **布局原语**：Divider / Stack / Grid 是否由 CSS 与现有 Card / Section 承担，先做一次真实页面审计，避免为了 API 而 API。
6. **Progress / Steps / Descriptions / Empty**：Descriptions 已于 2026-11-23 以 `DescriptionList` 落地（本站 3 处真实承载）；Progress / Steps 仍无真实流程，Empty 有 2 处承载但可先由页面组合承担，均等条件满足再确认。
7. **DataTable**：先用 Table + Pagination 组合验证真实需求，再决定是否提供高级表格。
8. **Combobox / DatePicker / ColorPicker**：按搜索选择、日期、颜色场景逐项确认；Ink 的颜色需求最明确，但不自动代表通用。
9. **领域组件**：Markdown、贴纸、表情、提及、图片、图表、经验条等不进入通用核心，除非重新确认边界。

## 边界与后续

- 产品仓只读；本盘点不修改、不迁移、不接入任何产品。
- AntD 的使用量是需求信号，不是采用 AntD 的决定；RadishUI 继续 shadcn / Radix 路线。
- 计数受产品封装、标签复用和多行导入影响，只能用于相对排序；真实接入前仍需逐项看页面与状态。
- Flutter 未盘点；P3 前另做范围确认。组件站 1.0 的目标、信息架构与验收见[组件站 1.0](component-site-1.md)。

## 2026-11-23 复核：P4 下一项的真实用量与承载

目的：P4 剩余候选都缺少真实页面承载，按[当前规划](../planning/current.md)第 8 项先复核家族真实用量，用证据确认下一项与边界。方法沿用本盘点：只读扫描产品仓 tsx / jsx 的 JSX 开标签（`<Name` 后接空白或 `>`，排除子组件）并人工区分通用与领域能力；产品仓只读，未修改任何产品文件。

- 范围：Radish client（180 tsx）、console（66）、RadishX（18）、RadishMind（94）、RadishNexus（75）、RadishInk（94）、RadishChat（3），共 530 个 tsx / 475 个含 JSX 的文件；脚本与原始数据在忽略目录 `output/family-usage-audit-2026-11-23/`。
- 与 2026-11-17 首轮差异：首轮 console「直接 AntD」列混用导入与标签计数（Descriptions 1、InputNumber 11、Upload 7、Progress 1、Empty 1）；本次统一按 JSX 开标签复核为 Descriptions 4 块 / 4 个详情页、InputNumber 18 / 11 个文件、Upload 9、Progress 5、Empty 4。方向不变，候选排序依据更完整。
- 承载条件（本仓真实页面）：资源详情、文档属性、版本弹窗共 3 处页面级 `<dl class="property-list">`（9 个 label / value）→ Descriptions 可用；资源空结果与目录空结果 2 处 → Empty 可用；InputNumber / Upload / Slider / Progress / Steps / DatePicker / ColorPicker 无承载。

| 候选 | 2026-11-23 家族真实用量 | 本站承载 | 结论 |
| --- | --- | --- | --- |
| Descriptions | console 4 个详情页（用户、商品、角色权限、系统配置；column 1/2、bordered、size=small、title，items 与 children 两种写法） | 有（3 处，9 组） | **P4-③ 已确认并完成**：`DescriptionList` 行式窄栏版本 |
| Empty | console 4（用户详情页签）、Nexus 2 | 有（资源空结果、目录空结果） | 次选；组合简单，暂由页面承担 |
| InputNumber | console 18 / 11 文件（价格、库存、限额、时长、排序、金币调整等） | 无 | 家族需求最强但无承载；需先确认最小真实场景 |
| Upload | console 9 / 7 文件 + 批量上传、Ink 3 | 无 | 领域耦合重、范围大，暂不做 |
| Slider | Ink 19（主题设计器字号 / 数值） | 无 | 编辑器向、无承载 |
| Progress | console 5（均在上传弹窗内） | 无 | 随 Upload，不单独做 |
| DatePicker / TimePicker | console 4 / 3 文件 | 无 | 低频且复杂，暂不做 |
| Steps / Breadcrumb / Result | console 1 / 1 / 5 | 无 | 低频或可由现有提示 + 页面组合承担 |
| ColorPicker | Ink 24 / 9 文件（主题设计器） | 无 | 领域向，暂不做 |
| Divider / Space / Grid | console 7 / 68 / Row+Col 少量 | 有（页面 CSS gap） | 由 CSS gap 承担，不新增组件，避免空转 wrapper |
| DataTable / ProTable | console Table 9，无 DataTable 标签 | 无 | Table + Pagination 组合，暂不加壳 |

其余已覆盖项：Form.Item 93（FormField / Form）、Tag 148、Button 348、Select 42、Modal 22、BottomSheet 19；Mind StatusBadge 149、Nexus PageControls 13 均有对应组件。client 侧剩余缺口只有 RatingStars 4、Transfer 1 等低频或领域能力。

结论：P4 下一项取 **Descriptions（工作名 `DescriptionList`）**，边界为原生 `<dl>` 语义、`items` 数据、行式窄栏排版与 token 排版；多列 / bordered 等宽屏变体没有承载，先不做。审计完成后经所有者确认，实施与验证见[组件站 P4-③](component-site-1.md#p4-description-list-2026-11-23)。
