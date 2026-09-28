// 技术路线数据（卡片与拓展资源）。当前页面渲染站内教程，此数据暂未被引用，保留备用。
export default {
  name: 'JavaScript / TypeScript 技术路线',
  description: 'JS/TS 是前端开发的核心语言，同时在全栈和 WebGIS 领域也占据重要地位。',
  items: [
    {
      name: '入门 · 通用工具与语言基础',
      subtitle: '必修',
      children: [
        {
          title: '编辑器与 VS Code',
          description: '安装与基础配置、必备插件、核心功能与效率进阶',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'VS Code 系列教程总览', url: '/tutorials/vscode/' },
                { title: '初识 VS Code', url: '/tutorials/vscode/01-overview' },
                { title: '安装与基础配置', url: '/tutorials/vscode/02-setup' },
                { title: '必备插件推荐', url: '/tutorials/vscode/03-extensions' },
                { title: '核心功能详解', url: '/tutorials/vscode/04-features' },
                { title: '效率进阶', url: '/tutorials/vscode/05-productivity' }
              ]
            }
          ]
        },
        {
          title: 'Git 版本控制',
          description: '仓库与工作区、分支管理、远程仓库与团队协作流程',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'Git', url: '/tutorials/git/' },
                { title: '版本控制与 Git 入门', url: '/tutorials/git/01-introduction' },
                { title: '基础操作', url: '/tutorials/git/02-basic' },
                { title: '分支管理', url: '/tutorials/git/03-branch' },
                { title: '远程仓库与 GitHub', url: '/tutorials/git/04-remote' },
                { title: '团队协作流程', url: '/tutorials/git/05-collaboration' },
                { title: '进阶技巧', url: '/tutorials/git/06-advanced' },
                { title: '实战场景与最佳实践', url: '/tutorials/git/07-best-practices' }
              ]
            }
          ]
        },
        {
          title: 'Markdown 技术写作',
          description: '基础语法、表格与代码块、GFM 扩展与写作工作流',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'Markdown 系列教程总览', url: '/tutorials/markdown/' },
                { title: 'Markdown 基础语法', url: '/tutorials/markdown/01-basic-syntax' },
                { title: '表格、代码块与链接图片', url: '/tutorials/markdown/02-tables-code' },
                { title: 'GFM 扩展语法', url: '/tutorials/markdown/03-gfm' },
                { title: '工具链与写作工作流', url: '/tutorials/markdown/04-toolchain' }
              ]
            }
          ]
        },
        {
          title: '正则表达式',
          description: '元字符与字符类、量词分组、常用匹配场景与各语言差异',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: '正则表达式系列教程总览', url: '/tutorials/regex/' },
                { title: '初识正则表达式', url: '/tutorials/regex/01-introduction' },
                { title: '元字符与字符类', url: '/tutorials/regex/02-characters' },
                { title: '量词、分组与引用', url: '/tutorials/regex/03-quantifiers-groups' },
                { title: '常用场景实战', url: '/tutorials/regex/04-practice' },
                { title: '各语言中的正则', url: '/tutorials/regex/05-languages' }
              ]
            }
          ]
        },
        {
          title: 'JavaScript',
          description: '从语法基础到异步与模块化的本站系统教程',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'JavaScript 系列教程总览', url: '/tutorials/javascript/' },
                { title: '初识 JavaScript', url: '/tutorials/javascript/01-overview' },
                { title: '变量与数据类型', url: '/tutorials/javascript/02-variables' },
                { title: '运算符与流程控制', url: '/tutorials/javascript/03-operators-control' },
                { title: '函数基础', url: '/tutorials/javascript/04-functions' },
                { title: '对象入门', url: '/tutorials/javascript/05-objects' },
                { title: '数组', url: '/tutorials/javascript/06-arrays' },
                { title: '字符串与内置对象', url: '/tutorials/javascript/07-strings-builtin' },
                { title: '深入函数：闭包与递归', url: '/tutorials/javascript/08-closures-recursion' },
                { title: '面向对象与原型', url: '/tutorials/javascript/09-prototype-class' },
                { title: 'DOM（上）：查找与操作', url: '/tutorials/javascript/10-dom-1' },
                { title: 'DOM（下）：事件处理', url: '/tutorials/javascript/11-dom-2' },
                { title: 'BOM 与浏览器存储', url: '/tutorials/javascript/12-bom-storage' },
                { title: '异步编程', url: '/tutorials/javascript/13-async' },
                { title: '模块化与综合实战', url: '/tutorials/javascript/14-modules-project' }
              ]
            }
          ]
        },
        {
          title: 'TypeScript',
          description: '类型系统、泛型、类型编程与工程化配置的本站系统教程',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'TypeScript 系列教程总览', url: '/tutorials/typescript/' },
                { title: '初识 TypeScript', url: '/tutorials/typescript/01-overview' },
                { title: '基础类型', url: '/tutorials/typescript/02-basic-types' },
                { title: '接口与类型别名', url: '/tutorials/typescript/03-interface-type' },
                { title: '函数与类型', url: '/tutorials/typescript/04-functions' },
                { title: '联合类型与类型收窄', url: '/tutorials/typescript/05-unions-narrowing' },
                { title: '泛型', url: '/tutorials/typescript/06-generics' },
                { title: '枚举与类型编程入门', url: '/tutorials/typescript/07-enum-mapped' },
                { title: '类与面向对象', url: '/tutorials/typescript/08-class' },
                { title: '工程化配置', url: '/tutorials/typescript/09-tsconfig' },
                { title: '综合实战', url: '/tutorials/typescript/10-project' }
              ]
            }
          ]
        },
        {
          title: 'Node.js',
          description: 'npm 与 pnpm、模块系统、Express 与部署的本站系统教程',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'Node.js 系列教程总览', url: '/tutorials/nodejs/' },
                { title: '初识 Node.js 与安装', url: '/tutorials/nodejs/01-overview' },
                { title: 'npm 基础：package.json 与依赖安装', url: '/tutorials/nodejs/02-npm-basic' },
                { title: 'pnpm 与现代包管理', url: '/tutorials/nodejs/03-pnpm' },
                { title: '模块系统：CommonJS 与 ESM', url: '/tutorials/nodejs/04-modules' },
                { title: '核心模块：path / fs / http', url: '/tutorials/nodejs/05-core-modules' },
                { title: 'Node 中的异步与事件循环', url: '/tutorials/nodejs/06-async-loop' },
                { title: 'npm 进阶：脚本、发布与依赖治理', url: '/tutorials/nodejs/07-npm-advanced' },
                { title: 'workspace 与 monorepo', url: '/tutorials/nodejs/08-workspace-monorepo' },
                { title: 'Express 入门', url: '/tutorials/nodejs/09-express' },
                { title: 'REST API 实战', url: '/tutorials/nodejs/10-rest-api' },
                { title: '环境变量与调试', url: '/tutorials/nodejs/11-env-debug' },
                { title: '部署与 PM2', url: '/tutorials/nodejs/12-deploy-pm2' }
              ]
            }
          ]
        },
        {
          title: 'JavaScript 语言概述',
          description: '历史与版本、浏览器控制台、开发工具链',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'JavaScript 系列教程总览', url: '/tutorials/javascript/' },
                { title: '初识 JavaScript', url: '/tutorials/javascript/01-overview' }
              ]
            },
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '尚硅谷 Web 前端教程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'JavaScript Full Course', url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'MDN JavaScript 指南', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide', icon: 'mdi-file-document-outline' },
                { title: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '基本语法',
          description: '变量声明 var/let/const、数据类型、运算符、类型转换',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'JavaScript 系列教程总览', url: '/tutorials/javascript/' },
                { title: '变量与数据类型', url: '/tutorials/javascript/02-variables' },
                { title: '运算符与流程控制', url: '/tutorials/javascript/03-operators-control' }
              ]
            },
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '黑马 JavaScript 教程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'JS Basics', url: 'https://www.youtube.com/watch?v=W6NZfCO5pJ4', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '菜鸟教程 JavaScript', url: 'https://www.runoob.com/js/js-tutorial.html', icon: 'mdi-file-document-outline' },
                { title: 'W3Schools JS', url: 'https://www.w3schools.com/js/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '流程控制与循环',
          description: 'if/switch、for/while/do-while、break/continue',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'JavaScript 系列教程总览', url: '/tutorials/javascript/' },
                { title: '运算符与流程控制', url: '/tutorials/javascript/03-operators-control' }
              ]
            },
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'JavaScript 流程控制', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'JS Control Flow', url: 'https://www.youtube.com/watch?v=IsG4Xd6LlsM', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'MDN 流程控制', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Control_flow_and_error_handling', icon: 'mdi-file-document-outline' },
                { title: 'MDN Control Flow', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '函数详解',
          description: '函数声明与表达式、箭头函数、参数默认值、rest 参数',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'JavaScript 系列教程总览', url: '/tutorials/javascript/' },
                { title: '函数基础', url: '/tutorials/javascript/04-functions' },
                { title: '深入函数：闭包与递归', url: '/tutorials/javascript/08-closures-recursion' }
              ]
            },
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'JavaScript 函数', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'JS Functions', url: 'https://www.youtube.com/watch?v=AY6X5j-ZP4k', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'MDN 函数', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Functions', icon: 'mdi-file-document-outline' },
                { title: 'MDN Functions', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '数组与对象',
          description: '数组方法（map/filter/reduce/find）、对象属性描述符',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'JavaScript 系列教程总览', url: '/tutorials/javascript/' },
                { title: '对象入门', url: '/tutorials/javascript/05-objects' },
                { title: '数组', url: '/tutorials/javascript/06-arrays' }
              ]
            },
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'JavaScript 数组', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'JS Arrays', url: 'https://www.youtube.com/watch?v=R8rmfR9Y1Jw', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '菜鸟教程 JS 数组', url: 'https://www.runoob.com/js/js-array.html', icon: 'mdi-file-document-outline' },
                { title: 'MDN Arrays', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '字符串与模板字面量',
          description: '字符串方法、模板字符串、标签函数',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'JavaScript 系列教程总览', url: '/tutorials/javascript/' },
                { title: '字符串与内置对象', url: '/tutorials/javascript/07-strings-builtin' }
              ]
            },
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'JavaScript 字符串', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'JS Strings', url: 'https://www.youtube.com/watch?v=09_B0e2C-Vs', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'MDN 字符串', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String', icon: 'mdi-file-document-outline' },
                { title: 'MDN Strings', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'DOM 操作',
          description: '元素选择、事件监听、DOM 增删改、事件冒泡与捕获',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'JavaScript 系列教程总览', url: '/tutorials/javascript/' },
                { title: 'DOM（上）：查找与操作', url: '/tutorials/javascript/10-dom-1' },
                { title: 'DOM（下）：事件处理', url: '/tutorials/javascript/11-dom-2' }
              ]
            },
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'DOM 教程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'DOM', url: 'https://www.youtube.com/watch?v=0ik6X4DJKCc', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'MDN DOM', url: 'https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model', icon: 'mdi-file-document-outline' },
                { title: 'MDN DOM', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'BOM 与浏览器 API',
          description: 'window/document/location、setTimeout/setInterval、localStorage',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'JavaScript 系列教程总览', url: '/tutorials/javascript/' },
                { title: 'BOM 与浏览器存储', url: '/tutorials/javascript/12-bom-storage' }
              ]
            },
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'BOM 教程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'BOM', url: 'https://www.youtube.com/watch?v=3PHX0i8aH54', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'MDN BOM', url: 'https://developer.mozilla.org/zh-CN/docs/Web/API/Window', icon: 'mdi-file-document-outline' },
                { title: 'MDN Web APIs', url: 'https://developer.mozilla.org/en-US/docs/Web/API', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        }
      ]
    },
    {
      name: '进阶 · 现代 JavaScript 与 TypeScript',
      subtitle: '必修',
      children: [
        {
          title: '解构赋值',
          description: '数组解构、对象解构、嵌套解构、默认值',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'ES6 解构赋值', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'ES6 Destructuring', url: 'https://www.youtube.com/watch?v=NIq3qLaHCIs', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '阮一峰 ES6 解构', url: 'https://es6.ruanyifeng.com/#docs/destructuring', icon: 'mdi-file-document-outline' },
                { title: 'MDN Destructuring', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '展开运算符与剩余参数',
          description: '数组/对象展开、函数参数收集',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'ES6 展开运算符', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'Spread Operator', url: 'https://www.youtube.com/watch?v=1Ucdfn1KQ-o', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '阮一峰 扩展运算符', url: 'https://es6.ruanyifeng.com/#docs/array#%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6', icon: 'mdi-file-document-outline' },
                { title: 'MDN Spread', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'Promise 与异步编程',
          description: '回调地狱、Promise 链式调用、async/await、微任务队列',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'JavaScript 系列教程总览', url: '/tutorials/javascript/' },
                { title: '异步编程', url: '/tutorials/javascript/13-async' }
              ]
            },
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'JavaScript 异步编程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'Async JS', url: 'https://www.youtube.com/watch?v=ZYb_ZU8LNxs', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '阮一峰 Promise', url: 'https://es6.ruanyifeng.com/#docs/promise', icon: 'mdi-file-document-outline' },
                { title: 'MDN Promise', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '模块化',
          description: 'ES Module import/export、CommonJS 对比、动态导入',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'JavaScript 系列教程总览', url: '/tutorials/javascript/' },
                { title: '模块化与综合实战', url: '/tutorials/javascript/14-modules-project' },
                { title: 'Node.js 系列教程总览', url: '/tutorials/nodejs/' },
                { title: '模块系统：CommonJS 与 ESM', url: '/tutorials/nodejs/04-modules' }
              ]
            },
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'ES Modules 教程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'JS Modules', url: 'https://www.youtube.com/watch?v=cRHQNNcYf6s', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '阮一峰 Module', url: 'https://es6.ruanyifeng.com/#docs/module', icon: 'mdi-file-document-outline' },
                { title: 'MDN Modules', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'Map、Set、WeakMap、WeakSet',
          description: '新集合类型、垃圾回收优化',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'ES6 集合类型', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'Map Set', url: 'https://www.youtube.com/watch?v=4B4Q0rTZ2o0', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '阮一峰 Set/Map', url: 'https://es6.ruanyifeng.com/#docs/set-map', icon: 'mdi-file-document-outline' },
                { title: 'MDN Map', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'Symbol 与迭代器',
          description: 'Symbol 内置属性、可迭代协议、for...of',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Symbol 教程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'Symbol', url: 'https://www.youtube.com/watch?v=4Jd8NeoThI4', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '阮一峰 Symbol', url: 'https://es6.ruanyifeng.com/#docs/symbol', icon: 'mdi-file-document-outline' },
                { title: 'MDN Symbol', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '生成器 Generator',
          description: 'function* 声明、yield 暂停、异步生成器',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Generator 教程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'Generators', url: 'https://www.youtube.com/watch?v=IJ6EgdiI_wU', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '阮一峰 Generator', url: 'https://es6.ruanyifeng.com/#docs/generator', icon: 'mdi-file-document-outline' },
                { title: 'MDN Generator', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'Proxy 与 Reflect',
          description: '元编程、响应式原理基础、数据劫持',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Proxy 教程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'Proxy', url: 'https://www.youtube.com/watch?v=vmxSyM0_sBw', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '阮一峰 Proxy', url: 'https://es6.ruanyifeng.com/#docs/proxy', icon: 'mdi-file-document-outline' },
                { title: 'MDN Proxy', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '正则表达式进阶',
          description: '前瞻/后瞻断言、命名捕获组、RegExp 方法',
          optional: true,
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: '正则表达式系列教程总览', url: '/tutorials/regex/' },
                { title: '初识正则表达式', url: '/tutorials/regex/01-introduction' },
                { title: '元字符与字符类', url: '/tutorials/regex/02-characters' },
                { title: '量词、分组与引用', url: '/tutorials/regex/03-quantifiers-groups' },
                { title: '常用场景实战', url: '/tutorials/regex/04-practice' },
                { title: '各语言中的正则', url: '/tutorials/regex/05-languages' }
              ]
            },
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '正则表达式教程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'Regex', url: 'https://www.youtube.com/watch?v=rhzKDrUiJVk', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'MDN 正则', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions', icon: 'mdi-file-document-outline' },
                { title: 'MDN RegExp', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'ES6+ 参考资源',
          description: '全面了解 ES6+ 新特性',
          resources: [
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '阮一峰 ES6 教程', url: 'https://es6.ruanyifeng.com/', icon: 'mdi-file-document-outline' },
                { title: 'ES6 Features', url: 'https://github.com/lukehoban/es6features', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'TypeScript 基础',
          description: '安装配置、tsconfig.json、编译选项',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'TypeScript 系列教程总览', url: '/tutorials/typescript/' },
                { title: '初识 TypeScript', url: '/tutorials/typescript/01-overview' },
                { title: '工程化配置', url: '/tutorials/typescript/09-tsconfig' }
              ]
            },
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '尚硅谷 TypeScript 教程', url: 'https://www.bilibili.com/video/BV1Zg4y1v7jY', icon: 'mdi-play-circle-outline' },
                { title: 'TypeScript', url: 'https://www.youtube.com/watch?v=gp5H0Vw39yw', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'TypeScript 官方文档', url: 'https://www.typescriptlang.org/zh/docs/', icon: 'mdi-file-document-outline' },
                { title: 'TypeScript Official Docs', url: 'https://www.typescriptlang.org/docs/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '基础类型',
          description: 'any/unknown/never/void、字面量类型、联合类型、交叉类型',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'TypeScript 系列教程总览', url: '/tutorials/typescript/' },
                { title: '基础类型', url: '/tutorials/typescript/02-basic-types' },
                { title: '函数与类型', url: '/tutorials/typescript/04-functions' }
              ]
            },
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'TS 基础类型', url: 'https://www.bilibili.com/video/BV1Zg4y1v7jY', icon: 'mdi-play-circle-outline' },
                { title: 'TS Types', url: 'https://www.youtube.com/watch?v=2pZmKW9-I_k', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'TypeScript 基础类型', url: 'https://www.typescriptlang.org/zh/docs/handbook/basic-types.html', icon: 'mdi-file-document-outline' },
                { title: 'TS Handbook', url: 'https://www.typescriptlang.org/docs/handbook/basic-types.html', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '接口 Interface',
          description: '可选属性、只读属性、函数类型、索引签名、接口继承',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'TypeScript 系列教程总览', url: '/tutorials/typescript/' },
                { title: '接口与类型别名', url: '/tutorials/typescript/03-interface-type' }
              ]
            },
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'TS 接口教程', url: 'https://www.bilibili.com/video/BV1Zg4y1v7jY', icon: 'mdi-play-circle-outline' },
                { title: 'TS Interfaces', url: 'https://www.youtube.com/watch?v=PDmB1pGYsoI', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'TypeScript 接口', url: 'https://www.typescriptlang.org/zh/docs/handbook/interfaces.html', icon: 'mdi-file-document-outline' },
                { title: 'TS Interfaces', url: 'https://www.typescriptlang.org/docs/handbook/interfaces.html', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '类与面向对象',
          description: '访问修饰符、抽象类、implements、装饰器',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'JavaScript 系列教程总览', url: '/tutorials/javascript/' },
                { title: '面向对象与原型', url: '/tutorials/javascript/09-prototype-class' },
                { title: 'TypeScript 系列教程总览', url: '/tutorials/typescript/' },
                { title: '类与面向对象', url: '/tutorials/typescript/08-class' }
              ]
            },
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'TS 类教程', url: 'https://www.bilibili.com/video/BV1Zg4y1v7jY', icon: 'mdi-play-circle-outline' },
                { title: 'TS Classes', url: 'https://www.youtube.com/watch?v=K1iu1kXkVoA', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'TypeScript 类', url: 'https://www.typescriptlang.org/zh/docs/handbook/classes.html', icon: 'mdi-file-document-outline' },
                { title: 'TS Classes', url: 'https://www.typescriptlang.org/docs/handbook/classes.html', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '泛型',
          description: '泛型函数/类/接口、泛型约束、条件类型、infer 推断',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'TypeScript 系列教程总览', url: '/tutorials/typescript/' },
                { title: '泛型', url: '/tutorials/typescript/06-generics' }
              ]
            },
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'TS 泛型教程', url: 'https://www.bilibili.com/video/BV1Zg4y1v7jY', icon: 'mdi-play-circle-outline' },
                { title: 'TS Generics', url: 'https://www.youtube.com/watch?v=nViEqpgwxHE', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'TypeScript 泛型', url: 'https://www.typescriptlang.org/zh/docs/handbook/generics.html', icon: 'mdi-file-document-outline' },
                { title: 'TS Generics', url: 'https://www.typescriptlang.org/docs/handbook/generics.html', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '类型工具',
          description: 'Partial/Required/Readonly/Pick/Omit/Record 工具类型',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'TypeScript 系列教程总览', url: '/tutorials/typescript/' },
                { title: '枚举与类型编程入门', url: '/tutorials/typescript/07-enum-mapped' }
              ]
            },
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'TS 类型工具', url: 'https://www.bilibili.com/video/BV1Zg4y1v7jY', icon: 'mdi-play-circle-outline' },
                { title: 'TS Utility Types', url: 'https://www.youtube.com/watch?v=4cKb4yeJ-LU', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'TypeScript 工具类型', url: 'https://www.typescriptlang.org/zh/docs/handbook/utility-types.html', icon: 'mdi-file-document-outline' },
                { title: 'TS Utility Types', url: 'https://www.typescriptlang.org/docs/handbook/utility-types.html', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '类型守卫与类型断言',
          description: 'typeof、instanceof、自定义守卫、as 断言',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'TypeScript 系列教程总览', url: '/tutorials/typescript/' },
                { title: '联合类型与类型收窄', url: '/tutorials/typescript/05-unions-narrowing' }
              ]
            },
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'TS 类型守卫', url: 'https://www.bilibili.com/video/BV1Zg4y1v7jY', icon: 'mdi-play-circle-outline' },
                { title: 'Type Guards', url: 'https://www.youtube.com/watch?v=9N4M8b_37tY', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'TypeScript 类型守卫', url: 'https://www.typescriptlang.org/zh/docs/handbook/advanced-types.html', icon: 'mdi-file-document-outline' },
                { title: 'TS Advanced Types', url: 'https://www.typescriptlang.org/docs/handbook/advanced-types.html', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '声明文件',
          description: '.d.ts 文件编写、模块声明、全局类型声明',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'TypeScript 系列教程总览', url: '/tutorials/typescript/' },
                { title: '工程化配置', url: '/tutorials/typescript/09-tsconfig' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'TypeScript 声明文件', url: 'https://www.typescriptlang.org/zh/docs/handbook/declaration-files/introduction.html', icon: 'mdi-file-document-outline' },
                { title: 'TS Declaration', url: 'https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '模板字面量类型',
          description: '模板字面量字符串、联合类型推导',
          optional: true,
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'TypeScript 系列教程总览', url: '/tutorials/typescript/' },
                { title: '枚举与类型编程入门', url: '/tutorials/typescript/07-enum-mapped' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'TS 模板字面量', url: 'https://www.typescriptlang.org/zh/docs/handbook/2/template-literal-types.html', icon: 'mdi-file-document-outline' },
                { title: 'TS Template Literals', url: 'https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '装饰器',
          description: '类装饰器、方法装饰器、属性装饰器、参数装饰器',
          optional: true,
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'TypeScript 系列教程总览', url: '/tutorials/typescript/' },
                { title: '类与面向对象', url: '/tutorials/typescript/08-class' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'TypeScript 装饰器', url: 'https://www.typescriptlang.org/zh/docs/handbook/decorators.html', icon: 'mdi-file-document-outline' },
                { title: 'TS Decorators', url: 'https://www.typescriptlang.org/docs/handbook/decorators.html', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        }
      ]
    },
    {
      name: '精通 · 运行时、渲染与性能',
      subtitle: '必修',
      children: [
        {
          title: '浏览器渲染原理',
          description: '关键渲染路径、重排/重绘、图层与合成',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '浏览器渲染教程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'Browser Rendering', url: 'https://www.youtube.com/watch?v=SmE4OwHztCc', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'MDN 渲染', url: 'https://developer.mozilla.org/zh-CN/docs/Web/Performance', icon: 'mdi-file-document-outline' },
                { title: 'Web Performance', url: 'https://web.dev/learn-core-web-vitals/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '性能优化',
          description: '懒加载、图片优化、CDN 加速、首屏加载优化、性能监控',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '前端性能优化', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'Performance', url: 'https://www.youtube.com/watch?v=0fONene3OII', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Web 性能优化', url: 'https://developer.mozilla.org/zh-CN/docs/Web/Performance', icon: 'mdi-file-document-outline' },
                { title: 'Web Vitals', url: 'https://web.dev/vitals/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '前端安全',
          description: 'XSS 防御、CSRF 防御、CSP 内容安全策略',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '前端安全教程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'Web Security', url: 'https://www.youtube.com/watch?v=4caGY2iN1iU', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'MDN 安全', url: 'https://developer.mozilla.org/zh-CN/docs/Web/Security', icon: 'mdi-file-document-outline' },
                { title: 'OWASP', url: 'https://owasp.org/www-project-top-ten/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '事件循环与宏微任务',
          description: '调用栈、任务队列、宏任务与微任务的执行时序',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'JavaScript 系列教程总览', url: '/tutorials/javascript/' },
                { title: '异步编程', url: '/tutorials/javascript/13-async' },
                { title: 'Node.js 系列教程总览', url: '/tutorials/nodejs/' },
                { title: 'Node 中的异步与事件循环', url: '/tutorials/nodejs/06-async-loop' }
              ]
            }
          ]
        },
        {
          title: '模块系统 ESM/CJS 互操作与打包原理',
          description: '两种模块规范差异、循环依赖、Tree Shaking 与打包器原理',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'Node.js 系列教程总览', url: '/tutorials/nodejs/' },
                { title: '模块系统：CommonJS 与 ESM', url: '/tutorials/nodejs/04-modules' },
                { title: 'JavaScript 系列教程总览', url: '/tutorials/javascript/' },
                { title: '模块化与综合实战', url: '/tutorials/javascript/14-modules-project' }
              ]
            }
          ]
        },
        { title: 'HTTP 与浏览器缓存策略', description: '强缓存与协商缓存、ETag 与 Last-Modified、缓存命中与失效' },
        { title: 'CORS 与跨域', description: '同源策略、简单请求与预检、凭证跨域与代理方案' },
        { title: 'Service Worker 与 PWA', description: '离线缓存、请求拦截、后台同步与应用安装' },
        { title: '前端监控与错误上报', description: '全局异常捕获、Source Map 还原、性能指标与日志上报' },
        {
          title: 'TypeScript 工程化与 monorepo',
          description: 'tsconfig 分层与项目引用、多包仓库与依赖治理',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'TypeScript 系列教程总览', url: '/tutorials/typescript/' },
                { title: '工程化配置', url: '/tutorials/typescript/09-tsconfig' },
                { title: 'Node.js 系列教程总览', url: '/tutorials/nodejs/' },
                { title: 'workspace 与 monorepo', url: '/tutorials/nodejs/08-workspace-monorepo' }
              ]
            }
          ]
        },
        { title: '可访问性（a11y）', description: '语义化结构、ARIA 属性、键盘可达性与色彩对比度' },
        { title: '国际化与本地化', description: '语言包管理、日期数字格式化、时区处理与 RTL 排版' }
      ]
    },
    {
      name: '实战与生态 · 框架、全栈与工程化',
      subtitle: '选修',
      children: [
        {
          title: 'React 核心',
          description: 'JSX 语法、函数组件、Hooks（useState/useEffect/useContext）',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '尚硅谷 React 教程', url: 'https://www.bilibili.com/video/BV1jJ411k7g4', icon: 'mdi-play-circle-outline' },
                { title: 'React', url: 'https://www.youtube.com/watch?v=Ke90Tje7VS0', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'React 官方文档', url: 'https://zh-hans.react.dev/', icon: 'mdi-file-document-outline' },
                { title: 'React Official Docs', url: 'https://react.dev/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'React 进阶',
          description: 'useReducer/useMemo/useCallback/useRef、自定义 Hooks',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'React Hooks 教程', url: 'https://www.bilibili.com/video/BV1jJ411k7g4', icon: 'mdi-play-circle-outline' },
                { title: 'React Hooks', url: 'https://www.youtube.com/watch?v=TNhaISOUy6Q', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'React Hooks 中文', url: 'https://zh-hans.react.dev/reference/react', icon: 'mdi-file-document-outline' },
                { title: 'React Hooks Docs', url: 'https://react.dev/reference/react', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'React 状态管理',
          description: 'Context API、Zustand、Redux Toolkit、React Query',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Redux 教程', url: 'https://www.bilibili.com/video/BV1jJ411k7g4', icon: 'mdi-play-circle-outline' },
                { title: 'Redux', url: 'https://www.youtube.com/watch?v=zrs7u6bdbUw', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Redux 中文文档', url: 'https://www.redux.org.cn/', icon: 'mdi-file-document-outline' },
                { title: 'Redux Docs', url: 'https://redux.js.org/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'React 路由',
          description: 'React Router v6、嵌套路由、路由守卫、懒加载',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'React Router 教程', url: 'https://www.bilibili.com/video/BV1jJ411k7g4', icon: 'mdi-play-circle-outline' },
                { title: 'React Router', url: 'https://www.youtube.com/watch?v=Ul3y1LXx0UY', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'React Router 中文', url: 'https://reactrouter.com/en/main', icon: 'mdi-file-document-outline' },
                { title: 'React Router Docs', url: 'https://reactrouter.com/en/main', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'Vue 3 核心',
          description: 'Composition API、ref/reactive、生命周期、指令系统',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '尚硅谷 Vue 3 教程', url: 'https://www.bilibili.com/video/BV1Zy4y1K7SH', icon: 'mdi-play-circle-outline' },
                { title: 'Vue 3', url: 'https://www.youtube.com/watch?v=RX_xBz7sOjI', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Vue 3 官方文档', url: 'https://cn.vuejs.org/', icon: 'mdi-file-document-outline' },
                { title: 'Vue 3 Official Docs', url: 'https://vuejs.org/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'Vue 3 进阶',
          description: 'Teleport/Suspense、Pinia 状态管理、Vue Router',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Pinia 教程', url: 'https://www.bilibili.com/video/BV1Zy4y1K7SH', icon: 'mdi-play-circle-outline' },
                { title: 'Pinia', url: 'https://www.youtube.com/watch?v=T4oMDj5_xrA', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Pinia 中文', url: 'https://pinia.vuejs.org/zh/', icon: 'mdi-file-document-outline' },
                { title: 'Pinia Docs', url: 'https://pinia.vuejs.org/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '组件化开发',
          description: '组件通信、高阶组件 HOC、Render Props、插槽',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'React 组件化', url: 'https://www.bilibili.com/video/BV1jJ411k7g4', icon: 'mdi-play-circle-outline' },
                { title: 'Component Patterns', url: 'https://www.youtube.com/watch?v=YaZg8wg3S2E', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Vue 组件', url: 'https://cn.vuejs.org/guide/essentials/component-basics.html', icon: 'mdi-file-document-outline' },
                { title: 'React Components', url: 'https://react.dev/learn/thinking-in-react', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'UI 框架',
          description: 'Ant Design / Element Plus / ShadCN / Tailwind CSS',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Tailwind 教程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'Tailwind', url: 'https://www.youtube.com/watch?v=UBOj6rqRUME', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Ant Design 中文', url: 'https://ant.design/index-cn', icon: 'mdi-file-document-outline' },
                { title: 'Tailwind Docs', url: 'https://tailwindcss.com/docs', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '框架原理',
          description: 'Virtual DOM diff 算法、响应式原理、Fiber 架构',
          optional: true,
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'React 原理', url: 'https://www.bilibili.com/video/BV1jJ411k7g4', icon: 'mdi-play-circle-outline' },
                { title: 'Virtual DOM', url: 'https://www.youtube.com/watch?v=BYbgopx44vo', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'React 原理', url: 'https://zh-hans.react.dev/learn', icon: 'mdi-file-document-outline' },
                { title: 'React Docs', url: 'https://react.dev/learn', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '测试框架',
          description: 'Vitest / Jest / Testing Library、组件测试、E2E 测试 Playwright',
          optional: true,
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '前端测试教程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'Testing', url: 'https://www.youtube.com/watch?v=4kNfeU7wBdI', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Vitest 中文', url: 'https://cn.vitest.dev/', icon: 'mdi-file-document-outline' },
                { title: 'Playwright Docs', url: 'https://playwright.dev/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'Vite 构建工具',
          description: '快速搭建项目、HMR 热更新、环境变量与模式',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Vite 教程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'Vite', url: 'https://www.youtube.com/watch?v=KCrXgy8QtjM', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Vite 官方文档', url: 'https://cn.vitejs.dev/', icon: 'mdi-file-document-outline' },
                { title: 'Vite Official Docs', url: 'https://vitejs.dev/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'Webpack 核心',
          description: 'Loader 与 Plugin、代码分割、Tree Shaking、缓存策略',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Webpack 教程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'Webpack', url: 'https://www.youtube.com/watch?v=IZGNcSuwBps', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Webpack 中文', url: 'https://webpack.docschina.org/', icon: 'mdi-file-document-outline' },
                { title: 'Webpack Docs', url: 'https://webpack.js.org/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '包管理器',
          description: 'npm / yarn / pnpm、workspace 多包管理、lock 文件',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'Node.js 系列教程总览', url: '/tutorials/nodejs/' },
                { title: 'npm 基础：package.json 与依赖安装', url: '/tutorials/nodejs/02-npm-basic' },
                { title: 'pnpm 与现代包管理', url: '/tutorials/nodejs/03-pnpm' },
                { title: 'npm 进阶：脚本、发布与依赖治理', url: '/tutorials/nodejs/07-npm-advanced' }
              ]
            },
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'pnpm 教程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'npm', url: 'https://www.youtube.com/watch?v=2V1UUhBJ62Y', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'pnpm 中文', url: 'https://pnpm.io/zh/', icon: 'mdi-file-document-outline' },
                { title: 'npm Docs', url: 'https://docs.npmjs.com/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'CSS 工程化',
          description: 'CSS Modules、Tailwind CSS PostCSS、CSS-in-JS',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'CSS 工程化', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'CSS', url: 'https://www.youtube.com/watch?v=1eIRTdgzHtw', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'MDN CSS', url: 'https://developer.mozilla.org/zh-CN/docs/Web/CSS', icon: 'mdi-file-document-outline' },
                { title: 'MDN CSS', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'Git 协作',
          description: '分支策略、代码审查、Commit 规范（Conventional Commits）',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'Git', url: '/tutorials/git/' },
                { title: '版本控制与 Git 入门', url: '/tutorials/git/01-introduction' },
                { title: '基础操作', url: '/tutorials/git/02-basic' },
                { title: '分支管理', url: '/tutorials/git/03-branch' },
                { title: '远程仓库与 GitHub', url: '/tutorials/git/04-remote' },
                { title: '团队协作流程', url: '/tutorials/git/05-collaboration' },
                { title: '进阶技巧', url: '/tutorials/git/06-advanced' },
                { title: '实战场景与最佳实践', url: '/tutorials/git/07-best-practices' }
              ]
            },
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Git 教程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'Git', url: 'https://www.youtube.com/watch?v=8JJ101D3knE', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: '廖雪峰 Git 教程', url: 'https://www.liaoxuefeng.com/wiki/896043488029600', icon: 'mdi-file-document-outline' },
                { title: 'Git Docs', url: 'https://git-scm.com/doc', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '微前端',
          description: 'Module Federation、qiankun 沙箱、子应用通信',
          optional: true,
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '微前端教程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'Micro Frontends', url: 'https://www.youtube.com/watch?v=l3K7SR5R1cw', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'qiankun 中文', url: 'https://qiankun.umijs.org/zh/', icon: 'mdi-file-document-outline' },
                { title: 'Module Federation', url: 'https://module-federation.io/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '构建工具对比',
          description: 'Rollup / esbuild / Turbopack / SWC',
          optional: true,
          resources: [
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'esbuild 中文', url: 'https://esbuild.docschina.org/', icon: 'mdi-file-document-outline' },
                { title: 'Turbopack Docs', url: 'https://turbo.build/pack/docs', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'Node.js 运行时',
          description: 'CommonJS 模块、Event Loop、Buffer/Stream、child_process',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'Node.js 系列教程总览', url: '/tutorials/nodejs/' },
                { title: '初识 Node.js 与安装', url: '/tutorials/nodejs/01-overview' },
                { title: '模块系统：CommonJS 与 ESM', url: '/tutorials/nodejs/04-modules' },
                { title: '核心模块：path / fs / http', url: '/tutorials/nodejs/05-core-modules' },
                { title: 'Node 中的异步与事件循环', url: '/tutorials/nodejs/06-async-loop' },
                { title: '环境变量与调试', url: '/tutorials/nodejs/11-env-debug' }
              ]
            },
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Node.js 教程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'Node.js', url: 'https://www.youtube.com/watch?v=Oe421EPjeBE', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Node.js 官方文档', url: 'https://nodejs.org/zh-cn/docs/', icon: 'mdi-file-document-outline' },
                { title: 'Node.js Docs', url: 'https://nodejs.org/en/docs/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'Express / Koa 框架',
          description: '中间件机制、路由、错误处理、REST API',
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'Node.js 系列教程总览', url: '/tutorials/nodejs/' },
                { title: 'Express 入门', url: '/tutorials/nodejs/09-express' },
                { title: 'REST API 实战', url: '/tutorials/nodejs/10-rest-api' }
              ]
            },
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Express 教程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'Express', url: 'https://www.youtube.com/watch?v=L72fhGm1tfE', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Express 中文', url: 'https://expressjs.com/zh-cn/', icon: 'mdi-file-document-outline' },
                { title: 'Express Docs', url: 'https://expressjs.com/en/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'Nest.js 全栈框架',
          description: '模块/控制器/服务、依赖注入、GraphQL 支持、WebSocket',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Nest.js 教程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'Nest.js', url: 'https://www.youtube.com/watch?v=0M8AYU_hPas', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Nest.js 中文', url: 'https://nestjs.cn/', icon: 'mdi-file-document-outline' },
                { title: 'Nest.js Docs', url: 'https://docs.nestjs.com/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'Next.js / Nuxt.js',
          description: 'SSR/SSG/ISR 渲染模式、文件路由、API Routes',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Next.js 教程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'Next.js', url: 'https://www.youtube.com/watch?v=Y6KDk5iHaWc', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Next.js 官方教程', url: 'https://nextjs.org/learn', icon: 'mdi-file-document-outline' },
                { title: 'Next.js Official Docs', url: 'https://nextjs.org/docs', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '数据库集成',
          description: 'Prisma / TypeORM、Mongoose MongoDB、Sequelize',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Prisma 教程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'Prisma', url: 'https://www.youtube.com/watch?v=RebA5J-rlwg', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Prisma 中文', url: 'https://www.prisma.io/docs', icon: 'mdi-file-document-outline' },
                { title: 'Prisma Docs', url: 'https://www.prisma.io/docs', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'GraphQL / tRPC',
          description: 'Schema 定义、Resolver、Apollo Server、类型安全的 API',
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'GraphQL 教程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'GraphQL', url: 'https://www.youtube.com/watch?v=ZQL7tL2S0oQ', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'GraphQL 中文', url: 'https://graphql.cn/', icon: 'mdi-file-document-outline' },
                { title: 'GraphQL Docs', url: 'https://graphql.org/learn/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '认证与授权',
          description: 'NextAuth.js、Passport.js、JWT、Session 管理',
          optional: true,
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'NextAuth 教程', url: 'https://www.bilibili.com/video/BV1X7411m1Ex', icon: 'mdi-play-circle-outline' },
                { title: 'NextAuth', url: 'https://www.youtube.com/watch?v=2eRQ0di64tA', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'NextAuth 中文', url: 'https://next-auth.js.org/', icon: 'mdi-file-document-outline' },
                { title: 'NextAuth Docs', url: 'https://next-auth.js.org/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'Docker 部署',
          description: 'Dockerfile 多阶段构建、Nginx 反向代理、pm2 进程管理',
          optional: true,
          resources: [
            {
              name: '站内教程',
              icon: 'mdi-book-open-variant',
              items: [
                { title: 'Node.js 系列教程总览', url: '/tutorials/nodejs/' },
                { title: '部署与 PM2', url: '/tutorials/nodejs/12-deploy-pm2' }
              ]
            },
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Docker 部署教程', url: 'https://www.bilibili.com/video/BV1gr4y1F7rs', icon: 'mdi-play-circle-outline' },
                { title: 'Docker', url: 'https://www.youtube.com/watch?v=3c8m9v1Tg5I', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Docker 从入门到实践', url: 'https://vuepress.mirror.docker-practice.com/', icon: 'mdi-file-document-outline' },
                { title: 'Docker Docs', url: 'https://docs.docker.com/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'Leaflet',
          description: '地图加载、标记与弹窗、图层控制、瓦片服务',
          optional: true,
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: '尚硅谷 WebGIS 教程', url: 'https://www.bilibili.com/video/BV1fA411C7Yp', icon: 'mdi-play-circle-outline' },
                { title: 'Leaflet', url: 'https://www.youtube.com/watch?v=3y7i1s6uFas', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Leaflet 中文', url: 'https://leafletjs.com/', icon: 'mdi-file-document-outline' },
                { title: 'Leaflet Docs', url: 'https://leafletjs.com/reference.html', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'OpenLayers',
          description: '矢量图层、空间查询、投影转换、动画',
          optional: true,
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'OpenLayers 教程', url: 'https://www.bilibili.com/video/BV1fA411C7Yp', icon: 'mdi-play-circle-outline' },
                { title: 'OpenLayers', url: 'https://www.youtube.com/watch?v=H_5sDv7F0qM', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'OpenLayers 中文', url: 'https://openlayers.org/', icon: 'mdi-file-document-outline' },
                { title: 'OpenLayers Docs', url: 'https://openlayers.org/en/latest/apidoc/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'Cesium',
          description: '三维地球、3D Tiles、时间轴动画、地形分析',
          optional: true,
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Cesium 教程', url: 'https://www.bilibili.com/video/BV1fA411C7Yp', icon: 'mdi-play-circle-outline' },
                { title: 'Cesium', url: 'https://www.youtube.com/watch?v=UeJCaKYIksw', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Cesium 中文', url: 'https://cesium.com/platform/cesiumjs/', icon: 'mdi-file-document-outline' },
                { title: 'Cesium Docs', url: 'https://cesium.com/docs/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: 'GeoJSON / TopoJSON',
          description: '地理数据格式、样式配置、交互',
          optional: true,
          resources: [
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'GeoJSON 中文', url: 'https://geojson.org/', icon: 'mdi-file-document-outline' },
                { title: 'GeoJSON Spec', url: 'https://geojson.org/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '地图可视化',
          description: 'Mapbox GL、Deck.gl、ECharts Geo',
          optional: true,
          resources: [
            {
              name: '视频教程',
              icon: 'mdi-play-circle-outline',
              items: [
                { title: 'Mapbox 教程', url: 'https://www.bilibili.com/video/BV1fA411C7Yp', icon: 'mdi-play-circle-outline' },
                { title: 'Mapbox', url: 'https://www.youtube.com/watch?v=OyUJk3M1hxw', icon: 'mdi-play-circle-outline' }
              ]
            },
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'Mapbox 中文', url: 'https://docs.mapbox.com/', icon: 'mdi-file-document-outline' },
                { title: 'Mapbox Docs', url: 'https://docs.mapbox.com/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        },
        {
          title: '空间数据库',
          description: 'PostGIS 空间查询、GeoServer 地图服务',
          optional: true,
          resources: [
            {
              name: '官方文档',
              icon: 'mdi-file-document-outline',
              items: [
                { title: 'PostGIS 中文', url: 'https://postgis.net/', icon: 'mdi-file-document-outline' },
                { title: 'PostGIS Docs', url: 'https://postgis.net/docs/', icon: 'mdi-file-document-outline' }
              ]
            }
          ]
        }
      ]
    }
  ]
}
