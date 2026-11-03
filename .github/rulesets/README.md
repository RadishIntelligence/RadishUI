# GitHub 设置与 Rulesets

本目录和 [repository-settings.json](../repository-settings.json) 是可审阅模板，GitHub 不会自动应用它们。`enforcement: active` 表示导入后的目标，不表示现在已启用。政策见 [ADR 0001](../../docs/adr/0001-branch-and-pr-governance.md)，实际状态见[当前规划](../../docs/planning/current.md)及[开发记录](../../docs/devlogs/2026-W45.md)。

2026-11-03 本仓库已实际启用 Ruleset `26446452`，完成真实 PR 成功 / 失败路径核验、主线合并及 dev 回流。未来修改模板仍需按本页流程另行核对并应用，不会自动同步远端。

## 模板目标

仅保护 `refs/heads/master`，不匹配 `dev`、`main` 或 tag：

- 必须 PR，解决所有 review conversation；单人阶段审批数为 `0`，不要求 CODEOWNERS、最后推送人批准或签名。
- 禁止删除、non-fast-forward 和直接 push；管理员角色 ID `5` 仅有 `pull_request` bypass，用于有记录的应急处置，不用于常规跳过 CI。
- 严格要求最新基线的 `Candidate Quality`，来源绑定已在真实 PR 核实的 GitHub Actions（`integration_id: 15368`）；分支创建不豁免检查。
- 允许 merge / rebase，不允许 squash，不要求线性历史；晋级优先 merge commit，之后必须回流 `dev`。
- 不添加提交信息正则；PR commit range 由仓库检查器验证，正常 merge commit 例外。

仓库设置模板保持默认分支 `master`、允许 merge / rebase、关闭 squash 和合并后自动删除源分支。当前模板不修改其他安全能力、Actions 权限、DNS 或 Vercel 设置。`dev` 暂不保护；多人维护、持续外部贡献、并行共享分支写入或实际绕过事故发生后复核。

组织成员协作必须从最新远端 `dev` 建个人主题分支，通过 PR 合回 `dev`；`dev` 没有服务端保护不代表允许绕过此流程。只有所有者本人或明确授权的同一串行维护任务 AI 可直接维护 `dev`。该政策不由本 `master` 模板强制，真实多人参与时另行确认 `dev` 保护及所有者例外的精确实施。

## 启用顺序

1. 完成仓库内文件和本地构建，明确远端精确差异与当前任务授权。
2. 推送治理提交到 `dev` 并创建 `dev → master` PR；在启用 required check 前，让真实 PR 产生 `Repo Hygiene`、`Web Build`、`Candidate Quality`。首次 PR 可运行 PR 自带工作流，不必先绕过主线直推。
3. 核对成功路径，并使用有限测试变更验证组件失败会阻断聚合；查看聚合取消 / 跳过处理。记录 run URL、head SHA、合并候选 SHA、结论和未验证面。本地 shell 测试不冒充 GitHub 调度验收。
4. 读取仓库设置、规则列表（含组织继承规则）、经典 branch protection 和 `master` 生效规则，保存调整前快照到忽略目录 `output/governance/<日期>/`。缺权限或读取失败不代表规则为空。
5. 比较设置模板，只应用已确认的字段。查明已有 Ruleset ID；已有同范围规则则精确更新，不重复创建或覆盖未知组织规则。
6. 确认 context 名与真实来源后启用 Ruleset。2026-11-03 的 PR #3 已产生 GitHub Actions `Candidate Quality`，实际 App ID 为 `15368`，模板与检查器已同步绑定；今后复用或迁移仍须核对真实来源，不凭空填写或改回任意来源。
7. 在 PR 上核对 strict 基线、会话解决与合并限制；通过读取服务端规则确认直接 push / 删除 / 强推限制，不以破坏性真实写入测试主线。获准合并后回流 `dev`，读取最终设置并记录。

以下是获授权后的命令参考，本文不会执行写入：

```bash
# 只读现状（规则列表需同时检查继承规则）
gh api repos/RadishIntelligence/RadishUI
gh api 'repos/RadishIntelligence/RadishUI/rulesets?includes_parents=true'
gh api repos/RadishIntelligence/RadishUI/branches/master/protection
gh api repos/RadishIntelligence/RadishUI/rules/branches/master

# 仅在快照、差异和授权核对后应用五个仓库设置字段
gh api repos/RadishIntelligence/RadishUI --method PATCH \
  --input .github/repository-settings.json

# 仅在确认不存在同范围规则时创建
gh api repos/RadishIntelligence/RadishUI/rulesets --method POST \
  --input .github/rulesets/master-protection.json
```

若存在规则，用已确认的具体 ID 调用 `PUT /repos/RadishIntelligence/RadishUI/rulesets/{ruleset_id}`，先构造保留授权范围外设置的请求体。不要将响应中的只读字段原样当成更新 payload。

## 回滚与边界

远端回滚需要对应授权：恢复快照中的可写设置；更新既有 Ruleset 的原值，或仅禁用本次新建的精确 Ruleset ID。先诊断 context 缺失、配置错误或调度失败，不通过删除 required check 掩盖真实失败。仓库内问题以新修复或 revert 提交处理，不 force push 共享历史。

本工作流没有部署、Release、包发布或 tag 触发；Vercel Git 集成独立存在，`dev` push 可能产生预览，合并到 `master` 会触发生产部署。私密漏洞报告和安全扫描属于另一组远端设置；本模板不会替维护者开启它们。

## 来源与官方参考

本批工作流只引入 GitHub 官方 Actions，固定到核实的完整提交：

- [actions/checkout v5](https://github.com/actions/checkout/tree/fbc6f3992d24b796d5a048ff273f7fcc4a7b6c09)，MIT，用于临时 runner 获取源码。
- [actions/setup-node v6](https://github.com/actions/setup-node/tree/249970729cb0ef3589644e2896645e5dc5ba9c38)，MIT，用于 Node 24 环境；不新增项目 npm 依赖。

核对日期为 2026-11-03；SHA 固定不等于持续安全审计，升级时重新核对来源、输入与运行要求。

GitHub 官方依据：[Rules API](https://docs.github.com/en/rest/repos/rules)、[可用 Ruleset 规则](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)、[Actions 安全使用](https://docs.github.com/en/actions/reference/security/secure-use)。模板字段、strict 与 bypass 含义随平台演进，远端写入前按实际 API 再核对。
