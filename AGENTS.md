# RadishUI AI 协作入口

本文件为 AI 协作者提供 RadishUI 的启动级长期约束。

## 基本协作

- 默认中文沟通与文档记录，称呼项目所有者为「萝卜SAMA」。
- 开始前检查工作区，按需读取 `docs/planning/current.md` 与相关专题，不覆盖无关改动。
- `docs/` 是正式规则来源；根入口只放跨任务长期约束。
- 需求清楚、风险可控的已授权工作直接实施；共享 API、token 语义、依赖、架构或发行范围发生实质变化时，先说明影响并确认。
- 安装依赖、启动长期进程、推送、远程设置与部署须有当前任务对应授权；已有明确授权不重复询问。

## 项目边界

- RadishUI 提供通用视觉基础、跨平台组件与展示范例，不承接产品业务、HTTP 客户端、权限和路由。
- React 与 Flutter 分别实现；平台行为可以不同，设计语义与关键状态保持对应。
- token 来源为 `packages/tokens/src/tokens.json`，CSS 由脚本生成；不手改生成产物。
- 展示站使用真实共享组件，不复制一份演示实现。未验证的平台与能力明确标注。
- `.pen` 只能通过 Pencil 读写；素材、字体、依赖与兄弟项目代码的引入先确认来源和范围。

## 开发与验证

- 日常开发使用 `dev`，`master` 为稳定主线；主题分支与 worktree 仅在确有隔离或并行需要时使用。
- 不破坏共享 Git 历史，不修改全局 Git 配置，使用当前用户 Git 身份，不附加 AI 署名。
- 使用 Conventional Commits；提交、推送、发布与部署分别依据当前授权范围执行。
- 验证入口以 `package.json` 为准；视觉变更检查桌面、窄屏、明暗和关键状态，自动检查不能替代视觉确认。
- 变更规则时同步相关 `docs/`；验证事实与遗留限制写入 `docs/devlogs/`。
- 本文件与 `CLAUDE.md` 除标题和入口说明外保持同步，使用 `npm run check:repo` 验证。

## 按任务读取

- 执行、授权与文档归位：[协作规范](docs/development/collaboration.md)。
- Git、PR、CI 与远端规则：[仓库治理](docs/development/repository-governance.md)、[ADR 0001](docs/adr/0001-branch-and-pr-governance.md)。
- token、组件、视觉与产品接入：[设计系统契约](docs/development/design-system.md)、[架构](docs/architecture/overview.md)。
- 当前状态与执行证据：[当前规划](docs/planning/current.md)、`docs/devlogs/`；不把临时门禁或历史流水加入根入口。
