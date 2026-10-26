---
title: "第 4 章 · 权限、用户与组"
description: "Linux 权限的最小单元是三枚比特：r 读、w 写、x 执行，分别对属主（user）、属组（group）、其他人（other）各来一组。"
series: linux
sidebar:
  order: 4
  label: "权限、用户与组"
difficulty: beginner
duration: 6
---

**本章目标：**

- 看懂 `ls -l` 的权限位，能用数字与符号两种方式修改权限与属主
- 分清 sudo 与 su 的使用场景，理解用户/组在 /etc/passwd 等文件中的记录方式
- 认识 SUID/SGID/Sticky 特殊权限与 ACL，建立一套权限问题的排查思路

## 4.1 rwx 与数字表示

Linux 权限的最小单元是三枚比特：**r 读、w 写、x 执行**，分别对**属主（user）、属组（group）、其他人（other）**各来一组。

```bash
ls -l /etc/hosts
```

```text
-rw-r--r-- 1 root root 205 Jun  1 08:00 /etc/hosts
└┬┘└─┬─┘└─┬─┘└─┬─┘ └─┬┘ └─┬┘
│  │  │  │    │    │
│  │  │  │    │    属组名（group）
│  │  │  │    属主名（user）
│  │  │  other：其他人权限
│  │  group：属组权限
│  user：属主权限
文件类型（- 文件，d 目录，l 链接）
```

数字表示法把 rwx 看作 4/2/1 的求和：`rw-r--r--` = `644`，`rwxr-xr-x` = `755`。目录的 x 含义是"能否进入/穿越该目录"，没有 x 的目录哪怕有 r 也无法访问其中文件——这是"chmod 700 ~/.ssh"这类要求的由来。

常见组合速记：

```text
644   普通文件默认：属主可写，大家可读
755   程序/目录默认：属主全权，大家可进入可执行
600   私钥、密码本：只许属主读写
700   私有目录：只许属主进出
```

## 4.2 chmod、chown 与 umask

```bash
chmod 644 report.txt              # 数字法：直接设定
chmod u+x deploy.sh               # 符号法：给属主加执行位（推荐，不怕覆盖别的位）
chmod -R o-w logs/                # 递归：去掉其他所有人的写权限
chown devops:devops app.log       # 同时改属主与属组（需特权）
chown -R www:www /var/www/html    # 递归改整棵目录树
```

新文件的默认权限 = 基准值减去 **umask**：

```bash
umask            # 常见输出 0022
```

对文件（基准 666）与目录（基准 777）分别相减：umask 022 时新建文件 `644`、目录 `755`。改 umask 用 `umask 002`（写进 shell 配置文件持久化）；团队共享目录常用 002，让同组人天然可写。

:::caution[chown -R 与 chmod -R 是双管枪]
对着 `/`、`/home`、`/usr` 来一发 `chmod -R 777` 能把系统权限体系搅得面目全非且几乎不可逆。执行递归改权限前必须：① 确认路径拼写；② 先 `ls -l 目标目录` 看清现状；③ 只给"确实需要的最小范围"加权限。777 不是解决方案，是事故报告的第一行。
:::

## 4.3 sudo 与 su

```bash
sudo apt update            # 以 root 身份执行"这一条命令"（Ubuntu）
sudo dnf makecache         # 同上（CentOS；最小镜像没预装 sudo 时先 dnf install sudo）
sudo -i                    # 以 root 身份开一个登录 shell（接近传统 su - 的用法）
su -                       # 切换到 root，需要的是 root 自己的密码
su - devops                # 切换到 devops，需要 devops 的密码（root 切换任何人免密）
```

sudo 的信任链来自 `/etc/sudoers`：用户直接属于特权组，或被管理员写了细粒度规则。查看/编辑**只能用 visudo**（它会先做语法检查再落盘）：

```bash
sudo visudo
```

