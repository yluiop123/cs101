---
title: 工程化与综合实战
---

# 第 12 章 · 工程化与综合实战

**本章目标：**

- 掌握 Vue 项目的工程化规范（目录/命名/请求层）
- 综合运用全教程知识完成"任务看板"项目
- 沉淀一份 Vue 项目自查清单

## 12.1 工程化约定

**目录结构**（中大型项目的成熟形态）：

```text
src/
├── api/            # 请求层（纯函数，一个模块一个资源）
├── components/     # 通用组件
├── composables/    # 组合式函数
├── stores/         # Pinia store
├── router/         # 路由
├── views/          # 页面组件
├── assets/         # 静态资源
└── main.js
```

**命名规范**：

```text
组件文件   PascalCase    UserCard.vue
组合式函数 camelCase      useAuth.js
store     useXxxStore    useUserStore（文件 user.js）
常量      UPPER_CASE    MAX_TODO_COUNT
```

**请求层与 UI 解耦**（JS 教程第 12 章"api 层"思想的框架版）：

```js
// src/api/todo.js —— 只有网络逻辑，不碰组件
const BASE = import.meta.env.VITE_API_BASE;

export async function fetchTodos() {
  const res = await fetch(`${BASE}/todos`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createTodo(text) {
  const res = await fetch(`${BASE}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
```

## 12.2 项目目标：任务看板

功能清单：

```text
① 三个泳道：待办 / 进行中 / 已完成
② 任务卡片：拖拽换泳道、点击编辑
③ 数据持久化：localStorage（useLocalStorage）
④ 全局状态：看板数据放 Pinia（跨组件共享）
⑤ 拖拽提示与空状态
```

技术选型对号入座：state → Pinia store，持久化 → useLocalStorage，拖拽 → 原生 drag 事件 + emit，样式 → scoped CSS。

## 12.3 store：看板数据层

```js
// src/stores/board.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useBoardStore = defineStore('board', () => {
  const columns = ref([
    { key: 'todo', title: '待办', tasks: [] },
    { key: 'doing', title: '进行中', tasks: [] },
    { key: 'done', title: '已完成', tasks: [] },
  ]);

  let nextId = 1;

  const total = computed(() =>
    columns.value.reduce((n, col) => n + col.tasks.length, 0)
  );

  function addTask(columnKey, text) {
    if (!text.trim()) return;
    const col = columns.value.find(c => c.key === columnKey);
    col.tasks.push({ id: nextId++, text: text.trim() });
  }

  function removeTask(taskId) {
    columns.value.forEach(col => {
      col.tasks = col.tasks.filter(t => t.id !== taskId);
    });
  }

  function moveTask(taskId, toKey) {
    let task = null;
    columns.value.forEach(col => {
      const found = col.tasks.find(t => t.id === taskId);
      if (found) task = found;
    });
    if (!task) return;
    removeTask(taskId);
    const to = columns.value.find(c => c.key === toKey);
    to.tasks.push(task);
  }

  return { columns, total, addTask, removeTask, moveTask };
});
```

## 12.4 组件：泳道与卡片

```vue
<!-- components/TaskCard.vue -->
<script setup>
const props = defineProps({
  task: { type: Object, required: true },
  draggable: { type: Boolean, default: true },
});

const emit = defineEmits(['remove', 'dragstart']);
</script>

<template>
  <div
    class="task"
    :draggable="draggable"
    @dragstart="emit('dragstart', task.id)"
  >
    <span>{{ task.text }}</span>
    <button class="del" @click="emit('remove')">✕</button>
  </div>
</template>

<style scoped>
.task { display: flex; justify-content: space-between; align-items: center; gap: 8px;
        background: #fff; border: 1px solid #e2e8f0; border-radius: 6px;
        padding: 8px 10px; margin-bottom: 8px; cursor: grab; }
