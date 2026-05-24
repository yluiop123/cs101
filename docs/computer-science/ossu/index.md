<script setup>
import TutorialCards from '../../.vitepress/components/TutorialCards.vue'

const categories = [
  {
    id: 'intro',
    title: 'CS入门',
    icon: 'mdi-rocket-launch-outline',
    color: '#FF5722',
    items: [
      {
        title: 'CS50 — 哈佛',
        description: '计算机基础课',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: '计算机基础课 - 哈佛', url: 'https://www.youtube.com/watch?v=HJP0a6vKvlo&list=PLhQjrBD2T380hlTqAU8HfvVepCcjCqTg6' },
          ]},
        ],
      },
      {
        title: '计算机科学导论与 Python 编程 — MIT',
        description: '计算、命令式编程、基础数据结构与算法。入门第一课，体验编程与计算机科学',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'MIT OCW 课程主页', url: 'https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/' },
          ]},
        ],
      },
    ],
  },
  {
    id: 'core',
    title: '核心课程',
    icon: 'mdi-book-multiple',
    color: '#4CAF50',
    groups: [
      {
        title: '编程基础',
        items: [
          {
            title: '系统化程序设计 — UBC',
            description: '函数式编程、设计方法、系统化程序设计。从零开始培养编程思维能力',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'edX 课程', url: 'https://www.edx.org/course/how-to-code-simple-data' },
              ]},
            ],
          },
          {
            title: '基于类的程序设计 — UBC',
            description: '抽象、复杂数据结构、生成递归。系统化程序设计的进阶课程',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'edX 课程', url: 'https://www.edx.org/learn/coding/university-of-british-columbia-how-to-code-complex-data' },
              ]},
            ],
          },
          {
            title: '编程语言 — 华盛顿大学',
            description: 'ML 家族语言、Lisp 家族、Ruby。深入理解编程语言的范式与设计',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/programming-languages' },
              ]},
            ],
          },
          {
            title: '面向对象设计 — NEU/edX',
            description: '面向对象设计、设计模式、UML、单元测试',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/object-oriented-design' },
              ]},
            ],
          },
          {
            title: '软件架构 — Coursera',
            description: '软件架构设计、大型系统的组织与设计原则',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/software-architecture' },
              ]},
            ],
          },
        ],
      },
      {
        title: '数学',
        items: [
          {
            title: '微积分 1A：微分学 — MIT',
            description: '微积分基础：微分学。高中数序水平的同学可以开始',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'MIT Open Learning', url: 'https://openlearninglibrary.mit.edu/courses/course-v1:MITx+18.01.1x+2T2019/about' },
              ]},
            ],
          },
          {
            title: '微积分 1B：积分学 — MIT',
            description: '微积分基础：积分学',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'MIT Open Learning', url: 'https://openlearninglibrary.mit.edu/courses/course-v1:MITx+18.01.2x+3T2019/about' },
              ]},
            ],
          },
          {
            title: '微积分 1C：坐标系与无穷级数 — MIT',
            description: '坐标系与无穷级数',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'MIT Open Learning', url: 'https://openlearninglibrary.mit.edu/courses/course-v1:MITx+18.01.3x+1T2020/about' },
              ]},
            ],
          },
          {
            title: '计算机科学数学 — MIT 6.042J',
            description: '离散数学、数学证明、O 记号、离散概率。CS 核心数学基础',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'MIT Open Learning', url: 'https://openlearninglibrary.mit.edu/courses/course-v1:MITx+6.042J+2T2019/about' },
              ]},
            ],
          },
        ],
      },
      {
        title: 'CS 工具',
        items: [
          {
            title: '计算机教育中缺失的一课 — MIT',
            description: '终端与 Shell、Vim、Git、命令行环境。课堂上不教的实用工具技能',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'MIT 课程页', url: 'https://missing.csail.mit.edu/' },
              ]},
            ],
          },
        ],
      },
      {
        title: '系统',
        items: [
          {
            title: '从与非门到俄罗斯方块 第一部分',
            description: '从逻辑门开始，构建计算机硬件平台。理解计算机的底层工作原理',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/build-a-computer' },
              ]},
            ],
          },
          {
            title: '从与非门到俄罗斯方块 第二部分',
            description: '在自制硬件上构建编译器、操作系统。完整的计算机系统构建体验',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/nand2tetris2' },
              ]},
            ],
          },
          {
            title: '操作系统导论 — 威斯康星大学',
            description: '进程管理、内存管理、文件系统、并发与同步。基于经典教材 OSTEP',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: '教材主页', url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/' },
              ]},
            ],
          },
          {
            title: '计算机网络：自顶向下方法',
            description: '应用层、传输层、网络层、链路层。自顶向下学习计算机网络',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: '在线课程', url: 'https://gaia.cs.umass.edu/kurose_ross/online_lectures.htm' },
              ]},
            ],
          },
        ],
      },
      {
        title: '理论',
        items: [
          {
            title: '算法：设计与分析 — Stanford',
            description: '分治、排序与搜索、图搜索、贪心算法、动态规划、NP 完全性。包含 Part 1 & 2',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'Part 1 - edX', url: 'https://www.edx.org/course/algorithms-design-and-analysis' },
                { title: 'Part 2 - edX', url: 'https://www.edx.org/course/algorithms-design-and-analysis-2' },
              ]},
            ],
          },
        ],
      },
      {
        title: '安全（3 门必修 + 选 1 门）',
        items: [
          {
            title: '网络安全基础 — RIT/edX',
            description: '网络安全基础、威胁建模、安全架构',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'edX 课程', url: 'https://www.edx.org/course/cybersecurity-fundamentals' },
              ]},
            ],
          },
          {
            title: '安全编程原则 — Coursera',
            description: '安全编程原则、常见漏洞模式、防御性编程',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/secure-coding-principles' },
              ]},
            ],
          },
          {
            title: '安全漏洞识别 — Coursera',
            description: '安全漏洞识别与修复',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/identifying-security-vulnerabilities' },
              ]},
            ],
          },
          {
            title: 'C/C++ 安全漏洞识别 — UC Davis',
            description: '缓冲区溢出、输入验证、权限管理、竞争条件。二选一选修',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/identifying-security-vulnerabilities-c-programming' },
              ]},
            ],
          },
          {
            title: 'Java 安全漏洞利用与防护 — UC Davis',
            description: 'XSS、SQL 注入、JWT 安全、认证与授权。二选一选修',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/exploiting-securing-vulnerabilities-java-applications' },
              ]},
            ],
          },
        ],
      },
      {
        title: '应用',
        items: [
          {
            title: '数据库：建模与理论 — Stanford/edX',
            description: '关系模型、数据建模、数据库设计理论',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'edX 课程', url: 'https://www.edx.org/course/databases-modeling-and-theory' },
              ]},
            ],
          },
          {
            title: '数据库：关系数据库与 SQL — Stanford/edX',
            description: '关系数据库与 SQL 语言、事务处理、查询优化',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'edX 课程', url: 'https://www.edx.org/course/databases-relational-databases-and-sql' },
              ]},
            ],
          },
          {
            title: '数据库：半结构化数据 — Stanford/edX',
            description: 'JSON、XML、XPath、XQuery。处理非关系型与半结构化数据',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'edX 课程', url: 'https://www.edx.org/learn/relational-databases/stanford-university-databases-semistructured-data' },
              ]},
            ],
          },
          {
            title: '机器学习 — deeplearning.ai',
            description: '神经网络、监督学习、无监督学习、推荐系统。吴恩达经典课程',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/machine-learning' },
              ]},
            ],
          },
          {
            title: '计算机图形学 — UCSD/edX',
            description: 'OpenGL、光线追踪、渲染管线、图形学基础',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'edX 课程', url: 'https://www.edx.org/course/computer-graphics' },
              ]},
            ],
          },
          {
            title: '软件工程导论 — UBC/edX',
            description: 'Agile 方法论、REST、软件规格说明、重构',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'edX 课程', url: 'https://www.edx.org/course/software-engineering-introduction' },
              ]},
            ],
          },
        ],
      },
      {
        title: '伦理',
        items: [
          {
            title: '伦理、技术与工程 — Coursera',
            description: '工程伦理、技术社会影响、职业道德',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/ethics-technology-engineering' },
              ]},
            ],
          },
          {
            title: '知识产权导论 — Coursera',
            description: '知识产权法基础、专利、版权、商标',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/introduction-intellectual-property' },
              ]},
            ],
          },
          {
            title: '数据隐私基础 — Coursera',
            description: '数据隐私基础、隐私法规、合规要求',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/data-privacy-fundamentals' },
              ]},
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'advanced',
    title: '高级课程',
    icon: 'mdi-creation',
    color: '#9C27B0',
    groups: [
      {
        title: '高级编程',
        items: [
          {
            title: '并行编程 — Coursera',
            description: '并行计算、多线程编程、Scala 并行集合',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/parprog1' },
              ]},
            ],
          },
          {
            title: '编译器 — Stanford/edX',
            description: '词法分析、语法分析、语义分析、代码生成与优化',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'edX 课程', url: 'https://www.edx.org/course/compilers' },
              ]},
            ],
          },
          {
            title: 'Haskell 编程导论 — 宾夕法尼亚大学',
            description: '函数式编程、类型类、Monad、惰性求值。深入理解纯函数式编程范式',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'Penn CIS 194', url: 'https://www.seas.upenn.edu/~cis194/fall16/' },
              ]},
            ],
          },
          {
            title: 'Prolog 编程入门',
            description: '逻辑编程、回溯、递归、约束求解。探索声明式编程范式',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: '免费在线教材', url: 'https://www.let.rug.nl/bos/lpn//lpnpage.php?pageid=online' },
              ]},
            ],
          },
          {
            title: '软件调试 — Coursera',
            description: '调试理论与实践、自动化调试工具',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'YouTube 播放列表', url: 'https://www.youtube.com/playlist?list=PLAwxTw4SYaPmRCR84p0GXH3QNxH8BzNfD' },
              ]},
            ],
          },
          {
            title: '软件测试 — Coursera',
            description: '软件测试方法、测试自动化、测试驱动开发',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'YouTube 播放列表', url: 'https://www.youtube.com/playlist?list=PLAwxTw4SYaPnqZni3D4f7m2TS5S9LqLz9' },
              ]},
            ],
          },
        ],
      },
      {
        title: '高级系统',
        items: [
          {
            title: '计算结构 — MIT（三件套）',
            description: '数字电路 → 计算机体系结构 → 计算机组织。深入理解计算机硬件',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'Digital Circuits', url: 'https://openlearninglibrary.mit.edu/courses/course-v1:MITx+6.004.1x+3T2017/about' },
                { title: 'Computer Architecture', url: 'https://openlearninglibrary.mit.edu/courses/course-v1:MITx+6.004.2x+3T2017/about' },
                { title: 'Computer Organization', url: 'https://openlearninglibrary.mit.edu/courses/course-v1:MITx+6.004.3x+3T2017/about' },
              ]},
            ],
          },
        ],
      },
      {
        title: '高级理论',
        items: [
          {
            title: '计算理论 — MIT',
            description: '形式语言、图灵机、可计算性、计算复杂性',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'MIT OCW', url: 'https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/' },
              ]},
            ],
          },
          {
            title: '计算几何 — 清华/edX',
            description: '计算几何、几何算法、空间数据结构',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'edX 课程', url: 'https://www.edx.org/course/computational-geometry' },
              ]},
            ],
          },
          {
            title: '算法博弈论 — Stanford',
            description: '博弈论与算法、机制设计、拍卖理论',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/algorithmic-game-theory' },
              ]},
            ],
          },
        ],
      },
      {
        title: '高级信息安全',
        items: [
          {
            title: 'Web 安全基础 — KU Leuven/edX',
            description: 'Web 安全基础、OWASP Top 10、XSS/SQL 注入等常见攻击',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'edX 课程', url: 'https://www.edx.org/course/web-security-fundamentals' },
              ]},
            ],
          },
          {
            title: '安全治理与合规 — UC Irvine',
            description: '安全治理框架、合规要求、风险管理、NIST 框架',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/security-governance-compliance' },
              ]},
            ],
          },
          {
            title: '数字取证概念 — Coursera',
            description: '数字取证概念与方法',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'Coursera 课程', url: 'https://www.coursera.org/learn/digital-forensics-concepts' },
              ]},
            ],
          },
          {
            title: '安全软件开发（三件套）— Linux Foundation/edX',
            description: '安全软件开发全生命周期：需求设计 → 实现 → 验证',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: '需求、设计与重用', url: 'https://www.edx.org/learn/software-development/the-linux-foundation-secure-software-development-requirements-design-and-reuse' },
                { title: '实现', url: 'https://training.linuxfoundation.org/training/secure-software-development-implementation-lfd105/' },
                { title: '验证与高级主题', url: 'https://training.linuxfoundation.org/training/secure-software-development-implementation-lfd105/' },
              ]},
            ],
          },
        ],
      },
      {
        title: '高级数学',
        items: [
          {
            title: '线性代数本质 — 3Blue1Brown',
            description: '通过可视化方式直观理解线性代数的核心概念',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'YouTube 系列', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab' },
              ]},
            ],
          },
          {
            title: '线性代数 — MIT 18.06SC',
            description: '线性代数的完整课程，包含矩阵、向量空间、特征值等',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'MIT OCW', url: 'https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/' },
              ]},
            ],
          },
          {
            title: '数值方法导论 — MIT',
            description: '数值线性代数、浮点运算、SVD、QR 分解、迭代方法',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'MIT OCW', url: 'https://ocw.mit.edu/courses/18-335j-introduction-to-numerical-methods-spring-2019/' },
              ]},
            ],
          },
          {
            title: '概率论 — Harvard Stat 110',
            description: '概率论，涵盖概率分布、期望、方差、大数定律等',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'Harvard 课程页', url: 'https://projects.iq.harvard.edu/stat110' },
              ]},
            ],
          },
          {
            title: '形式逻辑导论',
            description: '命题逻辑、谓词逻辑、自然演绎、语义推理',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: '免费在线教材', url: 'https://forallx.openlogicproject.org/' },
              ]},
            ],
          },
          {
            title: '集合论',
            description: '公理化集合论、序数、基数、选择公理',
            resources: [
              { name: '课程链接', icon: 'mdi-link', items: [
                { title: 'YouTube 播放列表', url: 'https://www.youtube.com/playlist?list=PL5KkMZvBpo5AH_5GpxMiryJT6Dkj32H6N' },
              ]},
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'project',
    title: '毕业项目',
    icon: 'mdi-rocket-launch',
    color: '#F44336',
    items: [
      {
        title: '全栈开放课程 — 赫尔辛基大学',
        description: '全栈 Web 开发：React、Node.js、GraphQL、数据库。OSSU 推荐毕业项目方向',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: '免费课程', url: 'https://fullstackopen.com/en/' },
          ]},
        ],
      },
      {
        title: '现代机器人学 — Northwestern',
        description: '运动学、动力学、运动规划与控制。26 周系统学习机器人学',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'Coursera 专项课程', url: 'https://www.coursera.org/specializations/modernrobotics' },
          ]},
        ],
      },
      {
        title: '数据挖掘 — UIUC',
        description: '数据可视化、文本挖掘、模式发现、聚类分析。30 周系统学习',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'Coursera 专项课程', url: 'https://www.coursera.org/specializations/data-mining' },
          ]},
        ],
      },
      {
        title: '大数据 — UCSD',
        description: 'Hadoop、Spark、NoSQL、分布式数据处理。30 周系统学习',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'Coursera 专项课程', url: 'https://www.coursera.org/specializations/big-data' },
          ]},
        ],
      },
      {
        title: '物联网 — UCI',
        description: '嵌入式系统、无线通信、传感器网络、IoT 安全。30 周系统学习',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'Coursera 专项课程', url: 'https://www.coursera.org/specializations/internet-of-things' },
          ]},
        ],
      },
      {
        title: '云计算 — UIUC',
        description: '云计算基础、分布式系统、虚拟化、数据中心网络',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'Coursera 专项课程', url: 'https://www.coursera.org/specializations/cloud-computing' },
          ]},
        ],
      },
      {
        title: '数据科学专项 — JHU',
        description: 'R 语言、数据分析、机器学习、数据产品。43 周系统学习数据科学',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'Coursera 专项课程', url: 'https://www.coursera.org/specializations/jhu-data-science' },
          ]},
        ],
      },
      {
        title: 'Scala 函数式编程 — EPFL',
        description: 'Scala 函数式编程、高阶函数、类型系统、并发编程',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'Coursera 专项课程', url: 'https://www.coursera.org/specializations/scala' },
          ]},
        ],
      },
      {
        title: '游戏设计与开发 — MSU',
        description: 'Unity 2020 游戏设计、开发、美术与动画。6 个月系统学习',
        resources: [
          { name: '课程链接', icon: 'mdi-link', items: [
            { title: 'Coursera 专项课程', url: 'https://www.coursera.org/specializations/game-design-and-development' },
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
  :groups="cat.groups"
/>

