# CS101 · 中文计算机学习路径

> 从「学什么、按什么顺序学、在哪里练、学到哪了」出发的计算机学习路径站。
> **Astro + Starlight + React + Tailwind CSS**，依赖使用最新稳定版（例外见 [VERSIONS.md](./VERSIONS.md)）。

## 当前状态

- `main` 分支：新站（M0–M6 已完成，已上线；每次推送 `main` 自动部署）
- `legacy-vitepress` 分支：旧 VitePress + Vue + Vuetify 站点完整备份（提交 `3be873a`，就在 `main` 历史里；
  需要旧正文时 `git checkout 3be873a -- docs` 即可取回，迁移用的内容快照与转换脚本已清理）

站点规模：**559 页**（构建产物 560 个 HTML，另含 404 页）——12 个技术分类 / 99 套教程：27 套常规教程 266 章 + 72 套业务系统教程 144 章、19 条技术路线、8 大领域方向（47 个方向，24 个已有路线）、计算机科学（国内 26 门 + OSSU 60 门课程）。首页按《软件技术知识库·最终分类方案》的 12 个分类组织，应用领域按其「领域方向」的 8 大分类组织；在线演练不在站内实现，统一外链 CodePen / StackBlitz。

## 信息架构

- 顶部导航：**首页 / 应用领域 / 业务系统 / 计算机科学 / 在线演练（外站菜单）**
- 首页 `/`：技术知识库目录——计算机基础与通用技术、常用工具、工程工具与基础设施、AI 工程与智能应用、大前端、后端开发、软件架构与设计、网络通信与微服务中间件、数据存储与数据工程、云计算/虚拟化/云原生、软件测试与质量工程、软件安全 **12 个分类同级成组**；每张卡片直接进入该方向的学习路线，教程卡片直接进入**第一章**（如 Java → Java 技术路线、Git 与版本控制 → Git 教程第一章）；左侧栏列出 12 个分类，点击定位、滚动高亮
- 教程页 `/tutorials/<slug>/…`：一套教程一个文件夹（`index.mdx` 是教程首页，`01-xxx.md` 起是章节）；左侧栏切换为该教程的章节目录；章节页右侧显示「本页内容」目录（随滚动高亮当前小节，移动端折叠在正文顶部）；教程首页保留简介、前置教程与「开始学习」按钮，可从面包屑 / 左侧栏标题回到
- 应用领域 `/domain/`：按其「领域方向」分为客户端与交互、系统与底层、工业控制与上位机、机器人与物理系统、数据与智能、图形/多媒体与空间、基础设施与平台、其他工程方向 **8 个分类**；有路线的方向点进去是该方向的路线页（卡片右侧显示「N 阶段 · M 项」），还没做的方向显示为虚线占位卡；左侧栏列出 8 个分类，点击定位、滚动高亮
- 业务系统 `/business-systems/`：按业务场景分 14 类（通用企业管理、制造与工业、零售与电商、金融、医疗、政务、物流、能源、建筑、教育、内容营销、通信、安全合规、行业专用），一行三张系统卡（类型为「教程」），点进去是该系统自己的教程（左侧只列这套教程的章节，右侧是章节正文）
- `/tech-stack/`：19 条学习路线总览（路线页左侧栏「全部技术路线 →」进入）
- 计算机科学 /computer-science/：左侧栏为计算机科学自己的导航（学习路线总览 / 国内版教程 / OSSU 国际教程），不显示教程目录
- 在线演练：不在站内跑 IDE（不引入 Monaco），代码块右上角「运行实例」把代码 POST 到 CodePen 新标签页打开；顶部导航「在线演练」菜单外链 CodePen（HTML/CSS/JS）、StackBlitz（前端工程/Node 项目）、TypeScript Playground（类型检查）
- 尚未编写的内容先占位：卡片显示为虚线且不可点，内容写完自动点亮

## 核心能力

