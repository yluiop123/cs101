---
title: 软件安装与包管理
---

# 第 6 章 · 软件安装与包管理

**本章目标：**

- 熟练使用 apt 与 dnf 完成搜索、安装、升级、查询的全流程
- 掌握源码编译三步法 configure/make/make install 及其适用场景
- 理解第三方源、语言包管理器与 snap/容器包的取舍，会干净地卸载与清理

## 6.1 apt 与 dnf：两条命令家族对照

包管理器解决三件事：**装**（含依赖）、**记**（元数据数据库）、**更新**（版本与安全补丁）。两大阵营命令一一对照：

```text
动作            Ubuntu/Debian (apt)              CentOS/RHEL (dnf)
刷新索引        sudo apt update                  sudo dnf makecache
安装            sudo apt install nginx           sudo dnf install nginx
升级全部        sudo apt upgrade                 sudo dnf upgrade
升级单个        sudo apt install --only-upgrade x sudo dnf upgrade x
卸载            sudo apt remove nginx            sudo dnf remove nginx
卸载+删配置     sudo apt purge nginx             （dnf remove 即删包，配置见 6.6）
搜索            apt search nginx                 dnf search nginx
包详情          apt show nginx                   dnf info nginx
已装列表        apt list --installed             dnf list installed
查文件归属      dpkg -S /usr/sbin/nginx          dnf provides /usr/sbin/nginx
更新历史        less /var/log/apt/history.log    dnf history
```

两个高频技巧：

```bash
apt list --upgradable                # 哪些包有待更新（两厂通用思路：dnf 直接 dnf upgrade 前会列清单）
sudo dnf history undo 12             # dnf 自带事务回滚，apt 无原生等价物（apt 侧见 man apt 的说明与社区做法）
dpkg -l | less                       # apt 系查看完整数据库（-l 列表，^ii 为已安装）
```

::: tip 先 update 再装
`apt install` 用的是本地索引，索引旧了会报"找不到包"或装到旧版本——装东西前跑一次 `sudo apt update` 是肌肉记忆级习惯；dnf 会定期自动刷新元数据，但排障时 `dnf makecache` 手动刷一遍同样正确。
:::

一次正常安装长这样（apt 侧），值得逐段读：

```text
$ sudo apt install nginx
Reading package lists... Done
Building dependency tree... Done
The following additional packages will be installed:
  nginx-common nginx-core
Suggested packages:
  fcgiwrap nginx-doc
The following NEW packages will be installed:
  nginx nginx-common nginx-core
0 upgraded, 3 newly installed, 0 to remove and 12 not upgraded.
Need to get 612 kB of archives.
Do you want to continue? [Y/n]
```

依赖（additional）、建议（suggested，不自动装）、净变化与体积都在屏幕上一一列出——装前扫一眼"多装了哪些包"，是识别"挂羊头"第三方包的第一道防线。dnf 的输出结构相同（事务列表 + 体积 + 确认行），且末尾还能看到 GPG 签名校验环节。

## 6.2 包从哪来：仓库与 key

apt 的源清单在 `/etc/apt/sources.list` 与 `/etc/apt/sources.list.d/*.list`；dnf 的在 `/etc/yum.repos.d/*.repo`。每个仓库条目给出镜像地址与开关项，**改源之前先备份原文件**。更换国内镜像站能显著提速，URL 因厂商而异，以发行版官方文档为准。

仓库有包还不够，还要过"可信"这一关：仓库的 Release 元数据带签名，系统钥匙环里没有对应公钥就会拒绝。第三方源安装时必须同时导入其 key（apt 侧常见做法是把 key 放到 `/etc/apt/keyrings/` 并在 sources 里 `signed-by=` 指向它；dnf 侧 repo 文件里有 gpgkey 字段）。具体每个软件官方安装文档都会给完整命令——**只从软件官网拿源配置，别用搜索引擎里来路不明的**。

一个典型的第三方源条目（apt 侧文件 `/etc/apt/sources.list.d/example.list`，内容由对方官网提供）：

