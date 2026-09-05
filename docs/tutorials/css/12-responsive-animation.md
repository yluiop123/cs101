---
title: 响应式与动画实战
---

# 第 12 章 · 响应式与动画实战

**本章目标：**

- 掌握媒体查询与响应式三件套（rem/vw/断点）
- 学会 transition 过渡与 animation 关键帧动画
- 用 CSS 变量统一管理主题，完成综合实战

## 12.1 媒体查询：按条件套样式

```css
/* 默认样式：移动端优先 */
.nav-links { display: none; }

/* 断点：宽度 ≥ 768px 时（平板/桌面）显示 */
@media (min-width: 768px) {
  .nav-links { display: flex; gap: 16px; }
}
```

常用断点约定（可按团队调整）：

```text
640px  大屏手机横屏
768px  平板
1024px 笔记本
1280px 桌面
```

::: tip 移动优先
先写手机端样式（最简单），再用 `min-width` 逐级增强——比"桌面优先再压缩"的思路维护成本低得多。媒体查询还能查其他条件：`prefers-color-scheme`（深色模式）、`prefers-reduced-motion`（减少动画）。
:::

## 12.2 rem 与 vw：让尺寸随屏幕流动

```css
html { font-size: 16px; }
.title { font-size: 2rem; }        /* 32px：随根字号整体缩放 */
.banner { height: 30vw; }          /* 视口宽度的 30%：随窗口宽度流动 */
.container { max-width: 1200px; margin: 0 auto; }  /* 大屏限宽居中 */
```

组合策略：**布局用百分比/max-width，文字用 rem，全屏元素用 vw**。

## 12.3 过渡：transition

让属性变化"平滑发生"而不是瞬间跳变：

```css
.button {
  background: #2563eb;
  transition: background 0.3s ease, transform 0.3s ease;
}
.button:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
}
```

- 写在**元素本体**上（进出 hover 两个方向都有过渡）
- `transition: 属性 时长 缓动函数`，缓动常用 `ease` / `ease-out` / `linear`
- 能过渡的属性：颜色类、尺寸类、transform、opacity（**不能**过渡 display）

::: info transform 不触发重排
`transform`（位移/缩放/旋转）与 `opacity` 的动画由合成器处理，性能远优于改 top/width——**动画性能两条铁律：只用 transform 与 opacity**。
:::

## 12.4 关键帧动画：animation

比 transition 更自由的动画——自己定义"每一步"：

```css
@keyframes fade-slide-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.toast {
  animation: fade-slide-in 0.4s ease-out both;
}
```

```css
/* 常用补充 */
.toast { animation-iteration-count: infinite; }  /* 循环 */
.toast { animation-delay: 0.2s; }
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.08); }
}
```

```html
<style>
  .anim-demo { font-family: sans-serif; display: flex; gap: 16px; align-items: center; }
  .btn-t { background: #2563eb; color: #fff; border: 0; padding: 10px 22px; border-radius: 999px; cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .btn-t:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(37, 99, 235, 0.35); }
  .badge-a { padding: 10px 18px; background: #fde68a; border-radius: 10px; animation: bounce-in 1.2s ease-out both infinite alternate; font-size: 13px; }
  @keyframes bounce-in {
    from { transform: translateY(0) scale(1); }
    to   { transform: translateY(-8px) scale(1.05); }
  }
  .skeleton { width: 140px; height: 12px; border-radius: 6px; background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%); background-size: 200% 100%; animation: shimmer 1.4s linear infinite; }
  @keyframes shimmer {
    from { background-position: 200% 0; }
    to   { background-position: -200% 0; }
  }
</style>

<div class="anim-demo">
  <button class="btn-t">悬停看过渡</button>
  <div class="badge-a">循环动画</div>
  <div class="skeleton"></div>
</div>
```

三个效果：悬停按钮（transition 抬升）、跳动徽标（keyframes + infinite alternate）、加载骨架屏（渐变 + background-position 动画）。在本地运行后悬停按钮即可体验过渡效果。

## 12.5 CSS 变量：统一管理主题

```css
:root {
  --brand: #2563eb;
  --brand-dark: #1d4ed8;
  --text: #1e293b;
  --radius: 10px;
}

.button { background: var(--brand); border-radius: var(--radius); }
.link { color: var(--brand); }

/* 深色模式：只改变量值，所有引用自动生效 */
@media (prefers-color-scheme: dark) {
  :root { --brand: #60a5fa; --text: #e4e4e7; }
}
```

变量在 `:root` 定义、`var()` 引用、可被 JS 动态修改（`document.documentElement.style.setProperty('--brand', ...)`）——换肤、主题切换的基建。

## 12.6 综合实战：响应式登录页

```html
<style>
  .login-page { font-family: sans-serif; min-height: 320px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #eff6ff, #dbeafe); border-radius: 10px; padding: 16px; }
  .login-card { background: #fff; border-radius: 14px; box-shadow: 0 12px 32px rgba(37, 99, 235, 0.18); padding: 24px; width: 100%; max-width: 320px; }
  .login-card h2 { margin: 0 0 4px; font-size: 20px; color: #1e293b; }
  .login-card .sub { margin: 0 0 16px; font-size: 13px; color: #94a3b8; }
  .login-card input { width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 12px; font-size: 14px; transition: border-color 0.2s ease; }
  .login-card input:focus { outline: none; border-color: #2563eb; }
  .login-card button { width: 100%; padding: 11px; border: 0; border-radius: 8px; background: #2563eb; color: #fff; font-size: 15px; cursor: pointer; transition: background 0.3s ease, transform 0.2s ease; }
  .login-card button:hover { background: #1d4ed8; transform: translateY(-1px); }
  @media (min-width: 560px) {
    .login-card { max-width: 380px; padding: 32px; }
  }
</style>

<div class="login-page">
  <div class="login-card">
    <h2>欢迎回来</h2>
    <p class="sub">登录 CS101 继续学习</p>
    <input type="text" placeholder="用户名" />
    <input type="password" placeholder="密码" />
    <button>登 录</button>
  </div>
</div>
```

::: info 覆盖检查
这一个登录页用到：Flex 居中、渐变背景、阴影、圆角、input 聚焦过渡、按钮 hover 过渡、媒体查询增宽——正是前十二章的浓缩。
:::

## CSS 教程结语

- 媒体查询移动优先：先手机样式，`min-width` 逐级增强
- 尺寸策略：布局用 %/max-width，文字用 rem，全屏用 vw
- 动画性能铁律：只过渡 transform 与 opacity；transition 管"两态"，animation 管"过程"
- CSS 变量统一主题值，配合媒体查询实现深色模式

至此 CSS 教程完结。你已能独立还原常见设计稿——接下来进入 [JavaScript 教程](/tutorials/javascript/)，为页面注入灵魂。
