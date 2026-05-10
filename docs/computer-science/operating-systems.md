<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: '操作系统',
  description: '操作系统管理计算机硬件资源，为应用程序提供运行环境。理解操作系统对性能优化、并发编程、系统开发至关重要。',
  items: [
    {
      name: '进程管理',
      children: [
        { title: '**进程**：资源分配的基本单位，独立地址空间' },
        { title: '**进程控制块（PCB）**：进程状态、寄存器上下文' },
        { title: '**进程状态切换**：就绪、运行、阻塞' },
        { title: '**上下文切换**：开销与优化、TLB 刷新' },
        { title: '**孤儿进程与僵尸进程**' },
      ],
    },
    {
      name: '线程模型',
      children: [
        { title: '**线程**：CPU 调度的基本单位，共享进程资源' },
        { title: '**用户级线程**：内核不可见，切换快' },
        { title: '**内核级线程**：内核管理，支持多核' },
        { title: '**轻量级进程（LWP）**：用户级与内核级的映射' },
        { title: '**协程**：用户态协作式调度' },
      ],
    },
    {
      name: '进程调度',
      children: [
        { title: 'FCFS（先来先服务） | 简单、平均等待时间长' },
        { title: 'SJF（短作业优先） | 最优平均等待时间，但难以预知' },
        { title: '时间片轮转 | 分时系统，响应时间可控' },
        { title: '优先级调度 | 可能出现饥饿' },
        { title: '多级反馈队列 | Linux CFS 类似方案' },
        { title: '**CFS（完全公平调度）**：红黑树、虚拟运行时间' },
      ],
    },
    {
      name: '进程间通信',
      children: [
        { title: '**管道**：匿名管道、命名管道（FIFO）' },
        { title: '**消息队列**：消息传递、异步通信' },
        { title: '**共享内存**：最快 IPC、需同步机制' },
        { title: '**信号量**：进程间同步' },
        { title: '**Socket**：跨网络通信' },
        { title: '**信号**：软中断、SIGKILL、SIGTERM' },
      ],
    },
    {
      name: '内存管理',
      children: [
        { title: '**虚拟内存**：地址转换（MMU）、页表' },
        { title: '**分页与分段**' },
        { title: '**多级页表**：减少页表占用' },
        { title: '**反向页表**：大地址空间优化' },
      ],
    },
    {
      name: '虚拟内存',
      children: [
        { title: '**页面置换算法**：FIFO、LRU、Clock、LFU' },
        { title: '**TLB**：快表，加速地址转换' },
        { title: '**内存映射（mmap）**：文件映射、匿名映射' },
        { title: '**页面分配策略**：需求分页、预取页' },
        { title: '**Belady 异常**：FIFO 缺页率异常' },
      ],
    },
    {
      name: '文件系统',
      children: [
        { title: '**inode**：文件元数据、索引节点' },
        { title: '**目录结构**：绝对路径 / 相对路径' },
        { title: '**磁盘调度**：FCFS、SCAN、C-SCAN' },
        { title: '**虚拟文件系统（VFS）**：统一接口' },
        { title: '**软链接与硬链接**' },
        { title: '**文件权限**：rwx、SUID、SGID' },
      ],
    },
    {
      name: '并发与同步',
      children: [
        { title: '**锁**：互斥锁、读写锁、自旋锁' },
        { title: '**信号量**：计数信号量、二值信号量' },
        { title: '**条件变量**' },
        { title: '**原子操作与 CAS**' },
        { title: '**管程（Monitor）**：高级同步原语' },
        { title: '**RCU（读-拷贝-更新）**：读者无锁' },
      ],
    },
    {
      name: '死锁',
      children: [
        { title: '**必要条件**：互斥、持有并等待、不可剥夺、循环等待' },
        { title: '**死锁预防**：破坏四个必要条件之一' },
        { title: '**死锁避免**：银行家算法' },
        { title: '**死锁检测与恢复**：资源分配图、进程回滚/终止' },
      ],
    },
    {
      name: 'Linux 内核',
      children: [
        { title: '**系统调用**：open、read、write、fork、exec' },
        { title: '**进程地址空间**：栈、堆、数据段、代码段' },
        { title: '**中断与异常**：中断向量、中断处理流程' },
        { title: '**设备驱动模型**：字符设备、块设备、网络设备' },
        { title: '**内核模块**：动态加载与卸载' },
      ],
    },
  ],
  groups: [
    {
      name: "推荐资源",
      items: [
        { title: "《操作系统导论》（OSTEP）" },
        { title: "《深入理解计算机系统》（CS:APP）" },
        { title: "《Linux 内核设计与实现》" }
      ],
    }
  ]
}
</script>
<ContentView :data="data" />
