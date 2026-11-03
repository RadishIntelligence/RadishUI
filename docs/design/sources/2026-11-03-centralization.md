# 2026-11-03 通用资料归集与跨仓撤回记录

当前状态：四仓的入口替换、参考图迁移与新增文档已全部撤回，原分支、原文件与干净工作区均已恢复，临时分支已删除。本仓研究、来源索引、设计候选与本地私有参考副本保留。先在 RadishUI 完成满意的第一版设计，之后再单独考虑产品采用；没有跨仓提交或远端操作。任务进度见 [F-02](../../features/visual-baseline-proposal.md)。

## 授权与来源

萝卜SAMA允许本仓设计探索，并确认仓库外本地 `RadishUI-PrivateReferences` 位置。上一轮将开始方案理解为同时推进来源仓迁移；本轮经所有者澄清，已撤回跨仓部分，仅保留设计研究副本，该目录不建立 Git、不上传云端。使用已有 Pen App，没有安装 CLI、依赖或字体。

通用原则已重组为 [foundations](../foundations/README.md)，吸收内容优先、主任务、连续行、中文与大字号、明暗状态等跨产品经验，没有导入产品实现。原 family-ui 来源为 RadishX `v26.7.3` / `c0f57ae`；[14 文件清单](family-ui-v26.7.3.json)记录完整提交、原路径、字节数和 SHA-256。保留[原始许可证](radishx-license.txt)：Copyright (c) 2026 RadishX Project Owner. All rights reserved. 当前归集依据所有者本任务授权，不扩大第三方、商标、素材或商业使用许可；也未把来源许可证套到 RadishUI 根项目。

| 来源 | 审计 / 分支基线 | 归集范围 | 留在产品侧 |
| --- | --- | --- | --- |
| RadishX | `c0f57ae` / 最新 origin/master | 12 篇通用文档整合、2 个历史 token 参考、27 个外部图片入口 | 官网 Brand 规范、Logo / Mascot、设计源、`src/styles/family-ui-tokens.css` |
| Radish | `97e9c4a6` / 最新 origin/dev | 22 个参考图片入口与通用学习点 | 四主题、权益、页面族合同、Web / Flutter 代码、token 副本 |
| RadishMind | `ebc614a9` / 最新 origin/dev | 17 个参考图片入口与通用学习点 | 产品分级、领域状态、设计 / 实现 / 验收映射、token 副本 |
| RadishFlow | `75635828` / 最新 origin/dev | 17 个参考图片入口与通用学习点 | Studio / Canvas / 单位 / 求解 / 原生合同、设计源 |

Nexus 的导出稿只提供阅读与工作面经验，没有复制或迁走其产品设计源。其他产品本轮未改；Ledger 私人材料不读取、不移动、不建立索引或指纹。

## 本仓研究来源与保留内容

| RadishX 原相对路径 | RadishUI 新入口 / 处理 |
| --- | --- |
| `docs/design/family-ui/README.md` | [视觉基础入口](../foundations/README.md)，重组职责与版本边界 |
| `01-principles.md` | [原则](../foundations/01-principles.md)，整合主任务、连续内容和参考转译 |
| `02-color.md` | [色彩](../foundations/02-color.md)，改为角色与版本规则，旧值不冒充新来源 |
| `03-typography.md` | [排版](../foundations/03-typography.md)，界面 / 阅读分工与字体来源 |
| `04-space-shape-elevation.md` | [空间](../foundations/04-space-shape-elevation.md)，登记尺度冲突与候选边界 |
| `05-motion.md` | [动效](../foundations/05-motion.md)，目的、减少动态效果、当前值与旧值分开 |
| `06-components.md` | [组件原则](../foundations/06-components.md)与[首批候选](../components/first-batch.md) |
| `07-layout-platforms.md` | [布局与平台](../foundations/07-layout-platforms.md)，通用 / 产品分工 |
| `08-brand-assets.md` | [资产边界](../foundations/08-brand-assets.md)，Mascot 规则仍引用 RadishX |
| `09-adoption.md` | [验收](../foundations/09-adoption.md)，静态 / 运行 / 人工批准分别判断 |
| `10-migration-playbook.md` | [兼容与采用](../foundations/10-migration-playbook.md)，版本、薄适配和回滚 |
| `references.md` | [参考索引](../references/README.md)，保留 ref-01–27 并扩展到 ref-48 |
| `tokens/tokens.json`、`tokens/tokens.css` | [历史参考](../foundations/legacy-v26.7.3/README.md)，原样校验，禁止运行时混装 |

