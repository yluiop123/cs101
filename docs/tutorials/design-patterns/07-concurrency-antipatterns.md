---
title: 并发模式与常见反模式
---

# 第 7 章 · 并发模式与常见反模式

**本章目标：**

- 用有界队列的生产者-消费者模型把「快慢解耦」并施加背压
- 会为线程池选参数，讲清 Future、回调与 async 三者的关系
- 写出正确的双检锁单例，并识别上帝类、贫血模型等常见反模式信号

## 7.1 并发不是模式，而是约束

前六章的模式在单线程也成立；这一章的模式**只有在共享可变状态时才存在**。并发的根问题一句话：**多个执行流同时读改同一份数据，结果取决于谁先谁后**。所有「正确写法」都归结为两条防线——要么别共享（消息传递、副本），要么共享但互斥（锁、原子操作）。反模式几乎都诞生于「忘了自己在并发」。

```python
counter = 0
def worker():
    global counter
    for _ in range(100_000):
        counter += 1        # 读-改-写三步，非原子，线程交错即丢更新
# 两个 worker 跑完，结果常小于 200000：这就是最典型的竞态
```

## 7.2 生产者-消费者与有界队列

生产者-消费者用队列把「产生速度」与「消费速度」解耦。关键在**有界**：无界队列遇到消费跟不上时，只是把 OOM 推迟到更晚。

```python
import queue
tasks = queue.Queue(maxsize=100)            # 有界：最多积压 100

def producer():
    for item in source():
        tasks.put(item)                     # 队列满时阻塞 = 天然背压

def consumer():
    while True:
        item = tasks.get()                  # 队列空时阻塞
        try:
            handle(item)
        finally:
            tasks.task_done()               # 标记完成，配合 join

# 生产者 put 被阻塞，就自动把压力退回上游，这叫背压（backpressure）
```

::: tip 为什么要有界
`maxsize` 让 `put` 在队列满时阻塞生产者，把「我处理不过来了」显式反馈给上游，而不是无限吃内存。无界队列 = 把慢消费者的债务记在内存账上，迟早破产。容量按「可容忍的积压 × 单任务内存」倒推，别拍脑袋。
:::

关停别硬切线程，用**哨兵 + join**优雅收尾：生产端投完真数据再投 N 个 `None`，消费者拿到 `None` 就退出；主线程 `tasks.join()` 等全部 `task_done` 后再回收线程。

```python
sentinel = None
for _ in range(n_consumers):
    tasks.put(sentinel)                  # 每个消费者一个停止信号
tasks.join()                             # 等已入队任务全部处理完
for t in workers: t.join()               # 再回收线程
```

## 7.3 读写锁与副本

读多写少的共享数据，用互斥锁会让读者互相排队。思路有两级：**读写锁**（多读并发、写独占）和**写时复制**（读者拿快照，完全无锁）。

```python
# 读写锁：读者之间并发，写者独占
import threading
class RWLock:
    def __init__(self):
        self.rlock, self.wlock = threading.Lock(), threading.Lock()
        self.readers = 0

# 更实用的写法：读者拿不可变副本，写者替换整个引用
class Config:
    def __init__(self, data): self._d = data          # 内部持 dict
    def snapshot(self): return dict(self._d)          # 返回浅拷贝给读者
    def update(self, k, v):
        new = dict(self._d); new[k] = v               # 在副本上改
        self._d = new                                  # 一次原子赋值替换引用
```

写时复制把「改」变成「造一个新的再替换引用」，读者要么看到旧快照要么看到新快照，**永远看不到改了一半的中间态**。Python 单次名字绑定赋值在 CPython 下是原子的，所以这种「构建新对象→替换引用」的 COW 写法安全；跨实现或复杂结构仍建议显式加锁。

## 7.4 线程池参数怎么定

线程池省去频繁建线程的开销，但 `max_workers` 定错反而更慢。按任务类型分：

```text
CPU 密集（计算、压缩、序列化）  → max_workers ≈ CPU 核数
IO 密集（网络、磁盘、DB 调用）  → 远大于核数，按并发目标与外部服务承受力定
```

```python
from concurrent.futures import ThreadPoolExecutor
import os
cpu_pool = ThreadPoolExecutor(max_workers=os.cpu_count())     # CPU 密集
io_pool  = ThreadPoolExecutor(max_workers=64)                 # IO 密集，实测调
```

::: warning Python 的 GIL 提醒
CPython 有全局解释器锁：**纯 Python 的 CPU 密集任务用多线程不会并行加速**（反而有切换开销），应走 `ProcessPoolExecutor` 多进程；线程池在 Python 里真正擅长的是 IO 密集。换语言（Java/Go 无 GIL）时，CPU 密集用线程池才有意义。别把「CPU 密集→多线程」当普适结论。
:::

调参靠观测而非玄学：先看池是否排队（队列积压）、再看下游服务是否被打爆，两头夹逼出合适值；具体默认值以所用库的 `help()` / 官方文档实测为准。

## 7.5 Future、回调与 async 的关系

三者是同一个问题（「现在没结果，以后有」）的不同表达层次：

