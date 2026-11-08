# GitHub 设置与 Rulesets

本目录和 [repository-settings.json](../repository-settings.json) 是可审阅模板，GitHub 不会自动应用它们。`enforcement: active` 表示导入目标；实际状态见[当前规划](../../docs/planning/current.md)及[开发记录](../../docs/devlogs/2026-W45.md)。政策见 [ADR 0001](../../docs/adr/0001-branch-and-pr-governance.md)。

## 模板目标

2026-11-06 的目标为所有者统一集成。四份 branch Ruleset 叠加，不使用仓库范围的 push ruleset，不匹配 `main` 或 tag：

| 模板 | 分支 | 规则 | 绕过 |
| --- | --- | --- | --- |
| [shared-branch-protection.json](shared-branch-protection.json) | dev/master | 禁止删除、non-fast-forward | 无 |
| [dev-access.json](dev-access.json) | dev | 限制更新 | 仅所有者团队，`always` |
| [master-access.json](master-access.json) | master | 限制更新 | 仅所有者团队，`pull_request` |
| [master-protection.json](master-protection.json) | master | PR、严格 CI、会话解决 | 无 |

团队为 `RadishIntelligence/radishui-maintainers`，ID `20555210`，仅含所有者，隐私为 `closed`、无父 / 子团队，并获本仓库 `Write`。团队成员变化会改变共享分支更新资格，需单独授权；不要添加普通开发者、宽泛仓库角色或 App。模板固定真实 Team ID，迁移仓库时必须重新核对，而不是直接导入其他组织。普通成员单独获授本仓库 `Write`，可推送自己的主题分支，但无法直接更新或合并到 dev/master；新组织成员不会自动获得本仓库写权限。不要扩大组织默认权限。

master 必须 PR，审批数保持 `0`，避免所有者创建晋级 PR 后无法批准自己的 PR。要求解决全部 review conversation；不要求 CODEOWNERS、最后推送人批准或签名。严格要求最新基线的 `Candidate Quality`，来源绑定已在真实 PR 核实的 GitHub Actions（`integration_id: 15368`）；分支创建不豁免检查。质量规则无绕过者，更新权限中的 PR 例外不豁免这份质量规则。

dev 保留所有者直推，不配置 required checks；当前工作流仅对 PR / 手动调度执行。成员 PR 的 CI 和会话仍由所有者合并前检查，这是协作要求，不是 dev 的服务端强制门禁。所有者直推前负责本地验证；AI 不因身份可绕过而扩大当前会话授权。

仓库设置保持默认分支 `master`、允许 merge / rebase、关闭 squash 和合并后自动删除源分支。晋级优先 merge commit，之后回流 dev；不要求线性历史，不添加提交信息正则，真实 PR commit range 由仓库检查器验证。

## 更新与验收顺序

1. 核对当前任务授权、实际账号和组织所有者，读取仓库设置、含继承规则的 Ruleset 列表、两条分支的经典 branch protection 与生效规则，以及团队 / 成员的有效权限。缺权限或请求失败不能当作空列表。
2. 在忽略目录 `output/governance/<日期>/before/` 保存修改前快照；只保存必要配置和账号标识，不保存凭据。构造精确请求到 `requests/`，响应与最终核对保存到 `after/`。
3. 同步规范、模板和检查器，运行 `npm run check:repo` 与 `npm run test:repo`。首次引入 required context 时必须先有真实 PR 运行证据；当前 master 的 `Candidate Quality` 已由 2026-11-03 的 PR #3 核实，无须为纯权限调整新建测试 PR。
4. 确保维护者团队仅含所有者且有本仓库 Write。先新增无绕过的历史保护，再新增 dev/master 更新限制；最后精确更新既有 master Ruleset `26446452`，移除原管理员 bypass 和已移入公共规则的历史保护，保留既有 PR 参数与检查来源。不要覆盖未知组织规则。
5. 确认共享分支限制生效后，再按已授权成员范围授予本仓库 Write。普通成员不授予 Admin、规则管理权限或维护者团队资格；不改组织默认权限。
6. 读取最终 Ruleset（含 bypass）、团队完整成员、仓库权限与两条分支生效规则，逐项比对模板。确认 dev/master 都有 update、deletion 和 non-fast-forward；master 另有 PR / required checks，只有所有者可绕过更新规则。普通功能分支应不命中这些保护。
7. 不以真实强推、删除、主线直推或绕过失败 CI 测试生产分支。服务端配置核对不等于普通成员身份下的真实拒绝测试；没有该身份或隔离测试授权时如实记录未覆盖面。确认分支 SHA 未因设置修改发生变化。

