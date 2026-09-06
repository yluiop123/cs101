---
title: 模板语法
---

# 第 2 章 · 模板语法

**本章目标：**

- 掌握插值与两大指令：v-bind（属性绑定）、v-on（事件绑定）
- 熟练绑定 class 与 style
- 理解指令（directive）的通用语法

## 2.1 插值：文本绑定

双大括号（mustache）把数据渲染成文本：

```vue
<script setup>
import { ref } from 'vue';
const name = ref('Vue');
const raw = '<b>加粗</b>';
</script>

<template>
  <p>你好，{{ name }}</p>
  <p>{{ 1 + 1 }}</p>
  <p>{{ skills_ok ? '通过' : '未通过' }}</p>   <!-- 简单表达式可以 -->
  <p v-html="raw"></p>                        <!-- 会解析 HTML -->
</template>
```

::: danger v-html 有 XSS 风险
插值 `{{ }}` 自动转义（安全）；`v-html` 原样插入 HTML——**内容含用户输入时绝不能用**，否则脚本注入。只在渲染可信内容时使用。
:::

## 2.2 v-bind：属性绑定

插值不能用在 HTML 属性里——属性绑定用 `v-bind`（缩写 `:`）：

```vue
<script setup>
import { ref } from 'vue';
const imgUrl = ref('/logo.png');
const isDisabled = ref(true);
const id = ref('main-box');
</script>

<template>
  <!-- 完整写法 -->
  <img v-bind:src="imgUrl" alt="logo" />
  <!-- 缩写：冒号（90% 场景用缩写） -->
  <img :src="imgUrl" alt="logo" />
  <div :id="id">动态 id</div>
  <button :disabled="isDisabled">禁用按钮</button>
  <a :href="`https://vuejs.org/?q=${name}`">模板字符串也行</a>
</template>
```

区分记忆：

```text
:src="imgUrl"     → 表达式，取变量 imgUrl 的值
src="imgUrl"      → 字符串，值就是 "imgUrl" 四个字母
```

## 2.3 v-on：事件绑定

`v-on`（缩写 `@`）绑定事件：

```vue
<script setup>
import { ref } from 'vue';
const count = ref(0);

function increment() {
  count.value++;
}

function submit(event) {
  console.log(event);          // 原生事件对象自动传入
}
</script>

<template>
  <button @click="count++">内联语句：{{ count }}</button>
  <button @click="increment">方法名</button>
  <button @click="increment($event)">方法 + 传参</button>
  <form @submit.prevent="submit">阻止默认行为</form>
</template>
```

**事件修饰符**——`.prevent`、`.stop` 等，替代手写 `preventDefault/stopPropagation`：

```vue
<template>
  <a href="https://vuejs.org" @click.prevent="track">跳转前先埋点（不跳转）</a>
  <div @click.stop="inner">阻止冒泡</div>
  <form @submit.prevent>纯阻止默认</form>
  <button @click.once="init">只触发一次</button>
  <input @keyup.enter="search">回车键触发</input>
</template>
```

常用修饰符：`.prevent`（阻止默认）、`.stop`（停止冒泡）、`.once`（一次）、`.enter` / `.esc`（按键）、`.self`（仅自身）。

## 2.4 class 绑定：对象与数组语法

Vue 的拿手好戏——动态 class 用**对象/数组语法**表达：

```vue
<script setup>
import { ref } from 'vue';
const isActive = ref(true);
const hasError = ref(false);
const activeClass = ref('active');
</script>

<template>
  <!-- 对象语法：键=类名，值=是否启用 -->
  <div :class="{ active: isActive, 'text-danger': hasError }">…</div>

  <!-- 数组语法：多个类名合并 -->
  <div :class="[activeClass, { disabled: isDisabled }]">…</div>

  <!-- 与静态 class 共存，自动合并 -->
  <div class="card" :class="{ active: isActive }">…</div>
</template>
```

条件样式从此不碰 `classList.toggle`。style 内联同理：

```vue
<template>
  <div :style="{ color: textColor, fontSize: size + 'px' }">…</div>
</template>
```

::: tip 配合 Tailwind 更香
[Tailwind CSS 教程第 7 章](/tutorials/tailwind/)的"映射表 + 条件选类"在 Vue 里就是 `:class` 对象语法——`:class="statusClass[status]"`。
:::

## 2.5 指令的通用语法

`v-` 开头的特殊属性统称**指令（directive）**，核心家族：

| 指令 | 作用 | 缩写 |
| --- | --- | --- |
| `v-bind` | 绑定属性 | `:` |
| `v-on` | 绑定事件 | `@` |
| `v-if` / `v-show` | 条件渲染 | — |
| `v-for` | 列表渲染 | — |
| `v-model` | 表单双向绑定 | — |
| `v-html` | 渲染 HTML | — |

前四种本章之外（第 7、8 章细讲），本章掌握 `v-bind` 与 `v-on` 就能写大半界面。

## 2.6 模板引用：拿真实的 DOM

偶尔需要直接操作 DOM（聚焦输入框、测量尺寸）——模板引用（template ref）：

```vue
<script setup>
import { ref, onMounted } from 'vue';

const inputEl = ref(null);      // 变量名 = 模板里的 ref 名

onMounted(() => {
  inputEl.value.focus();        // 拿到真实 DOM 元素
});
</script>

<template>
  <input ref="inputEl" placeholder="自动聚焦" />
</template>
```

原则：**数据驱动优先，template ref 是最后手段**——能用响应式数据表达的，绝不手摸 DOM。

## 2.7 综合练习：点赞卡片

```vue
<script setup>
import { ref } from 'vue';

const likes = ref(0);
const liked = ref(false);

function toggle() {
  liked.value = !liked.value;
  likes.value += liked.value ? 1 : -1;
}
</script>

<template>
  <div class="card">
    <h3>Vue 3 教程</h3>
    <button
      :class="liked ? 'btn-liked' : 'btn'"
      @click="toggle"
    >
      {{ liked ? '❤️ 已赞' : '🤍 点赞' }} {{ likes }}
    </button>
  </div>
</template>

<style scoped>
.btn { background: #f0f0f0; }
.btn-liked { background: #ffe4e6; color: #e11d48; }
.card { padding: 16px; border: 1px solid #eee; border-radius: 8px; }
</style>
```

一个卡片用齐了：插值、`@click`、`:class` 条件、`ref` 状态——模板语法的最小闭环。

## 本章小结

- `{{ }}` 插值（自动转义）；v-html 慎用（XSS）
- `:` 绑属性、`@` 绑事件；修饰符 `.prevent/.stop/.once/.enter`
- `:class` 对象/数组语法是条件样式的标准解
- template ref 兜底 DOM 操作，数据驱动优先
