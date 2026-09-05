---
title: 多媒体与 iframe
---

# 第 6 章 · 多媒体与 iframe

**本章目标：**

- 掌握 `<audio>` / `<video>` 的属性体系
- 理解 `<source>` 多格式兼容机制
- 会用 `<iframe>` 嵌入第三方内容并了解其代价

## 6.1 视频播放：video

在 HTML5 之前，网页播放视频要依赖 Flash 插件；如今 `<video>` 是原生标准：

```html
<video src="./media/demo.mp4" controls width="480" poster="./media/cover.jpg">
  您的浏览器不支持 video 标签。
</video>
```

常用属性：

| 属性 | 作用 |
| --- | --- |
| `controls` | 显示播放器控件（进度条/音量/全屏） |
| `autoplay` | 自动播放（浏览器普遍要求**配合 muted** 才生效） |
| `muted` | 静音 |
| `loop` | 循环播放 |
| `preload` | 预加载策略：`none` / `metadata` / `auto` |
| `poster` | 视频加载前显示的封面图 |
| `width` / `height` | 尺寸 |

::: tip autoplay 的现实规则
浏览器为节省流量与打扰用户，规定**自动播放必须静音**。`autoplay` 不加 `muted`，Chrome/Edge 会直接拒绝播放。首屏宣传视频的标准写法就是 `autoplay muted loop playsinline`。
:::

## 6.2 音频播放：audio

```html
<audio src="./media/podcast.mp3" controls loop></audio>
```

属性与 video 基本一致（无 poster/width——音频没有画面）。`controls` 缺省时音频"存在但不可见"，通常配合自定义播放器 UI 使用。

## 6.3 多格式兼容：source

不同浏览器支持的编码不同，用 `<source>` 提供多份文件，浏览器自上而下选第一个能播的：

```html
<video controls width="480">
  <source src="./media/demo.webm" type="video/webm" />
  <source src="./media/demo.mp4" type="video/mp4" />
  您的浏览器不支持 video 标签。
</video>
```

::: info 今天的现实
WebM/AV1 时代，`mp4 (H.264)` 已是事实通用格式，多数项目一份 mp4 即可；`source` 机制更多用于音频与渐进增强场景。
:::

## 6.4 字幕：track

```html
<video controls src="./media/demo.mp4">
  <track src="./media/subs-zh.vtt" kind="subtitles" srclang="zh" label="中文" default />
</video>
```

字幕用 WebVTT（`.vtt`）格式，`kind` 还支持章节（chapters）、描述（descriptions）等。

## 6.5 内嵌窗口：iframe

`<iframe>`（inline frame）在当前页面里嵌一个**独立的浏览上下文**——相当于"页中页"：

```html
<iframe
  src="https://www.youtube.com/embed/xxxx"
  width="560"
  height="315"
  title="视频标题"
  loading="lazy"
  allowfullscreen
></iframe>
```

典型用途：嵌入视频（B 站/YouTube）、地图、第三方表单、在线文档。

::: tip 获取嵌入代码
B 站视频下方"分享"→"嵌入代码"会直接给出可复制的 `<iframe>` 片段，粘贴后按需调整宽高即可。
:::

```html
<!-- srcdoc：直接内联 HTML，无需外部文件（演示嵌套最方便的方式） -->
<iframe
  srcdoc="<h2>我是被嵌入的子页面</h2>"
  width="320"
  height="110"
  title="嵌套示例"
></iframe>
```

::: info srcdoc 与 src
`srcdoc` 适合演示与模板场景；真实嵌入第三方内容用 `src` 指向 URL。
:::

## 6.6 iframe 的代价与注意点

1. **性能**：iframe 是完整文档，加载成本高——务必加 `loading="lazy"`
2. **安全**：嵌入的页面运行在独立上下文，恶意页面可能利用，第三方嵌入建议加 `sandbox` 属性限制权限
3. **样式隔离**：内外样式**完全隔离**，父页面无法直接美化子页面内容
4. **可访问性**：必须提供 `title` 说明 iframe 用途

## 本章小结

- `<video>`/`<audio>` + `controls` 即可用；自动播放必须配 `muted`
- `<source>` 提供多格式回退，兼容性保险
- `<iframe>` 嵌入第三方内容，加 `loading="lazy"`、`title`，慎用并注意安全
- 多媒体标签的样式（尺寸、圆角、响应式）都交给 CSS 处理
