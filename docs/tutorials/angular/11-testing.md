---
title: 测试
---

# 第 11 章 · 测试

**本章目标：**

- 建立"组件测试"的基本流程
- 掌握 TestBed 与单元测试三段式
- 了解服务测试与 HTTP Mock

## 11.1 Angular 的测试底座

Angular CLI 生成的项目**自带测试设施**：

```text
测试框架   Jasmine（describe/it/expect 语法）
运行器     Karma（浏览器中跑）或新版可配 Vitest
工具       TestBed（Angular 专用测试环境装配器）
命令       ng test（跑测试）、ng generate component --skip-tests=false（默认连 spec 一起生成）
```

每个 CLI 生成的组件都带 `xxx.component.spec.ts`——**测试文件与源码同目录同命名**是 Angular 的约定。

## 11.2 三段式：Arrange-Act-Assert

所有单元测试的通用节奏：

```ts
// counter.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { CounterService } from './counter.service';

describe('CounterService', () => {
  // Arrange：准备被测对象
  let service: CounterService;

  beforeEach(() => {
    service = new CounterService();     // 纯服务可直接 new
  });

  it('初始值为 0', () => {
    // Assert
    expect(service.count()).toBe(0);
  });

  it('increment 后为 1', () => {
    // Act：执行动作
    service.increment();

    // Assert：断言结果
    expect(service.count()).toBe(1);
  });
});
```

```text
describe     测试套件（一组相关测试）
it           单个测试用例
expect(x).toBe(y)   断言（还有 toEqual/toContain/toThrow...）
beforeEach   每个用例前的准备
```

## 11.3 TestBed：组件测试的装配器

组件依赖模板/DI/输入——需要 **TestBed** 装配测试环境：

```ts
// like-card.component.spec.ts
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LikeCardComponent } from './like-card.component';

describe('LikeCardComponent', () => {
  let component: LikeCardComponent;
  let fixture: ComponentFixture<LikeCardComponent>;   // 组件+模板+环境的容器

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LikeCardComponent],       // standalone 组件直接 imports
    }).compileComponents();

    fixture = TestBed.createComponent(LikeCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', '测试课程');   // 设置必填 input
  });

  it('初始点赞数为 0', () => {
    expect(component.count()).toBe(0);
  });

  it('点击按钮后点赞数变 1', () => {
    const button = fixture.debugElement.query(By.css('button'));

    button.triggerEventHandler('click');   // 模拟点击
    fixture.detectChanges();               // 触发变更检测（界面/状态同步）

    expect(component.count()).toBe(1);
  });
});
```

组件测试四步：

```text
① TestBed.configureTestingModule({ imports: [组件] })   装配
② createComponent + setInput                           实例化与输入
③ query(By.css(...)) + triggerEventHandler              操作模板
④ detectChanges + expect                                同步与断言
```

## 11.4 服务测试与 HTTP Mock

服务依赖 HttpClient 时，用 **HttpTestingController** mock 后端：

```ts
// course.service.spec.ts
import { TestBed, provideZonelessChangeDetection } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { CourseService } from './course.service';

describe('CourseService', () => {
  let service: CourseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),      // 拦截所有 HTTP 请求（不发真网络）
      ],
    });
    service = TestBed.inject(CourseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();                   // 校验没有未处理的请求
  });

  it('load() 请求列表并更新状态', () => {
    service.load();

    const req = httpMock.expectOne('/api/todos');   // 断言"发出了这个请求"
    expect(req.request.method).toBe('GET');

    req.flush([{ id: 1, text: 'a', done: false }]); // mock 响应数据

    expect(service.todos().length).toBe(1);         // 状态被更新
  });
});
```

**不发真网络**是单元测试的铁律——快、稳定、可复现。CI 里跑的测试全部走 mock。

## 11.5 测试什么：金字塔取舍

```text
        E2E（少）          全流程冒烟（Cypress/Playwright）
      集成/组件（中）       关键交互与状态流转
        单元（多）          服务逻辑、纯函数、校验器
```

入门阶段的务实建议：

```text
必测：服务逻辑（状态流转、计算）、纯函数工具、表单校验器
选测：关键组件的交互（点按/提交）
不测：纯展示模板、第三方库行为
```

**为"业务逻辑"写测试，不为"样式"写测试。**

## 11.6 综合练习：给 TodoService 写测试

```ts
import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';
import { TodoApi } from '../api/todo.api';

describe('TodoService', () => {
  let service: TodoService;
  let apiSpy: { create: jasmine.Spy; remove: jasmine.Spy };

  beforeEach(() => {
    apiSpy = { create: jasmine.createSpy(), remove: jasmine.createSpy() };

    TestBed.configureTestingModule({
      providers: [{ provide: TodoApi, useValue: apiSpy }],   // DI 替身！
    });
    service = TestBed.inject(TodoService);
  });

  it('add 成功后列表增加一项', () => {
    apiSpy.create.and.returnValue(new Promise(resolve => {}));  // 假实现
    service.add('新任务');
    expect(service.todos().length).toBe(1);
    expect(apiSpy.create).toHaveBeenCalledWith('新任务');
  });

  it('空文本不新增', () => {
    service.add('   ');
    expect(service.todos().length).toBe(0);
  });
});
```

`providers: [{ provide: TodoApi, useValue: 假的 }]`——**第 4 章 DI 的可测试性在这里兑现**：注入替身，一秒换实现。

## 本章小结

- Jasmine 三段式（Arrange-Act-Assert）；spec 文件与源码同目录
- TestBed 装配组件测试：setInput → query → trigger → detectChanges
- HTTP 测试用 HttpTestingController mock；DI 替身是可测试性的核心
- 按金字塔取舍：多测服务逻辑与纯函数，少测纯展示
