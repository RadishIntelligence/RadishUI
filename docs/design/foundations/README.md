# 通用视觉基础

这些章节承接 RadishX 的 family-ui `v26.7.3`，并整合 Radish、Mind、Flow 与 Nexus 的通用经验。规范已按 RadishUI 职责重新组织；没有导入产品业务合同或实现代码。[来源与原文件映射](../sources/2026-11-03-centralization.md)保留原仓、提交和许可说明。

稳定原则可以直接用于设计判断；具体色值、尺度和组件合同以其明确标注的版本为准。旧 [Workbench v1](../patterns/workbench-v1.md) 保留为历史候选；当前[现代圆角版](../patterns/modern-rounded-v1.md)已按所有者授权转入本仓 Web 实施，运行时映射归 [F-01](../../features/token-foundation.md)，组件与页面分别归 [C-02](../../features/react-workbench-components.md) / [E-02](../../features/workbench-preview.md)。本地实现不等于正式发行冻结或产品采用。

具体评审条目统一在[设计条例与约束](../design-rules.md)维护，区分所有者确认的默认原则与参考提炼建议；本目录继续承载各能力的详细方法。

| 章节 | 职责 |
| --- | --- |
| [01 原则](01-principles.md) | 内容优先、主任务、参考转译 |
| [02 色彩](02-color.md) | 品牌 / 操作 / 状态、主题和版本边界 |
| [03 排版](03-typography.md) | 系统字体、阅读与界面密度 |
| [04 空间与形态](04-space-shape-elevation.md) | 网格、边界、触控与层级 |
| [05 动效](05-motion.md) | 反馈目的与减少动态效果 |
| [06 组件形态](06-components.md) | 控件、字段、状态与浮层原则 |
| [07 布局与平台](07-layout-platforms.md) | Workbench / Content / Brand 与平台对应 |
| [08 品牌资产](08-brand-assets.md) | 图标、纹样、Mascot 与来源 |
| [09 验收](09-adoption.md) | 视觉与交互验收方法 |
| [10 兼容与采用](10-migration-playbook.md) | 版本、产品薄适配与回滚 |

旧 `v26.7.3` JSON / CSS 仅作为[历史参考](legacy-v26.7.3/README.md)保存；这些文件不进入构建、站点资源或生成入口。
