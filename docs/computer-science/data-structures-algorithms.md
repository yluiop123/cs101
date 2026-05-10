<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: '数据结构与算法',
  description: '数据结构与算法是计算机科学的核心基础，直接影响程序的效率和质量。',
  items: [
    {
      name: '线性结构',
      children: [
        { title: "数组", detail: "静态数组 vs 动态数组\n连续内存分配、随机访问 O(1)\n插入/删除操作时间复杂度 O(n)\n动态数组扩容策略（均摊分析）\n多维数组与内存布局（行优先 vs 列优先）\n缓存友好性：空间局部性优势" },
        { title: "链表", detail: "单链表：每个节点持有 next 指针\n双链表：prev + next 双向遍历\n循环链表：尾节点指向头节点\n虚拟头节点（dummy node）简化边界操作\n插入/删除操作时间复杂度 O(1)（已知位置）\n链表 vs 数组：插入删除 vs 随机访问权衡\n应用场景：LRU 缓存、内存池管理" },
        { title: "跳表", detail: "多层索引结构：逐层跳跃查找\n查找 / 插入 / 删除平均 O(log n)\n动态更新：插入时随机决定层数\n空间复杂度 O(n log n) 以空间换时间\nRedis Sorted Set 底层实现\n与平衡树对比：实现简单、范围查询友好" },
        { title: "栈", detail: "后进先出（LIFO）原则\n顺序栈（数组实现）vs 链式栈（链表实现）\n核心操作：push / pop / peek / isEmpty\n函数调用栈：调用帧与返回地址\n表达式求值：中缀转后缀、后缀求值\n括号匹配问题\n浏览器后退 / 撤销操作功能" },
        { title: "单调栈", detail: "栈内元素保持单调递增或递减\n下一个更大元素（Next Greater Element）\n柱状图中最大矩形面积（LeetCode 84）\n接雨水问题（LeetCode 42）的双指针/单调栈解法\n典型时间复杂度 O(n)" },
        { title: "队列", detail: "先进先出（FIFO）原则\n顺序队列（数组实现）vs 链式队列（链表实现）\n循环队列：解决假溢出问题，充分利用空间\n双端队列（Deque）：两端均可进出\n阻塞队列：生产者-消费者模型\n优先队列：基于堆实现，按优先级出队\n应用场景：BFS、任务调度、消息队列" },
        { title: "单调队列", detail: "队列内元素保持单调递减或递增\n滑动窗口最大值/最小值问题 O(n)\n使用双端队列（Deque）实现\n经典题型：滑动窗口最大值（LeetCode 239）" },
      ],
    },
    {
      name: '树形结构',
      children: [
        { title: '**二叉树**：遍历（前序/中序/后序/层序）' },
        { title: '**线索二叉树**：利用空指针加速遍历' },
        { title: '**二叉搜索树**：查找 O(log n)' },
        { title: '**平衡树**：AVL 树、红黑树' },
        { title: '**Treap / Splay**：随机平衡树与伸展树' },
        { title: '**堆**：最大堆、最小堆，优先队列' },
        { title: '**Trie**：前缀匹配、自动补全' },
        { title: '**并查集**：集合合并与查找，路径压缩、按秩合并' },
        { title: '**线段树**：区间查询、区间更新、懒标记' },
        { title: '**树状数组**：前缀和、单点更新、区间查询' },
      ],
    },
    {
      name: '图形结构',
      children: [
        { title: '**邻接矩阵 / 邻接表**' },
        { title: '**图的遍历**：DFS、BFS' },
        { title: '**最短路径**：Dijkstra、Bellman-Ford、Floyd、SPFA' },
        { title: '**最小生成树**：Prim、Kruskal' },
        { title: '**拓扑排序**：Kahn 算法、DFS 方法' },
        { title: '**关键路径**：AOE 网、最早/最晚时间' },
        { title: '**强连通分量**：Tarjan、Kosaraju' },
        { title: '**二分图判定与匹配**：染色法、匈牙利算法' },
      ],
    },
    {
      name: '哈希结构',
      children: [
        { title: '**哈希表**：散列函数、冲突解决（链地址法、开放地址法）' },
        { title: '**布隆过滤器**：概率性数据结构' },
        { title: '**一致性哈希**：分布式缓存、虚拟节点' },
        { title: '**哈希函数设计**：除留余数法、乘法散列、全域散列' },
      ],
    },
    {
      name: '排序算法',
      children: [
        { title: '冒泡排序 | O(n²) | O(1) | 稳定' },
        { title: '选择排序 | O(n²) | O(1) | 不稳定' },
        { title: '插入排序 | O(n²) | O(1) | 稳定' },
        { title: '希尔排序 | O(n log² n) | O(1) | 不稳定 | 递减增量' },
        { title: '归并排序 | O(n log n) | O(n) | 稳定' },
        { title: '快速排序 | O(n log n) | O(log n) | 不稳定' },
        { title: '堆排序 | O(n log n) | O(1) | 不稳定' },
        { title: '计数排序 | O(n + k) | O(k) | 稳定 | 整数排序' },
        { title: '基数排序 | O(d(n + k)) | O(n + k) | 稳定 | 按位排序' },
        { title: '桶排序 | O(n + k) | O(n) | 稳定 | 均匀分布' },
      ],
    },
    {
      name: '搜索算法',
      children: [
        { title: '**二分搜索**：O(log n)' },
        { title: '**BFS / DFS**' },
        { title: '**二分查找变体**：旋转数组、查找边界' },
        { title: '**回溯法**：N 皇后、数独、全排列' },
        { title: '**剪枝优化**：可行性剪枝、最优性剪枝' },
        { title: '**迭代加深搜索**：IDA*' },
        { title: '**启发式搜索**：A* 算法' },
      ],
    },
    {
      name: '动态规划',
      children: [
        { title: '**经典问题**：背包、最长公共子序列、最长递增子序列' },
        { title: '**状态定义与转移方程**' },
        { title: '**记忆化搜索 vs 递推**' },
        { title: '**区间 DP**：石子合并、矩阵链乘' },
        { title: '**树形 DP**：树的最大独立集、树的直径' },
        { title: '**状压 DP**：旅行商问题、集合覆盖' },
        { title: '**数位 DP**：数字范围内的计数问题' },
        { title: '**数论 DP**：整数拆分、整除计数' },
      ],
    },
    {
      name: '字符串算法',
      children: [
        { title: '**KMP**：字符串匹配，next 数组' },
        { title: '**Rabin-Karp**：滚动哈希' },
        { title: '**Trie**：前缀树匹配' },
        { title: '**AC 自动机**：多模式串匹配' },
        { title: '**Manacher**：最长回文子串 O(n)' },
        { title: '**后缀数组**：字符串排序、最长公共前缀 LCP' },
        { title: '**编辑距离**：Levenshtein 距离' },
        { title: '**Z 算法**：Z 函数、字符串匹配' },
      ],
    },
  ],
  groups: [
    {
      name: "推荐资源",
      items: [
        { title: "《算法导论》（CLRS）" },
        { title: "《数据结构与算法分析》" },
        { title: "《算法竞赛入门经典》（紫书）" },
        { title: "LeetCode / 力扣刷题" }
      ],
    }
  ]
}
</script>
<ContentView :data="data" />
