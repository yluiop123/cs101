import {type DefaultTheme } from 'vitepress'

export function sidebarJava(): DefaultTheme.SidebarItem[] {
    return [
      {
        text: 'JAVA学习路线',
        items: [
          { 
            base: '/route/java/',
            text: 'java教程', 
            collapsed: false,
            items: [
              {
                text: '入门指南',
                link: 'java/getting-started',
              },
              {
                text: '面向对象',
                link: 'java/oop',
              },
              {
                base: '/route/java/java/language-basics/',
                text: 'java语言基础',
                collapsed: true,
                items: [
                  {
                    text: '创建变量及命名',
                    link: 'variables',
                  },
                  {
                    text: '基本数据类型',
                    link: 'primitive-types',
                  },
                  {
                    text: '数组',
                    link: 'arrays',
                  },
                  {
                    text: '使用 var 类型标识符',
                    link: 'using-var',
                  },
                  {
                    text: '运算符的使用',
                    link: 'using-operators',
                  },
                  {
                    text: '运算符概述',
                    link: 'all-operators',
                  },
                  {
                    text: '表达式、语句和代码块',
                    link: 'expressions-statements-blocks',
                  },
                  {
                    text: '控制流语句',
                    link: 'controlling-flow',
                  },
                  {
                    text: 'Switch 语句',
                    link: 'switch-statement',
                  },
                  {
                    text: 'Switch 表达式',
                    link: 'switch-expression',
                  }
                ]
              },
              {
                base: '/route/java/java/classes-objects/',
                text: '类和对象',
                collapsed: true,
                items: [
                  {
                    text: '创建类',
                    link: 'creating-classes',
                  },
                  {
                    text: '定义方法',
                    link: 'defining-methods',
                  },
                  {
                    text: '为类提供构造函数',
                    link: 'defining-constructors',
                  },
                  {
                    text: '调用方法和构造函数',
                    link: 'calling-methods-constructors',
                  },
                  {
                    text: '创建和使用对象',
                    link: 'creating-objects',
                  },
                  {
                    text: '有关类的更多信息',
                    link: 'more-on-classes',
                  },
                  {
                    text: '嵌套类',
                    link: 'nested-classes',
                  },
                  {
                    text: '枚举',
                    link: 'enums',
                  },
                  {
                    text: '最佳实践',
                    link: 'design-best-practices',
                  }
                ]
              },
              {
                text: 'Record',
                link: 'java/records',
              },
              {
                base: '/route/java/java/numbers-strings/',
                text: '数值和字符串',
                collapsed: true,
                items: [
                  {
                    text: '数值',
                    link: 'numbers',
                  },
                  {
                    text: '字符',
                    link: 'characters',
                  },
                  {
                    text: '字符串',
                    link: 'strings',
                  },
                  {
                    text: 'StringBuilder',
                    link: 'string-builders',
                  },
                  {
                    text: '自动装箱和拆箱',
                    link: 'autoboxing',
                  }
                ]
              },
              {
                base: '/route/java/java/inheritance/',
                text: '继承',
                collapsed: true,
                items: [
                  {
                    text: '继承',
                    link: 'what-is-inheritance',
                  },
                  {
                    text: '覆写',
                    link: 'overriding',
                  },
                  {
                    text: '多态',
                    link: 'polymorphism',
                  },
                  {
                    text: 'Object',
                    link: 'objects',
                  },
                  {
                    text: '抽象方法和类',
                    link: 'abstract-classes',
                  }
                ]
              },
              {
                base: '/route/java/java/interfaces/',
                text: '接口',
                collapsed: true,
                items: [
                  {
                    text: '接口',
                    link: 'defining-interfaces',
                  },
                  {
                    text: '接口的实现',
                    link: 'examples',
                  },
                  {
                    text: '使用接口作为类型',
                    link: 'interfaces-as-a-type',
                  }
                ]
              },
              {
                base: '/route/java/java/generics/',
                text: '泛型',
                collapsed: true,
                items: [
                  {
                    text: '泛型介绍',
                    link: 'intro'
                  },
                  {
                    text: '类型推断',
                    link: 'type-inference'
                  },
                  {
                    text: '通配符',
                    link: 'wildcards'
                  },
                  {
                    text: '类型擦除',
                    link: 'type-erasure'
                  },
                  {
                    text: '对泛型的限制',
                    link: 'restrictions'
                  }
                ]
              },
              {
                base: '/route/java/java/lambdas/',
                text: 'lambda表达式',
                collapsed: true,
                items: [
                  {
                    text: '编写你的第一个Lambda表达式',
                    link: 'first-lambdas'
                  },
                  {
                    text: '在应用程序中使用Lambda表达式',
                    link: 'functional-interfaces'
                  },
                  {
                    text: '将Lambda表达式写成方法引用',
                    link: 'method-references'
                  },
                  {
                    text: '组合Lambda表达式',
                    link: 'combining-chaining-composing'
                  },
                  {
                    text: '编写和组合比较器',
                    link: 'writing-comparators'
                  }
                ]
              },
              {
                text: 'Java 注解（Annotations）',
                link: 'java/annotations',
              },
              {
                text: 'Java 包（Packages）',
                link: 'java/packages',
              },
              {
                text: '模式匹配',
                link: 'java/pattern-matching',
              },
              {
                base: '/route/java/java/exceptions/',
                text: '异常',
                collapsed: true,
                items: [
                  {
                    text: 'Java 中的异常是什么',
                    link: 'what-is-an-exception'
                  },
                  {
                    text: '异常捕获和处理',
                    link: 'catching-handling'
                  },
                  {
                    text: 'Java 中的异常抛出',
                    link: 'throwing'
                  },
                  {
                    text: 'Java 中的未检查异常-讨论',
                    link: 'unchecked-exception-controversy'
                  }
                ]
              },
              {
                base: '/route/java/java/refactoring-to-functional-style/',
                text: '函数式风格',
                collapsed: true,
                items: [
                  {
                    text: '简单循环',
                    link: 'simpleloops'
                  },
                  {
                    text: '带步长循环',
                    link: 'loopswithsteps'
                  },
                  {
                    text: '带有`if`的`foreach`',
                    link: 'foreachwithif'
                  },
                  {
                    text: '带有转换的迭代',
                    link: 'iteartionwithtransformation'
                  },
                  {
                    text: '数据源',
                    link: 'convertingtostreams'
                  }
                ]
              },
              {
                base: '/route/java/java/collections-framework/',
                text: '集合框架',
                collapsed: true,
                items: [
                  {
                    text: '集合框架介绍',
                    link: 'intro'
                  },
                  {
                    text: '集合框架层次结构',
                    link: 'organization'
                  },
                  {
                    text: '在集合中存储元素',
                    link: 'collection-interface'
                  },
                  {
                    text: '循环访问集合的元素',
                    link: 'iterating'
                  },
                  {
                    text: 'List',
                    link: 'lists'
                  },
                  {
                    text: 'Set',
                    link: 'sets'
                  },
                  {
                    text: '不可变集合',
                    link: 'immutable-collections'
                  },
                  {
                    text: 'Stack和Queue',
                    link: 'stacks-queues'
                  },
                  {
                    text: 'Map',
                    link: 'maps'
                  },{
                    text: '管理Map的内容',
                    link: 'working-with-keys-and-values'
                  },
                  {
                    text: 'Map和lambda',
                    link: 'maps-and-lambdas'
                  },
                  {
                    text: 'SortedMap和NavigableMap',
                    link: 'sorted-maps'
                  },
                  {
                    text: '选择不可变类型作为Map的键',
                    link: 'choosing-keys'
                  }
                ]
              },
              {
                base: '/route/java/java/streams/',
                text: '流（Stream）',
                collapsed: true,
                items: [
                  {
                    text: '使用Stream API在内存中处理数据',
                    link: 'map-filter-reduce'
                  },
                  {
                    text: '流的中间操作',
                    link: 'intermediate-operation'
                  },
                  {
                    text: '创建流',
                    link: 'creating'
                  },
                  {
                    text: '归约流',
                    link: 'reducing'
                  },
                  {
                    text: '终端操作',
                    link: 'terminal-operations'
                  },
                  {
                    text: '流的特征',
                    link: 'characteristics'
                  },
                  {
                    text: '使用收集器',
                    link: 'using-collectors'
                  },
                  {
                    text: '自定义收集器',
                    link: 'custom-collectors'
                  },
                  {
                    text: '实现 Collector 接口',
                    link: 'collector-interface'
                  },{
                    text: '使用 Optionals',
                    link: 'optionals'
                  },
                  {
                    text: '并行流',
                    link: 'parallel-streams'
                  }
                ]
              },
              {
                base: '/route/java/java/java-io/',
                text: 'I/O API',
                collapsed: true,
                items: [
                  {
                    text: ' I/O 概念介绍',
                    link: 'intro'
                  },
                  {
                    base: '/route/java/java/java-io/file-system/',
                    text: '文件系统',
                    collapsed: true,
                    items: [
                      {
                        text: '使用Paths访问资源',
                        link: 'file-path'
                      },{
                        text: 'Paths操作',
                        link: 'path'
                      },{
                        text: '访问文件系统',
                        link: 'file-system'
                      },{
                        text: '操作文件和目录',
                        link: 'move-copy-delete'
                      },{
                        text: '链接、符号和其他',
                        link: 'links'
                      },{
                        text: '文件属性',
                        link: 'metadata'
                      },{
                        text: '读写文件',
                        link: 'creating-reading-directories'
                      },{
                        text: '列出目录的内容',
                        link: 'listing'
                      },{
                        text: '遍历文件树',
                        link: 'walking-tree'
                      },{
                        text: '监视目录的更改',
                        link: 'watching-dir-changes'
                      }
                    ]
                  },
                  {
                    base: '/route/java/java/java-io/reading-writing/',
                    text: '文件操作基础知识',
                    collapsed: true,
                    items: [
                      {
                        text: '释放资源并捕获异常',
                        link: 'common-operations'
                      },{
                        text: '读取和写入小文件',
                        link: 'small-files'
                      },{
                        text: '读取和写入文本文件',
                        link: 'buffered-text'
                      },{
                        text: '读取和写入二进制文件',
                        link: 'binary-files'
                      },{
                        text: '修饰 IO 流',
                        link: 'decorating'
                      },{
                        text: '内存中的 IO 流',
                        link: 'in-memory'
                      }
                    ]
                  },{
                    text: '综合运用',
                    link: 'putting-it-all-together'
                  }
                ]
              },{
                text: '常见 I/O 任务',
                link: 'java/modernio',
              },
              {
                base: '/route/java/java/date-time/',
                text: '日期时间 API',
                collapsed: true,
                items: [
                  {
                    text: '概述',
                    link: 'intro'
                  },{
                    text: '标准日历',
                    link: 'standard-calendar'
                  },{
                    text: 'DayOfWeek 和 Month 枚举',
                    link: 'dayofweek-month'
                  },{
                    text: '日期',
                    link: 'date'
                  },{
                    text: '日期和时间',
                    link: 'local-time'
                  },{
                    text: '时区和偏移量',
                    link: 'zoneid-zone-offset'
                  },{
                    text: 'Instant',
                    link: 'instant'
                  },{
                    text: '解析和格式化',
                    link: 'parsing-formatting'
                  },{
                    text: 'Temporal 包',
                    link: 'temporal'
                  },{
                    text: 'Period 和 Duration',
                    link: 'period-duration'
                  },{
                    text: 'Clock',
                    link: 'clock'
                  },{
                    text: '非 ISO 日期转换',
                    link: 'non-iso-conversion'
                  },{
                    text: '传统日期时间代码',
                    link: 'legacy-code'
                  }
                ]
              }
            ]
          },
          { text: 'springboot', link: '/route/java/springboot' },
          { text: 'springcloud+alibaba', link: '/route/java/java' },
          { text: 'lombok', link: '/route/java/java' },
          { text: 'java最新教程', link: '/route/java/java' },
          { text: 'java最新教程', link: '/route/java/java' },
          { text: 'springboot', link: '/route/java/java8/index2' }
        ]
      },
    ]
  }