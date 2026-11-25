# 组件站 1.0

状态：2026-11-17 所有者确认作为下一阶段；2026-11-19 完成 P0 三页用法复审并进入 P1，P1 同日完成：30 个条目（27 个组件与 Card / Section / Table 页面原语）均有独立页；2026-11-21 完成 P2 的源码类型、JSDoc 与默认值生成，手写契约只保留回退字段；同日 P3 起步：逐组件行为归属与 a11y 声明进入同一契约来源，示例深度覆盖六组（106 个示例），每示例支持主题 / 密度预览；2026-11-22 代码高亮经构建期生成落地，交互断言以 Playwright 入仓并进入 CI（新增开发依赖经所有者确认），P3 收口；同日按所有者确认的「调用方校验 + 共享 Form 编排」完成 P4 首项 Form 与字段校验，并在资源新建与文档编辑表单采用；同日完成 Drawer 底部编排（同组件方位扩展，不新增浮层）。2026-11-23 先做家族真实用量审计，按证据把 P4 下一项定为 DescriptionList（描述列表）并落地共享原语，替换工作台 3 处页面级 property-list；同日按所有者复审意见修订组件页布局（1184 内容宽、≥1100px 右侧目录、窄屏抽屉、章节深链），并完成 Safari / Firefox 定向复验；随后进入 P5，完成 `#/changelog` 变更记录页与 `#/icons` 图标参考页。2026-11-24 完成组件站 1.0 验收收口审计（32 页 × 1440 / 390 × 明暗共 128 次加载，无产品级差距），`test:interaction` 扩至 24 项并固化全量结构、390 溢出与暗色代表页检查；同日推进 P5-③ 站点搜索（`#/search`，侧栏与窄屏页头入口），交互断言增至 25 项；随后完成 P4-④ InputNumber（33 个条目 / 29 个组件，设置页每页条数接入资源库分页，偏好存储 v3），交互断言 28 项；同日再完成 P4-⑤ Empty（34 个条目 / 30 个组件，目录与资源空态采用），交互断言 29 项；Safari 27 / Firefox 159 对 P5 三页、InputNumber、Empty 与设置页 / 资源库完成 4 组组合定向复验（296 项 0 失败）。P2 外部采用与 P3 Flutter 暂缓。2026-11-18 按所有者确认增补机器可读契约、行为归属与交互行为测试评估，见[契约与行为](#contract-and-behavior-2026-11-18)。2026-11-25 完成 P5-④ 双语文档两批、旧单页参考退役与跨端证据后，按验收口径完成内部收口（[记录](#closeout-2026-11-25)）：P0–P5 已完成，组件状态 / 弃用未启用（等真实数据），Upload 等剩余候选转后续扩展。
主要归属：E：展示与页面范例（组件文档站）/ C：跨平台通用组件；协同 F：视觉基础、G：工程与交付。
需求输入：[家族组件需求盘点](family-component-demand.md)；既有组件合同见 [C-02](react-workbench-components.md)，页面范例见 [E-02](workbench-preview.md)。

## 目标

把当前的单页组件展示升级为可用的组件文档站，每个组件有独立页面、可查的 TypeScript API、可复制的用法示例、可搜索的目录，以及键盘 / 可访问性说明。先做深现有 27 个组件（P1 同时纳入 Card / Section / Table 页面原语），再按家族真实需求扩目录（P4 已加入 Form、DescriptionList、InputNumber 与 Empty，当前 34 个条目：30 个组件与 4 个页面原语），不以组件数量衡量完成度。P2 从同一来源生成组件页 API 表与 `llms.txt` 并检查漂移，P3 将逐组件行为归属与可访问性声明纳入该流程。

## 非目标

- 不发布 npm 包、不提供 CLI / registry、不做公开采用的安装承诺；这些属于 P4 发行范围，需单独授权。
- 不启动 Flutter、不恢复 P2 外部产品试点；两者等组件站 1.0 达标后另行决定。
- 不复制 shadcn/ui、Ant Design、Lucide 的内容、素材或实现；只参考信息架构与 API 表达方式。
- 不为没有页面 / 示例 / 测试的组件提前加壳；不引入第二套图标或字体策略。
- 不引入跨框架行为层或 Agent 运行时桥接（`@ui-sdk/*`、Agent Bridge / WebMCP）。重评条件见[契约与行为](#contract-and-behavior-2026-11-18)。

## 信息架构

```text
#/catalog                 组件目录：搜索、分组、状态、深链（旧 #/components 重定向至此）
#/components/<id>         独立组件页：导入、示例、API、键盘 / a11y、相关组件、本页目录
#/components/<id>/doc-api 章节深链（doc-import / doc-examples / doc-api / doc-keyboard / doc-related）
#/changelog             变更记录：内部版本、目录状态摘要与按日期倒序的变更条目
#/icons                 图标参考：展示站与示例实际使用的 lucide-react 图标、用途分组与搜索
#/search                站点搜索：页面、组件、图标与变更记录的统一索引
```

导航的“组件目录”指向 `#/catalog`；P1 迁移完成后全部条目都有独立页，旧 `#/components` 单页参考已于 2026-11-25 退役，访问时规范化为 `#/catalog`（旧链接仍可用），组件页仍用 `#/components/<id>` 与章节深链。

### 组件页模板

1. 标题、状态、摘要、返回目录；页面目录列出导入 / 示例 / API / 键盘与可访问性 / 相关组件，≥1100px 在右侧栏，窄屏为页头入口与半屏抽屉；
2. 导入：包路径与样式导入，可复制；明确当前为 private workspace；
3. 示例：至少 3 个，覆盖基础、变体 / 状态、组合 / 表单；每个示例有预览、代码、复制与主题 / 密度预览设置；
4. API：属性 / 类型 / 默认值 / 必填 / 说明；多部件组件带“组件”列；
5. 键盘与可访问性：主题（键盘 / 焦点 / ARIA / 已知限制）、来源（浏览器原生 / Radix / RadishUI）与说明；P3 起由 `component-behavior.ts` 生成。
6. 相关组件：只链接真实存在的目录项。

章节 id 固定为 `doc-import` / `doc-examples` / `doc-api` / `doc-keyboard` / `doc-related`，目录点击滚动到章节并写入地址（`#/components/<id>/doc-api`），刷新与前进后退据此恢复；滚动时高亮当前章节，读到页尾指向最后一节。布局与目录的实施记录见[组件页布局与目录](#component-page-layout-2026-11-23)。

## 阶段

| 阶段 | 交付 | 状态 |
| --- | --- | --- |
| **P0 垂直切片** | 目录页、搜索、Button / Select / Tabs 独立页、API 表、示例、复制、测试 | 已实现（`42019fe`），复审完成（2026-11-19） |
| **P1 迁移 27 个** | 现有组件全部进入模板；Card / Section / Table 页面原语一并纳入目录；单页参考退为“全部示例” | 已完成（30 个条目） |
| **P2 类型 / API 全量** | 导出缺失 props 类型；JSDoc / 默认值 / 事件 / ref；单一来源生成 API 表与 `llms.txt`，行为归属随 P3 进入同一来源；`--check` 漂移门禁；类型测试与完整性检查 | 已完成（2026-11-21）：类型、JSDoc 说明、解构默认值与事件签名由源码生成；原生 / Radix 继承属性、union 类型与未解构默认值保留契约回退 |
| **P3 用法深度** | 每组件 3+ 示例、变体 / 受控 / 表单 / 组合；代码高亮（新增依赖需确认）；每示例主题 / 密度；逐组件 a11y 与行为归属声明及对应断言（依赖待确认） | 已完成（2026-11-22）：行为归属与 a11y 声明进入契约生成；示例深度覆盖六组共 106 个示例；每示例主题 / 密度；代码高亮构建期生成；交互断言以 `test:interaction` 入仓并进入 CI。断言覆盖代表性行为，不等于逐条行为声明可执行（2026-11-23 共 148 条） |
| **P4 目录扩展** | 按[家族需求盘点](family-component-demand.md)排序；Form、Upload、InputNumber / Slider 等逐项确认 | 已完成已确认候选（2026-11-22 Form 与 Drawer 底部编排；2026-11-23 DescriptionList；2026-11-24 InputNumber 与 Empty）；Upload / Slider 等剩余候选缺真实承载或场景，转入后续扩展，不阻塞收口 |
| **P5 站点能力** | 版本 / 变更记录、状态与弃用、双语文档、图标参考、站点搜索索引；公开安装 / CLI / registry 属 P4 发行 | 已完成（2026-11-23 变更记录、图标参考；2026-11-24 站点搜索；2026-11-25 双语文档两批、旧单页退役与跨端证据）；组件状态 / 弃用未启用（等真实 preview / deprecated 数据）；公开安装 / CLI / registry 属 P4 发行 |

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

- `apps/docs/src/component-catalog.ts`：34 个条目（30 个组件与 4 个页面原语）的单一目录数据（id、名称、分组、摘要、状态、是否有独立页）；
- `apps/docs/src/CatalogPage.tsx`：搜索、分组、计数、空结果与卡片深链；
- `apps/docs/src/ComponentDetailPage.tsx`：导入、示例（含每示例主题 / 密度预览设置与代码高亮）、API、键盘 / a11y、相关组件、本页目录与章节深链；页面根与示例暴露 `data-component` / `data-example` 供交互断言稳定定位；
- `apps/docs/src/component-api.ts`：组件导入代码、相关组件与 API 回退行（原生 / Radix 继承属性、union 类型、`其余属性` 与未解构默认值）；P2 起 props 类型、说明与可解构默认值由 `packages/react/src` 生成到 `component-api.generated.ts`；
- `apps/docs/src/component-behavior.ts`：P3 起逐组件行为归属与 a11y 声明（键盘 / 焦点 / ARIA / 已知限制及来源），经同一生成器写入 `component-api.generated.ts`；
- `apps/docs/src/component-pilot-examples.tsx`：已迁移组件的示例（34 个条目共 119 个示例，含 P4 新增 Form、Drawer 底部编排、DescriptionList、InputNumber 与 Empty），预览使用真实共享组件；代码片段同时是高亮生成器的输入；
- `apps/docs/src/component-code.generated.ts`：P3 起由 `scripts/generate-code.mjs` 生成的逐条高亮 HTML（导入片段与示例），组件页消费；生成物入仓并由测试拦截漂移；
- `apps/docs/src/changelog.ts`：P5 起站点版本与变更记录的单一来源（中英条目、站内链接），由 `test:workbench` 校验版本一致、日期倒序与链接目标；
- `apps/docs/src/ChangelogPage.tsx`：`#/changelog` 变更记录页（版本卡、目录状态摘要、日期倒序条目），入口在侧栏「设计系统」与平台页 footer；
- `apps/docs/src/icon-reference.ts` 与 `IconsPage.tsx`：`#/icons` 图标参考的单一来源与页面（38 个实际使用图标、用途分组、搜索、复制导入），图标名与 lucide-react 导出一致性由 `test:workbench` 校验；
- `scripts/generate-search.mjs` 与 `apps/docs/src/site-search.generated.ts`：P5 起站点搜索索引的生成入口与生成物，从组件目录、图标参考、变更记录和生成器内的页面清单构建；`check:search` 与 `test:workbench` 拦漂移；
- `apps/docs/src/site-search.ts` 与 `SearchPage.tsx`：`#/search` 的匹配逻辑与页面（空查询显示 4 类计数入口，查询按页面 / 组件 / 图标 / 变更记录分组；侧栏与窄屏页头入口）；
- `apps/docs/src/App.tsx`：P5 的变更记录、图标参考与站点搜索页按路由懒加载，主入口不随新站点能力增长；
- `scripts/generate-code.mjs`：构建期高亮入口（`npm run code:generate` / `--check`），用 TypeScript AST 读取示例并用开发依赖 `shiki` 生成，不进入浏览器包；
- `apps/docs/src/CopyButton.tsx`：复制代码 / 导入片段；无第三方依赖；
- `playwright.config.mjs` 与 `tests/interaction.spec.mjs`：P3 起浏览器交互断言入口，用已安装的 Google Chrome 覆盖组件页键盘 / 焦点 / ARIA、强制颜色与页面冒烟；
- 路由：`#/catalog`、`#/components/<id>`；旧 `#/components` 已退役并规范化为 `#/catalog`；目录与详情页按路由懒加载，避免主包持续膨胀；
- 测试：`scripts/component-catalog.test.mjs` 与 `parseRoute` 新用例（当前 11 项，含生成物 / `llms.txt` / 高亮产物漂移、API 回退、行为覆盖、示例完整性与高亮文本一致性断言）；`npm run test:catalog` 纳入 `check` 与 PR Checks 的 `web-build`。

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
- 边界：这些是声明而非可执行断言；DOM / 焦点 / `forced-colors` 断言仍需测试依赖或浏览器探针，按 P3 后续确认。变体 / 受控 / 表单 / 组合示例深度、代码高亮与主题 / 密度示例随后同批完成（见下）；本轮未改运行时行为、未新增依赖；实现已本地提交（`30d6ac6`），文档登记同批本地提交，未推送、未部署。

## P3 示例深度：六组示例补齐（2026-11-21）

- 第一批（P0 复审遗留）：Button 增「表单提交」（显式 `type="submit"`、`FormData` 回读、次要按钮不提交）；Select 增「filled 与尺寸」（`surface="filled"`，表单 md / 页面 chrome sm）；Tabs 增「尺寸与组合」（sm 卡片工具栏 + lg 页面分区，`size` 三档口径）。
- 第二批（操作 / 字段组）：IconButton 增「工具栏组合」（多个图标按钮 + 独立 label + Card 组合）；Input / Textarea 增「受控与长度」（`value` / `onChange` / `maxLength` + 实时计数）；InputOTP 增「位数与禁用」（`length={4}`、`disabled` 全格与隐藏字段）；TagInput 增「上限与错误」（去重与最多 3 个由调用方控制，达到上限由 FormField 展示 `error`）。
- 第三批（选择 / 反馈组）：RadioGroup 增「表单提交」（`name` 进入原生 FormData）；Checkbox 增「复选组校验」（调用方校验 + FormField error / alert）；Dialog 增「表单对话框」（对话框内表单、保存后关闭并回焦入口）；InlineAlert 增「带操作入口」（提示内操作按钮，错误文案仍保留在页面）。
- 第四批（导航 / 页面原语组）：Pagination 增「跳页与校验」（非法跳页提示 1–总页数，Enter 提交）；TableOfContents 增「与页面分区联动」（TableOfContents + Section，`currentId` 由页面驱动）；Card 增「带操作的卡片」（内容与操作组合，卡片不声明 role）；Table 增「行内状态与操作」（StatusBadge + IconButton 组合，操作按钮保留独立可访问名称）。
- 计数：30 个条目示例从 90 增至 106，P3-B 示例深度覆盖六组；P0 复审记录的三项缺口（Select filled、Tabs size、Button 表单提交）已关闭。
- 验证：`npm run type-check`、`npm run test:catalog`、`npm run check`、`npm run build` 通过；Chrome 157 定向验证新增示例交互（表单提交与清除、filled 选择、sm / lg 标签切换、工具栏具名按钮、受控计数与 maxLength 截断、OTP 位数与禁用、TagInput 上限错误、单选 / 复选表单提交、对话框内表单与回焦、提示内操作、非法 / 合法跳页、目录与分区联动、卡片操作、行内状态与操作），1440 / 390 与暗色无页面级横向溢出，无 pageerror / console error；证据在忽略目录 `output/p3-examples-2026-11-21/`。
- 边界：示例代码与预览同构由人工对照与浏览器交互验证，尚无自动化断言；代码高亮与交互断言仍待 P3，新增依赖需确认（每示例主题 / 密度随后完成，见下节）；本轮未新增依赖；第一批与第二批（P0 遗留、操作 / 字段组）实现已本地提交（`0572532`），第三批与第四批（选择 / 反馈、导航 / 页面原语组）实现已本地提交（`cca88d4`），文档登记同批本地提交，未推送、未部署。

## P3-C 每示例主题 / 密度（2026-11-21）

- 预览设置：组件页每个示例新增「预览设置」工具栏，可选择主题（跟随站点 / 明 / 暗）与密度（跟随站点 / 紧凑 / 标准 / 宽松）；默认跟随站点，切换只作用于该示例预览，不影响站点偏好。
- 主题：预览容器使用 `data-rd-theme`，复用 token 的明暗变量作用域并设置 `color-scheme`；站点明暗与预览明暗可交叉验证。
- 密度：预览容器使用 `data-preview-density` 与作用域内的 `--rd-control-height`、`.rd-table`、`.rd-section--sm` 覆盖；桌面与移动分别沿用站点 30 / 34 / 38 与 38 / 42 / 46 的口径。
- 修正：示例预览状态按组件 id 重置（列表 `key` 含组件 id），预览设置不跨组件页残留；`.doc-example` 网格列改为 `minmax(0, 1fr)`，390 下工具栏与预览不再溢出，代码块保持内部滚动。
- 校验：`test:catalog` 增至 9 项，新增示例完整性断言（每个目录条目 ≥3 个示例、id 唯一、标题 / 说明 / 代码 / 预览齐全，使用 TSX AST 解析），无新增依赖。
- 验证：`npm run type-check`、`npm run test:catalog`、`npm run check`、`npm run build` 通过；Chrome 157 探针覆盖 1440 / 390、站点明暗交叉与全部 30 个组件页（无 pageerror、无页面级横向溢出、预览选择器在容器内），并验证主题 / 密度切换改变预览计算样式与控件高度；证据在忽略目录 `output/p3-preview-controls-2026-11-21/`。
- 边界：代码高亮与 DOM / 焦点 / `forced-colors` 断言仍待 P3，均涉及新增依赖，需所有者确认；本轮未新增依赖；实现已本地提交（`4b020dc`），文档登记同批本地提交，未推送、未部署。

<a id="p3-code-highlight-2026-11-22"></a>

## P3-D 代码高亮（2026-11-22）

- 范围：组件页的导入片段与全部示例代码块改为构建期语法高亮；不新增运行时依赖、不改共享组件、token 或路由；旧 `#/components` 单页参考保持纯文本（P1 后待退场的过渡页）。
- 依赖：新增开发依赖 `shiki@4.6.0`，仅构建期使用，不进入浏览器包；经所有者 2026-11-22 确认。
- 生成：`scripts/generate-code.mjs` 用 TypeScript AST 读取 `component-pilot-examples.tsx` 的示例（预览为 JSX，Node 不能直接导入），合并 API 契约里的导入代码，按自定义主题的 token 角色生成 HTML 到 `apps/docs/src/component-code.generated.ts`；`npm run code:generate` 更新，`--check` 与 `test:catalog` 拦截漂移。生成器同时校验覆盖、示例键唯一，并逐条确认高亮后的可见文本与源码完全一致（含空白与换行）。
- 配色：生成器只声明 token 角色（关键字 / 标签、字符串、注释），`component-site.css` 把角色映射到现有语义 token（`text-action`、`state-success`、`text-secondary`），明暗随站点主题；不新增 token、不引入第二套配色。当前示例没有注释，注释角色保留给后续代码。
- 渲染：组件页 `DocCode` 渲染生成的高亮 HTML，复制仍取原始纯文本；生成物只含 `span` 标记，页面不接收外部输入。
- 验证：`npm run code:generate --check`、`npm run test:catalog`（11 项）、`npm run check`、`npm run build` 通过；Chrome 157 探针覆盖 30 个组件页 × 1440 / 390 与明暗，464 项检查 0 失败——高亮文本与源码逐字一致、每个代码块都有 token、无 pageerror / console error、无页面级横向溢出；明暗对比度（关键字 5.08 / 7.33、字符串 4.59 / 7.94、标签 5.08 / 7.33）均 ≥ 4.5，复制为纯文本、代码容器可 Tab 聚焦且有焦点环、强制颜色下文本保留，旧 `#/components` 仍可渲染。证据在忽略目录 `output/p3-highlight-2026-11-22/`。
- 体积：`ComponentDetailPage` 懒加载分块 141 KiB → 226 KiB（gzip 42.24 kB），只影响组件页；主入口分块未变。
- 边界：旧单页参考未接入高亮；未重新做 Safari / Firefox、真实屏幕阅读器复验；配色待所有者视觉复审。实现 `3a6fd34` 与文档登记 `5e6321d` 已推送 `origin/dev`，手动 PR Checks run `44980341589` 通过；未部署。

<a id="p3-interaction-2026-11-22"></a>

## P3-E 交互断言（2026-11-22）

- 范围：把组件页代表性键盘、焦点、ARIA 与强制颜色行为固化为入仓浏览器断言，补上 P3 最后一项；不改共享组件、token、路由与示例内容，只给组件页加稳定测试定位属性（`data-component` / `data-example`）。
- 依赖：新增开发依赖 `@playwright/test@1.65.1`，经所有者确认；使用已安装的 Google Chrome（`channel: 'chrome'`），不下载或缓存浏览器二进制，仓库与 CI 缓存都不新增浏览器产物。
- 入口：`npm run test:interaction` 先构建展示站，再由 Playwright 配置启动预览服务器并执行 `tests/interaction.spec.mjs`；CI 的 `Web Build` 在构建步骤后执行同一条命令（依赖 runner 预装 Chrome）。`check-repo` 的工作流合同已登记该步骤，移除会让仓库检查失败。
- 用例（29 项，2026-11-24 更新）：Button loading 的 `aria-busy` / `aria-disabled`、焦点保留与 disabled；Tabs 方向键切换并跳过禁用项；Select 键盘选择、受控值同步与 Escape 回焦；ToggleGroup 单选方向键同步选中；Dialog 初始焦点与 Escape 回焦；Checkbox / Switch 空格切换；复制按钮取纯文本；强制颜色下分页当前页与标签选中保留系统色轮廓；34 个组件页 1440 冒烟（导入、示例 ≥3、API ≥2 行、行为表 ≥3 行、章节、目录、复制按钮、相关组件、代码块高亮、无 pageerror / 页面级横向溢出）；34 个组件页 390 无页面级横向溢出；暗色代表页（按钮 / 表格 / DescriptionList、资源库、变更记录、图标参考、站点搜索）在 1440 / 390 应用暗色主题且无溢出；站点搜索按类型分组、结果跳转、输入框 Tab 与 390 无溢出；2026-11-24 增补 InputNumber 方向键 / 失焦钳制 / Tab 顺序、设置页每页条数保存与资源库分页消费、v2→v3 偏好迁移、Empty 组件页与目录 / 资源空态采用；2026-11-22 增补 Form 提交校验 / 焦点顺序、工作台资源新建 / 文档编辑两个真实表单，以及 Drawer 底部编排的回焦、工作台 390 资源详情与 900 侧向抽屉断点；2026-11-23 增补 DescriptionList 原生 dl 语义与工作台资源详情采用、组件页目录跳转 / 章节深链与窄屏目录抽屉、变更记录页版本与条目、图标参考页搜索与复制四项。
- 验证：2026-11-22 首次 22 项通过（Chrome 157，含预设服务器与 CI 模式自启服务器两处入口验证），实现 `62fd350` 与文档登记 `95d9a03` 已推送 `origin/dev`，手动 PR Checks run `44991120585` 的 Web Build 在 Ubuntu runner 上执行同一入口并通过（使用 runner 预装 Chrome）；2026-11-24 扩展后 `npm run test:interaction` 29 项通过（33.1 秒）。`npm run check`、`npm run build` 通过。未部署。
- 边界：断言覆盖代表性行为，不等同逐条行为声明可执行（2026-11-23 共 148 条）；只跑 Chrome，`forced-colors` 为浏览器模拟而非 Windows 真实高对比；Safari / Firefox、真实屏幕阅读器与实体设备仍未覆盖。视觉配色仍待所有者复审。

<a id="p4-form-2026-11-22"></a>

## P4-① Form 与字段校验（2026-11-22）

- 范围：P4 目录扩展首项。新增共享 `Form`，把表单提交编排从三个真实表单的重复代码收进组件；不引入规则 DSL 或第二个表单框架，不改 token、路由与其他共享组件。
- 决策（所有者 2026-11-22 确认）：校验责任留在调用方。规则、错误状态与 FormField `error` 由页面维护；`Form` 接管原生提交（noValidate）、调用 `validate()` 取得以字段 id 为键的错误、只有全部通过才调用 `onValidSubmit`、未通过时回调 `onInvalid` 并把焦点移到 DOM 顺序中的第一个错误字段。
- 采用：资源新建弹窗与文档编辑表单改用共享 `Form`，保留失焦校验、输入清除错误、错误文案、保存 / 冲突 / 容量逻辑与 Dialog 初始焦点；三个真实表单中设置页只有保存反馈、无字段校验，未迁移。
- 组件站：Form 加入 fields 分组（31 个条目 / 28 个组件）；组件页 3 个示例覆盖提交前校验、首个错误字段聚焦与 `validate` / `onInvalid` / `onValidSubmit` 事件；API 表、行为声明、`llms.txt` 与代码高亮均由原生成链路产出。
- 校验：`test:catalog` 11 项（计数与 pilot 顺序同时更新）、`test:interaction` 14 项（新增 Form 两项、工作台资源新建与文档编辑各一项）、`check`、`build` 通过；Chrome 157 探针覆盖 Form 页 1440 明暗 / 390 与两个工作台表单错误态，7 项检查 0 失败，证据在忽略目录 `output/p4-form-2026-11-22/`。
- 边界：不包含规则 DSL、异步校验与字段数组；错误只有焦点定位与 FormField alert，没有单独的可见汇总块；Safari / Firefox 未复验；两个工作台表单只换提交编排、不改视觉，仍待所有者复审。实现 `2a053c1` 与文档登记 `a4f1223` 已推送 `origin/dev`，手动 PR Checks run `45017363740` 的 Web Build 执行 `npm run test:interaction`（14 项）通过；未部署。

<a id="p4-drawer-2026-11-22"></a>

## P4-② Drawer 底部编排（2026-11-22）

- 范围：P4 第 4 项「BottomSheet 编排」——优先扩展现有 Drawer 的方位能力，不新增第二套浮层；同时收掉工作台资源详情的 `.rd-drawer.resource-sheet` 页面级覆盖。
- API 与样式：`DrawerProps.side?: 'right' | 'bottom'`（默认 right）；底部编排复用同一 Dialog 合同（角色、Escape、焦点约束、回焦、header / body / footer 结构），只改方位；共享 CSS 负责占满宽度、贴底、顶部圆角（`--rd-radius-panel`）、`env(safe-area-inset-bottom)` 与 86dvh 内滚动，481px 起居中 560px。
- 采用：资源库窄屏资源详情改用 `<Drawer side="bottom">`；删除 `.rd-drawer.resource-sheet` 覆盖、页面 `resource-sheet` 类名与 `rd-sheet-in` 页面动画。
- 组件站：Drawer 页新增「底部编排」示例（共 4 个示例）；API 表、行为声明、`llms.txt` 与代码高亮生成物同批更新。
- 校验：`test:interaction` 17 项（新增组件页底部抽屉、工作台 390 资源详情与 800–1099 侧向抽屉断点）、`check`、`build` 通过；Chrome 157 探针 12 项检查 0 失败，覆盖 390 明暗、1440 居中底部面板与 1200 侧向抽屉不变，证据在忽略目录 `output/p4-drawer-2026-11-22/`。
- 边界：不包含拖拽把手 / 下滑关闭 / 半展开状态；圆角由页面 20px 硬编码改为语义 token 16px，视觉变化待所有者复审；Safari / Firefox 未复验。实现 `2693e81` 与文档登记 `3087220` 已推送 `origin/dev`，手动 PR Checks run `45025132513` 的 Web Build 执行 `npm run test:interaction`（16 项）通过；收尾把 800–1099 断点纳入断言后为 17 项。未部署。

<a id="p4-description-list-2026-11-23"></a>

## P4-③ DescriptionList 描述列表（2026-11-23）

- 起因：P4 剩余候选（Upload、InputNumber / Slider、Progress / Steps 等）都缺少真实页面承载。按[当前规划](../planning/current.md)第 8 项先做家族真实用量审计：只读扫描 7 个产品仓的 JSX 开标签，结论是 console 有 4 个详情页在用 AntD Descriptions，而本站资源详情、文档属性、版本弹窗已有 3 处页面级 `<dl class="property-list">`（共 9 个 label / value）——Descriptions 的「有真实流程或页面时再做」条件已满足。方法与数据见[家族组件需求盘点](family-component-demand.md#2026-11-23-复核p4-下一项的真实用量与承载)，证据在忽略目录 `output/family-usage-audit-2026-11-23/`。
- 范围：新增共享 `DescriptionList`（页面原语），渲染原生 `<dl>`；API 为 `items: readonly { label, value }[]` 与原生 `dl` 属性透传。行式窄栏排版：标签在左、值在右、长值换行、数字等宽；不含多列 / bordered / 折叠等无承载变体，值需要可操作时由调用方组合按钮或链接。
- 采用：资源详情（侧栏与底部抽屉）、文档属性、版本弹窗改用共享组件，删除页面级 `.property-list` 规则与标记；资源详情的顶部分隔线与内边距仍由页面组合层提供。
- 组件站：DescriptionList 进入页面原语分组（32 个条目：28 个组件与 4 个页面原语），3 个示例覆盖基础元数据、状态 / 标签值、长值与窄栏；`scripts/generate-api.mjs` 的 `typeMap` 增加 `DescriptionListProps`，API 表、行为声明、`llms.txt` 与代码高亮生成物同批更新。
- 视觉：抽取前后用同一 Chrome 对 4 个真实位置（资源详情侧栏 / 底部抽屉、文档属性、版本弹窗）× 1440 / 390 × 明暗截图逐像素比较，8 张全部一致；几何与计算样式（12px 字号、12px 行距、标签次级色、值右对齐与等宽数字）无差异。
- 校验：`npm run test:catalog`（11 项，计数、pilot 顺序与源码类型 / 必填 / JSDoc 断言同步更新）、`npm run test:interaction`（22 项，新增 DescriptionList 原生 dl 语义与工作台资源详情采用、组件页目录两项、变更记录页与图标参考页各一项）、`npm run check`、`npm run build` 通过；Chrome 157 探针覆盖组件页 1440 明暗 / 390，无 pageerror 与页面级横向溢出，3 个示例的 dt / dd 齐全、行为表 5 行、API 3 行、4 个代码块均有高亮，证据在忽略目录 `output/p4-description-list-2026-11-23/`。
- 边界：只有行式窄栏一种排版；`label` 与 `value` 都必填；不做多列、bordered、可折叠或键盘交互（纯展示，值中的链接与按钮按 DOM 顺序聚焦）。Safari / Firefox、真实屏幕阅读器与实体设备未复验。实现与文档本地提交，未推送、未部署。

<a id="component-page-layout-2026-11-23"></a>

## 组件页布局与目录（2026-11-23）

- 起因：所有者复审 DescriptionList 页时指出组件独立页「文章两侧间距太大、没有目录」。原 `.component-doc` 以 960px 居中，1440 下正文两侧各留约 128px，且页面没有目录，与文档页（1184 内容宽 + 右侧目录）不一致。
- 布局：内容页统一 1184px；≥1100px 两列（正文 + 右侧目录 Card，`clamp(220px, 26%, 360px)`、24px 间距），1440 下正文 852 / 目录 308、内容区距页边 16px；<1100px 单列，正文占满内容宽，目录收进页头图标入口与右侧半屏抽屉（与文档页同一交互）。断点取 1100 是因为再窄的正文放不下示例代码与 API 表。
- 目录：使用共享 `TableOfContents`，条目为导入 / 示例 / API / 键盘与可访问性 / 相关组件；滚动高亮当前章节，读到页尾时指向最后一节；点击滚动到章节并把章节 id 写入地址（如 `#/components/description-list/doc-api`），刷新、前进后退与分享可恢复；窄屏抽屉点击后关闭并把焦点移到章节标题。路由只接受 `doc-*` 片段，其他片段按普通组件页处理。
- 校验：`npm run check`、`npm run build`、`npm run test:interaction`（22 项，新增桌面目录跳转 + 深链恢复、窄屏目录抽屉、变更记录页与图标参考页四项）通过；Chrome 157 探针覆盖 32 个组件页 × 1440 明暗 / 1024 / 390：1440 容器 1184、正文 852、目录 5 项，1024 单列正文 768，390 单列 366 且页头目录入口可见，均无页面级横向溢出与 pageerror；点击与深链停靠目标章节，页尾当前项为最后一节；证据在忽略目录 `output/component-page-outline-2026-11-23/`。
- 边界：目录只列页面级章节，不展开每个示例；<1100px 不显示常驻目录；Safari / Firefox、真实屏幕阅读器与实体设备未复验；未改共享组件、token、数据与文档页。实现与文档本地提交，未推送、未部署。

<a id="component-page-cross-browser-2026-11-23"></a>

## Safari / Firefox 定向复验（2026-11-23）

- 范围：本轮新组件页模板（1184 内容宽、右侧目录、章节深链、1099 断点）与 DescriptionList 的采用位置（资源详情 / 底部抽屉 / 文档属性），加新建资源表单校验的跨浏览器回归；不改代码。
- 环境：macOS 27.0.1；Safari 27.0.1（safaridriver，WebDriver BiDi + W3C HTTP）；Firefox 159.0.1（headless，BiDi）。站点为本地构建产物 + preview，经 fixture 代理暴露 QA 页；Safari 窄视口用 390×844 iframe 固定（沿用既往方法）；Firefox 因工作区沙箱阻止内容进程嵌套 sandbox，QA 实例以 `MOZ_DISABLE_CONTENT_SANDBOX=1 MOZ_DISABLE_GMP_SANDBOX=1 MOZ_REMOTE_ALLOW_SYSTEM_ACCESS=1` 启动（仅 127.0.0.1 QA，无仓库 / 系统配置改动）。
- 组合：1440×900 明暗、1024×800 明、390×844 明暗，两个浏览器执行同一套断言。结果：各 5 组全部通过（0 失败）——1440 内容 1184 / 正文 852 / 目录 308 且 5 项；1024 单列 768、目录收进页头入口；390 单列 366、抽屉打开 / 跳转 / 关闭；目录点击与深链恢复章节；页尾当前项为「相关组件」；资源详情 / 底部抽屉 / 文档属性使用 DescriptionList（4 / 4 / 3 组）；新建资源空提交提示与首错聚焦；无页面级横向溢出、交互期 window error 0。
- 边界：Safari 驱动不提供加载期页面异常事件，加载期日志仍未覆盖；未测真实屏幕阅读器（VoiceOver / NVDA）、Windows 真实高对比、实体设备与真实 200% 整页缩放；headless Firefox 与 iframe 窄视口不替代实体设备。证据在忽略目录 `output/component-page-cross-browser-2026-11-23/`（`audit.mjs`、两份 report JSON 与截图）。

<a id="p5-changelog-2026-11-23"></a>

## P5 版本与变更记录（2026-11-23）

- 范围：P5 站点能力第一项。新增 `#/changelog` 变更记录页与侧栏入口，展示当前内部版本、目录状态摘要与按日期倒序的变更条目；不发布 npm、不创建 tag / Release，组件状态与弃用机制、双语文档、图标参考与站点搜索索引仍归 P5 其余项。
- 数据：`apps/docs/src/changelog.ts` 为唯一来源，含 `siteVersion` 与 5 条日期条目（2026-11-17 至 11-23，来源 `docs/devlogs/`）；条目中英双语，组件相关条目直接链到组件页或章节深链。展示站版本与根 `package.json` 一致、日期倒序且唯一、站内链接目标存在，均由 `test:workbench` 校验。
- 页面：`ChangelogPage` 复用 PageHeader / Card / Tag / StatusBadge，内容页保持 1184 宽；版本卡展示 `v26.11.1`、内部预览未发布与目录状态摘要（32 个条目：28 个组件与 4 个页面原语，全部内部稳定）；页面底部写明版本格式与发行任务边界。侧栏「设计系统」新增入口，平台页 footer 的版本号也链接到本页；窄屏底部导航未加入口（与平台页、视觉基础一致，均走侧栏入口），可直接用 `#/changelog` 路由访问。
- 校验：`npm run check`、`npm run build`、`npm run test:interaction`（22 项，新增变更记录页与图标参考页各一项）通过；Chrome 157 探针覆盖 1440 / 390 × 明暗：页面 1184 / 366、5 条条目、8 个站内链接、版本 `v26.11.1`、无横向溢出与 pageerror；从条目点击进入 DescriptionList 的 API 深链正常。证据在忽略目录 `output/p5-changelog-2026-11-23/`。
- 边界：只展示内部预览变更，不构成发布记录；未做组件状态 / 弃用徽标、双语文档与站点搜索索引；窄屏底部导航未加入口；未推送、未部署。实现与文档本地提交。

<a id="p5-icons-2026-11-23"></a>

### P5-② 图标参考（2026-11-23）

- 范围：P5 站点能力第二项。新增 `#/icons` 图标参考页与侧栏「设计系统」入口、平台页 footer 链接；图标继续沿用 lucide-react，不引入第二套图标依赖，不做图标上传或自定义图标集。
- 数据：`apps/docs/src/icon-reference.ts` 收录展示站与组件示例实际使用的 38 个图标（导航 / 操作 / 状态 / 内容与入口 / 装饰与提示五组），每项含 lucide 导出名、中英用途；`test:workbench` 校验名称唯一、分组合法、中英文案非空，且导入的图标组件与 lucide-react 导出逐一相等（防止改名或拼写漂移）。
- 页面：搜索按名称 / 用途过滤并给出结果计数与空态；每个图标展示 20px 渲染、导出名、中英用途与「复制导入」按钮（复制 `import { Name } from 'lucide-react';`）；页面底部注明装饰图标 `aria-hidden`、图标按钮必须提供可访问名称、状态不能只靠图标。变更记录页与图标参考页按路由懒加载，主入口继续不随站点能力增长。
- 校验：`npm run check`、`npm run build`（无 500kB 构建警告）、`npm run test:interaction`（22 项，新增图标参考页搜索 / 复制 / 390 无溢出）通过；Chrome 157 探针覆盖 1440 / 390 × 明暗：页面 1184 / 366、38 张图标卡、5 个分组、搜索 arrow 命中 3 项、无横向溢出与 pageerror，证据在忽略目录 `output/p5-icons-2026-11-23/`。
- 边界：只收录展示站与示例实际用到的图标，不承诺覆盖 lucide-react 全量；未做图标分类的自动生成或使用方统计；窄屏底部导航未加入口（可用 `#/icons` 路由访问）；未推送、未部署。实现与文档本地提交。

<a id="p5-followups-2026-11-23"></a>

### P5 后续项与版本切换（2026-11-23 登记）

- 剩余 P5 项：组件状态 / 弃用徽标要等真实的 preview / deprecated 组件出现后再做，避免先造空壳状态；双语文档首批与第二批已于 2026-11-25 完成（目录摘要 34、示例标题 / 说明 119 × 2、API 说明 282 行、行为声明 158 条与搜索语言化），`llms.txt` 与示例代码内容是否纳入仍需另行确认；旧单页参考已退役。站点搜索索引已于 2026-11-24 完成为 `#/search`：生成索引覆盖页面 / 组件 / 图标 / 变更记录，侧栏与窄屏页头提供入口，目录搜索保留为组件筛选（见下节）。
- 版本切换与内容差异（未来规划，不实现）：正式发行后，站点需要按版本展示**不同内容**——组件 API 表、行为 / a11y 声明、示例、变更记录与版本信息都会随版本变化。至少涉及：版本选择器或版本化路由（如 `#/v26.11/...`）、默认版本与旧版本保留期限、跨版本对比、已移除 / 弃用 API 的提示，以及 `llms.txt` 等文档产物按版本生成。
- 当前判断：展示站仍是 private workspace 内部预览，没有正式发行版本与 tag，也没有可区分的历史版本内容；本轮只登记规划，不先做版本切换 UI，也不伪造历史版本内容。具体形态在 P4 发行授权、版本策略与首个正式 tag 确认后另开专题评估。

<a id="p5-search-2026-11-24"></a>

### P5-③ 站点搜索（2026-11-24）

- 范围：新增 `#/search` 站点搜索页与统一索引，覆盖 10 个站点页面、34 个组件、38 个图标与 6 条变更记录（88 个条目）；侧栏「设计系统」入口，<800px 由窄屏页头搜索图标进入。目录页搜索保留为组件筛选，不新增第二个全局入口。
- 索引：`scripts/generate-search.mjs` 从 `component-catalog.ts`、`icon-reference.ts`、`changelog.ts` 与生成器内的页面清单构建 `apps/docs/src/site-search.generated.ts`；`check:search` 与 `test:workbench` 拦生成物漂移。匹配逻辑在 `site-search.ts`：空格分词后全部命中，标题优先；拉丁词按词边界匹配（避免「arrow」命中「narrow」），中文按子串，组件补「按钮 / 表单 / 校验」等显式别名。
- 页面：`SearchPage` 复用 PageHeader / Input；空查询显示四类计数与入口，查询按类型分组结果（标题、摘要、作用域），变更记录命中时优先展示命中的正文条目；结果计数 `role="status"`，空态、390 与明暗可用。
- 采用与边界：只索引静态站点内容，不索引本地资源、文档正文或示例代码；结果链到所属页面 / 组件页 / 图标页 / 变更记录页，不做结果级深链，也不把搜索词写入地址。
- 校验：`npm run check:search`、`npm run test:workbench`（17 项，新增索引覆盖、生成漂移与匹配断言）、`npm run test:interaction`（29 项，新增搜索分组、跳转、键盘与 390 溢出）、`npm run check`、`npm run build` 通过；`SearchPage` 懒加载分块 45.03 kB / gzip 11.53 kB，主入口 455.37 kB，无构建警告。Chrome 1440 / 390 × 明暗探针：`button` 3 个结果 / 2 组、`arrow` 命中 3 个图标与 1 条变更记录、空态与表单结果正常、变更记录 6 条、无横向溢出与 pageerror，证据在忽略目录 `output/p5-search-2026-11-24/`。
- 边界：未做 URL 查询持久化、结果高亮、拼音 / 模糊匹配与跨本地数据索引；窄屏底栏未加入口（页头图标可用）；真实屏幕阅读器未复验。

<a id="p5-bilingual-2026-11-25"></a>

### P5-④ 双语文档（2026-11-25）

- 范围：按所有者确认的首批范围，为组件目录摘要（34）与 119 个示例的标题 / 说明补齐英文，并让目录、组件页按站点语言切换展示；同批把站点搜索的组件说明与匹配语言化。不翻译示例代码与预览中的演示文案、工作台合成数据；API 说明与行为声明的英文在同日第二批完成（见下一条）。
- 数据与维护：`ComponentEntry` 增加 `summaryEn`，`PilotExample` 增加 `titleEn` / `descriptionEn`，与中文文案同源维护（沿用 icon-reference / changelog 的 zh / en 模式）；`scripts/generate-code.mjs` 读取示例时要求四个文案字段齐全（缺失即让 `code:generate --check` 失败）；`test:catalog` 新增英文覆盖断言（34 个摘要 + 119 个示例 × 2，英文无中文、标题与中文不同），`test:workbench` 校验英文搜索说明无中文。目录搜索同时匹配中英摘要与分组，保留跨语言召回。
- 站点：`CatalogPage` / `ComponentDetailPage` 接收 `locale`，分组标签、摘要、示例标题 / 说明、预览可访问名称与复制标签按语言取值；`CopyButton` 的可见文案与「已复制」播报也按语言切换（组件页与图标页共用）。`SearchPage` 接收 `locale`，`searchSite` 只匹配当前语言的标题 / 说明 / 正文，`keywords` 中的双语别名保留跨语言命中（如英文下搜「按钮」仍命中 Button）。
- 索引：`generate-search.mjs` 的组件说明改用英文摘要；索引条目为 89（新增 11-25 变更记录 1 条），`check:search` 与 `test:workbench` 拦漂移。
- 第二批（同日）：API 说明 282 行英文集中在 `apps/docs/src/component-api-en.ts`（按组件 id 与行键 `Prop` / `Part.Prop` 维护），行为声明 158 条在同一 `component-behavior.ts` 条目内增加 `textEn`；`generate-api.mjs` 校验英文与生成行一一对应、非空且无中文，行为主题 / 来源标签改为 zh / en 双语。组件页 API 表与键盘 / 可访问性表按语言显示说明与标签；`llms.txt` 仍只输出中文。
- 验证：`npm run check`（`test:catalog` 13 项、`test:workbench` 17 项）、`npm run build`（主入口 459.68 kB / gzip 143.62 kB、组件页懒加载分块 318.65 kB / gzip 65.00 kB，无 500 kB 警告）、`npm run test:interaction` 30 项通过（英文语言下目录、组件页、搜索、复制按钮、API / 行为表与 390 溢出）。Chrome 157 探针 8 组（1440 / 390 × 明暗 × 中英）0 问题：英文目录 34 条摘要与分组、34 个组件页摘要、119 个示例标题 / 说明、282 行 API 说明、158 条行为声明、主题 / 来源标签与复制按钮无中文残留，中文模式回归不变，无 pageerror 与页面级横向溢出；证据在忽略目录 `output/p5-bilingual-2026-11-25/` 与 `output/p5-bilingual-batch2-2026-11-25/`。
- 旧入口退役（同日）：删除旧单页参考组件与配套样式，`#/components` 规范化为 `#/catalog`、移除重复的「全部示例」入口；站点搜索页面索引由 10 个减为 9 个、总条目 89 → 88，主入口 459.68 → 426.26 kB（gzip 143.62 → 133.69 kB）。
- 边界：`llms.txt`、示例代码与预览演示文案、工作台合成数据仍为中文（后续另行确认）；旧单页参考已退役；Safari / Firefox 的英文模式已在 2026-11-25 定向复验（[跨端证据](#cross-browser-2026-11-25)），真实辅助技术仍未覆盖。

<a id="p4-input-number-2026-11-24"></a>

### P4-④ InputNumber（2026-11-24）

- 范围：按所有者确认新增共享 InputNumber，以设置页「资源库每页条数」为首个真实承载，并让资源库分页消费；不新增 Slider / Upload、其他设置项或依赖，不改 token。
- API：受控 `value: number | null` + `onValueChange`；`min` / `max` / `step`、`surface`、`controls` 与上下按钮可访问名称；输入框使用 `role="spinbutton"`，方向键按 step 调整，失焦时把空值还原为最近有效值、越界值钳制；FormField 自动关联标签 / 说明 / 错误。
- 采用：设置页「外观」页签新增 5–50、步进 5 的每页条数；资源库初始 pageSize 读取偏好，分页仍可临时调整；偏好存储从 v2 升到 v3，旧 v2 数据补默认 20，不丢原外观。
- 组件站：InputNumber 加入时 33 个条目 / 29 个组件（Empty 后当前 34/30），3 个示例覆盖基础步进、精度与边界、表单字段 / 只读；API 16 行、行为 6 条；API / `llms.txt` / 代码高亮 / 站点搜索索引同批生成。
- 校验：`npm run test:catalog`（11 项）、`npm run test:workbench`（17 项，新增 v2→v3 迁移）、`npm run test:interaction`（当时 28 项，新增方向键 / 失焦 / Tab、设置页保存与资源库分页、迁移；Empty 后 29）、`npm run check`、`npm run build` 通过；Chrome 1440 / 390 × 明暗探针覆盖组件页与设置页，1440 两种主题保存后资源库 5 行，无横向溢出与 pageerror，证据在忽略目录 `output/p4-input-number-2026-11-24/`。主入口 454.72 kB / gzip 141.69 kB，无构建警告。
- 边界：不做千分位、货币前缀、任意精度格式化、异步校验或空值提交；粗指针 / 触屏隐藏步进按钮，改用数字键盘；Slider 与 Upload 仍无承载；preferences v3 迁移只补 pageSize，不改其他字段；Safari / Firefox 定向复验见下节。

<a id="p4-empty-2026-11-24"></a>

### P4-⑤ Empty 空态（2026-11-24）

- 范围：按承载评审新增共享 Empty，替换目录搜索无结果与资源库筛选 / 首次使用两处页面级空态；不新增插画、缩略图、空数据列表或其他空态页面，不改 token 与依赖。
- API：`title` 必填；可选 `description`、`icon`、`action`、`align: 'start' | 'center'` 与 `fill`。主文案渲染为 h2，图标统一 `aria-hidden`；组件不默认添加 `role="status"`，播报由页面按上下文决定；其余原生 div 属性透传（`title` 保留给主文案）。
- 采用：目录搜索无结果使用 start 行内编排和「清除搜索」；资源库无结果使用 fill 居中编排和「清除筛选 / 新建资源」；删除页面级 `.catalog-empty` / `.empty-state` 规则。
- 组件站：Empty 进入 feedback 分组（34 个条目 / 30 个组件），3 个示例覆盖基础居中、行内与 fill；API 8 行、行为 4 条；API / `llms.txt` / 代码高亮 / 站点搜索索引同批生成。
- 校验：`npm run test:catalog`（11 项）、`npm run test:workbench`（17 项）、`npm run test:interaction`（29 项，新增 Empty 组件页与目录 / 资源空态采用）、`npm run check`、`npm run build` 通过；Chrome 1440 / 390 × 明暗探针覆盖组件页、目录空态与资源空态，页面无横向溢出与 pageerror，证据在忽略目录 `output/p4-empty-2026-11-24/`；Safari / Firefox 复验见下节。主入口 455.37 kB / gzip 141.91 kB，无构建警告。
- 边界：不做插画 / 缩略图、自动播报、倒计时或空数据列表；只有 start / center 两种对齐与 fill 选项；当前两处采用，不替代字段错误、保存结果或列表计数。

<a id="p5-cross-browser-2026-11-24"></a>

### Safari / Firefox P5 与 InputNumber 定向复验（2026-11-24）

- 环境：macOS 27.0.1；Safari 27.0.1（safaridriver 4452）；Firefox 159.0.1（headless，远程调试 9224）；构建产物 + preview 4510，fixture 代理 4511。两个浏览器执行同一套断言。
- 组合：1440×900 明 / 暗、390×844 明 / 暗；每组 37 项检查。
- 覆盖：`#/search` 88 个条目 / 4 类摘要 / `button` 3 结果 / 2 组 / 结果跳转 / 空态与清除；`#/changelog` 6 条 / 首条 11-24 / 搜索入口；`#/icons` 38 个 / `arrow` 3 个；`#/components/input-number` 3 示例 / 16 行 API / 6 条行为 / 4 个 spinbutton / ArrowUp 从 3 到 4；`#/components/empty` 3 示例 / 8 行 API / 4 条行为 / 3 个空态实例；目录搜索无结果采用行内 Empty，资源搜索无结果采用 fill Empty；`#/settings` 每页条数默认 20→改 5 并保存；`#/resources` 桌面表格 / 窄屏列表均 5 行、页大小「5 条/页」；各页无横向溢出与交互期 window error。
- 结果：Safari 4 组 148 项、Firefox 4 组 148 项，合计 296 项全部通过（0 失败）。证据在忽略目录 `output/p5-cross-browser-2026-11-24/`（`audit.mjs`、两份 report JSON、各 9 张截图与 `report.md`）。
- 边界：Safari 驱动不提供加载期页面异常事件（仅交互期）；未测真实屏幕阅读器、Windows 真实高对比、实体设备与真实 200% 整页缩放；headless Firefox 与 iframe 窄视口不替代实体设备；所有者视觉复审仍待确认。

<a id="cross-browser-2026-11-25"></a>

## 跨端与辅助技术证据（2026-11-25）

- 范围：按所有者选择补 Safari 加载期日志、Firefox 完整键盘遍历，并复验刚完成的英文模式；不改代码、不新增依赖、不改共享组件与 token。
- 方法：macOS 27.0.1；Safari 27.0.1（safaridriver 4452，WebDriver BiDi + W3C actions）、Firefox 159.0.1（headless，远程调试 9224，QA 沙箱参数仅用于 127.0.0.1）；构建产物 + preview 4510，经 fixture 代理 4511。Safari 驱动没有加载期异常事件，fixture 对 HTML 注入最前置的 `error` / `unhandledrejection` / `console.error` / 资源错误捕获脚本后在导航后读取；Safari 在系统全键盘控制关闭时纯 Tab 只到表单控件，键盘遍历使用 Option+Tab。Firefox headless 的 `document.hasFocus()` 始终为 false（尝试 `browsingContext.activate`、`focusmanager.testmode`、`window.focus()` 均无效），因此 Firefox 只断言 Tab 序列 / 循环 / 可见性 / 无陷阱，焦点环由 Safari 覆盖。
- 结果：Safari 加载期 13 条路由 × 中英两种语言共 26 次加载全部注入成功，无错误 / 未处理拒绝 / console.error / 资源错误，主标题与无横向溢出通过；Firefox 9 页完整键盘遍历通过（从跳转链接开始、26–60 个焦点、进入主内容区、循环回到起点，所有焦点可见且在视口内、无陷阱与交互期错误，循环末尾重复最后一个焦点一次属 Firefox 行为）；Safari 8 页 Option+Tab 遍历的 25–59 个焦点全部 `:focus-visible` 且有 1px 实线焦点环、可见、无重复与陷阱、无交互期错误；英文模式 Safari / Firefox 各 3 组（1440 英文明 / 390 英文明 / 1440 中文明）共 92 项检查 0 失败（目录 34 卡片与英文分组 / 摘要，Button 页英文示例 / API / 行为 / Copy，搜索 88 条目与中英结果，中文回归，无横向溢出）。
- 证据：忽略目录 `output/cross-browser-2026-11-25/`（`fixture-server.mjs`、`native-drivers.mjs`、`safari-load.mjs`、`firefox-keyboard.mjs`、`safari-keyboard.mjs`、`english.mjs`、四份 report JSON、10 张截图、`report.md`）。
- 边界：仍无真实屏幕阅读器（VoiceOver / NVDA）、Windows 真实高对比、实体设备与真实浏览器 200% 整页缩放；Safari 加载期捕获只覆盖经 fixture 代理的 HTML 文档；Firefox headless 无法观测 `:focus-visible` / 焦点环；headless Firefox 与 iframe 窄视口不替代实体设备。

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

用途：a11y 声明的依据、回归检查清单、Flutter 端语义对应，以及未来更换行为层时的迁移清单。P3 覆盖 30 个条目，P4 起新增条目同批登记（2026-11-24 起 34 个条目）；未迁移或没有真实页面承载的组件不加壳。

2026-11-21 起逐组件声明落在 `apps/docs/src/component-behavior.ts`：30 个条目共 138 条（键盘 53、焦点 15、ARIA 42、已知限制 28；浏览器原生 29、Radix 32、RadishUI 77），经 `scripts/generate-api.mjs` 校验后生成到组件页「键盘与可访问性」表与 `llms.txt`。上表保留为跨组件示例；逐组件完整清单以生成物为准。2026-11-22 新增 Form 与 Drawer 底部编排后共 31 个条目 143 条；2026-11-23 新增 DescriptionList 后共 32 个条目 148 条（键盘 55、焦点 16、ARIA 46、已知限制 31；浏览器原生 33、Radix 32、RadishUI 83）；2026-11-24 新增 InputNumber 后共 33 个条目 154 条（键盘 57、焦点 17、ARIA 47、已知限制 33；浏览器原生 34、Radix 32、RadishUI 88）；同日新增 Empty 后共 34 个条目 158 条（键盘 58、焦点 17、ARIA 49、已知限制 34；浏览器原生 35、Radix 32、RadishUI 91）。

### 交互行为测试

状态变化后的 `aria-selected`、`aria-pressed` 等属性可在 DOM 层断言。Tab 是否跳过禁用项、Escape 后焦点落在哪个控件、`forced-colors` 下能否看清焦点与选中项，都在浏览器中验证。目前仍用已有的浏览器探针和人工复核记录，注明环境、证据路径及未覆盖项。既有示例见[强制颜色与键盘复验](react-workbench-components.md#强制颜色与减少动效补验2026-11-17)。

现有探针仍是本地证据脚本：位于忽略目录 `output/`，依赖 npx 缓存的 Playwright 与本地 dev server，输出 JSON 而不是断言，也未纳入 `check`。要成为回归断言，先固化为入仓测试入口并确认测试依赖；在此之前只作一次性验证证据。新增测试依赖（Playwright / jsdom / happy-dom 等）由所有者确认。

### 与外部行为层的关系

2026-11-18 评估 Vercel Labs 的 UI SDK（beta；跨框架行为原语、随包文档与 Agent Bridge）后的结论：**不引入**。

- UI SDK 的 beta API 可能调整，支持范围限于 Web。RadishUI 已组合浏览器原生语义、Radix Primitives 与自有交互策略。引入第二套组件模型会增加依赖与发行成本。
- 可被 Agent 读取的文档、未来随包分发的路径和交互断言分别按本节的契约与验证计划推进。
- 重评触发点（任一出现再评估）：UI SDK 出 GA；补上非 Web 适配；家族产品开始用 Agent 操作界面；Radix 停止维护或行为层出现无法绕过的交付形态。
- 文章与官方来源见[本周开发记录](../devlogs/2026-W47.md#2026-11-18-契约与行为规划)。

<a id="acceptance-audit-2026-11-24"></a>

## 组件站 1.0 验收收口审计（2026-11-24）

- 口径：本审计记录当时的 32 个组件页 / 113 个示例 / 258 行 API / 148 条行为声明；随后同日新增 InputNumber 与 Empty，当前为 34 个组件页 / 119 个示例 / 282 行 API / 158 条行为声明，增量由 `test:interaction` 与后续 Safari / Firefox 复验覆盖。
- 范围：按[验收口径](#验收口径)逐项复核 32 个组件页与 P5 / 工作台站点页；不改共享组件、token、路由与依赖。起点 `dev` / `395d0c7`，与 `origin/dev` 同步；11-23 的 11 个提交实际已于 22:21 推送，11-24 手动 PR Checks run `45381557300` 三项通过（Web Build / Repo Hygiene / Candidate Quality），此前「未推送」为收尾快照。
- 方法：构建产物 + 本地 preview，Chrome 157，1440×900 / 390×844 × 明暗四组。32 个条目每页读取 20 项结构（标题、导入、示例数 / 标题 / 预览 / 预览设置 / 代码、高亮、复制按钮、API 行与列、API 区域、行为行与区域、四个章节、相关组件、目录或窄屏入口、横向溢出、pageerror），并执行 32 页 × 4 组的 `doc-api` 深链。每模式验证目录 / 图标搜索、复制纯文本、示例主题 / 密度与 390 目录抽屉；另加载 overview / catalog / components / resources / document / settings / foundations / platforms / changelog / icons 十条路由。证据在忽略目录 `output/component-site-audit-2026-11-24/`（`audit.mjs`、`audit.json`、16 张截图与 `report.md`）。
- 结果：32 个条目全部有独立页，113 个示例（每页 3–4 个）、258 行 API、148 条行为声明、71 个相关组件链接；128 次页面加载无页面级横向溢出与 pageerror，导入 / 示例 / API / 行为 / 章节 / 目录齐全，示例与导入代码全部有高亮和复制按钮；128 个深链均恢复并停靠；复制内容与源码一致，示例主题 / 密度切换生效，390 目录抽屉 5 项并跳转；目录搜索 `button` 命中 2、空态与清除恢复、图标搜索 `arrow` 命中 3；207 个唯一站内链接（2088 次出现）无未知路由或失效目标。未发现产品级差距。
- 环境记录：审计脚本长时运行中 4 次浏览器进程被回收（3 次截图、1 次 390 抽屉），已在 `audit.json` 保留原始记录；16 张截图覆盖全部组合，390 抽屉由 `test:interaction` 独立进程复验通过。该现象不影响结构、深链、搜索、复制与主题 / 密度结论。
- 持续化：`test:interaction` 增至 24 项——全量组件页检查补导入 / 示例 / API / 行为 / 章节 / 目录 / 复制按钮与相关组件，新增 390 全量溢出与暗色代表页（按钮 / 表格 / DescriptionList、资源库、变更记录、图标参考）检查；一次性探针不再是唯一证据。同日 P5-③ 新增搜索断言后为 25 项。
- 边界：所有者对 P4-③、组件页模板与 P5 变更记录 / 图标参考的视觉 / 内容复审仍待确认；真实屏幕阅读器、Windows 高对比、实体设备、Safari 加载期异常与 Firefox 完整键盘遍历未覆盖，不能据本轮推断其他平台通过。
- 结论：按验收口径，目录、已迁移页、类型、用法、站点、版本、图标与契约项均有可复验证据，组件站 1.0 达到内部验收条件。P4 目录扩展继续等真实承载确认；P5 剩余项（组件状态 / 弃用、双语文档）待排，站点搜索已于同日完成。

## 验收口径

- 目录：34 个条目全部可搜索 / 分组；每个 id 可深链；无重复、无死链（全部条目有独立文档页；旧 `#/components` 入口重定向到目录）。
- 已迁移页：导入、≥3 示例、API 表、键盘 / a11y、相关组件与页面目录齐全；代码可复制并有构建期高亮（2026-11-22 起）；1440 / 390 与明暗无页面级横向溢出、无 pageerror。
- 类型：P2 起每个公开 props 有类型、默认值、必填与说明；API 表由源码生成并在 CI 检查漂移。
- 用法：P3 起每组件至少 3 个真实示例；示例代码与预览一致；每示例可在明暗与三档密度下预览；不能只靠静态截图。
- 站点：搜索、深链、复制、键盘焦点可用；`#/search` 覆盖页面 / 组件 / 图标 / 变更记录，索引由生成器与 `check:search` 保持同源；组件页章节可深链（`#/components/<id>/doc-api`）并可恢复；不因新增页面破坏 Workbench 与既有路由。
- 版本：`#/changelog` 展示当前内部版本与日期倒序条目，版本与 `package.json` 一致、条目链接无死链；页面不承诺公开发布或 tag。
- 图标：`#/icons` 只收录展示站与示例实际使用的 lucide-react 图标，名称与依赖导出一致、可搜索并复制导入；不新增第二套图标依赖。
- 双语：2026-11-25 起组件目录摘要与 119 个示例的标题 / 说明、目录分组、组件页摘要、282 行 API 说明、158 条行为声明（含主题 / 来源标签）与站点搜索按站点语言切换；英文覆盖由 `test:catalog` 与 `test:workbench` 拦截。`llms.txt` 与示例代码仍为中文（后续另行确认）。
- 跨环境：2026-11-23 起组件页模板与 DescriptionList 采用位置经 Safari 27 / Firefox 159 定向复验；2026-11-24 起 P5 三页、InputNumber 与设置页 / 资源库完成 4 组定向复验；2026-11-25 补 Safari 加载期日志（26 次加载 0 错误）、Firefox 9 页完整键盘遍历、Safari 8 页焦点环遍历与英文模式 92 项复验（[记录](#cross-browser-2026-11-25)）。真实辅助技术、Windows 高对比、实体设备与真实 200% 仍未覆盖，不能据此推断其他平台通过。
- 契约：P2 起 API 表与 `llms.txt` 由单一来源生成并有 `--check` 漂移门禁；行为归属已于 2026-11-21 进入同一来源，代码高亮产物于 2026-11-22 同属生成链路。手写镜像只作为过渡并在同批标注到期阶段。
- 行为：P3 组件页逐项注明浏览器原生、Radix 与 RadishUI 承担的行为（2026-11-21 起已进入契约生成）；2026-11-22 起 `npm run test:interaction` 在真实 Chrome 中断言代表性键盘 / 焦点 / ARIA 与强制颜色；未覆盖项按验证记录如实标注。
- 不以组件数量或文档页数量替代验收；每项必须有可复验证据。
- 2026-11-24 按本口径完成收口审计（[记录](#acceptance-audit-2026-11-24)）：32 页 × 1440 / 390 × 明暗共 128 次加载无产品级差距；`test:interaction` 已固化全量结构、390 溢出与暗色代表页检查。

- 2026-11-25 按本口径完成内部收口（[记录](#closeout-2026-11-25)）：目录 / 已迁移页 / 类型 / 用法 / 站点 / 版本 / 图标 / 跨环境 / 双语 / 契约 / 行为均通过只读复核与收口基线；未启用与未覆盖项见收口记录。

<a id="closeout-2026-11-25"></a>

## 组件站 1.0 收口（2026-11-25）

- 范围与方式：按[验收口径](#验收口径)做一次只读复核，直接从单一来源读取目录、生成契约、示例元数据、图标参考、变更记录与站点搜索索引，并统计入仓测试；随后执行 `npm run check`、`npm run build`、`npm run test:interaction` 记录收口基线。只更新文档与进度源，不改代码、组件、token 与依赖。
- 复核结果（0 问题）：34 个条目（30 个组件 + 4 个页面原语）、119 个示例、282 行 API、158 条行为声明、38 个图标、7 条变更记录、88 个搜索条目（9 个页面）、30 项交互断言、13 项目录测试、17 项工作台测试；每个条目有独立页、≥3 示例、API、行为、中英摘要与示例、英文 API / 行为说明，相关组件链接有效；版本与 `package.json` 一致、日期倒序唯一；搜索索引完整且旧 `#/components` 条目已移除。验收口径各项均有可复验来源（2026-11-23 至 11-25 的 Chrome / Safari / Firefox 证据与 2026-11-24 收口审计）。
- 收口基线：`npm run check`（`test:repo` 10 / `test:workbench` 17 / `test:catalog` 13）、`npm run build`（主入口 426.26 kB / gzip 133.69 kB、组件页懒加载 321.31 kB / gzip 66.31 kB、`SearchPage` 50.30 kB / gzip 13.90 kB，无 500 kB 警告）、`npm run test:interaction` 30 项通过。证据在忽略目录 `output/e03-closeout-2026-11-25/`（`audit.mjs`、`audit.json`、`report.md`）。
- 未启用 / 未覆盖：组件状态与弃用机制未启用（没有真实 preview / deprecated 组件数据）；真实屏幕阅读器（VoiceOver / NVDA）实际朗读、Windows 真实高对比、实体设备与真实浏览器 200% 仍缺环境；`llms.txt`、示例代码演示文案与工作台合成数据按所有者决定保持中文；展示站仍是 private workspace，未发布 npm、未创建 tag / Release。
- 后续入口：P4 Upload 需最小真实场景；组件状态 / 弃用需语义与真实数据；P4 正式发行、外部采用与 Flutter 需单独授权 / 确认。收口不等于发行或产品采用，后续扩展按新任务启动。

## 边界与依赖

- 当前包仍是 private workspace；导入示例写工作区包名，不代表已发布。
- 新增开发依赖需单独确认：2026-11-22 已确认构建期代码高亮使用 `shiki`（不进入浏览器包）与交互断言使用 `@playwright/test`（`channel: chrome`，不下载浏览器）。未采用 jsdom，浏览器专属的焦点 / `forced-colors` 只能由真实浏览器断言。
- P4 条目按家族需求盘点逐项确认；2026-11-22 已确认首项 Form 采用调用方校验路线，不引入规则 DSL 或第二个表单框架；2026-11-23 经真实用量审计确认 DescriptionList 为窄栏行式展示原语，多列 / bordered 变体等有宽页承载再加。
- 不引入 `@ui-sdk/*`、Agent Bridge 或 WebMCP 接入；外部行为层评估与重评触发点见[契约与行为](#contract-and-behavior-2026-11-18)。
- 双语文档（2026-11-25 批）覆盖目录摘要、示例标题 / 说明、API 说明与行为声明；`llms.txt`、示例代码内容与工作台合成数据仍为中文，后续另行确认范围。
- 组件站 1.0 已于 2026-11-25 内部收口；组件状态 / 弃用机制未启用（无真实 preview / deprecated 数据）；`llms.txt`、示例代码演示文案与工作台合成数据保持中文；展示站仍为 private workspace，发行 / tag / Release 需另行授权。
- 产品仓只读；家族需求盘点不构成接入授权。
- 旧 `#/components` 于 2026-11-25 退役，访问时规范化为 `#/catalog`；`#/components/<id>` 深链与既有文档链接保持可用。
- 证据写入开发记录；实现与文档分别提交，按批次由所有者复审。
