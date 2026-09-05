---
title: 版本控制与 Git 入门
---

# 第 1 章 · 版本控制与 Git 入门

**本章目标：**

- 理解版本控制解决什么问题
- 完成 Git 安装与身份配置
- 建立工作区、暂存区、仓库的核心心智模型

## 1.1 为什么需要版本控制

先看没有版本控制的日常：

```text
项目-v1.zip
项目-v2-最终版.zip
项目-v2-最终版-改.zip
项目-v3-真最终版-这次一定.zip
```

这种"复制粘贴式版本管理"有三大痛点：**改坏了想回退却回不去**、**多人协作靠文件互传必然冲突**、**看不出每次到底改了什么**。

版本控制系统（Version Control System，VCS）正是为解决这些问题而生：它像一台"时光机"，记录每次改动（commit），让你随时回退、对比、并行开发、多人协作。

::: tip 一句话理解 Git
Git 把你的项目变成一条可以随时跳跃的时间线——每次保存一个"存档点"（提交），任何时刻都能回到任意存档点。
:::

## 1.2 Git 的诞生与地位

Git 由 Linux 之父 Linus Torvalds 在 2005 年用两周时间写成，最初为了管理 Linux 内核代码。如今它是事实上的行业标准：

- 全球超过 95% 的开发者在使用 Git
- GitHub / Gitee / GitLab 等平台全部基于 Git
- 几乎所有招聘 JD 都要求"熟悉 Git"

## 1.3 安装 Git

前往官网 [git-scm.com](https://git-scm.com/) 下载对应系统的安装包，全部默认选项一路下一步即可。

安装完成后验证：

```bash
git --version
# 输出示例：git version 2.45.0
```

::: tip Windows 用户建议
安装时选择以 **Git Bash** 作为默认终端，它会提供一个类 Linux 的命令行环境，后续教程中的命令都可以原样执行。
:::

## 1.4 初次配置：告诉 Git 你是谁

每次提交都会记录"谁做的"，所以首次使用前必须配置身份：

```bash
git config --global user.name "你的名字"
git config --global user.email "your@email.com"
```

两个常用附加配置：

```bash
# 设置默认分支名为 main
git config --global init.defaultBranch main

# 让 Git 输出带颜色
git config --global color.ui auto
```

查看全部配置：

```bash
git config --global --list
```

::: warning 邮箱的重要性
注册 GitHub 用的邮箱与这里的邮箱保持一致，GitHub 才能把提交关联到你的账号（贡献绿格子才会点亮）。
:::

## 1.5 核心概念：三个区域

理解 Git 的关键，是记住**三个区域**：

```text
┌──────────┐   git add   ┌──────────┐  git commit  ┌──────────┐
│  工作区   │ ──────────→ │  暂存区   │ ──────────→  │  本地仓库 │
│ (Working │             │ (Staging │              │(Repository│
│Directory)│             │   Area)  │              │           │
└──────────┘             └──────────┘              └──────────┘
   你正在编辑的文件        下次提交的"购物清单"        已被永久记录的历史
```

- **工作区**：你眼睛看到的、正在编辑的文件
- **暂存区**：准备提交的改动清单——`git add` 把改动放进来
- **本地仓库**：`.git` 目录，保存所有历史版本——`git commit` 把暂存区内容正式记录

::: tip 为什么要暂存区
它让你可以**精挑细选**：改了 5 个文件，只想先提交其中 2 个相关的，就只 add 这 2 个——提交历史因此干净而有意义。
:::

## 1.6 创建第一个仓库

```bash
mkdir my-project
cd my-project
git init
```

`git init` 会在目录下生成一个隐藏的 `.git` 文件夹——它就是本地仓库本身，包含了全部历史数据。**删掉它，项目就失去所有版本历史**。

创建一个文件并完成第一次提交：

```bash
echo "# 我的第一个项目" > README.md
git add README.md
git commit -m "第一次提交：初始化项目"
```

命令行会输出提交成功的信息，包含提交 ID（如 `a1b2c3d`）、作者和提交说明。

## 本章小结

- 版本控制解决"回退、协作、追溯"三大痛点
- 安装后先配 `user.name` / `user.email`（邮箱对齐 GitHub）
- 三区模型：工作区 --add→ 暂存区 --commit→ 本地仓库
- `git init` 创建仓库；`.git` 目录即仓库本体
