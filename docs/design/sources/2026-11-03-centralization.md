# 2026-11-03 通用资料归集记录

状态：本地归集与来源仓入口替换已实施。本仓交付以本地提交保存，来源四仓仍为待审、未提交 / 未推送的工作区改动；没有创建远端 PR 或执行合并。任务进度见 [F-02](../../features/visual-baseline-proposal.md)。

## 授权与来源

萝卜SAMA已确认按提案开始，允许设计探索，并明确选用仓库外本地 `RadishUI-PrivateReferences` 保存受限原图；该目录不建立 Git、不上传云端。使用已有 Pen App，没有安装 CLI、依赖或字体。

通用原则已重组为 [foundations](../foundations/README.md)，吸收内容优先、主任务、连续行、中文与大字号、明暗状态等跨产品经验，没有导入产品实现。原 family-ui 来源为 RadishX `v26.7.3` / `c0f57ae`；[14 文件清单](family-ui-v26.7.3.json)记录完整提交、原路径、字节数和 SHA-256。保留[原始许可证](radishx-license.txt)：Copyright (c) 2026 RadishX Project Owner. All rights reserved. 当前归集依据所有者本任务授权，不扩大第三方、商标、素材或商业使用许可；也未把来源许可证套到 RadishUI 根项目。

| 来源 | 审计 / 分支基线 | 归集范围 | 留在产品侧 |
| --- | --- | --- | --- |
| RadishX | `c0f57ae` / 最新 origin/master | 12 篇通用文档整合、2 个历史 token 参考、27 个外部图片入口 | 官网 Brand 规范、Logo / Mascot、设计源、`src/styles/family-ui-tokens.css` |
| Radish | `97e9c4a6` / 最新 origin/dev | 22 个参考图片入口与通用学习点 | 四主题、权益、页面族合同、Web / Flutter 代码、token 副本 |
| RadishMind | `ebc614a9` / 最新 origin/dev | 17 个参考图片入口与通用学习点 | 产品分级、领域状态、设计 / 实现 / 验收映射、token 副本 |
| RadishFlow | `75635828` / 最新 origin/dev | 17 个参考图片入口与通用学习点 | Studio / Canvas / 单位 / 求解 / 原生合同、设计源 |

Nexus 的导出稿只提供阅读与工作面经验，没有复制或迁走其产品设计源。其他产品本轮未改；Ledger 私人材料不读取、不移动、不建立索引或指纹。

## 逐文件去向

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

后续 01–10 等文件名的原路径均相对同一 family-ui 目录。原仓 12 篇 Markdown 保留短入口，`tokens/` 保留 README，不继续保留正文与参考副本；历史版本从记录的来源提交追溯。

四仓 83 条图片原路径到 ref ID 的公开映射在 [catalog.json](../references/catalog.json)。实际原图、哈希、字节数和恢复映射只在私有库 `manifest.json`：**48 个对象、23,384,621 字节，83 条来源映射，全部校验通过后才移除来源当前树副本**。原始字节未压缩、裁切、转换；没有重写 Git 历史。原 Git 历史仍含截图，本次不是历史清除或撤回已公开内容。

Flow 的四处 1Panel / Discourse 错名、Mind 的一处 Cloudflare 错名已通过稳定 ID 和规范元数据纠正；保留旧名作为 alias，未声称逐张独立重验全部画面。

## 来源仓的短引用

四仓分别在 `codex/radishui-reference-centralization` 隔离本地改动。分支建立前 fetch 并核对 origin 基线均未前进；RadishX 没有 dev，采用实际最新 master，没有擅自新增 dev 或修改仓库策略。

| 来源仓入口 | 当前改动 |
| --- | --- |
| RadishX `docs/design/radishui-adoption.md` | Brand、固定旧 token、官网差异 / 素材 / 验收入口 |
| Radish `Docs/frontend/radishui-adoption.md` | 四主题 / 产品页面 / Flutter 的现有固定采用范围 |
| Mind `docs/radishui-adoption.md` | Workbench、只读 / 阻断边界、产品化与参考映射入口 |
| Flow `docs/architecture/radishui-adoption.md` | Studio / Canvas、原生适配、颜色状态与求解合同入口 |

原参考目录均保留 README；原灵感文档移除通用重复部分，保留产品转译。现有差异附录与视觉入口增加采用链接，没有删除产品合同或历史验收。链接目前指向 RadishUI dev 的目标路径，均标明本地候选尚未推送；应先发布 RadishUI 目标提交并固定引用，再推送 / 合并来源仓改动。

## 验证与回滚

- 私有库 48 份逐字节 / SHA-256 校验，83 条 alias 完整；目录 0700、文件 0600，无 `.git`。这不是异机备份或共享权限服务。
- 通过 Pencil 只读查看四仓 12 个纳管 `.pen` 的 image fill 引用，未发现已迁移目录或文件名的依赖；未改来源 `.pen`。不把该依赖扫描冒充产品视觉复验。
- Radish `npm run check:docs` 通过；追加归集记录后复验为 933 文件文本检查、880 Markdown / 1384 本地相对链接通过。
- RadishX `check:agent-guides` 与 `build` 通过，补查 74 篇 Markdown / 252 本地相对链接无失效目标；Mind 完整 `check-repo.sh` 通过（既有 7 条篇幅警告保留），新增周志后文本 / 相对链接定向复验通过；Flow 离线 `check-repository-governance` 通过，追加周志后用已构建的 xtask 复验 3817 文件通过。
- RadishUI 的仓库检查、构建与候选 QA 结果写入[本周记录](../../devlogs/2026-W45.md)；本页不宣称产品运行验收、组件发行或远端链接已经可用。

恢复图片时按私有 manifest 的来源 alias 核对对象哈希，再复制回对应路径；也可从固定来源提交恢复。文档通过普通修复 / revert 回滚，不 reset / force push；不能覆盖后来出现的用户修改。运行时、产品代码、lockfile、域名与部署未变。
