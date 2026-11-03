# 当前规划

更新日期：2026-11-03。

## 当前范围

最小工程、仓库协作、三级规划和远端治理已建立。当前推进 [F-02 视觉基准与资料归集](../features/visual-baseline-proposal.md)，优先在 RadishUI 内打磨满意的第一版设计。R1–R3 的十二组合、局部状态与本仓研究资料已保存；上一轮四个兄弟仓的文档 / 参考图迁移已完整撤回，原分支与干净工作区均已恢复。兄弟仓当前仅作只读参考，产品接入待第一版设计获批后再单独评估。

长期目标和阶段出口见[整体规划](roadmap.md)，四个大专题与子专题归属见[专题地图](topics.md)；本页只维护当前顺位，不复制子专题任务表。

本地构建、依赖审计和代表双端浏览器检查已完成，详见[本周记录](../devlogs/2026-W45.md)。

`RadishIntelligence/RadishUI` 已连接并推送 `master` / `dev`，GitHub 默认分支为 `master`。首次 Vercel 生产部署已完成并通过公开页面与静态资源访问检查，当前首选地址为 [ui.radishx.com](https://ui.radishx.com/)，HTML canonical 与分享 URL 同步使用新域名。GitHub Pages 保留为备选，未启用；版本与验收快照见[部署说明](../deployment/hosting.md)。

所有者于 2026-11-02 完成域名绑定与 Vercel 名称调整；当前控制台为 `DaBaiLuoBo / radish-ui`。本批同步官网和组织入口，保留既有工程预览边界；真实 Chrome 已访问新域名，命令行请求的 Cloudflare 403 限制见部署说明。

前一批 [G-01 仓库与协作治理](../development/repository-governance.md#实施与验收)已收口：通用基础、根入口、三级规划和组织成员流程通过 [PR #3](https://github.com/RadishIntelligence/RadishUI/pull/3) 合入主线，[PR #5](https://github.com/RadishIntelligence/RadishUI/pull/5) 同步验收记录。稳定主线与远端 dev 基线为 `535e8d7`；本地方案提交为 `dc1ee3c`，归集与设计的后续提交见本地 Git 历史，未推送。详细证据见[本周记录](../devlogs/2026-W45.md)。

PR #3 最终候选的真实 CI 与 Vercel 预览通过，隔离 PR #4 已验证类型错误使 Web Build 与 Candidate Quality 失败并关闭。远端已关闭 squash，启用精确保护 master 的 Ruleset `26446452`，检查来源绑定实际 GitHub Actions `15368`。治理主线合并后已快进回流 dev，远端祖先关系与 `0 0` 分叉计数通过，Vercel 生产部署成功；本次收口不代表组件包发行或家族视觉定稿。

## 后续顺位

1. 在本仓反复评审与迭代 [Workbench v1 候选](../design/patterns/workbench-v1.md)，直到萝卜SAMA认可第一版视觉；重点为冷暖、密度、主辅关系、阅读与关键状态。
2. 根据获批设计，在本仓明确 token 差异映射、[首批组件合同](../design/components/first-batch.md)与代表页实施范围，分别完成设计和交互验收。
3. 第一版满意后，再单独讨论产品试点、文档引用与资料迁移；重新选择范围和版本，不自动恢复已撤回的四仓改动，见[归集与撤回记录](../design/sources/2026-11-03-centralization.md)。
4. 后续按实际需求评估其他平台、许可、版本和发行；当前不推动兄弟产品接入。

## 当前停止线

- 十二组合、四个辅助板是静态候选，不代表视觉获批、真实键盘 / 焦点 / 浏览器验收或产品采用。
- 当前只推进本仓设计与研究整理，不改兄弟仓文档、参考图、依赖、token 或产品代码，也不自动建立产品迁移分支。
- 本仓设计使用的受限参考副本保留在已确认的仓库外本地私有库，不建 Git、不上传；来源仓原图与原入口已恢复。私人材料排除，外部截图不进 `.pen`、产品或本仓公开素材。
- 没有推送、远端 PR / 合并、发行、部署、DNS 或托管变更；上一轮四仓临时分支已删除，没有待提交的跨仓迁移。
- 视觉批准之后再确认组件 / token 实施范围；正式包和多平台能力仍按独立出口验收。
