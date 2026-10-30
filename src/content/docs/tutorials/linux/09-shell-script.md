---
title: "第 9 章 · Shell 脚本编程"
description: "脚本 = 把命令写进文件。第一行的 shebang 告诉系统“用哪个解释器执行我”："
series: linux
sidebar:
  order: 9
  label: "Shell 脚本编程"
difficulty: beginner
duration: 5
tableOfContents: true
---

**本章目标：**

- 能读懂并写出结构完整的 bash 脚本：变量、条件、循环、函数四件套
- 识破引号与空格的地雷区，会用 set -euo pipefail 给脚本上"安全带"
- 掌握位置参数与 getopts 的参数解析，并完成一个带日志与错误处理的备份脚本

## 9.1 shebang 与变量

脚本 = 把命令写进文件。第一行的 **shebang** 告诉系统"用哪个解释器执行我"：

```bash
#!/usr/bin/env bash
# 相比写死 /bin/bash，env 查找的方式对多版本 bash 更友好

echo "hello, $(whoami)"     # 命令替换：$() 里先执行，结果嵌进字符串
name="World"               # 赋值：等号两侧不能有空格！
readonly PI=3.14           # 只读变量
export PATH="$PATH:/opt/app/bin"   # export 让子进程也能读到

echo "$name"
echo "${name}_suffix"      # 花括号显式界定变量名，避免歧义
```

变量默认是字符串；整数运算交给算术上下文 `$(( ))`：

```bash
count=3
echo $((count * 2 + 1))    # 7
((count++))                # 自增也是算术上下文，不要写成 count++
```

执行方式的区别：`bash backup.sh`（新开解释器，不看权限位）、`./backup.sh`（要求可执行权限 + 看 shebang，第 4 章的 x 位在此兑现）、`source backup.sh`（在当前 shell 执行，常用于加载环境配置）。

## 9.2 引号与空格：脚本第一大坑

规则一句话：**所有变量引用都默认写成 `"$var"`，除非你明确知道自己在干什么。**

```bash
dir="/tmp/my docs"          # 目录名带空格是现实，不是 bug
rm -rf $dir                 # 错误：展开成两个词，删除了 /tmp/my 和 docs
rm -rf "$dir"               # 正确：引号保护成一个整体
rm -rf "${dir:?变量未设置}"  # 进阶：为空/未设时直接报错退出，防 rm -rf "" 类惨案
```

单双引号与不引号的三重世界：

```text
"..."  双引号：保留空格为一个词，且展开 $变量、命令替换
'...'  单引号：所见即所得，什么都不展开（密码、正则里的 $ 用单引号）
无引号  分词 + glob 展开：空格切词、* 匹配文件——多数事故现场
```

:::caution[三重坑叠加]
无引号变量遇到三件事会同时翻车：分词（空格拆成多词）、glob 展开（`*` 变成一堆文件名）、空值（变量为空导致参数消失）。写脚本时把 `"$@"`、`"$var"` 当肌肉记忆；对已有脚本做静态体检可装 shellcheck（`sudo apt install shellcheck` / `sudo dnf install shellcheck`），它会把上述问题全部点名。
:::

## 9.3 条件与 test

```bash
if [ -f "$file" ]; then            # 文件存在且是普通文件
  echo "regular file"
elif [ -d "$file" ]; then          # 是目录
  echo "directory"
else
  echo "missing"
fi
```

test（即 `[ ]`）的常用判据：

```text
文件类：-e 存在  -f 普通文件  -d 目录  -r/-w/-x 当前用户可读写执行  -s 非空
整数类：-eq -ne -gt -ge -lt -le        字符串类：= != -z(空) -n(非空)
逻辑：  [ a ] && [ b ]   或 bash 扩展 [[ a == pattern* ]]
```

两个姿势提醒：`[` 是命令，所以 `[ "$x" = 1 ]` 里方括号与内容间**必须有空格**；变量要放引号内（老脚本里 `[ $x = 1 ]` 在 x 为空时语法爆炸）。多分支用 `case`：

```bash
case "$1" in
  start) do_start ;;
  stop)  do_stop ;;
  *)     echo "用法: $0 {start|stop}"; exit 2 ;;
esac
```

