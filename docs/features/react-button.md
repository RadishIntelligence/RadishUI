# C-01：React Button 工程预览

主要归属：[跨平台通用组件](../planning/topics.md#components)。协同 F-01、E-01；阶段为 P0 工程基线。设计和验收遵循[设计系统契约](../development/design-system.md)。

本页保留 P0 历史合同与验收身份；2026-11-04 的现代圆角视觉、size / ref 扩展及页面采用转入 [C-02](react-workbench-components.md)，不把本页旧参数当作当前完整 API。

## 场景、输入与输出

提供具有共同层级、禁用和加载语义的通用操作按钮。实现位于 `packages/react/src/Button.tsx`；展示站从真实 `@radish-ui/react` workspace 导入，不实现演示副本。组件不执行 HTTP 请求、不决定权限或路由；业务动作由调用方传入事件。

输入为原生 button 属性，加 `variant` 与 `loading`；当前变体为 `primary`、`secondary`、`ghost`、`danger`，默认 `primary`。默认 `type="button"`；加载时显示装饰性 spinner、设置 `aria-busy`，并与显式 `disabled` 一起决定原生禁用状态。调用方提供可访问名称，组件保留原生按钮键盘语义。

## 失败、边界与恢复

操作失败和重试由调用方明确反馈，Button 不吞错误或伪造完成。加载状态由调用方收回，结束后恢复到调用方指定的禁用状态。危险变体只表达视觉语义，不内置删除或确认业务。当前没有错误、空态等额外按钮 API，也未验证 React 18、正式包导出或 Flutter 对应实现。

## 实施与验收

| 工作项 | 状态 | 完成依据与限制 |
| --- | --- | --- |
| C-01.1 四种层级、禁用与加载态的源码及展示 | 已完成（P0 工程预览） | 构建、加载禁用、主题与键盘焦点的历史检查见[开发记录](../devlogs/2026-W45.md)；不代表正式组件视觉批准或产品采用 |

后续变更应覆盖桌面 / 窄屏、明暗、默认 / hover / active / focus、disabled / loading 和长中文，核对原生类型与可访问名称。真实错误反馈在组合页面检查。P1 / P2 的视觉定稿、兼容范围及真实接入由对应范围确认后验收，不能用上述工程预览状态代替。
