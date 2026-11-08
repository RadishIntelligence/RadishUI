# 03 字体与排版

Web 范例使用 OFL 字体包 `@fontsource-variable/inter` / `@fontsource-variable/jetbrains-mono` 5.3.0，字体族为 `'Inter Variable'` / `'JetBrains Mono Variable'`，CJK 回退系统。组件包消费时的字体依赖方式与 Flutter 字体另行确认；不复制字体文件进仓库。

| 角色 | Workbench 候选 | 说明 |
| --- | --- | --- |
| 页面标题 | 24–28px / 500–600 | 一页一个主要标题 |
| 分组标题 | 16–20px / 500 | 由内容层级决定 |
| 界面正文 | 14px / 400 | 行高约 1.5，不能通过细小字制造密度 |
| 辅助信息 | 12–13px / 400 | 必要信息仍须清楚可读 |
| 阅读正文 | 16px / 400 | 行高约 1.75–1.85，控制行宽 |

## 家族字体栈（2026-11-08）

- Sans：`'Inter Variable', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif`。
- Mono：`'JetBrains Mono Variable', 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace`。
- Web 范例已引入 `@fontsource-variable` 字体包（OFL-1.1）；CJK 使用系统字体。组件包发行时是否把字体包作为 dependency / peer / 可选资源，仍需单独确认。
- 中文、English、数字、代码、长名称与 200% 基础字号共同检查；不通过负字距、超小字号或 `vw` 字号硬塞。

以上保留早期 Workbench 候选的角色参考。当前现代圆角 Web 实施的具名字级与 rem 映射以 [F-01](../../features/token-foundation.md)为准，正文随可用宽度编排；不把本表视为已冻结的发行 API。Brand 可在大标题使用少量衬线；表单、按钮、列表和工作面正文使用无衬线。代码、路径、标识与对齐数值使用 Mono 栈。

页面、区域、分组等标题下的说明文字，按[DR-01：标题下尽量不放描述性文字](../design-rules.md#dr-01)处理，保留特殊需求或特殊设计的例外；具体条件统一在该条维护。

中文与 English、长名称、路径、数值和单位必须共同检查。数值右对齐且使用等宽数字，单位靠近数值；长文本换行或有可获取全文的截断策略，不能挤掉状态与动作。按钮与标签为语言长度留余量，不通过负字距、超小字号或 `vw` 字号硬塞。

窄屏重新组织内容，正文不随桌面等比缩小；放大文字和 200% 缩放属于实现验收，静态稿不提供这项保证。Pen 候选使用应用内 Noto Sans SC 画字，没有将字体文件引入仓库或产品。
