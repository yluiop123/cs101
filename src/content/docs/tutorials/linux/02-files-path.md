---
title: "第 2 章 · 文件系统与路径"
description: "Linux 里定位一个文件有两条路：绝对路径从根 / 出发，相对路径从\"当前工作目录\"出发。"
series: linux
sidebar:
  order: 2
  label: "文件系统与路径"
difficulty: beginner
duration: 6
---

**本章目标：**

- 分清绝对路径与相对路径，熟练运用 `.`、`..`、`~` 三个路径 shorthand
- 掌握 ls/cd/pwd 与 cp/mv/rm/mkdir/touch 等文件目录日常操作
- 会区分软链接与硬链接，能用 find/locate/du/df 定位文件与查看空间

## 2.1 绝对路径与相对路径

Linux 里定位一个文件有两条路：**绝对路径**从根 `/` 出发，**相对路径**从"当前工作目录"出发。

```text
/etc/nginx/nginx.conf        绝对路径：以 / 开头，全局唯一、不含糊
nginx.conf                   相对路径：取决于你现在站在哪
../nginx.conf                相对路径：上一级目录里的 nginx.conf
./scripts/deploy.sh          相对路径：当前目录的 scripts 子目录
```

三条铁律：

- 以 `/` 开头就是绝对路径；否则一律按当前目录解析
- `.` 指当前目录，`..` 指父目录，`~` 指当前用户的家目录（`~devops` 则是 devops 的家）
- 同一个相对路径在不同目录下含义不同——脚本报"No such file"时先想"我现在在哪"

## 2.2 ls、cd、pwd：走路与张望

```bash
pwd              # 报告当前所在目录（print working directory）
cd /var/log      # 进入目录
cd ~             # 回家（cd 不带参数效果相同）
cd -             # 跳回上一次所在目录，来回横跳神器
ls               # 列出当前目录
ls -a            # 连隐藏文件（以 . 开头）一起列
ls -l            # 长格式：权限、属主、大小、修改时间
ls -lh           # 大小用 K/M/G 人类可读
ls -lt           # 按修改时间倒序，最新在前
```

`ls -l` 每列的含义先眼熟，权限列在 [第 4 章 · 权限、用户与组](./04-permission-user/) 细拆：

```text
-rw-r--r-- 1 devops devops  4.2K Jun  3 10:12 notes.md
drwxr-xr-x 2 devops devops 4.0K Jun  1 08:00 scripts
lrwxrwxrwx 1 devops devops   11 Jun  3 09:00 latest -> v2.tar.gz
```

:::tip[把常用组合变成肌肉记忆]
`ls -lha` 看全档案、`cd -` 往返、`Tab` 补全路径（补不出来的就是不存在）、`Ctrl+R` 反查历史命令。这四个操作熟练后，终端效率翻倍。目录名含空格时必须引号包住：`cd "My Projects"`，第 9 章会讲透空格陷阱。
:::

## 2.3 通配符与花括号展开

shell 在把参数交给命令**之前**就先做展开，这是 Linux 命令行的独门效率来源。

通配符（glob）三件套：

```bash
ls *.log            # 任意长度任意字符
ls app_?.log        # ? 恰好一个字符
ls [abc]*.log       # 方括号：任选其一；[0-9] 数字段
```

花括号展开由 shell 本身完成（不要求有匹配文件存在）：

```bash
mkdir -p {dev,staging,prod}/conf      # 一次建四个风格的目录
cp app.conf{,.bak}                     # 等价于 cp app.conf app.conf.bak，备份神技
touch 2024-{01,02,03}-report.md       # 批量建文件
```

:::caution[glob 与正则别搞混]
glob 的 `*` 是"任意字符串"，正则的 `*` 是"前一个字符重复 N 次"——同形不同义。本章的 `*.log` 是 glob，第 3 章 grep 里的 `.*` 是正则。另外 glob 展开后若一个都没匹配上，bash 默认把原文传下去（可能让 rm 之类的命令报"文件不存在"，而不是什么都没做）。
:::

## 2.4 cp、mv、rm、mkdir、touch：日常五件套

```bash
cp a.txt b.txt               # 复制文件
cp -r docs/ /tmp/docs-copy   # 复制目录必须 -r（recursive）
cp -n a.txt b.txt            # 目标已存在时不覆盖（-i 则逐个询问）
mv a.txt old/                # 移动 = 改名 + 换目录，一个命令两用
mkdir work                   # 建单层目录
mkdir -p a/b/c/d             # 连中间层一起建，已存在不报错
touch newfile                # 不存在则建空文件；存在则只更新时间戳
rm oldfile                   # 删除文件
rm -r build/                 # 删目录
rm -f *.tmp                  # -f 静默，不存在的也不报错
```

两个高危点必须立规矩：

:::danger[rm 没有回收站]
`rm` 直接从目录项上解除链接，删了就没了。养成三个习惯：删大目录前先 `ls` 确认内容；写脚本时 rm 一律 `rm -f -- "$path"` 形式带变量引号（第 9 章）；**永远不要执行来路不明的 `rm -rf` 组合**，尤其带未定义变量的，如 `rm -rf "$DIR/"*` 在 DIR 为空时会把当前目录清空。
:::

`mv` 同分区内是改目录项、瞬时完成；跨分区则是完整复制再删除，大文件会慢，进度自己看不到——可以用 `rsync -ah --progress` 替代（选项以 `man rsync` 为准）。

