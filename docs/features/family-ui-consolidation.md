# 家族 UI 通用组件与视觉统一

状态：进行中（2026-11-08，只读盘点第一版 + Avatar / Tag / Skeleton / InputOTP / ConfirmDialog / ToggleGroup / Accordion 已落地；字体包与图标策略已定；视觉纳入 F-02.4 第二版运行基线）
主要归属：F：视觉基础 / C：跨平台通用组件
协同：E：展示与页面范例、F-02 设计来源、G：工程与交付

## 目标

以 RadishUI 作为 Radish 系列唯一通用 UI 源：只读盘点 `~/Code` 中各产品的通用组件、视觉规则、图标、字体与 token 需求，把共性部分在本仓统一设计、实现和定稿。产品仓只作为需求和参考输入，不修改、不接入、不做应用迁移。

## 边界

- 不修改任何产品仓，不建产品迁移分支，不做 P2 外部产品试点。
- 不复制产品源码、素材、字体、图标或私有实现；只提炼通用需求和交互规则。
- 不把 Ant Design 封装、业务组件、图表、聊天、编辑器等领域实现整体搬入 RadishUI。
- 不为没有页面承载的组件提前堆 API；候选先登记触发条件。
- 正式发行、master 晋级、tag 与部署继续冻结。

## 只读来源盘点

| 仓库 / 包 | UI 技术栈 | 通用组件与视觉来源 | 图标 | 字体 | 备注 |
| --- | --- | --- | --- | --- | --- |
| RadishUI | React 19.2.7；Radix；lucide-react 1.68 | 24 个共享组件；`--rd-*`；Inter / JetBrains 优先，系统回退 | lucide-react | Inter / JetBrains 优先，系统回退 | 本仓，统一目标；Web 范例已引 fontsource |
| Radish `Frontend/radish.ui` | React 19.2.7；`@radish/ui` 26.8.2；AntD 6.1 封装 | Button、Input、Modal、Toast、Select、ContextMenu、Skeleton、PasscodeInput、ConfirmDialog、BottomSheet、Markdown 编辑器 / 渲染器、图表、图片裁切等 | Iconify + MDI；部分 AntD 图标 | `--theme-font-*` | 组件量最大，含产品领域组件；AntD 封装不整体迁入 |
| RadishX | React 19.2.7 | 官网外壳；family-ui `--rd-*` 副本 + `--rx-*` 映射 | 内联 SVG | `--rx-font-*` | 已有本地临时消费测试，不作为正式采用 |
| RadishMind | React 19 | 控制平面面板；`--rm-*` + `--rd-*` 别名 | 内联 SVG | Inter + 系统 CJK | 面向工作流 / 管理，面板多 |
| RadishNexus | React 19.2.8 | 工作台 / 文档 / 协作；自定义 token | 内联 SVG | Inter + Georgia / Songti | 与 RadishUI 工作面接近，但暂不接入 |
| RadishInk | React 18.3.1 | 编辑器 / 工作区；`--wemd-*` + 语义 token | lucide-react 0.555 | JetBrains Mono + 系统 | React 18，暂不作为首轮消费面 |
| Radish / Ledger / Lex | Flutter（pubspec） | 跨平台 UI 未盘点 | — | — | 留到 P3 / 专项确认 |
| Catalyst / Flow 等 | 非统一 React Web | 工具页 / 原生控制台 | — | — | 不进入本轮组件归并 |

首轮只读扫描使用 `package.json`、CSS / TSX 文件与组件目录，不运行产品页面；结果记录在忽略目录 `output/radish-inventory/scan.json`。不是完整迁移审计。

## 共性组件判断

| 能力 | 家族使用 | RadishUI 现状 | 判断 |
| --- | --- | --- | --- |
| Button / IconButton | Radish、Ink、Mind、Nexus、RadishX | 已有 | 统一尺寸、变体、loading、disabled、焦点 |
| Input / Textarea / FormField | 多产品 | 已有 | 补失焦校验、hint、必填标识、填充变体 |
| Select / RadioGroup | 多产品 | 已有（RadioGroup 2026-11-08） | 小选项数用 RadioGroup，大选项 / 搜索用候选 Combobox |
| Dialog / Drawer / Menu / Toast / Tooltip | 多产品 | 已有 | 统一关闭、焦点、危险确认、移动编排 |
| Tag / Badge | 资源、文档、状态 | StatusBadge 已有；Tag 已有 | 本轮补 Tag；状态继续用 StatusBadge |
| Avatar | 账号、工作区、创建者 | 已有 | 本轮补 Avatar（图片 / 首字回退、圆形 / 方形、尺寸） |
| Skeleton | Radish 工作区加载 | 已有（组件页示例） | 本仓无真实异步页面，未伪造加载态；真实页面需要时再接入 |
| PasscodeInput / InputOTP | Radish 登录 / 验证 | 已有 InputOTP | 标准正方格（32 / 粗指针 44）；组件页字段示例；真实登录页后续接入 |
| ConfirmDialog / AlertDialog | 多产品删除 / 危险操作 | 已有 ConfirmDialog（Dialog 组合） | 初始焦点取消、loading 拦截关闭、danger 确认 |
| ContextMenu | Radish、RadishUI Menu | Menu 已有 | 不新增第二套菜单 |
| Markdown 编辑器 / 渲染器 | Radish、RadishUI 文档 | 页面内简版 | 候选：文档能力单独评估，不整体迁入 |
| 图表 / 图片裁切 / 聊天 / 贴纸 | Radish 等领域功能 | 无 | 不进入通用核心；按产品领域保留 |
| AntD 的 Table / Form / Layout | Radish 封装 | 无，且方向不同 | 不采用 AntD；RadishUI 继续 shadcn / Radix 路线 |

