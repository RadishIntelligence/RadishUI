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

灰玉品牌与墨蓝操作保留角色识别；本轮按所有者接受的现代圆角方向扩充中性明暗表面、状态、边界与尺度，映射见 [F-01](../features/token-foundation.md)。Pen 变量不直接参与运行时生成，机器来源仍只有 token JSON。本仓研究资料在 [docs/design](../design/README.md)，原生候选在 `designs/`，原创导出在 `assets/design-baselines/candidates/`。受限参考副本仍在仓库外私有库，历史 token 不参与构建。

共享控件采用原生元素与 Radix Primitives 行为基础，视觉由本仓语义 token 维护，图标按需使用 Lucide。第三方依赖、版本和声明见[依赖说明](../development/third-party-dependencies.md)，不引入 antd、产品接口或网络字体。Web 范例使用 hash 地址与本地合成数据；存储、恢复和页面导航留在 `apps/docs`。

## 平台边界

- React：本轮实现 [C-02 首批控件与浮层](../features/react-workbench-components.md)，在 React 19 的 [E-02](../features/workbench-preview.md)范例验收；React 18、正式包构建与产品消费尚未验证。
- Flutter：当前只有目录说明，未安装 SDK、创建 pub 包或宣称组件可用。
- egui、Root 与 Godot：根据真实采用需求提供适配，不进入首批运行依赖。
