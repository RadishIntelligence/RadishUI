# ADR 0001：分支、PR 与仓库治理

日期：2026-11-03。状态：接受（仓库内政策）；远端强制状态以[当前规划](../planning/current.md)和[执行记录](../devlogs/2026-W45.md)为准。

## 背景与取舍

RadishUI 已有 `master` / `dev`、真实构建和 Vercel 展示站，需要让稳定主线、开发进度和跨产品影响可审阅。参考五个兄弟项目的治理原则，按本仓库的 npm workspaces、token 和 UI 边界重新编写；不搬入后端、数据库、Godot、Rust、语言证明或产品发布门禁。

## 决策

- `master` 保持 GitHub 默认稳定分支，仅通过 PR 接收阶段性晋级或必要 hotfix；`dev` 承接共享开发集成。
- 本仓库归属 `RadishIntelligence` 组织。其他组织成员及其 AI 必须从最新远端 `dev` 建立各自主题分支，完成验证后通过 `topic → dev` PR 合回，不直接向共享 `dev` 或 `master` 推送工作提交。AI 需要分支时使用 `codex/<成员或主题>`；人工可使用 `feature/*`、`fix/*`、`docs/*`、`chore/*`。
- 萝卜SAMA本人或明确授权执行同一串行维护任务的 AI 可直接在 `dev` 推进；该例外不适用于其他组织成员，串行任务只有并行、风险隔离或明确评审需求才另建主题分支或 worktree。`hotfix/*` 只用于稳定主线的紧急修复。
- 阶段性晋级采用 `dev → master → dev`。优先 merge commit，允许 rebase merge，禁用 squash merge，以保留可审计提交及稳定主线回流关系；不要求线性历史。
- 任意 `master` PR 合并后，在下一轮 `dev` 开发前完成回流并核对远端祖先关系。能快进则快进，否则普通 merge；禁止 rebase、reset 或 force push 改写共享 `dev`。
- 单人阶段审批数为 `0`，要求解决 review conversation；不以管理员 bypass 作为常规合并方式。管理员仅在 PR 内有应急绕过资格，使用原因和缺失证据必须留痕。
- `master` 禁止删除、强推和直接 push；required context 为 strict/up-to-date 的 `Candidate Quality`。`dev` 暂不配置服务端强制保护，组织成员仍遵守分支 PR 政策，所有者串行维护承担本地验证责任。
- PR 目标为 `dev` / `master` 时运行 `PR Checks`，并保留手动触发；普通 push / tag 不触发该 Actions 工作流。Vercel 的 Git 集成独立运行，`dev` push 仍可能产生预览，`master` 合并会触发生产部署。
- 聚合门禁包含 `Repo Hygiene` 与 `Web Build`，二者必须成功；失败、取消、跳过和缺失结果均拒绝。没有路径过滤或占位成功 job，尚未实现的 Flutter 不加入门禁。
- Conventional Commits 在 PR 的实际提交区间校验，不添加远端提交信息正则，避免阻断 GitHub 生成的 merge commit。

## 分阶段落地

先交付仓库文件、本地检查和工作流，再在真实 PR 上验证聚合成功与失败传播；确认 context 已产生之后，才启用远端 Ruleset。模板不会自动应用，远端写入需要当前任务的具体授权。步骤与回滚见 [Rulesets 说明](../../.github/rulesets/README.md)。

当前不创建装饰性 CODEOWNERS、不强制签名、不创建 tag 保护或包发布流程。形成真实多人评审安排、持续外部贡献、并行共享分支写入或门禁绕过事故后，重新评估 `dev` 保护及审批数。

## 影响与维护

稳定主线有单一检查入口，日常开发保留低开销；代价是每次晋级都需要回流，且未保护的 `dev` 依赖维护者执行本地验证。合并和回流不代表组件包发布授权；当前 `master` 的 Vercel 自动部署副作用必须在合并授权时说明。

修改分支、合并方式、required context、审批或绕过范围时，同步[仓库治理](../development/repository-governance.md)、Ruleset 与设置模板、PR 模板、工作流和检查器；只在根入口保留必须立即生效的长期约束。
