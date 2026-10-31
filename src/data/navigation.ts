// 全站导航与页面类型的唯一来源。
// Header / Sidebar / PageTitle / Footer 都从这里取板块名、入口与路径判断，
// 新增一个板块时只改这里，避免四处手写 startsWith 导致行为漂移。

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteSection {
  key: string;
  label: string;
  /** 板块入口；有 menu 的板块没有自己的总览页 */
  href?: string;
  /** 顶部导航渲染成下拉框 */
  menu?: NavLink[];
  matches: (path: string) => boolean;
}

export const siteSections: SiteSection[] = [
  {
    key: 'home',
    label: '首页',
    href: '/',
    // 教程页与技术路线页都属于「首页」板块
    matches: (path) =>
      path === '/' || path === '' || path.startsWith('/tutorials') || path.startsWith('/tech-stack'),
  },
  {
    key: 'business-systems',
    label: '业务系统',
    href: '/business-systems/',
    matches: (path) => path.startsWith('/business-systems'),
  },
  {
    key: 'computer-science',
    label: '计算机科学',
    matches: (path) => path.startsWith('/computer-science'),
    menu: [
      { label: '国内教程', href: '/computer-science/zh/' },
      { label: '国际教程', href: '/computer-science/en/' },
    ],
  },
  {
    key: 'me',
    label: '学习中心',
    href: '/me/',
    matches: (path) => path.startsWith('/me'),
  },
];

/** 面包屑的板块根节点；没有总览页的板块不带链接 */
export const defaultSectionRoot: { label: string; href?: string } = { label: '首页', href: '/' };

export const sectionRoot: Record<string, { label: string; href?: string }> = {
  // 计算机科学没有总览页（顶部导航直接下拉到两条教程），面包屑这一级不带链接
  'computer-science': { label: '计算机科学' },
};

/** 当前路径所属的顶部板块 */
export const sectionByPath = (path: string) => siteSections.find((section) => section.matches(path));

export const isHomePath = (path: string) => path === '/' || path === '';

export const isBusinessSystemsIndexPath = (path: string) =>
  path === '/business-systems/' || path === '/business-systems';

export const isTechStackIndexPath = (path: string) =>
  path === '/tech-stack/' || path === '/tech-stack';

export const isTechStackRoutePath = (path: string) =>
  path.startsWith('/tech-stack/') && !isTechStackIndexPath(path);

export const isComputerSciencePath = (path: string) => path.startsWith('/computer-science');

/** 计算机科学的两条课程路线（不是教程章节） */
export const isComputerScienceRoutePath = (path: string) =>
  /^\/computer-science\/(zh|en)\//.test(path);
