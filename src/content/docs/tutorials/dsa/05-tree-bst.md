---
title: "第 5 章 · 树与二叉搜索树"
description: "数组、链表、栈、队列都是「一条线」，树则是有层次的结构：每个节点可以有多条分支，于是「按层级组织数据」变得自然。二叉搜索树进一步规定左小右大，把有序性装进树里，让查找、插入、删除都走一条从根到叶的路径。"
series: dsa
sidebar:
  order: 5
  label: "树与二叉搜索树"
difficulty: intermediate
duration: 8
tableOfContents: true
---

**本章目标：**

- 掌握树的术语（根、叶、深度、高度、度数）与二叉树的两种常用表示
- 能手写前序 / 中序 / 后序 / 层序四种遍历，并说明各自的应用场景
- 理解二叉搜索树"左小右大"的性质，能实现查找、插入、删除，并写出中序有序的验证
- 知道 BST 会退化成链表，理解平衡树存在的意义，以及 `bisect` / `heapq` 为什么不是树

## 5.1 树：从"一条线"到"有层次"

前面几章的结构都是线性表：每个元素最多有一个前驱和一个后继。树的每个节点可以有多个孩子，于是"文件夹 / 部门 / 语法结构"这类**层次数据**终于有了直接映射。

```python
# 二叉树节点：值 + 左右孩子
class TreeNode:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

# 用一棵小树认识术语
#        a
#      /   \
#     b     c
#    / \     \
#   d   e     f
root = TreeNode("a",
    TreeNode("b", TreeNode("d"), TreeNode("e")),
    TreeNode("c", right=TreeNode("f")))

print(root.value)              # 根 root
print(root.left.right.value)   # e：b 的右孩子
```

术语速记：

| 术语 | 含义 |
| --- | --- |
| 根 / 叶 | 没有父节点 / 没有孩子 |
| 深度 | 从根到该节点经过的边数（根深度为 0） |
| 高度 | 从该节点到最远叶子的边数（叶高度为 0） |
| 满二叉树 / 完全二叉树 | 每层都满 / 除最后一层外都满且最后一层靠左连续（堆的结构基础） |

## 5.2 四种遍历：顺序由"什么时候处理自己"决定

遍历的本质是决定**访问节点的时机**。前序、中序、后序只是"处理自己"放在递归的哪个位置，层序则是换一种推进方式（队列）。

```python
def preorder(node, out):
    if node is None:
        return
    out.append(node.value)      # 先自己
    preorder(node.left, out)
    preorder(node.right, out)

def inorder(node, out):
    if node is None:
        return
    inorder(node.left, out)
    out.append(node.value)      # 中间自己：BST 下得到有序序列
    inorder(node.right, out)

def postorder(node, out):
    if node is None:
        return
    postorder(node.left, out)
    postorder(node.right, out)
    out.append(node.value)      # 最后自己：适合"先算孩子再算自己"

def levelorder(root):
    from collections import deque
    if root is None:
        return []
    result, queue = [], deque([root])
    while queue:
        node = queue.popleft()
        result.append(node.value)
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    return result

if __name__ == "__main__":
    for name, order in [
        ("前序", preorder),
        ("中序", inorder),
        ("后序", postorder),
    ]:
        out = []
        order(root, out)
        print(name, "".join(out))
    print("层序", "".join(levelorder(root)))
```

```text
C:\code\dsa> python traverse.py
前序 abdecf
中序 dbeacf
后序 debfca
层序 abcdef
```

| 遍历 | 典型用途 |
| --- | --- |
| 前序 | 序列化 / 复制一棵树、打印目录结构 |
| 中序 | BST 得到有序序列、表达式树求值 |
| 后序 | 释放内存、计算子树聚合值（高度、节点数） |
| 层序 | 按层输出、求最小深度、BFS 类问题 |

:::tip[递归版与迭代版]
递归版最好写；但深度过大会爆栈，生产代码常用显式栈的迭代版。前序迭代最好写（先压右再压左），中序迭代要"一路向左压栈"，后序迭代可以先按"根右左"走再整体反转。
:::

## 5.3 二叉搜索树：把有序性装进树里

二叉搜索树（BST）在普通二叉树上加一条约束：**左子树所有值 < 根 < 右子树所有值**（对每个节点都成立）。于是查找就像二分：每比较一次就排除一半。

```python
class BST:
    def __init__(self):
        self.root = None

    def search(self, value):
        node = self.root
        while node:
            if value == node.value:
                return True
            node = node.left if value < node.value else node.right
        return False

    def insert(self, value):
        if self.root is None:
            self.root = TreeNode(value)
            return
        node = self.root
        while True:
            if value == node.value:
                return                       # 重复值不插入（也可约定插右侧）
            if value < node.value:
                if node.left is None:
                    node.left = TreeNode(value)
                    return
                node = node.left
            else:
                if node.right is None:
                    node.right = TreeNode(value)
                    return
                node = node.right

if __name__ == "__main__":
    tree = BST()
    for value in [8, 3, 10, 1, 6, 14, 4, 7, 13]:
        tree.insert(value)
    out = []
    inorder(tree.root, out)
    print("中序 =", out)
    print("查找 7:", tree.search(7), " 查找 5:", tree.search(5))
```