```text
# Ubuntu/Debian：属于 sudo 组即可 sudo
%sudo   ALL=(ALL:ALL) ALL
# CentOS/RHEL：对应的是 wheel 组
%wheel  ALL=(ALL)     ALL
```

给新人开权限的标准动作（对应组的用户名替换）：

```bash
sudo usermod -aG sudo devops      # Ubuntu；CentOS 上组名是 wheel
newgrp - 或重新登录使组生效        # 组变更不影响已登录会话
```

:::danger[sudo 的密码是你的]
sudo 校验的是**当前用户**的密码（超时后可再输，`sudo -k` 强制下次重新输入）。任何让你"把密码粘进脚本/发给我"的教程或客服都是钓鱼。服务器生产环境优先用密钥 + 受限账号，第 7、10 章展开。
:::

## 4.4 用户与组：系统里的花名册

```bash
id                      # 当前用户的 uid/gid/附属组
id devops               # 查任意用户
groups                  # 我属于哪些组
getent passwd devops    # 查 /etc/passwd 里的一行记录
getent group devops     # 查 /etc/group
```

`/etc/passwd` 每行七个字段、冒号分隔（**它对所有人可读，密码不在这里**）：

```text
devops:x:1000:1000:Dev Ops,,,:/home/devops:/bin/bash
 名  占位 uid  gid   备注(GECOS)  家目录      登录 shell
```

`/etc/shadow` 存密码哈希与有效期，只有 root 可读（权限 640 且属组 shadow 是常见形态，两厂略有差异）。`/etc/group` 格式为 `组名:占位:gid:成员列表`。

```bash
sudo getent shadow devops
```

```text
devops:$y$j9T$Q7...$hh...:19706:0:99999:7:::
  └─┬┘└─────┬──────────┘ └┬─┘        └┬┘
  用户名   密码哈希        上次修改日   过期后宽限天数（各字段以 man 5 shadow 为准）
```

哈希前缀能读出一代算法：`$6$` 是 SHA-512-crypt，较新系统开始用 yescrypt（`$y$`）；看到明文或空字段要立刻警觉。

用户管理命令（Ubuntu 的 adduser/deluser 是交互式封装，CentOS 以 useradd/userdel 为准；两厂都能用后者）：

```bash
sudo useradd -m -s /bin/bash -G sudo coder   # -m 建家目录；Ubuntu 组名 sudo
sudo useradd -m -s /bin/bash -G wheel coder  # CentOS 写法
sudo passwd coder                              # 设置初始密码
sudo usermod -aG docker devops                 # 追加附属组（-a 千万别漏，漏了会覆盖原属组）
sudo userdel -r coder                          # 删用户并连带家目录
```

进程以"运行者的身份"拥有权限：`ps -o user= -p 1234` 查某进程属主；服务用专用低权账号运行（[第 5 章 · 进程与服务管理](./05-process-systemd/) 的 unit 里 `User=` 就是在指定这个身份，第 10 章生产环境正式落地）。

:::tip[附属组什么时候生效]
`usermod -aG` 之后**当前已登录的会话不会获得新组**——组成员关系在登录时快照。验证用 `id`：若列表里没有新组，重新登录（或退出 SSH 重连）即可；"加了 docker 组却 permission denied"的帖子十有八九栽在这一步。
:::

## 4.5 特殊权限：SUID、SGID、Sticky

普通 rwx 之外还有三个特殊位：

```text
SUID (4)  作用于可执行文件：执行时临时获得"文件属主"的权限
          典型：/usr/bin/passwd 属主 root 且带 s，普通用户因此能改 /etc/shadow
SGID (2)  文件：执行时获得属组权限；目录：新建文件继承目录的属组（共享目录利器）
Sticky (1) 作用于目录：目录内文件只能由"文件属主/目录属主/root"删除
          典型：/tmp 权限 1777 drwxrwxrwt，大家能写但不能互删
```

观察与设置：