| 能力 | 实现 |
| --- | --- |
| ⌘K 中文搜索 | 构建期 section 级索引（2947 小节）+ MiniSearch + `Intl.Segmenter` 分词，键盘导航、最近搜索、直达小节锚点 |
| 学习进度 | 本地 localStorage 记录完成/收藏/最近阅读；章节完成按钮、系列进度、首页「继续学习」 |
| 文档内运行实例 | HTML / CSS / JavaScript 代码块右上角「运行实例」，一键把代码带到 CodePen 新标签页；TypeScript 等去官方 Playground |
| 教程站版式 | w3schools/菜鸟式方角排版、面包屑、章节元信息（时长/难度）、底部大翻页、深浅色 |
| 路线与课程 | 首页 12 大技术分类目录、分阶段技术路线卡、领域路线、计算机科学课程与学习资源 |

## 环境要求

| 项 | 版本 |
| --- | --- |
| Node.js | 最新 LTS（当前 `24.22.1`，见 `.nvmrc`） |
| pnpm | 最新版（当前 `12.15.0`，见 `packageManager`） |

## 常用命令

```bash
pnpm install          # 安装依赖
pnpm dev              # 本地开发 http://localhost:4321/cs101/
pnpm build            # 生成搜索索引 + 构建静态站点到 dist/
pnpm preview          # 预览构建产物
pnpm check            # astro check 类型检查
pnpm check:links      # 构建产物站内链接检查（0 404）
pnpm index:search     # 只重新生成搜索索引
pnpm smoke            # M5 冒烟：搜索 / 进度 / 运行实例外链（需先 build + preview）
pnpm versions         # 重新生成 VERSIONS.md 版本台账
```

## 项目结构

```text
src/
  content.config.ts          # 内容集合 schema（series/order/difficulty/duration/tags）
  content/docs/              # 559 个内容文件（md/mdx，目录即 URL）
  components/
    shell/                   # 覆盖 Starlight：Header/PageTitle/Pagination/Footer
    search/                  # ⌘K 搜索岛
    progress/                # 完成/收藏/继续学习岛
    shared/                  # RouteSections / CardSection / Card（全站唯一卡片实现）
    roadmap|tutorial|home|domain|business|computer-science/
  data/
    model/                   # 路线模型与卡片模型（类型 + 纯函数，不含数据）
    entries/                 # 入口页配置：首页 / 应用领域 / 业务系统
    routes/                  # 路线页配置：19 条技术路线 + 24 条领域路线
    tutorials/               # 教程元信息：slug → 中文名
    computer-science/        # 计算机科学课程数据（zh / ossu）
  lib/                       # 内容索引、教程入口、搜索、进度、工具函数
  integrations/base-links    # 构建期补 base 前缀（兜底）
  styles/global.css          # Tailwind + Starlight 层序 + 教程站设计令牌
scripts/                     # 搜索索引、链接检查、冒烟、截图、版本台账
.github/workflows/deploy.yml # 构建并部署到 GitHub Pages
```

数据结构（内容由哪些数据驱动、新增内容改哪里）见 [DATA-MODEL.md](DATA-MODEL.md)：
**首页、应用领域、业务系统、全部技术路线与路线页共用同一个 `RouteTier[]` 模型**。

## 部署约定

- 站点部署在 GitHub Pages 项目路径：`https://yluiop123.github.io/cs101/`
- `astro.config.mjs` 中 `base: '/cs101'`；内容链接统一使用**相对路径**，构建期 `base-links` 集成兜底，链接检查保证 0 缺失。
- 推送 `main` 后由 GitHub Actions 构建并发布 `dist/`（站点已上线，`main` 每次推送自动部署）。

## 版本策略

1. 依赖安装时取最新稳定版（`pnpm add <pkg>@latest` / `pnpm up --latest`），`package.json` 记录 caret 范围，`pnpm-lock.yaml` 锁定精确版本。
2. 升级后运行 `pnpm versions` 更新 `VERSIONS.md`；施工期冻结非安全升级。
3. 上游不兼容时允许锁旧版，但必须登记例外与复查条件：当前唯一例外是 **TypeScript 6**（`astro check` 尚不支持 TypeScript 7）。
