# 当前规划

更新日期：2026-11-05。

## 当前范围

最小工程、仓库协作、三级规划和远端治理已建立。所有者已将[现代圆角版](../design/patterns/modern-rounded-v1.md)暂定为本轮实现起点，并明确授权在 RadishUI 的 Web 展示站落实三代表页。[F-01 token 映射](../features/token-foundation.md)、[C-02 首批 React 组件](../features/react-workbench-components.md)和 [E-02 三代表页](../features/workbench-preview.md)已完成本轮本地实现与限定浏览器验收，整体运行效果已获所有者大部分认可，桌面控件尺寸收敛后待复评；[F-02](../features/visual-baseline-proposal.md)继续维护设计与来源。此前四仓迁移已撤回，兄弟仓继续只读，产品接入仍需单独评估。

长期目标和阶段出口见[整体规划](roadmap.md)，四个大专题与子专题归属见[专题地图](topics.md)；本页只维护当前顺位，不复制子专题任务表。

本轮构建、依赖审计与三页组合检查见[本周记录](../devlogs/2026-W45.md)；以下远端信息为此前治理 / 部署验收，不代表本轮工作区已上线。

11 月 4 日的设计与 Web 实施已在本地提交保存，实现锚点为 `f1c2eef`，文档收尾为 `184132c`。11 月 5 日从干净 `dev` / `184132c` 继续；本地与缓存 `origin/dev` 为 `0 0`，未刷新远端。本轮已实施桌面控件密度收敛、C-02.4 用法页及 E-02.5 部分环境补验，已按所有者要求随本批提交本地保存，运行效果继续待复评。P1 的正式视觉批准仍待完成；本仓 React 范例不满足 P2 所要求的真实产品消费出口。

`RadishIntelligence/RadishUI` 已连接并推送 `master` / `dev`，GitHub 默认分支为 `master`。首次 Vercel 生产部署已完成并通过公开页面与静态资源访问检查，当前首选地址为 [ui.radishx.com](https://ui.radishx.com/)，HTML canonical 与分享 URL 同步使用新域名。GitHub Pages 保留为备选，未启用；版本与验收快照见[部署说明](../deployment/hosting.md)。

所有者于 2026-11-02 完成域名绑定与 Vercel 名称调整；当前控制台为 `DaBaiLuoBo / radish-ui`。本批同步官网和组织入口，保留既有工程预览边界；真实 Chrome 已访问新域名，命令行请求的 Cloudflare 403 限制见部署说明。

前一批 [G-01 仓库与协作治理](../development/repository-governance.md#实施与验收)已收口：通用基础、根入口、三级规划和组织成员流程通过 [PR #3](https://github.com/RadishIntelligence/RadishUI/pull/3) 合入主线，[PR #5](https://github.com/RadishIntelligence/RadishUI/pull/5) 同步验收记录。治理收口基线为 `535e8d7`；之后的方案与设计提交见 Git 历史。11 月 4 日早期设计任务启动时，本地与缓存远端一致；本轮 Web 实施启动于干净 `dev` / `6cca130`，较缓存 `origin/dev` ahead 3，未 fetch 或操作远端。详细证据见[本周记录](../devlogs/2026-W45.md)。

PR #3 最终候选的真实 CI 与 Vercel 预览通过，隔离 PR #4 已验证类型错误使 Web Build 与 Candidate Quality 失败并关闭。远端已关闭 squash，启用精确保护 master 的 Ruleset `26446452`，检查来源绑定实际 GitHub Actions `15368`。治理主线合并后已快进回流 dev，远端祖先关系与 `0 0` 分叉计数通过，Vercel 生产部署成功；本次收口不代表组件包发行或家族视觉定稿。

## 后续顺位

1. **复评桌面控件尺寸。** 所有者已大部分认可整体视觉，并指出桌面按钮 / 输入框 / 选择器偏大。本轮默认采用现有 36px compact 档、收窄设置选择器并补齐大字号与焦点边界。先复评收敛后的三页；正式基准登记仍归 [F-02.4](../features/visual-baseline-proposal.md)，部分认可不等于 P1 完成。
2. **审阅现有组件用法。** [C-02.4](../features/react-workbench-components.md) 已提供 `#/components`，覆盖现有 16 个组件的可运行用例、关键 props / 事件、代码与状态 / 键盘说明；之后按实际用例反馈补缺口，沿用现有依赖。
3. **继续环境补验。** [E-02.5](../features/workbench-preview.md) 已补 Safari / Firefox 限定路径和 Firefox 200% 整页缩放，仍需真机安全区 / 触控、输入法 / 软键盘、屏幕阅读器及完整跨浏览器矩阵。具体已验与未验以开发记录为准。

4. 第一版满意后，再单独讨论有限产品试点、文档引用与资料迁移；重新选择产品、页面和版本，不自动恢复已撤回的四仓改动，见[归集与撤回记录](../design/sources/2026-11-03-centralization.md)。React 18、Flutter、字体打包和正式发行按实际需求另行确认。

## 当前停止线

- **远端晋级前的已知阻塞**：11 月 4 日 `c6eba89`、`98d1550`、`6cca130` 的 `design(workbench): ...` 标题不在现有允许类型中；完整区间 `afc39bc..f1c2eef` 的提交检查失败。日常不带 base 的仓库检查和本地构建通过不代表这项 PR 门禁通过。下次远端操作前先与所有者确定合规处理方式；本次不改写既有提交、不放宽检查器或贡献规则，也不宣称整段历史已可晋级。
- Pen 中的十二组合、两个控件板及旧状态仍是静态设计证据；实际 Web 能力以 C-02 / E-02 的验证为准，不推断 Flutter、React 18 或产品采用。
- 当前只推进本仓设计、token、共享组件和 Web 范例，不改兄弟仓文档、参考图、依赖、token 或产品代码，也不自动建立产品迁移分支。
- 本仓设计使用的受限参考副本保留在已确认的仓库外本地私有库，不建 Git、不上传；来源仓原图与原入口已恢复。私人材料排除，外部截图不进 `.pen`、产品或本仓公开素材。
- 没有推送、远端 PR / 合并、发行、部署、DNS 或托管变更；上一轮四仓临时分支已删除，没有待提交的跨仓迁移。
- 11 月 5 日本轮实现与文档已按所有者要求本地提交保存；推送、远端 PR / 合并与主线自动部署留待明确授权。正式发行、其他平台和真实产品试点仍按独立出口确认。
