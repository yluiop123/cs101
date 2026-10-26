---
title: 栈与队列
---

# 第 3 章 · 栈与队列

**本章目标：**

- 会用栈的"最近打开的最先处理"语义解决匹配、回溯与表达式求值三类问题
- 能写出不溢出也不误判满的循环队列，并说清它为什么要把一个格子留空
- 掌握单调栈与单调队列这两个模板，把"下一个更大元素""滑动窗口最大值"从平方降到线性

## 3.1 栈：受限操作换来确定性

栈只允许在一端进出，因此**最后放进去的一定最先出来**（LIFO）。看似不方便，恰恰是它的价值：任何"先处理最紧要的那一件"的语义——嵌套结构匹配、函数调用、撤销操作、深度优先搜索——都能直接映射成压栈出栈。

```python
def undo_stack(operations):
    stack = []                          # Python 的 list 就是栈：append 压栈、pop 出栈
    for op in operations:
        if op == "undo":
            if stack:                   # 出栈前必须判空，这是最常见的崩溃点
                stack.pop()
        else:
            stack.append(op)
    return stack

if __name__ == "__main__":
    print(undo_stack(["写a", "写b", "undo", "写c", "undo", "undo", "undo"]))
```

::: warning 别用 `deque` 当栈、也别用 `list.insert(0, x)` 当队列
`list` 的 `append`/`pop` 都在尾部，摊还 O(1)（第 2 章 [数组与链表](./02-array-linked)）；一旦挪到头部就变成 O(n)。`deque` 支持两端操作，但拿它当栈只会让代码语义变模糊——结构选择要服务于意图。
:::

## 3.2 括号匹配：三类典型错例

匹配的本质是"最近的左括号必须最先被闭合"，这就是栈。扫描字符串：遇到左括号压栈，遇到右括号弹出栈顶配对，收尾时栈必须为空。

```python
PAIRS = {")": "(", "]": "[", "}": "{"}

def is_balanced(text):
    stack = []
    for ch in text:
        if ch in PAIRS.values():
            stack.append(ch)
        elif ch in PAIRS:
            if not stack or stack[-1] != PAIRS[ch]:   # 弹出前先判空、再比对栈顶
                return False
            stack.pop()
    return not stack                    # 还有剩余左括号就是不平衡

if __name__ == "__main__":
    for case in ["([{}])", "([)]", "(()", "()("]:
        print(f"{case:12s} → {is_balanced(case)}")
```

```text
C:\code\dsa> python bracket.py
([{}])       → True
([)]         → False
(()          → False
()(          → False
```

三类错例与它们的原因：

```text
错 1：`stack.pop()` 前不判空      → 输入以右括号开头（如 ")"）直接抛 IndexError
错 2：只数左右括号个数是否相等    → "([)]" 数量相等但交叉嵌套，必须比对栈顶的类型
错 3：扫完直接返回 True           → "(()" 少一个右括号，收尾必须检查栈是否为空
```

## 3.3 表达式求值：后缀式与双栈

中缀表达式要处理优先级与括号，麻烦；**后缀式（逆波兰式）**把运算符放在操作数之后，扫描一遍即可，两个栈就能算完。

```python
OPS = {"+": lambda a, b: a + b, "-": lambda a, b: a - b, "*": lambda a, b: a * b}

def eval_rpn(tokens):
    nums = []
    for token in tokens:
        if token in OPS:
            b, a = nums.pop(), nums.pop()        # 出栈顺序是反的：先弹的是右操作数
            nums.append(OPS[token](a, b))
        else:
            nums.append(int(token))
    return nums[0]                      # 结束时栈里恰好剩一个数，否则表达式非法

def to_rpn(infix):
    """调度场算法：运算符优先级决定它何时出栈，括号把栈切成独立的栈段。"""
    priority = {"+": 1, "-": 1, "*": 2}
    ops, out = [], []
    for token in infix:
        if token.isdigit():
            out.append(token)
        elif token == "(":
            ops.append(token)
        elif token == ")":
            while ops and ops[-1] != "(":
                out.append(ops.pop())
            ops.pop()                   # 弹出左括号本身，不进输出
        else:
            while ops and priority.get(ops[-1], 0) >= priority[token]:
                out.append(ops.pop())   # 优先级不低于栈顶就先算，保证 * 比 + 先出
            ops.append(token)
    while ops:
        out.append(ops.pop())
    return out

if __name__ == "__main__":
    rpn = to_rpn(["3", "+", "4", "*", "5", "-", "6"])
    print("后缀式:", rpn, "求值:", eval_rpn(rpn), "中缀期望值:", 3 + 4 * 5 - 6)
```

