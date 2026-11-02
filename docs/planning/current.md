# 当前规划

更新日期：2026-11-02。

## 当前范围

建立可构建、可审阅、可部署的最小工程：npm workspaces、JSON token 与 CSS 生成、React Button、独立展示站、轻量协作入口和必要检查。

本地构建、依赖审计和代表双端浏览器检查已完成，详见[本周记录](../devlogs/2026-W45.md)。

`RadishIntelligence/RadishUI` 已连接并推送 `master` / `dev`，GitHub 默认分支为 `master`。首次 Vercel 生产部署已完成并通过公开页面与静态资源访问检查，当前首选地址为 [ui.radishx.com](https://ui.radishx.com/)，HTML canonical 与分享 URL 同步使用新域名。GitHub Pages 保留为备选，未启用；版本与验收快照见[部署说明](../deployment/hosting.md)。

所有者于 2026-11-02 完成域名绑定与 Vercel 名称调整；当前控制台为 `DaBaiLuoBo / radish-ui`。本批同步官网和组织入口，保留既有工程预览边界；真实 Chrome 已访问新域名，命令行请求的 Cloudflare 403 限制见部署说明。

## 后续顺位

1. 确认家族视觉代表页、首批组件和产品接入范围。
2. 核查现有 family-ui 和产品内组件，选择可复用部分，明确设计来源与许可。
3. 在真实页面验证首批组件，再扩展 Flutter。
4. 按实际交付范围确定公开包名、版本与发行流程。

## 当前停止线

- 工程预览不代表家族正式视觉定稿，不代表产品已完成接入。
- 不在本轮整包迁移既有 UI，不一次性实现全部平台和组件。
- 不发布 npm / pub.dev 包，不创建 Release，不升级付费套餐；本轮不修改已有域名、DNS 或托管设置。
- 远端规则保护和 GitHub Pages 自动发布在确有需要时单独实施，不以模板冒充已启用配置。
