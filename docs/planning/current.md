# 当前规划

更新日期：2026-11-08。

## 当前范围

[P0 工程基线](roadmap.md)已建立，P1 的 [F-02.4 第二版运行基线](../features/visual-baseline-proposal.md#第二版运行基线登记2026-11-08)已由所有者确认。代码锚点为 `cc722db`，包括资源库、外观与偏好、文档以及 24 个共享 React 组件。随后补齐组件状态示例、视觉基础与单一 Web 入口。原生 `.pen` 继续保留为设计参考。

[E-02.5](../features/workbench-preview.md#e-025-补验检查项)已按所有者确认的范围完成。Safari / Firefox 各 248 / 248，减少动效各 11 / 11，移动采用既有 iPhone 17 / iOS 26.5 模拟器抽查。VoiceOver 实际朗读与实体 iPhone 已移出本轮验收，Windows + NVDA 另行评估。上述桌面矩阵早于部分新增组件和单一入口，晋级前的七页复验在 Chrome 完成。

[PR #6](https://github.com/RadishIntelligence/RadishUI/pull/6) 已由所有者合入 `master`，合并提交 `030ffdf` 已快进回流并推送 `dev`，两条远端分支核对为 `0 0`。[生产展示站](../deployment/hosting.md#2026-11-08-单一-web-入口晋级)已提供 `26.11.1` 的 Workbench 单一入口。当前内部版本及发行边界见[版本策略](../development/versioning.md)。

[家族 UI 只读盘点](../features/family-ui-consolidation.md)已完成首轮。Web 范例加载 Inter Variable / JetBrains Mono Variable，图标沿用 lucide-react，视觉语义以 `--rd-*` 为准。P2 外部消费 smoke test 已完成并修复 tokens CSS 打包；RadishX About 入口卡在本机通过验证，仅作临时消费证据。[F-02.6 有限产品试点](../features/visual-baseline-proposal.md)尚未开始。

长期阶段和专题归属见[整体规划](roadmap.md)与[专题地图](topics.md)。历史提交、验证矩阵和范围见[本周开发记录](../devlogs/2026-W45.md#2026-11-08-收尾提交回顾与文档复核)。

## 接下来的事项

1. **先补单一入口与新增组件的跨浏览器证据。** 以 `030ffdf` 的运行版为基线，在 Safari / Firefox 定向复验概览、视觉基础、平台与接入、四项移动底栏和账号菜单返回路径。优先跑 320px + 200% 基础字号的英文、390px 和桌面明暗及键盘焦点。组件侧覆盖 Avatar 图片失败回退、Skeleton 减少动效、InputOTP 粘贴 / 删格补位 / 表单提交、ConfirmDialog 描述与回焦、资源筛选和移动文档目录。记录实际版本、覆盖范围与可复现问题，修复后复跑命中的路径。验收归 [E-02](../features/workbench-preview.md) / [C-02](../features/react-workbench-components.md)。
2. **用本仓页面需求决定下一项组件。** 复用现有资源库、偏好或文档场景，从[家族盘点](../features/family-ui-consolidation.md#shadcnui-缺口优先级)选一个已有控件解决不了的问题。先说明页面位置、交互和状态，再决定是否增加组件。需要在长选项中搜索时评估 Combobox，Progress 等真实异步进度流程。交付同时包含页面用法和组件页状态示例，按第二版运行基线核对明暗、字号、键盘与反馈。
3. **保留 P2 为下一阶段出口。** 本仓组件与范例收口后，另行确认一个产品和一个有限页面，明确版本、token 映射、例外与回滚再做实际消费。RadishX 临时测试只提供消费路径证据。Flutter 验证与正式发行继续按 P3 / P4 各自的出口推进。

## 当前停止线

- 当前只推进 RadishUI 的设计、token、共享组件和 Web 范例。产品仓只读，P2 接入、React 18 / Flutter 支持、组件包发行及字体依赖策略各需独立确认。
- 原生稿十二组合及两个控件板属于静态设计证据。受限参考留在仓库外的私有本地库，外部截图和私人材料不进入公开资产。
- 晋级历史标题例外限定于所有者核准的三个完整 SHA。后续 PR 仍按[仓库治理](../development/repository-governance.md#稳定主线晋级与回流)审阅与合并。
