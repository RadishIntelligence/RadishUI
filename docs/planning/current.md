# 当前规划

更新日期：2026-11-09。

## 当前范围

[P0 工程基线](roadmap.md)已建立，P1 的 [F-02.4 第二版运行基线](../features/visual-baseline-proposal.md#第二版运行基线登记2026-11-08)已由所有者确认。代码锚点为 `cc722db`，包括资源库、外观与偏好、文档以及 24 个共享 React 组件。随后补齐组件状态示例、视觉基础与单一 Web 入口。原生 `.pen` 继续保留为设计参考。

[E-02.5](../features/workbench-preview.md#e-025-补验检查项)已按所有者确认的范围完成，移动证据采用既有 iPhone 17 / iOS 26.5 模拟器抽查。11 月 9 日完成[单一入口](../features/workbench-preview.md#单一入口补验2026-11-09)与[新增组件](../features/react-workbench-components.md#单一入口组件补验2026-11-09)的 Safari / Firefox 定向复验，修复窄屏英文底栏断词和 Avatar 快速加载失败回退。VoiceOver 实际朗读与实体 iPhone 已移出本轮验收，Windows + NVDA 另行评估。

[资源新建](../features/workbench-preview.md#新建资源的标签)已使用共享 [TagInput](../features/react-workbench-components.md#taginput2026-11-09) 接入现有标签字段，保存后的标签可在详情查看和搜索。组件用法页提供添加、删除、超限和禁用状态。TagInput 已完成 Safari / Firefox 定向补验，并由所有者复审确认，登记为 [F-02.4 修订](../features/visual-baseline-proposal.md#taginput-修订登记2026-11-09)；第二版运行基线仍以 `cc722db` 为主登记对象。粗指针命中、真实输入法与屏幕阅读器朗读仍待验证。

[PR #6](https://github.com/RadishIntelligence/RadishUI/pull/6) 已由所有者合入 `master`，合并提交 `030ffdf` 已快进回流并推送 `dev`，两条远端分支核对为 `0 0`。[生产展示站](../deployment/hosting.md#2026-11-08-单一-web-入口晋级)已提供 `26.11.1` 的 Workbench 单一入口。当前内部版本及发行边界见[版本策略](../development/versioning.md)。

[家族 UI 只读盘点](../features/family-ui-consolidation.md)已完成首轮。Web 范例加载 Inter Variable / JetBrains Mono Variable，图标沿用 lucide-react，视觉语义以 `--rd-*` 为准。P2 外部消费 smoke test 已完成并修复 tokens CSS 打包；RadishX About 入口卡的延迟加载原型已在临时副本完成构建、回滚与浏览器验证，仍只作临时消费证据。[F-02.6 有限产品试点](../features/visual-baseline-proposal.md)尚未进入正式试点；RadishX 分支与产品仓写入范围明日再定。

长期阶段和专题归属见[整体规划](roadmap.md)与[专题地图](topics.md)。本轮证据见[本周开发记录](../devlogs/2026-W46.md)，晋级历史见[上周收尾记录](../devlogs/2026-W45.md#2026-11-08-收尾提交回顾与文档复核)。

## 接下来的事项

1. **推进 RadishX About 入口卡正式试点（2026-11-10 继续）。** 范围保持 `/about` 入口卡、共享 `Button` + `Dialog`，并采用已验证的修正版延迟加载外壳：加载成功时把焦点从直达链接交接到共享按钮，失败时保留原链接。先固定 RadishUI `83e4f0f` 与两份 tarball 的 SHA-256，决定是否推送 `dev` 或记录本地提交例外；`feature/radishui-about-entry` 的复用 / 新建分支明日再定。随后在试点分支做干净安装与 lockfile 校验，验证 1440 / 390 / 320 + 200%、明暗、加载中与失败回退、Dialog 初始焦点 / Tab / Escape / 回焦，并实际执行一次回滚。产品仓写入、依赖安装和分支操作需单独授权；不推送产品分支、不部署、不合并 `master`。通过后由所有者视觉确认，再登记 F-02.6 采用。
2. **组件候选由页面需求触发。** 从[家族盘点](../features/family-ui-consolidation.md#shadcnui-缺口优先级)选择已有控件解决不了的交互。需要在长选项中搜索时评估 Combobox，Progress 等真实异步进度流程。新增组件同时交付页面用法和状态示例。

## 当前停止线

- 当前只推进 RadishUI 的设计、token、共享组件和 Web 范例。产品仓只读，P2 接入、React 18 / Flutter 支持、组件包发行及字体依赖策略各需独立确认。
- 原生稿十二组合及两个控件板属于静态设计证据。受限参考留在仓库外的私有本地库，外部截图和私人材料不进入公开资产。
- 晋级历史标题例外限定于所有者核准的三个完整 SHA。后续 PR 仍按[仓库治理](../development/repository-governance.md#稳定主线晋级与回流)审阅与合并。
