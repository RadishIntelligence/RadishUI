# 仓库、Git 与自动化治理

本规范实施 [ADR 0001](../adr/0001-branch-and-pr-governance.md)。仓库文件声明目标政策；GitHub 实际设置决定服务端强制效果，当前状态由[当前规划](../planning/current.md)引用日期化记录。

## 基础文件

| 文件 | 职责 |
| --- | --- |
| `AGENTS.md` / `CLAUDE.md` | 简短协作入口与任务路由，正文同步 |
| `CONTRIBUTING.md`、`CODE_OF_CONDUCT.md`、`SECURITY.md` | 贡献、行为、安全报告边界 |
| `.editorconfig` / `.gitattributes` | UTF-8、LF、末尾换行；二进制与 Pencil 不做文本合并 |
| `.gitignore` | 本地 IDE、凭据、缓存、构建与验证输出；保留 token CSS 产物例外 |
| `.github/ISSUE_TEMPLATE/` 与 PR 模板 | 复现、变更提案、兼容与验证、回流责任 |
| `.github/workflows/pr-check.yml` | 现有工程能力的 PR 检查 |
| `.github/rulesets/` 与 `.github/repository-settings.json` | 可审阅的远端目标模板，均不自动生效 |

当前不新增 `LICENSE` 或声明开源许可。字体、图标、截图、第三方和兄弟项目资产须逐项确认来源与许可；公共仓库、内部 workspace 包名和 `0.1.0` 均不代表发行承诺。

## Git 与 PR 闭环

