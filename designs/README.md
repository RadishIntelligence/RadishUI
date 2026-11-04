# 原生设计源

[`radish-ui-workbench-v1.pen`](radish-ui-workbench-v1.pen) 为 Pen App / Pencil MCP 创建的原创候选源，同时保留 Workbench v1 与 `MR /` 现代圆角探索。整个文档为 2257 节点、16 个可复用部件。只通过 Pencil / Pen 读写 `.pen`，不使用文本、脚本或其他解析器。

当前评审见[现代圆角探索](../docs/design/patterns/modern-rounded-v1.md)：12 个主组合、2 个控件板、8 个本轮复用部件；侧栏已按所有者选择采用独立底板、连续列表、当前项高亮，保留账号与工作区独立控件，以及此前的密度、分页、标题、底栏和留白修订。清单为 [modern manifest](modern-rounded-v1.manifest.json)，另有 [variables](modern-rounded-v1.variables.json) 与 [contrast](modern-rounded-v1.contrast.json)。

已保存的 [Workbench v1](../docs/design/patterns/workbench-v1.md)仍保留 12 个主组合、6 个辅助板与 8 个复用部件。[原 manifest](workbench-v1.manifest.json)、[variables](workbench-v1.variables.json)、[contrast](workbench-v1.contrast.json)描述此前快照，不代表扩充后的全文件节点数量。两组候选参数均不替代运行时 token 来源。

所有内容为合成示例。外部参考原图没有进入设计源。这里的候选尚未获得视觉批准，不代表 React、Flutter 或产品已接入。
