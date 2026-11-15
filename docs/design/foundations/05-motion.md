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

## Dialog / Drawer 与 Accordion 入场（2026-11-15）

目的：说明浮层出现与内容展开的层级关系；不承担装饰，不延迟焦点、键盘操作或关闭。触发：Dialog / ConfirmDialog / Drawer 打开，Accordion 单项展开或收起。静态终态与未加动效时一致；Dialog / Drawer 关闭仍即时卸载，不等待退出动画。

| 项 | 取值 |
| --- | --- |
| Dialog | `opacity 0 → 1`、`scale .98 → 1`；`--rd-motion-base` 160ms、`--rd-ease-enter` |
| Drawer | `opacity 0 → 1`、`translate 16px 0 → 0`；底部 sheet 用 `translate 0 16px → 0`；160ms、`ease-enter` |
| Accordion | `height 0 ↔ --radix-accordion-content-height`、`opacity 0 ↔ 1`；160ms、`ease-enter` |
| 中断 | 关闭即时；Accordion 快速切换由 Radix 重新计算内容高度，不阻塞焦点 |
| 减少动态 | `prefers-reduced-motion: reduce` 下 `animation: none`，内容直接显示或隐藏 |

- `scale` / `translate` 使用独立变换属性，避免覆盖 `.rd-dialog` 的居中 `transform` 和 Drawer 的定位 `transform`；Dialog 的居中在实际中途帧保持不变。
- 只动画浮层自身或 Accordion 内容，不改焦点、Escape、滚动锁、触发器行为或组件 API。
- 底部 sheet 的纵向规则在展示站 app 层，因为 `.resource-sheet` 属于页面组合，不是共享 Drawer 的默认合同；共享 Drawer 默认从右侧滑入。
- 验证：Chrome 157.0.8103.51 无头，`Animation.setPlaybackRate(0.1)` 取中间帧；Safari 27.0.1 与 Firefox 159.0.1 以 2s 动画覆盖取中间帧。Dialog opacity / scale、Drawer translate、Accordion height / opacity、分段过渡均按预期运行；Chrome 减少动态下为 `animation: none`；无 pageerror。证据在忽略目录 `output/motion-dialog-accordion-2026-11-15/`（含 `safari-native-checks.json` / `firefox-native-checks.json`）。
- 未覆盖：真机、低帧率设备、Flutter；Safari / Firefox 的减少动态未实机验证（共享媒体规则与 Chrome 一致）；视觉与交互仍待所有者复审。

## 分段指示器（2026-11-15）

现状：Tabs / ToggleGroup 的选中态由每个 item 自己的 surface pill + shadow 表达，切换时直接跳到新项。所有者于 2026-11-15 选择 **B 交叉淡入**；A 保留为以后需要更强空间关系时的候选，C 未采用。

| 方案 | 做法 | 代价 / 风险 |
| --- | --- | --- |
| A 共享滑动药丸 | 在列表内放绝对定位指示器，测量当前 item，用 `translate` / `width` 160ms 滑动；只在单行时滑动，换行或 200% 时降级为淡入 | 最接近 shadcn 的空间关系；需改 TabsList / ToggleGroup 共享实现和共享 hook，处理换行、字体缩放、初始挂载与 RTL，验证面明显更大 |
| B 交叉淡入 | 给 item 的 `background` / `box-shadow` / `color` 加 160ms transition；不移动 | CSS 小改，所有布局安全；空间关系弱于 A |
| C 保持即时 | 不改 | 与当前设计一致，不增加动效噪音 |

- **采用 B**：`.rd-tab` / `.rd-toggle-group__item` 的 `background-color`、`box-shadow`、`color` 使用 160ms `--rd-ease-enter` 过渡；不移动药丸，不新增结构或共享 API。选中态仍是每个 item 自己的 surface pill + shadow，换行与 200% 下保持安全。
- **验证**：Chrome 157.0.8103.51 无头，`Animation.setPlaybackRate(0.1)` 取中间帧——分组 tabs 切换时旧项 `rgba(255,255,255,.19)`、新项 `rgba(255,255,255,.68)`，落定后分别为透明 / `rgb(255,255,255)`；资源筛选同一路径；Safari 27.0.1 / Firefox 159.0.1 以 2s 过渡覆盖取中间帧；减少动态下 `transition-duration: 0s`、`transition-property: none`；无 pageerror。证据在忽略目录 `output/segmented-fade-2026-11-15/` 与 `output/motion-dialog-accordion-2026-11-15/`。
- **A 的后续条件**：若需要滑动的空间关系，先做单行版本，并把换行 / 200% 降级、RTL、初始挂载和共享 hook 写入合同；不在本轮把 A 落进共享组件。
- **边界**：真机、低帧率设备、Flutter 与 Safari / Firefox 的减少动态未实机验证；视觉与交互待所有者复审。
