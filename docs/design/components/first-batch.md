# 首批组件候选边界

这是代表页驱动的设计范围，未冻结公共 API。当前运行时只有已有 Button 工程预览；Pen 中的形态不是 React / Flutter 实现。

| 批次 | 组件 | 由代表页确认的合同重点 |
| --- | --- | --- |
| A | Button、IconButton | 层级、尺寸、可访问名称、焦点、禁用与 loading |
| A | Input、Textarea、FormField、Select | label / hint / error、只读、输入保留、原生选择能力与键盘 |
| A | Checkbox、Switch、Tabs、StatusBadge | 受控状态、选择与状态分离、键盘与非颜色表达 |
| B | Dialog、Drawer、Menu | 关闭、焦点进入 / 约束 / 恢复、滚动、嵌套与键盘 |
| B | InlineAlert、Toast、Tooltip | 就近反馈、持续时间、播报、必要说明不依赖 hover |

A 为 10 个、B 为 6 个。先确认代表页与 A 的合同，再按真实需要进入 B；引入交互基础或其他依赖前另行说明来源、许可和影响。Radish 现有 UI 仅提供实现经验，不整包导入其 HTTP、图表、编辑器或产品主题。

AppShell、轻表格、列表 / 详情和设置分组先作为页面组合；首轮不承诺服务器分页、虚拟化、DataGrid、富文本编辑、协作编辑或全部平台。React 19 范围先验证，React 18 / Flutter 保留待验证身份。

对应[页面与状态候选](../patterns/workbench-v1.md)。正式实施获批后在 C 大专题建立组件合同与唯一任务来源，不在此重复维护实现待办。
