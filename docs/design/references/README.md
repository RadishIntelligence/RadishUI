# 通用 UI 参考索引

本索引集中四仓 83 个外部截图入口，按字节校验去重为 48 份。原图只保存在所有者确认的仓库外本地 `RadishUI-PrivateReferences`，没有 Git 仓库，也不上传云端。公开仓库不保存原图、缩略图、私有哈希或账号信息。

索引继承原仓的内容标注和学习点，不代表已独立核验所有产品网页或批准全部结构。部分来源是未知作者的设计图；未知出处保持未知，不推断使用许可。原图只用于内部观察，不进入产品、`public/`、`.pen` 或对外交付物。

使用顺序：确定任务 → 选择相关 ID → 在获准的本地资料库观察 → 提炼关系和排除项 → 围绕自己的内容重新设计。KPI、卡片、侧栏和阴影只是在特定样本中的观察，不是所有页面的默认骨架。[当前通用原则](../foundations/README.md)与[候选代表页](../patterns/workbench-v1.md)给出 RadishUI 的转译。

## 内容与学习点

ref-01–27 保留旧 family-ui 编号；ref-28–48 补充其他独有内容。完整的 83 条旧路径、来源提交与 ID 映射见 [catalog.json](catalog.json)，不再依赖错误命名判断产品。

