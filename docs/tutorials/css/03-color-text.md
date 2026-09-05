---
title: 颜色与文本样式
---

# 第 3 章 · 颜色与文本样式

**本章目标：**

- 掌握颜色的四种表示法与选用场景
- 熟练使用 font 系列与 text 系列属性
- 深入理解 line-height 的行为

## 3.1 颜色的四种表示法

```css
.color-demo {
  color: tomato;               /* 1. 关键字（约 140 个预定义色） */
  color: #2563eb;              /* 2. HEX 十六进制（最常用） */
  color: rgb(37 99 235);       /* 3. RGB 函数 */
  color: rgba(37, 99, 235, 0.5); /* 4. RGBA：带透明度 */
}
```

- **HEX**：`#2563eb`，六位为"红绿蓝"两两一组；`#2563eb80` 八位版本末两位是透明度；同两位可简写（`#fff` = `#ffffff`）
- **rgb() / rgba()**：`rgba(37, 99, 235, 0.5)` 最后一个参数是透明度（0~1）
- 现代写法可用空格语法 `rgb(37 99 235 / 50%)`，与旧逗号语法等价

::: tip HEX + 透明度速记
设计稿给色值时大多用 HEX；需要半透明遮罩时用八位 HEX 或 rgba。同一个色号在整个项目里应保持一种写法（配 CSS 变量统一管理，见第 12 章）。
:::

```html
<div class="swatches">
  <div style="background: #2563eb; color:#fff">HEX</div>
  <div style="background: rgba(37, 99, 235, 0.5); color:#1e293b">50% 透明</div>
  <div style="background: tomato; color:#fff">关键字</div>
  <div style="background: hsl(217 91% 60%); color:#fff">HSL</div>
</div>
```

## 3.2 字体：font 系列

```css
p {
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 16px;
  font-weight: 600;     /* 100~900，常用 400/500/600/700 */
  font-style: italic;   /* 斜体 */
}
```

**font-family 是字体栈**：浏览器从左到右找第一个可用的字体。栈末尾**必须放一个通用族**（`sans-serif`/`serif`/`monospace`）兜底。含空格的字体名加引号。

::: info font 简写
`font: italic 600 16px/1.6 system-ui, sans-serif;` 一行合并 style/weight/size/line-height/family——简写虽快，可读性略差，按团队规范选用。
:::

### 字号单位

| 单位 | 含义 | 场景 |
| --- | --- | --- |
| `px` | 固定像素 | 精确控制（图标、边框） |
| `rem` | 相对**根元素**字号（默认 16px） | 响应式缩放的主力 |
| `em` | 相对**父元素**字号 | 行高、内边距随字号缩放 |
| `%` | 同 em 类似 | 容器相关尺寸 |

## 3.3 文本：text 系列

```css
article {
  text-align: justify;         /* left / center / right / justify 两端对齐 */
  text-decoration: none;       /* none 去下划线 / underline / line-through */
  text-transform: uppercase;   /* capitalize / uppercase / lowercase */
  letter-spacing: 0.5px;       /* 字间距 */
  word-spacing: 2px;           /* 词间距（英文） */
  text-indent: 2em;            /* 首行缩进（中文段落常用） */
}
a { text-decoration: none; }   /* 去链接下划线的经典用法 */
```

## 3.4 行高：line-height 深入

行高决定**文字行与行之间的距离**，是可读性的第一要素：

```css
p { line-height: 1.7; }        /* 推荐：无单位数字（倍数） */
p { line-height: 27px; }       /* 固定值：字号变了就坏 */
```

::: danger 为什么必须用无单位数字
`line-height: 27px` 是**计算后的固定值**——子元素字号变大后行高仍是 27px，文字重叠。`1.7` 是**倍数**，每个元素按自己的字号计算，会随字号正确缩放，且能被子元素继承。**永远写 `line-height: 1.7` 这种无单位值**。
:::

经验值：正文 1.6~1.8（中文取偏大），标题 1.2~1.4。

## 3.5 文字完整示例

```css
.article { font-family: sans-serif; max-width: 360px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 10px; }
.article h2 { font-size: 20px; font-weight: 700; line-height: 1.4; margin: 0 0 4px; }
.article .meta { font-size: 12px; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; }
.article p { font-size: 14px; line-height: 1.8; color: #334155; }
.article .price { color: #dc2626; font-size: 22px; font-weight: 700; }
.article .price small { font-size: 12px; color: #94a3b8; text-decoration: line-through; font-weight: 400; }
```

```html
<div class="article">
  <h2>前端学习路线指南</h2>
  <p class="meta">CS101 · Updated</p>
  <p>这是一段正文：行高 1.8 让中文段落保持呼吸感，字号 14px，颜色用次级灰，与标题形成层级对比。</p>
  <p class="price">¥99 <small>原价 ¥199</small></p>
</div>
```

## 本章小结

- 颜色：HEX 为主力，rgba 补透明度，写法全站统一
- font-family 写字体栈 + 兜底通用族；字号响应式场景用 rem
- text 系列管对齐、装饰、变换与间距；去链接下划线是高频操作
- line-height 用无单位倍数（正文 1.6~1.8），继承与随字号缩放都靠它
