---
title: "第 1 章 · 发行版、终端与 shell 基础"
description: "严格地说，Linux 只是内核——那个管理 CPU、内存、磁盘与网络的程序。你装到电脑上的“Linux”其实是发行版（distribution）：内核 + 基础工具链 + 包管理器 + 一套默认配置的完整组合。"
series: linux
sidebar:
  order: 1
  label: "发行版、终端与 shell 基础"
difficulty: beginner
duration: 6
tableOfContents: true
---

**本章目标：**

- 理解 Linux 与发行版的关系，搭好适合自己的练习环境（WSL2 / 虚拟机 / 云主机）
- 知道 shell 是什么，能通过终端或 SSH 登录系统，并认识 FHS 目录约定
- 会用 `man` 与 `--help` 独立查询命令用法，遇到不确定的参数知道去哪里找答案

## 1.1 Linux 是什么，发行版怎么选

严格地说，**Linux 只是内核**——那个管理 CPU、内存、磁盘与网络的程序。你装到电脑上的"Linux"其实是**发行版（distribution）**：内核 + 基础工具链 + 包管理器 + 一套默认配置的完整组合。

主流发行版按家族划分：

```text
Debian 家族（包管理：apt / dpkg）
  Debian        —— 稳定保守，服务器老牌选择
  Ubuntu        —— 社区最大、文档最全，22.04 / 24.04 为 LTS 长期支持版
RHEL 家族（包管理：dnf / rpm）
  Fedora        —— 上游试验田，软件较新
  CentOS Stream —— RHEL 的滚动上游，本教程的 dnf 参照
  Rocky / Alma  —— 与 RHEL 二进制兼容的"复刻版"
其他
  Arch（pacman）、openSUSE（zypper）等
```

两条命令就能确认自己手里的发行版：

```bash
cat /etc/os-release    # 发行版名称与版本
uname -a               # 内核版本与主机名
```

:::tip[本教程的双参照约定]
所有命令以 **Ubuntu 22.04/24.04** 与 **CentOS Stream** 并列演示：`apt` 与 `dnf` 的命令差异、个别服务名差异（如 SSH 服务在 Ubuntu 叫 `ssh`、在 CentOS 叫 `sshd`）都会标注。初学者选 Ubuntu 练习即可，文档与求助资源最多。
:::

## 1.2 搭建练习环境

三条路线按上手成本排序：

**路线一：WSL2（Windows 用户首选）**。在 Windows PowerShell（管理员）中运行 `wsl --install -d Ubuntu-24.04`，重启后按提示设置用户名密码，即得到一个 Ubuntu。装好后第一件事仍是刷新软件索引：

```bash
sudo apt update && sudo apt -y upgrade
```

:::caution[WSL2 默认不一定有 systemd]
部分 WSL2 镜像默认不启用 systemd，第 5 章的 `systemctl` 会报错。需在 `/etc/wsl.conf` 中开启 systemd 支持后，在 Windows 侧执行 `wsl --shutdown` 重启发行版；具体选项以你所用 WSL 与 Ubuntu 版本的官方文档为准。
:::

**路线二：虚拟机**。VirtualBox（跨平台免费）或 macOS 上的 UTM，下载 Ubuntu Server 或 CentOS Stream 的 **minimal/server 镜像**安装，内存 1~2 GB 即可。好处是可以随便玩坏、快照回滚。

**路线三：云主机**。任何云厂商最便宜的按量实例即可，真实公网 IP 还能顺带练 SSH 与防火墙（第 7、10 章）。注意：初始密码强度要够，或用密钥创建。

## 1.3 shell 是什么

登录之后的那个"等你敲命令"的循环程序就是 **shell**——命令解释器。它把一行文字解析成"程序名 + 参数"，替你启动进程、接好输入输出。提示符就是 shell 在告诉你"我在听"：

```text
devops@ubuntu-srv:~$
└─┬─┘ └───┬────┘ │  └┬┘
 用户    主机名 当前目录 普通用户提示符（root 是 #）
```

常见 shell 有：

```text
bash   —— Bourne Again Shell，绝大多数服务器的默认，本教程主角
zsh    —— 交互体验更好（补全、主题），macOS 默认
fish   —— 开箱即用，语法与 bash 有差异
dash   —— 极简，Ubuntu 里 /bin/sh 的实际指向
```

查看与更换当前 shell：

```bash
echo "$SHELL"        # 当前登录 shell 的路径
cat /etc/shells      # 系统里已安装的可用 shell 列表
chsh -s /bin/zsh     # 更换登录 shell（重新登录生效）
```

一次典型的 shell 工作过程——你输入的每个字符都经过它解析：

```text
你输入:    ls -l /etc | wc -l
shell 做:  启动 ls 进程，参数为 -l 与 /etc
           把 ls 的标准输出接一根管道
           启动 wc 进程，参数为 -l，从管道读入
结果:      456
```

管道 `|`、重定向 `>`、变量展开 `$VAR` 这些"命令行魔法"全部发生在 shell 层，而不是某个程序的能力——这正是第 3 章文本管道与第 9 章脚本编程的地基。

:::note[shell 与终端不是一回事]
**终端（terminal）**是显示窗口的程序——GNOME Terminal、Windows Terminal、iTerm2，以及 VS Code 内置终端；**shell**是窗口里运行的解释器。你在哪个终端里打字，启动的都是同一个 bash。
:::

