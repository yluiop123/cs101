<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: '计算机组成原理',
  description: '计算机组成原理研究计算机硬件各组成部分的结构、功能及其相互关系，是理解计算机系统性能的基础。',
  items: [
    {
      name: '指令集架构',
      children: [
        { title: '**指令集架构（ISA）**：x86、ARM、RISC-V' },
        { title: '**CISC vs RISC**：复杂指令集 vs 精简指令集' },
        { title: '**寻址方式**：立即寻址、寄存器寻址、内存寻址' },
        { title: '**指令格式**：操作码、操作数、固定/变长编码' },
      ],
    },
    {
      name: '数据通路',
      children: [
        { title: '**数据通路**：取指、译码、执行、访存、写回' },
        { title: '**控制单元**：硬布线控制、微程序控制' },
        { title: '**ALU**：算术逻辑单元、标志寄存器' },
        { title: '**寄存器文件**：通用寄存器、专用寄存器' },
      ],
    },
    {
      name: '流水线技术',
      children: [
        { title: '**经典五级流水线**：IF、ID、EX、MEM、WB' },
        { title: '**流水线寄存器**：IF/ID、ID/EX、EX/MEM、MEM/WB' },
        { title: '**流水线吞吐率**：理想 CPI = 1' },
        { title: '**超标量流水线**：多发射、指令级并行' },
      ],
    },
    {
      name: '冒险与转发',
      children: [
        { title: '**结构冒险**：硬件资源冲突' },
        { title: '**数据冒险**：数据依赖（RAW、WAR、WAW）' },
        { title: '**控制冒险**：分支预测失败' },
        { title: '**转发（Forwarding）**：解决数据冒险' },
        { title: '**流水线停顿（Stall）**：插入气泡' },
      ],
    },
    {
      name: '分支预测',
      children: [
        { title: '**静态预测**：总是跳转、从不跳转' },
        { title: '**动态预测**：1 位饱和计数器、2 位饱和计数器' },
        { title: '**分支目标缓冲器（BTB）**' },
        { title: '**相关分支预测器**：两级预测器' },
      ],
    },
    {
      name: '存储器层次',
      children: [
        { title: '寄存器 | ~1KB | <1ns | 最高' },
        { title: 'L1 缓存 | ~64KB | ~1ns | 高' },
        { title: 'L2 缓存 | ~256KB | ~3ns | 较高' },
        { title: 'L3 缓存 | ~8MB | ~10ns | 中等' },
        { title: '主存（RAM） | ~16GB | ~100ns | 较低' },
        { title: '磁盘（SSD/HDD） | ~1TB | ~1ms | 最低' },
        { title: '**局部性原理**：时间局部性、空间局部性' },
      ],
    },
    {
      name: '缓存原理',
      children: [
        { title: '**直接映射、全相联、组相联**' },
        { title: '**替换策略**：LRU、随机、FIFO' },
        { title: '**写入策略**：写直达（Write-through）、写回（Write-back）' },
        { title: '**缓存一致性**：MESI 协议' },
        { title: '**缓存缺失类型**：强制缺失、容量缺失、冲突缺失' },
      ],
    },
    {
      name: 'I/O 系统',
      children: [
        { title: '**I/O 控制方式**：程序查询、中断、DMA' },
        { title: '**中断**：中断向量、中断优先级、中断嵌套' },
        { title: '**DMA**：直接内存访问、无 CPU 干预' },
        { title: '**I/O 性能指标**：吞吐量、延迟' },
      ],
    },
    {
      name: '总线与接口',
      children: [
        { title: '**总线结构**：数据总线、地址总线、控制总线' },
        { title: '**总线仲裁**：菊花链、独立请求' },
        { title: '**常见接口**：USB、PCIe、SATA、NVMe' },
        { title: '**同步总线 vs 异步总线**' },
      ],
    },
    {
      name: '性能指标',
      children: [
        { title: '**CPI**：每指令周期数' },
        { title: '**IPC**：每周期指令数' },
        { title: '**Amdahl 定律**：加速比 = 1 / ((1 - P) + P/S)' },
        { title: '**CPU 执行时间**：指令数 × CPI × 时钟周期' },
        { title: '**功耗**：动态功耗 = 1/2 × 电容 × 电压² × 频率' },
        { title: '**Roofline 模型**：计算密集度 vs 性能上限' },
      ],
    },
  ],
  groups: [
    {
      name: "推荐资源",
      items: [
        { title: "《计算机组成与设计》（Patterson & Hennessy）" },
        { title: "《深入理解计算机系统》（CS:APP）" },
        { title: "《计算机体系结构：量化研究方法》" }
      ],
    }
  ]
}
</script>
<ContentView :data="data" />
