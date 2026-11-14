# 参与 RadishUI

RadishUI 维护家族共享的视觉基础、跨平台组件和页面范例。贡献应解决可复用的界面问题；产品业务、接口客户端、权限、路由和领域状态留在产品仓库。

## 开始贡献

1. 阅读 [当前规划](docs/planning/current.md)、[专题地图](docs/planning/topics.md)、[架构](docs/architecture/overview.md)和[设计系统契约](docs/development/design-system.md)。
2. 缺陷提供最小复现；新组件、token 语义、公共 API、依赖或平台范围变化先说明真实使用场景、影响和验证方式。
3. 其他组织成员与外部贡献者从最新 `origin/dev` 建立个人主题分支，完成后通过 PR 合回 `dev`，不直接 push 工作提交到共享 `dev` 或 `master`。只有萝卜SAMA本人或明确授权执行同一串行维护任务的 AI 可直接维护 `dev`。成员获授本仓库 `Write` 后可推送个人分支，但无权直接更新或合并到 `dev/master`；PR 由萝卜SAMA审阅并合并。新成员的仓库写权限需单独授予，不因加入组织自动获得。具体命令与并发同步见[组织成员流程](docs/development/repository-governance.md#组织成员的分支流程)。GitHub 默认分支仍为 `master`，创建 PR 时需主动核对目标。
4. 使用 Node.js 24 和仓库根 `package-lock.json`；安装依赖用 `npm ci`，不要另建 workspace 锁文件。AI 执行安装仍遵循[协作授权](docs/development/collaboration.md)。
5. 稳定晋级由萝卜SAMA通过 `dev → master` PR 执行，必须通过主线 CI，优先 merge commit；合并后先回流 `dev`。细节见 [ADR 0001](docs/adr/0001-branch-and-pr-governance.md)。

## 提交信息

格式为 `type(scope): 描述`，scope 可省略，破坏性变更用 `!` 并在正文说明影响与迁移。

允许类型：`feat`、`fix`、`docs`、`style`、`refactor`、`perf`、`test`、`build`、`ci`、`chore`、`revert`。例如 `fix(react): 修正 Button 加载态焦点行为`。`style` 适用于代码格式；组件外观与行为变化按实际影响使用 `feat` / `fix`。

正常多父 merge commit 由 Git 生成，不要求改写为上述格式；单父提交不得用伪造的 merge 标题避开校验。使用当前贡献者 Git 身份，不附加 AI 署名，不重写共享历史。

## 验证与 PR

提交前运行 `npm run build`。只改文档时至少运行 `npm run check:repo`、`npm run test:repo`；PR 的 CI 仍执行全部现有检查。

- token 改动执行 `npm run tokens:generate`，一起提交 JSON 来源和 CSS 产物。
- 视觉改动提供桌面、窄屏、明暗主题和适用关键状态的前后证据；键盘、焦点、可访问名称与禁用 / 加载行为同样需要验证。
- 说明实际执行的命令、环境、结果和未覆盖范围。构建成功不代表视觉获批、Flutter 可用或产品已接入。
- 使用 [PR 模板](.github/PULL_REQUEST_TEMPLATE.md)记录影响、验证、风险和回滚。面向 `master` 时填写回流负责人及方式。

## 来源、许可与社区

提交前确认你有权提交相关材料。提交的贡献按[根 LICENSE](LICENSE)第 4 节授权，另有书面约定的除外。引入第三方或兄弟项目代码、字体、图标和素材时说明来源、版本、适用许可与采用范围，由维护者确认。

安全问题遵循 [SECURITY.md](SECURITY.md)；日常讨论遵循 [行为规范](CODE_OF_CONDUCT.md)。
