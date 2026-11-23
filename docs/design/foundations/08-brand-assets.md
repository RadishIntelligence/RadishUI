# 08 品牌资产与图标

Workbench 默认没有纸纹、山水、云纹或传统边饰；Brand 如需使用，只能放在弱背景和边缘，不能降低正文、按钮、表单、图表或二维码的可读性。温润首先来自比例、色彩与留白。

Logo、Mascot 与视觉素材不是通用组件的默认内容。RadishX 的萝小白设定、下载与传播许可仍由 [RadishX 素材治理](https://github.com/RadishIntelligence/RadishX/blob/c0f57ae/docs/assets/materials.md)管理；本次未搬运相关素材，也未扩大授权。

同一产品使用一致的图标风格，图标与必要文字共同表达动作或状态。Pen 候选使用应用内置 Lucide 图标，仅作为设计预览；RadishUI 运行时统一使用 `lucide-react`，未复制图标文件到设计资产，也不替产品迁移依赖。

## 图标策略（2026-11-08）

- RadishUI 与新增共享组件统一使用 `lucide-react` 1.68；16 / 18 / 20 三档尺寸，stroke 2，`currentColor`；不混用第二套图标库。
- 可访问名称由按钮 / 链接提供；装饰性图标设置 `aria-hidden`；不用图标替代必要文字。
- 展示站 `#/icons` 图标参考列出当前实际使用的 lucide-react 图标（分组、搜索与复制导入；数据源 `apps/docs/src/icon-reference.ts`）。新增或替换展示用图标时同步登记，保持尺寸、`currentColor` 与 `aria-hidden` 口径。
- 品牌 Logo、Mascot、产品标识与插画不属于通用图标，保留独立资产与来源；不复制产品图标或素材。
- Radish 的 Iconify / MDI、RadishInk 的旧 lucide 记为产品侧例外；本轮不在产品仓迁移，后续升级时再按映射表切换。

第三方图片、字体、图标和生成素材逐项记录来源与采用范围。外部 UI 截图只在本地私有库观察，不进入 `.pen`、公开基准、站点资源或实现素材。候选使用合成内容，不含真实账号或私人材料。

概念图、静态设计与实机截图分别标明；临时文字标识不冒充正式产品 Logo。

## 站点 favicon

- 所有者明确要求展示站的标签页图标与 RadishX 一致。使用 RadishX `public/favicon.ico`（6 个尺寸，46,429 字节，SHA-256 `4a1896976dd2e8d51ccbb5066c9a21522e1aa85f55ae43f5ba9c59201740d8dc`）作为 `apps/docs/public/favicon.ico`；`apps/docs/index.html` 使用 `<link rel="icon" href="/favicon.ico" sizes="any" />`。
- 这是一次所有者授权的单点站点图标采用，不扩大为通用 Logo / Mascot / 产品标识迁移；此前「未搬运相关素材」的盘点记录继续有效。兄弟仓只读，不引入其代码或依赖，品牌归属与源仓可用许可仍由 RadishX 管理。
