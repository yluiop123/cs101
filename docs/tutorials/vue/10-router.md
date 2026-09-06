---
title: 路由 Vue Router
---

# 第 10 章 · 路由 Vue Router

**本章目标：**

- 配置 Vue Router 实现单页应用的多页面
- 掌握路由参数、嵌套路由与编程式导航
- 学会导航守卫做登录拦截

## 10.1 为什么需要路由

多页传统站点：每次跳转整页刷新。**单页应用（SPA）**用前端路由（router）在不刷新的前提下切换"页面"：

```text
URL 变了 → 路由器匹配配置 → 渲染对应组件（其余不动）
```

Vue Router 是 Vue 官方路由方案，`npm create vue` 时勾选 Router 即已装好。

## 10.2 基本配置

```js
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(),          // HTML5 模式（无 # 号）
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue') },   // 懒加载
  ],
});

export default router;
```

```js
// main.js 挂载
import router from './router';
createApp(App).use(router).mount('#app');
```

**懒加载**：`() => import(...)` 动态导入——每个页面拆独立 chunk（[Vite 教程第 5 章](/tutorials/vite/)的分包），首屏只加载首页代码。**生产项目路由一律懒加载**（首页可静态导入）。

## 10.3 两个核心组件

```vue
<template>
  <!-- RouterLink：导航（渲染成 <a>，不会整页刷新） -->
  <nav>
    <RouterLink to="/">首页</RouterLink>
    <RouterLink to="/about">关于</RouterLink>
  </nav>

  <!-- RouterView：路由出口，匹配的组件渲染在这里 -->
  <main>
    <RouterView />
  </main>
</template>
```

RouterLink 激活时自动加 `router-link-active` 类——配合 CSS 做高亮导航。

## 10.4 动态路由参数

```js
// 路由定义：冒号声明参数
{ path: '/course/:id', name: 'course-detail', component: () => import('@/views/CourseDetail.vue') },
```

```vue
<!-- CourseDetail.vue -->
<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, watch } from 'vue';

const route = useRoute();
const course = ref(null);

async function load() {
  const res = await fetch(`/api/courses/${route.params.id}`);
  course.value = await res.json();
}

onMounted(load);
// 同一组件间参数变化（/course/1 → /course/2）不会重新创建组件，要侦听
watch(() => route.params.id, load);
</script>
```

## 10.5 编程式导航

代码里跳转（提交后跳、登录后跳）：

```js
import { useRouter } from 'vue-router';

const router = useRouter();

router.push('/course/3');        // 前进（可回退）
router.push({ name: 'course-detail', params: { id: 3 } });   // 命名路由
router.replace('/login');        // 替换（不留历史记录）
router.back();                   // 回退
```

## 10.6 嵌套路由

页面里的"子页面"（布局复用）：

```js
{
  path: '/user',
  component: () => import('@/views/UserLayout.vue'),   // 外壳
  children: [
    { path: 'profile', component: () => import('@/views/UserProfile.vue') },  // /user/profile
    { path: 'settings', component: () => import('@/views/UserSettings.vue') }, // /user/settings
  ],
}
```

```vue
<!-- UserLayout.vue：外壳内再放一个出口 -->
<template>
  <h1>用户中心</h1>
  <nav><RouterLink to="/user/profile">资料</RouterLink>…</nav>
  <RouterView />   <!-- 子路由渲染在这 -->
</template>
```

## 10.7 导航守卫：登录拦截

**守卫（guard）**= 跳转的"关卡"，最常用的是全局前置守卫：

```js
// router/index.js
router.beforeEach((to) => {
  const isLoggedIn = localStorage.getItem('token');   // 简化示例

  if (to.meta.requiresAuth && !isLoggedIn) {
    // 未登录访问受限页 → 重定向登录页，带上"来路"
    return { name: 'login', query: { redirect: to.fullPath } };
  }
  // return true / undefined → 放行
});
```

```js
// 路由元信息：给路由打标记
{ path: '/admin', component: AdminView, meta: { requiresAuth: true } },
```

登录成功后回到来路：

```js
// LoginView.vue
async function onLogin() {
  await loginApi(form);
  const redirect = route.query.redirect ?? '/';
  router.replace(redirect);
}
```

## 10.8 404 与重定向

```js
routes: [
  { path: '/', redirect: '/home' },                                   // 重定向
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },  // 兜底放最后
]
```

## 10.9 综合练习：带守卫的迷你站

```js
// 完整路由表
const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
  { path: '/dashboard', name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', component: NotFoundView },
];

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
});
```

清单自查：RouterLink 导航、RouterView 出口、params 取参、push 编程导航、meta + beforeEach 拦截——SPA 骨架齐了。

## 本章小结

- SPA 路由 = URL 到组件的映射；history 模式无 # 号
- RouterLink 导航 + RouterView 出口；页面组件懒加载
- `useRoute` 读参数（params/query）、`useRouter` 编程导航
- 嵌套路由复用布局；`meta + beforeEach` 做登录拦截；末尾放 404
