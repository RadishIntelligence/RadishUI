# 原生设计源

[`radish-ui-workbench-v1.pen`](radish-ui-workbench-v1.pen) 是通过 Pen App / Pencil MCP 创建的历史候选源，同时保留 Workbench v1 与 `MR /` 现代圆角探索。整个文档为 2257 节点、16 个可复用部件。2026-11-14 停用 Pencil，旧稿、预览和评审记录归档。新设计流程见[设计系统契约](../docs/development/design-system.md#验收与证据)。

当前评审见[现代圆角探索](../docs/design/patterns/modern-rounded-v1.md)：12 个主组合、2 个控件板、8 个本轮复用部件；侧栏已按所有者选择采用独立底板、连续列表、当前项高亮，账号与工作区保持独立，文档目录使用整体区域与连续章节行；此前的密度、分页、标题、底栏和留白修订保留。清单为 [modern manifest](modern-rounded-v1.manifest.json)，另有 [variables](modern-rounded-v1.variables.json) 与 [contrast](modern-rounded-v1.contrast.json)。

已保存的 [Workbench v1](../docs/design/patterns/workbench-v1.md)仍保留 12 个主组合、6 个辅助板与 8 个复用部件。[原 manifest](workbench-v1.manifest.json)、[variables](workbench-v1.variables.json)、[contrast](workbench-v1.contrast.json)描述此前快照，不代表扩充后的全文件节点数量。两组候选参数均不替代运行时 token 来源。

所有内容为合成示例。外部参考原图没有进入设计源。这里的候选尚未成为正式视觉基准，原生部件与运行时组件分别计数。首轮本仓 React 实施见 [C-02](../docs/features/react-workbench-components.md) / [E-02](../docs/features/workbench-preview.md)，与画稿的差异见现代圆角说明；Flutter 和兄弟产品尚未接入。
