---
title: 链接与图片
---

# 第 5 章 · 链接与图片

**本章目标：**

- 熟练使用 `<a>` 标签：页面跳转、锚点、下载
- 理解相对路径与绝对路径的写法规则
- 掌握 `<img>` 的属性体系与图片格式选型

## 5.1 超链接：a 标签

`<a>`（anchor，锚）是 Web 的灵魂——正是它把一个个网页连成了"网"：

```html
<a href="https://developer.mozilla.org">访问 MDN</a>
<a href="./about.html">关于我们（站内页面）</a>
<a href="mailto:hello@example.com">发邮件</a>
```

`href`（hyperlink reference）指定目标地址，支持三种协议：

| 写法 | 行为 |
| --- | --- |
| `https://...` | 跳转外部网页 |
| `./about.html` | 跳转站内页面 |
| `mailto:` | 唤起邮件客户端 |

## 5.2 相对路径与绝对路径

```text
my-site/
├── index.html
├── about.html
├── assets/
│   ├── logo.png
│   └── pages/
│       └── contact.html
```

| 需求 | 写法 | 说明 |
| --- | --- | --- |
| 引用同目录文件 | `./about.html` | `./` 可省略 |
| 引用子目录文件 | `./assets/logo.png` | 逐级往下 |
| 引用上级目录文件 | `../index.html` | `../` 往上跳一层 |
| 从站点根算起 | `/assets/logo.png` | 以域名根为起点（服务器部署常用） |

::: warning 相对路径基准
相对路径以**当前 HTML 文件所在目录**为基准，而不是以浏览器地址栏为准。文件挪动位置后相对路径要跟着改——这是图片裂开的头号原因。
:::

## 5.3 锚点链接：跳到页面某个位置

给目标元素一个 `id`，链接指向 `#id` 即可跳转：

```html
<a href="#chapter-2">跳到第 2 章</a>

<h2 id="chapter-2">第 2 章</h2>
```

常见应用：文章目录、返回顶部（`href="#"` 或指向顶部元素）。跨页面也能用：`./docs.html#install` 直接定位到 docs 页的 install 区块。

## 5.4 新窗口打开与安全

```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  新窗口打开外部网站
</a>
```

- `target="_blank"`：在新标签页打开（站内页面一般不用）
- `rel="noopener noreferrer"`：阻断新窗口对原页面的 `window.opener` 访问，防范钓鱼攻击并保护隐私

::: danger 外链必须加 rel
带 `target="_blank"` 的外链**务必**写 `rel="noopener noreferrer"`——历史上新窗口可以通过 `opener` 篡改原页面，这是真实存在的攻击向量。
:::

## 5.5 下载链接

```html
<a href="./files/report.pdf" download>下载报表</a>
<a href="./files/data.csv" download="2024数据.csv">下载（自定义文件名）</a>
```

对同源文件，`download` 属性触发下载而非打开；对浏览器不能直接预览的类型（zip 等），不写 `download` 也会下载。

## 5.6 图片：img 标签

```html
<img src="./assets/logo.png" alt="网站 Logo" width="120" height="40" loading="lazy" />
```

| 属性 | 作用 |
| --- | --- |
| `src` | 图片地址 |
| `alt` | **替代文本**：加载失败时显示，无障碍（accessibility）必需 |
| `width` / `height` | 建议显式声明，避免加载时页面抖动（CLS） |
| `loading="lazy"` | 懒加载：滚动到可视区域附近才下载 |

### 语义化图片：figure

```html
<figure>
  <img src="./chart.png" alt="2024 年学习时长曲线" />
  <figcaption>图 1：全年学习时长统计</figcaption>
</figure>
```

`<figcaption>` 把图片和说明文字绑定为一个整体，是正式文档中图片的标准写法。

### 行内图片

`<img>` 是行内元素，多个图片排一行；它与文字混排时默认贴齐基线，细节对齐交给 CSS。

## 5.7 图片格式怎么选

| 格式 | 特点 | 适用场景 |
| --- | --- | --- |
| **JPEG/JPG** | 有损压缩、体积小、不支持透明 | 照片、实拍图 |
| **PNG** | 无损、支持透明 | 图标、需要透明的图 |
| **WebP** | 同质量体积更小，现代浏览器全支持 | 网页图片的默认首选 |
| **SVG** | 矢量、无限缩放不失真、可用 CSS 控制 | Logo、图标、插画 |
| **GIF** | 动图、色彩有限 | 简单表情动图（渐被视频/WebP 取代） |

::: tip 选型口诀
照片用 JPEG/WebP，透明/图标用 PNG 或 SVG，Logo 图标优先 SVG。拿不准就 WebP。
:::

## 5.8 综合示例

```html
<style>
  .card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; max-width: 320px; font-family: sans-serif; }
  .card img { width: 100%; border-radius: 6px; }
  .card a { color: #2563eb; text-decoration: none; }
</style>

<div class="card">
  <img src="./images/cover.png" alt="课程封面" />
  <h3>开始学习 Git</h3>
  <p>版本控制是团队协作的基石。</p>
  <a href="./git-tutorial.html">进入教程 →</a>
</div>
```

::: info 关于示例图片
真实项目中图片通常来自相对路径（如 `./images/cover.png`）或 CDN 地址，替代文字 `alt` 永远必写。
:::

## 本章小结

- `<a>` 承担跳转：外链记得 `target="_blank"` 配 `rel="noopener noreferrer"`
- 路径以当前文件为基准：`./` 同级、`../` 上级、`/` 站点根
- 锚点用 `#id` 实现页内定位，目录与返回顶部的基础
- `<img>` 必写 `alt`，建议带 `width/height`，长列表图片加 `loading="lazy"`
- 格式选型：照片 JPEG/WebP、图标 SVG/PNG、默认优先 WebP
