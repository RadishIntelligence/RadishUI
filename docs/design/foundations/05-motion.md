# 05 动效

动效用于解释状态、展开关系和操作反馈。Workbench 不增加循环背景、装饰性入场或持续抖动；Brand 的表现性动效也不能延迟阅读和操作。

当前工程以 `motion-base=160ms` 为基础；2026-11-14 增加 `motion-fast=120ms` 与 `ease-enter`，供浮层入场使用。旧 family-ui 的 120 / 200 / 320 / 500ms 是历史参考，未迁成新的运行时 API。新增动效先说明目的、触发、静态终态与中断行为，再确认时长和缓动。

尊重系统减少动态效果偏好：关闭非必要位移、视差和循环；需要反馈时保留安静、可理解的终态。暂停或关闭动画后，仍能从文字、图标或结构理解结果。

Pen 稿只表示静态状态，没有验证动画、系统偏好、过渡中断或低性能设备。

## 浮层入场（2026-11-14 试点）

目的：说明浮层与触发器的空间关系，不承担装饰。触发：Select、DropdownMenu、Tooltip 打开。静态终态与未加动效时一致；关闭保持即时，不延迟焦点归还。

| 项 | 取值 |
| --- | --- |
| 起止 | `opacity 0 → 1`、`scale .96 → 1` |
| 缩放原点 | Radix 的 `--radix-*-content-transform-origin`，由 `data-side` 与对齐方式决定；缺失时回退 `center` |
| 时长 | Select / Menu 用 `--rd-motion-base` 160ms；Tooltip 用 `--rd-motion-fast` 120ms |
| 缓动 | `--rd-ease-enter`，临界阻尼感，不做回弹过冲 |
| 中断 | 关闭时元素直接卸载，动画不阻塞选择、键盘或指针 |
| 减少动态 | `prefers-reduced-motion: reduce` 下 `animation: none`，直接显示终态 |

- 只动画浮层自身，不动 Radix 的定位包装层。实测内容元素自身没有 transform，缩放不会覆盖包装层的 `translate(...)` 定位。
- 暂不做退出动画：关闭保持即时，避免等待动画结束后才归还焦点。
- 外部参考：EasyUI（MIT，<https://easyui.site/>）的 origin-aware 浮层与浮层参数。只借鉴“从触发边生长”的关系；没有采用其代码、Framer Motion、Tailwind 或弹簧过冲，评估结论见开发记录。
- 未覆盖：Safari / Firefox、真机、低帧率设备与 Flutter 对应实现。
