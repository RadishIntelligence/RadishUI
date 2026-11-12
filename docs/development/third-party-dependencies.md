# 运行时依赖与第三方声明

更新日期：2026-11-08。依赖由根 lockfile 锁定，以下范围为 RadishUI 本仓的 React / Web 范例。

| 依赖 | 版本与许可 | 使用范围与来源 |
| --- | --- | --- |
| radix-ui | 1.8.1，MIT | 共享组件的无样式交互基础，不采用 Radix Themes；[官方介绍](https://www.radix-ui.com/primitives/docs/overview/introduction) |
| lucide-react | 1.68.0，ISC；部分 Feather 派生图标保留 MIT | 共享控件与展示站按需导入，统一尺寸 / 线宽；[React 文档](https://lucide.dev/guide/react)、[许可](https://lucide.dev/license) |
| React / React DOM | 沿用 19.2.7，MIT | 既有 Web 运行时，未借本轮升级主版本 |
| `@fontsource-variable/inter` / `@fontsource-variable/jetbrains-mono` | 均为 5.3.0，OFL-1.1 | 由展示站入口导入，分别用于界面正文与等宽内容；回退栈和发行边界见[字体与排版](../design/foundations/03-typography.md) |

React 组件以锁定的 React 19 版本验收。两个 Fontsource 包是展示站运行时依赖，组件包使用语义字体 token。

`npm run notices:generate` 从 lockfile 中的 production 依赖及实际安装包生成 `apps/docs/public/third-party-notices.txt`，包含可能被 tree shaking 去掉的已安装运行时依赖；`npm run check:notices` 校验一致性。展示站的帮助入口可读取该声明，Vite 将它随构建分发。

`react-remove-scroll-bar@2.3.8` 的 npm 归档漏带 LICENSE，补充来源和固定提交见 [licenses](../../licenses/README.md)；生成脚本仅为这一精确版本使用补充，不静默为未知包推测许可证。其余声明来自安装包，包含 React、Radix、Lucide 及传递依赖的原始许可文本。

第三方许可只适用于对应依赖，本仓尚未选定根项目许可证。包正式发行、字体打包或新平台引入时，分别核对采用版本、分发产物和必要声明，不将展示站通过等同于全部发行合规工作完成。