```text
deb [signed-by=/etc/apt/keyrings/example.gpg] https://pkg.example.com/deb stable main
```

dnf 侧对应的是 `/etc/yum.repos.d/example.repo`，段内 `baseurl=`、`gpgkey=`、`enabled=1` 各字段含义自解释，细节以 `man yum.conf` / dnf 文档为准。排查"某包到底从哪个仓库来"：`apt show 包名` 看 Origin 行；dnf 用 `dnf repoquery -i 包名` 或安装日志里的 From 行。

## 6.3 EPEL 与 PPA：补齐"官方没收"的软件

Linux 的发行版哲学是"什么都能装"，但法律/许可证原因或太小众的包不进默认仓库：

```bash
# CentOS/RHEL 系：EPEL（Extra Packages for Enterprise Linux）
sudo dnf install epel-release        # EPEL 本身在官方源里，先把它装上
sudo dnf --enablerepo=epel install htop   # 或直接 dnf install htop（启用后）

# Ubuntu 系：PPA（Personal Package Archive，Launchpad 托管的个人/团队仓库）
sudo add-apt-repository ppa:某作者/某包   # 添加前务必确认这就是官网给的地址
sudo apt update
sudo apt install 某包
```

RHEL 系还有 COPR（社区版 PPA），用法类似，以项目主页给的命令为准。[第 5 章 · 进程与服务管理](./05-process-systemd) 里推荐的 htop，在 CentOS 上就是这么来的：`dnf install epel-release` 之后才有。

::: warning 第三方源的安全边界
PPA/COPR/手工 repo 意味着"把陌生人的签名软件以 root 装进系统"。三条自保规则：① 只添加软件**官方网站**列出的源；② 优先发行版官方源，其次才是第三方；③ 定期 `apt list --installed` / `dnf repoquery` 盘点来历不明的包。
:::

## 6.4 源码编译三步：configure、make、make install

仓库里没有、版本太老、或要关掉不需要的特性时，源码编译是传统手艺：

```bash
sudo apt install build-essential        # Ubuntu：gcc/g++/make 一把装齐
sudo dnf groupinstall "Development Tools"   # CentOS：编译工具组
# 下载并解压源码包（.tar.gz / .tar.xz）后，进入其目录：
./configure --prefix=/usr/local/nginx   # 探测环境、生成 Makefile（选项以 ./configure --help 为准）
make -j"$(nproc)"                       # 按 CPU 核数并行编译
sudo make install                       # 拷贝产物到 --prefix 指定目录
```

三步各自在干什么：`configure` 是一个检查脚本，确认你的系统有它需要的头文件/库，并按 `--enable/--with` 选项生成 Makefile；`make` 按 Makefile 规则真正编译链接；`make install` 复制文件。装完后二进制在你手里，**包管理器不认识它**——升级与卸载都得自己来。

编译最常撞的墙是"缺开发头文件"，configure 会用一行提示告诉你缺什么：

```text
configure: error: Package requirements (openssl >= 1.1) were not met:
No package 'openssl' found
```

解法是把"运行时库"换成"开发包"：Debian/Ubuntu 装 `libssl-dev`，CentOS 装 `openssl-devel`——**两厂开发包后缀不同（-dev 与 -devel）**，报错里的库名加上对应后缀去仓库里搜即可。

::: tip 源码编译的账
成本：没有自动安全更新、依赖要手动满足、卸载要记着装到哪。收益：定制特性、指定版本。折中方案：优先找官方仓库版 → 语言级包管理器（pip/npm/cargo）→ 官方二进制发行包 → 最后才是源码编译。
:::

## 6.5 pip、npm 与系统包：各管一段

系统包管理器管系统级软件；语言生态有各自的包管理器，装的东西互不知晓：

```bash
# Python：Ubuntu 24.04 / 较新 CentOS 已禁止 pip 直装系统环境（externally-managed-environment）
python3 -m venv ~/venv-proj        # 正确姿势：为项目建虚拟环境
source ~/venv-proj/bin/activate    # 激活后 pip 装进 venv，不污染系统
pip install requests

# Node：系统源里的 nodejs 往往偏旧，开发机推荐版本管理器（如 nvm/fnm，安装命令以其官方仓库为准）
npm install -g http-proxy          # -g 装到用户级 Node 目录，而非系统包数据库
```

