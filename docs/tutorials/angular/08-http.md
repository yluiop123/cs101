---
title: HTTP 与服务端交互
---

# 第 8 章 · HTTP 与服务端交互

**本章目标：**

- 用 HttpClient 替代 fetch 完成 CRUD
- 学会 Interceptor 统一处理鉴权与错误
- 建立服务层 + 组件层的请求架构

## 8.1 HttpClient：Angular 的 fetch

```ts
// main.ts / app.config.ts 注册
import { provideHttpClient } from '@angular/common/http';

providers: [provideHttpClient()]
```

```ts
// api/todo.api.ts —— API 层：只管 HTTP，返回 Observable
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

@Injectable({ providedIn: 'root' })
export class TodoApi {
  private http = inject(HttpClient);
  private base = '/api/todos';

  list(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.base);            // 泛型声明响应类型
  }

  create(text: string): Observable<Todo> {
    return this.http.post<Todo>(this.base, { text });   // 自动 JSON 序列化
  }

  toggle(id: number, done: boolean): Observable<Todo> {
    return this.http.patch<Todo>(`${this.base}/${id}`, { done });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
```

与 fetch 的差异：

```text
自动 JSON 解析（不用手动 res.json()）
类型化响应（get<Todo[]>）
错误自动抛进 error 回调（404/500 不再是"成功响应"）
返回 Observable —— 惰性：不订阅不发请求
```

## 8.2 服务层包装：流转状态

```ts
// services/todo.service.ts —— 订阅 API、维护 signal 状态
import { Injectable, inject, signal, computed } from '@angular/core';
import { TodoApi, Todo } from '../api/todo.api';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private api = inject(TodoApi);

  todos = signal<Todo[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  activeCount = computed(() => this.todos().filter(t => !t.done).length);

  load() {
    this.loading.set(true);
    this.error.set(null);

    this.api.list().subscribe({
      next: (data) => { this.todos.set(data); this.loading.set(false); },
      error: (e) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  add(text: string) {
    this.api.create(text).subscribe(todo => {
      this.todos.update(list => [...list, todo]);
    });
  }

  remove(id: number) {
    this.api.remove(id).subscribe(() => {
      this.todos.update(list => list.filter(t => t.id !== id));
    });
  }
}
```

```ts
// 组件：极薄
export class TodoListComponent {
  todoService = inject(TodoService);

  ngOnInit() {
    this.todoService.load();
  }
}
```

**架构：Api 层（HTTP 细节）→ Service 层（状态与流程）→ 组件（展示）**——与 Vue/React 版"api + store/组件"三层完全同构。

## 8.3 Interceptor：请求的统一关卡

**拦截器（interceptor）**= 每个 HTTP 请求都要过的关卡（对应 axios 的 interceptor）：

```ts
// interceptors/auth.interceptor.ts —— 自动带 token
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return next(req);      // 放行（可以继续加工响应）
};
```

```ts
// 注册（顺序有讲究：先 auth 后 error）
provideHttpClient(
  withInterceptors([authInterceptor, errorInterceptor])
)
```

```ts
// interceptors/error.interceptor.ts —— 统一错误处理
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        // 未授权：清登录态跳登录
        localStorage.removeItem('token');
        inject(Router).navigate(['/login']);
      } else {
        toast.push(`请求失败（${err.status}）`, 'error');
      }
      return throwError(() => err);    // 继续抛给业务层
    })
  );
};
```

两大经典用途：**authInterceptor**（自动带凭证）+ **errorInterceptor**（统一报错）——业务代码从此不再重复写这些。

## 8.4 环境与基地址

```text
src/environments/
├── environment.ts          # 开发
└── environment.prod.ts     # 生产（ng build 自动替换）
```

```ts
// environment.ts
export const environment = { apiUrl: 'http://localhost:3000/api' };

// environment.prod.ts
export const environment = { apiUrl: 'https://api.example.com' };
```

```ts
private base = `${environment.apiUrl}/todos`;   // api 层引用环境
```

与 Vite 的 `VITE_API_BASE` 思路一致——环境差异收敛在配置层。

## 8.5 综合练习：完整 CRUD 页面

清单（整合本章）：

- [ ] TodoApi 四个方法（list/create/toggle/remove）
- [ ] TodoService：todos/loading/error 三个 signal + load/add/remove
- [ ] 组件：loading 骨架、error 重试按钮、列表 @for 渲染
- [ ] authInterceptor 全局带 token；errorInterceptor 统一 toast

```ts
// 组件最终形态（展示层的"薄"）
@Component({
  template: `
    @if (todoService.loading()) { <p>加载中…</p> }
    @else if (todoService.error(); as err) {
      <p>出错了：{{ err }} <button (click)="todoService.load()">重试</button></p>
    }
    @else {
      @for (t of todoService.todos(); track t.id) {
        <li (click)="todoService.toggle(t.id, !t.done)">{{ t.text }}</li>
      }
    }
  `,
})
export class TodoListComponent {
  todoService = inject(TodoService);
  ngOnInit() { this.todoService.load(); }
}
```

## 本章小结

- provideHttpClient 启用；HttpClient 类型化 + 自动 JSON + 惰性 Observable
- 架构三层：Api（HTTP）→ Service（状态）→ 组件（展示）
- Interceptor 统一鉴权/错误；错误继续 throw 给业务层
- environments 管环境差异（对应 env 变量）
