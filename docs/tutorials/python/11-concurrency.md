---
title: 并发初见：线程与异步
---

# 第 11 章 · 并发初见：线程与异步

**本章目标：**

- 理解 GIL 与"多线程/多进程/异步"的选型
- 掌握 threading 与 concurrent.futures 基本用法
- 掌握 asyncio 的 async/await 心智模型

## 11.1 GIL：Python 并发的第一课

**GIL（Global Interpreter Lock，全局解释器锁）**：CPython 中同一时刻只有一个线程执行 Python 字节码。推论：

```text
CPU 密集任务（纯计算）→ 多线程无效 → 用多进程（multiprocessing）
IO 密集任务（网络/磁盘）→ 多线程有效（等 IO 时释放 GIL）或 asyncio（单线程并发）
```

| 场景 | 方案 | 理由 |
| --- | --- | --- |
| 爬 100 个网页 | asyncio / 多线程 | 等 IO 为主，不需要多核 |
| 图片批量转码 | 多进程 | 纯计算，吃多核 |
| 批量调 API | asyncio + aiohttp | 最高并发、最省资源 |

对比 Java：Java 多线程能吃满多核（无 GIL）；Python 的多线程本质是"并发"而非"并行"。

## 11.2 threading：多线程基本用法

```python
import threading
import time

def worker(name: str, seconds: float) -> None:
    print(f"{name} 开始")
    time.sleep(seconds)                    # 模拟 IO 等待
    print(f"{name} 完成")

t1 = threading.Thread(target=worker, args=("下载A", 2))
t2 = threading.Thread(target=worker, args=("下载B", 2))
t1.start(); t2.start()                     # 并发执行，总耗时 ≈2s 而非 4s
t1.join(); t2.join()                       # 等待结束
print("全部完成")
```

线程安全：Python 同样有竞态条件，`threading.Lock` 加锁（思想同 Java synchronized）：

```python
lock = threading.Lock()
counter = 0

def safe_increment():
    global counter
    for _ in range(100000):
        with lock:                         # with 自动释放（对应 try/finally）
            counter += 1
```

## 11.3 concurrent.futures：线程池的现代姿势

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

def fetch(url: str) -> str:
    time.sleep(1)                          # 模拟网络请求
    return f"{url} 的响应"

with ThreadPoolExecutor(max_workers=5) as pool:
    # map：按提交顺序返回结果
    results = pool.map(fetch, ["a.com", "b.com", "c.com"])
    for r in results:
        print(r)

with ThreadPoolExecutor(max_workers=5) as pool:
    futures = {pool.submit(fetch, u): u for u in ["a.com", "b.com"]}
    for future in as_completed(futures):   # 谁先完成先处理谁
        print(futures[future], "→", future.result())
```

ThreadPoolExecutor / ProcessPoolExecutor 同一套 API——**换执行模型只换类名**，业务代码零改动。

## 11.4 多进程：绕开 GIL 吃多核

```python
from concurrent.futures import ProcessPoolExecutor
import time

def heavy(n: int) -> int:
    total = sum(i * i for i in range(n))   # CPU 密集
    return total

if __name__ == "__main__":                 # 多进程必须有主模块守卫！
    start = time.perf_counter()
    with ProcessPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(heavy, [10**7] * 4))
    print(f"耗时 {time.perf_counter() - start:.2f}s")   # ≈单进程的 1/4
```

::: warning 多进程三注意
① 必须有 `if __name__ == "__main__"` 守卫（Windows 用 spawn 启动，会重新 import 主模块）。
② 参数与返回值要可序列化（pickle）。
③ 进程间不共享内存——传数据靠序列化，别想着改全局变量。
:::

## 11.5 asyncio：单线程的并发模型

**asyncio** 用"事件循环 + 协程"实现超高并发 IO：

```python
import asyncio

async def fetch(url: str) -> str:          # async def 定义协程（coroutine）
    print(f"请求 {url}")
    await asyncio.sleep(1)                 # await：让出控制权（模拟 IO）
    return f"{url} 完成"

async def main():
    # 并发跑三个协程：总耗时 ≈1s 而非 3s
    results = await asyncio.gather(
        fetch("a.com"),
        fetch("b.com"),
        fetch("c.com"),
    )
    print(results)

asyncio.run(main())                        # 入口：启动事件循环
```

心智模型：

```text
await 处 = 协程主动让位："我在等 IO，CPU 先去跑别人"
事件循环 = 调度员：谁的就绪事件到了就唤醒谁
单线程    = 没有 GIL 竞争、没有锁噩梦（但同步计算会卡住整个循环！）
```

## 11.6 异步的选型边界

```python
# ❌ 异步里的坑：在协程中调用同步阻塞函数
async def bad():
    time.sleep(1)                 # 卡住整个事件循环，其他协程全停摆！
    requests.get(url)             # 同样阻塞

# ✅ 正确姿势：全链路异步
async def good():
    await asyncio.sleep(1)                    # 异步版 sleep
    import aiohttp
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:  # 异步 HTTP 库
            return await resp.text()
```

::: info 异步生态现状
原生 async 库：aiohttp（HTTP）、asyncpg（Postgres）、httpx（两者通吃）。同步库万不得已时用 `asyncio.to_thread(阻塞函数)` 丢线程池。**框架层面：FastAPI/Starlette 原生异步，Django 3.1+ 部分支持**——第 12 章/FastAPI 教程实战中体会。
:::

## 11.7 综合练习：并发网页标题抓取器

```python
import asyncio
import urllib.request

URLS = [
    "https://www.python.org",
    "https://docs.python.org",
    "https://pypi.org",
]

def fetch_blocking(url: str) -> str:          # 同步实现（无第三方依赖）
    with urllib.request.urlopen(url, timeout=10) as resp:
        return resp.read(2048).decode("utf-8", errors="ignore")

async def fetch_all(urls: list[str]) -> list[str]:
    loop = asyncio.get_running_loop()
    tasks = [loop.run_in_executor(None, fetch_blocking, u) for u in urls]
    return await asyncio.gather(*tasks)       # 同步库通过 to_thread 并发化

results = asyncio.run(fetch_all(URLS))
for r in results:
    import re
    title = re.search(r"<title>(.*?)</title>", r, re.S)
    print(title.group(1).strip() if title else "无标题")
```

`run_in_executor` 把同步函数丢进线程池、asyncio.gather 并发等待——没有第三方库也能体验异步编程模型。

## 本章小结

- GIL：CPU 密集用多进程、IO 密集用线程/asyncio
- ThreadPoolExecutor/ProcessPoolExecutor 统一 API；多进程要主模块守卫
- asyncio：async def 协程 + await 让位 + gather 并发；**协程里禁用同步阻塞**
- 选型口诀：爬接口用 asyncio、转码用多进程、小脚本用线程池