```text
C:\code\dsa> python bst.py
中序 = [1, 3, 4, 6, 7, 8, 10, 13, 14]
查找 7: True  查找 5: False
```

删除要分三种情况：叶子直接摘掉；只有一个孩子就让父亲接管这个孩子；有两个孩子时，用**右子树的最小值（后继）或左子树的最大值（前驱）**顶替，再递归删除那个替补。

```python
def delete(node, value):
    if node is None:
        return None
    if value < node.value:
        node.left = delete(node.left, value)
    elif value > node.value:
        node.right = delete(node.right, value)
    else:
        if node.left is None:
            return node.right
        if node.right is None:
            return node.left
        successor = node.right
        while successor.left:              # 右子树最小值
            successor = successor.left
        node.value = successor.value
        node.right = delete(node.right, successor.value)
    return node
```

## 5.4 退化与平衡：BST 的"隐形成本"

BST 的所有操作代价是**树高**。如果按有序序列插入（1, 2, 3, 4, 5 …），树会退化成一条链表，查找从 O(log n) 掉回 O(n)。

```text
插入 1..5 的退化过程：
  1                1                  1
   \                \                  \
    2                2                  2
     \                \                  \
      3                3                  3
       \                \                  \
        4                4                  4
         \                \                  \
          5                5                  5
（每步都只往右走，树高 = n）
```

平衡树（AVL、红黑树、B 树）通过旋转把树高维持在 O(log n)，代价是插入删除时多花常数级别的调整。工程结论：

- 需要**有序遍历 + 动态增删**：用平衡树（Python 标准库没有现成的，可用 `sortedcontainers`）；
- 只需要**静态有序查找**：把数组排好序 + `bisect`，二分比树更快也更省内存；
- 只需要**取最值**：用堆（第 6 章），比平衡树轻得多。

:::caution[递归验证 BST 的常见错法]
只比较"节点与直接孩子"是错的——要传**上下界**：左子树所有值都必须小于根，而不只是左孩子。正确写法是 `is_bst(node, low, high)`，递归时收紧边界。
:::

## 5.5 树的常见应用：表达式树、目录树、字典树

树的用途远超"存有序数据"：

```python
# 表达式树：叶子是数字，内部节点是运算符；后序求值
def eval_tree(node):
    if node.left is None and node.right is None:
        return float(node.value)
    left = eval_tree(node.left)
    right = eval_tree(node.right)
    return {"+": left + right, "-": left - right,
            "*": left * right, "/": left / right}[node.value]

#   (3 + 4) * 5  →  * 的左孩子是 +，右孩子是 5
expr = TreeNode("*", TreeNode("+", TreeNode("3"), TreeNode("4")), TreeNode("5"))
print(eval_tree(expr))      # 35.0
```

另外两类高频结构：**目录树**（文件系统、菜单、组织结构）与**字典树 Trie**（前缀匹配、自动补全、敏感词过滤，每个节点存"从根到这里的字符串前缀"）。

## 5.6 综合练习：用数组表示二叉树，并验证 BST

很多面试题用"层序数组"给树（空节点用 `None` 占位）。把数组转成树、再验证它是不是合法 BST，是本节的综合练习。

```python
def build_tree(values, index=0):
    if index >= len(values) or values[index] is None:
        return None
    return TreeNode(values[index],
                    build_tree(values, 2 * index + 1),
                    build_tree(values, 2 * index + 2))

def is_bst(node, low=float("-inf"), high=float("inf")):
    if node is None:
        return True
    if not (low < node.value < high):
        return False
    return is_bst(node.left, low, node.value) and is_bst(node.right, node.value, high)

if __name__ == "__main__":
    good = build_tree([8, 3, 10, 1, 6, None, 14])
    bad = build_tree([8, 3, 10, 1, 9, None, 14])   # 9 在左子树却比根小？不是：9 > 8 却挂在 3 的右边
    print("合法 BST:", is_bst(good), " 非法 BST:", is_bst(bad))
```

```text
C:\code\dsa> python bst_check.py
合法 BST: True  非法 BST: False
```

:::tip[数组下标关系]
完全二叉树用数组存储时，下标 i 的左孩子是 2i+1、右孩子是 2i+2、父亲是 (i-1)//2。堆（第 6 章）就是靠这条关系省掉指针的。
:::

## 本章小结

- 树用层次组织数据；术语重点是深度（根为 0）、高度（叶为 0）与完全二叉树
- 四种遍历的差别只在"何时处理自己"：前序序列化、中序得有序、后序聚合、层序按层处理
- BST 靠"左小右大"把查找变成二分；删除分叶子 / 单孩子 / 双孩子（用后继顶替）
- BST 的代价是树高，有序插入会退化成链表；动态有序用平衡树，静态有序用排序 + 二分
- 表达式树、目录树、Trie 说明树的价值在于"结构本身携带语义"
