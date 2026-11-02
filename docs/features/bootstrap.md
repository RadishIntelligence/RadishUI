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
