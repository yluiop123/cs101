---
title: 路由
---

# 第 6 章 · 路由

**本章目标：**

- 配置 Angular 路由实现多页面 SPA
- 掌握路由参数、懒加载与子路由
- 学会用守卫做登录拦截

## 6.1 配置路由

```ts
// src/app/app.routes.ts —— 路由表（独立文件，CLI 生成项目自带）
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },   // 空路径重定向
  { path: 'home', loadComponent: () => import('./views/home/home.component').then(m => m.HomeComponent) },
  { path: 'about', loadComponent: () => import('./views/about/about.component').then(m => m.AboutComponent) },
  { path: '**', component: NotFoundComponent },          // 兜底 404（放最后）
];
```

```ts
// main.ts / app.config.ts 里注册
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

providers: [provideRouter(routes)]
```

`loadComponent` = 组件级懒加载（standalone 时代的懒加载方式）——**生产项目路由一律懒加载**，与 Vue/React 同理（Vite 教程第 5 章分包原理相同）。

## 6.2 出口与导航

```ts
// 根组件
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav>
      <a routerLink="/home" routerLinkActive="active">首页</a>
      <a routerLink="/about" routerLinkActive="active">关于</a>
    </nav>
    <router-outlet></router-outlet>   <!-- 路由出口：匹配组件渲染在这 -->
  `,
})
export class AppComponent {}
```

## 6.3 路由参数

```ts
// 路由定义
{ path: 'course/:id', loadComponent: () => import('./views/course-detail/course-detail.component').then(m => m.CourseDetailComponent) },
```

```ts
// CourseDetailComponent
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({ standalone: true, ... })
export class CourseDetailComponent {
  private route = inject(ActivatedRoute);
  courseId = signal('');

  constructor() {
    // 快照：进组件时取一次
    this.courseId.set(this.route.snapshot.paramMap.get('id') ?? '');

    // 订阅：同组件间参数变化（/course/1 → /course/2）——推荐
    this.route.paramMap.subscribe(params => {
      this.courseId.set(params.get('id') ?? '');
      this.loadCourse();
    });
  }

  loadCourse() { /* fetch(`/api/courses/${this.courseId()}`) */ }
}
```

## 6.4 编程式导航

```ts
import { Router } from '@angular/router';

export class LoginComponent {
  private router = inject(Router);

  onLoginSuccess() {
    this.router.navigate(['/dashboard']);            // 前进
    // this.router.navigate(['/login']);             // 等价 URL 字符串
    // this.router.navigateByUrl('/dashboard');      // 绝对路径导航
    // this.router.navigate(['/course', id]);        // 数组片段（带参数）
  }
}
```

## 6.5 子路由与 Outlet 嵌套

```ts
export const routes: Routes = [
  {
    path: 'user',
    loadComponent: () => import('./views/user/user-layout.component').then(m => m.UserLayoutComponent),
    children: [
      { path: '', component: ProfileComponent },        // /user 默认子页
      { path: 'settings', component: SettingsComponent }, // /user/settings
    ],
  },
];
```

```html
<!-- UserLayoutComponent 模板：外壳 + 二级出口 -->
<h1>用户中心</h1>
<nav>
  <a routerLink="/user">资料</a>
  <a routerLink="/user/settings">设置</a>
</nav>
<router-outlet></router-outlet>   <!-- 子路由出口 -->
```

## 6.6 守卫：登录拦截

Angular v15+ 用**函数式守卫（functional guards）**：

```ts
// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);          // 守卫里也能用 DI！
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;                             // 放行
  }
  // 未登录：重定向登录页，记下目标页（登录后回来）
  router.navigate(['/login'], { queryParams: { redirect: state.url } });
  return false;
};
```

```ts
// 路由表挂守卫
{
  path: 'dashboard',
  loadComponent: () => import('./views/dashboard/dashboard.component').then(m => m.DashboardComponent),
  canActivate: [authGuard],
}
```

```ts
// 登录成功后来路回跳
onLoginSuccess() {
  const redirect = this.route.snapshot.queryParamMap.get('redirect') ?? '/';
  this.router.navigateByUrl(redirect);
}
```

对照：Vue 的 beforeEach / React 的守卫组件，Angular 是"路由配置挂函数"——**守卫本身也是 DI 的受益者**（inject 服务做判断）。

## 6.7 传递数据的其他方式

```ts
// 查询参数
this.router.navigate(['/search'], { queryParams: { keyword: 'vue' } });
// 读取：route.snapshot.queryParamMap.get('keyword')

// 路由状态（不进 URL 的临时数据）
this.router.navigate(['/confirm'], { state: { order: orderData } });
// 读取：history.state.order
```

## 6.8 综合练习：带守卫的迷你站

```ts
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./views/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./views/login.component').then(m => m.LoginComponent) },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./views/dashboard.component').then(m => m.DashboardComponent),
  },
  { path: '**', component: NotFoundComponent },
];
```

清单自查：routerLink/outlet、懒加载路由、paramMap 订阅、navigate 编程导航、函数守卫拦截——Angular 路由主线齐了。

## 本章小结

- 路由表 Routes + provideRouter；`loadComponent` 懒加载
- RouterLink/RouterLinkActive 模板导航；Router.navigate 编程导航
- paramMap 订阅响应参数变化（快照只取一次）
- 函数式守卫 + canActivate；守卫里 inject 服务判断状态
