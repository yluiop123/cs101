---
title: BOM 与浏览器存储
---

# 第 12 章 · BOM 与浏览器存储

**本章目标：**

- 理解 BOM 提供的浏览器级能力（location/定时器/历史）
- 掌握 localStorage / sessionStorage / cookie 的选择与用法

## 12.1 BOM 是什么

DOM 管"页面内容"，BOM（Browser Object Model，浏览器对象模型）管"浏览器本身"——地址栏、历史记录、窗口尺寸、定时器都由它提供，核心入口是全局对象 `window`。

```js
window.innerWidth;    // 视口宽度
window.innerHeight;   // 视口高度
window.alert('hi');   // 全局方法可省略 window.
```

## 12.2 location：地址栏

```js
location.href;                 // 完整 URL（读）
location.href = 'https://example.com';   // 赋值 = 跳转页面
location.host;                 // 'localhost:5173'
location.pathname;             // '/cs101/tutorials/'
location.search;               // '?page=2&kw=vue'（查询字符串）
location.hash;                 // '#chapter-2'（锚点）

// 解析查询参数（配合第 7 章的 URLSearchParams）
const params = new URLSearchParams(location.search);
params.get('page');   // '2'
params.get('kw');     // 'vue'

// 跳转
location.assign('/about.html');   // 跳转（可后退）
location.replace('/about.html');  // 跳转（不可后退）
location.reload();                // 刷新
```

## 12.3 定时器

```js
// setTimeout：延迟执行一次（毫秒）
const timerId = setTimeout(() => {
  console.log('3 秒后执行');
}, 3000);

// setInterval：每隔一段时间重复执行
const loopId = setInterval(() => {
  console.log('每秒执行');
}, 1000);

// 取消：不用的定时器务必清除
clearTimeout(timerId);
clearInterval(loopId);
```

```js
// 实战模板：倒计时
let seconds = 10;
const countdown = setInterval(() => {
  seconds--;
  console.log(`剩余 ${seconds} 秒`);
  if (seconds <= 0) clearInterval(countdown);   // 到点自停
}, 1000);
```

::: warning setInterval 的坑
回调执行慢于间隔时会"堆积"。轮询场景的现代替代：递归 setTimeout（上一次执行完再排下一次）。**页面卸载前清除定时器**是习惯性要求。
:::

## 12.4 history 与窗口

```js
history.back();       // 后退
history.forward();    // 前进
history.pushState(state, '', '/new-url');   // SPA 路由的基础（Vue Router 原理）
```

```js
// 视口与滚动
window.scrollY;                    // 当前滚动距离
window.scrollTo({ top: 0, behavior: 'smooth' });   // 平滑回顶部
```

## 12.5 localStorage：持久存储

键值对存储，**关闭浏览器、重启电脑都在**（同源共享）：

```js
// 存取（值只能是字符串，对象要 JSON 序列化）
localStorage.setItem('theme', 'dark');
localStorage.getItem('theme');       // 'dark'
localStorage.removeItem('theme');
localStorage.clear();                // 清空本源全部

// 对象的存取套路
const user = { name: 'Tom', vip: true };
localStorage.setItem('user', JSON.stringify(user));
const saved = JSON.parse(localStorage.getItem('user') ?? 'null');
```

::: tip 封装安全读写
`JSON.parse(null)` 会报错，读对象时给默认值（`?? 'null'` 模式）或封装工具函数——第 14 章实战会封装一个 `storage.js`。
:::

## 12.6 三种存储对比与选型

| 特性 | localStorage | sessionStorage | cookie |
| --- | --- | --- | --- |
| 生命周期 | 永久 | 标签页关闭即清 | 可设过期时间 |
| 容量 | ~5MB | ~5MB | ~4KB |
| 随请求发送 | 否 | 否 | **每次请求自动带上** |
| API 易用性 | 简单 | 简单 | 原生 API 繁琐 |

```text
选型口诀
主题、语言偏好、草稿     → localStorage
一次性表单数据、临态     → sessionStorage
身份凭证（登录态）       → cookie（通常由服务端 Set-Cookie 管理）
```

::: warning localStorage 不是数据库
明文存储、无加密——**绝不存密码、令牌等敏感信息**。超过 5MB 或需要结构化查询，用 IndexedDB（进阶）。
:::

## 12.7 综合示例：记住用户的主题选择

```js
const themeBtn = document.querySelector('#theme-toggle');

// 初始化：读取上次的选择
const saved = localStorage.getItem('theme') ?? 'light';
document.body.classList.toggle('dark-theme', saved === 'dark');

themeBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
```

读 → 用 → 写回，三步完成"偏好持久化"——各类"记住我""记住偏好"功能的标准姿势。

## 本章小结

- BOM 管浏览器：location 跳转与解析 URL、history 前进后退
- 定时器两件套 setTimeout/setInterval，用完 clear
- localStorage 永久、sessionStorage 会话级、cookie 随请求发送
- 对象存取配 JSON 序列化；敏感数据不入前端存储
