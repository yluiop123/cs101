---
title: 生命周期与变更检测
---

# 第 9 章 · 生命周期与变更检测

**本章目标：**

- 掌握常用生命周期钩子（ngOnInit/ngOnDestroy）
- 理解 Angular 的变更检测与 Zone.js
- 认识 OnPush 与 signal 的性能优势

## 9.1 生命周期钩子

组件从创建到销毁的关键节点，实现接口即可挂钩：

```ts
import { Component, OnInit, OnDestroy, AfterViewInit, signal } from '@angular/core';

@Component({ selector: 'app-demo', standalone: true, ... })
export class DemoComponent implements OnInit, OnDestroy {
  width = signal(0);
  private onResize = () => this.width.set(window.innerWidth);

  ngOnInit() {
    // 初始化：发请求、绑全局事件（组件创建后执行一次）
    this.width.set(window.innerWidth);
    window.addEventListener('resize', this.onResize);
  }

  ngAfterViewInit() {
    // 视图初始化完成（需要读 DOM 尺寸时用）
  }

  ngOnDestroy() {
    // 销毁前：清理！与 ngOnInit 成对
    window.removeEventListener('resize', this.onResize);
  }
}
```

常用钩子对照表：

| Angular | 时机 | 对应 Vue | 对应 React |
| --- | --- | --- | --- |
| ngOnInit | 初始化（输入就绪后） | onMounted | useEffect((), []) |
| ngAfterViewInit | 视图就绪 | onMounted | — |
| ngOnChanges | @Input 变化 | watch props | 依赖 props 的 useEffect |
| ngOnDestroy | 销毁前 | onUnmounted | effect 清理函数 |

**纪律与 Vue/React 一致：初始化借的资源，销毁前归还。**

## 9.2 请求放哪：constructor vs ngOnInit

```ts
// 都可以，但 ngOnInit 更语义化（输入已就绪、可返回清理）
export class CourseListComponent {
  courseService = inject(CourseService);

  ngOnInit() {
    this.courseService.load();
  }
}
```

惯例：构造器只做 DI 注入与简单初始化；**异步请求与订阅放 ngOnInit**。

## 9.3 变更检测：Angular 的"心跳"

Angular 怎么知道"数据变了要刷新界面"？——**变更检测（change detection）**：

```text
Zone.js：猴子补丁所有异步 API（setTimeout/事件/HTTP…）
         → 任何异步回调结束时，Angular 认为可能有数据变化
         → 触发变更检测：检查所有组件的绑定表达式
```

与 Vue/React 的差异：

```text
Vue：细粒度依赖收集（哪个数据变了改哪个组件）
React：组件函数整体重跑 + Diff
Angular（默认）：全局心跳——任何异步后从根到叶检查全部绑定
```

默认策略在中小项目毫无问题（检查绑定很快）；大项目用下面两招优化。

## 9.4 OnPush：按需检查

```ts
@Component({
  selector: 'app-heavy-table',
  changeDetection: ChangeDetectionStrategy.OnPush,   // 声明"别总来检查我"
  ...
})
export class HeavyTableComponent {
  data = input.required<Row[]>();
}
```

OnPush 语义：**只有"输入引用变化 / 自身事件 / signal 变化"才检查本组件**——树中被高频心跳扫到的"昂贵叶子"可以显式豁免。

## 9.5 signal：新时代的细粒度更新

signal 让 Angular 拥有类似 Vue 的**精确更新**：

```ts
count = signal(0);
double = computed(() => this.count() * 2);

// 模板绑定 signal 时：只有依赖的 signal 变了，绑它的地方才更新
// {{ count() }} {{ double() }}
```

```ts
// 完整 signal 组件（现代推荐的默认形态）
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,   // signal 项目标配组合
  template: `<p>{{ count() }} × 2 = {{ double() }}</p>
             <button (click)="increment()">+1</button>`,
})
export class CounterComponent {
  count = signal(0);
  double = computed(() => this.count() * 2);

  increment() { this.count.update(c => c + 1); }
}
```

演进方向一句话：**"Zone.js 全局心跳 → signal 细粒度响应"**——新项目全 signal + OnPush，变更检测成本与界面规模解耦。

## 9.6 effect：signal 的副作用

```ts
import { effect } from '@angular/core';

export class ThemeComponent {
  theme = signal<'light' | 'dark'>('light');

  constructor() {
    // effect：依赖的 signal 变化时自动执行（自动清理）
    effect(() => {
      document.documentElement.classList.toggle('dark', this.theme() === 'dark');
    });
  }
}
```

与 Vue 的 watchEffect 同构：自动收集依赖、自动在组件销毁时停止。

## 9.7 综合练习：窗口尺寸追踪组件

```ts
import { Component, signal, computed, effect, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-viewport',
  standalone: true,
  template: `
    <p>宽度：{{ width() }}px（{{ device() }}）</p>
  `,
})
export class ViewportComponent implements OnDestroy {
  width = signal(window.innerWidth);

  // 派生值用 computed（不要用 signal 存派生结果）
  device = computed(() => {
    const w = this.width();
    return w < 768 ? '手机' : w < 1024 ? '平板' : '桌面';
  });

  private onResize = () => this.width.set(window.innerWidth);

  constructor() {
    window.addEventListener('resize', this.onResize);

    // effect：signal 变化时的副作用（自动收集依赖、销毁时自动停止）
    effect(() => {
      console.log('设备类型变化：', this.device());
    });
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize);
  }
}
```

## 本章小结

- ngOnInit 发请求/绑事件、ngOnDestroy 清理成对（三框架同一纪律）
- 变更检测 = Zone.js 心跳 + 全量检查；OnPush 声明按需检查
- signal + OnPush = 细粒度更新的现代组合；effect 管副作用
- 派生值用 computed，不塞进 signal