只读检查参考：

```bash
gh api 'repos/RadishIntelligence/RadishUI/rulesets?includes_parents=true'
gh api repos/RadishIntelligence/RadishUI/rules/branches/dev
gh api repos/RadishIntelligence/RadishUI/rules/branches/master
gh api orgs/RadishIntelligence/teams/radishui-maintainers/members
```

获授权且完成快照 / 差异检查后，新规则使用 `POST /repos/RadishIntelligence/RadishUI/rulesets`；既有规则使用其具体 ID 的 `PUT`。输入只包含可写字段，不能把响应中的 ID、来源、时间等原样回传。仅当实际五字段设置与 [repository-settings.json](../repository-settings.json) 有差异时应用对应设置，不制造无变化的写入。

本批不要求推送源码或合并 PR；规范修改是否提交、推送仍分别按会话授权处理。当前存在的历史提交标题问题需独立解决，不能借本次权限调整放宽提交检查或绕过 master CI。

## 回滚与边界

远端回滚需对应授权。使用 before 快照恢复既有 master Ruleset 的可写字段，仅禁用本次新增的具体 Ruleset ID；先检查依赖与当前活动，避免先移除保护导致普通成员短暂获得共享分支写权限。恢复本次调整的成员权限时应保留原先已有的直接 / 团队授权，不删除无关权限；删除新建团队前先确认未被其他规则引用、未加入新成员或绑定其他仓库。

先诊断配置、context 或调度失败，不通过移除 required checks 掩盖失败。源码问题用修复或 revert 提交处理，不 force push 共享历史。拥有规则管理权限的人能修改规则，因此“只有所有者可集成”也依赖该权限不授予普通成员。

规则修改本身不推送分支、不部署、不创建 Release 或 tag。Vercel Git 集成独立存在，dev push 可能产生预览，master 合并会触发生产部署；DNS、托管、安全扫描与包发布均不在本批范围。

## 来源与官方参考

本批工作流只引入 GitHub 官方 Actions，固定到核实的完整提交：

- [actions/checkout v5](https://github.com/actions/checkout/tree/fbc6f3992d24b796d5a048ff273f7fcc4a7b6c09)，MIT，用于临时 runner 获取源码。
- [actions/setup-node v6](https://github.com/actions/setup-node/tree/249970729cb0ef3589644e2896645e5dc5ba9c38)，MIT，用于 Node 24 环境；不新增项目 npm 依赖。

核对日期为 2026-11-03；SHA 固定不等于持续安全审计，升级时重新核对来源、输入与运行要求。

GitHub 官方依据：[Rules API](https://docs.github.com/en/rest/repos/rules)、[可用 Ruleset 规则](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)、[Actions 安全使用](https://docs.github.com/en/actions/reference/security/secure-use)。模板字段、strict 与 bypass 含义随平台演进，远端写入前按实际 API 再核对。

2026-11-06 规则更新依据另核对 [Ruleset 叠加](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)、[团队与 PR-only bypass](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository)及 [Teams API](https://docs.github.com/en/rest/teams/teams)。更新限制请求显式设置 `update_allows_fetch_and_merge: false`；本仓库 API 回读省略该默认参数，比对时只对该缺省 false 做归一化，不忽略显式 true 或其他差异。
