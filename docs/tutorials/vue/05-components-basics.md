---
title: 组件基础
---

# 第 5 章 · 组件基础

**本章目标：**

- 理解组件的"拼装"本质与 props 传参
- 掌握 defineProps / defineEmits 的父子通信
- 学会组件的拆分思路

## 5.1 组件：可复用的 UI 单元

把"头像 + 名字 + 描述"的组合抽成组件，任何地方一行复用：

```vue
<!-- src/components/UserCard.vue -->
<script setup>
defineProps({
  name: { type: String, required: true },
  desc: { type: String, default: '暂无简介' },
});
</script>

<template>
  <div class="user-card">
    <div class="avatar">{{ name[0] }}</div>
    <div class="info">
      <p class="name">{{ name }}</p>
      <p class="desc">{{ desc }}</p>
    </div>
  </div>
</template>

<style scoped>
.user-card { display: flex; gap: 12px; padding: 12px; border: 1px solid #eee; border-radius: 8px; }
.avatar { width: 40px; height: 40px; border-radius: 50%; background: #42b883; color: #fff; display: flex; align-items: center; justify-content: center; }
.name { font-weight: 600; }
.desc { color: #888; font-size: 14px; }
</style>
```

```vue
<!-- 父组件使用 -->
<script setup>
import UserCard from '@/components/UserCard.vue';
</script>

<template>
  <UserCard name="Tom" desc="前端学习者" />
  <UserCard name="Lucy" />
</template>
```

**组件 = 自定义 HTML 标签**：像用 `<div>` 一样用 `<UserCard>`，数据从属性传入。

## 5.2 props：父传子

props（properties）是组件的"函数参数"：

```vue
<script setup>
// 声明：类型 + 必填 + 默认值
const props = defineProps({
  title: { type: String, required: true },
  count: { type: Number, default: 0 },
  tags: { type: Array, default: () => [] },   // 对象/数组默认值用工厂函数
});
</script>

<template>
  <h3>{{ title }}（{{ count }}）</h3>
  <span v-for="t in tags" :key="t">{{ t }}</span>
</template>
```

```vue
<template>
  <!-- 静态传参 -->
  <CourseCard title="Vue 教程" />
  <!-- 动态传参（传变量/数字/布尔必须加冒号） -->
  <CourseCard :title="name" :count="12" :tags="['前端']" />
</template>
```

::: warning 传参的类型陷阱
`count="12"`（无冒号）传的是**字符串 "12"**；`:count="12"` 才是数字。数字/布尔/数组/对象/变量一律加 `:`。
:::

**单向数据流**：props 是只读的——子组件不能改父组件传入的数据（改了 Vue 会警告）。要"向上反馈"，用 emit。

## 5.3 emit：子通知父

子组件用 `defineEmits` 声明事件，父组件用 `@事件名` 监听：

```vue
<!-- 子组件 CourseCard.vue -->
<script setup>
const emit = defineEmits(['select', 'remove']);

function handleClick() {
  emit('select', { id: 1, title: 'Vue 教程' });   // 第二个参数起是载荷
}
</script>

<template>
  <div @click="handleClick">卡片内容</div>
  <button @click="emit('remove')">删除</button>
</template>
```

```vue
<!-- 父组件 -->
<script setup>
import CourseCard from './CourseCard.vue';

function onSelect(course) {
  console.log('选中了', course.title);
}
</script>

<template>
  <CourseCard @select="onSelect" @remove="onRemove" />
</template>
```

数据流向总结：

```text
父 → 子：props（数据下行）
子 → 父：emit（事件上行 + 载荷）
父组件持有数据、子组件负责展示与交互——"状态上提"是 Vue 的默认姿势
```

## 5.4 v-model：表单双向绑定的本质

`v-model` 是"绑定值 + 监听变更"的语法糖：

```vue
<template>
  <!-- 等价于 :value="text" @input="text = $event.target.value" -->
  <input v-model="text" />
</template>
```

各元素对应关系：

```vue
<script setup>
import { ref } from 'vue';
const text = ref('');
const checked = ref(false);
const picked = ref('a');
const tags = ref([]);
</script>

<template>
  <input v-model="text" />                       <!-- 文本 -->
  <textarea v-model="text" />                    <!-- 多行文本 -->
  <input type="checkbox" v-model="checked" />    <!-- 布尔 -->
  <input type="radio" value="a" v-model="picked" />  <!-- 单选 -->
  <select v-model="picked">…</select>            <!-- 下拉 -->
</template>
```

修饰符：

```vue
<template>
  <input v-model.lazy="text" />    <!-- 失焦/回车才同步（不是每次输入） -->
  <input v-model.number="age" />   <!-- 自动转数字 -->
  <input v-model.trim="text" />    <!-- 去首尾空格 -->
</template>
```

## 5.5 组件上的 v-model（双向组件通信）

自定义组件也能支持 `v-model`（第 8 章表单组件实战会用到）：

```vue
<!-- 子组件 CustomInput.vue -->
<script setup>
const model = defineModel();   // Vue 3.4+ 一行搞定
</script>

<template>
  <input :value="model" @input="model = $event.target.value" />
</template>
```

```vue
<!-- 父组件 -->
<template>
  <CustomInput v-model="nickname" />
</template>
```

`defineModel()` 声明"本组件支持双向绑定"，父组件即可 `v-model` 之。

## 5.6 组件拆分的判断标准

什么时候该拆组件？

```text
① 重复出现 ≥ 2 次          → 抽组件（复用）
② 一段模板超过 ~80 行       → 抽组件（可读性）
③ 独立的状态与交互          → 抽组件（封装）
④ 名字说不清的代码块        → 抽组件（迫使你理清职责）
```

目录惯例：

```text
src/
├── components/     # 通用组件（Button、Modal、UserCard）
├── views/          # 页面级组件（路由对应）
└── App.vue
```

## 5.7 综合练习：课程卡片列表

```vue
<!-- components/CourseCard.vue -->
<script setup>
defineProps({
  title: { type: String, required: true },
  desc: { type: String, default: '' },
  done: { type: Boolean, default: false },
});

const emit = defineEmits(['toggle']);
</script>

<template>
  <div class="card" :class="{ done }">
    <h3 :class="{ strike: done }">{{ title }}</h3>
    <p>{{ desc }}</p>
    <button @click="emit('toggle')">{{ done ? '重学' : '完成' }}</button>
  </div>
</template>

<style scoped>
.card { padding: 12px; border: 1px solid #ddd; border-radius: 8px; }
.card.done { opacity: 0.6; }
.strike { text-decoration: line-through; }
</style>
```

```vue
<!-- App.vue -->
<script setup>
import { ref } from 'vue';
import CourseCard from '@/components/CourseCard.vue';

const courses = ref([
  { id: 1, title: 'HTML', desc: '结构层', done: true },
  { id: 2, title: 'Vue 3', desc: '框架层', done: false },
]);

function toggle(id) {
  const c = courses.value.find(c => c.id === id);
  c.done = !c.done;
}
</script>

<template>
  <CourseCard
    v-for="c in courses"
    :key="c.id"
    :title="c.title"
    :desc="c.desc"
    :done="c.done"
    @toggle="toggle(c.id)"
  />
</template>
```

数据在父组件（courses）、展示在子组件（CourseCard）、事件回父（toggle）——标准的单向数据流拼装。

## 本章小结

- 组件 = 自定义标签；defineProps 声明（类型/必填/默认值）
- 动态传值加 `:`；props 只读（单向数据流）
- defineEmits + `@事件` 上行通信；v-model 是双向的语法糖（defineModel）
- 拆分信号：重复、超长、独立状态、说不清职责
