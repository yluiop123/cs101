---
title: "第 3 章 · 文件查看与文本处理"
description: "cat notes.md # 整个打到屏幕上（短文件）"
series: linux
sidebar:
  order: 3
  label: "文件查看与文本处理"
difficulty: beginner
duration: 5
tableOfContents: true
---

**本章目标：**

- 熟练用 cat/less/head/tail 查看文件，并用 tail -f 实时盯日志
- 掌握 grep 正则过滤与 cut/sort/uniq/tr/wc 的管道组合拳
- 会用 sed 做批量替换、awk 做列统计、diff/patch 比较与打补丁

## 3.1 查看文件：cat、less、head、tail

```bash
cat notes.md             # 整个打到屏幕上（短文件）
cat -n notes.md          # 带行号
less app.log             # 分页查看大文件的事实标准
less +F app.log          # 打开即进入类 tail -f 的跟随模式，按 Ctrl+C 回到翻页
head -n 20 big.csv       # 前 20 行（默认 10）
tail -n 5 big.csv        # 后 5 行
tail -c 100 file         # 按字节取尾部
```

`less` 内部的按键值得单独记：

```text
空格/b   下/上翻一屏        g/G   首行/末行
/词      向下搜索  n/N 跳下一个/上一个
Ctrl+d/Ctrl+u  半屏滚动     q     退出
```

`less` 里还能直接接力搜索：`/error` 跳到匹配、`n` 下一个；`less -N file` 打开显示行号，与 `grep -n` 的输出可互相印证。部分 less 版本还支持 `&模式` 进入过滤视图（只显示匹配行），是否存在以 `man 1 less` 为准。

日志类文件永远在长大，`head`/`tail` 让你只看一头，`less` 让你不卡终端地翻阅——不要用 `cat` 打开一个几百 MB 的日志，屏幕会被瞬间刷爆且无法中断。

## 3.2 tail -f：盯住正在写的日志

```bash
tail -f /var/log/nginx/access.log     # 从尾部开始，持续输出新行
tail -n 100 -f app.log                # 先回看 100 行再跟随
tail -F /var/log/app.log              # 日志被轮转（改名重建）后继续跟，长跑值守用它
```

:::caution[日志文件名两厂不同]
Ubuntu/Debian 的系统日志在 `/var/log/syslog`（24.04 起 journald 也可能只留二进制，见第 5 章），CentOS/RHEL 传统上在 `/var/log/messages`。应用日志则各自为政，上线后先 `ls /var/log/` 认场子；systemd 托管的服务直接用 `journalctl -u 服务名 -f` 更稳（第 5 章）。
:::

`tail -f` 卡住不动不代表日志停了，可能是程序把日志写去了别处——`ls -l /proc/进程号/fd` 可以看到进程当前真正握着哪些文件（第 8 章还会用到这个技巧）。

两个进阶搭配：

```bash
tail -f access.log | grep --line-buffered ' 500 '     # 只盯 500，逐行输出不被缓冲憋住
grep ' 500 ' access.log > errors.log & tail -f errors.log  # 过滤结果落盘，另开窗口跟它
```

管道里 grep 的输出默认按块缓冲，配合 `-f` 会"半天不出字"，`--line-buffered` 是按行刷的解药——这是 tail -f 管道组合最常见的隐形坑。若服务由 systemd 托管（[第 5 章 · 进程与服务管理](../05-process-systemd/)），`journalctl -u 服务名 -f` 天然支持过滤（`-p err` 按级别），多数场景比 tail -f 更省心。

## 3.3 grep 与正则：从万行日志里捞那一行

```bash
grep error app.log              # 含 error 的行
grep -i error app.log           # 忽略大小写
grep -n error app.log           # 显示行号
grep -v '^#' /etc/ssh/sshd_config    # 反选：去掉注释行看有效配置
grep -r "TODO" src/             # 递归搜目录
grep -c error app.log           # 只报数量
grep -E "4[0-9]{2} " access.log      # 扩展正则（等价 egrep）：匹配 4xx
grep -oE "10\.[0-9]+\.[0-9]+\.[0-9]+" access.log   # 只输出匹配片段
```

正则速记（与第 2 章 glob 不同，这是 grep 方言）：

```text
.        任意单字符        *        前一项重复 0+ 次
[0-9]    字符类            {2,4}    重复次数区间
^  $     行首 行尾锚点     |        或（需 -E）
\b       单词边界          \.       转义后的字面点号
```

:::tip[需要更细的正则能力]
grep 只覆盖日常九成场景；捕获组、前后断言等完整语法见 [正则教程](../../regex/)。日常够用即可，别在 shell 里炫技——复杂到要三行注释才能读懂的模式，交给脚本或 Python 更合算（第 9 章）。
:::

grep 命中后的典型输出（`-n` 给行号，方便跳转 `less +42 app.log`）：

```text
42:2026-06-03 10:12:44 ERROR db: connection refused (111)
138:2026-06-03 10:13:02 WARN  retrying db connection...
141:2026-06-03 10:13:03 ERROR db: connection refused (111)
```

顺带两条实用项：grep 撞到二进制内容会输出 "Binary file matches"，加 `-a` 强制按文本处理；跨大量小文件搜索时，先 `find 目录 -name "*.log" -print0 | xargs -0 grep 'error'`（或 grep -r 直接上），选项语义以 `man grep`、`man xargs` 为准。

## 3.4 管道组合拳：cut、sort、uniq、tr、wc

管道 `|` 把上一个命令的标准输出接到下一个命令的标准输入，一条链就是一条流水线。先看五个零件：

