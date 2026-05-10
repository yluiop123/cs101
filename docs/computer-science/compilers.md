<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: '编译原理',
  description: '编译原理研究将高级语言程序转换为机器可执行代码的技术。理解编译器有助于编写高效代码、设计 DSL 以及深入理解编程语言。',
  items: [
    {
      name: '编译流程',
      children: [
        { title: '源代码 → 词法分析 → 语法分析 → 语义分析 → IR生成 → 优化 → 代码生成 → 目标代码' },
        { title: '**前端 / 中间端 / 后端**：与目标平台无关 vs 相关' },
        { title: '**编译 vs 解释**：提前编译（AOT） vs 即时编译（JIT）' },
        { title: '**交叉编译**：在一个平台上生成另一平台的可执行代码' },
      ],
    },
    {
      name: '词法分析',
      children: [
        { title: '**词法单元（Token）**：关键字、标识符、字面量、运算符' },
        { title: '**正则表达式**：描述词法模式' },
        { title: '**有限自动机（FA）**' },
        { title: '**DFA**：确定型有穷自动机' },
        { title: '**NFA**：非确定型有穷自动机' },
        { title: '**NFA → DFA**：子集构造法' },
        { title: '**Thompson 构造法**：正则表达式 → NFA' },
        { title: '**最大匹配原则**：识别最长的 Token' },
        { title: '**Lex / Flex**：词法分析器生成工具' },
      ],
    },
    {
      name: '语法分析',
      children: [
        { title: '**产生式、终结符、非终结符**' },
        { title: '**推导与归约**' },
        { title: '**二义性文法**' },
        { title: '**AST（抽象语法树）**：语法分析输出' },
        { title: '**递归下降**：手写解析器' },
        { title: '**LL(1)**：First 集、Follow 集、预测分析表' },
        { title: '**消除左递归与提取左公因子**' },
        { title: '**LR(0)、SLR(1)、LR(1)、LALR(1)**' },
        { title: '**移进-归约冲突、归约-归约冲突**' },
        { title: '**错误恢复**：恐慌模式、短语级恢复' },
        { title: '**Yacc / Bison**：语法分析器生成工具' },
      ],
    },
    {
      name: '语义分析',
      children: [
        { title: '**类型检查**：静态类型、动态类型、类型推导' },
        { title: '**类型等价 vs 类型兼容**：结构等价、名等价' },
        { title: '**符号表**：作用域管理、变量绑定' },
        { title: '**属性文法**：综合属性、继承属性' },
        { title: '**重载解析与隐式类型转换**' },
      ],
    },
    {
      name: '中间代码',
      children: [
        { title: '**三地址码（TAC）**：四元式、三元式、间接三元式' },
        { title: '**SSA（静态单赋值形式）**：控制流优化' },
        { title: '**控制流图（CFG）**：基本块、支配关系' },
        { title: '**DAG（有向无环图）**：公共子表达式消除' },
      ],
    },
    {
      name: '优化',
      children: [
        { title: '常量折叠、常量传播' },
        { title: '代数化简、复写传播' },
        { title: '死代码消除' },
        { title: '循环优化：循环不变量外提、归纳变量删除、循环展开' },
        { title: '寄存器分配（图着色算法）' },
        { title: '**函数内联**：减少调用开销' },
        { title: '**尾调用优化**：栈帧复用' },
        { title: '**向量化**：SIMD 指令自动生成' },
        { title: '**全局优化 vs 局部优化**：基本块内 vs 跨基本块' },
      ],
    },
    {
      name: '代码生成',
      children: [
        { title: '**指令选择**：树覆盖、模式匹配' },
        { title: '**寄存器分配**：线性扫描、图着色' },
        { title: '**指令调度**：消除流水线停顿' },
        { title: '**窥孔优化**：滑动窗口局部优化' },
        { title: '**栈帧管理**：调用栈布局' },
        { title: '**调用约定**：参数传递、返回值、寄存器保存' },
      ],
    },
  ],
  groups: [
    {
      name: "推荐资源",
      items: [
        { title: "《编译原理》（龙书 / Dragon Book）" },
        { title: "《工程实现编译器》" },
        { title: "《现代编译原理》（虎书 / Tiger Book）" }
      ],
    }
  ]
}
</script>
<ContentView :data="data" />