要点有三个：操作数栈与运算符栈各管一半；遇到左括号无条件压栈，遇到右括号弹到左括号为止；弹出运算符的条件是**栈顶优先级不低于当前运算符**（左结合）。写成一行的心法：**数字进栈、符号比较、括号划段**。

## 3.4 单调栈：下一个更大元素

栈还能维护"候选答案的有序性"。求每个元素右边第一个比它大的元素：从左往右扫，把还没等到答案的下标压栈；当前元素比栈顶对应的值大，就说明栈顶的答案找到了，连续弹出即可。栈里从底到顶保持**递减**，所以每个下标最多进出栈一次，总代价 O(n)。

```python
def next_greater(nums):
    answer = [-1] * len(nums)
    stack = []                          # 存下标，不存值，方便回填答案
    for i, value in enumerate(nums):
        while stack and nums[stack[-1]] < value:
            answer[stack.pop()] = value # 谁被弹出，谁的答案就是当前值
        stack.append(i)
    return answer                       # 栈里剩下的是右侧没有更大者的元素

if __name__ == "__main__":
    print(next_greater([2, 1, 5, 3, 8, 7]))
```

同一模板换个比较方向、换个进出顺序，就能解决一批问题：

```text
下一个更大 / 下一个更小   递减栈 / 递增栈，从左往右扫
上一个更大 / 上一个更小   同一栈，把"弹出时回填"改成"入栈前读取"
接雨水、柱状图最大矩形     弹出时结算宽度与高度，本质是"以谁为界"
```

## 3.5 队列与循环队列

队列要求先进先出，两端分别只碰一次是 O(1)——这在连续数组里意味着一个永远在动的读指针。定长数组实现队列必须**绕回去**，这就是循环队列。

```python
class CircularQueue:
    def __init__(self, capacity):
        self.data = [None] * capacity
        self.head = self.tail = 0
        self.count = 0                  # 关键：用元素个数区分"空"与"满"

    def enqueue(self, value):
        if self.count == len(self.data):
            return False                # 满了就明确失败，绝不悄悄覆盖旧数据
        self.data[self.tail] = value
        self.tail = (self.tail + 1) % len(self.data)
        self.count += 1
        return True

    def dequeue(self):
        if self.count == 0:
            return None                 # 空队列取元素：返回哨兵值而不是抛异常，按业务需要二选一
        value = self.data[self.head]
        self.data[self.head] = None     # 清掉引用，别让旧对象一直活着
        self.head = (self.head + 1) % len(self.data)
        self.count -= 1
        return value

if __name__ == "__main__":
    queue = CircularQueue(3)
    print([queue.enqueue(v) for v in "abc"], queue.enqueue("d"))
    print(queue.dequeue(), queue.dequeue(), queue.enqueue("d"), queue.dequeue(), queue.dequeue())
```

另一种写法不留 `count`，而是**约定牺牲一个格子**：`tail + 1 == head` 视为满、`head == tail` 视为空。两种都对，但要写清是哪一种——绝大多数循环队列 bug 都出在这两个条件的混用上。取模 `% len(self.data)` 就是"绕回去"的全部机制，容量必须是 2 的幂时还可以写成位与，那是优化细节。

## 3.6 双端队列与滑动窗口最大值

