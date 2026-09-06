---
title: React Router 路由
---

# 第 7 章 · React Router 路由

**本章目标：**

- 配置 React Router 实现多页面 SPA
- 掌握动态参数、编程式导航与嵌套路由
- 学会登录拦截与 404 兜底

## 7.1 安装与基本配置

```bash
npm install react-router-dom
```

React Router v6+ 的声明式写法——**路由表直接写成 JSX**：

```jsx
// src/main.jsx
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

```jsx
// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from '@/views/Home.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />   {/* 兜底放最后 */}
    </Routes>
  );
}
```

```text
BrowserRouter  包住应用（启用 history 路由）
Routes         路由出口集合
Route          path → element 的映射
*              通配 404
```

## 7.2 导航：Link 与 NavLink

```jsx
import { Link, NavLink } from 'react-router-dom';

function Nav() {
  return (
    <nav>
      {/* 普通链接（不刷新页面） */}
      <Link to="/">首页</Link>
      <Link to="/about">关于</Link>

      {/* NavLink：激活时自动加 active 类（导航高亮） */}
      <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>首页</NavLink>
    </nav>
  );
}
```

## 7.3 动态参数与 useParams

```jsx
<Route path="/course/:id" element={<CourseDetail />} />
```

```jsx
// views/CourseDetail.jsx
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function CourseDetail() {
  const { id } = useParams();              // URL 参数对象
  const [course, setCourse] = useState(null);

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then(res => res.json())
      .then(setCourse);
  }, [id]);                                // id 变化重新请求

  if (!course) return <p>加载中…</p>;
  return <h1>{course.title}</h1>;
}
```

## 7.4 编程式导航

```jsx
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  async function onSubmit() {
    await loginApi(form);
    navigate('/dashboard');                    // 前进（可回退）
    // navigate('/login', { replace: true });  // 替换（不留历史）
    // navigate(-1);                           // 回退
  }
  ...
}
```

## 7.5 嵌套路由与 Outlet

```jsx
<Routes>
  <Route path="/user" element={<UserLayout />}>
    <Route index element={<UserProfile />} />          {/* /user 默认子页 */}
    <Route path="settings" element={<UserSettings />} /> {/* /user/settings */}
  </Route>
</Routes>
```

```jsx
// views/UserLayout.jsx：外壳 + 子路由出口
import { Outlet, NavLink } from 'react-router-dom';

export default function UserLayout() {
  return (
    <div>
      <h1>用户中心</h1>
      <nav>
        <NavLink to="/user">资料</NavLink>
        <NavLink to="/user/settings">设置</NavLink>
      </nav>
      <Outlet />   {/* 子路由组件渲染在这里 */}
    </div>
  );
}
```

## 7.6 路由懒加载与 Suspense

```jsx
import { lazy, Suspense } from 'react';

// lazy：动态 import 的组件（Vite 自动分包，第 5 章原理）
const Dashboard = lazy(() => import('@/views/Dashboard.jsx'));

export default function App() {
  return (
    <Suspense fallback={<p>加载中…</p>}>       {/* chunk 加载期间的占位 */}
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
```

**懒加载 + Suspense 兜底**是生产项目路由的标准形态（首页组件可保持静态导入）。

## 7.7 登录拦截

React Router 没有全局守卫钩子——惯用**守卫组件**包裹受保护路由：

```jsx
// components/RequireAuth.jsx
import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // 未登录：重定向登录页并记下"来路"
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}
```

```jsx
// 路由表里包裹
<Route
  path="/dashboard"
  element={
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  }
/>
```

```jsx
// 登录成功后来路回跳
import { useLocation, useNavigate } from 'react-router-dom';

function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  async function onSubmit() {
    await loginApi(form);
    navigate(location.state?.from ?? '/');   // 回到之前想去的页面
  }
}
```

组件化守卫比配置式守卫更"React"——逻辑即组件，可任意组合（RequireAuth + RequireAdmin 叠加）。

## 7.8 综合练习：迷你站路由表

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/course/:id" element={<CourseDetail />} />
  <Route
    path="/dashboard"
    element={<RequireAuth><Dashboard /></RequireAuth>}
  />
  <Route path="*" element={<NotFound />} />
</Routes>
```

清单自查：Link/NavLink 导航、useParams 取参、useNavigate 编程跳转、Outlet 嵌套、lazy+Suspense 懒加载、守卫组件拦截——SPA 路由全家桶齐了。

## 本章小结

- BrowserRouter + Routes/Route 声明路由表；`*` 兜底 404
- Link/NavLink 导航；useParams 读参数；useNavigate 编程跳转
- 嵌套路由 `<Route>` 套 `<Route>`，外壳放 `<Outlet />`
- lazy + Suspense 懒加载；守卫组件（Navigate 重定向 + state 记来路）做拦截