:::tip[[ 与 [[ 的选择]
`[[ ]]` 是 bash 内建，支持模式匹配、不拆词、更安全；写 bash 脚本（shebang 明确是 bash）时优先 `[[ ]]`。但 POSIX 脚本（shebang 用 /bin/sh）只能用 `[ ]`——sh 可能是 dash。拿不准就用 `[ ]` + 给所有变量加引号。
:::

## 9.4 循环与函数

```bash
#!/usr/bin/env bash

# for：遍历列表 / C 风格
for user in alice bob carol; do
  echo "hello $user"
done
for ((i = 1; i <= 5; i++)); do echo "round $i"; done

# while：条件循环；read 逐行处理（-r 保留反斜杠，务必加）
while IFS= read -r line; do
  echo "got: $line"
done < input.txt

# until：条件为假时循环，较少用
```

函数：先定义后调用，参数用 `$1..$9` 收，返回值走 `return`（0~255 的状态码，**不是**数据）；数据要靠 echo 捕获或全局变量：

```bash
log() {                        # 定义
  echo "[$(date '+%F %T')] $*" # $*：全部参数拼为一个串
}

status=$(check_health)         # 捕获输出到变量
if log "检查完成"; then :; fi  # log 的退出码即最后一条命令的退出码
```

函数内变量**一律 `local`**，否则默认全局，函数之间的变量会互相踩：`local tmp=$(mktemp)`。

## 9.5 严格模式、位置参数与 getopts

每个正式脚本的开头三行"安全带"：

```bash
#!/usr/bin/env bash
set -euo pipefail
# -e：任何命令失败（非零退出码）立即终止脚本
# -u：引用未定义变量视为错误退出（防 "$UNSET" 当空串用）
# pipefail：管道中任一环失败即算整条失败（默认只看最后一环）
```

位置参数家族：

```text
$0 脚本名   $1..$9 第1..9个参数   ${10} 第十个    $# 参数个数
$* 全部参数（一个串）   $@ 全部参数（保留每个参数的边界，引用时用 "$@"）
$? 上一条命令的退出码   $$ 当前脚本 PID   $! 最后放入后台进程的 PID
```

带选项的解析用 getopts（bash 内建，短选项标准做法）：

```bash
#!/usr/bin/env bash
set -euo pipefail

src="" dest="" verbose=0
usage() { echo "用法: $0 -s 源目录 -d 目标目录 [-v]"; exit 1; }

while getopts ":s:d:vh" opt; do      # 串中 s: d: 表示需要参数值
  case "$opt" in
    s) src="$OPTARG" ;;
    d) dest="$OPTARG" ;;
    v) verbose=1 ;;
    h) usage ;;
    \?) echo "未知选项: -$OPTARG"; usage ;;
    :)  echo "选项 -$OPTARG 缺少参数"; usage ;;
  esac
done
shift $((OPTIND - 1))                # 吃掉已解析的选项，剩下的是位置参数
[ -n "$src" ] && [ -n "$dest" ] || usage
echo "从 $src 到 $dest，剩余参数: $*"
```

长选项（`--source` 风格）getopts 不原生支持，可用 `--` 手工 case 匹配或 GNU `getopt` 程序——用法以 `man getopt` 为准；多数运维脚本短选项已够。

## 9.6 日志与错误处理

脚本的"可运维"程度取决于出错时你看得见什么。基础件：

```bash
logfile="/var/log/backup.log"

log()  { echo "[$(date '+%F %T')] [INFO] $*" | tee -a "$logfile"; }
warn() { echo "[$(date '+%F %T')] [WARN] $*" | tee -a "$logfile" >&2; }
die()  { echo "[$(date '+%F %T')] [FATAL] $*" | tee -a "$logfile" >&2; exit 1; }

trap 'warn "脚本在第 $LINENO 行附近异常退出（exit=$?）"' ERR   # set -e 触发时留现场
```

要点：`tee -a` 既落盘又上屏；警告/错误走 stderr（`>&2`）方便分离；系统级脚本可改用 `logger` 命令进 journald（`logger -t backup 消息`，用法以 `man logger` 为准）；给临时文件上 `mktemp`，退出时 `trap cleanup EXIT` 清扫。

## 9.7 综合练习：数据库目录每日备份脚本

把本章全部零件组装成可用的 `db-backup.sh`（承接 [第 10 章 · 综合实战](../10-deploy-project/) 的定时化）：

```bash
#!/usr/bin/env bash
set -euo pipefail

readonly SRC="/var/lib/app-data"
readonly BACKUP_ROOT="/var/backups/app"
readonly KEEP_DAYS=7
readonly LOG="/var/log/app-backup.log"

log()  { echo "[$(date '+%F %T')] $*" | tee -a "$LOG"; }
die()  { echo "[$(date '+%F %T')] [FATAL] $*" | tee -a "$LOG" >&2; exit 1; }

[ -d "$SRC" ] || die "源目录不存在: $SRC"

stamp="$(date '+%Y%m%d-%H%M%S')"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

outdir="$BACKUP_ROOT/$stamp"
mkdir -p "$outdir"
log "开始备份 $SRC -> $outdir"

# 打包：-C 切目录避免绝对路径前缀；tar 失败会因 set -e 立即终止并被 ERR trap 记录
tar -czf "$outdir/data.tar.gz" -C "$SRC" . || die "tar 打包失败"

# 校验：列表非空且大小合理（<1KB 视为异常，按需调整阈值）
size_bytes="$(stat -c %s "$outdir/data.tar.gz")"
(( size_bytes > 1024 )) || die "备份产物异常偏小: $size_bytes 字节"

# 完整性：gzip -t 静默测试归档
gzip -t "$outdir/data.tar.gz" || die "归档完整性校验失败"

# 清理过期：只删 BACKUP_ROOT 下的目录名时间戳早于 KEEP_DAYS 天的
find "$BACKUP_ROOT" -mindepth 1 -maxdepth 1 -type d -mtime +"$KEEP_DAYS" -exec rm -rf {} + \
  | tee -a "$LOG"

# 摘要
count="$(find "$BACKUP_ROOT" -maxdepth 1 -type d | wc -l)"
log "备份完成：$outdir（$size_bytes 字节），现存 $((count - 1)) 份"
```

自查动作：故意把 SRC 改错跑一次，验证 die 分支；用 shellcheck db-backup.sh 扫一遍零告警；最后 `bash -n db-backup.sh` 做语法检查。它的定时化（cron/systemd timer）在第 10 章上线清单里完成。

## 本章小结

- shebang 定解释器，"$var" 引号规则是脚本第一军规；空值防御用 ${var:?}，存量脚本用 shellcheck 体检
- [[ ]] 更安全但依赖 bash，[ ] 配引号保 POSIX；条件与 case 覆盖绝大多数分支需求
- set -euo pipefail + trap（ERR/EXIT）让脚本"出错即停、留现场、扫尾巴"；getopts 配 shift $((OPTIND-1)) 解析选项，函数结果走 echo 捕获、return 只传状态码
- 备份脚本实例串起全章：mktemp+trap 清理、tar/gzip -t 校验、find -mtime 过期轮转
