<script setup>
import TutorialCards from '../.vitepress/components/TutorialCards.vue'

const categories = [
  {
    id: 'core',
    title: '核心基础',
    icon: 'mdi-monitor',
    color: '#2196F3',
    items: [
      { title: '数据结构与算法', description: '数组、链表、树、图、排序、搜索、动态规划等', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '尚硅谷 数据结构与算法', url: 'https://www.bilibili.com/video/BV1LJ411W7dP', icon: 'mdi-play-circle-outline' },
          { title: 'Algorithms Full Course', url: 'https://www.youtube.com/watch?v=8hly31xKli0', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '在线教程', icon: 'mdi-file-document-outline', items: [
          { title: '数据结构与算法基础', url: './data-structures-algorithms', icon: 'mdi-file-document-outline' },
          { title: 'VisuAlgo 可视化', url: 'https://visualgo.net/', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: '计算机网络', description: 'TCP/IP、HTTP/HTTPS、DNS、网络安全协议等', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '计算机网络 微学堂', url: 'https://www.bilibili.com/video/BV1c4411d7jb', icon: 'mdi-play-circle-outline' },
          { title: 'Computer Networking Course', url: 'https://www.youtube.com/watch?v=qiQR5rTSshw', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '在线教程', icon: 'mdi-file-document-outline', items: [
          { title: '计算机网络基础', url: './computer-networks', icon: 'mdi-file-document-outline' },
          { title: 'MDN HTTP 文档', url: 'https://developer.mozilla.org/zh-CN/docs/Web/HTTP', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: '操作系统', description: '进程管理、内存管理、文件系统、并发与同步等', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '操作系统 微学堂', url: 'https://www.bilibili.com/video/BV1YE411D7nH', icon: 'mdi-play-circle-outline' },
          { title: 'Operating Systems Course', url: 'https://www.youtube.com/watch?v=vBURTt97EkA', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '在线教程', icon: 'mdi-file-document-outline', items: [
          { title: '操作系统基础', url: './operating-systems', icon: 'mdi-file-document-outline' },
          { title: 'OS Dev Wiki', url: 'https://wiki.osdev.org/', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: '数据库系统原理', description: '关系模型、SQL、索引、事务、ACID、范式设计等', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '尚硅谷 数据库教程', url: 'https://www.bilibili.com/video/BV1iq4y1u7vj', icon: 'mdi-play-circle-outline' },
          { title: 'Database Systems Course', url: 'https://www.youtube.com/watch?v=4Z9KEBexzcM', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '在线教程', icon: 'mdi-file-document-outline', items: [
          { title: '数据库系统原理', url: './database-systems', icon: 'mdi-file-document-outline' },
          { title: 'W3Schools SQL', url: 'https://www.w3schools.com/sql/', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: '计算机组成原理', description: 'CPU 架构、存储器层次、指令流水线、I/O 系统等', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '计算机组成原理 哈工大', url: 'https://www.bilibili.com/video/BV1WW411Q7PF', icon: 'mdi-play-circle-outline' },
          { title: 'Computer Architecture Course', url: 'https://www.youtube.com/watch?v=zLP_X4wyHbY', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '在线教程', icon: 'mdi-file-document-outline', items: [
          { title: '计算机组成原理', url: './computer-organization', icon: 'mdi-file-document-outline' },
          { title: 'CPU 架构概览', url: 'https://www.runoob.com/computer-organization/computer-organization-tutorial.html', icon: 'mdi-file-document-outline' },
        ]},
      ]},
    ],
  },
  {
    id: 'systems',
    title: '系统与软件',
    icon: 'mdi-code-brackets',
    color: '#4CAF50',
    items: [
      { title: '编译原理', description: '词法分析、语法分析、语义分析、中间代码生成、优化等', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '编译原理 哈工大', url: 'https://www.bilibili.com/video/BV1zW411t7YE', icon: 'mdi-play-circle-outline' },
          { title: 'Compiler Design Course', url: 'https://www.youtube.com/watch?v=Qkwj65l_96I', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '在线教程', icon: 'mdi-file-document-outline', items: [
          { title: '编译原理基础', url: './compilers', icon: 'mdi-file-document-outline' },
          { title: 'Crafting Interpreters', url: 'https://craftinginterpreters.com/', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: '软件工程', description: '软件过程、需求分析、设计模式、测试、项目管理等', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '软件工程 教程 B站', url: 'https://www.bilibili.com/video/BV1kW411W7pZ', icon: 'mdi-play-circle-outline' },
          { title: 'Software Engineering Course', url: 'https://www.youtube.com/watch?v=O753uuutqH8', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '在线教程', icon: 'mdi-file-document-outline', items: [
          { title: '软件工程基础', url: './software-engineering', icon: 'mdi-file-document-outline' },
          { title: '菜鸟教程 设计模式', url: 'https://www.runoob.com/design-pattern/design-pattern-tutorial.html', icon: 'mdi-file-document-outline' },
        ]},
      ]},
    ],
  },
  {
    id: 'math',
    title: '数学与理论',
    icon: 'mdi-sigma',
    color: '#9C27B0',
    items: [
      { title: '离散数学', description: '数理逻辑、集合论、图论、代数结构、组合数学等', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '离散数学 教程 B站', url: 'https://www.bilibili.com/video/BV1Rt41197xe', icon: 'mdi-play-circle-outline' },
          { title: 'Discrete Mathematics Course', url: 'https://www.youtube.com/watch?v=tyDKR4DCUhs', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '在线教程', icon: 'mdi-file-document-outline', items: [
          { title: '离散数学基础', url: './discrete-mathematics', icon: 'mdi-file-document-outline' },
          { title: '菜鸟教程 离散数学', url: 'https://www.runoob.com/discrete-mathematics/discrete-mathematics-tutorial.html', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: '密码学', description: '对称/公钥密码、哈希函数、数字签名、安全协议等', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '密码学 教程 B站', url: 'https://www.bilibili.com/video/BV1Kx411N7Qe', icon: 'mdi-play-circle-outline' },
          { title: 'Cryptography Full Course', url: 'https://www.youtube.com/watch?v=6_Cxj5WKpIw', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '在线教程', icon: 'mdi-file-document-outline', items: [
          { title: '密码学基础', url: './cryptography', icon: 'mdi-file-document-outline' },
          { title: 'Crypto 101', url: 'https://www.crypto101.io/', icon: 'mdi-file-document-outline' },
        ]},
      ]},
    ],
  },
  {
    id: 'applied',
    title: '应用领域',
    icon: 'mdi-application',
    color: '#FF9800',
    items: [
      { title: '人工智能导论', description: '搜索、知识表示、机器学习、深度学习、强化学习等', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '吴恩达 机器学习教程', url: 'https://www.bilibili.com/video/BV1Bq421A7G6', icon: 'mdi-play-circle-outline' },
          { title: 'AI Full Course', url: 'https://www.youtube.com/watch?v=JMUxmLyrhSk', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '在线教程', icon: 'mdi-file-document-outline', items: [
          { title: '人工智能导论', url: './artificial-intelligence', icon: 'mdi-file-document-outline' },
          { title: 'Scikit-learn 文档', url: 'https://scikit-learn.org/stable/', icon: 'mdi-file-document-outline' },
        ]},
      ]},
      { title: '计算机图形学', description: '渲染管线、光照模型、纹理映射、光线追踪等', resources: [
        { name: '视频教程', icon: 'mdi-play-circle-outline', items: [
          { title: '计算机图形学 教程 B站', url: 'https://www.bilibili.com/video/BV1X4411W7KF', icon: 'mdi-play-circle-outline' },
          { title: 'Computer Graphics Course', url: 'https://www.youtube.com/watch?v=00Tb3I31wX0', icon: 'mdi-play-circle-outline' },
        ]},
        { name: '在线教程', icon: 'mdi-file-document-outline', items: [
          { title: '计算机图形学', url: './computer-graphics', icon: 'mdi-file-document-outline' },
          { title: 'LearnOpenGL', url: 'https://learnopengl.com/', icon: 'mdi-file-document-outline' },
        ]},
      ]},
    ],
  },
]
</script>

# 计算机科学

计算机科学是技术领域的根基，涵盖从底层硬件到上层应用的完整知识体系。掌握计算机科学基础，有助于更深入地理解编程语言、框架和系统设计背后的原理。

<TutorialCards
  v-for="(cat, i) in categories" :key="i"
  :id="cat.id"
  :title="cat.title"
  :icon="cat.icon"
  :color="cat.color"
  :items="cat.items"
/>