```bash
ls -l /usr/bin/passwd          # 属主执行位显示为 rws（大写 S 表示设了位却没 x，异常）
ls -ld /tmp                    # drwxrwxrwt，末位 t 即 Sticky
chmod 4755 mytool              # 数字法设 SUID；符号法 chmod u+s mytool
chmod g+s share/               # 目录 SGID：进去后新建文件自动同组
chmod +t share/                # 目录 Sticky：防互删
```

:::caution[随便给脚本加 SUID 是危险动作]
SUID 让所有执行者借用属主身份。历史上无数提权案例源于一个"配置不当的 SUID 程序"。原则：SUID 只留给经过审计的系统工具；需要"以某身份运行"的服务场景，用 sudo 规则精确授权或 systemd 的 User= 指定（第 5 章），而不是 chmod u+s。
:::

## 4.6 ACL 一瞥：rwx 不够用时

rwx 只能表达"一个属主 + 一个属组 + 其他人"，需要"额外给 devops 读写、给 ops 只读"就得请出 **ACL**（访问控制列表）：

```bash
getfacl file.txt                       # 查看现有 ACL
sudo setfacl -m u:auditor:r-- file.txt # 追加规则：auditor 只读
sudo setfacl -x u:auditor file.txt     # 删除该条规则
ls -l file.txt                         # 权限串末尾多一个 + 号，说明带 ACL
```

ACL 需要文件系统挂载支持（ext4/xfs 现代发行版默认开启），`setfacl`/`getfacl` 属 acl 包，未安装时 `sudo apt install acl` 或 `sudo dnf install acl`。团队共享目录常见组合：目录 SGID + `setfacl -d -m g:project:rw dir/`（`-d` 设为默认 ACL，作用于未来新建文件）。

## 4.7 自查清单：当"Permission denied"出现时

按顺序走一遍，九成权限问题在此终结：

1. **谁在访问？** `id` 确认当前用户与组；是服务进程就查它的属主（`ps -o user= -p PID`）。
2. **目标到底权限几何？** `ls -ln 文件` 看数字位；别忘了 `namei -l /完整/路径` 逐级检查沿途每个目录是否有 x 位。
3. **是不是特殊位/ACL 在起作用？** `ls -l` 里的 s/t、`getfacl` 输出。
4. **sudoers 配置对不对？** 报错 "not in the sudoers file" 就是组没加对（Ubuntu 用 sudo 组、CentOS 用 wheel 组）。
5. **SELinux/AppArmor 拦截？** CentOS 上 `getenforce` 若为 Enforcing，文件安全上下文不对会拒得莫名其妙——去看 `/var/log/audit/audit.log` 或 `sudo ausearch -m avc -ts recent` 的拒绝记录；Ubuntu 对应的是 AppArmor，查 `sudo dmesg | grep -i apparmor`。处理方式与选项以 `man` 与发行版文档为准，不要一键 setenforce 0 了事。
6. **改的时候遵循最小权限**：先问"只读行不行"，再问"只给某组行不行"，最后才是放开的 chmod。

**综合练习：** 建一个共享目录——创建组 `team` 与两个用户 alice/bob；`mkdir /tmp/team-share`，属组 `team`、权限 `2775`（SGID + rwxrwxr-x）；alice 建文件后验证 bob 同组可写、且 `ls -l` 属组是 team；最后用 ACL 给 observer 用户只读。做完用 4.7 的清单反向"审查"自己的成果。

## 本章小结

- 权限 = user/group/other 三组 rwx（4/2/1），目录的 x 是"能否通行"；644/755/600/700 是最常用组合
- 改权限用符号法更安全（chmod u+x），chown 改属主属组，umask 决定新文件默认位；sudo 提权单条命令、su 整段换身份，sudoers 只经 visudo 编辑（Ubuntu 认 sudo 组、CentOS 认 wheel 组）
- SUID 借文件属主身份、SGID 继承属组、Sticky 防互删；rwx 表达不了的交给 ACL
- 遇到 Permission denied 按"身份→目标权限→沿途目录 x 位→特殊位→安全模块"顺序排查