```python
from concurrent.futures import ThreadPoolExecutor, as_completed

# ① Future：把「将来的结果」当对象，主动问/等
def compute(): return heavy()
with ThreadPoolExecutor() as ex:
    fut = ex.submit(compute)          # 立刻返回 Future
    result = fut.result(timeout=5)    # 阻塞等，或 fut.done() 轮询

# ② 回调：结果就绪时框架自动调你登记的函数
    fut.add_done_callback(lambda f: save(f.result()))

# ③ async/await：把「等」写进语言，用同步的语句写异步
async def main():
    result = await fetch()            # await ≈ 挂起当前协程、不占线程
```

关系：**Future 是数据的容器，回调是 Future 的被动用法，async/await 是把回调链条摊平成顺序语句的语法糖**。`await f` 约等于「注册回调 + 挂起」，但代码读起来像同步，避免了「回调地狱」。回调适合「完成后做一件小事」，Future 适合「多处分别等待」，async 适合「大量并发 IO 且要顺序编排」。

```python
import asyncio
async def main():
    # 并发发起、统一等待：等价于「提交多个 Future 再 as_completed」
    results = await asyncio.gather(fetch(a), fetch(b), fetch(c))
    # 需要超时就用 wait_for；需要「谁先回来」用 as_completed 的异步版
    first = await asyncio.wait_for(slow(), timeout=2)
```

`gather` 里三个 `fetch` 同时在途，一个线程都没多开——协程靠事件循环复用单线程处理海量 IO。这正是 async 相较线程池的优势：无线程切换开销、上下文极轻；代价是全程不能有任何阻塞调用（一次 `time.sleep` 就卡住整个循环，必须用 `await asyncio.sleep`）。

## 7.6 单例双检锁的正确写法

第 2 章（创建型）的单例在无并发下够用，并发环境里「检查—加锁—再检查」的**双检锁**是经典题，也经典地容易写错。

错误写法 → 正确写法：

```python
# 错误：无锁的懒加载，两个线程可能各造一个实例
class Bad:
    _inst = None
    @classmethod
    def get(cls):
        if cls._inst is None:                 # 竞态：都读到 None
            cls._inst = cls()
        return cls._inst

# 正确：双检锁，先无锁快判，进锁后再确认一次
class Singleton:
    _inst = None
    _lock = threading.Lock()
    @classmethod
    def get(cls):
        if cls._inst is None:                 # 第一次检查：避免每次都抢锁
            with cls._lock:
                if cls._inst is None:         # 第二次检查：进锁后重新确认
                    cls._inst = cls()
        return cls._inst
```

双检锁的「第二次检查」不可省：多个线程可能都通过了第一次检查，排队进锁，若无二次检查，第二个及以后仍会重复造。在 Java/C++ 里还有更隐蔽的坑——**指令重排可能让别的线程拿到「引用非空但对象没构造完」的半成品**，因此实例字段必须 `volatile`（或用 `final`/静态内部类holder）。Python CPython 因 GIL 不存在这种重排可见性问题，但跨实现别想当然。

::: tip 更省心的做法
在 Python 里，**模块级对象天然就是单例**（import 只执行一次）。除非实例化代价大且可能永远用不到，否则别手写双检锁：
:::

```python
# instance.py —— 交给解释器的 import 锁保证唯一
instance = HeavyResource()
```

## 7.7 反模式与滥用信号（自查清单）

模式用错地方就是反模式。对照自查：

```text
上帝类        一个类什么都干、几百行、谁都依赖它 → 拆职责（引第 5 章观察者/第 6 章命令）
贫血模型      对象只有 getter/setter，逻辑全在外面 Service → 把行为收回对象
过度抽象      为「将来可能」造接口/工厂，实际只有一个实现 → 等第二个实现出现再抽
继承深链      A 继承 B 继承 C…只为复用几个方法 → 改用组合
全局可变状态  模块级 dict 到处读写、测试互相污染 → 显式传依赖 / 只读快照
模式滥用信号  到处 Factory/Singleton/Observer；读代码先读结构而非业务 → 砍掉不产生解耦收益的模式
```

- 上帝类、贫血模型：说明职责没落到对象里，先补行为再谈模式
- 过度抽象与继承深链：抽象层次超过当前需求，优先组合、延迟抽象
- 全局可变状态是并发 bug 与测试污染的头号来源，改显式依赖或只读快照
- 判断模式该不该留，只看一个问题：**去掉它，解耦/可测/可扩展是否真的变差**；不变差就是过度设计

## 本章小结

- 并发根问题是共享可变状态上的竞态；有界队列的生产者-消费者用阻塞 `put` 提供天然背压，关停走哨兵+join
- 读多写少用读写锁或写时复制快照；线程池 `max_workers` 按 CPU/IO 密集分定，且记住 CPython 的 GIL 让 CPU 密集多线程不提速
- Future 是结果容器、回调是其被动用法、async/await 是把回调摊平成顺序语句；单例双检锁两次检查都不可省（跨实现还需 volatile）
- 上帝类、贫血模型、过度抽象、继承深链、全局可变状态是主要反模式，判据是「去掉这个模式是否真的变差」
