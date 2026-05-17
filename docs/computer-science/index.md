<script setup>
import TutorialCards from '../.vitepress/components/TutorialCards.vue'

const categories = [
  {
    id: 'core',
    title: '核心基础',
    icon: 'mdi-monitor',
    color: '#2196F3',
    items: [
      { title: '数据结构与算法', desc: '数组、链表、树、图、排序、搜索、动态规划等', url: './data-structures-algorithms' },
      { title: '计算机网络', desc: 'TCP/IP、HTTP/HTTPS、DNS、网络安全协议等', url: './computer-networks' },
      { title: '操作系统', desc: '进程管理、内存管理、文件系统、并发与同步等', url: './operating-systems' },
      { title: '数据库系统原理', desc: '关系模型、SQL、索引、事务、ACID、范式设计等', url: './database-systems' },
      { title: '计算机组成原理', desc: 'CPU 架构、存储器层次、指令流水线、I/O 系统等', url: './computer-organization' },
    ],
  },
  {
    id: 'systems',
    title: '系统与软件',
    icon: 'mdi-code-brackets',
    color: '#4CAF50',
    items: [
      { title: '编译原理', desc: '词法分析、语法分析、语义分析、中间代码生成、优化等', url: './compilers' },
      { title: '软件工程', desc: '软件过程、需求分析、设计模式、测试、项目管理等', url: './software-engineering' },
    ],
  },
  {
    id: 'math',
    title: '数学与理论',
    icon: 'mdi-sigma',
    color: '#9C27B0',
    items: [
      { title: '离散数学', desc: '数理逻辑、集合论、图论、代数结构、组合数学等', url: './discrete-mathematics' },
      { title: '密码学', desc: '对称/公钥密码、哈希函数、数字签名、安全协议等', url: './cryptography' },
    ],
  },
  {
    id: 'applied',
    title: '应用领域',
    icon: 'mdi-application',
    color: '#FF9800',
    items: [
      { title: '人工智能导论', desc: '搜索、知识表示、机器学习、深度学习、强化学习等', url: './artificial-intelligence' },
      { title: '计算机图形学', desc: '渲染管线、光照模型、纹理映射、光线追踪等', url: './computer-graphics' },
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
