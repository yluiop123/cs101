---
title: 组件进阶
---

# 第 6 章 · 组件进阶

**本章目标：**

- 掌握插槽（slot）的内容分发机制
- 理解 provide/inject 的跨层级传递
- 学会动态组件与异步组件

## 6.1 插槽：把"内容"传给组件

props 传数据，**slot 传模板片段**——弹窗、卡片这类"外壳固定、内容多变"的组件全靠它：

```vue
<!-- 子组件 BaseCard.vue：外壳 -->
<template>
  <div class="card">
    <header><slot name="header">默认标题</slot></header>
    <main><slot /></main>              <!-- 匿名插槽：默认出口 -->
    <footer><slot name="footer" /></footer>
  </div>
</template>
```

```vue
<!-- 父组件：往插槽里"塞"内容 -->
<template>
  <BaseCard>
    <template #header><h3>课程详情</h3></template>

    <p>这里是匿名插槽的内容（不用 template 包裹也行）</p>

    <template #footer>
      <button>收藏</button>
      <button>分享</button>
    </template>
  </BaseCard>
</template>
```

```text
#header 是 v-slot:header 的缩写
不指定 name 的插槽是默认插槽（#default）
插槽没被填充时，显示"后备内容"（slot 标签里的默认值）
```

## 6.2 作用域插槽：子组件的数据传给插槽内容

有时插槽内容需要用**子组件内部的数据**（如列表项）——作用域插槽（scoped slot）：

```vue
<!-- 子组件 TodoList.vue：把每项数据"递"出去 -->
<script setup>
defineProps({ todos: Array });
</script>

<template>
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      <slot :item="todo" :done="todo.done" />
    </li>
  </ul>
</template>
```

```vue
<!-- 父组件：用 v-slot 接收 -->
<template>
  <TodoList :todos="list">
    <template #default="{ item, done }">
      <span :class="{ strike: done }">{{ item.text }}</span>
    </template>
  </TodoList>
</template>
```

心智模型：**普通插槽是"父传模板"，作用域插槽是"子递数据、父决定怎么渲染"**——表格列、树形组件的自定义渲染都是这个模式。

## 6.3 provide / inject：跨层级传递

深层嵌套时逐层传 props 很痛苦：

```text
App → Layout → Sidebar → Menu → MenuItem   （title 要传 4 层！）
```

**provide/inject**：祖先"提供"，任意后代"注入"，中间层完全透明：

```vue
<!-- 祖先：App.vue -->
<script setup>
import { ref, provide } from 'vue';

const theme = ref('dark');
provide('theme', theme);              // 提供响应式数据（传 ref 本身）
</script>
```

```vue
<!-- 任意后代：MenuItem.vue -->
<script setup>
import { inject } from 'vue';

const theme = inject('theme');        // 拿到同一个 ref
// theme.value 读写均响应式
</script>
```

::: warning 注入 key 最好用常量/文件管理
字符串 key 'theme' 散落多处容易拼错——工程里把 key 收进一个文件（如 `src/keys.js`），或直接用 Symbol。
:::

## 6.4 provide/inject 的适用边界

```text
props/emit：父子直系（默认选择）
provide/inject：深层传递（主题、当前用户、语言等"全局上下文"）
Pinia（第 11 章）：跨组件共享的"业务状态"
```

原则：provide 的应该是**相对稳定的上下文**，不是随便什么业务数据——滥用 provide 会让数据流不可追踪（"这数据哪来的？"）。

## 6.5 动态组件

`<component :is>` 按变量切换组件——标签页的最小实现：

```vue
<script setup>
import { ref, shallowRef } from 'vue';
import TabHome from './TabHome.vue';
import TabProfile from './TabProfile.vue';

const tabs = { home: TabHome, profile: TabProfile };
const active = shallowRef(TabHome);   // 组件对象用 shallowRef（无需深层响应式）
</script>

<template>
  <button @click="active = tabs.home">首页</button>
  <button @click="active = tabs.profile">我的</button>
  <component :is="active" />
</template>
```

## 6.6 异步组件：用到才加载

```vue
<script setup>
import { defineAsyncComponent } from 'vue';

// 首屏不加载，真正渲染时才请求该组件的代码（配合 Vite 自动分包）
const HeavyChart = defineAsyncComponent(() =>
  import('@/components/HeavyChart.vue')
);
</script>

<template>
  <HeavyChart v-if="showChart" />
</template>
```

这正是 [Vite 教程第 5 章](/tutorials/vite/)动态 import 分包的组件级应用——重型组件懒加载。

## 6.7 综合练习：通用弹窗组件

```vue
<!-- components/BaseModal.vue -->
<script setup>
defineProps({
  title: { type: String, default: '' },
  open: { type: Boolean, required: true },
});

const emit = defineEmits(['close']);
</script>

<template>
  <div v-if="open" class="mask" @click.self="emit('close')">
    <div class="dialog">
      <header>
        <h3>{{ title }}</h3>
        <button @click="emit('close')">×</button>
      </header>
      <div class="body"><slot /></div>          <!-- 内容由使用者填充 -->
      <footer><slot name="actions" /></footer>   <!-- 按钮区也可自定义 -->
    </div>
  </div>
</template>

<style scoped>
.mask { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; }
.dialog { background: #fff; border-radius: 8px; min-width: 320px; }
header { display: flex; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #eee; }
.body { padding: 16px; }
footer { padding: 12px 16px; text-align: right; }
</style>
```

```vue
<!-- 使用方 -->
<template>
  <button @click="open = true">打开弹窗</button>
  <BaseModal title="确认删除" :open="open" @close="open = false">
    <p>删除后不可恢复，确定吗？</p>
    <template #actions>
      <button @click="open = false">取消</button>
      <button @click="doDelete">删除</button>
    </template>
  </BaseModal>
</template>
```

外壳（遮罩/布局/关闭逻辑）写一次，内容与按钮随场景定制——插槽价值的最直观体现。

## 本章小结

- slot 分发内容；具名插槽 `#name`；后备内容做默认
- 作用域插槽：子递数据、父定渲染（表格/树的通用模式）
- provide/inject 跨层级传上下文；业务共享状态交给 Pinia
- `component :is` 动态切换；defineAsyncComponent 懒加载重型组件
