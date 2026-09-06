---
title: 组合式函数
---

# 第 9 章 · 组合式函数

**本章目标：**

- 理解"逻辑复用"为什么需要组合式函数
- 学会把一段状态逻辑抽成 useXxx 函数
- 掌握参数传递与返回值约定

## 9.1 复用逻辑的演进

Vue 2 时代复用逻辑靠 mixin（混入）：把数据/方法混进组件。问题：**来源不明、命名冲突、难以追踪**。

Vue 3 的答案：**组合式函数（Composables）**——把"一段有状态的可复用逻辑"写成一个普通函数，谁要用就调用谁，来源清晰、没有冲突。

```text
组件 = UI + 调用若干组合式函数
useMouse()   → 鼠标位置状态
useTodos()   → 待办增删改查
useRequest() → 请求加载状态
```

命名约定：`use` 开头（useFetch、useLocalStorage、useDebounce…）。

## 9.2 第一个组合式函数：useCounter

```js
// src/composables/useCounter.js
import { ref, computed } from 'vue';

export function useCounter(initial = 0) {
  const count = ref(initial);
  const double = computed(() => count.value * 2);

  function increment() { count.value++; }
  function decrement() { count.value--; }
  function reset() { count.value = initial; }

  return { count, double, increment, decrement, reset };
}
```

```vue
<!-- 组件里使用 -->
<script setup>
import { useCounter } from '@/composables/useCounter';

const { count, double, increment } = useCounter(10);   // 每次调用独立实例
</script>

<template>
  <p>{{ count }}（双倍 {{ double }}）</p>
  <button @click="increment">+1</button>
</template>
```

与普通函数的区别：**内部用了响应式 API 并返回响应式数据**——返回的 ref 在组件里持续"活着"。

## 9.3 实战一：useLocalStorage

把 JS 教程第 12 章的 storage 封装升级为组合式函数：

```js
// src/composables/useLocalStorage.js
import { ref, watch } from 'vue';

export function useLocalStorage(key, defaultValue) {
  const load = () => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const data = ref(load());

  // 数据一变就持久化（watch 的本职工作）
  watch(
    data,
    (val) => localStorage.setItem(key, JSON.stringify(val)),
    { deep: true }
  );

  return data;
}
```

```vue
<script setup>
import { useLocalStorage } from '@/composables/useLocalStorage';

// 一个 ref，读写即持久化——用起来与普通 ref 无异
const todos = useLocalStorage('cs101-todos', []);
todos.value.push({ id: 1, text: '体验组合式函数', done: false });
</script>
```

**ref + watch = 自动的数据同步管道**，组件代码里一行持久化都不用写。

## 9.4 实战二：useRequest（加载状态管理）

JS 教程第 13 章的请求状态机，组件化封装：

```js
// src/composables/useRequest.js
import { ref } from 'vue';

export function useRequest(fetcher) {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);

  async function run(...args) {
    loading.value = true;
    error.value = null;
    try {
      data.value = await fetcher(...args);
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  return { data, loading, error, run };
}
```

```vue
<script setup>
import { useRequest } from '@/composables/useRequest';
import { getTodos } from '@/api';

const { data: todos, loading, error, run } = useRequest(getTodos);
run();   // 组件里三行接入完整加载状态
</script>

<template>
  <p v-if="loading">加载中…</p>
  <p v-else-if="error">出错了：{{ error.message }}</p>
  <ul v-else>
    <li v-for="t in todos" :key="t.id">{{ t.text }}</li>
  </ul>
</template>
```

## 9.5 实战三：useDebounce（防抖）

```js
// src/composables/useDebounce.js
import { ref, watch } from 'vue';

export function useDebounce(source, delay = 300) {
  const debounced = ref(source.value);
  let timer = null;

  watch(source, (val) => {
    clearTimeout(timer);
    timer = setTimeout(() => { debounced.value = val; }, delay);
  });

  return debounced;
}
```

```vue
<script setup>
import { ref } from 'vue';
import { useDebounce } from '@/composables/useDebounce';

const keyword = ref('');
const debouncedKeyword = useDebounce(keyword, 500);

// 用防抖后的值发请求：停止输入 500ms 才搜
watch(debouncedKeyword, (k) => search(k));
</script>

<template>
  <input v-model="keyword" placeholder="搜索（防抖 500ms）" />
</template>
```

## 9.6 约定与最佳实践

```js
// ✅ 输入：参数（可以是普通值或 ref/getter）
// ✅ 输出：解构友好的对象（ref + 函数）
// ✅ 内部资源自清理（组件卸载时 watch 自动停止；全局事件要自己清）
export function useWindowWidth() {
  const width = ref(window.innerWidth);
  const onResize = () => { width.value = window.innerWidth; };
  window.addEventListener('resize', onResize);
  // onUnmounted 在组合式函数里同样可用（调用时处于组件 setup 上下文）
  onUnmounted(() => window.removeEventListener('resize', onResize));
  return width;
}
```

三条军规：

1. **只能在 setup（或另一个组合式函数）里调用**——响应式上下文依赖
2. 返回**对象**（不是数组），解构重命名方便
3. 纯逻辑（无状态）不需要组合式函数——普通 utils 函数即可（格式化、校验规则等）

## 9.7 与 Pinia 的分工

```text
组合式函数：可复用的"行为逻辑"（怎么请求、怎么存储、怎么防抖）
Pinia：跨组件共享的"业务状态"（用户信息、购物车全局一份）
```

两者常配合：Pinia store 内部用组合式函数组织逻辑（第 11 章见）。

## 9.8 综合练习：useTodos 全家桶

```js
// src/composables/useTodos.js
import { ref, computed } from 'vue';

export function useTodos(initial = []) {
  const todos = ref(initial);
  let nextId = initial.reduce((m, t) => Math.max(m, t.id), 0) + 1;

  const activeCount = computed(() => todos.value.filter(t => !t.done).length);
  const allDone = computed(() => activeCount.value === 0 && todos.value.length > 0);

  function add(text) {
    if (!text.trim()) return;
    todos.value.push({ id: nextId++, text: text.trim(), done: false });
  }
  function toggle(id) {
    todos.value = todos.value.map(t => (t.id === id ? { ...t, done: !t.done } : t));
  }
  function remove(id) {
    todos.value = todos.value.filter(t => t.id !== id);
  }
  function clearDone() {
    todos.value = todos.value.filter(t => !t.done);
  }

  return { todos, activeCount, allDone, add, toggle, remove, clearDone };
}
```

任何需要待办功能的页面（甚至第 12 章的项目）一行接入：`const { todos, add, toggle, remove } = useTodos(load())`。

## 本章小结

- 组合式函数 = 响应式逻辑的封装单元，取代 mixin
- useXxx 命名；输入参数、输出解构对象；仅限 setup 上下文调用
- ref + watch 实现自动持久化/同步管道；onUnmounted 清理全局资源
- 与 Pinia 分工：逻辑复用 vs 状态共享
