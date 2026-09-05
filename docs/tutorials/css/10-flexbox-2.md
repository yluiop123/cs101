---
title: Flexbox 布局（下）
---

# 第 10 章 · Flexbox 布局（下）

**本章目标：**

- 掌握项目伸缩三属性：flex-grow / shrink / basis
- 读懂 flex 简写（尤其 `flex: 1`）
- 完成几个经典布局实战

## 10.1 伸缩三属性

Flex 项目的核心能力是**按规则伸缩**，三个属性分工：

| 属性 | 管什么 | 默认值 |
| --- | --- | --- |
| `flex-grow` | 剩余空间**怎么分** | 0（不放大） |
| `flex-shrink` | 空间不足**怎么缩** | 1（等比收缩） |
| `flex-basis` | 项目的"理想尺寸" | auto（用 width/height） |

### flex-grow：分剩余空间

```css
.item-a { flex-grow: 1; }  /* 分到 1 份 */
.item-b { flex-grow: 2; }  /* 分到 2 份 */
/* 剩余空间按 1:2 分配 */
```

### flex-shrink：空间不够时收缩

```css
.item { flex-shrink: 0; }  /* 不允许收缩（内容可能溢出） */
.item { flex-shrink: 1; }  /* 默认：按比例收缩 */
```

### flex-basis：主轴上的基准尺寸

```css
.item { flex-basis: 200px; }  /* 优先于 width */
.item { flex-basis: auto; }   /* 回退到 width/height */
```

## 10.2 flex 简写辨析

```css
.item { flex: 1; }            /* 等价 flex: 1 1 0% */
.item { flex: auto; }         /* 等价 flex: 1 1 auto */
.item { flex: none; }         /* 等价 flex: 0 0 auto —— 完全不伸缩 */
.item { flex: 0 0 200px; }    /* 固定 200px，不伸不缩 */
.item { flex: 1 1 200px; }    /* 基准 200px，可伸可缩 */
```

::: danger flex: 1 与 flex: auto 的区别
两者都能放大，差别在基准：

- `flex: 1`（basis 0%）：把**整个主轴空间**当剩余空间按比例分——适合"等分栏"
- `flex: auto`（basis auto）：先按内容占位，**剩余部分**再按比例分——适合"内容优先"

常见 bug："flex:1 的侧边栏被文字撑得很宽"——因为 basis 是 auto，内容宽度参与了计算。想纯等分就用 `flex: 1`。
:::

## 10.3 经典布局 1：侧边栏 + 主内容

```css
.layout { display: flex; min-height: 400px; }
.sidebar { flex: 0 0 200px; }        /* 定宽 200px 不伸缩 */
.main { flex: 1; }                    /* 吃掉全部剩余空间 */
```

## 10.4 经典布局 2：圣杯布局（头/三栏/脚）

```css
.holy-grail { display: flex; flex-direction: column; min-height: 100vh; }
.hg-header, .hg-footer { flex: none; padding: 14px; background: #1e293b; color: #fff; }
.hg-middle { display: flex; flex: 1; }
.hg-aside { flex: 0 0 160px; background: #f1f5f9; }
.hg-content { flex: 1; background: #fff; padding: 16px; }
```

```html
<style>
  .hg { font-family: sans-serif; display: flex; flex-direction: column; min-height: 300px; border-radius: 10px; overflow: hidden; font-size: 13px; }
  .hg-head, .hg-foot { background: #1e293b; color: #fff; padding: 10px 16px; }
  .hg-middle { display: flex; flex: 1; }
  .hg-aside { flex: 0 0 130px; background: #f1f5f9; padding: 12px; color: #64748b; }
  .hg-main { flex: 1; background: #fff; border: 1px solid #e2e8f0; padding: 12px; }
</style>

<div class="hg">
  <div class="hg-head">header（固定）</div>
  <div class="hg-middle">
    <div class="hg-aside">aside<br />130px</div>
    <div class="hg-main">main：flex:1 吃掉剩余全部空间</div>
    <div class="hg-aside">aside<br />130px</div>
  </div>
  <div class="hg-foot">footer（固定）</div>
</div>
```

## 10.5 经典布局 3：底部按钮条（一左多右）

```css
.footer-bar { display: flex; align-items: center; }
.footer-bar .title { flex: 1; }     /* 弹性占位，把后面的按钮推到右边 */
.footer-bar button { margin-left: 8px; }
```

`flex: 1` 的"弹性占位"技巧：不需要 `margin-left: auto` 也能实现左分右合。

## 10.6 等分卡片行

```css
.cards { display: flex; gap: 16px; }
.cards .card { flex: 1; }    /* 三张卡完全等宽 */
```

::: tip gap 淘汰了 margin 网格
Flex 容器支持 `gap`，项目之间的间距由容器统一管理——再也不用"margin-right + :last-child 归零"的老套路。
:::

## 10.7 换行后的等宽难题

`flex: 1` + `flex-wrap: wrap` 做自动换行网格时，最后一行可能"撑不满"：

```css
.grid-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.grid-cards .card {
  flex: 1 1 260px;   /* 基准 260px：放得下就并排，放不下换行 */
}
```

`flex-basis` 给最小宽度，实现"自适应卡片流"。要求**最后一行也严格等宽**的场景，请用 Grid（下一章）。

## 10.8 综合实战：聊天界面布局

```html
<style>
  .chat { font-family: sans-serif; display: flex; flex-direction: column; height: 260px; max-width: 360px; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; font-size: 13px; }
  .chat .bar { background: #2563eb; color: #fff; padding: 9px 14px; flex: none; }
  .chat .msgs { flex: 1; padding: 10px 14px; background: #f8fafc; overflow: auto; display: flex; flex-direction: column; gap: 8px; }
  .chat .m { max-width: 75%; padding: 7px 11px; border-radius: 10px; line-height: 1.5; }
  .chat .m.them { background: #fff; border: 1px solid #e2e8f0; align-self: flex-start; }
  .chat .m.me { background: #dbeafe; align-self: flex-end; }
  .chat .input { flex: none; display: flex; gap: 8px; padding: 8px 10px; border-top: 1px solid #e2e8f0; background: #fff; }
  .chat .input input { flex: 1; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 10px; }
  .chat .input button { border: 0; background: #2563eb; color: #fff; border-radius: 6px; padding: 0 16px; cursor: pointer; }
</style>

<div class="chat">
  <div class="bar">聊天窗口（flex none 固定头部）</div>
  <div class="msgs">
    <div class="m them">Flex 学起来怎么样？</div>
    <div class="m me">两章看完，居中再也不玄学了</div>
    <div class="m them">msgs 区域 flex:1 自动撑满剩余高度</div>
  </div>
  <div class="input">
    <input type="text" placeholder="输入消息…" />
    <button>发送</button>
  </div>
</div>
```

::: info 拆解
- 容器 `flex-direction: column`，头部/输入条 `flex: none` 固定，消息区 `flex: 1` 吃掉剩余高度
- 消息区自身也是列向 flex 容器：`align-self: flex-start/end` 实现"对方靠左、我方靠右"的气泡
:::

## 本章小结

- grow 分剩余空间、shrink 控收缩、basis 定基准；简写 `flex: 1` = `1 1 0%`
- `flex: 1`（纯等分）与 `flex: auto`（内容优先）要分清
- 定宽侧栏 `flex: 0 0 200px` + 主区 `flex: 1` 是最常用的骨架
- 容器 `gap` 取代 margin 网格；换行自适应网格用 `flex: 1 1 最小宽度`，严格等宽交给 Grid