`master` 是默认稳定主线，`dev` 是共享开发集成分支。其他组织成员从最新 `origin/dev` 建个人主题分支，通过 PR 合回 `dev`；只有萝卜SAMA本人或明确授权执行同一串行维护任务的 AI 可直接在 `dev` 维护。GitHub 默认 PR 目标可能是 `master`，发起时必须核对。暂存、提交和推送只包含本次任务的精确路径；提交使用当前用户身份和 [Conventional Commits](../../CONTRIBUTING.md#提交信息)。不 amend 既有共享提交，不改全局 Git 配置。

### 组织成员的分支流程

取得仓库协作权限后，先检查本地工作区并获取最新共享基线。以下为供成员执行的示例，`feature/member-button` 替换为实际成员和任务名；AI 创建隔离分支使用 `codex/<成员或主题>`。本例不是执行远端动作的自动授权。

```bash
git fetch origin
git switch --no-track -c feature/member-button origin/dev
# 完成范围内改动和本地验证后提交
git push -u origin feature/member-button
```

从 **最新远端 `dev`** 建分支，不从 `master`、过期本地 `dev` 或另一成员的未合并分支起步。完成后创建 `feature/member-button → dev` PR，不直接 push 工作提交到共享 `dev`，也不在本地自行合并后推送 `dev` 绕过 PR。

若开发期间 `dev` 前进，合并前重新 `git fetch origin`，在自己的主题分支使用 `git merge origin/dev` 同步，解决冲突后补匹配验证再推送；不得为同步改写共享分支历史。PR 说明起点 SHA、同步情况、影响与证据；维护者确认目标、范围、会话及 `Candidate Quality` 结果后合入 `dev`。合入 `dev` 不直接晋级 `master`。

组织协作流程是仓库政策；当前 `dev` 无服务端保护，不代表成员可跳过 PR。真实多人参与时复核审批与 `dev` 保护，远端设置需对应授权，不因文档修改自动启用。

### 稳定主线晋级与回流

稳定 PR 应说明共享 API、token、默认视觉与跨平台影响，实际验证、未验证面、风险和回滚；目标为 `master` 时还应说明 Vercel 自动部署影响及回流负责人。优先使用 merge commit；rebase merge 后仍以普通 merge 回流，不能改写共享历史。

主线合并后的操作示例（执行 push 前须已有对应授权，且工作区需允许安全切换）：

```bash
git fetch origin
git switch dev
git merge --ff-only origin/dev
git merge --ff-only origin/master
git push origin dev
git fetch origin
git merge-base --is-ancestor origin/master origin/dev
git rev-list --left-right --count origin/master...origin/dev
```

若第二次快进因 rebase merge 或并发开发失败，先检查分叉与范围，再使用 `git merge origin/master`，解决冲突并运行匹配验证后推送。禁止用 reset 或 force push 伪造同步。回流完成要求祖先检查成功、计数左侧为 `0`；紧接阶段晋级且无新增开发时预期为 `0 0`。远端已包含本地主线后才进入下一轮开发；本地成功不能代替远端核对。

## 验证入口与 CI

| 入口 | 覆盖 |
| --- | --- |
| `npm run check:repo` | 必需治理文件、协作同步、文本 / JSON / 文档链接、治理配置契约、工作区与暂存区 diff 空白 |
| `npm run test:repo` | 治理检查器的正常与拒绝用例 |
| `npm run check:repo -- --base-ref <base-sha> --head-ref <head-sha>` | 以上内容，加 PR 完整 diff 和真实 PR 提交信息；base 无效则失败 |
| `npm run check:tokens` | JSON 与生成 CSS 一致性 |
| `npm run type-check` | React、展示站、Vite 配置类型 |
| `npm run build` | 全部本地检查与展示站静态构建 |

`PR Checks` 对 `dev` / `master` 的 PR 和手动调度生效，不监听普通 push / tag，不以 paths 过滤跳过文档 PR。PR 默认检出 GitHub 的合并候选，构建目标分支与本次改动的组合；提交信息检查单独使用真实 base / head SHA，排除 GitHub 临时合并提交。

- `Repo Hygiene`：无需 npm 第三方依赖，运行仓库检查与检查器测试。
- `Web Build`：Node 24，`npm ci` 后执行 token、类型检查与展示站构建。只支持当前 React 工程，不推断其他平台可用。
- `Candidate Quality`：以 `if: always()` 汇总，所有组件必须为 `success`。required context 只绑定它，新增真实组件时同步聚合依赖与检查器。

工作流使用 `contents: read`、不持久化 checkout 凭据、GitHub 官方 Actions 的完整 SHA，不使用 `pull_request_target` 执行 PR 代码，不读取发布凭据或执行部署。依赖安装仅发生在配置的临时 CI runner；本地安装仍遵循协作授权。Actions 来源见[Rulesets 说明](../../.github/rulesets/README.md#来源与官方参考)。

CI 不进行人工视觉批准，也不验证 Flutter、React 18、真实产品接入或生产站点。视觉与交互验收遵循[设计系统契约](design-system.md)。

## 远端目标

仅保护 `master`：PR 必需，严格 `Candidate Quality`，解决会话，禁止删除 / 强推；单人审批数 `0`、无 CODEOWNERS，管理员 bypass 仅限 PR。保留 merge / rebase，关闭 squash；关闭合并后自动删源分支，避免晋级时删除长期 `dev`。默认分支保持 `master`，不静默切换为 `dev` 或新增 `main` 匹配。

远端模板、启用顺序、现状导出与回滚见 [Rulesets 说明](../../.github/rulesets/README.md)。只改 context 或合并选项时基于实际远端状态做精确差异，不直接覆盖组织规则、已有 bypass 或未知设置。

## 实施与验收

主要归属：[G：工程协作与交付](../planning/topics.md#engineering)，子专题 G-01。协作规范、ADR、模板与脚本为本专题的规范和实现来源；本表维护实施状态，日期化事实见[本周记录](../devlogs/2026-W45.md)。

| 工作项 | 状态 | 验收与证据 |
| --- | --- | --- |
| G-01.1 通用治理文件、PR 检查、模板与本地验证 | 已完成（仓库内基线） | 上一批提交 `e4275da`；本轮根入口、三级规划及成员流程补充见开发记录，未推送不算远端启用 |
| G-01.2 GitHub runner 的真实 PR 成功 / 失败传播 | 待开始 | 推送获准后记录真实 run URL、SHA、聚合结果；本地 shell 不能代替 |
| G-01.3 仓库合并选项与 master Ruleset 启用 | 待开始 | 先完成真实 context 验收，再按授权读写精确差异并记录最终远端状态 |

本地政策和模板交付不会关闭整个 G 大专题，也不代表未来包发行完成。

## 规则同步

| 变化 | 同步位置 |
| --- | --- |
| 分支、PR、合并或回流 | ADR、本文、PR 模板、Ruleset 与设置模板 |
| required context / CI 组件 | 工作流、检查器与测试、Ruleset、本文 |
| 协作或文档归位 | 两份根入口、协作专题、文档索引 |
| token、API、视觉与平台支持 | 设计系统契约、架构或相关组件专题、验证与接入记录 |
| 实际启用、远端变更和验证事实 | 当前规划摘要、本周开发记录 |

新增规则应有实际风险或协作需求；机器可判定的稳定政策进入检查器。不要复制兄弟项目的业务约束，也不为每次小改动新建平行台账。
