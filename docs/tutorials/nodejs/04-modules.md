---
title: 模块系统：CommonJS 与 ESM
---

# 第 4 章 · 模块系统：CommonJS 与 ESM

**本章目标：**

- 掌握 CommonJS 与 ES Module 两套模块语法
- 理解两者的加载机制差异
- 学会在 Node 项目中选择与混用

## 4.1 为什么 Node 有两套模块

Node 诞生（2009）时 ES 还没有模块标准，社区发明了 **CommonJS（CJS）**：`require` / `module.exports`。2015 年 ES6 正式推出 **ES Module（ESM）**：`import` / `export`。如今 Node 两套并存——历史包袱与现实标准的叠加。

## 4.2 CommonJS：require 与 module.exports

```js
// math.js —— 导出
function add(a, b) {
  return a + b;
}
module.exports = { add };

// app.js —— 导入
const { add } = require('./math');
console.log(add(1, 2));   // 3

// 导入整个模块对象
const math = require('./math');
math.add(3, 4);
```

```js
// 内置模块同样用 require（第 5 章展开）
const fs = require('fs');
const path = require('path');
```

特征：

- **同步加载**：require 会阻塞后续代码直到模块读完
- **动态**：`require(条件 ? './a' : './b')` 可以运行时决定
- **值拷贝**：导出的是值的快照，导入方拿到后模块再改不影响已拿到的值

## 4.3 ES Module：import 与 export

```js
// math.mjs / 或项目声明为 ESM 的 .js —— 导出
export function add(a, b) {
  return a + b;
}
export const PI = 3.14;
export default function main() {}   // 默认导出

// app.js —— 导入
import main, { add, PI } from './math.mjs';   // 默认导出不带花括号
```

特征：

- **静态解析**：import 必须写在顶层、路径是字符串字面量——编译期就能确定依赖图
- **异步加载**：模块按依赖图并行加载
- **实时绑定**：导出的是"引用"，模块内改了值，导入方读到的也是新值

```js
// 动态导入：返回 Promise（弥补"静态"的限制）
const moduleA = await import('./heavy.mjs');
```

## 4.4 如何声明项目用哪套

Node 靠 `package.json` 的 `type` 字段区分：

```json
{
  "type": "module"     // .js 文件按 ESM 解析
}
```

| type 设置 | .js 文件 | .mjs 文件 | .cjs 文件 |
| --- | --- | --- | --- |
| 无（默认） | CommonJS | 永远 ESM | 永远 CJS |
| `"module"` | **ESM** | 永远 ESM | 永远 CJS |
| `"commonjs"` | CommonJS | 永远 ESM | 永远 CJS |

规则总结：**`.mjs` 强制 ESM、`.cjs` 强制 CJS、`.js` 看项目 type**。

::: tip 新项目怎么选
直接 `"type": "module"`（ESM）——这是 Vite、Vue、React 生态的默认方向，且浏览器端语法完全一致。老项目/某些只发 CJS 的库维护时按需用 CJS。
:::

## 4.5 ESM 下的路径细节

ESM 的相对路径**必须写全**，与 CJS 的宽松规则不同：

```js
// CJS：这些都能省
require('./utils')       // 自动补 .js / index.js

// ESM：必须完整
import { add } from './utils.js'      // ✅ 扩展名必须写
import { add } from './utils'         // ❌ ERR_MODULE_NOT_FOUND
```

另一个区别：ESM 中 `__dirname` / `__filename` 不存在（它们是 CJS 的概念），需要时自己造：

```js
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// import.meta.url 是当前模块的 file:// 地址
```

## 4.6 CJS 与 ESM 互操作

现代 Node 支持有限互通：

```js
// ESM 中引入 CJS 模块：默认导出 = module.exports
import lodash from 'lodash';        // ✅ 主流 CJS 包都能这样用
import cjsModule from './legacy.cjs';

// CJS 中引入 ESM：不能 require，只能动态 import
const esm = await import('./modern.mjs');
```

::: warning require(esm) 的演进
Node 22 起实验性支持在 CJS 中 `require` ESM（无顶层 await 的模块），但生态尚未完全铺开——写兼容代码时按"ESM 里可以引 CJS，反过来用动态 import"的规则最稳。
:::

## 4.7 综合示例：双体系对照

同一个工具模块的两种写法：

```js
// ── CommonJS 版：format.cjs ──
function currency(n) {
  return `¥${n.toFixed(2)}`;
}
module.exports = { currency };

// 使用
const { currency } = require('./format.cjs');
```

```js
// ── ESM 版：format.mjs ──
export function currency(n) {
  return `¥${n.toFixed(2)}`;
}

// 使用
import { currency } from './format.mjs';
```

读第三方文档时按 `require` / `import` 快速识别它属于哪个体系，再对照本文对应小节即可。

## 本章小结

- CJS：require/module.exports，同步、动态、值拷贝；ESM：import/export，静态、异步、实时绑定
- 项目用 `package.json` 的 `type: "module"` 声明；.mjs/.cjs 强制指定
- ESM 路径必须写全扩展名；`__dirname` 需用 import.meta.url 重建
- ESM 引 CJS 直接 import；CJS 引 ESM 用动态 import