## shadcn/ui 缺口优先级

以 shadcn/ui 组件目录和交互状态为首要参考，按“家族共性 + 本仓页面真实位置”排序；不为了组件数量补空壳。

1. **本轮已完成**：Avatar、Tag。
2. **暂缓 / 候选**：Progress 等真实异步进度流程；日期 / 滑块 / 上传 / 标签输入 / Combobox 等真实页面。Skeleton、InputOTP、ConfirmDialog、ToggleGroup、Accordion 已完成组件页示例。
3. **后续**：表格、分页、图表、编辑器、图片处理等领域能力不进入通用核心，除非重新确认边界。

## 图标

当前分歧：

- RadishUI：`lucide-react` 1.68，9 处导入。
- Radish：`@iconify/react` 6.0.2 + MDI，`@radish/ui` 的 Icon 组件。
- RadishInk：`lucide-react` 0.555，24 处导入。
- Mind / Nexus / RadishX：以内联 SVG 为主，没有统一图标包。

建议：

- RadishUI 与新增共享组件统一使用 **lucide-react**，固定当前版本；16 / 18 / 20 三档尺寸，`currentColor`，不混用第二套图标库。该策略已于 2026-11-08 定稿并写入[品牌资产与图标](../design/foundations/08-brand-assets.md)。
- 品牌 Logo、产品标识、插画不伪装成通用图标，保留独立资产与来源。
- Radish 的 Iconify / MDI 与 Ink 的旧 lucide 先记为产品侧例外；不在本轮迁移产品。后续产品升级时再按映射表切换。
- 图标使用规则与尺寸表已补；本轮不改产品，也不迁移 Radish 的 Iconify / MDI。

## 字体

当前分歧：

- RadishUI：系统 sans / mono 栈。
- Mind / Nexus：Inter 优先，但仓库未看到字体包或字体文件。
- Ink：JetBrains Mono + 系统字体。
- Radish：`--theme-font-*`；RadishX：`--rx-font-*`。

建议：

- 家族 sans 栈：`'Inter Variable', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif`。
- 等宽栈：`'JetBrains Mono Variable', 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace`。
- 2026-11-08 已更新 `--rd-font-sans` / `--rd-font-mono`；本机已安装时优先，缺失时回退。
- 衬线仅用于品牌 / 阅读长文，按页面单独指定，不进入所有组件默认。
- Web 范例已安装 `@fontsource-variable/inter` / `@fontsource-variable/jetbrains-mono` 5.3.0（OFL-1.1），导入 `index.css`，字体族为 `'Inter Variable'` / `'JetBrains Mono Variable'`；CJK 回退系统。组件包发行时的依赖 / peer 策略仍待确认，未把字体文件复制进仓库。
- 字体定稿前先做字形覆盖、中文回退、等宽代码、数字对齐和明暗对比检查。

## token

- `--rd-*` 是 RadishUI 的语义来源；RadishX / Mind 已有别名，Ink / Nexus / Radish 仍是各自的 `--wemd-*` / `--rm-*` / `--theme-*`。
- 本轮不迁移产品 token；先盘点缺哪些语义角色（surface、state、focus、icon size、avatar/tag 尺寸等），在 RadishUI 补齐并记录别名关系。
- 产品接入必须单独确认版本、映射、例外与回滚，不能把盘点当作迁移授权。

## 本轮实现

- 只读盘点与本文档。
- 当前规划顺位改为“本仓组件 / 示例页面 / 视觉定稿优先”，P2 外部产品采用后置。
- Avatar、Tag 已进入 C-02，并落到本仓组件页、资源库和文档页；Skeleton 已加入组件页反馈组；InputOTP 已加入字段组，使用标准正方形格；ConfirmDialog 已接入删除 / 放弃路径；ToggleGroup 已用于资源筛选；Accordion 已用于移动目录。定向浏览器 26/26 + InputOTP 18/18 + ConfirmDialog 18/18 + ToggleGroup 15/15 + Accordion 13/13（含正常 / 减少动效、字体加载、390 无横向溢出）；表单 19/19、RadioGroup 28/28 复跑通过。
- 字体栈 token 已更新，Web 范例字体包已引入，图标策略已定稿；未改产品仓；视觉已纳入 F-02.4 第二版运行基线。
- 图标 / 字体只出策略，不加依赖、不改 token；等所有者确认后再定稿。

## 验收

- 盘点表、来源、版本与边界可追溯；产品仓工作区不受影响。
- Avatar / Tag 有真实页面使用、明暗、键盘 / 焦点（适用处）、390 / 1440 与回归证据。
- 组件用法页与实际页面一致，不复制演示实现。
- 图标 / 字体 / token 的后续决定有明确确认点，不自动视为已发行或产品采用。

## 不做

- 不改任何产品仓、不建产品迁移分支、不做 P2 外部试点。
- 不引入未经确认的 AntD、Iconify 或新的字体 / 图标依赖。
- 不把领域组件（聊天、图表、图片裁切、贴纸、Markdown 编辑器）整体搬入通用包。
- 不正式发行、不晋级 master、不创建 tag 或部署。
