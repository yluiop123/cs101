---
title: 侦听与生命周期
---

# 第 4 章 · 侦听与生命周期

**本章目标：**

- 掌握 computed 的派生与缓存特性
- 学会 watch 侦听数据变化执行副作用
- 熟悉组件生命周期钩子的常用节点

## 4.1 computed：计算属性

**computed（计算属性）**：由现有数据"派生"出新数据，带缓存：

```vue
<script setup>
import { ref, computed } from 'vue';

const todos = ref([
  { text: '学 HTML', done: true },
  { text: '学 Vue', done: false },
]);

const activeCount = computed(() => todos.value.filter(t => !t.done).length);
const allDone = computed(() => activeCount.value === 0);
</script>

<template>
  <p>未完成 {{ activeCount }} 项，{{ allDone ? '全部完成！' : '继续加油' }}</p>
</template>
```

三个关键特性：

```text
① 派生声明：total = f(items)，数据关系一目了然
② 自动追踪：f 里用到的响应式数据变了，自动重算
③ 缓存：依赖没变就不重算（多次使用只算一次）
```

**该用 computed 的信号：模板里出现了"由其他数据算出来的表达式"。** 抽进 computed，模板只留数据名。

```vue
<template>
  <!-- ❌ 逻辑糊在模板里 -->
  <p>{{ items.filter(i => i.done).length }} 项完成</p>

  <!-- ✅ 语义化 + 缓存 -->
  <p>{{ doneCount }} 项完成</p>
</template>
```

## 4.2 computed 可写（少见但要知道）

```js
const firstName = ref('张');
const lastName = ref('三');

// 传对象：getter + setter，可读可写
const fullName = computed({
  get: () => firstName.value + lastName.value,
  set: (val) => {
    firstName.value = val.slice(0, 1);
    lastName.value = val.slice(1);
  },
});

fullName.value = '李四';   // 触发 set，拆回两个 ref
```

90% 场景只用只读版。可写版用于"双拆单"这类**视图与数据结构不一致**的适配。

## 4.3 watch：侦听变化执行副作用

**副作用（side effect）**：改数据之外要做的事（请求、存 localStorage、打日志）——这些不适合放 computed，用 `watch`：

```vue
<script setup>
import { ref, watch } from 'vue';

const keyword = ref('');
const results = ref([]);

// 侦听单个 ref
watch(keyword, async (newVal, oldVal) => {
  if (!newVal) { results.value = []; return; }
  const res = await fetch(`/api/search?q=${newVal}`);
  results.value = await res.json();
});
</script>

<template>
  <input v-model="keyword" placeholder="搜索" />
  <ul><li v-for="r in results" :key="r.id">{{ r.title }}</li></ul>
</template>
```

侦听不同目标：

```js
import { reactive, watch } from 'vue';

const state = reactive({ count: 0, user: { name: 'Tom' } });

// 深层对象：要开 deep（默认不深入）
watch(state, (s) => console.log('任一属性变了'), { deep: true });

// 只关心深层某个字段：用 getter 函数
watch(() => state.user.name, (name) => console.log('名字改为', name));

// 侦听多个源
watch([() => state.count, keyword], ([c, k]) => console.log(c, k));
```

::: warning 侦听对象属性要传 getter
`watch(state.user.name, …)` ❌（拿到的是字符串值，不是响应式源）。正确写法 `watch(() => state.user.name, …)` ✅——`() =>` 让每次检查都重新取值。
:::

## 4.4 watch 的选项

```js
watch(keyword, handler, {
  immediate: true,   // 立即执行一次（不等变化）——初始加载场景
  deep: true,        // 深层侦听
  flush: 'post',     // DOM 更新后再执行（需要读更新后 DOM 时）
});
```

## 4.5 watchEffect：自动收集依赖

```js
import { watchEffect } from 'vue';

const keyword = ref('vue');

// 不写"侦听谁"——回调里用到谁，就自动侦听谁
watchEffect(async () => {
  const res = await fetch(`/api/search?q=${keyword.value}`);
  results.value = await res.json();
});
// keyword 一变自动重跑；立即执行一次（天生 immediate）
```

选择建议：

```text
要拿"新旧值"对比 / 只在特定源变化时触发 → watch
多个依赖联动一个副作用、无所谓新旧值     → watchEffect
由数据"算"出另一个数据                  → computed（副作用禁区）
```

## 4.6 生命周期钩子

组件从创建到销毁的关键节点可以挂钩子（hook）：

```vue
<script setup>
import { ref, onMounted, onUpdated, onUnmounted } from 'vue';

const width = ref(0);
const onResize = () => { width.value = window.innerWidth; };

onMounted(() => {
  // DOM 已就绪：发请求、绑全局事件、测尺寸
  width.value = window.innerWidth;
  window.addEventListener('resize', onResize);
});

onUpdated(() => {
  // 因数据变化完成一次 DOM 更新后（少用，优先 computed/watch）
});

onUnmounted(() => {
  // 组件移除前：清理！与 mounted 成对
  window.removeEventListener('resize', onResize);
});
</script>
```

时间线：

```text
setup（<script setup> 本体）→ 挂载前 → mounted（DOM 就绪）
  → 数据变 → updated → … → 卸载前 → unmounted
```

::: tip 请求发在 mounted 还是 setup？
`<script setup>` 顶层直接 await/fetch 也行（SSR 需要时放 setup）；纯客户端项目惯例放 `onMounted`——语义清晰："DOM 好了之后拉数据"。
:::

## 4.7 清理纪律

**凡在 mounted（或 watchEffect）里"借"的全局资源，必须在 unmounted 里归还**：

```js
// 定时器
const timer = setInterval(tick, 1000);
onUnmounted(() => clearInterval(timer));

// watchEffect 自动清理
const stop = watchEffect(fetchData);
stop();   // 手动停止；组件卸载时自动停止
```

这是防止内存泄漏的核心纪律——组件树动态增删时尤其重要。

## 4.8 综合练习：实时时钟

```vue
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const now = ref(new Date());
const timer = ref(null);

const timeText = computed(() =>
  now.value.toLocaleTimeString('zh-CN', { hour12: false })
);

onMounted(() => {
  timer.value = setInterval(() => { now.value = new Date(); }, 1000);
});

onUnmounted(() => clearInterval(timer.value));
</script>

<template>
  <p class="clock">{{ timeText }}</p>
</template>
```

要素齐全：setInterval 副作用（watch 可选）、computed 格式化、mounted 挂 / unmounted 卸——本章所有概念的最小应用。

## 本章小结

- computed 派生 + 缓存，模板表达式该搬家了
- watch 侦听变化做副作用（对象属性用 getter、deep 按需开）；watchEffect 自动收集依赖
- mounted 发请求/绑事件，unmounted 清理成对
- 副作用与派生数据分清：computed 算数据、watch 干杂活
