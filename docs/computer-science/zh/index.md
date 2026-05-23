<script setup>
import TutorialCards from '../../.vitepress/components/TutorialCards.vue'

const categories = [
  {
    id: 'basic',
    title: '专业基础课',
    icon: 'mdi-school',
    color: '#2196F3',
    items: [
      {
        title: '程序设计基础',
        description: 'C/C++ 语言基础、程序设计方法、结构化编程思想、算法入门',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '程序设计基础 - 清华大学 徐明星', url: 'https://www.xuetangx.com/course/THU08091000270/29594948' },
            { title: '程序设计入门 -- C语言 - 浙江大学 翁恺', url: 'https://www.icourse163.org/course/ZJU-199001' },
          ]},
        ],
      },
      {
        title: '面向对象程序设计',
        description: '类与对象、继承、多态、封装、C++ 面向对象设计思想',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '面向对象程序设计（C++）- 清华大学 黄震春/徐明星', url: 'https://www.xuetangx.com/course/THU08091000348/29592841' }
          ]},
        ],
      },
      {
        title: '离散数学',
        description: '数理逻辑、集合论、图论、代数结构、组合数学',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '离散数学 - 电子科技大学 傅彦（国家级精品课）', url: 'https://www.icourse163.org/course/UESTC-1002268006' },
            { title: '组合数学 - 清华大学 马昱春', url: 'https://www.xuetangx.com/course/THU08091000450/29593106' },
          ]},
        ],
      },
    ],
  },
  {
    id: 'required',
    title: '专业必修课',
    icon: 'mdi-book-multiple',
    color: '#4CAF50',
    items: [
      {
        title: '数据结构',
        description: '线性结构、树、图、哈希表、排序算法，国内最知名的数据结构MOOC课程',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '数据结构（上）- 清华大学 邓俊辉', url: 'https://next.xuetangx.com/course/THU08091000384/23896556' },
            { title: '数据结构（下）- 清华大学 邓俊辉', url: 'https://www.xuetangx.com/course/THU08091002048/29593461' },
            { title: '数据结构 - 浙江大学 陈越/何钦铭', url: 'https://www.icourse163.org/course/ZJU-93001' },
          ]},
        ],
      },
      {
        title: '算法设计与分析',
        description: '算法复杂度分析、分治、动态规划、贪心、回溯算法',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '算法设计与分析入门 - 清华大学 王振波', url: 'https://www.xuetangx.com/course/THU08091001409/29593026' },
            { title: '算法设计与分析入门 - 哈尔滨工业大学', url: 'https://www.icourse163.org/course/HIT-356006' },
          ]},
        ],
      },
      {
        title: '计算机组成原理',
        description: 'CPU架构、存储器层次、指令流水线、I/O系统，基于唐朔飞教材的国家级精品课',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '计算机组成原理 - 华中科技大学 秦磊华', url: 'https://www.icourse163.org/course/HUST-1003159001' },            
            { title: '计算机组成原理（上） - 哈尔滨工业大学 刘宏伟', url: 'https://www.icourse163.org/course/HIT-309001' },
            { title: '计算机组成原理（下） - 哈尔滨工业大学 刘宏伟', url: 'https://www.icourse163.org/course/HIT-1001527001' }
          ]},
        ],
      },
      {
        title: '操作系统',
        description: '进程管理、内存管理、文件系统、并发与同步。哈工大版基于Linux 0.11内核，清华版基于ucore教学系统',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '操作系统 - 清华大学 向勇/陈渝（学堂在线）', url: 'https://www.xuetangx.com/course/THU08091000267/12424484' },
            { title: '操作系统 - 哈尔滨工业大学 李治军', url: 'https://www.icourse163.org/course/HIT-1002531008' },
          ]},
        ],
      },
      {
        title: '编译原理',
        description: '词法分析、语法分析、语义分析、中间代码生成、代码优化，国家级一流本科课程',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '编译原理 - 哈尔滨工业大学 陈鄞', url: 'https://www.icourse163.org/course/HIT-1002123007' },
          ]},
        ],
      },
      {
        title: '数据库系统',
        description: '关系模型、SQL、索引、事务、ACID、范式设计，融入华为openGauss开源数据库实践',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '数据库系统（上）：模型与语言 - 哈工大 战德臣', url: 'https://www.icourse163.org/course/HIT-1001516002' },
            { title: '数据库系统（中）：建模与设计 - 哈工大 战德臣', url: 'https://www.icourse163.org/spoc/course/HIT-1470868166' },
            { title: '数据库系统（下）：管理与技术 - 哈工大 战德臣', url: 'https://www.icourse163.org/course/HIT-1001578001' },
          ]},
        ],
      },
      {
        title: '计算机网络',
        description: 'TCP/IP、HTTP/HTTPS、DNS、网络安全协议，国家精品课程，采用自顶向下方法',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '计算机网络 - 哈尔滨工业大学', url: 'https://www.icourse163.org/course/HIT-154005' },
          ]},
        ],
      },
      {
        title: '软件工程',
        description: '软件过程、需求分析、设计模式、测试、项目管理',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '软件工程 - 清华大学 刘强（学堂在线）', url: 'https://www.xuetangx.com/course/THU08091000367/29593733' },
            { title: '软件工程 - 北京大学', url: 'https://www.icourse163.org/course/PKU-1003177002' },
          ]},
        ],
      },
    ],
  },
  {
    id: 'math',
    title: '数学必修/选修课',
    icon: 'mdi-sigma',
    color: '#9C27B0',
    items: [
      {
        title: '高等数学 / 微积分',
        description: '函数、极限、微分、积分、级数、微分方程。采用同济七版教材',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '微积分——极限理论与一元函数 - 清华大学', url: 'https://www.xuetangx.com/course/THU07011000400/29593995' },
            { title: '微积分——多元函数与重积分 - 清华大学', url: 'https://www.xuetangx.com/course/THU07011000401/26283984' }
          ]},
        ],
      },
      {
        title: '线性代数',
        description: '矩阵、向量空间、线性变换、特征值、二次型',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '线性代数(1) - 清华大学 马辉（学堂在线）', url: 'https://www.xuetangx.com/course/THU07011000411/29594058' },
            { title: '线性代数(2) - 清华大学 马辉（学堂在线）', url: 'https://www.xuetangx.com/course/THU07011000412/29594071' },
          ]},
        ],
      },
      {
        title: '概率论与数理统计',
        description: '概率、随机变量、分布、统计推断、假设检验、回归分析',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '概率论与数理统计 - 清华大学 梁恒（学堂在线）', url: 'https://www.xuetangx.com/course/thu0701fu120604/29596006' },
          ]},
        ],
      },
      {
        title: '数值分析',
        description: '插值、数值积分、微分方程数值解、线性方程组求解，使用李庆扬《数值分析（第5版）》',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '数值分析与算法 - 清华大学 周杰（学堂在线）', url: 'https://next.xuetangx.com/course/thu0701fu120604/14770190' },
            { title: '数值分析 - 西安电子科技大学', url: 'https://www.icourse163.org/course/XDU-1464106177' },
            { title: '数值分析 - 北京大学（国家精品课）', url: 'https://www.icourse163.org/course/1206215811' },
          ]},
        ],
      },
      {
        title: '数学建模',
        description: '数学模型建立、求解、分析，各类数学建模竞赛基础',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '数学建模 - 厦门大学（国家精品课）', url: 'https://www.icourse163.org/course/XMU-1001556009' },
            { title: '数学建模 - 西南交通大学（国家级一流课程）', url: 'https://www.icourse163.org/spoc/course/SWJTU-1468771246' },
          ]},
        ],
      },
      {
        title: '复变函数',
        description: '复数、解析函数、复积分、级数展开、留数定理',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '复变函数 - 国防科技大学', url: 'https://www.icourse163.org/spoc/course/NUDT-1205717802' },
            { title: '复变函数与积分变换 - 西安交通大学（国家级精品资源共享课）', url: 'https://www.icourse163.org/spoc/course/XJTU-1472322164' },
          ]},
        ],
      },
    ],
  },
  {
    id: 'elective',
    title: '专业选修课',
    icon: 'mdi-lightbulb-on',
    color: '#FF9800',
    items: [
      {
        title: 'Linux 操作系统',
        description: 'Linux系统使用、管理、编程，以实践为导向',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '操作系统 - 清华大学 向勇/陈渝', url: 'https://www.xuetangx.com/course/THU08091000267' },
            { title: 'Linux操作系统 - 华东交通大学（国家级一流课程）', url: 'https://www.icourse163.org/course/ECJTU-1474205194' }
          ]},
        ],
      },
      {
        title: '嵌入式系统',
        description: '嵌入式系统设计、STM32开发、RTOS、硬件接口',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: 'ARM微控制器与嵌入式系统 - 清华大学 曾鸣（学堂在线，国家精品课）', url: 'https://www.xuetangx.com/course/THU08091000246/29594937' },
            { title: '嵌入式系统设计 - 华东师范大学（国家一流课程）', url: 'https://www.icourse163.org/course/ECNU-1003428005' },
          ]},
        ],
      },
      {
        title: '网络安全',
        description: '系统安全、网络安全、攻击与防护、密码学应用',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '计算机系统与网络安全技术 - 电子科技大学 周世杰', url: 'https://www.icourse163.org/course/UESTC-235006' },
            { title: '网络攻击与防护 - 北京理工大学（国家级精品课）', url: 'https://www.icourse163.org/course/1003484004' },
          ]},
        ],
      },
      {
        title: '软件理论基础',
        description: '形式语言与自动机、可计算性理论、计算复杂性、程序语义',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '软件理论基础 - 清华大学 罗贵明（学堂在线，国家级一流课程）', url: 'https://www.xuetangx.com/course/THU08091000723/23895417' },
          ]},
        ],
      },
      {
        title: '软件测试',
        description: '测试方法、自动化测试、质量保证、测试管理',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '软件质量保证与测试（国家级一流本科课程）', url: 'https://www.icourse163.org/course/JIT-1001759001' },
            { title: '软件测试 - 西北工业大学', url: 'https://www.xuetangx.com/course/NWPU08091000536/29592454' },
          ]},
        ],
      },
      {
        title: '数据科学',
        description: '数据采集、清洗、分析、可视化、统计学基础',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '数据与智能技术应用 - 清华大学 李超/陈震（学堂在线）', url: 'https://www.xuetangx.com/course/thu0809sjyznjsyy20240819/29604419' },
            { title: '走进数据科学 - 江西财经大学', url: 'https://www.icourse163.org/course/JXUFE-1207182806' },
          ]},
        ],
      },
      {
        title: '大数据系统',
        description: 'Hadoop、Spark、分布式存储与计算、数据仓库，国家精品在线开放课程',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '高级大数据系统 - 清华大学 王智（学堂在线）', url: 'https://next.xuetangx.com/course/THU08091000301/26283533' },
            { title: '数据挖掘：理论与算法 - 清华大学 袁博（学堂在线）', url: 'https://next.xuetangx.com/course/THU08091000385/4215771' },
            { title: '大数据技术原理与应用 - 厦门大学 林子雨', url: 'https://www.icourse163.org/course/XMU-1002335004' },
          ]},
        ],
      },
      {
        title: '汇编语言',
        description: '汇编语言基础、寻址方式、中断、接口编程',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '汇编语言程序设计 - 清华大学 张悠慧（学堂在线）', url: 'https://next.xuetangx.com/course/THU08091000320/21553982' },
            { title: '汇编语言程序设计 - 电子科技大学', url: 'https://www.icourse163.org/course/UESTC-1002047009' },
          ]},
        ],
      },
      {
        title: '人工智能',
        description: '搜索、知识表示、机器学习、深度学习、强化学习',
        resources: [
          { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
            { title: '大数据机器学习 - 清华大学 袁春（学堂在线）', url: 'https://next.xuetangx.com/course/THU08091001026/29593816' },
            { title: '大数据与机器智能 - 清华大学 陈震等（学堂在线）', url: 'https://next.xuetangx.com/course/thu08091010085/23902215' }
          ]},
        ],
      },
    ],
  }
]
</script>

# 国内版教程

计算机科学是技术领域的根基，涵盖从底层硬件到上层应用的完整知识体系。这里汇集了国内优质的中文计算机科学学习资源，涵盖专业基础课、专业必修课、专业选修课以及数学课程。

每门课程均关联了中国大学 MOOC 或 学堂在线的视频教程，点击卡片即可查看。

<TutorialCards
  v-for="(cat, i) in categories" :key="i"
  :id="cat.id"
  :title="cat.title"
  :icon="cat.icon"
  :color="cat.color"
  :items="cat.items"
/>
