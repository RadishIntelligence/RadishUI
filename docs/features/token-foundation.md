# F-01：最小 token 来源与 CSS 管线

主要归属：[视觉基础](../planning/topics.md#foundations)。P0 协同 C-01 / E-01，当前现代圆角映射协同 C-02 / E-02。设计依据为[架构](../architecture/overview.md)与[设计系统契约](../development/design-system.md)，不把本轮取值视为正式发行冻结。

## 场景与边界

组件和展示站从同一个机器来源取得语义变量，不各自维护颜色副本。输入为 `packages/tokens/src/tokens.json` 的 `shared`、`light`、`dark` 三组字符串；生成入口为 `scripts/generate-tokens.mjs`，输出为纳入 Git 的 `packages/tokens/dist/tokens.css`。

当前仍只支持此最小 JSON / CSS 格式，CSS 变量使用 `--rd-` 前缀。默认亮色，`[data-rd-theme="light"]` / `[data-rd-theme="dark"]` 可显式覆盖；生成器将共享尺度与主题分开，使设置页的明暗缩略图也能消费同一来源。不宣称完整 DTCG、Dart 导出、品牌变体或正式视觉定稿。

## 现代圆角的语义映射

2026-11-04 按所有者授权，将接受的视觉方向用于本仓首轮 Web 实施。保留既有 token 角色，补齐原生候选中真实需要的状态与尺度；Pen 的 `mr-*` 不直接成为运行时前缀，也不把历史 family-ui 同名值混入生成器。

| 设计角色 | 运行时 token |
| --- | --- |
| canvas / surface / soft / selected | bg-app / bg-surface / bg-muted / bg-selected |
| 主文字 / 辅助文字 / 操作文字 | text-primary / text-secondary / text-action |
| 装饰分隔 / 必要控件边界 | border-soft / border-control |
| 主操作底 / 底上文字 | action-primary / text-on-action |
| 品牌识别 | brand-primary / brand-soft，不兼任成功状态 |
| success / warning / danger | state-* 与 state-*-soft 成对定义 |
| 抬升 / 弹层 / 遮罩 | shadow-raised / shadow-popup / overlay |
| 填充控件表面 | control-surface-filled（可选 `surface="filled"` 字段） |

2026-11-07 的 B2 增加 `control-surface-filled`，作为可选 `surface="filled"` 字段的填充表面；默认 outline 字段继续使用 `bg-surface` + `border-control`。设置页当时作为首个采用页面改用 filled；2026-11-08 设置页 4 个字段改为横向 RadioGroup，filled Select 保留在组件示例与其他页面；资源库等仍为 outline，默认不受影响。

字级使用 rem，默认字号与当前画稿对应，并允许浏览器基础字号放大；系统字体栈保持原有方式，不打包 Pen 字体。控件、面板、主内容面、胶囊分别有圆角职责，密度通过具名控件高度调整，移动主要控件保持至少约 44px 触控高度。既有 Button 的四种 variant 与事件语义不变，默认视觉调整由 C-02 / E-02 验收。

本轮只有内部展示站消费，没有已发布包或产品迁移。具体语义值可随运行效果迭代；任何后续删除 / 改名 / 默认值变更仍按设计系统契约说明兼容影响。

## 正常、失败与恢复

修改 JSON 后运行 `npm run tokens:generate`，与 CSS 一起提交；`npm run check:tokens` 核对一致性。当前脚本校验亮暗键集合相同、token 名与值的基本格式；无效输入或过期产物使命令失败，不静默接受或手工修补 CSS。修正来源、重新生成，再运行 `npm run build`；新增格式或平台另行确认生成责任和消费路径。

## 实施与验收

| 工作项 | 状态 | 完成依据与限制 |
| --- | --- | --- |
| F-01.1 JSON 来源、CSS 生成与一致性入口 | 已完成（P0 工程预览） | 2026-11-02 构建与历史双端检查见[开发记录](../devlogs/2026-W45.md)；不代表取值正式获批 |
| F-01.2 现代圆角语义映射与嵌套明暗 | 已完成（本地 Web 范例） | JSON / CSS 一致性、明暗缩略图、三页与 200% 基础文字放大通过；34 组实际 token 实色对照通过（B2 新增 `control-surface-filled` 未计入该次口径），范围见本周记录 |

本专题验收要求 JSON / CSS 可追溯、一致性检查失败可观察、React 与展示站从真实产物消费。正式颜色和尺度确认仍属于 F 大专题的 P1 出口，待所有者评审运行效果；本轮本地映射通过不等于家族视觉定稿。


2026-11-08 字体栈更新：`font-sans` 优先 Inter，`font-mono` 优先 JetBrains Mono，缺失时回退系统字体；没有新增字体包、网络字体或字体文件。字体是否随项目打包仍待单独确认。