滑动窗口最大值若每次重扫窗口是 O(n·k)。用**单调队列**（双端队列里存下标，对应值从队头到队尾递减）：新元素进来时把队尾所有比它小的都弹掉——它们不可能再成为最大值；窗口滑动时把队头掉出窗口的下标弹掉；当前最大值永远是队头。每个下标进出各一次，整体 O(n)。

```python
from collections import deque

def max_sliding_window(nums, k):
    window = deque()                    # 存下标，对应值保持严格递减
    result = []
    for i, value in enumerate(nums):
        while window and window[0] <= i - k:
            window.popleft()            # 队头掉出窗口，先清掉
        while window and nums[window[-1]] <= value:
            window.pop()                # 比新值小的都不再有资格，直接从队尾淘汰
        window.append(i)
        if i >= k - 1:
            result.append(nums[window[0]])
    return result

if __name__ == "__main__":
    print(max_sliding_window([1, 3, -1, -3, 5, 3, 6, 7], 3))
```

错误写法 → 正确写法：

```text
错：两个 while 的顺序反过来——先淘汰队尾、再清理队头，窗口边界就会算错一位
正：先按"是否掉出窗口"清理队头，再按"是否比新值小"淘汰队尾，最后入队，最后判是否已满 k
```

::: tip 单调栈与单调队列是同一个套路
两者的共同点是把"以后可能有用"的元素留在结构里，并保持单向单调；一旦某个新元素让旧的候选永远失去资格，就立刻丢弃。判断能不能这么干，就看那一条**淘汰理由是否永远成立**。
:::

## 3.7 综合练习：用栈与队列组合出"最近使用窗口"

设计一个功能：给定一串访问记录与窗口大小 k，判断某个 key 最近 k 次访问里是否出现过、出现过几次。这类"滑动窗口计数"是限流、埋点去重的原型。

```python
from collections import deque

class RecentWindow:
    def __init__(self, k):
        self.k = k
        self.history = deque()          # 队列负责"最近 k 条"的窗口边界
        self.counter = {}               # 哈希表负责窗口内的计数（第 4 章详谈）

    def visit(self, key):
        self.history.append(key)
        self.counter[key] = self.counter.get(key, 0) + 1
        while len(self.history) > self.k:                    # 超窗口就从队头淘汰
            expired = self.history.popleft()
            self.counter[expired] -= 1
            if self.counter[expired] == 0:
                del self.counter[expired]                    # 计数归零就删键，表才不会越长越大

    def count(self, key):
        return self.counter.get(key, 0)

if __name__ == "__main__":
    window = RecentWindow(3)
    for key in ("a", "b", "a", "c", "a"):
        window.visit(key)
    print("窗口 3 内 a 出现", window.count("a"), "次；b 出现", window.count("b"), "次")
```

三个易错点：出队与减计数必须成对出现（漏一个就永远偏高）、计数归零要及时删键（否则哈希表只增不减，这是内存泄漏的常见形态）、窗口用 `while` 而不是 `if` 收缩（批量灌入时一次可能要淘汰多条）。

::: warning 优先队列预告：这不是本章的结构
本章的队列都只讲"来的顺序"。如果每条记录带一个优先级，要每次取出**最高优先级**的那条，双端队列就不够了——那需要堆，见 [第 6 章 · 堆与优先队列](./06-heap)。届时会解释为什么 `heapq` 只能保证队顶最小、以及为什么"删除任意元素"要用懒惰删除。
:::

## 本章小结

- 栈的价值在"最近的先处理"：括号匹配要在弹出前判空并比对栈顶类型，扫完还必须检查栈是否为空
- 后缀式求值用两个栈：数字进操作数栈，运算符按"栈顶优先级不低于当前"弹出，括号只是划定栈段
- 循环队列要么用 `count` 区分空满，要么牺牲一个格子并用 `head == tail` 判空，两种约定不能混用
- 单调栈与单调队列都靠"永远失去资格的候选立刻丢弃"把平方降到线性：下一个更大元素、滑动窗口最大值共用一套模板
