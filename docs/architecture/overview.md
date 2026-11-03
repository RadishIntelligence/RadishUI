# 工程结构与边界

## 技术结构

采用 npm workspaces 管理 React 展示站与共享包。首批使用 React 19、TypeScript、Vite；版本参考家族现有 RadishX 工程固定，Vite 根据本轮依赖审计选择同一主版本的修复版，安装结果由根 `package-lock.json` 锁定。

`apps/docs` 直接引用 `@radish-ui/react` 与 `@radish-ui/tokens`。当前为内部源码 workspace，不是可对外分发的组件包构建方案；正式发行前另行验证声明文件、导出与消费兼容。

## 依赖方向

```text
token JSON → 生成 CSS → React 样式与展示站
React 组件 ─────────→ 展示站
Flutter 适配：待实现
```

通用组件只依赖 UI 运行时和设计基础，不依赖产品 HTTP 客户端、登录、业务状态或路由。应用布局和示例文案属于展示站；真实通用交互属于组件包。

共享变更、状态验收、资产来源和版本化产品接入遵循[设计系统契约](../development/design-system.md)；仓库与远端门禁遵循[仓库治理](../development/repository-governance.md)，不把特定产品的业务约束加入通用底层。

## 设计基础

`packages/tokens/src/tokens.json` 是首批 token 的唯一机器来源，包含共享尺度及亮暗语义。当前使用项目内最小格式，不宣称已符合完整 DTCG 交换规范。`scripts/generate-tokens.mjs` 确认主题键对应并生成 `dist/tokens.css`；该文件被精确纳入 Git。

灰玉品牌与墨蓝操作的方向参考既有 RadishX family-ui v26.7.3；当前运行时仍是少量探索 token。本仓研究资料在 [docs/design](../design/README.md)，原生候选在 `designs/`，原创导出在 `assets/design-baselines/candidates/`。本仓使用的受限参考副本在仓库外私有库，来源仓文件已恢复；历史 token 参考不参与构建。当前先完成本仓第一版设计，尚未批准视觉或接入产品。

## 平台边界

- React：当前仅提供 Button 与样式入口，React 18 尚未验证。
- Flutter：当前只有目录说明，未安装 SDK、创建 pub 包或宣称组件可用。
- egui、Root 与 Godot：根据真实采用需求提供适配，不进入首批运行依赖。
