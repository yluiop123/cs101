<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: '离散数学',
  description: '离散数学是计算机科学的基础数学工具，涵盖逻辑、集合论、图论、代数结构等，为算法设计、数据库理论、编译原理等提供数学支撑。',
  items: [
    {
      name: '数理逻辑',
      children: [
        { title: '**命题逻辑**：命题、联结词、真值表、逻辑等价' },
        { title: '**谓词逻辑**：量词、谓词、辖域、自由变元/约束变元' },
        { title: '**推理规则**：假言推理、拒取式、析取三段论、归结原理' },
        { title: '**范式**：CNF 合取范式、DNF 析取范式、主范式' },
        { title: '**自然演绎与 sequent 演算**' },
      ],
    },
    {
      name: '集合论',
      children: [
        { title: '**集合基本运算**：并、交、差、对称差、笛卡尔积' },
        { title: '**关系**：二元关系、等价关系、偏序关系、闭包运算' },
        { title: '**函数**：单射、满射、双射、逆函数、复合函数' },
        { title: '**基数**：可数集、不可数集、Cantor 对角线法' },
        { title: '**无限集合**：可数无穷与连续统假设' },
      ],
    },
    {
      name: '图论',
      children: [
        { title: '**图的基本概念**：有向图/无向图、度数、子图、同构' },
        { title: '**图的连通性**：路径、回路、连通分量、强连通分量' },
        { title: '**树**：树的遍历、最小生成树（Kruskal/Prim）' },
        { title: '**欧拉图与哈密顿图**：欧拉回路、哈密顿回路' },
        { title: '**图的着色**：顶点着色、四色定理、着色应用' },
        { title: '**网络流**：最大流、最小割、Ford-Fulkerson 算法' },
      ],
    },
    {
      name: '代数结构',
      children: [
        { title: '**半群与群**：封闭性、结合律、单位元、逆元' },
        { title: '**环与域**：交换环、整环、域' },
        { title: '**格与布尔代数**：偏序格、分配格、布尔表达式' },
        { title: '**同态与同构**：代数系统之间的映射' },
      ],
    },
    {
      name: '组合数学',
      children: [
        { title: '**计数原理**：加法原理、乘法原理、容斥原理' },
        { title: '**排列与组合**：全排列、部分排列、组合恒等式' },
        { title: '**鸽巢原理**：Dirichlet 抽屉原理及其应用' },
        { title: '**生成函数**：普通生成函数、指数生成函数' },
        { title: '**递推关系**：线性递推、特征方程、Fibonacci 数列' },
      ],
    },
  ],
  groups: [
    {
      name: '推荐资源',
      items: [
        { title: '《离散数学及其应用》（Kenneth Rosen）' },
        { title: '《具体数学》（Graham, Knuth, Patashnik）' },
        { title: 'MIT 6.042J Mathematics for Computer Science' },
      ],
    },
  ],
}
</script>
<ContentView :data="data" />
