# Workbench v1：代表页候选

2026-11-04。状态：**待萝卜SAMA视觉评审**。本轮按底部导航与选择器反馈修订静态候选，不代表色值、组件 API、产品采用或运行时实现获批。

## 设计结果

近白主内容、轻灰玉导航、墨蓝操作；暗色使用墨绿中性面与明亮操作底。单一主任务、连续行 / 正文、按需详情区构成骨架。没有复制外部页面、品牌素材或产品业务实现。

| 页面 | 桌面 1440×900 | 窄屏 390×844 | 主要判断 |
| --- | --- | --- | --- |
| R1 资源 | [浅色](../../../assets/design-baselines/candidates/2026-11-04/r1-desktop-light.png) · [深色](../../../assets/design-baselines/candidates/2026-11-04/r1-desktop-dark.png) | [浅色](../../../assets/design-baselines/candidates/2026-11-04/r1-mobile-light.png) · [深色](../../../assets/design-baselines/candidates/2026-11-04/r1-mobile-dark.png) | 连续资源行与当前详情；窄屏以单列扫描、进入详情 |
| R2 设置 | [浅色](../../../assets/design-baselines/candidates/2026-11-04/r2-desktop-light.png) · [深色](../../../assets/design-baselines/candidates/2026-11-04/r2-desktop-dark.png) | [浅色](../../../assets/design-baselines/candidates/2026-11-04/r2-mobile-light.png) · [深色](../../../assets/design-baselines/candidates/2026-11-04/r2-mobile-dark.png) | 连续字段分组，说明与控件对应；窄屏上下编排 |
| R3 文档 | [浅色](../../../assets/design-baselines/candidates/2026-11-04/r3-desktop-light.png) · [深色](../../../assets/design-baselines/candidates/2026-11-04/r3-desktop-dark.png) | [浅色](../../../assets/design-baselines/candidates/2026-11-04/r3-mobile-light.png) · [深色](../../../assets/design-baselines/candidates/2026-11-04/r3-mobile-dark.png) | 内容行宽与正文主导，目录按需出现，明确编辑入口 |

另有[基础板](../../../assets/design-baselines/candidates/2026-11-04/foundation-board-light.png)、[控件与局部状态浅色](../../../assets/design-baselines/candidates/2026-11-04/controls-states-light.png) / [深色](../../../assets/design-baselines/candidates/2026-11-04/controls-states-dark.png)、[资源状态](../../../assets/design-baselines/candidates/2026-11-04/resource-states-light.png)、[选择器状态浅色](../../../assets/design-baselines/candidates/2026-11-04/select-states-light.png) / [深色](../../../assets/design-baselines/candidates/2026-11-04/select-states-dark.png)。共 18 张原生导出，其中 12 张为主要组合；11 月 3 日的 16 张首稿保留为历史快照，当前清单指向本次修订。

局部状态覆盖字段错误、输入保留、保存失败 / 重试、保存中、禁用与只读说明、未保存离开确认、菜单、Toast、Tooltip、焦点示意、窄屏详情抽屉，以及资源初次加载、空结果、失败保留快照。它们是状态构图，没有真实交互或效果时序。

### 本次反馈修订

- 六张移动稿统一使用内收的胶囊底部导航：左右各留 16px、底部留 20px，导航高 72px，整体预留 104px；图标在上、文字在下，当前项使用柔和胶囊底。只参考所有者提供的形态，不采用参考图配色，也不增加范例之外的导航目的地。实际系统安全区与内容滚动须在实现阶段处理。
- 选择器的值靠左，独立 chevron 靠右，统一边界、内边距和尺寸；不再把下拉符号拼在文字后。新增明暗展开板，明确不透明菜单、选项行、当前项对勾、焦点与禁用原因。
- 共统一 28 处触发外观，其中 16 处为选择字段，12 处为工作区 / 内容目录 / 更多菜单入口。两者暂用同一原生触发外观组合，不据此合并 Select 与 Menu 的语义、交互或未来 API。

## 可编辑来源与参数

- [原生 .pen](../../../designs/radish-ui-workbench-v1.pen)：通过现有 `/Applications/Pen.app` 与 Pencil MCP 创建、保存，没有安装 CLI。
- [画板清单](../../../designs/workbench-v1.manifest.json)：原生 frame ID、尺寸、主题、导出文件与候选身份。
- [候选变量](../../../designs/workbench-v1.variables.json)：从 Pencil 原生 API 读取，供审阅；不是 token 新来源或生成入口。
- [指定色彩对比](../../../designs/workbench-v1.contrast.json)：20 组名义实色对照计算，不是完整无障碍审计。

| 角色 | 浅色候选 | 深色候选 |
| --- | --- | --- |
| 主内容 | `#FFFFFF` | `#1D2421` |
| 导航面 | `#F6F7F3` | `#171F1B` |
| 主文字 | `#29332E` | `#E9EFEA` |
| 辅助文字 | `#626F65` | `#A5B3A9` |
| 品牌 | `#5D6C57` | `#B2C4AA` |
| 操作 / 其前景 | `#435C74` / `#FFFFFF` | `#AEC7DD` / `#152635` |
| 选择 | `#EDF2F4` | `#2A3940` |
| 必要控件边界 | `#87938A` | `#7D8F81` |

设计使用 4px 网格、桌面 40px 控件、窄屏至少 44px 的主要操作区。Noto Sans SC 与 Lucide 由 Pen 应用绘制，未迁入字体 / 图标文件或安装运行依赖。八个原生可复用部件支持页面组合，本次增加移动胶囊导航和选择器触发器；其他候选形态在状态板说明，不宣称首批 16 个运行时组件已实现。

## 实际验证与限制

本次保存后的原生 QA：932 个节点、8 个可复用部件，裁切 / 溢出、未命名、placeholder 和无 fill 文字均为 0。12 个主要组合及状态板已导出，移动导航、桌面 / 移动选择器与新增展开板已查看静态渲染。本次未改变候选配色，沿用原先 20 组指定实色对照：普通文字最低 4.67:1，控件边界最低 3.20:1；装饰分隔不作为唯一控件边界，禁用示意不计入普通文字对照。

没有验证真实键盘、焦点进入 / 恢复、屏幕阅读器、hover / pressed 时序、系统主题、动效、浏览器缩放、中间宽度或 Flutter。R3 窄屏使用较短的合成正文验证排版，真实实现必须用同源长正文、长 URL / 代码和大字号补验滚动，不能把静态节选当作响应式内容策略。资源列表与动作也只是范例状态，不承诺数据服务。

## 评审范围

本轮先评审背景冷暖与明暗层次、主任务与主辅比例、列表 / 表单密度、阅读字号 / 行宽，以及操作、选中、状态是否清楚。通过后才能决定 token 迁移映射和[首批组件](../components/first-batch.md)合同；尚未批准的内容继续保留 candidate 身份。

进度与下一步只在 [F-02](../../features/visual-baseline-proposal.md)维护。
