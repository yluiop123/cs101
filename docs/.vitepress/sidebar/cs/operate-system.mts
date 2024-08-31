import {type DefaultTheme } from 'vitepress'

export function sidebarOperateSystem(): DefaultTheme.SidebarItem[] {
    return [
      {
        base: '/base/cs/operating-systems/basics/',
        text: '基础知识',
        collapsed: true,
        items: [
          {
            text: '操作系统介绍',
            link: 'introduction-of-operating-system',
          },
          {
            text: '操作系统类型',
            link: 'types-of-operating-systems',
          },
          {
            text: '操作系统的功能',
            link: 'functions-of-operating-system',
          },
          {
            text: '实时系统',
            link: 'real-time-systems',
          },
          {
            text: '实时系统中的任务',
            link: 'tasks-in-real-time-systems',
          },
          {
            text: '多程序、任务、线程、进程',
            link: 'difference-between-multitasking-multithreading-and-multiprocessing',
          },
          {
            text: 'RAM和ROM',
            link: 'random-access-memory-ram-and-read-only-memory-rom',
          },
          {
            text: '32位和64位操作系统',
            link: '32-bit-vs-64-bit-operating-systems',
          },
          {
            text: '电脑启动流程',
            link: 'what-happens-when-we-turn-on-computer',
          },
          {
            text: '操作系统中的引导块',
            link: 'boot-block-in-operating-system',
          },
          {
            text: 'UEFI',
            link: 'uefi',
          }
        ]
      },
      {
        base: '/base/cs/operating-systems/systemstructure/',
        text: '系统架构',
        collapsed: true,
        items: [
          {
            text: '操作系统中的微内核',
            link: 'microkernel-in-operating-systems',
          },
          {
            text: '操作系统中的内核 I/O 子系统',
            link: 'kernel-i-o-subsystem-in-operating-system',
          },
          {
            text: '单内核和与微内核的主要区别',
            link: 'monolithic-kernel-and-key-differences-from-microkernel',
          },
          {
            text: '系统调用',
            link: 'introduction-of-system-call',
          },
          {
            text: '在 C 语言中获取/设置进程资源限制',
            link: 'get-set-process-resource-limits-in-c',
          },
          {
            text: '操作系统中的双模式操作',
            link: 'dual-mode-operations-os',
          },
          {
            text: '操作系统中的特权和非特权指令',
            link: 'privileged-and-non-privileged-instructions-in-operating-system',
          }
        ]
      }
    ]
  }