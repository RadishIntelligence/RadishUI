# RadishUI

Radish 家族共享设计系统：集中维护视觉基础、通用组件与可运行的界面范例，让设计改进通过版本升级服务多个产品。

已实现以 Workbench 为单一入口的本地 Web 范例：概览、视觉基础、组件用法、平台与接入，以及资源库、设置和文档三页演示；亮暗语义 token、24 个共享 React 组件。使用本地合成数据，不接产品服务；运行效果待评审，下一步建议见[当前规划](docs/planning/current.md)，组件包尚未发布，Flutter 暂为预留目录。

## 项目结构

```text
apps/docs/            React + Vite 静态文档与组件展示
packages/tokens/      JSON token 来源与生成的 CSS
packages/react/       React 组件与样式
packages/flutter/     Flutter 接入边界，尚无可运行包
scripts/              仓库、模型、token 与第三方声明检查
docs/                 规划、架构、协作、部署与开发记录
```

## 本地开发

使用 Node.js 24；在仓库根目录执行：

```bash
npm ci
npm run dev
```

展示站默认使用 `http://127.0.0.1:4510`。验证与构建：

```bash
npm run build
```

构建包含仓库与治理自测、工作面模型测试、token / 第三方声明核对、TypeScript 和 Vite 静态构建，输出为 `apps/docs/dist`。修改 token 后执行 `npm run tokens:generate`；调整运行时依赖后执行 `npm run notices:generate`，分别保留来源与生成产物。

## 协作与接入

- `dev` 为开发集成分支，`master` 为稳定主线；其他组织成员从最新远端 `dev` 建个人主题分支，通过 PR 合回 `dev`。所有者本人或明确授权的串行维护 AI 可直接在 `dev` 推进。
- 稳定晋级通过 PR，优先 merge commit；主线合并后先回流 `dev`。PR 检查和 `master` Ruleset 已实际启用，验收事实与后续状态以当前规划和开发记录为准。
- 展示站直接消费本仓库的组件与 token，不另外实现演示组件。
- workspace 包名为工程内部名称，全部设置 `private: true`；不代表公开包名或兼容范围已经冻结。
- 现阶段 React 工程使用 React 19；Ink 的 React 18 兼容留待专门验证。
- 产品业务、权限、接口、路由和领域状态由各产品维护。
- 许可、正式发行与跨产品迁移另行决定，本轮没有发布组件包。

## 文档与托管

在线工程预览：[ui.radishx.com](https://ui.radishx.com/)。本轮工作区尚未部署，线上仍是此前 master 的工程预览；当前实现与验收见[三代表页专题](docs/features/workbench-preview.md)。

[整体规划](docs/planning/roadmap.md) · [专题地图](docs/planning/topics.md) · [当前规划](docs/planning/current.md) · [文档索引](docs/README.md) · [架构](docs/architecture/overview.md) · [协作方式](docs/development/collaboration.md) · [仓库治理](docs/development/repository-governance.md) · [设计系统契约](docs/development/design-system.md) · [版本策略](docs/development/versioning.md) · [贡献指南](CONTRIBUTING.md) · [部署说明](docs/deployment/hosting.md)

仓库：[RadishIntelligence/RadishUI](https://github.com/RadishIntelligence/RadishUI)。展示站首选 Vercel，GitHub Pages 作为备选；RadishX 提供介绍与入口。具体执行与验证状态以当前规划和部署说明为准。