原则：**系统服务用发行版包，应用依赖用项目级虚拟环境**。在服务器上 `apt install python3-flask` 还是 `pip install flask`，取决于谁负责升级——混用会导致"同一库两份拷贝互相抢 import"的经典事故。

新版 Ubuntu（23.04+ / 24.04）直接 pip 会看到这条著名报错：

```text
error: externally-managed-environment
× This environment is externally managed
→ Consider using pipx or a virtual environment
```

它正是上述原则的制度化：系统 Python 归包管理器管，pip 别碰。临时项目用 venv（上面的写法），命令行工具用 pipx（装法：`sudo apt install pipx` / `sudo dnf install pipx`）。

## 6.6 snap、flatpak 与容器：新型打包的取舍

```bash
# Ubuntu 预装 snapd；CentOS 需先启用 EPEL 再装 snapd
sudo snap install snap-store        # 示例：商店应用
snap list                           # 已装的 snap
sudo snap remove snap-store         # snap 卸载自带数据清理（--purge 选项以 snap --help 为准）

# flatpak 两厂都可装：sudo apt install flatpak / sudo dnf install flatpak
flatpak search org.gimp.GIMP
```

各方案的取舍：

```text
apt/dnf 包   系统集成深、体积小，打包门槛高
snap         自带依赖、自动更新、沙箱；启动略慢、桌面生态为主
flatpak      更像"桌面应用商店格式"，服务器基本不用
Docker/容器  打包整个运行环境，交付的是"可执行程序"；服务部署的主流（另见 Docker 教程）
源码编译     自由度最大，维护成本也最大
```

服务器上处理"某个工具要很新的版本"：先看发行版软件包流/新版源，再考虑官方 .deb/.rpm 包（`sudo apt install ./xxx.deb` 或 `sudo dnf install ./xxx.rpm` 还能顺手解依赖），最后才轮到容器或源码。

## 6.7 综合练习：卸载与残留清理

装—查—卸—净 完整闭环，以 nginx 为例走完生命周期：

```bash
# Ubuntu
sudo apt install nginx
dpkg -L nginx | head                    # 这个包装了哪些文件到哪
apt show nginx | head -n 15             # 版本、依赖、主页
sudo systemctl stop nginx
sudo apt remove nginx                   # 删程序，留配置
sudo apt purge "nginx*"                 # 连配置一起清（通配写法见 apt 手册）
sudo apt autoremove --purge             # 清掉没人依赖的孤儿包与残留配置

# CentOS Stream
sudo dnf install nginx
dnf repoquery -l nginx | head           # 文件清单
sudo dnf remove nginx                   # dnf remove 保留被改过的配置，见下
sudo dnf autoremove
```

卸载后的残渣两类：**未改动的配置文件**（dpkg 数据库里状态为 `rc` 的条目：`dpkg -l | grep '^rc'`，逐个 purge 之）与**改过的配置**（工具们故意不敢删，防止毁掉你的定制——`/etc/nginx` 需要你亲手确认后再 rm）。判断标准：这台机器以后还要不要这个服务的旧配置？不要了再删，删前 `tar czf /tmp/etc-nginx-backup.tgz /etc/nginx` 留一份。

## 本章小结

- apt/dnf 命令族一一对应：install/remove/purge、search/show/info、dpkg -S 与 dnf provides 查文件归属；装包前先 update 索引
- 源码编译三步 configure/make/make install 换来定制自由，代价是脱离包管理器——优先级：官方包 → 语言级 PM → 官方发行包 → 源码
- 语言包管理器与系统包各管一段：项目依赖进 venv/局部安装，别把 pip 装的东西混进系统 Python
- 第三方源只从官网添加并确认签名；清理残留记住 rc 状态与 /etc 下被保留的配置，删前先备份
