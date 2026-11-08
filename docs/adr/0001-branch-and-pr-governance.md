# ADR 0001：分支、PR 与仓库治理

日期：2026-11-03；2026-11-06 修订为所有者集成与 dev/master 分层保护。状态：接受；远端强制状态以[当前规划](../planning/current.md)和[执行记录](../devlogs/2026-W45.md)为准。

## 背景与取舍

RadishUI 已有 `master` / `dev`、真实构建和 Vercel 展示站，需要让稳定主线、开发进度和跨产品影响可审阅。参考五个兄弟项目的治理原则，按本仓库的 npm workspaces、token 和 UI 边界重新编写；不搬入后端、数据库、Godot、Rust、语言证明或产品发布门禁。

## 决策

- `master` 保持 GitHub 默认稳定分支，仅通过 PR 接收阶段性晋级或必要 hotfix；`dev` 承接共享开发集成。
- 本仓库归属 `RadishIntelligence` 组织。其他组织成员及其 AI 必须从最新远端 `dev` 建立各自主题分支，完成验证后通过 `topic → dev` PR 合回，不直接向共享 `dev` 或 `master` 推送工作提交。AI 需要分支时使用 `codex/<成员或主题>`；人工可使用 `feature/*`、`fix/*`、`docs/*`、`chore/*`。
- 萝卜SAMA本人或明确授权执行同一串行维护任务的 AI 可直接在 `dev` 推进；该例外不适用于其他组织成员，串行任务只有并行、风险隔离或明确评审需求才另建主题分支或 worktree。`hotfix/*` 只用于稳定主线的紧急修复。
- 阶段性晋级采用 `dev → master → dev`。优先 merge commit，允许 rebase merge，禁用 squash merge，以保留可审计提交及稳定主线回流关系；不要求线性历史。
- 任意 `master` PR 合并后，在下一轮 `dev` 开发前完成回流并核对远端祖先关系。能快进则快进，否则普通 merge；禁止 rebase、reset 或 force push 改写共享 `dev`。
- `dev/master` 的 PR 只由萝卜SAMA审阅并合并；其他成员仅获本仓库 `Write`，不能自行合并或管理规则。只含所有者的维护者团队承载更新例外，不以管理员角色、普通写角色或 App 批量放行。审批数为 `0`，避免所有者创建晋级 PR 后无法自审；dev 的审阅、CI 与会话解决由所有者合并前确认，master 的 PR / CI / 会话门禁独立强制。
- 四份 Ruleset 分离历史保护、dev 更新权限、master 更新权限和 master 质量门禁。dev 更新只允许所有者团队 `always` 绕过；master 更新只允许该团队 `pull_request` 绕过。禁止删除 / 强推对两条分支独立生效，无绕过者。master 必须 PR，required context 为 strict/up-to-date 的 `Candidate Quality`，不保留管理员绕过质量检查的例外。
- `dev` 所有者直推承担本地验证责任，不增加 required checks，以免当前仅在 PR 触发的 CI 阻断正常直推。成员贡献仍必须 PR，由所有者检查最新候选后合并；这项 CI 要求属于协作政策，不冒充 dev 的服务端门禁。
- PR 目标为 `dev` / `master` 时运行 `PR Checks`，并保留手动触发；普通 push / tag 不触发该 Actions 工作流。Vercel 的 Git 集成独立运行，`dev` push 仍可能产生预览，`master` 合并会触发生产部署。
- 聚合门禁包含 `Repo Hygiene` 与 `Web Build`，二者必须成功；失败、取消、跳过和缺失结果均拒绝。没有路径过滤或占位成功 job，尚未实现的 Flutter 不加入门禁。
- Conventional Commits 在 PR 的实际提交区间校验，不添加远端提交信息正则，避免阻断 GitHub 生成的 merge commit。2026-11-08 核准的三条设计历史标题按完整 SHA 识别，见[仓库治理](../development/repository-governance.md#验证入口与-ci)。

## 分阶段落地

先交付仓库文件、本地检查和工作流，再在真实 PR 上验证聚合成功与失败传播；确认 context 已产生之后，才启用远端 Ruleset。模板不会自动应用，远端写入需要当前任务的具体授权。步骤与回滚见 [Rulesets 说明](../../.github/rulesets/README.md)。

2026-11-06 所有者明确要求进入多人贡献、所有者统一集成模式，替代初版“dev 暂不保护、master 管理员 PR bypass”的政策。继续不创建装饰性 CODEOWNERS、不强制签名、不创建 tag 保护或包发布流程。若未来增加维护者或要求 dev 的每次更新都经服务端 CI，再单独调整团队和直推策略。

## 影响与维护

稳定主线有单一检查入口，成员无法自行更新共享分支；所有者保留 dev 直推的低开销。代价是审阅与合并集中在所有者，每次晋级都需要回流，且 dev 直推仍依赖本地验证。规则管理权限可以改变这些限制，因此其他成员不授予该权限。合并和回流不代表组件包发布授权；当前 `master` 的 Vercel 自动部署副作用必须在合并授权时说明。

修改分支、合并方式、required context、审批或绕过范围时，同步[仓库治理](../development/repository-governance.md)、Ruleset 与设置模板、PR 模板、工作流和检查器；只在根入口保留必须立即生效的长期约束。
