---
title: 工程化综合实战
---

# 第 12 章 · 工程化综合实战

**本章目标：**

- 掌握 Angular 项目的工程化规范与 CLI 工作流
- 综合运用全教程知识完成"任务看板"
- 沉淀 Angular 项目自查清单，三框架视野收束

## 12.1 工程化规范

**目录结构**（CLI 风格 + 按领域分组的成熟形态）：

```text
src/app/
├── core/
│   ├── services/          # 全局单例服务（auth、config、toast）
│   ├── guards/            # 路由守卫
│   └── interceptors/      # HTTP 拦截器
├── features/              # 按功能域分组的页面模块
│   ├── board/
│   │   ├── board.component.ts / .html / .css
│   │   ├── board.service.ts
│   │   └── components/task-card/
│   └── login/
├── shared/                # 通用组件与工具
│   ├── components/
│   └── pipes/
├── app.routes.ts
├── app.config.ts
└── app.component.ts
```

**命名规范**（CLI 已内化，跟 ng generate 走即可）：

```text
组件   xxx.component.ts    服务   xxx.service.ts
守卫   xxx.guard.ts        管道   xxx.pipe.ts
测试   xxx.component.spec.ts
```

**CLI 工作流**：

```bash
ng generate component features/board/components/task-card   # 生成组件全家
ng generate service core/services/board                     # 生成服务
ng test          # 跑测试
ng build         # 构建（产物到 dist/）
```

**约定即文档**：Angular 项目无论谁写，结构长得都一样——这就是强约定工程的价值。

## 12.2 项目目标：任务看板（Angular 版）

与 Vue/React 版同需求，Angular 姿态实现：

```text
① 三泳道（待办/进行中/已完成），拖拽换道
② 服务层管理看板数据（DI 全局单例 + signal）
③ 任务卡片组件（@Input/@Output）
④ localStorage 持久化（服务内 effect）
⑤ ng build + 自查清单收尾
```

## 12.3 服务：看板数据层

```ts
// features/board/board.service.ts
import { Injectable, signal, computed, effect } from '@angular/core';

export interface Task {
  id: number;
  text: string;
}

export interface Column {
  key: string;
  title: string;
  tasks: Task[];
}

@Injectable({ providedIn: 'root' })
export class BoardService {
  private nextId = 1;

  columns = signal<Column[]>(this.load());

  total = computed(() =>
    this.columns().reduce((n, col) => n + col.tasks.length, 0)
  );

  // 持久化：columns 变化自动存
  constructor() {
    effect(() => {
      localStorage.setItem('cs101-ng-board', JSON.stringify(this.columns()));
    });
  }

  private load(): Column[] {
    try {
      const raw = localStorage.getItem('cs101-ng-board');
      if (raw) return JSON.parse(raw);
    } catch { /* 损坏数据当空看板 */ }
    return [
      { key: 'todo', title: '待办', tasks: [] },
      { key: 'doing', title: '进行中', tasks: [] },
      { key: 'done', title: '已完成', tasks: [] },
    ];
  }

  addTask(columnKey: string, text: string) {
    if (!text.trim()) return;
    this.columns.update(cols =>
      cols.map(col =>
        col.key === columnKey
          ? { ...col, tasks: [...col.tasks, { id: this.nextId++, text: text.trim() }] }
          : col
      )
    );
  }

  removeTask(taskId: number) {
    this.columns.update(cols =>
      cols.map(col => ({ ...col, tasks: col.tasks.filter(t => t.id !== taskId) }))
    );
  }

  moveTask(taskId: number, toKey: string) {
    let task: Task | null = null;
    for (const col of this.columns()) {
      const found = col.tasks.find(t => t.id === taskId);
      if (found) task = found;
    }
    if (!task) return;

    this.removeTask(taskId);
    this.columns.update(cols =>
      cols.map(col => (col.key === toKey ? { ...col, tasks: [...col.tasks, task!] } : col))
    );
  }
}
```

signal + effect 实现自动持久化（对照 Vue 的 watch 版、React 的 persist 中间件版——三框架同一需求的三种语法）。

## 12.4 组件：卡片与泳道

