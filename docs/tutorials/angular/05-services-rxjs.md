---
title: 服务与 RxJS 入门
---

# 第 5 章 · 服务与 RxJS 入门

**本章目标：**

- 学会服务层的组织模式（数据/工具/API 分层）
- 理解 Observable 的"订阅"模型
- 认识 toSignal 桥接：RxJS 与 signal 协作

## 5.1 服务层的组织

中大型 Angular 项目的服务分层惯例：

```text
src/app/
├── services/
│   ├── course.service.ts      # 领域服务：课程数据的增删改查
│   ├── auth.service.ts        # 认证状态
│   └── toast.service.ts       # 全局通知
├── api/                       # （可选）纯 HTTP 封装层
└── components/ ...
```

```ts
// course.service.ts —— 领域服务：状态 + 行为
import { Injectable, signal, computed } from '@angular/core';

export interface Course {
  id: number;
  title: string;
  done: boolean;
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  private nextId = 1;
  courses = signal<Course[]>([]);

  activeCount = computed(() =>
    this.courses().filter(c => !c.done).length
  );

  add(title: string) {
    if (!title.trim()) return;
    this.courses.update(list => [...list, { id: this.nextId++, title: title.trim(), done: false }]);
  }

  toggle(id: number) {
    this.courses.update(list => list.map(c => (c.id === id ? { ...c, done: !c.done } : c)));
  }

  remove(id: number) {
    this.courses.update(list => list.filter(c => c.id !== id));
  }
}
```

组件只管渲染，业务逻辑全在 Service——组件可替换、逻辑可测试。

## 5.2 RxJS：Angular 的"异步水流"底座

**RxJS**（Reactive Extensions）处理"随时间到来的数据流"。核心概念 **Observable（可观察对象）**：

```ts
import { Observable, of, timer, fromEvent } from 'rxjs';

// 创建流
const nums$ = of(1, 2, 3);              // 立即发出 1,2,3 的流（$ 后缀 = 流的约定）
const tick$ = timer(0, 1000);           // 每秒发出递增数字
const clicks$ = fromEvent(document, 'click');   // 点击事件流

// 订阅：不订阅就不发生（懒执行）
nums$.subscribe(value => console.log(value));   // 1, 2, 3

// 操作符：对流做变换（map/filter/debounce...）
import { map, filter } from 'rxjs';

tick$
  .pipe(
    filter(n => n % 2 === 0),
    map(n => `第 ${n} 秒（偶数）`)
  )
  .subscribe(msg => console.log(msg));
```

与 Promise 的差异：

```text
Promise：一次性的"未来单值"（resolve 后结束）
Observable：可以多次发出值的"水流"（HTTP、事件、定时器都适用）
```

Angular 内部（HttpClient、Router 事件）全是 Observable——**读懂订阅/退订是 Angular 必修**，哪怕你写业务时主要用 signal。

## 5.3 async 管道：模板里的订阅

手动订阅要记得退订（内存泄漏），模板里用 **async 管道**自动管理：

```ts
import { Component } from '@angular/core';
import { timer, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  standalone: true,
  imports: [AsyncPipe],
  template: `<p>已运行 {{ seconds$ | async }} 秒</p>`,
})
export class TimerComponent {
  seconds$ = timer(0, 1000).pipe(map(t => t + 1));   // 组件销毁时 async 管道自动退订
}
```

## 5.4 toSignal：把流变成响应式状态

现代 Angular 的推荐姿势——**RxJS 流转 signal**：

```ts
import { toSignal } from '@angular/core/rxjs-interop';
import { timer, map } from 'rxjs';

export class TimerComponent {
  seconds = toSignal(timer(0, 1000).pipe(map(t => t + 1)), { initialValue: 0 });

  // 模板里：{{ seconds() }} —— signal 的一切能力（computed 组合等）
}
```

分工建议：

```text
组件状态/派生数据     → signal + computed（主力）
HTTP/事件流/复杂时序  → RxJS（Angular 内置设施的母语）
衔接                 → toSignal（流进组件）/ from App?
```

## 5.5 通知服务实战：BehaviorSubject 与 signal 的对比

旧式 Angular 全局通知常用 **BehaviorSubject**（保存最新值的流）：

```ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastServiceV1 {
  private _toasts = new BehaviorSubject<string[]>([]);
  toasts$ = this._toasts.asObservable();     // 对外暴露只读流

  push(message: string) {
    this._toasts.next([...this._toasts.value, message]);
  }
}
```

signal 版（现代推荐）：

```ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<string[]>([]);

  push(message: string) {
    this.toasts.update(list => [...list, message]);
    setTimeout(() => {
      this.toasts.update(list => list.filter(m => m !== message));
    }, 3000);
  }
}
```

```ts
// 任意组件
export class SomeComponent {
  toast = inject(ToastService);

  onSave() {
    this.toast.push('保存成功');
  }
}
```

**新代码用 signal**；BehaviorSubject 能读懂（存量项目与 RxJS 深水区会遇到）。

## 5.6 综合练习：搜索服务（流式防抖）

一个 RxJS 仍有优势的场景——**防抖搜索流**：

```ts
// services/search.service.ts
import { Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private keyword$ = new Subject<string>();
  private _results = signal<string[]>([]);
  results = this._results.asReadonly();

  constructor() {
    // 输入流：停止输入 400ms 才发请求；switchMap 自动取消旧请求（防竞态）
    this.keyword$
      .pipe(
        debounceTime(400),
        switchMap(keyword => this.fetch(keyword))
      )
      .subscribe(data => this._results.set(data));
  }

  search(keyword: string) {
    this.keyword$.next(keyword);
  }

  private fetch(keyword: string) {
    // 简化：真实项目用 HttpClient
    return new Promise<string[]>(resolve =>
      setTimeout(() => resolve([`结果：${keyword} A`, `结果：${keyword} B`]), 300)
    );
  }
}
```

```ts
// 组件
export class SearchBoxComponent {
  searchService = inject(SearchService);

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchService.search(value);
  }
}
```

`debounceTime + switchMap` 两行解决"防抖 + 竞态取消"——这正是 RxJS 的强项（Vue/React 里要手写防抖 + ignore 标记）。

## 本章小结

- 服务分层：领域服务管状态与行为，组件保持"薄"
- Observable = 多值水流，订阅驱动；async 管道自动退订
- toSignal 桥接流与 signal：组件层 signal 为主，流式时序交给 RxJS
- debounceTime+switchMap 是 RxJS 的杀手锏场景（防抖 + 防竞态）
