# 版本策略

状态：已确认（2026-11-08，所有者决定）
适用范围：RadishUI 根 workspace、`@radish-ui/*` 包、展示站，以及未来的 Git tag / Release。家族产品各自的版本仍由各产品维护，本页不替代。

## 规则

- 采用家族日历版本 `vYY.M.RELEASE`，与 family-ui、RadishFlow、RadishInk 一致。
- `YY` 为两位年份，`M` 为月份 `1–12` 不补零，`RELEASE` 为当月发版序号，从 `1` 起、不补零、跨月重置。
- RadishUI 首个内部版本：`v26.11.1`（2026 年 11 月第 1 版）。
- `package.json` 的 `version` 只写 `26.11.1`，不带 `v`；`v26.11.1` 用于文档、Git tag、Release 和展示。
- 所有 workspace 包固定同一版本：根、`@radish-ui/react`、`@radish-ui/tokens`、`@radish-ui/docs`。
- Git tag 使用 `v26.11.1-dev` / `-test` / `-release`；构建扩展 `v26.11.1.DDXX` 只用于 tag / 构建标识，不写入 npm version。
- `private: true` 在 P4 发行门禁通过前保持不变；当前 `26.11.1` 是内部版本，不是公开发布，也不代表已创建 tag。
- 版本号用于识别发布，不替代 API / token 的兼容性承诺；破坏性变更仍按[设计系统契约](design-system.md)记录迁移。
- family-ui `v26.7.3` 是设计来源版本，不是 RadishUI 的包版本。

## 格式映射

| 场景 | 格式 | 示例 |
| --- | --- | --- |
| 文档 / Release / Git tag | `vYY.M.RELEASE` | `v26.11.1` |
| npm `version` | `YY.M.RELEASE` | `26.11.1` |
| 预发布 tag | `vYY.M.RELEASE-(dev|test)` | `v26.11.1-dev` |
| 构建扩展 tag | `vYY.M.RELEASE.DDXX-(dev|test|release)` | `v26.11.1.2001-release` |

npm 不接受带 `v` 的 `v26.11.1`，也不接受四段的 `26.11.1.0813`；后者只能出现在 tag 或构建标识中。`-release` 作为 tag 轨道，不默认作为 npm 预发布标签；npm 的 prerelease 语义由具体发布任务单独确认。

## 升级与校验

- 修改版本时同步根 `package.json`、各包 `package.json` 与 `package-lock.json`。
- `npm run check:repo` 校验版本符合日历格式、各包一致、lockfile 同步；任一不一致即失败。
- 不为普通开发提交创建 tag；tag / Release 只在发行任务中创建，并另行授权。
- 首个正式发行仍需 P4 的许可证、公共包名、构建 / 类型导出、支持矩阵、回滚和发布门禁；版本策略不等于发行授权。