| ID | 来源 / 内容（继承标注） | 观察维度 | 排除项 |
| --- | --- | --- | --- |
| <a id="ref-01"></a>ref-01 | 电商客户列表 + KPI 卡 | KPI 卡结构（图标 + 标签 + 大数字 + 趋势小 chip）、表格行内下拉、软色状态 chip、pill 筛选器 | 纯灰白底色 |
| <a id="ref-02"></a>ref-02 | 同系订单表变体 | 行内操作图标按钮组、价格 chip、分页器形态 | 品牌、配色与完整页面组合 |
| <a id="ref-03"></a>ref-03 | BoardUI HR 仪表盘 | 侧栏导航（图标 + 文字 + 计数徽标）、人员卡、面积图的克制用色 | 高饱和蓝色整块 active 态（规范用柔底） |
| <a id="ref-04"></a>ref-04 | 任务看板 + 详情浮层 | 看板卡片信息层级、详情浮层的字段行结构、子任务嵌套、评论区 | 紫色 accent |
| <a id="ref-05"></a>ref-05 | AFFiNE 设置（中文） | 设置页左导航 + 右表单分区、浅色 / 深色 / 跟随系统三态、中文界面排版密度 | 品牌、配色与完整页面组合 |
| <a id="ref-06"></a>ref-06 | CloseCRM 工作流列表 | 列表页工具条（筛选 + 视图切换 + 搜索 + 导入）、行内 toggle、Active/Paused 状态语义 | 紫蓝 accent |
| <a id="ref-07"></a>ref-07 | FlowAI 仪表盘 | KPI 卡 + 主表格 + 模板卡三段式页面节奏、成功率数值分级着色 | 品牌、配色与完整页面组合 |
| <a id="ref-08"></a>ref-08 | FlowAI 通知面板 | 通知抽屉：severity tab 计数、条目 = 图标 + 标题 + 摘要 + 时间 + 级别 chip | 荧光色 |
| <a id="ref-09"></a>ref-09 | FlowAI 仪表盘全景 | 整页布局比例：侧栏 / 主区 / 卡片间距节奏 | 品牌、配色与完整页面组合 |
| <a id="ref-10"></a>ref-10 | 日程可用性编辑器 | 极简行式表单、toggle + 多时段行 + 行内增删复制、发丝分隔线 | 品牌、配色与完整页面组合 |
| <a id="ref-11"></a>ref-11 | 事故详情右栏 | 详情侧栏字段行（label 左、值右）、外部集成入口的克制形态 | 品牌、配色与完整页面组合 |
| <a id="ref-12"></a>ref-12 | 事故页 + 时间线 | 状态迁移时间线（旧态删除线 → 新态）、Resolved/High 状态语义并置、tab 分段 | 橙色品牌 accent |
| <a id="ref-13"></a>ref-13 | Lynk 订单履约 | 多段进度条 + 当前步骤说明 + ETA、SKU 引用 chip、金额右对齐 | 蓝色 chip 配色 |
| <a id="ref-14"></a>ref-14 | ATS 候选人管理 | 阶段漏斗 KPI 分组、表格列排序指示、来源图标 + 文本双通道表达 | 紫色主按钮 |
| <a id="ref-15"></a>ref-15 | SEO 站点仪表盘 | 等宽字标签风格、柱线混合图、条状分布（keyword bars）、表格数值密度 | 蓝橙图表色（应按自身母板转译） |
| <a id="ref-16"></a>ref-16 | 数据源连接向导 | 四步 stepper（编号 → 完成 √ + 连线）、选择卡网格、表单双列、成功状态条、radio 组 | 蓝色 accent |
| <a id="ref-17"></a>ref-17 | Wiko HR 管理仪表盘 | employee manager 侧栏分组、出勤热力图（小时 × 星期）、设备占比条、KPI + 出勤表格三段 | 青绿整块高饱和 |
| <a id="ref-18"></a>ref-18 | 律所 claim 工作台 Calendar | 侧栏功能 + Clients 分组、大字页面标题 + 计数徽章、Day/Week/Month 分段、日历网格 | 紫色 accent |
| <a id="ref-19"></a>ref-19 | 文档应用账户菜单 | 账户下拉（头像 + 状态 + 快捷编号）、space 切换子菜单、Appearance / Settings 分组 | 彩虹渐变头像 |
| <a id="ref-20"></a>ref-20 | NuxtLabs 深色分析仪表盘 | **深色主题**：KPI 卡趋势 chip、点阵世界地图、双色柱状图、深底表格；暗色下卡片 / 边框 / 前景层次 | 品牌、配色与完整页面组合 |
| <a id="ref-21"></a>ref-21 | 邮件客户端阅读态 | 三栏（文件夹侧栏 + 邮件列表 + 阅读区）、附件卡、存储用量条、日期分组 | 品牌、配色与完整页面组合 |
| <a id="ref-22"></a>ref-22 | 社区发帖器 | 帖子类型分段（Idea/Question/Voice/Visual/Ama）、标题 + 正文 + 标签输入 + 添加、右侧 Active 线索栏 | 深色主按钮 |
| <a id="ref-23"></a>ref-23 | 社区内容流 + 成功提示 | 帖子卡片（类型 chip + 标题 + 摘要 + 标签 + 投票 + 反应）、右下成功 toast、Active Now 侧栏 | 品牌、配色与完整页面组合 |
| <a id="ref-24"></a>ref-24 | 告警运营台 | Quick Stats（Critical/Active/New/Unack）、Recent Alerts 表（头像 + 来源 + severity）、Alert Activity 双线图、自动刷新提示 | 紫底展示背景 |
| <a id="ref-25"></a>ref-25 | 项目协作设置 | 账户卡（含 Dark Mode 开关）、上传进度、Invite 权限下拉（can view）、Reset Password 表单、标签 max 提示 | 品牌、配色与完整页面组合 |
| <a id="ref-26"></a>ref-26 | 邮件收件箱（tab + 附件） | 图标窄侧栏、Inbox/Sent/Drafts/Archive/Spam tab 行、列表勾选、Office 附件卡、认证徽标 | 品牌、配色与完整页面组合 |
| <a id="ref-27"></a>ref-27 | 客服协作 Inbox | 会话侧栏（Your inbox/Mentions 计数 + AI Agents 分组 + Team discussion 语音状态）、聊天气泡（深 / 浅双向）、纸纹背景 | 品牌、配色与完整页面组合 |
| <a id="ref-28"></a>ref-28 | AFFiNE 文档列表 | 连续列表、导航与辅助区比例 | 品牌、配色、图片、文案与完整页面组合 |
| <a id="ref-29"></a>ref-29 | AFFiNE 文档编辑 | 正文宽度、属性与元信息关系 | 品牌、配色、图片、文案与完整页面组合 |
| <a id="ref-30"></a>ref-30 | Cloudflare 访问概览 | 任务与辅助事实分工 | 品牌、配色、图片、文案与完整页面组合 |
| <a id="ref-31"></a>ref-31 | Cloudflare 账户分析 | 指标与趋势的分组关系 | 品牌、配色、图片、文案与完整页面组合 |
| <a id="ref-32"></a>ref-32 | Codex App 浏览器权限 | 行级设置、说明与危险操作区分 | 品牌、配色、图片、文案与完整页面组合 |
| <a id="ref-33"></a>ref-33 | Codex App 通用设置 | 内容列、分组与字段留白 | 品牌、配色、图片、文案与完整页面组合 |
| <a id="ref-34"></a>ref-34 | Discourse 管理活动 | 连续统计与后台信息密度 | 品牌、配色、图片、文案与完整页面组合 |
| <a id="ref-35"></a>ref-35 | Discourse 流量分析 | 图表、坐标、时间与分组标题 | 品牌、配色、图片、文案与完整页面组合 |
| <a id="ref-36"></a>ref-36 | Discourse 频道聊天 | 频道、消息流与输入区的稳定关系 | 品牌、配色、图片、文案与完整页面组合 |
| <a id="ref-37"></a>ref-37 | Discourse 话题列表 | 标题、标签、计数与元信息层次 | 品牌、配色、图片、文案与完整页面组合 |
| <a id="ref-38"></a>ref-38 | GitHub 账户设置 | 长设置页的分组与段落节奏 | 品牌、配色、图片、文案与完整页面组合 |
| <a id="ref-39"></a>ref-39 | GitHub 仓库列表 | 对象标题与元信息的扫描顺序 | 品牌、配色、图片、文案与完整页面组合 |
| <a id="ref-40"></a>ref-40 | GitHub 文件列表 | 连续行、工具栏与摘要关系 | 品牌、配色、图片、文案与完整页面组合 |
| <a id="ref-41"></a>ref-41 | MiMo Code 桌面内容一 | 技术内容承托与低强度背景边界 | 品牌、配色、图片、文案与完整页面组合 |
| <a id="ref-42"></a>ref-42 | MiMo Code 桌面内容二 | 展示标题、正文与媒体留白 | 品牌、配色、图片、文案与完整页面组合 |
| <a id="ref-43"></a>ref-43 | MiMo Code 桌面展示 | 小面积强调与有限品牌表现 | 品牌、配色、图片、文案与完整页面组合 |
| <a id="ref-44"></a>ref-44 | MiMo Code 移动内容 | 窄屏图文层级与浮动入口避让 | 品牌、配色、图片、文案与完整页面组合 |
| <a id="ref-45"></a>ref-45 | MiMo Code 移动展示 | 移动端装饰降密与主内容优先 | 品牌、配色、图片、文案与完整页面组合 |
| <a id="ref-46"></a>ref-46 | 1Panel 应用列表 | 独立对象的卡片、筛选与分页关系 | 品牌、配色、图片、文案与完整页面组合 |
| <a id="ref-47"></a>ref-47 | 1Panel 文件管理 | 连续表格、路径与行操作 | 品牌、配色、图片、文案与完整页面组合 |
| <a id="ref-48"></a>ref-48 | 1Panel 监控 | 时间范围、曲线与多图表标题 | 品牌、配色、图片、文案与完整页面组合 |

## 同图异名纠正

以下关系由哈希对应及原仓内容标注交叉确认；本轮直接查看了首项对应画面，其余以已知同字节文件的原仓标注校正，不声称逐张独立视觉复验。

- Flow `onepanel-file-manager-table.png` 实为 Discourse 管理活动。
- Flow `onepanel-app-store-grid.png` 对应 Discourse 流量分析。
- Flow `discourse-admin-dashboard-activity.png` 对应 1Panel 文件管理。
- Flow `discourse-admin-traffic-analytics.png` 对应 1Panel 应用列表。
- Mind `onepanel-analytics-dashboard-20260522213828.png` 对应 Cloudflare 账户分析。

## 保存与新增

本地私有库的 `manifest.json` 保存原路径、来源提交、字节数、校验值与实际文件；`README.md` 说明恢复与内部使用边界。公共索引 ID 与私有记录一一对应。该目录仅提供本地归集，不代表具有多人访问控制或共享服务。

新增参考必须带来新的结构、状态、密度、平台或明暗观察价值，登记来源、学习点、排除项和权限。受限原图继续只进私有库；私人材料不在本目录登记。产品专有设计与验收保留在产品仓库。本次没有采集 Ledger 私人材料。