## 2.5 软链接与硬链接

```bash
ln -s /usr/share/doc/nginx-doc/ latest-doc   # 软链接（symbolic link）
ln hardlink-target mylink                    # 硬链接（不带 -s）
```

两者的本质区别：

```text
软链接   独立文件，内容是一句"指向哪里"；有自己的 inode
         可以跨文件系统、可以指向目录；源删掉后链接悬空（ls -l 显示红色）
         类比：Windows 快捷方式 / 高速路指示牌
硬链接   与源共用同一个 inode，只是同一份数据多了一个名字
         不能指向目录、不能跨文件系统；删源不影响硬链接（数据要等所有链接都删完才释放）
         类比：同一栋楼挂了两块门牌
```

验证 inode 编号：

```bash
echo hello > t.txt
ln t.txt t.hard
ln -s t.txt t.soft
ls -li            # 第一列是 inode：t.txt 与 t.hard 相同，t.soft 是另一个号
```

软链接的实战场景：`/etc/alternatives` 切换默认版本、nginx 的 sites-enabled 目录、部署时 `current -> releases/20260901` 原子切版本。

:::caution[删源文件与链接的行为]
软链接指向的目标被删后，链接即悬空，访问报"No such file or directory"；而硬链接删掉原始名后数据依然完好，`ls -li` 的链接数会减一。备份与清理脚本要意识到：**按名字删除不等于按名字删除数据**。
:::

## 2.6 find、locate 与空间盘点：du、df

`find` 实时遍历目录树，条件组合能力极强：

```bash
find /var/log -name "*.gz"              # 按名字（glob 风格）
find . -type d                          # 只列目录；-type f 只列文件
find /tmp -mtime +7                     # 7 天前之后修改过的；-mmin 60 为最近 60 分钟
find . -size +100M                      # 超过 100MB 的文件
find /backup -name "*.log" -delete      # 找到即删除（危险，先去掉 -delete 跑一遍确认清单）
find . -name "*.conf" -exec grep -l proxy {} \;   # 对每个结果执行命令
```

`-exec` 的 `{}` 是 find 的占位符（由 find 填充路径，与第 9 章的 shell 变量是两回事）；先用 `-print` 替换 `-exec` 跑一遍，眼见为实再删。

`locate` 则查预建索引，秒出结果但不保证新鲜：

```bash
locate nginx.conf        # 结果来自数据库，可能落后于现实
sudo updatedb            # 手动刷新索引（没装先装 plocate 或 mlocate 包）
```

:::tip[选哪个]
日常"这文件装在哪了"用 locate；审计、清理、批量操作用 find——find 看到的是此刻的真实文件系统，locate 看到的是上一次索引时的快照。find 全盘扫描慢且会撞权限墙，加 `2>/dev/null` 吞掉 Permission denied 噪音。
:::

最后盘空间：

```bash
df -h              # 文件系统级的使用率（human-readable）
df -i              # inode 使用率——磁盘没满但"inode 满"照样写不进（第 8 章）
du -sh /var/log    # 单个目录总共占多少
du -h --max-depth=1 /var | sort -h | tail   # /var 下一层谁最大
```

`df` 是"各挂载点还剩多少"，`du` 是"这坨目录占了多少"。两者对不上账时，通常是已删除但仍被进程占用的文件（第 8 章用 `lsof`/`/proc` 排查）或被别的挂载点遮住的旧数据。

## 2.7 综合练习

**综合练习：给项目目录做大扫除。** 假设 `/tmp/cleanup-demo` 里有一堆混乱文件，完成以下动作链：

```bash
# 1. 造一个练手现场
mkdir -p /tmp/cleanup-demo/{src,docs,build}
touch /tmp/cleanup-demo/src/{main.c,utils.c} /tmp/cleanup-demo/build/{a.o,b.o,app}
echo log > /tmp/cleanup-demo/old-2024.log

# 2. 用相对/绝对路径进入并盘点
cd /tmp/cleanup-demo && pwd && ls -lha

# 3. 建软链接方便以后直达 build
ln -s /tmp/cleanup-demo/build blt && ls -l blt

# 4. find 找出所有 .o 与 .log，先列清单再删除
find /tmp/cleanup-demo \( -name "*.o" -o -name "*.log" \) -print
find /tmp/cleanup-demo \( -name "*.o" -o -name "*.log" \) -delete

# 5. du 看各子目录占用，收尾删除整个现场
du -h --max-depth=1 /tmp/cleanup-demo
rm -rf /tmp/cleanup-demo
```

做完自查：第 4 步为什么必须"先 `-print` 后 `-delete`"？`blt` 这个软链接在 `-delete` 时会不会把 build 真身删掉？（不会——find 默认不跟随软链接，可用 `ls -li` 佐证。）

## 本章小结

- 绝对路径从 `/` 起、相对路径从当前目录起；`.`、`..`、`~` 与 `cd -` 构成走路基本功
- glob（`* ? []`）作用于已存在的文件，花括号展开能凭空生成路径列表，`cp a{,.bak}` 是备份神技
- 软链接是指路牌（可跨目录可指目录，源删即悬空），硬链接是同一 inode 的第二个名字
- rm 无回收站：删除前先列清单；`find -exec` 类批量操作同理，先看 `-print` 再动手；拿不准的参数以 `man find`、`--help` 为准
