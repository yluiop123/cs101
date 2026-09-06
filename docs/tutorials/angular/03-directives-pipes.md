---
title: 指令与管道
---

# 第 3 章 · 指令与管道

**本章目标：**

- 掌握新控制流（@if/@for/@switch）与旧结构指令
- 熟练使用内置管道（pipe）格式化数据
- 学会属性指令 class/style 的批量绑定

## 3.1 新控制流：@if / @for / @switch

v17+ 推荐的**内置控制流（built-in control flow）**——模板里的"迷你 JS"：

```html
<!-- @if：条件渲染 -->
@if (user(); as u) {
  <p>欢迎，{{ u.name }}</p>
} @else if (loading()) {
  <p>加载中…</p>
} @else {
  <p>未登录</p>
}

<!-- @for：列表渲染（track 必写） -->
@for (course of courses(); track course.id) {
  <li>{{ course.title }}</li>
} @empty {
  <li>暂无课程</li>
}

<!-- @switch：多分支 -->
@switch (status()) {
  @case ('idle') { <p>等待</p> }
  @case ('loading') { <p>加载中…</p> }
  @default { <p>完成</p> }
}
```

```text
@if/@else        条件（支持 as 别名取值）
@for + track     循环（track 告诉 Diff 身份 = Vue 的 :key）
@empty           空列表兜底
@switch/@case    多分支匹配
```

::: info track 与 key
`track course.id` 的作用与 Vue/React 的 key 完全一致：Diff 时识别"同一个元素"。也可以 `track $index`（按索引，等价于不建议的 index key）。
:::

## 3.2 旧结构指令（认读存量代码）

新控制流之前，Angular 用"结构指令（structural directives）"：

```html
<!-- *ngIf（旧版 @if） -->
<p *ngIf="isVisible">显示</p>
<p *ngIf="a; else elseBlock">A</p>
<ng-template #elseBlock><p>B</p></ng-template>

<!-- *ngFor（旧版 @for） -->
<li *ngFor="let item of items; index as i">{{ i }}. {{ item }}</li>

<!-- *ngSwitch（旧版 @switch） -->
<div [ngSwitch]="status">
  <p *ngSwitchCase="'idle'">等待</p>
  <p *ngSwitchDefault>其他</p>
</div>
```

星号语法（*ngIf）是"语法糖"。**新项目一律 @if/@for**，存量代码能认出即可（用 ngUpgrade 检查器可以批量迁移）。

## 3.3 属性指令：class 与 style 批量绑定

```html
<!-- [ngClass]：对象语法（最像 Vue 的 :class） -->
<div [ngClass]="{ active: isActive(), disabled: isDisabled() }">…</div>

<!-- 数组语法 -->
<div [ngClass]="[baseClass(), extraClass()]">…</div>

<!-- [ngStyle]：对象绑定样式 -->
<div [ngStyle]="{ color: textColor(), 'font-size.px': 14 }">…</div>
```

需要引入 CommonModule 或 NgClass/NgStyle（standalone 组件的 imports 数组）。单个条件类用 `[class.x]` 更轻。

## 3.4 管道：模板里的格式化函数

**管道（pipe）**在插值/绑定中就地转换数据：

```html
<p>{{ price | currency:'CNY' }}</p>           <!-- ¥1,234.00 -->
<p>{{ today | date:'yyyy-MM-dd HH:mm' }}</p>  <!-- 2026-09-06 14:30 -->
<p>{{ ratio | percent:'1.1-1' }}</p>          <!-- 85.0% -->
<p>{{ text | uppercase }}</p>                 <!-- 大写 -->
<p>{{ text | slice:0:10 }}…</p>               <!-- 截断 -->
<p>{{ obj | json }}</p>                       <!-- 调试神器：JSON 字符串 -->

<!-- 管道可以链式叠加 -->
<p>{{ createdAt | date:'shortDate' | uppercase }}</p>
```

常用内置管道：date / currency / percent / number / uppercase / lowercase / titlecase / slice / json。

## 3.5 纯管道 vs 非纯管道

```ts
// 纯管道（默认）：只在输入引用变化时重算——性能好
@Pipe({ name: 'summary' })
export class SummaryPipe implements PipeTransform {
  transform(value: string, limit = 50): string {
    return value.length > limit ? value.slice(0, limit) + '…' : value;
  }
}
```

```html
<!-- 使用前先 imports: [SummaryPipe] -->
<p>{{ article | summary:100 }}</p>
```

**默认纯管道**：数组内部元素变了不会触发重算（引用没变）——与 computed 的缓存逻辑同源。需要响应深层变化用 `pure: false`（性能代价，慎用）。

## 3.6 综合练习：可切换视图的课程表

```ts
import { Component, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-course-table',
  standalone: true,
  template: `
    <div [ngClass]="{ compact: compact() }">
      @for (c of visible(); track c.id) {
        <div class="row">
          <span>{{ c.title }}</span>
          <span>{{ c.price | currency:'CNY':'symbol':'1.0-0' }}</span>
        </div>
      } @empty {
        <p>没有可显示的课程</p>
      }
    </div>
    <button (click)="toggleCompact()">{{ compact() ? '宽松视图' : '紧凑视图' }}</button>
  `,
  imports: [DatePipe],
})
export class CourseTableComponent {
  courses = signal([
    { id: 1, title: 'HTML', price: 99 },
    { id: 2, title: 'Angular', price: 299 },
  ]);
  compact = signal(false);
  keyword = signal('');

  // 过滤 + 展示，全部 computed 派生（不做模板里算）
  visible = computed(() =>
    this.courses().filter(c => !this.keyword() || c.title.includes(this.keyword()))
  );

  toggleCompact() {
    this.compact.update(v => !v);
  }
}
```

控制流 + 管道 + ngClass + computed 派生——模板层全部武器的组合演练。

## 本章小结

- 新控制流 @if/@for(track)/@switch；@empty 兜底；旧 *ngIf/*ngFor 能认
- [ngClass]/[ngStyle] 批量绑定；单条件 [class.x] 更轻
- 管道就地格式化（date/currency/percent…）可链式；默认纯管道有缓存
- 派生数据放 computed，模板保持"薄"
