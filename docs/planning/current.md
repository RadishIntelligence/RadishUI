# 当前规划

更新日期：2026-11-03。

## 当前范围

最小工程已建立：npm workspaces、JSON token 与 CSS 生成、React Button、独立展示站和必要检查。当前补齐协作、规划与组织贡献流程，下一产品方向仍是确认视觉基准与首批复用范围。

长期目标和阶段出口见[整体规划](roadmap.md)，四个大专题与子专题归属见[专题地图](topics.md)；本页只维护当前顺位，不复制子专题任务表。

本地构建、依赖审计和代表双端浏览器检查已完成，详见[本周记录](../devlogs/2026-W45.md)。

`RadishIntelligence/RadishUI` 已连接并推送 `master` / `dev`，GitHub 默认分支为 `master`。首次 Vercel 生产部署已完成并通过公开页面与静态资源访问检查，当前首选地址为 [ui.radishx.com](https://ui.radishx.com/)，HTML canonical 与分享 URL 同步使用新域名。GitHub Pages 保留为备选，未启用；版本与验收快照见[部署说明](../deployment/hosting.md)。

所有者于 2026-11-02 完成域名绑定与 Vercel 名称调整；当前控制台为 `DaBaiLuoBo / radish-ui`。本批同步官网和组织入口，保留既有工程预览边界；真实 Chrome 已访问新域名，命令行请求的 Cloudflare 403 限制见部署说明。

当前活跃子专题为 [G-01 仓库与协作治理](../development/repository-governance.md#实施与验收)。2026-11-03 的上一批通用治理基础已本地提交 `e4275da`；本轮仔细复核五个兄弟项目的 AGENTS/CLAUDE 后，补充启动约束、三级规划及组织成员 `topic → dev` 流程。详细实施状态在 G-01，审阅与验证事实在[本周记录](../devlogs/2026-W45.md)。

本轮已获提交、推送、验证 PR、落实远端设置、合并与回流授权。治理提交已推送到 `dev`；PR #3 已有真实成功运行，隔离 PR #4 已验证类型错误使 Web Build 与 Candidate Quality 失败并关闭。远端已关闭 squash，启用精确保护 master 的 Ruleset `26446452`，检查来源绑定实际 GitHub Actions `15368`。稳定晋级正通过 [PR #3](https://github.com/RadishIntelligence/RadishUI/pull/3) 推进；最终合并、回流与部署结果以执行记录为准。

## 后续顺位

1. 完成 PR #3 最终候选检查、稳定主线合并、dev 回流与部署核验，记录收口结果。
2. 确认家族视觉代表页、首批组件和产品接入范围。
3. 核查现有 family-ui 和产品内组件，选择可复用部分，明确设计来源与许可。
4. 在真实页面验证首批组件，再扩展 Flutter。
5. 按实际交付范围确定公开包名、版本与发行流程。

## 当前停止线

- 工程预览不代表家族正式视觉定稿，不代表产品已完成接入。
- 不在本轮整包迁移既有 UI，不一次性实现全部平台和组件。
- 不发布 npm / pub.dev 包，不创建 Release，不升级付费套餐；本轮不修改已有域名、DNS 或托管设置。
- 远端规则保护按本批模板与启用顺序实施，写入前确认精确差异与对应授权；GitHub Pages 自动发布仍未启用，不以模板冒充已启用配置。
