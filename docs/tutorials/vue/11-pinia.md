---
title: 状态管理 Pinia
---

# 第 11 章 · 状态管理 Pinia

**本章目标：**

- 理解"为什么需要全局状态"
- 掌握 Pinia 的 store（state/getter/action）
- 学会 store 的持久化与组合式函数协作

## 11.1 为什么需要全局状态

props/emit 治理"父子"，但跨组件共享会变味：

```text
兄弟组件共享？        → 数据提到共同父组件，再层层下传（props 钻井）
深层 + 跨页面共享？    → provide/inject 追踪困难
多个页面都要改？      → 谁都改一份，状态开始"各处不一致"
```

**状态管理库**：把共享状态放到应用级的"单一来源"（store），任何组件直接读写——Pinia 是 Vue 官方推荐。

```text
store（单一来源）
   ↑ 读写            ↑ 读写
组件 A            组件 B
（同一份数据，改一处全局同步）
```

## 11.2 定义 store

```js
// src/stores/counter.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// 组合式写法（推荐，与 <script setup> 心智一致）
export const useCounterStore = defineStore('counter', () => {
  // state：响应式数据
  const count = ref(0);

  // getter：计算属性
  const double = computed(() => count.value * 2);

  // action：修改逻辑（同步/异步都行）
  function increment() { count.value++; }
  function incrementBy(n) { count.value += n; }
  function reset() { count.value = 0; }

  return { count, double, increment, incrementBy, reset };
});
```

```js
// main.js 注册 Pinia
import { createPinia } from 'pinia';
const pinia = createPinia();
createApp(App).use(pinia).mount('#app');
```

## 11.3 使用 store

```vue
<script setup>
import { useCounterStore } from '@/stores/counter';

const store = useCounterStore();   // 获取 store 实例（单例）
</script>

<template>
  <p>{{ store.count }} × 2 = {{ store.double }}</p>
  <button @click="store.increment()">+1</button>
  <button @click="store.reset()">重置</button>
</template>
```

任何组件调用 `useCounterStore()` 拿到的是**同一个实例**——这就是"共享"。

::: tip storeToRefs 解构保持响应式
直接解构会丢响应式（普通 Proxy 数据的老问题）：

```js
import { storeToRefs } from 'pinia';

const store = useCounterStore();
const { count, double } = storeToRefs(store);   // ✅ 解构出的 ref 保持响应式
const { increment, reset } = store;             // ✅ 函数直接解构（不需要包）
```
:::

## 11.4 实战 store：用户认证

```js
// src/stores/user.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { loginApi, getProfileApi } from '@/api';

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') ?? '');
  const profile = ref(null);

  const isLoggedIn = computed(() => !!token.value);
  const nickname = computed(() => profile.value?.name ?? '游客');

  async function login(credentials) {
    const { token: newToken } = await loginApi(credentials);
    token.value = newToken;
    localStorage.setItem('token', newToken);
    profile.value = await getProfileApi();
  }

  function logout() {
    token.value = '';
    profile.value = null;
    localStorage.removeItem('token');
  }

  return { token, profile, isLoggedIn, nickname, login, logout };
});
```

```vue
<!-- 任意组件 -->
<script setup>
import { useUserStore } from '@/stores/user';

const user = useUserStore();
</script>

<template>
  <p v-if="user.isLoggedIn">你好，{{ user.nickname }}</p>
  <button v-else @click="user.login(form)">去登录</button>
</template>
```

第 10 章的路由守卫可直接用 store：`router.beforeEach((to) => { if (to.meta.requiresAuth && !useUserStore().isLoggedIn) … })`。

## 11.5 异步数据 store：课程列表

```js
// src/stores/courses.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCoursesStore = defineStore('courses', () => {
  const list = ref([]);
  const loading = ref(false);
  const loaded = ref(false);

  // getter：按分类过滤（缓存，分类不变不重算）
  const byCategory = (cat) =>
    computed(() => (cat === 'all' ? list.value : list.value.filter(c => c.cat === cat)));

  async function fetchAll(force = false) {
    if (loaded.value && !force) return;    // 已加载过就不重复请求
    loading.value = true;
    try {
      const res = await fetch('/api/courses');
      list.value = await res.json();
      loaded.value = true;
    } finally {
      loading.value = false;
    }
  }

  return { list, loading, loaded, byCategory, fetchAll };
});
```

```vue
<script setup>
import { useCoursesStore } from '@/stores/courses';

const store = useCoursesStore();
store.fetchAll();   // 多个页面调用也只请求一次（loaded 幂等）
</script>
```

`loaded + force` 模式：数据全局加载一次、需要刷新时强制——比每页各自请求高效得多。

## 11.6 store 之间协作

```js
// cart store 里使用 user store
import { useUserStore } from './user';

export const useCartStore = defineStore('cart', () => {
  const items = ref([]);

  async function checkout() {
    const user = useUserStore();     // 在 action 内调用其他 store
    if (!user.isLoggedIn) throw new Error('请先登录');
    await checkoutApi(items.value, user.token);
    items.value = [];
  }

  return { items, checkout };
});
```

Pinia 的 store 就是一个个组合式函数——互相调用毫无障碍（这是组合式写法的最大红利）。

## 11.7 什么时候用 Pinia

```text
用户认证信息、主题/语言偏好        → ✅ store
购物车、全局通知/弹窗队列         → ✅ store
纯组件内部状态（输入框、开关）     → ❌ 组件 ref 就够
仅父子传的数据                   → ❌ props/emit
可复用的行为逻辑（无共享）         → ❌ 组合式函数（第 9 章）
```

**从"props 钻井痛了"开始用 Pinia**，不要一上来把所有状态都塞 store。

## 11.8 综合练习：三件套联动

场景：登录（user store）→ 首页拉课程（courses store）→ 点收藏记录到本地（useLocalStorage 组合式函数）。

```js
// 每个职责一个单元，页面只做"组装"
const user = useUserStore();          // 是谁
const courses = useCoursesStore();    // 有什么数据
const favorites = useLocalStorage('cs101-favorites', []);   // 我收藏了啥

function toggleFav(id) {
  favorites.value.includes(id)
    ? (favorites.value = favorites.value.filter(i => i !== id))
    : favorites.value.push(id);
}
```

## 本章小结

- 跨组件共享状态 → store 单一来源；Pinia 是官方方案
- 组合式写法：ref（state）+ computed（getter）+ 函数（action）
- storeToRefs 解构保持响应式；store 间在 action 里互相调用
- 克制使用：全局上下文进 store，组件状态留在组件