## 1.4 终端与 SSH 登录

练习 Linux 的日常姿势有两种：本机终端直接进（WSL/虚拟机控制台），或通过网络用 **SSH** 远程登录服务器：

```bash
ssh devops@203.0.113.10        # 默认端口 22
ssh -p 2222 devops@example.com # 服务器 SSH 改过端口时
```

第一次连接陌生主机会要求确认主机指纹：

```text
The authenticity of host '203.0.113.10' can't be established.
ED25519 key fingerprint is SHA256:z2G3...
Are you sure you want to continue connecting (yes/no)? yes
devops@203.0.113.10's password:
```

输入 `yes` 后主机指纹会被记入 `~/.ssh/known_hosts`，之后再连接不再询问。退出登录用 `exit` 或 `Ctrl+D`。

:::danger[日常不要用 root 直接登录]
root 的一举一动没有确认环节，一条打错的路径就可能毁掉系统。正确姿势：普通用户登录，需要特权时用 `sudo` 临时提权（[第 4 章 · 权限、用户与组](../04-permission-user/) 展开），服务器上线后再禁用 root 密码登录（第 10 章）。密钥免密登录的实操在 [第 7 章 · 网络与排查](../07-network/)。
:::

## 1.5 目录约定：FHS

Linux 的世界观是"**一切皆文件**"：硬件是 `/dev` 下的设备文件，进程信息在 `/proc` 下，连内核参数也通过文件读写。所有发行版共同遵守 **FHS（Filesystem Hierarchy Standard）**，根目录 `/` 下每个一级目录职责固定：

```bash
ls /
```

```text
bin  boot  dev  etc  home  lib  media  mnt  opt  proc  root  run
sbin  srv  sys  tmp  usr  var
```

高频目录速记：

```text
/bin /sbin      基础与管理员命令（ls、ip 等）
/etc            系统级配置文件（所有发行版一致地选这里）
/home           普通用户家目录，devops 的家是 /home/devops
/root           root 的家目录
/tmp            临时文件，重启可能被清空
/var            经常"变"的数据：日志在 /var/log，缓存在 /var/cache
/usr            用户安装的程序与库；/usr/local 是自编译软件的推荐安装点
/opt            单目录自包含的第三方软件
/proc /sys      内核与进程的虚拟文件视图，不占磁盘
```

配置文件的位置在不同发行版偶有出入，具体差异以各软件文档与 `man` 说明为准；例如 SSH 主配置文件两处发行版都在 `/etc/ssh/sshd_config`，但它对应的服务名并不相同，第 10 章会正式对比。

## 1.6 查文档：man 与 --help

Linux 命令的参数浩如烟海，**没人背得住，也不需要背**——关键是会查。每个正式安装的命令都自带两路文档：

```bash
ls --help        # 简明的参数清单，多数 GNU 命令支持
man ls           # 完整手册页（manual），按 q 退出
man -k free      # 按关键字搜索手册页（等价于 apropos free）
```

`man` 的输出按固定小节组织：`NAME`（一句话说明）→ `SYNOPSIS`（用法格式）→ `DESCRIPTION`（详解）→ `OPTIONS`（每个参数的说明）→ `EXAMPLES`（示例，若作者厚道）。在 `man` 页面里：空格翻页、`/关键字` 向下搜索、`n` 跳下一个匹配、`q` 退出。

手册页按"节（section）"编号，同名条目用节号区分：

```text
man 1 passwd   —— 第 1 节：用户命令 passwd
man 5 passwd   —— 第 5 节：文件格式说明 /etc/passwd
man 8 useradd  —— 第 8 节：管理员命令
```

:::tip[极简镜像可能"没有手册"]
容器或 minimal 安装常不带 man-db，先补装：`sudo apt install -y man-db` 或 `sudo dnf install -y man-db`。另外本教程凡拿不准的参数，都会提醒以 `man` 与 `--help` 为准——这是比任何教程都权威的现场答案。
:::

## 1.7 综合练习

用一个 15 分钟的闭环把本章知识串起来：

1. 打开练习环境，记录三条身份信息：

   ```bash
   cat /etc/os-release | head -n 2
   uname -a
   echo "$SHELL"
   ```

2. 执行 `ls /`，逐个一级目录对照 1.5 表格说出职责；再用 `ls -l /etc` 观察"配置文件长什么样"（`-l` 各列的含义第 2、4 章拆解）。

3. 用 `man ls` 找到 `-t`、`-h`、`-a` 三个选项的说明，回到终端逐一试用，验证手册说的是否属实。

4. 分别运行 `man -k service` 与 `man -k network`，看看能捞出哪些命令——以后遇到新工具先 `-k` 一下是低成本的习惯。

5. 双发行版对照（有条件再做）：在 Ubuntu 上运行 `apt search nginx`，在 CentOS 环境运行 `dnf search nginx`，比较两边输出的格式差异。

## 本章小结

- Linux 只是内核，发行版 = 内核 + 工具链 + 包管理器；本教程双参照 Ubuntu LTS 与 CentOS Stream
- shell 是命令解释器，终端只是它的显示窗口；日常用普通用户 + sudo，别裸用 root
- FHS 约定了 `/etc` 放配置、`/var/log` 放日志、`/usr/local` 放自编译软件
- `--help` 查参数清单，`man` 查完整手册，`man -k` 按关键字找命令——不确定的参数以二者为准
