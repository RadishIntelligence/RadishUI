# 最小工程与首次部署

## 目标

将本地空仓库推进为可验证的家族 UI 工程骨架，并验证公开组织仓库能否在现有 Vercel 账户部署。

## 首批范围

- npm workspaces：`apps/docs`、`packages/react`、`packages/tokens`。
- token JSON、生成 CSS 与一致性检查。
- React Button：primary、secondary、ghost、danger、disabled、loading。
- 独立展示：亮暗切换、组件状态、本地交互与窄屏布局。
- Flutter 预留目录、正式文档入口、Vercel 根构建配置。

## 验收

- 根目录安装后 `npm run build` 通过。
- 展示站直接引用共享包，可在桌面和窄屏使用。
- 本地提交与远端分支对应，工作区无无关改动。
- Vercel 成功时记录实际项目、分支、提交与访问地址；失败时记录真实错误，不凭套餐文档推定成功或失败。

不要求本批交付完整设计系统、Flutter 实现、公共包发行或家族产品迁移。

## 2026-11-02 自定义域名跟进

所有者已配置 `ui.radishx.com`，本批把它设为公开文档首选入口和 HTML canonical / Open Graph URL；同步现有 Vercel scope 与项目名，保留初始部署历史。该域名是独立展示站，不是 RadishX 的子路径或 rewrite。

验收覆盖构建后的 canonical / 分享 URL、文档链接一致性与已配置域名的浏览器访问。本批不更改组件 API、视觉基础、依赖、DNS 或 Vercel 设置。
