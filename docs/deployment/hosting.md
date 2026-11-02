# 展示站部署

## 配置

- 仓库：`RadishIntelligence/RadishUI`，公开。
- 首选：现有 Vercel 账户下的独立 `radishui` 项目。
- Git 仓库根目录：`./`，保持根 workspace 可见。
- 框架：Vite。
- Node.js：24.x。
- 安装：`npm ci`；构建：`npm run build`；输出：`apps/docs/dist`。
- 生产分支：`master`；`dev` 留作日常开发与预览。
- 配置来源：根 `vercel.json` 与 `package.json`，当前没有运行时环境变量或后端需求。

## 首次部署状态

2026-11-02：所有者已在 GitHub 组织安装 Vercel App，并打开公开仓库的导入配置页。页面可进入不代表构建或部署已成功；本轮实际执行结果将在验证后补充。

不修改 RadishX 原项目、套餐或 DNS；未计划购买 Pro 或启用试用。首次验证使用 Vercel 提供的默认域名。

## GitHub Pages 备选

仅当 Vercel 条件不满足时启用。已有 `github-pages` 构建模式用于项目子路径：

```bash
npm run check
npm run build --workspace @radish-ui/docs -- --mode github-pages
```

该模式使用 `/RadishUI/` 作为资源基路径。自定义域名时应改用根路径。当前未配置 Pages 发布工作流，也未启用 Pages 服务；备选说明不代表已部署。
