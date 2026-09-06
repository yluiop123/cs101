---
title: 响应式基础
---

# 第 3 章 · 响应式基础

**本章目标：**

- 理解响应式系统如何"数据变 → 视图变"
- 掌握 ref 与 reactive 的区别与选择
- 避开响应式丢失的常见陷阱

## 3.1 响应式是什么

普通 JS 对象变了，页面不会自己变（要手动改 DOM）。**响应式（reactivity）**= 给数据装上"变更广播"：

```text
读数据时          → 依赖收集：记录"谁在用我"
改数据时          → 触发更新：通知所有依赖"我变了，重新渲染"
```

实现基础是 ES 的 Proxy（代理）：Vue 用 Proxy 包住你的数据对象，拦截读写，自动完成收集与广播。**你只管改数据，渲染全自动。**

## 3.2 ref：最通用的响应式容器

`ref()` 把任意值变成响应式"容器"：

```vue
<script setup>
import { ref } from 'vue';

const count = ref(0);        // 容器包着 0
const user = ref({ name: 'Tom', age: 18 });
const list = ref(['a', 'b']);

function increment() {
  count.value++;             // 脚本里要用 .value 读写
  user.value.age = 19;       // .value 后深层数据也是响应式的
  list.value.push('c');
}
</script>

<template>
  <!-- 模板里自动解包，不需要 .value -->
  <p>{{ count }}</p>
  <p>{{ user.name }}（{{ user.age }}）</p>
  <button @click="increment">加一</button>
</template>
```

**核心规则：脚本中 `.value`，模板中自动解包。**

::: warning 忘写 .value 是最高频错误
`count++`（少了 .value）不会报错也不会生效——容器本身是常量。看到"改了数据没反应"，先查 `.value`。
:::

## 3.3 reactive：对象的另一种包装

`reactive()` 直接代理对象本身（不用 .value）：

```vue
<script setup>
import { reactive } from 'vue';

const state = reactive({
  count: 0,
  user: { name: 'Tom' },
  tags: ['a', 'b'],
});

state.count++;               // 直接访问，无 .value
state.user.name = 'Lucy';    // 深层也是响应式
</script>

<template>
  <p>{{ state.count }}</p>
</template>
```

## 3.4 ref vs reactive：怎么选

| 维度 | ref | reactive |
| --- | --- | --- |
| 能包装 | 任意值（数字/字符串/对象/数组） | 仅对象/数组 |
| 访问 | `.value` | 直接 |
| 替换整体 | `x.value = 新对象` ✅ | 整体替换会丢响应式 ❌ |

**推荐约定：一律用 ref**。理由：

```js
// reactive 的致命伤：解构/替换丢响应式
let state = reactive({ count: 0 });
state = reactive({ count: 1 });   // ❌ 新对象没被"广播系统"登记

const { count } = reactive({ count: 0 });   // ❌ 解构出的是普通数字
count++;   // 视图不更新
```

reactive 的适用场景只剩一个：**组合式函数里聚合一组相关状态**（第 9 章再遇）。日常组件开发 `ref` 走天下。

## 3.5 响应式是"深度"的

```js
const user = ref({
  profile: {
    address: { city: '北京' },
  },
});

user.value.profile.address.city = '上海';   // ✅ 深层修改照样触发更新
```

ref 内部用 reactive 包装对象值——所以嵌套多深都响应式，不用逐层手动处理。

## 3.6 数组的注意点

```js
const todos = ref([
  { id: 1, text: '学 ref', done: false },
]);

// 直接索引赋值 / push / splice 都正常工作（Proxy 代理整组方法）
todos.value[0].done = true;          // ✅
todos.value.push({ id: 2 });         // ✅
todos.value = todos.value.filter(t => !t.done);   // ✅ 整体替换也行（ref 的优势）

// 常见模式：不可变更新（配合 JS 教程第 8 章数组方法）
todos.value = todos.value.map(t =>
  t.id === id ? { ...t, done: !t.done } : t
);
```

## 3.7 只读与浅层（了解）

```js
import { ref, readonly, shallowRef } from 'vue';

const config = readonly(ref({ theme: 'dark' }));   // 外层只读，防误改

const bigList = shallowRef([]);   // 浅层：只追踪 .value 整体替换
bigList.value = newList;          // ✅ 触发更新
bigList.value[0].name = 'x';      // ⚠️ 不触发（浅层）——性能优化大数组时用
```

初学记两个名字即可，第 12 章实战遇到大列表会再用到 shallowRef。

## 3.8 综合练习：响应式购物车

```vue
<script setup>
import { ref, computed } from 'vue';

const items = ref([
  { id: 1, name: '键盘', price: 199, qty: 1 },
  { id: 2, name: '鼠标', price: 99, qty: 2 },
]);

function add(id) {
  const item = items.value.find(i => i.id === id);
  item.qty++;
}

// computed 派生值：依赖变了自动重算（下一节细讲，先尝鲜）
const total = computed(() =>
  items.value.reduce((sum, i) => sum + i.price * i.qty, 0)
);
</script>

<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.name }} × {{ item.qty }}
      <button @click="add(item.id)">+1</button>
    </li>
  </ul>
  <p>合计：¥{{ total }}</p>
</template>
```

点"+1"：数量变 → 合计自动重算 → 视图自动更新——响应式系统全流程。

## 本章小结

- Proxy 拦截读写：依赖收集 + 触发更新，改数据即改视图
- ref 万能（脚本 `.value`、模板解包）；reactive 仅对象且怕替换/解构
- **约定：组件开发一律 ref**；深度响应式默认开启
- 计算属性 computed 派生数据（第 4 章展开）