.task:active { cursor: grabbing; }
.del { border: 0; background: none; color: #94a3b8; cursor: pointer; }
.del:hover { color: #e11d48; }
</style>
```

```vue
<!-- components/TaskColumn.vue -->
<script setup>
import TaskCard from './TaskCard.vue';

const props = defineProps({
  column: { type: Object, required: true },
});

const emit = defineEmits(['add', 'remove', 'dragstart', 'drop']);

const columnKeys = ['todo', 'doing', 'done'];

function onAdd(event) {
  const input = event.target.previousElementSibling;
  emit('add', props.column.key, input.value);
  input.value = '';
}
</script>

<template>
  <section
    class="column"
    @dragover.prevent
    @drop.prevent="emit('drop', $event, column.key)"
  >
    <header>
      <h3>{{ column.title }}</h3>
      <span class="count">{{ column.tasks.length }}</span>
    </header>

    <TaskCard
      v-for="task in column.tasks"
      :key="task.id"
      :task="task"
      @remove="emit('remove', task.id)"
      @dragstart="emit('dragstart', $event, task.id)"
    />
    <p v-if="column.tasks.length === 0" class="empty">拖拽卡片到这里</p>

    <form @submit.prevent="onAdd">
      <input placeholder="新任务…" />
      <button type="submit">添加</button>
    </form>
  </section>
</template>
```

## 12.5 页面：组装与拖拽逻辑

```vue
<!-- views/BoardView.vue -->
<script setup>
import { watch } from 'vue';
import TaskColumn from '@/components/TaskColumn.vue';
import { useBoardStore } from '@/stores/board';
import { useLocalStorage } from '@/composables/useLocalStorage';

const board = useBoardStore();
const saved = useLocalStorage('cs101-board', null);

// 启动时恢复存档
if (saved.value) board.columns = saved.value;

// 数据一变就存（watch 放页面层的简单版；讲究些可放进 store）
watch(
  () => board.columns,
  (val) => { saved.value = val; },
  { deep: true }
);

let draggingId = null;

function onDragStart(event, taskId) {
  draggingId = taskId;
}

function onDrop(event, toKey) {
  if (draggingId !== null) {
    board.moveTask(draggingId, toKey);
    draggingId = null;
  }
}
</script>

<template>
  <div class="board">
    <TaskColumn
      v-for="col in board.columns"
      :key="col.key"
      :column="col"
      @add="board.addTask"
      @remove="board.removeTask"
      @dragstart="onDragStart"
      @drop="onDrop"
    />
  </div>
  <p class="total">共 {{ board.total }} 个任务</p>
</template>

<style scoped>
.board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 24px; }
.column { background: #f1f5f9; border-radius: 8px; padding: 12px; min-height: 300px; }
.count { color: #64748b; font-size: 13px; }
.empty { color: #94a3b8; font-size: 13px; text-align: center; padding: 24px 0; }
.total { text-align: center; color: #475569; }
</style>
```

## 12.6 原生拖拽要点

```text
可拖动元素：draggable="true" + @dragstart 记下 id
目标区域：@dragover.prevent（必须！否则 drop 不触发）+ @drop.prevent 处理
跨组件传"拖了谁"：页面层用临时变量 draggingId 中转（比事件总线简单）
```

生产级拖拽（跨浏览器细节、移动端、动画）用 `vuedraggable` 或 `@dnd-kit` 类库——理解原生原理后再上库。

## 12.7 Vue 项目自查清单

- [ ] 数据流向清晰：store 管全局、组件 ref 管局部、props 下行 emit 上行
- [ ] 列表都有稳定 :key（不用 index）
- [ ] computed 管派生、watch 管副作用、模板里没有复杂表达式
- [ ] 请求在 api 层，组件不直接写 fetch URL
- [ ] mounted 里借的全局资源，unmounted 里归还
- [ ] 提交前 build 通过；DevTools 检查无警告

## 12.8 下一步

Vue 主线毕业。两条延伸路线：

- 换生态对比：[React 教程](/tutorials/react/)（ hooks 心智与组合式函数异同）
- 前端之外：[Node.js 教程](/tutorials/nodejs/)第 10 章给看板补真实后端

## 本章小结

- 工程化：分层目录、命名规范、api 层与 UI 解耦
- 看板 = Pinia store（数据与操作）+ 泳道/卡片组件（展示）+ 页面组装（拖拽中转）
- 原生拖拽三要素：draggable / dragover.prevent / drop.prevent
- 自查清单是交付质量的最后一关
