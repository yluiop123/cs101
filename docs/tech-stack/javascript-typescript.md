<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: 'JavaScript / TypeScript 技术路线',
  description: 'JS/TS 是前端开发的核心语言，同时在全栈和 WebGIS 领域也占据重要地位。',

  items: [
    {
      name: 'JavaScript 核心基础',
      subtitle: '必修',
      children: [
        {
          title: 'JavaScript 语言概述',
          description: '历史与版本、浏览器控制台、开发工具链',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 Web 前端教程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "JavaScript Full Course", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MDN JavaScript 指南", url: "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide", icon: "mdi-file-document-outline" },
                { title: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '基本语法',
          description: '变量声明 var/let/const、数据类型、运算符、类型转换',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "黑马 JavaScript 教程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "JS Basics", url: "https://www.youtube.com/watch?v=W6NZfCO5pJ4", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 JavaScript", url: "https://www.runoob.com/js/js-tutorial.html", icon: "mdi-file-document-outline" },
                { title: "W3Schools JS", url: "https://www.w3schools.com/js/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '流程控制与循环',
          description: 'if/switch、for/while/do-while、break/continue',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "JavaScript 流程控制", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "JS Control Flow", url: "https://www.youtube.com/watch?v=IsG4Xd6LlsM", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MDN 流程控制", url: "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Control_flow_and_error_handling", icon: "mdi-file-document-outline" },
                { title: "MDN Control Flow", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '函数详解',
          description: '函数声明与表达式、箭头函数、参数默认值、rest 参数',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "JavaScript 函数", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "JS Functions", url: "https://www.youtube.com/watch?v=AY6X5j-ZP4k", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MDN 函数", url: "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Functions", icon: "mdi-file-document-outline" },
                { title: "MDN Functions", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '数组与对象',
          description: '数组方法（map/filter/reduce/find）、对象属性描述符',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "JavaScript 数组", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "JS Arrays", url: "https://www.youtube.com/watch?v=R8rmfR9Y1Jw", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 JS 数组", url: "https://www.runoob.com/js/js-array.html", icon: "mdi-file-document-outline" },
                { title: "MDN Arrays", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '字符串与模板字面量',
          description: '字符串方法、模板字符串、标签函数',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "JavaScript 字符串", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "JS Strings", url: "https://www.youtube.com/watch?v=09_B0e2C-Vs", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MDN 字符串", url: "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String", icon: "mdi-file-document-outline" },
                { title: "MDN Strings", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'DOM 操作',
          description: '元素选择、事件监听、DOM 增删改、事件冒泡与捕获',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "DOM 教程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "DOM", url: "https://www.youtube.com/watch?v=0ik6X4DJKCc", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MDN DOM", url: "https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model", icon: "mdi-file-document-outline" },
                { title: "MDN DOM", url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'BOM 与浏览器 API',
          description: 'window/document/location、setTimeout/setInterval、localStorage',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "BOM 教程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "BOM", url: "https://www.youtube.com/watch?v=3PHX0i8aH54", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MDN BOM", url: "https://developer.mozilla.org/zh-CN/docs/Web/API/Window", icon: "mdi-file-document-outline" },
                { title: "MDN Web APIs", url: "https://developer.mozilla.org/en-US/docs/Web/API", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        }
      ]
    },
    {
      name: 'ES6+ 与现代 JavaScript',
      subtitle: '必修',
      children: [
        {
          title: '解构赋值',
          description: '数组解构、对象解构、嵌套解构、默认值',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "ES6 解构赋值", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "ES6 Destructuring", url: "https://www.youtube.com/watch?v=NIq3qLaHCIs", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "阮一峰 ES6 解构", url: "https://es6.ruanyifeng.com/#docs/destructuring", icon: "mdi-file-document-outline" },
                { title: "MDN Destructuring", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '展开运算符与剩余参数',
          description: '数组/对象展开、函数参数收集',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "ES6 展开运算符", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "Spread Operator", url: "https://www.youtube.com/watch?v=1Ucdfn1KQ-o", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "阮一峰 扩展运算符", url: "https://es6.ruanyifeng.com/#docs/array#%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6", icon: "mdi-file-document-outline" },
                { title: "MDN Spread", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Promise 与异步编程',
          description: '回调地狱、Promise 链式调用、async/await、微任务队列',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "JavaScript 异步编程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "Async JS", url: "https://www.youtube.com/watch?v=ZYb_ZU8LNxs", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "阮一峰 Promise", url: "https://es6.ruanyifeng.com/#docs/promise", icon: "mdi-file-document-outline" },
                { title: "MDN Promise", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '模块化',
          description: 'ES Module import/export、CommonJS 对比、动态导入',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "ES Modules 教程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "JS Modules", url: "https://www.youtube.com/watch?v=cRHQNNcYf6s", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "阮一峰 Module", url: "https://es6.ruanyifeng.com/#docs/module", icon: "mdi-file-document-outline" },
                { title: "MDN Modules", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Map、Set、WeakMap、WeakSet',
          description: '新集合类型、垃圾回收优化',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "ES6 集合类型", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "Map Set", url: "https://www.youtube.com/watch?v=4B4Q0rTZ2o0", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "阮一峰 Set/Map", url: "https://es6.ruanyifeng.com/#docs/set-map", icon: "mdi-file-document-outline" },
                { title: "MDN Map", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Symbol 与迭代器',
          description: 'Symbol 内置属性、可迭代协议、for...of',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Symbol 教程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "Symbol", url: "https://www.youtube.com/watch?v=4Jd8NeoThI4", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "阮一峰 Symbol", url: "https://es6.ruanyifeng.com/#docs/symbol", icon: "mdi-file-document-outline" },
                { title: "MDN Symbol", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '生成器 Generator',
          description: 'function* 声明、yield 暂停、异步生成器',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Generator 教程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "Generators", url: "https://www.youtube.com/watch?v=IJ6EgdiI_wU", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "阮一峰 Generator", url: "https://es6.ruanyifeng.com/#docs/generator", icon: "mdi-file-document-outline" },
                { title: "MDN Generator", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Proxy 与 Reflect',
          description: '元编程、响应式原理基础、数据劫持',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Proxy 教程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "Proxy", url: "https://www.youtube.com/watch?v=vmxSyM0_sBw", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "阮一峰 Proxy", url: "https://es6.ruanyifeng.com/#docs/proxy", icon: "mdi-file-document-outline" },
                { title: "MDN Proxy", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '正则表达式进阶',
          description: '前瞻/后瞻断言、命名捕获组、RegExp 方法',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "正则表达式教程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "Regex", url: "https://www.youtube.com/watch?v=rhzKDrUiJVk", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MDN 正则", url: "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions", icon: "mdi-file-document-outline" },
                { title: "MDN RegExp", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'ES6+ 参考资源',
          description: '全面了解 ES6+ 新特性',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "阮一峰 ES6 教程", url: "https://es6.ruanyifeng.com/", icon: "mdi-file-document-outline" },
                { title: "ES6 Features", url: "https://github.com/lukehoban/es6features", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        }
      ]
    },
    {
      name: 'TypeScript 类型系统',
      subtitle: '必修',
      children: [
        {
          title: 'TypeScript 基础',
          description: '安装配置、tsconfig.json、编译选项',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 TypeScript 教程", url: "https://www.bilibili.com/video/BV1Zg4y1v7jY", icon: "mdi-play-circle-outline" },
                { title: "TypeScript", url: "https://www.youtube.com/watch?v=gp5H0Vw39yw", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "TypeScript 官方文档", url: "https://www.typescriptlang.org/zh/docs/", icon: "mdi-file-document-outline" },
                { title: "TypeScript Official Docs", url: "https://www.typescriptlang.org/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '基础类型',
          description: 'any/unknown/never/void、字面量类型、联合类型、交叉类型',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "TS 基础类型", url: "https://www.bilibili.com/video/BV1Zg4y1v7jY", icon: "mdi-play-circle-outline" },
                { title: "TS Types", url: "https://www.youtube.com/watch?v=2pZmKW9-I_k", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "TypeScript 基础类型", url: "https://www.typescriptlang.org/zh/docs/handbook/basic-types.html", icon: "mdi-file-document-outline" },
                { title: "TS Handbook", url: "https://www.typescriptlang.org/docs/handbook/basic-types.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '接口 Interface',
          description: '可选属性、只读属性、函数类型、索引签名、接口继承',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "TS 接口教程", url: "https://www.bilibili.com/video/BV1Zg4y1v7jY", icon: "mdi-play-circle-outline" },
                { title: "TS Interfaces", url: "https://www.youtube.com/watch?v=PDmB1pGYsoI", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "TypeScript 接口", url: "https://www.typescriptlang.org/zh/docs/handbook/interfaces.html", icon: "mdi-file-document-outline" },
                { title: "TS Interfaces", url: "https://www.typescriptlang.org/docs/handbook/interfaces.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '类与面向对象',
          description: '访问修饰符、抽象类、implements、装饰器',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "TS 类教程", url: "https://www.bilibili.com/video/BV1Zg4y1v7jY", icon: "mdi-play-circle-outline" },
                { title: "TS Classes", url: "https://www.youtube.com/watch?v=K1iu1kXkVoA", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "TypeScript 类", url: "https://www.typescriptlang.org/zh/docs/handbook/classes.html", icon: "mdi-file-document-outline" },
                { title: "TS Classes", url: "https://www.typescriptlang.org/docs/handbook/classes.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '泛型',
          description: '泛型函数/类/接口、泛型约束、条件类型、infer 推断',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "TS 泛型教程", url: "https://www.bilibili.com/video/BV1Zg4y1v7jY", icon: "mdi-play-circle-outline" },
                { title: "TS Generics", url: "https://www.youtube.com/watch?v=nViEqpgwxHE", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "TypeScript 泛型", url: "https://www.typescriptlang.org/zh/docs/handbook/generics.html", icon: "mdi-file-document-outline" },
                { title: "TS Generics", url: "https://www.typescriptlang.org/docs/handbook/generics.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '类型工具',
          description: 'Partial/Required/Readonly/Pick/Omit/Record 工具类型',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "TS 类型工具", url: "https://www.bilibili.com/video/BV1Zg4y1v7jY", icon: "mdi-play-circle-outline" },
                { title: "TS Utility Types", url: "https://www.youtube.com/watch?v=4cKb4yeJ-LU", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "TypeScript 工具类型", url: "https://www.typescriptlang.org/zh/docs/handbook/utility-types.html", icon: "mdi-file-document-outline" },
                { title: "TS Utility Types", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '类型守卫与类型断言',
          description: 'typeof、instanceof、自定义守卫、as 断言',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "TS 类型守卫", url: "https://www.bilibili.com/video/BV1Zg4y1v7jY", icon: "mdi-play-circle-outline" },
                { title: "Type Guards", url: "https://www.youtube.com/watch?v=9N4M8b_37tY", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "TypeScript 类型守卫", url: "https://www.typescriptlang.org/zh/docs/handbook/advanced-types.html", icon: "mdi-file-document-outline" },
                { title: "TS Advanced Types", url: "https://www.typescriptlang.org/docs/handbook/advanced-types.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '声明文件',
          description: '.d.ts 文件编写、模块声明、全局类型声明',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "TypeScript 声明文件", url: "https://www.typescriptlang.org/zh/docs/handbook/declaration-files/introduction.html", icon: "mdi-file-document-outline" },
                { title: "TS Declaration", url: "https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '模板字面量类型',
          description: '模板字面量字符串、联合类型推导',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "TS 模板字面量", url: "https://www.typescriptlang.org/zh/docs/handbook/2/template-literal-types.html", icon: "mdi-file-document-outline" },
                { title: "TS Template Literals", url: "https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '装饰器',
          description: '类装饰器、方法装饰器、属性装饰器、参数装饰器',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "TypeScript 装饰器", url: "https://www.typescriptlang.org/zh/docs/handbook/decorators.html", icon: "mdi-file-document-outline" },
                { title: "TS Decorators", url: "https://www.typescriptlang.org/docs/handbook/decorators.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        }
      ]
    },
    {
      name: '前端框架',
      subtitle: '必修',
      children: [
        {
          title: 'React 核心',
          description: 'JSX 语法、函数组件、Hooks（useState/useEffect/useContext）',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 React 教程", url: "https://www.bilibili.com/video/BV1jJ411k7g4", icon: "mdi-play-circle-outline" },
                { title: "React", url: "https://www.youtube.com/watch?v=Ke90Tje7VS0", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "React 官方文档", url: "https://zh-hans.react.dev/", icon: "mdi-file-document-outline" },
                { title: "React Official Docs", url: "https://react.dev/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'React 进阶',
          description: 'useReducer/useMemo/useCallback/useRef、自定义 Hooks',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "React Hooks 教程", url: "https://www.bilibili.com/video/BV1jJ411k7g4", icon: "mdi-play-circle-outline" },
                { title: "React Hooks", url: "https://www.youtube.com/watch?v=TNhaISOUy6Q", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "React Hooks 中文", url: "https://zh-hans.react.dev/reference/react", icon: "mdi-file-document-outline" },
                { title: "React Hooks Docs", url: "https://react.dev/reference/react", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'React 状态管理',
          description: 'Context API、Zustand、Redux Toolkit、React Query',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Redux 教程", url: "https://www.bilibili.com/video/BV1jJ411k7g4", icon: "mdi-play-circle-outline" },
                { title: "Redux", url: "https://www.youtube.com/watch?v=zrs7u6bdbUw", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Redux 中文文档", url: "https://www.redux.org.cn/", icon: "mdi-file-document-outline" },
                { title: "Redux Docs", url: "https://redux.js.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'React 路由',
          description: 'React Router v6、嵌套路由、路由守卫、懒加载',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "React Router 教程", url: "https://www.bilibili.com/video/BV1jJ411k7g4", icon: "mdi-play-circle-outline" },
                { title: "React Router", url: "https://www.youtube.com/watch?v=Ul3y1LXx0UY", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "React Router 中文", url: "https://reactrouter.com/en/main", icon: "mdi-file-document-outline" },
                { title: "React Router Docs", url: "https://reactrouter.com/en/main", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Vue 3 核心',
          description: 'Composition API、ref/reactive、生命周期、指令系统',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 Vue 3 教程", url: "https://www.bilibili.com/video/BV1Zy4y1K7SH", icon: "mdi-play-circle-outline" },
                { title: "Vue 3", url: "https://www.youtube.com/watch?v=RX_xBz7sOjI", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Vue 3 官方文档", url: "https://cn.vuejs.org/", icon: "mdi-file-document-outline" },
                { title: "Vue 3 Official Docs", url: "https://vuejs.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Vue 3 进阶',
          description: 'Teleport/Suspense、Pinia 状态管理、Vue Router',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Pinia 教程", url: "https://www.bilibili.com/video/BV1Zy4y1K7SH", icon: "mdi-play-circle-outline" },
                { title: "Pinia", url: "https://www.youtube.com/watch?v=T4oMDj5_xrA", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Pinia 中文", url: "https://pinia.vuejs.org/zh/", icon: "mdi-file-document-outline" },
                { title: "Pinia Docs", url: "https://pinia.vuejs.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '组件化开发',
          description: '组件通信、高阶组件 HOC、Render Props、插槽',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "React 组件化", url: "https://www.bilibili.com/video/BV1jJ411k7g4", icon: "mdi-play-circle-outline" },
                { title: "Component Patterns", url: "https://www.youtube.com/watch?v=YaZg8wg3S2E", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Vue 组件", url: "https://cn.vuejs.org/guide/essentials/component-basics.html", icon: "mdi-file-document-outline" },
                { title: "React Components", url: "https://react.dev/learn/thinking-in-react", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'UI 框架',
          description: 'Ant Design / Element Plus / ShadCN / Tailwind CSS',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Tailwind 教程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "Tailwind", url: "https://www.youtube.com/watch?v=UBOj6rqRUME", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Ant Design 中文", url: "https://ant.design/index-cn", icon: "mdi-file-document-outline" },
                { title: "Tailwind Docs", url: "https://tailwindcss.com/docs", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '框架原理',
          description: 'Virtual DOM diff 算法、响应式原理、Fiber 架构',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "React 原理", url: "https://www.bilibili.com/video/BV1jJ411k7g4", icon: "mdi-play-circle-outline" },
                { title: "Virtual DOM", url: "https://www.youtube.com/watch?v=BYbgopx44vo", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "React 原理", url: "https://zh-hans.react.dev/learn", icon: "mdi-file-document-outline" },
                { title: "React Docs", url: "https://react.dev/learn", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '测试框架',
          description: 'Vitest / Jest / Testing Library、组件测试、E2E 测试 Playwright',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "前端测试教程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "Testing", url: "https://www.youtube.com/watch?v=4kNfeU7wBdI", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Vitest 中文", url: "https://cn.vitest.dev/", icon: "mdi-file-document-outline" },
                { title: "Playwright Docs", url: "https://playwright.dev/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        }
      ]
    },
    {
      name: '前端工程化与性能优化',
      subtitle: '必修',
      children: [
        {
          title: 'Vite 构建工具',
          description: '快速搭建项目、HMR 热更新、环境变量与模式',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Vite 教程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "Vite", url: "https://www.youtube.com/watch?v=KCrXgy8QtjM", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Vite 官方文档", url: "https://cn.vitejs.dev/", icon: "mdi-file-document-outline" },
                { title: "Vite Official Docs", url: "https://vitejs.dev/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Webpack 核心',
          description: 'Loader 与 Plugin、代码分割、Tree Shaking、缓存策略',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Webpack 教程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "Webpack", url: "https://www.youtube.com/watch?v=IZGNcSuwBps", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Webpack 中文", url: "https://webpack.docschina.org/", icon: "mdi-file-document-outline" },
                { title: "Webpack Docs", url: "https://webpack.js.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '包管理器',
          description: 'npm / yarn / pnpm、workspace 多包管理、lock 文件',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "pnpm 教程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "npm", url: "https://www.youtube.com/watch?v=2V1UUhBJ62Y", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "pnpm 中文", url: "https://pnpm.io/zh/", icon: "mdi-file-document-outline" },
                { title: "npm Docs", url: "https://docs.npmjs.com/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'CSS 工程化',
          description: 'CSS Modules、Tailwind CSS PostCSS、CSS-in-JS',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "CSS 工程化", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "CSS", url: "https://www.youtube.com/watch?v=1eIRTdgzHtw", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MDN CSS", url: "https://developer.mozilla.org/zh-CN/docs/Web/CSS", icon: "mdi-file-document-outline" },
                { title: "MDN CSS", url: "https://developer.mozilla.org/en-US/docs/Web/CSS", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Git 协作',
          description: '分支策略、代码审查、Commit 规范（Conventional Commits）',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Git 教程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "Git", url: "https://www.youtube.com/watch?v=8JJ101D3knE", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "廖雪峰 Git 教程", url: "https://www.liaoxuefeng.com/wiki/896043488029600", icon: "mdi-file-document-outline" },
                { title: "Git Docs", url: "https://git-scm.com/doc", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '浏览器渲染原理',
          description: '关键渲染路径、重排/重绘、图层与合成',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "浏览器渲染教程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "Browser Rendering", url: "https://www.youtube.com/watch?v=SmE4OwHztCc", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MDN 渲染", url: "https://developer.mozilla.org/zh-CN/docs/Web/Performance", icon: "mdi-file-document-outline" },
                { title: "Web Performance", url: "https://web.dev/learn-core-web-vitals/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '性能优化',
          description: '懒加载、图片优化、CDN 加速、首屏加载优化、性能监控',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "前端性能优化", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "Performance", url: "https://www.youtube.com/watch?v=0fONene3OII", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Web 性能优化", url: "https://developer.mozilla.org/zh-CN/docs/Web/Performance", icon: "mdi-file-document-outline" },
                { title: "Web Vitals", url: "https://web.dev/vitals/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '前端安全',
          description: 'XSS 防御、CSRF 防御、CSP 内容安全策略',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "前端安全教程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "Web Security", url: "https://www.youtube.com/watch?v=4caGY2iN1iU", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MDN 安全", url: "https://developer.mozilla.org/zh-CN/docs/Web/Security", icon: "mdi-file-document-outline" },
                { title: "OWASP", url: "https://owasp.org/www-project-top-ten/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '微前端',
          description: 'Module Federation、qiankun 沙箱、子应用通信',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "微前端教程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "Micro Frontends", url: "https://www.youtube.com/watch?v=l3K7SR5R1cw", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "qiankun 中文", url: "https://qiankun.umijs.org/zh/", icon: "mdi-file-document-outline" },
                { title: "Module Federation", url: "https://module-federation.io/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '构建工具对比',
          description: 'Rollup / esbuild / Turbopack / SWC',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "esbuild 中文", url: "https://esbuild.docschina.org/", icon: "mdi-file-document-outline" },
                { title: "Turbopack Docs", url: "https://turbo.build/pack/docs", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        }
      ]
    },
    {
      name: '全栈开发与工程化',
      subtitle: '选修',
      children: [
        {
          title: 'Node.js 运行时',
          description: 'CommonJS 模块、Event Loop、Buffer/Stream、child_process',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Node.js 教程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "Node.js", url: "https://www.youtube.com/watch?v=Oe421EPjeBE", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Node.js 官方文档", url: "https://nodejs.org/zh-cn/docs/", icon: "mdi-file-document-outline" },
                { title: "Node.js Docs", url: "https://nodejs.org/en/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Express / Koa 框架',
          description: '中间件机制、路由、错误处理、REST API',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Express 教程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "Express", url: "https://www.youtube.com/watch?v=L72fhGm1tfE", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Express 中文", url: "https://expressjs.com/zh-cn/", icon: "mdi-file-document-outline" },
                { title: "Express Docs", url: "https://expressjs.com/en/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Nest.js 全栈框架',
          description: '模块/控制器/服务、依赖注入、GraphQL 支持、WebSocket',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Nest.js 教程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "Nest.js", url: "https://www.youtube.com/watch?v=0M8AYU_hPas", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Nest.js 中文", url: "https://nestjs.cn/", icon: "mdi-file-document-outline" },
                { title: "Nest.js Docs", url: "https://docs.nestjs.com/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Next.js / Nuxt.js',
          description: 'SSR/SSG/ISR 渲染模式、文件路由、API Routes',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Next.js 教程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "Next.js", url: "https://www.youtube.com/watch?v=Y6KDk5iHaWc", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Next.js 官方教程", url: "https://nextjs.org/learn", icon: "mdi-file-document-outline" },
                { title: "Next.js Official Docs", url: "https://nextjs.org/docs", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '数据库集成',
          description: 'Prisma / TypeORM、Mongoose MongoDB、Sequelize',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Prisma 教程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "Prisma", url: "https://www.youtube.com/watch?v=RebA5J-rlwg", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Prisma 中文", url: "https://www.prisma.io/docs", icon: "mdi-file-document-outline" },
                { title: "Prisma Docs", url: "https://www.prisma.io/docs", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'GraphQL / tRPC',
          description: 'Schema 定义、Resolver、Apollo Server、类型安全的 API',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "GraphQL 教程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "GraphQL", url: "https://www.youtube.com/watch?v=ZQL7tL2S0oQ", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "GraphQL 中文", url: "https://graphql.cn/", icon: "mdi-file-document-outline" },
                { title: "GraphQL Docs", url: "https://graphql.org/learn/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '认证与授权',
          description: 'NextAuth.js、Passport.js、JWT、Session 管理',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "NextAuth 教程", url: "https://www.bilibili.com/video/BV1X7411m1Ex", icon: "mdi-play-circle-outline" },
                { title: "NextAuth", url: "https://www.youtube.com/watch?v=2eRQ0di64tA", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "NextAuth 中文", url: "https://next-auth.js.org/", icon: "mdi-file-document-outline" },
                { title: "NextAuth Docs", url: "https://next-auth.js.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Docker 部署',
          description: 'Dockerfile 多阶段构建、Nginx 反向代理、pm2 进程管理',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Docker 部署教程", url: "https://www.bilibili.com/video/BV1gr4y1F7rs", icon: "mdi-play-circle-outline" },
                { title: "Docker", url: "https://www.youtube.com/watch?v=3c8m9v1Tg5I", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Docker 从入门到实践", url: "https://vuepress.mirror.docker-practice.com/", icon: "mdi-file-document-outline" },
                { title: "Docker Docs", url: "https://docs.docker.com/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        }
      ]
    },
    {
      name: 'WebGIS 方向',
      subtitle: '选修',
      children: [
        {
          title: 'Leaflet',
          description: '地图加载、标记与弹窗、图层控制、瓦片服务',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 WebGIS 教程", url: "https://www.bilibili.com/video/BV1fA411C7Yp", icon: "mdi-play-circle-outline" },
                { title: "Leaflet", url: "https://www.youtube.com/watch?v=3y7i1s6uFas", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Leaflet 中文", url: "https://leafletjs.com/", icon: "mdi-file-document-outline" },
                { title: "Leaflet Docs", url: "https://leafletjs.com/reference.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'OpenLayers',
          description: '矢量图层、空间查询、投影转换、动画',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "OpenLayers 教程", url: "https://www.bilibili.com/video/BV1fA411C7Yp", icon: "mdi-play-circle-outline" },
                { title: "OpenLayers", url: "https://www.youtube.com/watch?v=H_5sDv7F0qM", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "OpenLayers 中文", url: "https://openlayers.org/", icon: "mdi-file-document-outline" },
                { title: "OpenLayers Docs", url: "https://openlayers.org/en/latest/apidoc/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Cesium',
          description: '三维地球、3D Tiles、时间轴动画、地形分析',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Cesium 教程", url: "https://www.bilibili.com/video/BV1fA411C7Yp", icon: "mdi-play-circle-outline" },
                { title: "Cesium", url: "https://www.youtube.com/watch?v=UeJCaKYIksw", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Cesium 中文", url: "https://cesium.com/platform/cesiumjs/", icon: "mdi-file-document-outline" },
                { title: "Cesium Docs", url: "https://cesium.com/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'GeoJSON / TopoJSON',
          description: '地理数据格式、样式配置、交互',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "GeoJSON 中文", url: "https://geojson.org/", icon: "mdi-file-document-outline" },
                { title: "GeoJSON Spec", url: "https://geojson.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '地图可视化',
          description: 'Mapbox GL、Deck.gl、ECharts Geo',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Mapbox 教程", url: "https://www.bilibili.com/video/BV1fA411C7Yp", icon: "mdi-play-circle-outline" },
                { title: "Mapbox", url: "https://www.youtube.com/watch?v=OyUJk3M1hxw", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Mapbox 中文", url: "https://docs.mapbox.com/", icon: "mdi-file-document-outline" },
                { title: "Mapbox Docs", url: "https://docs.mapbox.com/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '空间数据库',
          description: 'PostGIS 空间查询、GeoServer 地图服务',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "PostGIS 中文", url: "https://postgis.net/", icon: "mdi-file-document-outline" },
                { title: "PostGIS Docs", url: "https://postgis.net/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        }
      ]
    }
  ]
}
</script>
<ContentView :data="data" />
