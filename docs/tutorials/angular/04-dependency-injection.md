---
title: 依赖注入
---

# 第 4 章 · 依赖注入

**本章目标：**

- 理解依赖注入（DI）解决什么问题
- 掌握 inject() 与服务注册方式
- 学会层级注入器的选择

## 4.1 为什么需要 DI

不用 DI，组件自己"new"依赖：

```ts
class CourseListComponent {
  // ❌ 手动创建：耦合具体实现、无法替换、无法共享
  courseService = new CourseService(new HttpService(new AuthToken()));
}
```

问题三连：**耦合**（换实现要改组件代码）、**重复**（每个组件 new 一份，状态不共享）、**难测试**（测试时无法换成假实现）。

**依赖注入（Dependency Injection，DI）**：类只声明"我需要什么"，由框架创建并递进来：

```ts
class CourseListComponent {
  courseService = inject(CourseService);   // 声明需要，框架递给单例
}
```

DI 容器（Angular 的"注入器"）负责：创建实例 → 缓存单例 → 按需递送。类比：外卖平台——你要"一份 CourseService"，不用管厨房怎么做的。

## 4.2 服务：DI 的主要载体

**服务（service）**= 无模板的类，承载业务逻辑/数据/工具：

```ts
// src/app/services/counter.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })     // 关键：注册到根注入器（全局单例）
export class CounterService {
  count = signal(0);

  increment() {
    this.count.update(c => c + 1);
  }
}
```

```ts
// 组件 A 与组件 B 注入的是同一个实例
export class ComponentA {
  counter = inject(CounterService);     // counter.count 与 B 共享
}
```

`providedIn: 'root'` = 全局单例——**这就是 Angular 版的"全局状态"**（对应 Pinia/Zustand 的生态位之一）。

## 4.3 inject()：现代取用方式

```ts
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({ ... })
export class CourseListComponent {
  // ✅ 现代：inject() 可以在字段初始化处调用
  private http = inject(HttpClient);
  counter = inject(CounterService);

  // ❌ 旧写法：构造函数参数注入（存量代码会见到）
  // constructor(private http: HttpClient, private counter: CounterService) {}
}
```

inject() 的好处：不依赖构造函数、可在字段默认值/组合逻辑里调用、类型自动推导。**新代码一律 inject()**，构造函数写法能认即可。

::: warning inject() 的调用时机限制
只能在**注入上下文**里调用：组件/指令/服务的字段初始化或构造过程中。普通函数、事件回调里不行（那时上下文已销毁）。
:::

## 4.4 注入层级：全局 vs 局部

Angular 有层级注入器（hierarchical injectors）：

```ts
// 全局单例（最常用）
@Injectable({ providedIn: 'root' })
export class ConfigService {}

// 组件级实例：providers 数组——该组件及其子组件各自一份
@Component({
  selector: 'app-editor',
  providers: [DraftService],      // 每个编辑器实例有自己的草稿服务
  template: `...`,
})
export class EditorComponent {}
```

```text
providedIn: 'root'   → 应用唯一（共享状态、通用工具）
providers: [...]     → 组件子树唯一（编辑器草稿、局部会话）
```

选择口诀：**默认 root；只有"每个子树要独立实例"时才用 providers**。

## 4.5 用接口/令牌解耦

面向抽象而非实现——InjectionToken：

```ts
import { InjectionToken, inject } from '@angular/core';

// 定义令牌（描述"需要一个满足此形状的东西"）
export interface Logger {
  log(msg: string): void;
}
export const LOGGER = new InjectionToken<Logger>('LOGGER');

// 注册实现
providers: [{ provide: LOGGER, useValue: console }]

// 使用方只认令牌
const logger = inject(LOGGER);
logger.log('hello');     // 换实现（写文件版 logger）时使用方零改动
```

这就是第 1 章说的"可测试性"来源：测试时注册一个假的 LOGGER 即可。

## 4.6 DI 与前三框架的对照

| 需求 | Vue | React | Angular |
| --- | --- | --- | --- |
| 共享逻辑 | 组合式函数 | 自定义 Hook | Service |
| 全局状态 | Pinia | Zustand | root Service (signal) |
| 深层传递 | provide/inject | Context | 注入器层级（天生） |

Angular 的 DI 是**语言级设施**（前两者是库方案）——这也是"企业级"的底气：状态、逻辑、配置的共享有统一机制。

## 4.7 综合练习：主题服务

```ts
// services/theme.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  theme = signal<'light' | 'dark'>('light');

  toggle() {
    this.theme.update(t => (t === 'light' ? 'dark' : 'light'));
    document.documentElement.classList.toggle('dark', this.theme() === 'dark');
  }
}
```

```ts
// 任意组件（不论多深）
export class HeaderComponent {
  themeService = inject(ThemeService);
}
// HeaderComponent 与 FooterComponent 拿到同一个 theme——全局单例的价值
```

对照第 6 章的 Vue Context / React Context 版本——Angular 只需一个 Service。

## 本章小结

- DI 解决耦合/重复/测试三问题；inject() 是现代取用方式
- Service + `providedIn: 'root'` = 全局单例（全局状态的 Angular 姿态）
- providers 数组做子树级实例；默认 root、特殊才局部
- InjectionToken 面向抽象，可测试性由此而来
