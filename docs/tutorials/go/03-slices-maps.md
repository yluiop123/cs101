---
title: 复合类型：数组、切片、map
---

# 第 3 章 · 复合类型：数组、切片、map

**本章目标：**

- 理解数组与切片的关系（切片是日常答案）
- 掌握切片的追加、扩容与共享语义
- 熟练 map 的增删改查与 range 遍历

## 3.1 数组：定长、值类型

```go
var a [3]int              // [0 0 0] —— 长度是类型的一部分！
b := [3]int{1, 2, 3}
c := [...]int{1, 2, 3}    // 自动数长度（[3]int）

b == c                    // true —— 数组可比较（长度+元素都相等）

// 值语义：赋值/传参会拷贝整个数组
d := b
d[0] = 99
b[0]                      // 仍是 1
```

**长度属于类型**（`[3]int` 与 `[4]int` 是不同类型）+ 值拷贝语义——**日常开发几乎不用数组**，它主要作为切片的底层存在。

## 3.2 切片：动态数组的"视图"

**切片（slice）**= 指向底层数组的窗口 + 长度 len + 容量 cap：

```text
切片结构 ≈ [指针 → 底层数组某位置, len（可访问数）, cap（容量上限）]
```

```go
s := []int{1, 2, 3}            // 字面量（注意没有长度 = 切片！）
var s2 []int                   // nil 切片（零值，len=0 可直接 append）

s[0] = 99
len(s)        // 3
cap(s)        // 3

// 从数组或切片切出切片（含头不含尾，同 Python）
arr := [5]int{1, 2, 3, 4, 5}
s3 := arr[1:4]                 // [2 3 4] —— 视图！共享底层数组
```

### append：切片的灵魂

```go
s := []int{1}
s = append(s, 2, 3)            // 追加（可能扩容 → 换新底层数组）
s = append(s, another...)      // 展开追加另一个切片

// 必须接收返回值：扩容后指针变了！
```

::: warning 共享底层数组的坑
```go
a := []int{1, 2, 3, 4, 5}
b := a[1:3]        // [2 3] —— 与 a 共享底层数组
b[0] = 99
a                  // [1 99 3 4,5] —— a 也被改了！

// 想要独立副本：完整切片三参数或 copy
c := a[1:3:3]      // 第三参数 cap 限制，超出即新建
d := make([]int, len(a))
copy(d, a)         // 真拷贝
```
:::

### make 与扩容直觉

```go
s := make([]int, 0, 100)       // 类型, len, cap —— 已知规模时预分配，性能利器
// append 超过 cap 时：底层数组按策略翻倍扩容（整体搬迁）
```

## 3.3 遍历：range 的两副面孔

```go
s := []string{"go", "rust", "zig"}

for i, v := range s {          // 下标 + 值
    fmt.Println(i, v)
}
for _, v := range s {          // 只要值（丢弃下标）
    fmt.Println(v)
}
for i := range s {             // 只要下标（等于 for i := 0; i < len(s); i++）
    ...
}

// 字符串 range 按码点（rune）迭代——中文不会乱码
for i, r := range "你好" {     // 0 '你'  3 '好'（i 是字节偏移！）
    ...
}
```

## 3.4 map：键值对（哈希表）

```go
m := map[string]int{           // map[键类型]值类型
    "http":  80,
    "https": 443,
}
m2 := make(map[string]int)     // 空表（直接 var m map[string]int 是 nil，读写会炸；make 后安全）

m["grpc"] = 443                // 增/改
v := m["http"]                 // 取
delete(m, "grpc")              // 删（不存在也不炸）

// 关键语法：逗号 ok 惯用法 —— 判断键是否存在
port, ok := m["https"]
if ok {
    fmt.Println("https =", port)
}

v = m["不存在"]                 // 不存在时返回值类型的零值（0）—— 不炸但易误用！
```

::: warning map 的三个规则
```go
// ① 取不存在的键得零值 —— 判断存在性必须用 ,ok
// ② range map 的顺序是随机的（故意设计）—— 需要顺序先排序键
keys := make([]string, 0, len(m))
for k := range m { keys = append(keys, k) }
sort.Strings(keys)
for _, k := range keys { fmt.Println(k, m[k]) }

// ③ map 不可比较（== 不能用于 map），也不能做另一个 map 的键
```
:::

## 3.5 切片与 map 的组合拳

```go
// 计数器（Java HashMap.merge 的 Go 写法）
counts := make(map[string]int)
for _, word := range []string{"go", "go", "rust"} {
    counts[word]++
}

// 分组：map 里放切片
groups := make(map[string][]string)
people := []struct{ name, city string }{{"Tom", "北京"}, {"Lucy", "上海"}, {"Jerry", "北京"}}
for _, p := range people {
    groups[p.city] = append(groups[p.city], p.name)
}
// map[北京:[Tom Jerry] 上海:[Lucy]]
```

## 3.6 struct 之外的轻量结构：匿名结构体

```go
// 临时数据结构：就地定义（JSON 解析常用）
point := struct {
    X, Y int
}{3, 5}

// 结构体切片字面量
people := []struct {
    Name string
    Age  int
}{
    {"Tom", 18},
    {"Lucy", 20},
}
```

## 3.7 综合练习：词频统计 Top-K

```go
package main

import (
    "fmt"
    "sort"
    "strings"
)

func main() {
    text := "go is simple go is fast go is fun"

    counts := make(map[string]int)
    for _, word := range strings.Fields(text) {   // 按空白切词
        counts[word]++
    }

    // 转切片排序取 Top-3（map 无序 → 先铺平）
    type pair struct {
        word  string
        count int
    }
    pairs := make([]pair, 0, len(counts))
    for w, c := range counts {
        pairs = append(pairs, pair{w, c})
    }
    sort.Slice(pairs, func(i, j int) bool {
        return pairs[i].count > pairs[j].count
    })

    for i, p := range pairs {
        if i == 3 {
            break
        }
        fmt.Printf("%d. %s ×%d\n", i+1, p.word, p.count)
    }
}
```

map 计数 + 切片排序 + 结构体组合——Go 数据处理的标准三板斧（第 9 章会用 sort 包泛型版优化它）。

## 本章小结

- 数组定长值拷贝（少用）；**切片 = 视图 + len + cap**（日常答案）
- append 必接返回值；切片共享底层数组（copy 求独立）
- map 零值安全读取（`m["x"]` 不炸）、存在性用 `,ok`、无序需排序遍历
- range 遍历一切；字符串 range 按码点
