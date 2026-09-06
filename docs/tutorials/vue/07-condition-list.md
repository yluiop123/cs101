---
title: 条件与列表渲染
---

# 第 7 章 · 条件与列表渲染

**本章目标：**

- 掌握 v-if/v-else/v-show 的选择
- 熟练 v-for 列表渲染与 :key 原理
- 会做"空状态"与过渡动画的配合

## 7.1 条件渲染：v-if 家族

```vue
<script setup>
import { ref } from 'vue';
const score = ref(85);
const loading = ref(false);
const items = ref([]);
</script>

<template>
  <!-- v-if：条件为假时不渲染（DOM 里根本没有） -->
  <p v-if="score >= 90">优秀</p>
  <p v-else-if="score >= 60">及格</p>
  <p v-else>不及格</p>

  <!-- 空状态标配 -->
  <p v-if="loading">加载中…</p>
  <p v-else-if="items.length === 0">暂无数据</p>
  <ul v-else>…</ul>
</template>
```

家族规则：`v-else-if` / `v-else` 必须紧跟在 `v-if`（或上一个 else）的元素后面。

## 7.2 v-show：显示与隐藏

```vue
<template>
  <p v-show="isVisible">我只是 display:none</p>
</template>
```

| 维度 | v-if | v-show |
| --- | --- | --- |
| 切换方式 | 增删 DOM 节点 | display:none 切换 |
| 初始开销 | 条件假时不渲染 | 总会渲染 |
| 切换开销 | 高（要重建） | 低（只改样式） |
| 支持 | v-else 等家族 | 只能自己 |

**选择口诀：频繁切换用 v-show，大概率不出现/需要销毁逻辑用 v-if。**（比如弹窗的初始化成本高，用 v-if 惰性创建。）

## 7.3 v-for：列表渲染

```vue
<script setup>
import { ref } from 'vue';
const courses = ref([
  { id: 1, title: 'HTML', hours: 8 },
  { id: 2, title: 'CSS', hours: 10 },
  { id: 3, title: 'Vue 3', hours: 20 },
]);
</script>

<template>
  <!-- 数组：item, index -->
  <li v-for="(course, index) in courses" :key="course.id">
    {{ index + 1 }}. {{ course.title }}（{{ course.hours }}h）
  </li>

  <!-- 对象：value, key, index -->
  <span v-for="(value, key) in user" :key="key">{{ key }}: {{ value }}</span>

  <!-- 数字：1..10 -->
  <span v-for="n in 10" :key="n">{{ n }}</span>
</template>
```

## 7.4 :key 的原理：为什么不能省

`:key` 给每个节点一个"身份证"，Diff 算法靠它判断**复用谁、移动谁**：

```text
列表 [A, B, C] → 删除 B →

有 key：A 留、B 删、C 留        （精准操作）
没 key：就地补位、状态错乱风险   （input 内容串位就是这个原因）
```

::: warning key 三条军规
1. 用稳定唯一 id（数据里的 id），**不用 index**
2. index 当 key：插入/删除时已渲染项的状态（输入内容、动画）会错位
3. v-for 必须配 key——不写 Vue 只是警告，但隐患真实存在
:::

## 7.5 v-for 与 v-if 不同时用在一个元素

```vue
<!-- ❌ 官方不推荐：v-for 优先级高，先遍历再逐项判断 -->
<li v-for="t in todos" v-if="!t.done" :key="t.id">{{ t.text }}</li>

<!-- ✅ 方法一：computed 过滤 -->
<template>
  <li v-for="t in activeTodos" :key="t.id">{{ t.text }}</li>
</template>
<script setup>
const activeTodos = computed(() => todos.value.filter(t => !t.done));
</script>

<!-- ✅ 方法二：template 包裹分层 -->
<template v-for="t in todos" :key="t.id">
  <li v-if="!t.done">{{ t.text }}</li>
</template>
```

computed 过滤是首选——过滤逻辑还能复用与测试。

## 7.6 列表的增删改与不可变更新

```js
const list = ref(['a', 'b', 'c']);

// 增
list.value.push('d');                      // 尾部
list.value = ['x', ...list.value];         // 头部

// 删：按 id 过滤（最常用）
list.value = list.value.filter(item => item.id !== id);

// 改：map 生成新数组
list.value = list.value.map(item =>
  item.id === id ? { ...item, done: !item.done } : item
);

// 移动（置顶）
list.value = [list.value.find(i => i.id === id), ...list.value.filter(i => i.id !== id)];
```

## 7.7 过渡动画：transition 组件

列表/条件切换加动画，用内置 `<Transition>` / `<TransitionGroup>`：

```vue
<template>
  <Transition name="fade">
    <p v-if="show">淡入淡出</p>
  </Transition>

  <TransitionGroup name="list" tag="ul">
    <li v-for="t in todos" :key="t.id">{{ t.text }}</li>
  </TransitionGroup>
</template>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity .3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.list-enter-active { transition: all .3s; }
.list-enter-from { opacity: 0; transform: translateY(10px); }
.list-leave-active { transition: all .3s; position: absolute; }
.list-leave-to { opacity: 0; }
</style>
```

约定类名：`*-enter-from`（起点）→ `*-enter-active`（过程）→ `*-enter-to`（终点），leave 同理。

## 7.8 综合练习：可筛选任务列表

```vue
<script setup>
import { ref, computed } from 'vue';

const todos = ref([
  { id: 1, text: '学 v-for', done: false },
  { id: 2, text: '学 :key', done: true },
  { id: 3, text: '学 transition', done: false },
]);
const keyword = ref('');
const showDone = ref(true);

const filtered = computed(() =>
  todos.value
    .filter(t => !keyword.value || t.text.includes(keyword.value))
    .filter(t => showDone.value || !t.done)
);

let nextId = 4;
const newText = ref('');
function add() {
  if (!newText.value.trim()) return;
  todos.value.push({ id: nextId++, text: newText.value.trim(), done: false });
  newText.value = '';
}
</script>

<template>
  <input v-model="keyword" placeholder="筛选…" />
  <label><input type="checkbox" v-model="showDone" /> 显示已完成</label>

  <TransitionGroup name="list" tag="ul">
    <li v-for="t in filtered" :key="t.id">
      <input type="checkbox" v-model="t.done" />
      {{ t.text }}
    </li>
  </TransitionGroup>

  <p v-if="filtered.length === 0">没有匹配的任务</p>

  <input v-model="newText" @keyup.enter="add" placeholder="新增任务" />
</template>
```

全链路：computed 过滤（搜索 + 状态）→ TransitionGroup 动画 → 空状态兜底。

## 本章小结

- v-if 增删节点（家族链）、v-show 切样式；频繁切换 v-show
- v-for + **稳定唯一 :key**（绝不用 index）；列表更新走不可变模式
- v-for 与 v-if 不同元素：computed 过滤最优
- Transition/TransitionGroup 约定类名即可动画
