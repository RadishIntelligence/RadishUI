# 展示站部署

## 配置

- 仓库：`RadishIntelligence/RadishUI`，公开。
- 托管：现有 Hobby 空间 [DaBaiLuoBo / radish-ui](https://vercel.com/dabailuobo/radish-ui)。
- 首选公开地址 / canonical：`https://ui.radishx.com/`。
- Git 仓库根目录：`./`，保持根 workspace 可见。
- 框架：Vite。
- Node.js：24.x。
- 安装：`npm ci`；构建：`npm run build`；输出：`apps/docs/dist`。
- 生产分支：`master`；`dev` 留作日常开发与预览。
- 配置来源：根 `vercel.json` 与 `package.json`，当前没有运行时环境变量或后端需求。

## 2026-11-02 自定义域名与名称同步

所有者已将 Vercel scope slug 改为 `dabailuobo`、显示名改为 `DaBaiLuoBo`，项目名改为 `radish-ui`，并绑定 `ui.radishx.com`。本批同步 README、当前规划与 HTML canonical / Open Graph URL；不重建项目，不修改 GitHub 仓库、分支、托管配置或 DNS。

真实 Chrome 已在新域名显示 RadishUI 页面；本机命令行请求返回 Cloudflare 403。默认地址 `https://radishui.vercel.app/` 独立请求仍为 200，可保留用于辅助核查；本批不假定旧地址已自动跳转。当前域名与最初的默认域名分别记录，不改写下方历史快照。

## 首次部署状态

2026-11-02：所有者安装 GitHub 组织 Vercel App 并完成账户二次验证后，首次生产部署成功。

| 项目 | 首次验收快照 |
| --- | --- |
| Vercel 归属 | `laugh0608's projects`，Hobby |
| 项目 | `radishui` |
| 生产分支 | `master` |
| 首次源码提交 | `d85832cbbe13c273fe7ce603adb2f89135142532` |
| 状态 / 首次耗时 | Ready / 9 秒 |
| 公开地址 | [radishui.vercel.app](https://radishui.vercel.app/) |
| 首次部署记录 | [Vercel deployment](https://vercel.com/laugh0608s-projects/radishui/2xQgxMYkdcq2ZYmnWGQAAspa87Nu) |

GitHub 对该源码提交的 Vercel 状态为 `success`。独立 HTTP 检查页面、JS 与 CSS 均为 200，浏览器确认实际渲染与本地预览一致。

本次结果证明这个公开组织仓库在当前账户的部署路径可用，不概括其他仓库、用途或未来套餐资格。首次验收记录固定指向上述提交，不将其冒充所有未来提交的验证。

不修改 RadishX 原项目、套餐或 DNS；未计划购买 Pro 或启用试用。首次验证使用 Vercel 提供的默认域名。

## GitHub Pages 备选

仅当 Vercel 条件不满足时启用。已有 `github-pages` 构建模式用于项目子路径：

```bash
npm run check
npm run build --workspace @radish-ui/docs -- --mode github-pages
```

该模式使用 `/RadishUI/` 作为资源基路径。自定义域名时应改用根路径。当前未配置 Pages 发布工作流，也未启用 Pages 服务；备选说明不代表已部署。
