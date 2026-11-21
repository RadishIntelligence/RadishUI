# 组件站 1.0

状态：2026-11-17 所有者确认作为下一阶段；2026-11-19 完成 P0 三页用法复审并进入 P1，P1 同日完成：30 个条目（27 个组件与 Card / Section / Table 页面原语）均有独立页；2026-11-21 完成 P2 的源码类型、JSDoc 与默认值生成，手写契约只保留回退字段；同日 P3 起步，逐组件行为归属与 a11y 声明进入同一契约来源。P2 外部采用与 P3 Flutter 暂缓。2026-11-18 按所有者确认增补机器可读契约、行为归属与交互行为测试评估，见[契约与行为](#contract-and-behavior-2026-11-18)。
主要归属：E：展示与页面范例（组件文档站）/ C：跨平台通用组件；协同 F：视觉基础、G：工程与交付。
需求输入：[家族组件需求盘点](family-component-demand.md)；既有组件合同见 [C-02](react-workbench-components.md)，页面范例见 [E-02](workbench-preview.md)。

## 目标

把当前的单页组件展示升级为可用的组件文档站，每个组件有独立页面、可查的 TypeScript API、可复制的用法示例、可搜索的目录，以及键盘 / 可访问性说明。先做深现有 27 个组件（P1 同时纳入 Card / Section / Table 页面原语），再按家族真实需求扩目录，不以组件数量衡量完成度。P2 从同一来源生成组件页 API 表与 `llms.txt` 并检查漂移，P3 将逐组件行为归属与可访问性声明纳入该流程。

## 非目标

- 不发布 npm 包、不提供 CLI / registry、不做公开采用的安装承诺；这些属于 P4 发行范围，需单独授权。
- 不启动 Flutter、不恢复 P2 外部产品试点；两者等组件站 1.0 达标后另行决定。
- 不复制 shadcn/ui、Ant Design、Lucide 的内容、素材或实现；只参考信息架构与 API 表达方式。
- 不为没有页面 / 示例 / 测试的组件提前加壳；不引入第二套图标或字体策略。
- 不引入跨框架行为层或 Agent 运行时桥接（`@ui-sdk/*`、Agent Bridge / WebMCP）。重评条件见[契约与行为](#contract-and-behavior-2026-11-18)。

## 信息架构

```text
#/catalog                 组件目录：搜索、分组、状态、深链
#/components              现有 27 个组件的单页参考（过渡期保留）
#/components/<id>         独立组件页：导入、示例、API、键盘 / a11y、相关组件
```

过渡期导航的“组件目录”指向 `#/catalog`；目录卡片中已迁移的组件进入独立页，其余先回到 `#/components`。P1 迁移完 27 个组件后，单页参考可退为历史入口或“全部示例”。

### 组件页模板

1. 标题、状态、摘要、返回目录；
2. 导入：包路径与样式导入，可复制；明确当前为 private workspace；
3. 示例：至少 3 个，覆盖基础、变体 / 状态、组合 / 表单；每个示例有预览、代码与复制；
4. API：属性 / 类型 / 默认值 / 必填 / 说明；多部件组件带“组件”列；
5. 键盘与可访问性：主题（键盘 / 焦点 / ARIA / 已知限制）、来源（浏览器原生 / Radix / RadishUI）与说明；P3 起由 `component-behavior.ts` 生成。
6. 相关组件：只链接真实存在的目录项。

## 阶段

| 阶段 | 交付 | 状态 |
| --- | --- | --- |
| **P0 垂直切片** | 目录页、搜索、Button / Select / Tabs 独立页、API 表、示例、复制、测试 | 已实现（`42019fe`），复审完成（2026-11-19） |
| **P1 迁移 27 个** | 现有组件全部进入模板；Card / Section / Table 页面原语一并纳入目录；单页参考退为“全部示例” | 已完成（30 个条目） |
| **P2 类型 / API 全量** | 导出缺失 props 类型；JSDoc / 默认值 / 事件 / ref；单一来源生成 API 表与 `llms.txt`，行为归属随 P3 进入同一来源；`--check` 漂移门禁；类型测试与完整性检查 | 已完成（2026-11-21）：类型、JSDoc 说明、解构默认值与事件签名由源码生成；原生 / Radix 继承属性、union 类型与未解构默认值保留契约回退 |
| **P3 用法深度** | 每组件 3+ 示例、变体 / 受控 / 表单 / 组合；代码高亮（新增依赖需确认）；每示例主题 / 密度；逐组件 a11y 与行为归属声明及对应断言（依赖待确认） | 进行中（行为归属与 a11y 声明已进入契约并生成；示例深度已覆盖六组，共 106 个示例；余下代码高亮、每示例主题 / 密度与交互断言待续） |
| **P4 目录扩展** | 按[家族需求盘点](family-component-demand.md)排序；Form、Upload、InputNumber / Slider 等逐项确认 | 待开始 |
| **P5 站点能力** | 版本 / 变更记录、状态与弃用、双语文档、图标参考、站点搜索索引；公开安装 / CLI / registry 属 P4 发行 | 待开始 |

P2 / P3 的生成与声明范围见[契约与行为](#contract-and-behavior-2026-11-18)；交互断言的执行环境与依赖确认见该节。

<a id="p0-usage-review"></a>

## P0 用法复审

请一名开发者只从目录和 Button、Select、Tabs 三页入手，在本仓示例中选择并导入组件，完成一次选择、切换与键盘操作。记录需要翻源码或额外解释的步骤，以及缺少的参数、状态或示例。能独立完成就提交 P0 复审并转入 P1 迁移；遇到阻碍先修模板或示例，再走相同步骤。复审者暂缺时保留 P0 待复审状态。此项使用本仓工作区，外部采用另行安排。

2026-11-19 按此路径完成执行，结果与修正见[用法复审记录](#p0-usage-review-2026-11-19)。

<a id="p0-usage-review-2026-11-19"></a>

## P0 用法复审记录（2026-11-19）

按所有者指示，由 AI 协作者按开发者路径执行三页用法复审；结论与证据：

- 目录：27 个卡片；搜索 button 命中 Button / IconButton；无结果空态可清除；卡片深链进入独立页。
- Button：导入代码复制与剪贴板一致；3 个示例、9 行 API、3 条键盘说明、2 个相关组件齐全。
- Select：Enter 展开、方向键移动、Enter 确认；选中「清单」后触发器与「当前值」同步；Escape 关闭并把焦点还给触发器。
- Tabs：进入标签组后焦点落在当前标签；方向键切换选中；禁用项 `tabIndex=-1` 且被跳过；面板随选中更新。
- 1440 / 390 无横向溢出，无 pageerror / console error。

当批修正：

1. Select「受控选择」预览显示当前值，代码省略 → 代码补齐同结构。
2. Tabs 三个示例的预览使用带样式的段落，代码为纯文本；受控示例预览显示当前标签，代码缺失 → 代码补齐面板结构与状态行。

记录但不在 P0 修：Select 的 filled 表面、Tabs 的 size、Button 的表单提交均无示例，归 P3 的变体 / 表单示例。

证据：`output/component-site-p0-review-2026-11-19/`（`review.json` 与三张 1440 截图）。复审结论：三页可独立完成选型、导入、选择与键盘操作；P0 转入 P1。

边界：复审由 AI 协作者执行，没有真实开发者首次上手的时间与困惑数据；后续如有开发者反馈，按同一路径补充。

## 已实施范围（P0 与 P1 首批）

P0 垂直切片与 P1 首批共用以下文件：

- `apps/docs/src/component-catalog.ts`：27 个组件的单一目录数据（id、名称、分组、摘要、状态、是否有独立页）；
- `apps/docs/src/CatalogPage.tsx`：搜索、分组、计数、空结果与卡片深链；
- `apps/docs/src/ComponentDetailPage.tsx`：导入、示例、API、键盘 / a11y、相关组件；
- `apps/docs/src/component-api.ts`：组件导入代码、相关组件与 API 回退行（原生 / Radix 继承属性、union 类型、`其余属性` 与未解构默认值）；P2 起 props 类型、说明与可解构默认值由 `packages/react/src` 生成到 `component-api.generated.ts`；
- `apps/docs/src/component-behavior.ts`：P3 起逐组件行为归属与 a11y 声明（键盘 / 焦点 / ARIA / 已知限制及来源），经同一生成器写入 `component-api.generated.ts`；
- `apps/docs/src/component-pilot-examples.tsx`：已迁移组件的示例（当前 6 × 3），预览使用真实共享组件；
- `apps/docs/src/CopyButton.tsx`：复制代码 / 导入片段；无第三方依赖；
- 路由：`#/catalog`、`#/components/<id>`；旧 `#/components` 保留；目录与详情页按路由懒加载，避免主包持续膨胀；
- 测试：`scripts/component-catalog.test.mjs` 与 `parseRoute` 新用例；`npm run test:catalog` 纳入 `check` 与 PR Checks 的 `web-build`。

## P1 迁移

2026-11-19 开始 P1，按分组迁移，已完成两批：

- 字段组首批：FormField / Input / Textarea；
- 字段与选择第二批：InputOTP / TagInput / RadioGroup / Checkbox / Switch；
- 浮层与反馈第三批：Dialog / Drawer / ConfirmDialog / Menu / Accordion；
- 反馈第四批：InlineAlert / Skeleton / Toast / Tooltip；
- 展示与导航第五批：IconButton / Avatar / Tag / StatusBadge / ToggleGroup / Pagination / TableOfContents；
- 页面原语第六批：Card / Section / Table。

每件 3 个示例、API 表、键盘 / a11y 与相关组件，目录卡片改为独立页；示例代码与预览使用同一结构。证据在 `output/component-site-p1-2026-11-19/`（`batch1.json` / `batch2.json`、`styles.json` / `batch2-dark.json` 与截图；1440 / 390、明暗、键盘交互、错误关联、无 pageerror）。

P1 完成：30 个条目均有独立页；目录新增「页面原语」分组并改为动态统计组件与页面原语数量。验证仍按 1440 / 390、明暗、键盘与无 pageerror 记录。

## P2 起步（2026-11-19）

- 类型：补齐并导出 `StatusBadgeProps`、`TooltipProps`，其余组件的 props 类型已导出。
- 契约：`scripts/generate-llms.mjs` 从组件目录与 `component-api.ts` 生成 `apps/docs/public/llms.txt`；`npm run llms:generate` 更新，`--check` 与 `test:catalog` 用例比较漂移，构建产物包含 `dist/llms.txt`。
- 下一步：把默认值与描述逐步迁入 JSDoc，再缩减手写契约（2026-11-21 已收尾，见下文）。

## P2 源码类型生成（2026-11-21）

- 类型：补齐 `InputProps`、`TextareaProps`、`SwitchProps`、`TabsProps`、`TabsContentProps` 并导出；`SwitchProps` 与 `SkeletonProps` 改用包含 ref 的 `ComponentProps`。
- 生成：`scripts/generate-api.mjs` 读取 `packages/react/src` 的导出 props 类型，与 `component-api.ts` 的描述 / 默认值合并，生成 `apps/docs/src/component-api.generated.ts`；组件页 API 表与 `llms.txt` 都消费该产物。
- 校验：每个 API 行必须能在源码类型中找到，源码中公开声明的 props 必须登记；`--check` 与 `test:catalog` 新增用例比对生成文件，随现有 `check` 与 PR `web-build` 生效。
- 未覆盖：union 类型（ToggleGroup / Accordion）保留手写类型文本；默认值与描述仍在契约数据；`ref` 等原生 / Radix 继承属性沿用契约文本，只做存在性校验。以上三项在 P2 收尾中处理：union 与继承属性按设计保留契约回退，自有 props 的描述与可解构默认值改为源码生成。

## P2 收尾：JSDoc 与默认值生成（2026-11-21）

- 默认值：`scripts/generate-api.mjs` 从组件函数参数（含 `const { ... } = props`）的解构默认值提取 `defaultValue` 写入生成物；契约中重复声明的默认值删除。源码无法解构的语义默认值（原生布尔缺省、Radix 默认与未解构 props）仍由契约回退。
- 描述：仓库自有 props 的中文说明迁入 `packages/react/src` 的 JSDoc，生成器优先读取 JSDoc；原生 / Radix 继承属性、union 类型（ToggleGroup / Accordion）、`其余属性` 行回退到契约文本。
- 契约：`component-api.ts` 只保留生成器无法推导的字段；`component-api-types.ts` 新增 `AuthoredApiRow` / `AuthoredPilotDoc`，生成器在自有 props 仍手写类型 / 必填 / 描述、重复声明默认值或缺少 JSDoc 时失败。
- 修正：函数签名（如 `onValueChange`、`onOpenChange`、`removeLabel`）此前被读成返回类型 `void` / 参数类型；现按方法签名生成完整函数类型。`FieldSurface` 从 `@radish-ui/react` 导出，供 API 表引用。
- 生成物差异：`component-api.generated.ts` 与 `llms.txt` 各 31 行差异（30 行 API 记录与 1 行来源说明），其中 23 行类型修正（17 行函数签名、6 行类型别名 `FieldSurface` / `StatusTone` / `CardTone` / `CardPadding`）、7 行描述去重（IconButton 复用 Button、Drawer 复用 Dialog、Card / Section / Table 英文 JSDoc 改中文）；默认值文本未变。
- 回退清单：93 行仍依赖契约回退，其中 68 行原生 / Radix 继承属性、16 行 union 类型、5 行 `其余属性`、4 行自有 props 的默认值；默认值回退共 11 项：`button.disabled`、`form-field.required`、`textarea.readOnly`、`select.disabled` / `select.required`、`tag-input.disabled`、`icon-button.disabled` / `icon-button.type`、`accordion.type` / `accordion.collapsible`、`toggle-group.type`。
- 验证：操作 / 字段 / 选择 / 反馈 / 导航 / 页面原语六组分别运行 `npm run api:generate`、`npm run llms:generate`、`npm run test:catalog`、`npm run check`、`npm run build` 通过；`test:catalog` 新增契约回退、源码默认值与函数类型断言（7 项）。未改运行时行为、未新增依赖；本轮实现已本地提交（`780cbcd`），未推送、未部署。

## P3 起步：行为归属与 a11y 声明（2026-11-21）

- 契约：新增 `apps/docs/src/component-behavior.ts`，逐组件声明键盘、焦点、ARIA 与已知限制，每条注明来源（浏览器原生 / Radix / RadishUI）；同一交互涉及多方时按来源拆条，例如 ToggleGroup 单选由 Radix 移动焦点、RadishUI 同步选中。
- 生成：`scripts/generate-api.mjs` 校验目录覆盖、主题 / 来源合法、文本非空与重复、每组件至少 3 条且含键盘声明；`component-api.generated.ts` 以 `behavior` 替换原 `keyboard` 字符串数组，组件页与 `llms.txt` 共用；API 契约中的 `keyboard` 数组删除，避免重复来源。
- 展示：组件页「键盘与可访问性」改为「主题 / 来源 / 说明」三列表格，窄屏提供可聚焦横向滚动容器；`llms.txt` 以 `键盘 · 浏览器原生：…` 形式输出，页面与 llms 文案同源。
- 校验：`test:catalog` 增至 8 项，新增覆盖断言（每组件 ≥3 条、至少 1 条键盘声明、主题 / 来源合法、三来源与四主题均出现）；生成文件与 `llms.txt` 漂移仍由现有用例拦截。
- 验证：`npm run api:generate`、`npm run llms:generate`、`npm run test:catalog`、`npm run check`、`npm run build` 通过；Chrome 157 浏览器探针覆盖 11 个代表组件 × 1440 / 390 与明暗，行为表内容与生成声明逐条一致，无 pageerror / console error / 页面级横向溢出；证据在忽略目录 `output/p3-behavior-2026-11-21/`。
- 边界：这些是声明而非可执行断言；DOM / 焦点 / `forced-colors` 断言仍需测试依赖或浏览器探针，按 P3 后续确认。变体 / 受控 / 表单 / 组合示例深度、代码高亮与主题 / 密度示例仍待 P3；本轮未改运行时行为、未新增依赖；实现已本地提交（`30d6ac6`），文档登记同批本地提交，未推送、未部署。

## P3 示例深度：六组示例补齐（2026-11-21）

- 第一批（P0 复审遗留）：Button 增「表单提交」（显式 `type="submit"`、`FormData` 回读、次要按钮不提交）；Select 增「filled 与尺寸」（`surface="filled"`，表单 md / 页面 chrome sm）；Tabs 增「尺寸与组合」（sm 卡片工具栏 + lg 页面分区，`size` 三档口径）。
- 第二批（操作 / 字段组）：IconButton 增「工具栏组合」（多个图标按钮 + 独立 label + Card 组合）；Input / Textarea 增「受控与长度」（`value` / `onChange` / `maxLength` + 实时计数）；InputOTP 增「位数与禁用」（`length={4}`、`disabled` 全格与隐藏字段）；TagInput 增「上限与错误」（去重与最多 3 个由调用方控制，达到上限由 FormField 展示 `error`）。
- 第三批（选择 / 反馈组）：RadioGroup 增「表单提交」（`name` 进入原生 FormData）；Checkbox 增「复选组校验」（调用方校验 + FormField error / alert）；Dialog 增「表单对话框」（对话框内表单、保存后关闭并回焦入口）；InlineAlert 增「带操作入口」（提示内操作按钮，错误文案仍保留在页面）。
- 第四批（导航 / 页面原语组）：Pagination 增「跳页与校验」（非法跳页提示 1–总页数，Enter 提交）；TableOfContents 增「与页面分区联动」（TableOfContents + Section，`currentId` 由页面驱动）；Card 增「带操作的卡片」（内容与操作组合，卡片不声明 role）；Table 增「行内状态与操作」（StatusBadge + IconButton 组合，操作按钮保留独立可访问名称）。
- 计数：30 个条目示例从 90 增至 106，P3-B 示例深度覆盖六组；P0 复审记录的三项缺口（Select filled、Tabs size、Button 表单提交）已关闭。
- 验证：`npm run type-check`、`npm run test:catalog`、`npm run check`、`npm run build` 通过；Chrome 157 定向验证新增示例交互（表单提交与清除、filled 选择、sm / lg 标签切换、工具栏具名按钮、受控计数与 maxLength 截断、OTP 位数与禁用、TagInput 上限错误、单选 / 复选表单提交、对话框内表单与回焦、提示内操作、非法 / 合法跳页、目录与分区联动、卡片操作、行内状态与操作），1440 / 390 与暗色无页面级横向溢出，无 pageerror / console error；证据在忽略目录 `output/p3-examples-2026-11-21/`。
- 边界：示例代码与预览同构由人工对照与浏览器交互验证，尚无自动化断言；代码高亮与每示例主题 / 密度仍待 P3，新增依赖需确认；本轮未新增依赖；第一批与第二批（P0 遗留、操作 / 字段组）实现已本地提交（`0572532`），第三批与第四批（选择 / 反馈、导航 / 页面原语组）实现已本地提交（`cca88d4`），文档登记同批本地提交，未推送、未部署。

<a id="contract-and-behavior-2026-11-18"></a>

## 契约与行为（2026-11-18）

2026-11-18 所有者确认三项增补：API 与行为声明的机器可读契约、逐组件行为归属，以及交互行为测试。P0 已按三页用法复审验收（[记录](#p0-usage-review-2026-11-19)）。

### 机器可读契约

- P2 以组件源码导出的 props 类型、JSDoc 和组件目录元数据为输入。P3 的行为归属与可访问性声明已落在 `apps/docs/src/component-behavior.ts`，记录键盘、焦点、ARIA 和已知限制及来源。
- 生成消费：组件页 API 表与行为声明、`llms.txt`（站点产物与未来发行包内文档目录共用同一份）与类型 / 完整性检查。沿用 token 管线的生成 + `--check` 范式，不手改生成物。
- `llms.txt` 只描述已实现能力与 import 路径，不承诺未发布的包名、CLI 或 registry；P4 发行前只随展示站产出，不写进 npm 包路径。
- 判定：结构可解析、覆盖全部导出、示例能按其中 import 运行；生成物与源码漂移由 `npm run check` 拦截。2026-11-19 已落地 `llms.txt` 生成与 `test:catalog` 漂移检查；2026-11-21 起组件页 API 表与 `llms.txt` 由源码 props 类型、JSDoc、解构默认值与契约回退数据生成；手写契约只保留原生 / Radix 继承属性、union 类型与无法解构的默认值。同日 P3 起步：30 个条目的行为归属与 a11y 声明经生成器校验后进入组件页与 `llms.txt`，组合行为按来源拆条。

### 行为归属

按具体行为登记来源，并与 [C-02 组件合同](react-workbench-components.md#组件合同) 对齐。同一交互涉及多方时，分别写明各自负责的步骤。

| 行为 | 来源与职责 |
| --- | --- |
| Button 设置 `disabled` 后退出 Tab 顺序 | 浏览器提供原生按钮的禁用行为。 |
| Checkbox 聚焦时按空格切换选中状态 | 浏览器处理原生复选框的键盘操作。 |
| 单选 ToggleGroup 响应方向键 | Radix 移动焦点，RadishUI 在可用项获得焦点时同步选中值。 |
| Button 进入 loading | RadishUI 保留焦点，设置 `aria-disabled` / `aria-busy` 并拦截重复激活。焦点环遵循 [DR-17](../design/design-rules.md#dr-17)。 |

用途：a11y 声明的依据、回归检查清单、Flutter 端语义对应，以及未来更换行为层时的迁移清单。P3 覆盖已迁移的全部组件；未迁移或没有真实页面承载的组件不加壳。

2026-11-21 起逐组件声明落在 `apps/docs/src/component-behavior.ts`：30 个条目共 138 条（键盘 53、焦点 15、ARIA 42、已知限制 28；浏览器原生 29、Radix 32、RadishUI 77），经 `scripts/generate-api.mjs` 校验后生成到组件页「键盘与可访问性」表与 `llms.txt`。上表保留为跨组件示例；逐组件完整清单以生成物为准。

### 交互行为测试

状态变化后的 `aria-selected`、`aria-pressed` 等属性可在 DOM 层断言。Tab 是否跳过禁用项、Escape 后焦点落在哪个控件、`forced-colors` 下能否看清焦点与选中项，都在浏览器中验证。目前仍用已有的浏览器探针和人工复核记录，注明环境、证据路径及未覆盖项。既有示例见[强制颜色与键盘复验](react-workbench-components.md#强制颜色与减少动效补验2026-11-17)。

现有探针仍是本地证据脚本：位于忽略目录 `output/`，依赖 npx 缓存的 Playwright 与本地 dev server，输出 JSON 而不是断言，也未纳入 `check`。要成为回归断言，先固化为入仓测试入口并确认测试依赖；在此之前只作一次性验证证据。新增测试依赖（Playwright / jsdom / happy-dom 等）由所有者确认。

### 与外部行为层的关系

2026-11-18 评估 Vercel Labs 的 UI SDK（beta；跨框架行为原语、随包文档与 Agent Bridge）后的结论：**不引入**。

- UI SDK 的 beta API 可能调整，支持范围限于 Web。RadishUI 已组合浏览器原生语义、Radix Primitives 与自有交互策略。引入第二套组件模型会增加依赖与发行成本。
- 可被 Agent 读取的文档、未来随包分发的路径和交互断言分别按本节的契约与验证计划推进。
- 重评触发点（任一出现再评估）：UI SDK 出 GA；补上非 Web 适配；家族产品开始用 Agent 操作界面；Radix 停止维护或行为层出现无法绕过的交付形态。
- 文章与官方来源见[本周开发记录](../devlogs/2026-W47.md#2026-11-18-契约与行为规划)。

## 验收口径

- 目录：27 个组件全部可搜索 / 分组；每个 id 可深链；无重复、无死链（未迁移项明确指向单页参考）。
- 已迁移页：导入、≥3 示例、API 表、键盘 / a11y、相关组件齐全；代码可复制；1440 / 390 与明暗无页面级横向溢出、无 pageerror。
- 类型：P2 起每个公开 props 有类型、默认值、必填与说明；API 表由源码生成并在 CI 检查漂移。
- 用法：P3 起每组件至少 3 个真实示例；示例代码与预览一致；不能只靠静态截图。
- 站点：搜索、深链、复制、键盘焦点可用；不因新增页面破坏 Workbench 与既有路由。
- 契约：P2 起 API 表与 `llms.txt` 由单一来源生成并有 `--check` 漂移门禁，行为归属在 P3 进入同一来源；手写镜像只作为过渡并在同批标注到期阶段。
- 行为：P3 组件页逐项注明浏览器原生、Radix 与 RadishUI 承担的行为（2026-11-21 起已进入契约生成）；键盘与焦点验收记录验证环境、证据来源及未覆盖项。
- 不以组件数量或文档页数量替代验收；每项必须有可复验证据。

## 边界与依赖

- 当前包仍是 private workspace；导入示例写工作区包名，不代表已发布。
- 新增开发依赖（代码高亮、API 生成器、Playwright / jsdom 等测试工具）需单独确认；P0 不新增依赖。
- 不引入 `@ui-sdk/*`、Agent Bridge 或 WebMCP 接入；外部行为层评估与重评触发点见[契约与行为](#contract-and-behavior-2026-11-18)。
- 产品仓只读；家族需求盘点不构成接入授权。
- 旧 `#/components` 与既有文档链接在 P1 前保持可用；迁移时再统一导航与重定向。
- 证据写入开发记录；实现与文档分别提交，按批次由所有者复审。
