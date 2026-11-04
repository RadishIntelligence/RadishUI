# 当前规划

更新日期：2026-11-04。

## 当前范围

最小工程、仓库协作、三级规划和远端治理已建立。当前推进 [F-02 视觉基准与资料归集](../features/visual-baseline-proposal.md)，优先在 RadishUI 内打磨满意的第一版设计。移动底部导航与选择器版本已提交保留，当前评审[现代圆角探索](../design/patterns/modern-rounded-v1.md)：按所有者喜爱的前 29 张参考图提炼中性表面、微圆角与胶囊形态，用 R1–R3 的桌面 / 移动、明暗检验。此前四仓的文档 / 参考图迁移已完整撤回，兄弟仓继续仅作只读参考，产品接入待第一版设计获批后再单独评估。

长期目标和阶段出口见[整体规划](roadmap.md)，四个大专题与子专题归属见[专题地图](topics.md)；本页只维护当前顺位，不复制子专题任务表。

本地构建、依赖审计和代表双端浏览器检查已完成，详见[本周记录](../devlogs/2026-W45.md)。

`RadishIntelligence/RadishUI` 已连接并推送 `master` / `dev`，GitHub 默认分支为 `master`。首次 Vercel 生产部署已完成并通过公开页面与静态资源访问检查，当前首选地址为 [ui.radishx.com](https://ui.radishx.com/)，HTML canonical 与分享 URL 同步使用新域名。GitHub Pages 保留为备选，未启用；版本与验收快照见[部署说明](../deployment/hosting.md)。

所有者于 2026-11-02 完成域名绑定与 Vercel 名称调整；当前控制台为 `DaBaiLuoBo / radish-ui`。本批同步官网和组织入口，保留既有工程预览边界；真实 Chrome 已访问新域名，命令行请求的 Cloudflare 403 限制见部署说明。

前一批 [G-01 仓库与协作治理](../development/repository-governance.md#实施与验收)已收口：通用基础、根入口、三级规划和组织成员流程通过 [PR #3](https://github.com/RadishIntelligence/RadishUI/pull/3) 合入主线，[PR #5](https://github.com/RadishIntelligence/RadishUI/pull/5) 同步验收记录。治理收口基线为 `535e8d7`；之后的方案与设计提交见 Git 历史。2026-11-04 启动检查时，本地 `dev` 与已缓存的 `origin/dev` 无 ahead / behind，本次未 fetch 或操作远端。详细证据见[本周记录](../devlogs/2026-W45.md)。

PR #3 最终候选的真实 CI 与 Vercel 预览通过，隔离 PR #4 已验证类型错误使 Web Build 与 Candidate Quality 失败并关闭。远端已关闭 squash，启用精确保护 master 的 Ruleset `26446452`，检查来源绑定实际 GitHub Actions `15368`。治理主线合并后已快进回流 dev，远端祖先关系与 `0 0` 分叉计数通过，Vercel 生产部署成功；本次收口不代表组件包发行或家族视觉定稿。

## 后续顺位

1. 按[设计条例与约束](../design/design-rules.md)评审并迭代[现代圆角探索](../design/patterns/modern-rounded-v1.md)，用已保存的 [Workbench v1](../design/patterns/workbench-v1.md)对照，直到萝卜SAMA认可第一版视觉；重点为表面层次、圆角 / 胶囊、密度、导航形态、主辅关系、阅读与关键状态。已确认原则和参考建议分别判断，不以文档整理代替画稿批准。
2. 根据获批设计，在本仓明确 token 差异映射、[首批组件合同](../design/components/first-batch.md)与代表页实施范围，分别完成设计和交互验收。
3. 第一版满意后，再单独讨论产品试点、文档引用与资料迁移；重新选择范围和版本，不自动恢复已撤回的四仓改动，见[归集与撤回记录](../design/sources/2026-11-03-centralization.md)。
4. 后续按实际需求评估其他平台、许可、版本和发行；当前不推动兄弟产品接入。

## 当前停止线

- 当前现代圆角的十二组合、两个控件板，以及旧版保留的更多状态均是静态候选，不代表视觉获批、真实键盘 / 焦点 / 浏览器验收或产品采用；旧状态尚未全部转译到新方向。
- 当前只推进本仓设计与研究整理，不改兄弟仓文档、参考图、依赖、token 或产品代码，也不自动建立产品迁移分支。
- 本仓设计使用的受限参考副本保留在已确认的仓库外本地私有库，不建 Git、不上传；来源仓原图与原入口已恢复。私人材料排除，外部截图不进 `.pen`、产品或本仓公开素材。
- 没有推送、远端 PR / 合并、发行、部署、DNS 或托管变更；上一轮四仓临时分支已删除，没有待提交的跨仓迁移。
- 视觉批准之后再确认组件 / token 实施范围；正式包和多平台能力仍按独立出口验收。
