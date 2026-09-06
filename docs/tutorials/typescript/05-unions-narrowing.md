---
title: 联合类型与类型收窄
---

# 第 5 章 · 联合类型与类型收窄

**本章目标：**

- 掌握联合（|）与交叉（&）的语义
- 学会用类型守卫（type guard）收窄类型
- 理解可辨识联合——TS 里最实用的建模模式

## 5.1 联合类型：或

```ts
type ID = string | number;
type Status = 'idle' | 'loading' | 'done';    // 字面量联合（超高频）

const id: ID = 'u1024';   // ✅
const id2: ID = 1024;     // ✅
const id3: ID = true;     // ❌

// 字面量联合 = "只能是这几个字符串之一"
function setStatus(s: Status) { /* ... */ }
setStatus('loading');   // ✅
setStatus('loaded');    // ❌ 拼错立刻标红——字符串参数的保险丝
```

::: tip 字面量联合替代魔法字符串
凡是"取值固定几种"的参数（状态、类型、模式），都用字面量联合。编辑器还会自动补全候选项。
:::

## 5.2 交叉类型：且

```ts
type Draggable = { drag: () => void };
type Resizable = { resize: () => void };

type UIWidget = Draggable & Resizable;   // 必须同时具备两者

const w: UIWidget = {
  drag() {},
  resize() {},
};
```

`|` 是"任选其一"，`&` 是"全都得有"——交叉常用于"给已有类型追加字段"（第 3 章）。

## 5.3 联合类型的访问限制

联合类型只能访问**所有成员共有**的成员：

```ts
type Shape = Circle | Square;
interface Circle { kind: 'circle'; radius: number }
interface Square { kind: 'square'; size: number }

function area(shape: Shape): number {
  return shape.radius;   // ❌ Square 没有 radius！
}
```

怎么安全访问？——**收窄（narrowing）**。

## 5.4 类型守卫：把"或"缩小成"其中之一"

### typeof 守卫

```ts
function format(input: string | number): string {
  if (typeof input === 'string') {
    return input.toUpperCase();     // ✅ 这个分支里 input 是 string
  }
  return input.toFixed(2);          // ✅ 这个分支里 input 是 number
}
```

### instanceof 与 in 守卫

```ts
class HttpError extends Error {}
class TimeoutError extends Error {}

function handle(err: HttpError | TimeoutError) {
  if (err instanceof HttpError) {
    err.status;     // HttpError 独有成员
  }
}

function hasTag(obj: { tags?: string[] }) {
  if ('tags' in obj) {
    obj.tags.length;    // ✅
  }
}
```

### 真值收窄与相等收窄

```ts
function render(name?: string) {
  if (!name) return;          // undefined/null/'' 全拦住
  name.toUpperCase();         // ✅ 剩下的必是 string
}

function pick(x: 'a' | 'b' | 'c', flag: boolean) {
  if (x === 'a') { /* x 是 'a' */ }
  else { /* x 是 'b' | 'c' */ }
}
```

::: tip 推断跟得越细，红字越少
收窄的本质：**控制流分析**。TS 沿着 if/return/循环推断"此刻变量可能是什么"，你写代码的方式越"直白"（早返回、条件判断），类型跟得越准。

:::

## 5.5 可辨识联合（Discriminated Union）

给联合的每个成员一个**共享的字面量字段**（tag），switch 它就能整段收窄——TS 里最重要的建模模式：

```ts
interface Circle { kind: 'circle'; radius: number }
interface Rect   { kind: 'rect';   width: number; height: number }
interface Triangle { kind: 'tri'; base: number; height: number }

type Shape = Circle | Rect | Triangle;

function area(s: Shape): number {
  switch (s.kind) {              // kind 就是"身份证"字段
    case 'circle':
      return Math.PI * s.radius ** 2;        // s: Circle
    case 'rect':
      return s.width * s.height;             // s: Rect
    case 'tri':
      return (s.base * s.height) / 2;        // s: Triangle
  }
}
```

三大好处：

1. 每个分支内**字段完整可用**（不需要 ? 可选属性兜底）
2. 新增成员时，漏处理的 switch 会被 TS 提示（配合 never 检查更完备）
3. 前端状态管理（请求 idle/loading/success/error）的标准姿势

```ts
// 实战版：异步请求状态建模（第 13 章异步的 TS 化）
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };

function render<T>(state: RequestState<T>): string {
  switch (state.status) {
    case 'idle': return '等待请求';
    case 'loading': return '加载中…';
    case 'success': return `数据：${JSON.stringify(state.data)}`;   // data 只在这出现
    case 'error': return `出错：${state.message}`;
  }
}
```

## 5.6 never 兜底：穷尽检查

```ts
function area(s: Shape): number {
  switch (s.kind) {
    case 'circle': return Math.PI * s.radius ** 2;
    case 'rect': return s.width * s.height;
    case 'tri': return (s.base * s.height) / 2;
    default:
      const _exhaustive: never = s;   // 若新增了 Shape 成员而这里没处理，这行报错
      return _exhaustive;
  }
}
```

`never` 只能赋给 never——把剩余情况赋值给 never 变量，**新增分支漏写就编译报错**，穷尽性有了编译器背书。

## 5.7 综合示例：过滤器配置

```ts
type Filter =
  | { type: 'text'; keyword: string }
  | { type: 'range'; min: number; max: number }
  | { type: 'select'; values: string[] };

function toQueryString(f: Filter): string {
  switch (f.type) {
    case 'text':  return `kw=${encodeURIComponent(f.keyword)}`;
    case 'range': return `min=${f.min}&max=${f.max}`;
    case 'select': return f.values.map((v) => `v=${v}`).join('&');
  }
}
```

后端传来的筛选配置用这种联合建模，解析代码自动获得逐分支的类型提示。

## 本章小结

- `|` 或（字面量联合是参数保险丝）、`&` 且（追加字段）
- 联合只能访问共有成员；用 typeof/instanceof/in/相等判断收窄
- **可辨识联合**：共享 tag 字段 + switch，状态建模第一模式
- never 兜底实现穷尽检查
