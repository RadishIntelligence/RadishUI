# 当前规划

更新日期：2026-11-03。

## 当前范围

最小工程、仓库协作、三级规划和远端治理已建立。当前推进 [F-02 视觉基准与资料归集](../features/visual-baseline-proposal.md)：方案已获准开始，通用文档、本地私有原图与四仓短入口已归集，Pen 已形成 R1–R3 的十二组合与局部状态候选。本仓交付以本地 Git 提交保存；视觉待评审，来源四仓改动尚未提交 / 推送，未改造产品运行时。

长期目标和阶段出口见[整体规划](roadmap.md)，四个大专题与子专题归属见[专题地图](topics.md)；本页只维护当前顺位，不复制子专题任务表。

本地构建、依赖审计和代表双端浏览器检查已完成，详见[本周记录](../devlogs/2026-W45.md)。

`RadishIntelligence/RadishUI` 已连接并推送 `master` / `dev`，GitHub 默认分支为 `master`。首次 Vercel 生产部署已完成并通过公开页面与静态资源访问检查，当前首选地址为 [ui.radishx.com](https://ui.radishx.com/)，HTML canonical 与分享 URL 同步使用新域名。GitHub Pages 保留为备选，未启用；版本与验收快照见[部署说明](../deployment/hosting.md)。

所有者于 2026-11-02 完成域名绑定与 Vercel 名称调整；当前控制台为 `DaBaiLuoBo / radish-ui`。本批同步官网和组织入口，保留既有工程预览边界；真实 Chrome 已访问新域名，命令行请求的 Cloudflare 403 限制见部署说明。

前一批 [G-01 仓库与协作治理](../development/repository-governance.md#实施与验收)已收口：通用基础、根入口、三级规划和组织成员流程通过 [PR #3](https://github.com/RadishIntelligence/RadishUI/pull/3) 合入主线，[PR #5](https://github.com/RadishIntelligence/RadishUI/pull/5) 同步验收记录。稳定主线与远端 dev 基线为 `535e8d7`；本地方案提交为 `dc1ee3c`，归集与设计的后续提交见本地 Git 历史，未推送。详细证据见[本周记录](../devlogs/2026-W45.md)。

PR #3 最终候选的真实 CI 与 Vercel 预览通过，隔离 PR #4 已验证类型错误使 Web Build 与 Candidate Quality 失败并关闭。远端已关闭 squash，启用精确保护 master 的 Ruleset `26446452`，检查来源绑定实际 GitHub Actions `15368`。治理主线合并后已快进回流 dev，远端祖先关系与 `0 0` 分叉计数通过，Vercel 生产部署成功；本次收口不代表组件包发行或家族视觉定稿。

## 后续顺位

1. 评审 [Workbench v1 候选](../design/patterns/workbench-v1.md)：冷暖、密度、主辅关系、阅读与关键状态。
2. 根据批准稿确认 token 差异映射与[首批组件合同](../design/components/first-batch.md)，再进入真实共享组件和代表页实现。
3. 归集改动分仓审阅 / 提交；先使 RadishUI 目标提交可访问，再固定兄弟仓引用并通过各自流程合入，见[迁移记录](../design/sources/2026-11-03-centralization.md)。
4. 真实范例和有限 React 产品验证通过后扩展 Flutter；按实际范围另行确认许可、版本和发行。

## 当前停止线

- 十二组合、四个辅助板是静态候选，不代表视觉获批、真实键盘 / 焦点 / 浏览器验收或产品采用。
- 本批只实施资料归集与设计，没有改 token 来源、共享 API、lockfile、依赖或产品代码；旧运行时副本保留。
- 受限原图仅在所有者确认的仓库外本地私有库，不建立 Git、不上传云端；私人材料排除，外部截图不进 `.pen`、产品或公开素材。
- 没有推送、远端 PR / 合并、发行、部署、DNS 或托管变更；四仓迁移分支均为本地候选，不能宣称线上引用已生效。
- 视觉批准之后再确认组件 / token 实施范围；正式包和多平台能力仍按独立出口验收。
