<script setup>
import TutorialCards from '../../.vitepress/components/TutorialCards.vue'

const categories = [
  {
    id: 'intro-programming',
    title: '入门与编程基础',
    icon: 'mdi-code-tags',
    color: '#2196F3',
    items: [
      {
        title: '计算机科学导论与 Python 编程 — MIT',
        description: '计算、命令式编程、基础数据结构与算法。入门第一课，体验编程与计算机科学',
        resources: [
          { name: '视频资源', icon: 'mdi-play-circle-outline', items: [
            { title: 'MIT OCW 课程主页', url: 'https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '系统化程序设计 — UBC',
        description: '函数式编程、设计方法、系统化程序设计。从零开始培养编程思维能力',
        resources: [
          { name: '视频资源', icon: 'mdi-play-circle-outline', items: [
            { title: 'edX 课程', url: 'https://www.edx.org/course/how-to-code-simple-data', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '编程语言 — 华盛顿大学',
        description: 'ML 家族语言、Lisp 家族、Ruby。深入理解编程语言的范式与设计',
        resources: [
          { name: '视频资源', icon: 'mdi-play-circle-outline', items: [
            { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/programming-languages', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '面向对象设计 — NEU/edX',
        description: '面向对象设计、设计模式、UML、单元测试',
        resources: [
          { name: '视频资源', icon: 'mdi-play-circle-outline', items: [
            { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/object-oriented-design', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '软件架构 — Coursera',
        description: '软件架构设计、大型系统的组织与设计原则',
        resources: [
          { name: '视频资源', icon: 'mdi-play-circle-outline', items: [
            { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/software-architecture', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '计算机教育中缺失的一课 — MIT',
        description: '终端与 Shell、Vim、Git、命令行环境。课堂上不教的实用工具技能',
        resources: [
          { name: '视频资源', icon: 'mdi-play-circle-outline', items: [
            { title: 'MIT 课程页', url: 'https://missing.csail.mit.edu/', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
    ],
  },
  {
    id: 'math-theory',
    title: '数学与理论',
    icon: 'mdi-sigma',
    color: '#9C27B0',
    items: [
      {
        title: '微积分 1A：微分学 — MIT',
        description: '微积分基础：微分学。高中数序水平的同学可以开始',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'MIT Open Learning', url: 'https://openlearninglibrary.mit.edu/courses/course-v1:MITx+18.01.1x+2T2019/about', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '微积分 1B：积分学 — MIT',
        description: '微积分基础：积分学',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'MIT Open Learning', url: 'https://openlearninglibrary.mit.edu/courses/course-v1:MITx+18.01.2x+3T2019/about', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '微积分 1C：坐标系与无穷级数 — MIT',
        description: '坐标系与无穷级数',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'MIT Open Learning', url: 'https://openlearninglibrary.mit.edu/courses/course-v1:MITx+18.01.3x+1T2020/about', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '计算机科学数学 — MIT 6.042J',
        description: '离散数学、数学证明、O 记号、离散概率。CS 核心数学基础',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'MIT Open Learning', url: 'https://openlearninglibrary.mit.edu/courses/course-v1:MITx+6.042J+2T2019/about', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '算法：设计与分析 — Stanford',
        description: '分治、排序与搜索、图搜索、贪心算法、动态规划、NP 完全性。包含 Part 1 & 2',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'Part 1 - edX', url: 'https://www.edx.org/course/algorithms-design-and-analysis', icon: 'mdi-link', lang: 'en', type: 'article' },
            { title: 'Part 2 - edX', url: 'https://www.edx.org/course/algorithms-design-and-analysis-2', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '计算理论 — MIT',
        description: '形式语言、图灵机、可计算性、计算复杂性',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'MIT OCW', url: 'https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '线性代数 — MIT 18.06SC',
        description: '线性代数的完整课程，包含矩阵、向量空间、特征值等',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'MIT OCW', url: 'https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '概率论 — Harvard Stat 110',
        description: '概率论，涵盖概率分布、期望、方差、大数定律等',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'Harvard 课程页', url: 'https://projects.iq.harvard.edu/stat110', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '计算几何 — 清华/edX',
        description: '计算几何、几何算法、空间数据结构',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'edX 课程', url: 'https://www.edx.org/course/computational-geometry', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '算法博弈论 — Stanford',
        description: '博弈论与算法、机制设计、拍卖理论',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/algorithmic-game-theory', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
    ],
  },
  {
    id: 'systems-software',
    title: '系统与软件',
    icon: 'mdi-chip',
    color: '#4CAF50',
    items: [
      {
        title: '从与非门到俄罗斯方块 第一部分',
        description: '从逻辑门开始，构建计算机硬件平台。理解计算机的底层工作原理',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/build-a-computer', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '从与非门到俄罗斯方块 第二部分',
        description: '在自制硬件上构建编译器、操作系统。完整的计算机系统构建体验',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/nand2tetris2', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '操作系统导论 — 威斯康星大学',
        description: '进程管理、内存管理、文件系统、并发与同步。基于经典教材 OSTEP',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: '教材主页', url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '计算机网络：自顶向下方法',
        description: '应用层、传输层、网络层、链路层。自顶向下学习计算机网络',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: '在线课程', url: 'https://gaia.cs.umass.edu/kurose_ross/online_lectures.htm', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '并行编程 — Coursera',
        description: '并行计算、多线程编程、Scala 并行集合',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/parprog1', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '编译器 — Stanford/edX',
        description: '词法分析、语法分析、语义分析、代码生成与优化',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'edX 课程', url: 'https://www.edx.org/course/compilers', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '计算结构 — MIT（三件套）',
        description: '数字电路 → 计算机体系结构 → 计算机组织。深入理解计算机硬件',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'Digital Circuits', url: 'https://openlearninglibrary.mit.edu/courses/course-v1:MITx+6.004.1x+3T2017/about', icon: 'mdi-link', lang: 'en', type: 'article' },
            { title: 'Computer Architecture', url: 'https://openlearninglibrary.mit.edu/courses/course-v1:MITx+6.004.2x+3T2017/about', icon: 'mdi-link', lang: 'en', type: 'article' },
            { title: 'Computer Organization', url: 'https://openlearninglibrary.mit.edu/courses/course-v1:MITx+6.004.3x+3T2017/about', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '软件调试 — Coursera',
        description: '调试理论与实践、自动化调试工具',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'YouTube 播放列表', url: 'https://www.youtube.com/playlist?list=PLAwxTw4SYaPmRCR84p0GXH3QNxH8BzNfD', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '软件测试 — Coursera',
        description: '软件测试方法、测试自动化、测试驱动开发',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'YouTube 播放列表', url: 'https://www.youtube.com/playlist?list=PLAwxTw4SYaPnqZni3D4f7m2TS5S9LqLz9', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
    ],
  },
  {
    id: 'security-ethics',
    title: '安全与伦理',
    icon: 'mdi-shield-lock',
    color: '#FF9800',
    items: [
      {
        title: '网络安全基础 — RIT/edX',
        description: '网络安全基础、威胁建模、安全架构',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'edX 课程', url: 'https://www.edx.org/course/cybersecurity-fundamentals', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '安全编程原则 — Coursera',
        description: '安全编程原则、常见漏洞模式、防御性编程',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/secure-coding-principles', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '安全漏洞识别 — Coursera',
        description: '安全漏洞识别与修复',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/identifying-security-vulnerabilities', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: 'Web 安全基础 — KU Leuven/edX',
        description: 'Web 安全基础、OWASP Top 10、XSS/SQL 注入等常见攻击',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'edX 课程', url: 'https://www.edx.org/course/web-security-fundamentals', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '数字取证概念 — Coursera',
        description: '数字取证概念与方法',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/digital-forensics-concepts', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '安全软件开发 — Linux Foundation/edX',
        description: '安全软件开发全生命周期：需求、设计、实现、验证',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'edX 认证课程', url: 'https://www.edx.org/professional-certificate/linuxfoundationx-secure-software-development', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '伦理、技术与工程 — Coursera',
        description: '工程伦理、技术社会影响、职业道德',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/ethics-technology-engineering', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '知识产权导论 — Coursera',
        description: '知识产权法基础、专利、版权、商标',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/introduction-intellectual-property', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '数据隐私基础 — Coursera',
        description: '数据隐私基础、隐私法规、合规要求',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/data-privacy-fundamentals', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
    ],
  },
  {
    id: 'applied-projects',
    title: '应用与毕业项目',
    icon: 'mdi-rocket-launch',
    color: '#F44336',
    items: [
      {
        title: '数据库：建模与理论 — Stanford/edX',
        description: '关系模型、数据建模、数据库设计理论',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'edX 课程', url: 'https://www.edx.org/course/databases-modeling-and-theory', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '数据库：关系数据库与 SQL — Stanford/edX',
        description: '关系数据库与 SQL 语言、事务处理、查询优化',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'edX 课程', url: 'https://www.edx.org/course/databases-relational-databases-and-sql', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '机器学习 — deeplearning.ai',
        description: '神经网络、监督学习、无监督学习、推荐系统。吴恩达经典课程',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/machine-learning', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '计算机图形学 — UCSD/edX',
        description: 'OpenGL、光线追踪、渲染管线、图形学基础',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'edX 课程', url: 'https://www.edx.org/course/computer-graphics', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '软件工程导论 — UBC/edX',
        description: 'Agile 方法论、REST、软件规格说明、重构',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'edX 课程', url: 'https://www.edx.org/course/software-engineering-introduction', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '全栈开放课程 — 赫尔辛基大学',
        description: '全栈 Web 开发：React、Node.js、GraphQL、数据库。OSSU 推荐毕业项目方向',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: '免费课程', url: 'https://fullstackopen.com/en/', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '数据科学专项 — JHU',
        description: 'R 语言、数据分析、机器学习、数据产品。43 周系统学习数据科学',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'Coursera 专项课程', url: 'https://www.coursera.org/specializations/jhu-data-science', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: '云计算专项 — UIUC',
        description: '云计算基础、分布式系统、虚拟化、数据中心网络',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'Coursera 专项课程', url: 'https://www.coursera.org/specializations/cloud-computing', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
      {
        title: 'Scala 函数式编程 — EPFL',
        description: 'Scala 函数式编程、高阶函数、类型系统、并发编程',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'Coursera 专项课程', url: 'https://www.coursera.org/specializations/scala', icon: 'mdi-link', lang: 'en', type: 'article' },
          ]},
        ],
      },
    ],
  },
]
</script>

# 国际名校教程 — OSSU

**OSSU (Open Source Society University)** 是一个开源社区维护的计算机科学自学课程体系，汇集了 **MIT、Stanford、Harvard、UC Berkeley、Princeton** 等世界顶尖大学的免费/开源课程。

<div class="action-links">
  <a href="https://cs.ossu.dev/" target="_blank" class="action-link">
    <v-icon size="16">mdi-web</v-icon> 官方网站
  </a>
  <a href="https://github.com/ossu/computer-science" target="_blank" class="action-link">
    <v-icon size="16">mdi-github</v-icon> GitHub 仓库
  </a>
  <a href="https://discord.gg/wuytwK5sQh" target="_blank" class="action-link">
    <v-icon size="16">mdi-discord</v-icon> Discord 社区
  </a>
</div>

<TutorialCards
  v-for="(cat, i) in categories" :key="i"
  :id="cat.id"
  :title="cat.title"
  :icon="cat.icon"
  :color="cat.color"
  :items="cat.items"
/>

