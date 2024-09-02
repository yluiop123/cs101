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
      },
      {
        base: '/base/cs/operating-systems/cpuscheduling/',
        text: 'CPU调度',
        collapsed: true,
        items: [
          {
            text: '进程管理简介',
            link: 'introduction-of-process-management',
          },
          {
            text: '操作系统中的进程状态',
            link: 'states-of-a-process-in-operating-systems',
          },
          {
            text: '进程表和进程控制块（PCB）',
            link: 'process-table-and-process-control-block-pcb',
          },
          {
            text: '操作系统中的进程调度',
            link: 'process-schedulers-in-operating-system',
          },
          {
            text: '作系统中的CPU调度',
            link: 'cpu-scheduling-in-operating-systems',
          },
          {
            text: '抢占式和非抢占式调度',
            link: 'preemptive-and-non-preemptive-scheduling',
          },
          {
            text: '度量上下文切换所花费的时间',
            link: 'measure-time-spent-context-switch',
          },
          {
            text: '调度器和分派器之间的区别',
            link: 'difference-between-dispatcher-and-scheduler',
          },
          {
            text: 'FCFS 1',
            link: 'program-for-fcfs-cpu-scheduling-set-1',
          },
          {
            text: 'FCFS 2',
            link: 'program-for-fcfs-cpu-scheduling-set-2-processes-with-different-arrival-times',
          },
          {
            text: '操作系统中的车队效应',
            link: 'convoy-effect-operating-systems',
          },
          {
            text: 'Belady异常',
            link: 'beladys-anomaly-in-page-replacement-algorithms',
          },
          {
            text: '非抢占式最短作业优先',
            link: 'program-for-shortest-job-first-or-sjf-cpu-scheduling-set-1-non-preemptive',
          },
          {
            text: '最短剩余时间优先',
            link: 'shortest-remaining-time-first-preemptive-sjf-scheduling-algorithm',
          },
          {
            text: '最短作业优先',
            link: 'shortest-job-first-cpu-scheduling-with-predicted-burst-time',
          },
          {
            text: '最长剩余时间优先 (LRTF) CPU 调度程序',
            link: 'longest-remaining-time-first-lrtf-cpu-scheduling-program',
          },
          {
            text: '最长剩余时间优先',
            link: 'longest-remaining-time-first-lrtf-cpu-scheduling-algorithm',
          },
          {
            text: '循环轮转调度算法',
            link: 'program-for-round-robin-scheduling-for-the-same-arrival-time',
          },
          {
            text: '自私的循环轮转',
            link: 'selfish-round-robin-cpu-scheduling',
          },
          {
            text: '111',
            link: 'qqq',
          },
          {
            text: '111',
            link: 'qqq',
          },
          {
            text: '111',
            link: 'qqq',
          }
        ]
      }
    ]
  }