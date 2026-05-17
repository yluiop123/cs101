<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: 'C / C++ 技术路线',
  description: 'C/C++ 是系统级编程的代表语言，在嵌入式、高性能计算和游戏引擎领域不可替代。',

  items: [
    {
      name: 'C 语言基础',
      subtitle: '必修',
      children: [
        {
          title: '开发环境搭建',
          description: 'GCC/MinGW 安装、VS Code 配置、命令行编译运行',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 C 语言教程", url: "https://www.bilibili.com/video/BV1si4y1j7di", icon: "mdi-play-circle-outline" },
                { title: "C Programming", url: "https://www.youtube.com/watch?v=KJgsSFOSQv0", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 C 语言", url: "https://www.runoob.com/cprogramming/c-tutorial.html", icon: "mdi-file-document-outline" },
                { title: "W3Schools C", url: "https://www.w3schools.com/c/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '基本语法',
          description: '数据类型、运算符、表达式、printf/scanf 输入输出',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "C 语言基础教程", url: "https://www.bilibili.com/video/BV1si4y1j7di", icon: "mdi-play-circle-outline" },
                { title: "C Basics", url: "https://www.youtube.com/watch?v=2NWeucMKrLI", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 C 语法", url: "https://www.runoob.com/cprogramming/c-basic-syntax.html", icon: "mdi-file-document-outline" },
                { title: "W3Schools C Syntax", url: "https://www.w3schools.com/c/c_syntax.php", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '流程控制',
          description: 'if/else、switch/case、for/while/do-while 循环',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "C 流程控制", url: "https://www.bilibili.com/video/BV1si4y1j7di", icon: "mdi-play-circle-outline" },
                { title: "C Control Flow", url: "https://www.youtube.com/watch?v=WK2vKk1w6so", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 C 流程", url: "https://www.runoob.com/cprogramming/c-decision.html", icon: "mdi-file-document-outline" },
                { title: "W3Schools C Loops", url: "https://www.w3schools.com/c/c_while_loop.php", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '数组与字符串',
          description: '一维/二维数组、字符数组、字符串处理函数',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "C 数组教程", url: "https://www.bilibili.com/video/BV1si4y1j7di", icon: "mdi-play-circle-outline" },
                { title: "C Arrays", url: "https://www.youtube.com/watch?v=5TQp7qon63k", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 C 数组", url: "https://www.runoob.com/cprogramming/c-arrays.html", icon: "mdi-file-document-outline" },
                { title: "W3Schools C Arrays", url: "https://www.w3schools.com/c/c_arrays.php", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '函数',
          description: '函数定义与声明、参数传递（值传递/地址传递）、递归函数',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "C 函数教程", url: "https://www.bilibili.com/video/BV1si4y1j7di", icon: "mdi-play-circle-outline" },
                { title: "C Functions", url: "https://www.youtube.com/watch?v=K8i8bZFGRS0", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 C 函数", url: "https://www.runoob.com/cprogramming/c-functions.html", icon: "mdi-file-document-outline" },
                { title: "W3Schools C Functions", url: "https://www.w3schools.com/c/c_functions.php", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '指针核心',
          description: '指针与地址、指针运算、指针与数组、指针与函数',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "C 指针教程", url: "https://www.bilibili.com/video/BV1si4y1j7di", icon: "mdi-play-circle-outline" },
                { title: "C Pointers", url: "https://www.youtube.com/watch?v=zuegQmMdy8M", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 C 指针", url: "https://www.runoob.com/cprogramming/c-pointers.html", icon: "mdi-file-document-outline" },
                { title: "W3Schools C Pointers", url: "https://www.w3schools.com/c/c_pointers.php", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '动态内存管理',
          description: 'malloc/calloc/realloc/free、内存泄漏防范',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "C 内存管理", url: "https://www.bilibili.com/video/BV1si4y1j7di", icon: "mdi-play-circle-outline" },
                { title: "C Memory", url: "https://www.youtube.com/watch?v=RmhUc4xo_Ho", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 C 内存", url: "https://www.runoob.com/cprogramming/c-memory-management.html", icon: "mdi-file-document-outline" },
                { title: "W3Schools C Memory", url: "https://www.w3schools.com/c/c_memory.php", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '结构体与联合体',
          description: 'struct 定义与嵌套、typedef、union、enum',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "C 结构体教程", url: "https://www.bilibili.com/video/BV1si4y1j7di", icon: "mdi-play-circle-outline" },
                { title: "C Structs", url: "https://www.youtube.com/watch?v=1Cg5JONtl5A", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 C 结构体", url: "https://www.runoob.com/cprogramming/c-structures.html", icon: "mdi-file-document-outline" },
                { title: "W3Schools C Structs", url: "https://www.w3schools.com/c/c_structs.php", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '文件操作',
          description: 'fopen/fclose/fread/fwrite、文本文件与二进制文件',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "C 文件操作", url: "https://www.bilibili.com/video/BV1si4y1j7di", icon: "mdi-play-circle-outline" },
                { title: "C File I/O", url: "https://www.youtube.com/watch?v=wKNziuIuym8", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 C 文件", url: "https://www.runoob.com/cprogramming/c-file-handling.html", icon: "mdi-file-document-outline" },
                { title: "W3Schools C Files", url: "https://www.w3schools.com/c/c_files.php", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '预处理指令',
          description: '#define 宏定义、条件编译、头文件包含',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "C 预处理", url: "https://www.bilibili.com/video/BV1si4y1j7di", icon: "mdi-play-circle-outline" },
                { title: "C Preprocessor", url: "https://www.youtube.com/watch?v=o9iT1M4L4QQ", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 C 预处理", url: "https://www.runoob.com/cprogramming/c-preprocessors.html", icon: "mdi-file-document-outline" },
                { title: "W3Schools C Preprocessor", url: "https://www.w3schools.com/c/c_preprocessor.php", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        }
      ]
    },
    {
      name: 'C++ 核心语法',
      subtitle: '必修',
      children: [
        {
          title: 'C++ 与 C 的区别',
          description: '新增关键字、函数重载、命名空间、默认参数',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "黑马程序员 C++ 教程", url: "https://www.bilibili.com/video/BV1vm4y1Z7eR", icon: "mdi-play-circle-outline" },
                { title: "C++", url: "https://www.youtube.com/watch?v=vLnPwxZdW4Y", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 C++", url: "https://www.runoob.com/cplusplus/cpp-tutorial.html", icon: "mdi-file-document-outline" },
                { title: "W3Schools C++", url: "https://www.w3schools.com/cpp/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '引用',
          description: '引用与指针的区别、引用传递、常引用、右值引用',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "C++ 引用教程", url: "https://www.bilibili.com/video/BV1vm4y1Z7eR", icon: "mdi-play-circle-outline" },
                { title: "C++ References", url: "https://www.youtube.com/watch?v=6fOUBgyIBFk", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 C++ 引用", url: "https://www.runoob.com/cplusplus/cpp-references.html", icon: "mdi-file-document-outline" },
                { title: "cppreference Reference", url: "https://en.cppreference.com/w/cpp/language/reference", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '面向对象',
          description: '类与对象、构造/析构函数、拷贝构造、this 指针',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "C++ OOP 教程", url: "https://www.bilibili.com/video/BV1vm4y1Z7eR", icon: "mdi-play-circle-outline" },
                { title: "C++ OOP", url: "https://www.youtube.com/watch?v=4L-DWkLtVjA", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 C++ 类", url: "https://www.runoob.com/cplusplus/cpp-classes-objects.html", icon: "mdi-file-document-outline" },
                { title: "cppreference Classes", url: "https://en.cppreference.com/w/cpp/language/classes", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '继承与多态',
          description: '继承方式、虚函数、纯虚函数与抽象类、虚表机制',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "C++ 继承多态", url: "https://www.bilibili.com/video/BV1vm4y1Z7eR", icon: "mdi-play-circle-outline" },
                { title: "C++ Inheritance", url: "https://www.youtube.com/watch?v=2BP8NhxjrO0", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 C++ 继承", url: "https://www.runoob.com/cplusplus/cpp-inheritance.html", icon: "mdi-file-document-outline" },
                { title: "cppreference Inheritance", url: "https://en.cppreference.com/w/cpp/language/derived_class", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '运算符重载',
          description: '成员函数/友元函数重载、常见运算符重载',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "C++ 运算符重载", url: "https://www.bilibili.com/video/BV1vm4y1Z7eR", icon: "mdi-play-circle-outline" },
                { title: "C++ Operator Overloading", url: "https://www.youtube.com/watch?v=BVk6J2iJIiM", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 运算符重载", url: "https://www.runoob.com/cplusplus/cpp-overloading.html", icon: "mdi-file-document-outline" },
                { title: "cppreference Operators", url: "https://en.cppreference.com/w/cpp/language/operators", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '模板编程',
          description: '函数模板、类模板、模板特化、可变参数模板',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "C++ 模板教程", url: "https://www.bilibili.com/video/BV1vm4y1Z7eR", icon: "mdi-play-circle-outline" },
                { title: "C++ Templates", url: "https://www.youtube.com/watch?v=HI5X8e0w7bI", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 C++ 模板", url: "https://www.runoob.com/cplusplus/cpp-templates.html", icon: "mdi-file-document-outline" },
                { title: "cppreference Templates", url: "https://en.cppreference.com/w/cpp/language/templates", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'STL 标准库',
          description: 'vector/list/deque/map/set、迭代器、算法（sort/find）',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "C++ STL 教程", url: "https://www.bilibili.com/video/BV1vm4y1Z7eR", icon: "mdi-play-circle-outline" },
                { title: "C++ STL", url: "https://www.youtube.com/watch?v=6OoSgY6NVVk", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 C++ STL", url: "https://www.runoob.com/cplusplus/cpp-stl-tutorial.html", icon: "mdi-file-document-outline" },
                { title: "cppreference STL", url: "https://en.cppreference.com/w/cpp/container", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '智能指针',
          description: 'unique_ptr/shared_ptr/weak_ptr、RAII 资源管理',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "C++ 智能指针", url: "https://www.bilibili.com/video/BV1vm4y1Z7eR", icon: "mdi-play-circle-outline" },
                { title: "Smart Pointers", url: "https://www.youtube.com/watch?v=wU0v3ynT5Yg", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "C++ 智能指针", url: "https://www.jianshu.com/p/e4919f1f0b8c", icon: "mdi-file-document-outline" },
                { title: "cppreference Smart Pointers", url: "https://en.cppreference.com/w/cpp/memory", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '异常处理',
          description: 'try/catch/throw、标准异常类、noexcept',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "C++ 异常处理", url: "https://www.bilibili.com/video/BV1vm4y1Z7eR", icon: "mdi-play-circle-outline" },
                { title: "C++ Exceptions", url: "https://www.youtube.com/watch?v=0H3gbE4TjLY", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 C++ 异常", url: "https://www.runoob.com/cplusplus/cpp-exceptions-handling.html", icon: "mdi-file-document-outline" },
                { title: "cppreference Exceptions", url: "https://en.cppreference.com/w/cpp/language/exceptions", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'C++11/14/17/20 新特性',
          description: 'auto/decltype、lambda 表达式、constexpr、concepts',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "C++ 新特性教程", url: "https://www.bilibili.com/video/BV1vm4y1Z7eR", icon: "mdi-play-circle-outline" },
                { title: "C++11-20", url: "https://www.youtube.com/watch?v=U6mgsPqV32A", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "C++ 新特性", url: "https://www.jianshu.com/p/8c5e9b8a1b0e", icon: "mdi-file-document-outline" },
                { title: "cppreference C++20", url: "https://en.cppreference.com/w/cpp/20", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        }
      ]
    },
    {
      name: '数据结构与算法',
      subtitle: '必修',
      children: [
        {
          title: '线性表',
          description: '动态数组、链表（单/双/循环）、栈、队列',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "数据结构线性表", url: "https://www.bilibili.com/video/BV1rJ411n7iW", icon: "mdi-play-circle-outline" },
                { title: "Data Structures", url: "https://www.youtube.com/watch?v=5ch9cF4bttM", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 数据结构", url: "https://www.runoob.com/data-structures/data-structures-tutorial.html", icon: "mdi-file-document-outline" },
                { title: "GeeksforGeeks DS", url: "https://www.geeksforgeeks.org/data-structures/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '树结构',
          description: '二叉树、二叉搜索树、AVL 树、红黑树',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "树结构教程", url: "https://www.bilibili.com/video/BV1rJ411n7iW", icon: "mdi-play-circle-outline" },
                { title: "Trees", url: "https://www.youtube.com/watch?v=oSWTXtMglKE", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 树", url: "https://www.runoob.com/data-structures/tree-structure.html", icon: "mdi-file-document-outline" },
                { title: "GeeksforGeeks Trees", url: "https://www.geeksforgeeks.org/binary-tree-data-structure/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '图',
          description: '邻接矩阵/邻接表、DFS/BFS 遍历、最短路径（Dijkstra/Floyd）',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "图结构教程", url: "https://www.bilibili.com/video/BV1rJ411n7iW", icon: "mdi-play-circle-outline" },
                { title: "Graphs", url: "https://www.youtube.com/watch?v=09_LlHjoEiY", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 图", url: "https://www.runoob.com/data-structures/graph-structure.html", icon: "mdi-file-document-outline" },
                { title: "GeeksforGeeks Graphs", url: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '排序算法',
          description: '快速排序、归并排序、堆排序、计数排序',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "小甲鱼 数据结构与算法", url: "https://www.bilibili.com/video/BV1rJ411n7iW", icon: "mdi-play-circle-outline" },
                { title: "Sorting Algorithms", url: "https://www.youtube.com/watch?v=HO-P9hCJ7Vg", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 排序", url: "https://www.runoob.com/w3cnote/sort-algorithm.html", icon: "mdi-file-document-outline" },
                { title: "GeeksforGeeks Sorting", url: "https://www.geeksforgeeks.org/sorting-algorithms/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '查找算法',
          description: '二分查找、哈希表、平衡树查找',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "查找算法教程", url: "https://www.bilibili.com/video/BV1rJ411n7iW", icon: "mdi-play-circle-outline" },
                { title: "Searching", url: "https://www.youtube.com/watch?v=9GkJ2qjC1F0", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 查找", url: "https://www.runoob.com/data-structures/search-algorithm.html", icon: "mdi-file-document-outline" },
                { title: "GeeksforGeeks Searching", url: "https://www.geeksforgeeks.org/searching-algorithms/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '算法分析与设计',
          description: '时间/空间复杂度、递归分治、动态规划、贪心算法',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "算法设计教程", url: "https://www.bilibili.com/video/BV1rJ411n7iW", icon: "mdi-play-circle-outline" },
                { title: "Algorithms", url: "https://www.youtube.com/watch?v=8hly31xKli0", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "算法入门", url: "https://www.jianshu.com/p/8c5e9b8a1b0e", icon: "mdi-file-document-outline" },
                { title: "GeeksforGeeks Algorithms", url: "https://www.geeksforgeeks.org/fundamentals-of-algorithms/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '字符串算法',
          description: 'KMP 匹配、Trie 字典树、后缀数组',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "字符串算法", url: "https://www.bilibili.com/video/BV1rJ411n7iW", icon: "mdi-play-circle-outline" },
                { title: "String Algorithms", url: "https://www.youtube.com/watch?v=9GkJ2qjC1F0", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "KMP 算法", url: "https://www.jianshu.com/p/dc529525c134", icon: "mdi-file-document-outline" },
                { title: "GeeksforGeeks KMP", url: "https://www.geeksforgeeks.org/kmp-algorithm-for-pattern-searching/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        }
      ]
    },
    {
      name: '系统编程',
      subtitle: '必修',
      children: [
        {
          title: 'Linux 操作系统基础',
          description: '常用命令、文件权限、进程管理',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Linux 教程", url: "https://www.bilibili.com/video/BV1nW411L7xm", icon: "mdi-play-circle-outline" },
                { title: "Linux", url: "https://www.youtube.com/watch?v=ZtqBQ68iF4o", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 Linux", url: "https://www.runoob.com/linux/linux-tutorial.html", icon: "mdi-file-document-outline" },
                { title: "Linux Docs", url: "https://www.linux.org/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Linux C 环境编程',
          description: 'gcc/gdb 调试、Makefile 编写、CMake 构建',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Linux C 编程", url: "https://www.bilibili.com/video/BV1nW411L7xm", icon: "mdi-play-circle-outline" },
                { title: "GDB", url: "https://www.youtube.com/watch?v=svGULQ1T7M0", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Linux C 编程一站式学习", url: "https://docs.huihoo.com/linux/learn-cn/", icon: "mdi-file-document-outline" },
                { title: "CMake Docs", url: "https://cmake.org/documentation/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '文件 I/O 系统调用',
          description: 'open/read/write/close、文件描述符、缓冲区',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Linux 系统编程", url: "https://www.bilibili.com/video/BV1nW411L7xm", icon: "mdi-play-circle-outline" },
                { title: "Linux System Calls", url: "https://www.youtube.com/watch?v=xHu7qI1gDPA", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Linux 文件 IO", url: "https://www.jianshu.com/p/8c5e9b8a1b0e", icon: "mdi-file-document-outline" },
                { title: "Linux System Programming", url: "https://www.geeksforgeeks.org/input-output-system-calls-c-create-open-close-read-write/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '多进程编程',
          description: 'fork/exec/wait、进程间通信（管道/信号/共享内存）',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Linux 多进程", url: "https://www.bilibili.com/video/BV1nW411L7xm", icon: "mdi-play-circle-outline" },
                { title: "Processes", url: "https://www.youtube.com/watch?v=cex9XrZBUoA", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Linux 进程通信", url: "https://www.jianshu.com/p/8c5e9b8a1b0e", icon: "mdi-file-document-outline" },
                { title: "Linux IPC", url: "https://www.geeksforgeeks.org/inter-process-communication/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '多线程编程',
          description: 'pthread 库、线程同步（互斥锁/条件变量/读写锁）',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Linux 多线程", url: "https://www.bilibili.com/video/BV1nW411L7xm", icon: "mdi-play-circle-outline" },
                { title: "Pthreads", url: "https://www.youtube.com/watch?v=YN9z4Wf3GmM", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Linux 线程", url: "https://www.jianshu.com/p/8c5e9b8a1b0e", icon: "mdi-file-document-outline" },
                { title: "POSIX Threads", url: "https://www.cs.cmu.edu/afs/cs/academic/class/15492-f07/www/pthreads.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '网络编程',
          description: 'socket 套接字、TCP/UDP 通信、epoll 多路复用',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Linux 网络编程", url: "https://www.bilibili.com/video/BV1nW411L7xm", icon: "mdi-play-circle-outline" },
                { title: "Socket Programming", url: "https://www.youtube.com/watch?v=LtXEMwSG5-8", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 Socket", url: "https://www.runoob.com/cprogramming/c-socket.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '内存管理深入',
          description: '堆栈布局、内存对齐、缓存行（Cache Line）',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "C 内存管理", url: "https://www.bilibili.com/video/BV1si4y1j7di", icon: "mdi-play-circle-outline" },
                { title: "Memory", url: "https://www.youtube.com/watch?v=8F6zW8bMqHk", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "内存对齐", url: "https://www.jianshu.com/p/8c5e9b8a1b0e", icon: "mdi-file-document-outline" },
                { title: "Memory Alignment", url: "https://www.geeksforgeeks.org/data-structure-alignment/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Shell 脚本',
          description: 'Bash 编程、自动化脚本编写',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Shell 教程", url: "https://www.bilibili.com/video/BV1nW411L7xm", icon: "mdi-play-circle-outline" },
                { title: "Shell Scripting", url: "https://www.youtube.com/watch?v=GtovwKDemnI", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 Shell", url: "https://www.runoob.com/linux/linux-shell.html", icon: "mdi-file-document-outline" },
                { title: "Bash Guide", url: "https://www.gnu.org/software/bash/manual/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'GDB 高级调试',
          description: '断点调试、core dump 分析、反汇编调试',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "GDB 教程", url: "https://www.bilibili.com/video/BV1nW411L7xm", icon: "mdi-play-circle-outline" },
                { title: "GDB", url: "https://www.youtube.com/watch?v=svGULQ1T7M0", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "GDB 中文教程", url: "https://www.jianshu.com/p/8c5e9b8a1b0e", icon: "mdi-file-document-outline" },
                { title: "GDB Docs", url: "https://sourceware.org/gdb/current/onlinedocs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        }
      ]
    },
    {
      name: '嵌入式方向',
      subtitle: '选修',
      children: [
        {
          title: 'STM32 开发',
          description: 'GPIO/Timer/UART/SPI/I2C 外设驱动开发',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "STM32 教程", url: "https://www.bilibili.com/video/BV1nW411L7xm", icon: "mdi-play-circle-outline" },
                { title: "STM32", url: "https://www.youtube.com/watch?v=hi9cS1SsCl0", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "STM32 中文社区", url: "https://www.stmcu.com.cn/", icon: "mdi-file-document-outline" },
                { title: "STM32 Docs", url: "https://www.st.com/en/microcontrollers-microprocessors/stm32-32-bit-arm-cortex-mcus.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '实时操作系统 FreeRTOS',
          description: '任务调度、信号量、消息队列',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "FreeRTOS 教程", url: "https://www.bilibili.com/video/BV1nW411L7xm", icon: "mdi-play-circle-outline" },
                { title: "FreeRTOS", url: "https://www.youtube.com/watch?v=FOSJQprAVdk", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "FreeRTOS 中文", url: "https://www.freertos.org/zh-cn-cmn-s/", icon: "mdi-file-document-outline" },
                { title: "FreeRTOS Docs", url: "https://www.freertos.org/Documentation/RTOS_book.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Arduino 与传感器',
          description: '传感器数据采集、I2C/SPI 协议',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Arduino 教程", url: "https://www.bilibili.com/video/BV1nW411L7xm", icon: "mdi-play-circle-outline" },
                { title: "Arduino", url: "https://www.youtube.com/watch?v=zJ-LqeX_fTU", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Arduino 中文", url: "https://www.arduino.cc/", icon: "mdi-file-document-outline" },
                { title: "Arduino Docs", url: "https://docs.arduino.cc/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Raspberry Pi',
          description: 'GPIO 控制、Linux 嵌入式系统、摄像头模块',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Raspberry Pi 教程", url: "https://www.bilibili.com/video/BV1nW411L7xm", icon: "mdi-play-circle-outline" },
                { title: "Raspberry Pi", url: "https://www.youtube.com/watch?v=eZ0J9WZz98M", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "树莓派中文", url: "https://www.raspberrypi.com/", icon: "mdi-file-document-outline" },
                { title: "Raspberry Pi Docs", url: "https://www.raspberrypi.com/documentation/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '硬件调试',
          description: '逻辑分析仪使用、示波器基本操作、Bootloader',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "逻辑分析仪", url: "https://www.jianshu.com/p/8c5e9b8a1b0e", icon: "mdi-file-document-outline" },
                { title: "Embedded Debug", url: "https://www.gnu.org/software/grub/manual/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        }
      ]
    },
    {
      name: '高性能计算方向',
      subtitle: '选修',
      children: [
        {
          title: '多线程进阶',
          description: 'OpenMP 并行编程、任务调度',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "OpenMP 教程", url: "https://www.bilibili.com/video/BV1nW411L7xm", icon: "mdi-play-circle-outline" },
                { title: "OpenMP", url: "https://www.youtube.com/watch?v=nE-xN4Bf8XI", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "OpenMP 中文", url: "https://www.openmp.org/", icon: "mdi-file-document-outline" },
                { title: "OpenMP Docs", url: "https://www.openmp.org/resources/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '分布式计算',
          description: 'MPI 消息传递接口、集群并行计算',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "MPI 教程", url: "https://www.bilibili.com/video/BV1nW411L7xm", icon: "mdi-play-circle-outline" },
                { title: "MPI", url: "https://www.youtube.com/watch?v=7gGUEhX2M0k", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MPI 中文", url: "https://www.mpich.org/", icon: "mdi-file-document-outline" },
                { title: "MPI Docs", url: "https://www.mpich.org/documentation/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'GPU 编程',
          description: 'CUDA 编程模型、线程/块/网格、共享内存优化',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "CUDA 教程", url: "https://www.bilibili.com/video/BV1nW411L7xm", icon: "mdi-play-circle-outline" },
                { title: "CUDA", url: "https://www.youtube.com/watch?v=STr8U5BvSMA", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "CUDA 编程指南", url: "https://docs.nvidia.com/cuda/cuda-c-programming-guide/", icon: "mdi-file-document-outline" },
                { title: "CUDA Programming Guide", url: "https://docs.nvidia.com/cuda/cuda-c-programming-guide/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '性能优化',
          description: '编译器优化选项、SIMD 指令集、循环展开、缓存优化',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "性能优化", url: "https://www.jianshu.com/p/8c5e9b8a1b0e", icon: "mdi-file-document-outline" },
                { title: "Agner Fog Optimization", url: "https://www.agner.org/optimize/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '性能分析工具',
          description: 'perf/gprof/Valgrind、火焰图分析',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "性能分析教程", url: "https://www.bilibili.com/video/BV1nW411L7xm", icon: "mdi-play-circle-outline" },
                { title: "Valgrind", url: "https://www.youtube.com/watch?v=f1jX1VUKYJo", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Valgrind 中文", url: "https://valgrind.org/", icon: "mdi-file-document-outline" },
                { title: "Valgrind Docs", url: "https://valgrind.org/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        }
      ]
    },
    {
      name: '游戏引擎方向',
      subtitle: '选修',
      children: [
        {
          title: '图形学基础',
          description: 'OpenGL/DirectX 渲染管线、着色器编写',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "OpenGL 教程", url: "https://www.bilibili.com/video/BV1nW411L7xm", icon: "mdi-play-circle-outline" },
                { title: "OpenGL", url: "https://www.youtube.com/watch?v=45MIykWJ-C4", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "LearnOpenGL 中文", url: "https://learnopengl-cn.github.io/", icon: "mdi-file-document-outline" },
                { title: "LearnOpenGL", url: "https://learnopengl.com/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Unreal Engine',
          description: 'C++ 与蓝图结合、Actor/Component 体系',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Unreal Engine 教程", url: "https://www.bilibili.com/video/BV1nW411L7xm", icon: "mdi-play-circle-outline" },
                { title: "Unreal Engine", url: "https://www.youtube.com/watch?v=k-zMkzmduqI", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "UE 官方文档", url: "https://docs.unrealengine.com/zh-CN/", icon: "mdi-file-document-outline" },
                { title: "Unreal Engine Docs", url: "https://docs.unrealengine.com/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '物理引擎',
          description: 'Bullet/PhysX 集成、碰撞检测、刚体模拟',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Bullet 中文", url: "https://pybullet.org/", icon: "mdi-file-document-outline" },
                { title: "PhysX Docs", url: "https://developer.nvidia.com/physx-sdk", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '游戏架构',
          description: '游戏循环、ECS 实体组件系统、资源管理',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "游戏架构教程", url: "https://www.bilibili.com/video/BV1nW411L7xm", icon: "mdi-play-circle-outline" },
                { title: "Game Architecture", url: "https://www.youtube.com/watch?v=5PwTkO2pZ0I", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "游戏架构", url: "https://www.jianshu.com/p/8c5e9b8a1b0e", icon: "mdi-file-document-outline" },
                { title: "Game Programming Patterns", url: "https://gameprogrammingpatterns.com/", icon: "mdi-file-document-outline" }
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
