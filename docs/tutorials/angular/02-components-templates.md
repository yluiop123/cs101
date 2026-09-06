---
title: 组件与模板
---

# 第 2 章 · 组件与模板

**本章目标：**

- 掌握模板四大绑定：插值、属性、事件、双向
- 学会组件间的 @Input/@Output 通信
- 理解 signal 驱动的组件更新

## 2.1 插值与属性绑定

```ts
// course-card.component.ts
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-course-card',
  standalone: true,
  template: `
    <!-- 插值：{{ }} -->
    <h3>{{ title() }}</h3>

    <!-- 属性绑定：[属性名]="表达式" -->
    <img [src]="imgUrl()" [alt]="title()" />
    <div [class.active]="isActive()" [style.color]="color()">内容</div>
    <button [disabled]="!canStart()">开始</button>
  `,
})
export class CourseCardComponent {
  title = signal('Angular 教程');
  imgUrl = signal('/logo.png');
  isActive = signal(true);
  color = signal('#1976d2');
  canStart = signal(false);
}
```

```text
{{ expr }}        文本插值
[prop]="expr"     属性绑定（方括号 = 数据从类流向模板）
[class.x]="expr"  条件类名（等价 Vue 的 :class 对象单项）
[style.x]="expr"  条件样式
[disabled]="b"    布尔属性绑定
```

## 2.2 事件绑定

```ts
@Component({
  template: `
    <!-- 圆括号 = 事件从模板流向类 -->
    <button (click)="increment()">+1（{{ count() }}）</button>
    <input (input)="onInput($event)" />
    <form (submit)="onSubmit($event)">…</form>
  `,
})
export class DemoComponent {
  count = signal(0);

  increment() {
    this.count.update(c => c + 1);
  }

  onInput(event: Event) {
    console.log((event.target as HTMLInputElement).value);
  }

  onSubmit(event: Event) {
    event.preventDefault();        // 阻止默认行为要手动（无 .prevent 修饰符）
  }
}
```

对照记忆：Vue 的 `@click` = Angular 的 `(click)`；Vue 的 `.prevent` 修饰符在 Angular 里没有——**手动 preventDefault**。

## 2.3 双向绑定：[(ngModel)] 与 signal 双写

Angular 的双向绑定 = 属性绑定 + 事件绑定的语法糖 `[(…)]`（"香蕉在盒子里"）：

```ts
// 需要引入 FormsModule（表单模块）
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-name-box',
  standalone: true,
  imports: [FormsModule],
  template: `
    <input [(ngModel)]="name" placeholder="输入名字" />
    <p>你好，{{ name() }}</p>
  `,
})
export class NameBoxComponent {
  name = signal('');
}
```

`[(ngModel)]` 与 signal 配合：输入时自动 `name.set(新值)`。**需要 signalInput/unset 的细节**——纯 signal 字段 + ngModel 的组合在新版 Angular 有更好的支持（signal 表单），传统 reactive forms 见第 7 章。

## 2.4 @Input：父传子

```ts
// child/course-card.component.ts
import { Component, input } from '@angular/core';     // signal 版 input（v17.1+）

@Component({
  selector: 'app-course-card',
  standalone: true,
  template: `
    <h3>{{ title() }}</h3>
    <p>学时：{{ hours() }}</p>
    <p>状态：{{ done() ? '已完成' : '学习中' }}</p>
  `,
})
export class CourseCardComponent {
  title = input.required<string>();          // 必填输入
  hours = input(0);                          // 可选 + 默认值
  done = input(false);
}
```

```ts
// parent/course-list.component.ts
@Component({
  template: `
    <app-course-card
      [title]="c.title"
      [hours]="c.hours"
      [done]="c.done"
    />
  `,
})
export class CourseListComponent { ... }
```

```text
input()          signal 版输入（推荐）：读值要调用 this.title()
input.required   必填声明（编译期强约束——Angular 类型化模板的体现）
@Input()         老式装饰器版（存量代码会见到）
```

## 2.5 @Output：子通知父

```ts
// child/confirm-button.component.ts
import { Component, output } from '@angular/core';    // signal 版 output

@Component({
  selector: 'app-confirm-button',
  standalone: true,
  template: `<button (click)="onConfirm()">确认</button>`,
})
export class ConfirmButtonComponent {
  confirmed = output<void>();                // 声明输出事件

  onConfirm() {
    this.confirmed.emit();                   // 触发（可带载荷）
  }
}
```

```ts
// 父组件监听
@Component({
  template: `
    <app-confirm-button (confirmed)="handleConfirm()" />
  `,
})
export class ParentComponent {
  handleConfirm() { console.log('子组件确认了'); }
}
```

通信模型与 Vue 完全同构：

```text
@Input()  ↔ props（数据下行）
@Output() ↔ emit（事件上行）
方括号下行、圆括号上行、香蕉盒 [(…)] 双向
```

## 2.6 内容投影：ng-content

React 的 children / Vue 的 slot，Angular 叫 **ng-content**：

```ts
// child/panel.component.ts
@Component({
  template: `
    <div class="panel">
      <header><ng-content select="[panel-header]" /></header>
      <main><ng-content /></main>          <!-- 默认出口 -->
    </div>
  `,
})
export class PanelComponent {}
```

```html
<!-- 父组件填充 -->
<app-panel>
  <h3 panel-header>标题（select 匹配）</h3>
  <p>默认出口内容</p>
</app-panel>
```

## 2.7 综合练习：点赞卡片

```ts
import { Component, input, output, signal, computed } from '@angular/core';

@Component({
  selector: 'app-like-card',
  standalone: true,
  template: `
    <div class="card">
      <h3>{{ title() }}</h3>
      <button (click)="toggle()">
        {{ liked() ? '❤️ 已赞' : '🤍 点赞' }} {{ count() }}
      </button>
    </div>
  `,
  styles: [`.card { padding: 12px; border: 1px solid #eee; border-radius: 8px; }`],
})
export class LikeCardComponent {
  title = input.required<string>();
  liked = signal(false);
  count = signal(0);

  toggle() {
    this.liked.update(v => !v);
    this.count.update(c => this.liked() ? c + 1 : c - 1);
  }
}
```

signal 读写、事件绑定、@Input 声明——模板语法的最小闭环。

## 本章小结

- 四大绑定：插值 `{{ }}`、属性 `[]`、事件 `()`、双向 `[(ngModel)]`
- `input()/output()` signal 版通信（required 强约束）；`@Input/@Output` 装饰器是存量写法
- 事件对象 `$event`；preventDefault 手动
- ng-content 内容投影（select 具名出口）
