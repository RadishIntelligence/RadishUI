# 通用视觉基础

这些章节承接 RadishX 的 family-ui `v26.7.3`，并整合 Radish、Mind、Flow 与 Nexus 的通用经验。规范已按 RadishUI 职责重新组织；没有导入产品业务合同或实现代码。[来源与原文件映射](../sources/2026-11-03-centralization.md)保留原仓、提交和许可说明。

稳定原则可以直接用于设计判断；具体色值、尺度和组件合同以其明确标注的版本为准。Workbench v1 的新色值与页面仍是[候选稿](../patterns/workbench-v1.md)，未获视觉批准，也未修改运行时。

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
