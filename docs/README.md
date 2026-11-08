# 文档入口

- [整体规划](planning/roadmap.md)：长期目标、阶段与完成条件。
- [专题地图](planning/topics.md)：四个大专题、子专题归属和唯一进度来源。
- [当前规划](planning/current.md)：当前状态、顺位与停止线。
- [架构](architecture/overview.md)：目录职责、技术与依赖边界。
- [协作](development/collaboration.md)：任务执行、授权、文档归位与交接。
- [仓库治理](development/repository-governance.md)：基础文件、Git / PR、验证与 CI 契约。
- [设计系统契约](development/design-system.md)：通用边界、token、组件、视觉验收和版本采用。
- [版本策略](development/versioning.md)：家族日历版本、npm 映射、tag 与发布前置。
- [F-02 视觉与资料归集方案](features/visual-baseline-proposal.md)：兄弟项目现状、视觉基准候选、代表页、首批组件与本仓研究进度（设计优先，跨仓尝试已撤回）。
- [家族设计资料](design/README.md)：通用基础、参考索引、原生候选及来源 / 撤回记录。
- [设计条例与约束](design/design-rules.md)：标题、交互辨识、密度与风格的默认规则，以及参考图提炼建议和适用例外。
- [首批 React 组件](features/react-workbench-components.md)、[三代表页运行范例](features/workbench-preview.md)：本仓实施合同、实际行为与验收进度。
- [ADR 0001](adr/0001-branch-and-pr-governance.md)：分支、合并、回流与 Ruleset 决策。
- [GitHub 设置与 Rulesets](../.github/rulesets/README.md)：远端目标、启用顺序和回滚。
- [初始化目标](features/bootstrap.md)：首批范围与验收。
- [部署](deployment/hosting.md)：Vercel 配置与 GitHub Pages 备选。
- [本周记录](devlogs/2026-W45.md)：日期化执行证据。

仓库对外入口：[贡献指南](../CONTRIBUTING.md)、[行为规范](../CODE_OF_CONDUCT.md)、[安全报告](../SECURITY.md)。根协作入口只放必须立即生效的长期规则，当前规划只放状态与顺位，验证事实进入开发记录。

## 规划与进度如何读取

整体规划 → 专题地图中的 F 视觉基础 / C 跨平台组件 / E 范例与采用 / G 工程交付 → 对应子专题。日常从 current 进入活跃子专题，详细任务状态只在子专题，地图和整体规划不另建进度副本。

| 文档类别 | 归属与职责 |
| --- | --- |
| `planning/roadmap.md` | 项目整体规划 |
| `planning/topics.md` 的四个稳定章节 | 大专题，定义价值、能力边界、依赖和完成条件 |
| [Token 基础](features/token-foundation.md)、[首批 React 组件](features/react-workbench-components.md)、[三代表页](features/workbench-preview.md)、视觉方案、仓库治理、部署说明、初始化验收 | 子专题，主要归属和状态入口在专题地图登记；P0 Button / 展示页保留历史验收身份 |
| 架构、设计系统契约、协作规范与 ADR | 专题共同引用的规范与决策，不强行增加功能层级 |
| current 与 devlogs | 当前调度与历史证据，不作为平行整体规划或任务库 |

详细规则见[三级规划与唯一进度来源](development/collaboration.md#三级规划与唯一进度来源)。
