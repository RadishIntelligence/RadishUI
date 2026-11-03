# F-01：最小 token 来源与 CSS 管线

主要归属：[视觉基础](../planning/topics.md#foundations)。协同 C-01、E-01；阶段为 P0 工程基线。设计依据为[架构](../architecture/overview.md)与[设计系统契约](../development/design-system.md)，不是正式家族视觉批准。

## 场景与边界

组件和展示站从同一个机器来源取得语义变量，不各自维护颜色副本。输入为 `packages/tokens/src/tokens.json` 的 `shared`、`light`、`dark` 三组字符串；生成入口为 `scripts/generate-tokens.mjs`，输出为纳入 Git 的 `packages/tokens/dist/tokens.css`。

当前只支持此最小 JSON / CSS 格式，CSS 变量使用 `--rd-` 前缀，默认亮色、`[data-rd-theme="dark"]` 覆盖深色。不宣称完整 DTCG、Dart 导出、品牌变体或正式视觉定稿，也不在本次文档整理中扩展格式。

## 正常、失败与恢复

修改 JSON 后运行 `npm run tokens:generate`，与 CSS 一起提交；`npm run check:tokens` 核对一致性。当前脚本校验亮暗键集合相同、token 名与值的基本格式；无效输入或过期产物使命令失败，不静默接受或手工修补 CSS。修正来源、重新生成，再运行 `npm run build`；新增格式或平台另行确认生成责任和消费路径。

## 实施与验收

| 工作项 | 状态 | 完成依据与限制 |
| --- | --- | --- |
| F-01.1 JSON 来源、CSS 生成与一致性入口 | 已完成（P0 工程预览） | 2026-11-02 构建与历史双端检查见[开发记录](../devlogs/2026-W45.md)；不代表取值正式获批 |

本专题验收要求 JSON / CSS 可追溯、一致性检查失败可观察、React 与展示站从真实产物消费。正式颜色和尺度确认属于 F 大专题的 P1 工作，详细范围待代表页确定后建立，不把未确认目标作为本条已完成任务的隐含续批。
