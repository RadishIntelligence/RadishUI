# 当前规划

更新日期：2026-11-10。

## 当前范围

[P0 工程基线](roadmap.md)已建立，P1 的 [F-02.4 第二版运行基线](../features/visual-baseline-proposal.md#第二版运行基线登记2026-11-08)已由所有者确认。代码锚点为 `cc722db`，包括资源库、外观与偏好、文档以及 24 个共享 React 组件。随后补齐组件状态示例、视觉基础与单一 Web 入口。原生 `.pen` 继续保留为设计参考。

[E-02.5](../features/workbench-preview.md#e-025-补验检查项)已按所有者确认的范围完成，移动证据采用既有 iPhone 17 / iOS 26.5 模拟器抽查。11 月 9 日完成[单一入口](../features/workbench-preview.md#单一入口补验2026-11-09)与[新增组件](../features/react-workbench-components.md#单一入口组件补验2026-11-09)的 Safari / Firefox 定向复验，修复窄屏英文底栏断词和 Avatar 快速加载失败回退。VoiceOver 实际朗读与实体 iPhone 已移出本轮验收，Windows + NVDA 另行评估。

[资源新建](../features/workbench-preview.md#新建资源的标签)已使用共享 [TagInput](../features/react-workbench-components.md#taginput2026-11-09) 接入现有标签字段，保存后的标签可在详情查看和搜索。组件用法页提供添加、删除、超限和禁用状态。TagInput 已完成 Safari / Firefox 定向补验，并由所有者复审确认，登记为 [F-02.4 修订](../features/visual-baseline-proposal.md#taginput-修订登记2026-11-09)；第二版运行基线仍以 `cc722db` 为主登记对象。粗指针命中、真实输入法与屏幕阅读器朗读仍待验证。

[PR #6](https://github.com/RadishIntelligence/RadishUI/pull/6) 已由所有者合入 `master`，合并提交 `030ffdf` 已快进回流并推送 `dev`，两条远端分支核对为 `0 0`。[生产展示站](../deployment/hosting.md#2026-11-08-单一-web-入口晋级)已提供 `26.11.1` 的 Workbench 单一入口。当前内部版本及发行边界见[版本策略](../development/versioning.md)。

[家族 UI 只读盘点](../features/family-ui-consolidation.md)已完成首轮。Web 范例加载 Inter Variable / JetBrains Mono Variable，图标沿用 lucide-react，视觉语义以 `--rd-*` 为准。P2 外部消费 smoke test 已完成并修复 tokens CSS 打包；RadishX About 入口卡的延迟加载原型已在临时副本完成构建、回滚与浏览器验证，仍只作临时消费证据。[F-02.6 有限产品试点](../features/visual-baseline-proposal.md#finite-product-adoption)的有限收口方案已于 11 月 10 日获确认，正式产品实施与采用验收待开始；本轮仅修改两库文档。RadishX 旧试验分支与临时副本结果不自动成为正式采用。

长期阶段和专题归属见[整体规划](roadmap.md)与[专题地图](topics.md)。本轮证据见[本周开发记录](../devlogs/2026-W46.md)，晋级历史见[上周收尾记录](../devlogs/2026-W45.md#2026-11-08-收尾提交回顾与文档复核)。

## 接下来的事项

1. **完成一次 RadishX About 有限试点收口。** 范围保持入口卡、共享 `Button` + `Dialog` 与已验证的延迟加载外壳。先确认产品分支及完整源提交 / 产物身份，在获对应操作授权后完成产品接入、干净安装、限定浏览器与回滚验收；产品侧清单由 RadishX `docs/features/radishui-pilot.md` 维护，采用判断见 [F-02.6](../features/visual-baseline-proposal.md#finite-product-adoption)。不再重复开同范围临时原型。技术通过后由所有者分别确认视觉和采用收益，允许保留技术证据但暂不采用；收益明确后才选择下一个有真实交互需求的产品场景。RadishX 的内容 / 质量与不含试点的发布候选独立推进。
2. **组件候选由页面需求触发。** 从[家族盘点](../features/family-ui-consolidation.md#shadcnui-缺口优先级)选择已有控件解决不了的交互。需要在长选项中搜索时评估 Combobox，Progress 等真实异步进度流程。新增组件同时交付页面用法和状态示例。

## 当前停止线

- 本轮跨仓授权仅覆盖 RadishUI / RadishX 规划文档收口。正式产品接入、依赖安装、服务启动和分支选择尚待对应实施授权；不推送产品分支、不部署、不合并 `master`。
- React 18 / Flutter 支持、组件包发行、字体策略、全站 token 与 family-ui 资料迁移不随试点自动进入，也不作为本次有限采用的前置条件。未覆盖平台与辅助技术如实记录；影响所选关键路径的缺陷仍需处理。
- 原生稿十二组合及两个控件板属于静态设计证据。受限参考留在仓库外的私有本地库，外部截图和私人材料不进入公开资产。
- 晋级历史标题例外限定于所有者核准的三个完整 SHA。后续 PR 仍按[仓库治理](../development/repository-governance.md#稳定主线晋级与回流)审阅与合并。