```ts
// features/board/components/task-card/task-card.component.ts
import { Component, input, output } from '@angular/core';
import { Task } from '../../board.service';

@Component({
  selector: 'app-task-card',
  standalone: true,
  template: `
    <div class="task" draggable="true" (dragstart)="onDragStart($event)">
      <span>{{ task().text }}</span>
      <button (click)="removed.emit(task().id)">✕</button>
    </div>
  `,
  styles: [`
    .task { display: flex; justify-content: space-between; align-items: center;
            background: #fff; border: 1px solid #e2e8f0; border-radius: 6px;
            padding: 8px 10px; margin-bottom: 8px; cursor: grab; }
    button { border: 0; background: none; color: #94a3b8; cursor: pointer; }
  `],
})
export class TaskCardComponent {
  task = input.required<Task>();
  removed = output<number>();

  onDragStart(event: DragEvent) {
    // 用 DataTransfer 传递拖拽数据（Angular 推荐方式，替代"全局中转变量"）
    event.dataTransfer?.setData('text/plain', String(this.task().id));
  }
}
```

```ts
// features/board/components/task-column/task-column.component.ts
import { Component, input, output } from '@angular/core';
import { Column } from '../../board.service';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-task-column',
  standalone: true,
  imports: [TaskCardComponent],
  template: `
    <section
      class="column"
      (dragover)="$event.preventDefault()"
      (drop)="onDrop($event)"
    >
      <header>
        <h3>{{ column().title }}</h3>
        <span class="count">{{ column().tasks.length }}</span>
      </header>

      @for (task of column().tasks; track task.id) {
        <app-task-card [task]="task" (removed)="removed.emit($event)" />
      } @empty {
        <p class="empty">拖拽卡片到这里</p>
      }

      <form (submit)="onAdd($event)">
        <input placeholder="新任务…" />
        <button type="submit">添加</button>
      </form>
    </section>
  `,
})
export class TaskColumnComponent {
  column = input.required<Column>();
  taskAdded = output<{ key: string; text: string }>();
  taskRemoved = output<number>();
  taskDropped = output<{ taskId: number; toKey: string }>();

  onAdd(event: Event) {
    event.preventDefault();
    const input = (event.target as HTMLFormElement).querySelector('input');
    this.taskAdded.emit({ key: this.column().key, text: input?.value ?? '' });
    if (input) input.value = '';
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const taskId = Number(event.dataTransfer?.getData('text/plain'));
    if (taskId) {
      this.taskDropped.emit({ taskId, toKey: this.column().key });
    }
  }
}
```

拖拽数据传递用标准 **DataTransfer**（Angular 社区惯例）——比"全局中转变量"更规范，跨组件无耦合。

## 12.5 页面：组装

```ts
// features/board/board.component.ts
import { Component, inject } from '@angular/core';
import { BoardService } from './board.service';
import { TaskColumnComponent } from './components/task-column/task-column.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [TaskColumnComponent],
  template: `
    <div class="board">
      @for (col of board.columns(); track col.key) {
        <app-task-column
          [column]="col"
          (taskAdded)="board.addTask($event.key, $event.text)"
          (taskRemoved)="board.removeTask($event)"
          (taskDropped)="board.moveTask($event.taskId, $event.toKey)"
        />
      }
    </div>
    <p class="total">共 {{ board.total() }} 个任务</p>
  `,
  styles: [`
    .board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 24px; }
    .column { background: #f1f5f9; border-radius: 8px; padding: 12px; min-height: 300px; }
  `],
})
export class BoardComponent {
  board = inject(BoardService);
}
```

事件层层上抛到页面，页面直接转调 service 方法——**组件树薄、服务层厚**的 Angular 姿态。

## 12.6 三框架实现对照（终章总结）

| 关注点 | Vue | React | Angular |
| --- | --- | --- | --- |
| 组件文件 | SFC 三段合一 | .jsx + 样式分离 | ts/html/css 三件套 |
| 状态（局部） | ref | useState | signal |
| 状态（全局） | Pinia | Zustand | root Service |
| 逻辑复用 | 组合式函数 | 自定义 Hook | Service + DI |
| 子→父 | emit | 回调 props | output |
| 列表 | v-for :key | map + key | @for track |
| 条件 | v-if | && / 三元 | @if |
| 双向绑定 | v-model | value+onChange | [(ngModel)] |
| 持久化 | watch | persist 中间件 | effect |
| 路由 | vue-router | react-router | @angular/router |
| HTTP | fetch | fetch | HttpClient |

**三套语法，一个思维**：声明式渲染、组件树、单向数据流、状态分层——学到的是"框架无关的前端工程能力"。

## 12.7 Angular 项目自查清单

- [ ] 服务职责单一，providedIn root 默认全局
- [ ] signal 状态 + computed 派生；模板保持"薄"
- [ ] @for 必带 track；@Input.required 声明必填
- [ ] ngOnInit/ ngOnDestroy 成对借还资源
- [ ] HTTP 在 api 层，Interceptor 统一鉴权与错误
- [ ] 核心服务有 spec 测试；ng build 通过
- [ ] 路由懒加载（loadComponent）

## 12.8 课程体系收束

至此，三大前端框架（Vue/React/Angular）全部完成。回顾整个教程路径：

```text
基础：HTML → CSS → JavaScript → TypeScript
工程：Node.js → Vite → Tailwind CSS
框架：Vue 3 → React → Angular
```

后续可选扩展（教程中心"规划中"区）：后端语言、数据库、运维部署——前后端全栈闭环。

## 本章小结

- core/features/shared 分层 + CLI 命名约定 = 可维护的工程骨架
- 看板服务：signal 状态 + effect 持久化；拖拽用 DataTransfer 标准传递
- 三框架对照表：语法各表、思维同一——已具备跨框架迁移能力
- 自查清单 + 测试 + 构建，工程闭环