后续 01–10 等文件名的原路径均相对同一 family-ui 目录。本表说明本仓研究内容来源；原仓 12 篇 Markdown 正文、两个 token 参考与原入口均已恢复，不再以短入口替代。来源提交仍用于追溯本仓提炼依据。

四仓 83 条图片来源路径到 ref ID 的公开映射在 [catalog.json](../references/catalog.json)。私有库保存 **48 个去重副本、23,384,621 字节、83 条来源映射**及恢复所需校验信息。上一轮曾在校验后移除来源当前树副本；本轮已把 83 个原图文件全部恢复，并重新核对 SHA-256。私有库现仅作设计参考副本，来源仓也保存原文件。原始字节未压缩、裁切、转换，Git 历史未重写。

Flow 的四处 1Panel / Discourse 错名、Mind 的一处 Cloudflare 错名已通过稳定 ID 和规范元数据纠正；保留旧名作为 alias，未声称逐张独立重验全部画面。

## 已撤回的来源仓切换尝试（历史）

上一轮在四仓分别建立 `codex/radishui-reference-centralization` 实施以下本地尝试，未提交或推送。建立前 fetch 核对基线，RadishX 只有 master，其余使用 dev。本轮已恢复原文件并切回原分支，四个临时分支均已删除；下表为已撤回内容，不是当前待办或文件现状。

| 已删除的新增入口 | 撤回前尝试记录 |
| --- | --- |
| RadishX `docs/design/radishui-adoption.md` | Brand、固定旧 token、官网差异 / 素材 / 验收入口 |
| Radish `Docs/frontend/radishui-adoption.md` | 四主题 / 产品页面 / Flutter 的现有固定采用范围 |
| Mind `docs/radishui-adoption.md` | Workbench、只读 / 阻断边界、产品化与参考映射入口 |
| Flow `docs/architecture/radishui-adoption.md` | Studio / Canvas、原生适配、颜色状态与求解合同入口 |

上述新增采用页、参考目录 README 和本任务记录已删除；原灵感文档、差异附录、素材 / 视觉入口与历史记录恢复原文，没有遗留 RadishUI 候选链接。当前没有待提交的来源仓迁移；第一版设计满意后若要采用，需重新确认范围。

## 原迁移验证（历史）

- 私有库 48 份逐字节 / SHA-256 校验，83 条 alias 完整；目录 0700、文件 0600，无 `.git`。这不是异机备份或共享权限服务。
- 通过 Pencil 只读查看四仓 12 个纳管 `.pen` 的 image fill 引用，未发现已迁移目录或文件名的依赖；未改来源 `.pen`。不把该依赖扫描冒充产品视觉复验。
- Radish `npm run check:docs` 通过；追加归集记录后复验为 933 文件文本检查、880 Markdown / 1384 本地相对链接通过。
- RadishX `check:agent-guides` 与 `build` 通过，补查 74 篇 Markdown / 252 本地相对链接无失效目标；Mind 完整 `check-repo.sh` 通过（既有 7 条篇幅警告保留），新增周志后文本 / 相对链接定向复验通过；Flow 离线 `check-repository-governance` 通过，追加周志后用已构建的 xtask 复验 3817 文件通过。
- RadishUI 的仓库检查、构建与候选 QA 结果写入[本周记录](../../devlogs/2026-W45.md)；本页不宣称产品运行验收、组件发行或远端链接已经可用。

## 撤回验证与当前边界

- 撤回前将迁移过程在临时目录精确重放，逐项核对四仓 122 个受影响路径；内容全部与本任务输出一致，没有发现之后的其他改动。保存了原迁移文本备份，再恢复纳管文件并删除本任务新增文件，没有批量清理未知内容。
- 恢复 110 个纳管路径，包括 83 个图片、25 个原文档和 2 个历史 token 参考；仅删除本任务新增的 12 个文档。图片 SHA-256 与原清单一致。
- RadishX 回到 master / `c0f57ae`，Radish 回到 dev / `97e9c4a6`，Mind 回到 dev / `ebc614a9`，Flow 回到 dev / `75635828`。四仓 `git status --porcelain` 均为空，暂存区无改动，临时分支均不存在，提交历史和远端未变。
- 本仓 `f653e32` 中的设计与研究成果保留；只更新本仓规划和来源状态，不修改 `.pen`、候选图、运行时 token 或应用代码。后续先在 RadishUI 收敛满意的第一版视觉，再考虑产品试点与资料切换。

恢复过程与核对结果在忽略目录 `output/research/2026-11-03-ui-migration/withdrawal-*` 留痕；私有库继续保留内部观察副本。源仓恢复事实通过 Git 状态和图片校验验证，没有重复启动产品或进行新的运行态验收。
