# 组件站 1.0

状态：2026-11-17 所有者确认作为下一阶段，P0 垂直切片已实现（`42019fe`）、待复审；P2 外部采用与 P3 Flutter 暂缓。2026-11-18 按所有者确认增补机器可读契约、行为归属与交互行为测试评估，见[契约与行为](#contract-and-behavior-2026-11-18)。
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
5. 键盘与可访问性：焦点、按键、ARIA、已知限制；行为来源（浏览器原生 / Radix / RadishUI）自 P3 起补齐。
6. 相关组件：只链接真实存在的目录项。

## 阶段

| 阶段 | 交付 | 状态 |
| --- | --- | --- |
| **P0 垂直切片** | 目录页、搜索、Button / Select / Tabs 独立页、API 表、示例、复制、测试 | 已实现（`42019fe`），待复审 |
| **P1 迁移 27 个** | 现有组件全部进入模板；Card / Section / Table 页面原语一并纳入目录；单页参考退为“全部示例” | 待开始 |
| **P2 类型 / API 全量** | 导出缺失 props 类型；JSDoc / 默认值 / 事件 / ref；单一来源生成 API 表与 `llms.txt`，行为归属随 P3 进入同一来源；`--check` 漂移门禁；类型测试与完整性检查 | 待开始 |
| **P3 用法深度** | 每组件 3+ 示例、变体 / 受控 / 表单 / 组合；代码高亮（新增依赖需确认）；每示例主题 / 密度；逐组件 a11y 与行为归属声明及对应断言（依赖待确认） | 待开始 |
| **P4 目录扩展** | 按[家族需求盘点](family-component-demand.md)排序；Form、Upload、InputNumber / Slider 等逐项确认 | 待开始 |
| **P5 站点能力** | 版本 / 变更记录、状态与弃用、双语文档、图标参考、站点搜索索引；公开安装 / CLI / registry 属 P4 发行 | 待开始 |

P2 / P3 的生成与声明范围见[契约与行为](#contract-and-behavior-2026-11-18)；交互断言的执行环境与依赖确认见该节。

<a id="p0-usage-review"></a>

## P0 用法复审

请一名开发者只从目录和 Button、Select、Tabs 三页入手，在本仓示例中选择并导入组件，完成一次选择、切换与键盘操作。记录需要翻源码或额外解释的步骤，以及缺少的参数、状态或示例。能独立完成就提交 P0 复审并转入 P1 迁移；遇到阻碍先修模板或示例，再走相同步骤。复审者暂缺时保留 P0 待复审状态。此项使用本仓工作区，外部采用另行安排。

## P0 已实施范围

- `apps/docs/src/component-catalog.ts`：27 个组件的单一目录数据（id、名称、分组、摘要、状态、是否有独立页）；
- `apps/docs/src/CatalogPage.tsx`：搜索、分组、计数、空结果与卡片深链；
- `apps/docs/src/ComponentDetailPage.tsx`：导入、示例、API、键盘 / a11y、相关组件；
- `apps/docs/src/component-api.ts`：Button / Select / Tabs 的 API 行与导入代码；当前手工镜像导出类型，P2 改为从源码生成；
- `apps/docs/src/component-pilot-examples.tsx`：3 × 3 个示例，预览使用真实共享组件；
- `apps/docs/src/CopyButton.tsx`：复制代码 / 导入片段；无第三方依赖；
- 路由：`#/catalog`、`#/components/<id>`；旧 `#/components` 保留；目录与详情页按路由懒加载，避免主包持续膨胀；
- 测试：`scripts/component-catalog.test.mjs` 与 `parseRoute` 新用例；`npm run test:catalog` 纳入 `check` 与 PR Checks 的 `web-build`。

<a id="contract-and-behavior-2026-11-18"></a>

## 契约与行为（2026-11-18）

2026-11-18 所有者确认三项增补：API 与行为声明的机器可读契约、逐组件行为归属，以及交互行为测试。P0 仍按三页用法复审验收。

### 机器可读契约

- P2 以组件源码导出的 props 类型、JSDoc 和组件目录元数据为输入。P3 接入一份逐组件的行为归属与可访问性声明，记录键盘、焦点、ARIA 和已知限制。
- 生成消费：组件页 API 表、`llms.txt`（站点产物与未来发行包内文档目录共用同一份）与类型 / 完整性检查。沿用 token 管线的生成 + `--check` 范式，不手改生成物。
- `llms.txt` 只描述已实现能力与 import 路径，不承诺未发布的包名、CLI 或 registry；P4 发行前只随展示站产出，不写进 npm 包路径。
- 判定：结构可解析、覆盖全部导出、示例能按其中 import 运行；生成物与源码漂移由 `npm run check` 拦截。

### 行为归属

按具体行为登记来源，并与 [C-02 组件合同](react-workbench-components.md#组件合同) 对齐。同一交互涉及多方时，分别写明各自负责的步骤。

| 行为 | 来源与职责 |
| --- | --- |
| Button 设置 `disabled` 后退出 Tab 顺序 | 浏览器提供原生按钮的禁用行为。 |
| Checkbox 聚焦时按空格切换选中状态 | 浏览器处理原生复选框的键盘操作。 |
| 单选 ToggleGroup 响应方向键 | Radix 移动焦点，RadishUI 在可用项获得焦点时同步选中值。 |
| Button 进入 loading | RadishUI 保留焦点，设置 `aria-disabled` / `aria-busy` 并拦截重复激活。焦点环遵循 [DR-17](../design/design-rules.md#dr-17)。 |

用途：a11y 声明的依据、回归检查清单、Flutter 端语义对应，以及未来更换行为层时的迁移清单。P3 覆盖已迁移的全部组件（含现有 Button / Select / Tabs）；未迁移或没有真实页面承载的组件不加壳。

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
- 行为：P3 组件页逐项注明浏览器原生、Radix 与 RadishUI 承担的行为；键盘与焦点验收记录验证环境、证据来源及未覆盖项。
- 不以组件数量或文档页数量替代验收；每项必须有可复验证据。

## 边界与依赖

- 当前包仍是 private workspace；导入示例写工作区包名，不代表已发布。
- 新增开发依赖（代码高亮、API 生成器、Playwright / jsdom 等测试工具）需单独确认；P0 不新增依赖。
- 不引入 `@ui-sdk/*`、Agent Bridge 或 WebMCP 接入；外部行为层评估与重评触发点见[契约与行为](#contract-and-behavior-2026-11-18)。
- 产品仓只读；家族需求盘点不构成接入授权。
- 旧 `#/components` 与既有文档链接在 P1 前保持可用；迁移时再统一导航与重定向。
- 证据写入开发记录；实现与文档分别提交，按批次由所有者复审。