```bash
cut -d: -f1 /etc/passwd          # 以冒号分列，取第 1 列（用户名）
sort names.txt                   # 按行排序；-n 按数值、-r 倒序、-u 去重
uniq -c sorted.txt               # 折叠相邻重复行并计数（必须先排序！）
tr 'A-Z' 'a-z'                   # 大写转小写；tr -d '\r' 删 Windows 换行符
wc -l < big.txt                  # 行数（-w 词数、-c 字节数）
```

经典组合——Nginx 访问日志统计 Top10 来访 IP：

```bash
cut -d' ' -f1 access.log | sort | uniq -c | sort -rn | head -n 10
```

```text
  1842 10.0.3.7
  1301 203.0.113.45
   964 10.0.3.9
   ...
```

拆解：`cut` 取第一列 IP → `sort` 让相同 IP 相邻 → `uniq -c` 计数 → `sort -rn` 按计数数值倒序 → `head` 取前 10。

:::caution[uniq 只折叠"相邻"的重复]
忘了先 sort 是这条管道最常见的错误：`sort | uniq -c` 顺序写反或漏掉 sort，数字会全错。凡见 `uniq` 前面必须有 `sort`。
:::

## 3.5 sed：流编辑器做批量替换

sed 逐行读入、按脚本处理、逐行输出。最常用的就是替换与删除：

```bash
sed 's/foo/bar/' file            # 每行第一个 foo 替换为 bar，只打印不改文件
sed 's/foo/bar/g' file           # g = 全行所有出现
sed -i.bak 's/foo/bar/g' file    # 原地修改，改动前自动留 file.bak 备份
sed -n '5,10p' file              # 只打印 5~10 行（-n 抑制默认输出 + p）
sed '/^#/d' file                 # 删除注释行（d 指令）
sed 's/旧值/新值/gi' file        # i 忽略大小写
```

批量重命名演示：

```bash
for f in *.jpg; do echo mv "$f" "${f%.jpg}.png"; done   # 先看 echo 预演
for f in *.jpg; do mv "$f" "${f%.jpg}.png"; done        # 确认无误后去掉 echo 执行
```

:::danger[-i 是不可逆的]
`sed -i`（无备份后缀）直接改写原文件，写错正则一轮就把源数据毁干净。规矩：**先不带 -i 打印出来看效果，再加 `-i.原扩展名` 留备份**，最后一道保险是动手前 `cp file file.bak`。循环中的 `for`/`${f%.jpg}` 语法在第 9 章正式讲解。
:::

## 3.6 awk：面向列的迷你统计语言

awk 把每行按空白（或 `-F` 指定分隔符）切成列：`$1` 是第一列，`$0` 是整行，`NF` 是列数，`NR` 是行号。

```bash
awk '{print $1, $4}' access.log          # 打印第 1 列和第 4 列
awk -F: '{print $1}' /etc/passwd         # 指定冒号分隔（和 cut 殊途同归）
awk '$5 > 1000 {print $1, $5}' data.txt  # 按数值条件过滤行
awk '{sum += $1} END {print sum}' nums.txt    # 对第一列求和
awk 'END {print NR}' big.txt                   # 数行数（与 wc -l 等效）
```

真正的杀手锏是"边读边算"——统计访问日志里状态码分布：

```bash
awk '{count[$9]++} END {for (s in count) print s, count[s]}' access.log
```

```text
200 15230
304 2101
404 88
500 3
```

关联数组 `count[$9]` 以状态码值为下标自动建桶，`END` 块在文件读完后汇总。awk 有自己完整的语言特性（变量、函数、条件），本节是够用 subset，深入以 `man awk` 为准。

## 3.7 diff、patch 与综合练习

```bash
diff -u old.conf new.conf              # unified 格式输出差异
diff -ru dir-a/ dir-b/                 # 递归比较两个目录
diff -u old.conf new.conf > fix.patch  # 把差异存成补丁
patch -p0 < fix.patch                  # 应用补丁（先干跑：patch --dry-run）
```

`diff` 的 `-u` 格式（上文/下文/带 +/- 前缀的差异行）就是 Git 里你天天看到的形态——把本教程与 [Git 教程](../../git/) 的知识对上了：Git 的 diff 引擎不过是它在版本库上的工程化。

**综合练习：一份 access.log 的十分钟体检。** 自造或取一份真实访问日志（nginx 默认格式列序：IP 在 `$1`，状态码通常 `$9`、`$7` 是路径，用 `awk '{print $7, $9}'` 现场验证列号），依次回答：

1. 总请求数：`wc -l access.log`
2. 状态码分布：用 3.6 的 awk 一行流
3. Top5 访问 IP：用 3.4 的 cut/sort/uniq 管道（把 `head` 数改 5）
4. 所有 5xx 行存到 `errors.log`：`grep -E ' 5[0-9]{2} ' access.log > errors.log`
5. 对 `errors.log` 再统计：哪个 URL 出错最多？（提示：管道串三层）
6. 用 `sed -i.bak 's/10\.0\.3\.7/内网A/g' errors.log` 把内网 IP 换成可读名，验证 `.bak` 已生成

## 本章小结

- 小文件 cat、大文件 less、只看两头 head/tail、实时盯日志 tail -f（轮转环境用 -F）
- grep 负责"选行"，正则语法以 `man grep` 与本教程正则篇为准；glob 与正则两套通配勿混用
- cut→sort→uniq -c→sort -rn→head 是最常用的计数管道；uniq 前必 sort
- sed 改内容（先干跑再 -i），awk 算列（NF/NR/关联数组），diff -u 产补丁 patch 消费
