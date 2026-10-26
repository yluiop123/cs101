// 首页教程目录：按「编程语言 / 技术栈 / 工程工具」组织，参照《软件技术内容分类规划》。
// 有 roadmap 的分组，教程内容直接取自对应学习路线（routePlan），保证与「学习路线 →」页一致；
// 没有路线的分组（工具与基础）在这里手写。

export interface CatalogTutorial {
  /** 教程系列 slug（尚未写成也先占位，写好即自动点亮） */
  slug: string;
  title: string;
}

export interface CatalogGroup {
  /** 页内锚点 id（首页分组 → #<id>） */
  id: string;
  name: string;
  /** 该分组对应的学习路线页（/tech-stack/<slug>/），显示在分组标题右侧 */
  roadmap?: string;
  /** 仅无 roadmap 的分组需要手写教程列表 */
  tutorials?: CatalogTutorial[];
}

export const homeSections: CatalogGroup[] = [
  {
    id: 'basics',
    name: '工具与基础',
    tutorials: [
      // 开发必备工具
      { slug: 'vscode', title: 'VS Code 教程' },
      { slug: 'jetbrains', title: 'JetBrains IDE 教程' },
      { slug: 'git', title: 'Git 教程' },
      { slug: 'github', title: 'GitHub / GitLab 协作教程' },
      { slug: 'terminal', title: '终端与环境配置' },
      { slug: 'docker', title: 'Docker 教程' },
      // 基础常识
      { slug: 'json', title: 'JSON 数据格式' },
      { slug: 'http', title: 'HTTP 协议基础' },
      { slug: 'markdown', title: 'Markdown 教程' },
      { slug: 'regex', title: '正则表达式教程' },
      { slug: 'design-patterns', title: '设计模式教程' },
      { slug: 'dsa', title: '数据结构与算法教程' },
      { slug: 'network', title: '计算机网络教程' },
      { slug: 'os', title: '操作系统教程' },
    ],
  },
  { id: 'frontend', name: '大前端', roadmap: '/tech-stack/frontend/' },
  { id: 'java', name: 'Java', roadmap: '/tech-stack/java/' },
  { id: 'python', name: 'Python', roadmap: '/tech-stack/python/' },
  { id: 'go', name: 'Go', roadmap: '/tech-stack/go/' },
  { id: 'rust', name: 'Rust', roadmap: '/tech-stack/rust/' },
  { id: 'c-cpp', name: 'C / C++', roadmap: '/tech-stack/c-cpp/' },
  { id: 'c-sharp', name: 'C# 与 .NET', roadmap: '/tech-stack/c-sharp/' },
  { id: 'database', name: '数据库', roadmap: '/tech-stack/sql-database/' },
  { id: 'middleware', name: '中间件', roadmap: '/tech-stack/kafka/' },
  { id: 'devops', name: '工程工具与 DevOps', roadmap: '/tech-stack/docker/' },
];
