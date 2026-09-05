---
title: 定位与层级
---

# 第 8 章 · 定位与层级

**本章目标：**

- 掌握 position 五种模式的适用场景
- 实现相对定位/绝对定位的经典搭配
- 理解 z-index 与层叠上下文规则

## 8.1 position：五兄弟

定位（position）让元素**脱离常规流**或在其上精确定位：

| 值 | 行为 | 典型场景 |
| --- | --- | --- |
| `static` | 默认，无定位 | — |
| `relative` | 相对**自己原位置**偏移，仍占位 | 微调、做绝对定位的参照 |
| `absolute` | 相对**最近的定位祖先**偏移，脱离流 | 角标、悬浮按钮 |
| `fixed` | 相对**浏览器视口**，滚动不动 | 吸顶导航、返回顶部 |
| `sticky` | 滚动到阈值前正常，到达后"粘住" | 表头吸顶、侧栏跟随 |

::: danger 定位三件套
定位模式必须配合偏移属性才有意义：`top` / `right` / `bottom` / `left`。relative 与 absolute 的"参照物"完全不同，是新手混淆的重灾区。
:::

## 8.2 relative：相对自己偏移

```css
.tip {
  position: relative;
  top: 10px;    /* 从原位置向下移 10px（top 是"距顶部"偏移） */
  left: 20px;   /* 向右移 20px */
}
```

关键认知：元素**仍然占据原位置的流空间**，视觉上只是"平移"了，原来的坑还留着。

## 8.3 absolute：子绝父相

绝对定位元素脱离流，参照物是**最近的、position 不是 static 的祖先**：

```css
.parent { position: relative; }   /* 经典参照物：relative 不偏移也占位 */
.badge {
  position: absolute;
  top: 8px;
  right: 8px;   /* 贴在 parent 的右上角 */
}
```

"子绝父相"（子元素 absolute + 父元素 relative）是使用率最高的组合：

```html
<style>
  .corner-demo .card { position: relative; width: 260px; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; font-family: sans-serif; }
  .corner-demo .badge { position: absolute; top: -10px; right: -8px; background: #ef4444; color: #fff; font-size: 12px; padding: 3px 10px; border-radius: 999px; }
</style>

<div class="corner-demo">
  <div class="card">
    <span class="badge">99+</span>
    <div style="display: flex; align-items: center; gap: 10px">
      <div>
        <strong style="font-size: 14px">消息通知卡片</strong>
        <p style="margin: 2px 0 0; font-size: 12px; color: #64748b">右上角红点是 absolute 定位</p>
      </div>
    </div>
  </div>
</div>
```

::: warning 参照物找不到就找视口
如果所有祖先都是 static，absolute 元素会参照**初始包含块**（大致是页面根）定位——"明明写了 right:8px 却跑到页面右上角"就是这个原因。给参照祖先补 `position: relative` 即可。
:::

## 8.4 fixed 与 sticky

```css
/* 吸顶导航：永远钉在视口顶部 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}

/* 表头吸顶：滚动经过时粘住 */
.table-head {
  position: sticky;
  top: 0;          /* 距视口顶部 0 时"粘住" */
  background: #fff; /* 粘住后不透明，避免透出滚动内容 */
}
```

- `fixed` 完全脱离流，参照视口，**滚动永不移动**
- `sticky` 平时是 relative，滚动到达 `top` 阈值后变"fixed 效果"，**不脱离流**（现代表格/导航首选）

::: warning sticky 失效排查
sticky 要求：祖先元素**没有** `overflow: hidden/auto/scroll`（会截断粘性行为）、父容器高度足够。粘不住时先查祖先的 overflow。
:::

## 8.5 z-index 与层叠上下文

定位元素会重叠，`z-index` 决定谁在上面：

```css
.modal { position: fixed; z-index: 1000; }   /* 弹窗最高层 */
.mask  { position: fixed; z-index: 999; }    /* 遮罩次之 */
.fab   { position: fixed; z-index: 100; }    /* 悬浮按钮 */
```

直觉规则：**z-index 大者在上**。但真实规则多一层：**z-index 只在同一层叠上下文（stacking context）内比较**。

层叠上下文会在这些情况创建（常见几个）：

- 根元素（HTML）——天然的全球上下文
- position 为 fixed/sticky，或 absolute/relative 且设置了 z-index
- opacity < 1、transform、filter 等属性的元素

::: danger z-index 失灵之谜
"z-index: 9999 却压不过另一个 z-index: 1 的弹窗"——因为你的弹窗被困在一个 transform/opacity 创建的**局部上下文**里，9999 只在局部有效。解法：去掉祖先上不必要的 transform/opacity，或统一在同一父层管理 z-index。
:::

团队实践：z-index 用**分层常量**管理（如 10/100/1000/9999 对应 普通悬浮/下拉/吸顶/弹窗），避免 9999 之后的 10000 军备竞赛。

## 8.6 综合示例：悬浮操作按钮 + 消息条

```html
<style>
  .fab-demo { font-family: sans-serif; position: relative; height: 190px; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; background: #f8fafc; }
  .fab-demo .content { padding: 14px; font-size: 13px; color: #64748b; }
  .fab-demo .toast { position: absolute; top: 10px; left: 50%; transform: translateX(-50%); background: #16a34a; color: #fff; font-size: 13px; padding: 7px 16px; border-radius: 999px; box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3); }
  .fab-demo .fab { position: absolute; bottom: 12px; right: 12px; width: 48px; height: 48px; border-radius: 50%; background: #2563eb; color: #fff; font-size: 24px; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35); cursor: pointer; }
  .fab-demo .tag { position: absolute; top: -6px; right: -6px; width: 16px; height: 16px; background: #ef4444; border-radius: 50%; border: 2px solid #fff; }
</style>

<div class="fab-demo">
  <div class="content">
    <p>这个区域模拟一个"页面"：</p>
    <p>· 顶部居中的绿色消息条 = absolute + left:50% 平移居中</p>
    <p>· 右下角蓝色按钮 = absolute 定位的悬浮按钮（FAB）</p>
  </div>
  <div class="toast">保存成功 ✓</div>
  <div class="fab">+
    <span class="tag"></span>
  </div>
</div>
```

::: info 拆解要点
- 消息条：`left: 50% + translateX(-50%)` 是"绝对定位居中"的经典手法
- FAB：右下角贴边，右上角小红点是"子绝父相"（以按钮为参照）
- 红点覆盖在按钮上，靠的是定位元素天然后置的层叠顺序
:::

## 本章小结

- relative 占位偏移，absolute 脱流找"定位祖先"，fixed 钉视口，sticky 阈值粘住
- "子绝父相"是最常用组合；参照物缺失时绝对定位会跑向视口
- sticky 粘不住先查祖先 overflow
- z-index 只在层叠上下文内比较；transform/opacity 会创建局部上下文导致"失灵"
