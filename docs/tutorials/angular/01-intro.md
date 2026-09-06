---
title: 初识 Angular
---

# 第 1 章 · 初识 Angular

**本章目标：**

- 理解 Angular 的"大而全"工程哲学
- 用 CLI 创建第一个项目并跑通
- 认识 standalone 组件与 signal 的基本样貌

## 1.1 Angular 的定位

学过 Vue/React 再看 Angular，最大差异是**哲学**：

```text
Vue/React：库/框架只管 UI，路由、状态、请求自行组合（自由，但要选型）
Angular：全家桶——路由、HTTP、表单、DI、测试、i18n 全部内置（约束，但开箱即用）
```

| 维度 | Angular |
| --- | --- |
| 开发方 | Google |
| 语言 | **强制 TypeScript** |
| 风格 | 企业级、强约定、命令式 CLI |
| 典型场景 | 大型企业系统、银行后台、外企项目 |

Angular 的强约束是一把双刃剑：新手少踩选型坑，但"必须按它的方式来"。本教程用现代 Angular（v17+）的推荐写法：**standalone 组件 + signals + 新控制流**。

## 1.2 环境与创建项目

```bash
npm install -g @angular/cli     # 全局安装 CLI
ng version                      # 验证

ng new my-angular-app           # 创建项目
# 交互选项：SSR? → No（本教程纯前端）
cd my-angular-app
ng serve --open                 # 启动 dev 服务器并打开浏览器（默认 4200）
```

Angular CLI 是"重装武器"：创建/生成/构建/测试一条龙（`ng generate component xxx` 直接生成模板文件组）。

```text
src/
├── main.ts             # 入口
├── index.html          # 挂载点 <app-root>
├── styles.css          # 全局样式
└── app/
    ├── app.component.ts    # 根组件（ts/html/css 三件套分离）
    ├── app.component.html
    └── app.component.css
```

::: info 与 Vue SFC 的差异
Vue 把三段合进一个 .vue 文件；Angular **按文件类型分离**（component.ts / .html / .css）——文件多但职责清晰，IDE 跳转友好。新版本也支持单文件内联，企业惯例仍是三件套。

:::

## 1.3 第一个组件：standalone 模式

现代 Angular（v17+）默认 **standalone 组件**——不再需要 NgModule 模块包装，组件直接声明直接用：

```ts
// src/app/hello.component.ts
import { Component } from '@angular/core';
import { signal } from '@angular/core';

@Component({
  selector: 'app-hello',            // 自定义标签名
  standalone: true,                 // 独立组件（v17+ 默认）
  imports: [],                      // 该模板用到的其他组件/指令
  template: `
    <h2>你好，{{ name() }}</h2>
    <button (click)="switch()">切换</button>
  `,
  styles: [`h2 { color: #1976d2; }`],
})
export class HelloComponent {
  name = signal('Angular');         // signal：响应式状态

  switch() {
    this.name.set(this.name() === 'Angular' ? 'Signals' : 'Angular');
  }
}
```

```ts
// 根组件使用它
import { Component } from '@angular/core';
import { HelloComponent } from './hello.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HelloComponent],        // 想用谁就 imports 谁（显式声明）
  template: `<app-hello />`,
})
export class AppComponent {}
```

三个关键词：

```text
@Component 装饰器    给类"盖章"为组件（TS 教程第 8 章装饰器思想的框架应用）
selector            自定义标签 <app-hello>
signal()            响应式状态容器（读 name()、写 name.set(值)）
```

## 1.4 signal：Angular 的响应式

```ts
import { signal, computed } from '@angular/core';

count = signal(0);
double = computed(() => this.count() * 2);     // 派生值：自动追踪依赖

increment() {
  this.count.update(c => c + 1);               // 基于旧值更新
  this.count.set(5);                           // 直接设值
}
```

模板里读 signal 要**调用**它：`{{ count() }}`——与 Vue 的 ref 心智几乎一样（`count.value` vs `count()`）。

signal 出现之前 Angular 用"可变属性 + 变更检测"（第 9 章讲差异）；新代码一律 signal。

## 1.5 依赖注入初见

Angular 最独特的能力：**依赖注入（Dependency Injection，DI）**——类不自己 new 依赖，而是"声明需要、框架递给"：

```ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })     // 注册为全局单例服务
export class CourseService {
  getCourses() { return ['HTML', 'CSS', 'Angular']; }
}
```

```ts
import { Component, inject } from '@angular/core';
import { CourseService } from './course.service';

@Component({ selector: 'app-course-list', standalone: true, ... })
export class CourseListComponent {
  courseService = inject(CourseService);   // 注入：框架递给你单例

  courses = this.courseService.getCourses();
}
```

第 4 章专章展开——先记住：**Angular 里"跨组件共享的逻辑"装进 Service，靠 DI 获取**（对应 Vue 的组合式函数/Pinia、React 的自定义 Hook/Zustand）。

## 1.6 学 Angular 的正确姿势

从 Vue/React 过来，三个适应点：

1. **TypeScript 是母语**——所有代码强类型，装饰器 + 类的风格
2. **约定大于自由**——命名（xxx.component.ts / xxx.service.ts）、目录结构、CLI 生成都有标准
3. **模板仍是 HTML 超集**——但语法自成体系（第 2 章起）

推荐学习路径：**先读结构 → 跟着 CLI 生成 → 再理解机制**——Angular 的机制比 API 多，理解了组件/DI/变更检测三件事，其余都是查文档。

## 1.7 动手：课程列表

```ts
// src/app/course-list.component.ts
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-course-list',
  standalone: true,
  template: `
    <h2>课程列表</h2>
    <ul>
      @for (course of courses(); track course.id) {
        <li>{{ course.title }}（{{ course.hours }}h）</li>
      }
    </ul>
    <button (click)="addCourse()">添加课程</button>
  `,
})
export class CourseListComponent {
  courses = signal([
    { id: 1, title: 'HTML', hours: 8 },
    { id: 2, title: 'Angular', hours: 20 },
  ]);
  nextId = 3;

  addCourse() {
    this.courses.update(list => [
      ...list,
      { id: this.nextId++, title: '新课程', hours: 10 },
    ]);
  }
}
```

`@for ... track` 是新控制流语法（v17+，第 3 章细讲）——点按钮列表自动增加，signal 驱动。

## 本章小结

- Angular = 全家桶 + 强 TS + 强约定；CLI 是工作台
- standalone 组件直接声明使用；三件套分离（ts/html/css）
- signal 读要调用（`count()`）、computed 派生、set/update 写入
- 逻辑共享装 Service + DI（inject）；新控制流 @for 已预览
