---
title: 基础操作
---

# 第 2 章 · 基础操作

**本章目标：**

- 熟练使用 status / add / commit / log / diff 五大日常命令
- 掌握查看历史与对比改动的技巧
- 学会撤销错误操作的几种方式

## 2.1 查看状态：git status

`git status` 是最常用的命令，它告诉你三件事：哪些文件被修改了、哪些在暂存区、哪些还没被 Git 跟踪。

```bash
git status
```

```text
On branch main
Changes not staged for commit:        # 工作区有改动，未暂存
        modified:   index.html

Changes to be committed:              # 已暂存，等待提交
        new file:   style.css

Untracked files:                      # 全新文件，Git 还不认识
        app.js
```

::: tip 养成肌肉记忆
任何时刻不确定当前状态，先敲 `git status`。它不会修改任何东西，只管看。
:::

## 2.2 暂存与提交

```bash
# 暂存单个文件
git add index.html

# 暂存所有改动（最常用）
git add .

# 提交，-m 后跟提交说明
git commit -m "完成首页布局"
```

提交说明（commit message）是仓库的"聊天记录"，好的说明让协作和回溯事半功倍。推荐格式：

```text
类型: 简短描述

feat: 新增用户登录表单
fix: 修复移动端导航错位
docs: 补充接口文档
```

## 2.3 查看历史：git log

```bash
# 完整历史
git log

# 单行显示，最常用
git log --oneline

# 图形化显示分支
git log --oneline --graph --all
```

```text
a1b2c3d (HEAD -> main) feat: 完成首页布局
e4f5g6h fix: 修复按钮点击无响应
i7j8k9l docs: 初始化项目文档
```

`HEAD` 指针指向"你当前所在的版本"，后续回退操作都围绕它进行。

## 2.4 查看改动：git diff

```bash
# 工作区 vs 暂存区（还没 add 的改动）
git diff

# 暂存区 vs 上次提交（已 add 未 commit 的改动）
git diff --staged

# 任意两次提交的对比
git diff e4f5g6h a1b2c3d
```

输出中 `-` 开头是删除行，`+` 开头是新增行。提交前 `git diff --staged` 检查一遍，是避免提交垃圾代码的好习惯。

## 2.5 撤销操作：三张后悔药

### 场景一：改错了，还没 add——丢弃工作区改动

```bash
git restore index.html
```

该文件会回到上次提交的状态，**未提交的修改将永久丢失**，慎用。

### 场景二：add 错了——移出暂存区

```bash
git restore --staged index.html
```

只把文件从暂存区拿回工作区，**改动内容不会丢失**。

### 场景三：commit 了但想改——修改最后一次提交

```bash
# 忘了 add 某文件，补充进去并合并到上次提交
git add 忘记的文件
git commit --amend -m "修正后的提交说明"
```

::: warning amend 的使用边界
`--amend` 会改写历史。只对**尚未推送到远程**的提交使用；已推送的提交被改写后，队友拉取时会产生冲突。
:::

## 2.6 忽略文件：.gitignore

并非所有文件都该进仓库。在项目根目录创建 `.gitignore`：

```text
# 依赖目录
node_modules/

# 构建产物
dist/

# 环境变量（含密钥）
.env

# 系统与编辑器文件
.DS_Store
.vscode/
```

`.gitignore` 只对**未跟踪**的文件生效。已被跟踪的文件想忽略，先执行 `git rm --cached 文件名` 把它移出跟踪。

## 本章小结

- `git status` 是肌肉记忆；`add` 暂存、`commit` 记录、`log --oneline` 看历史
- `diff --staged` 提交前过目；提交说明按"类型: 描述"格式
- 撤销三招：`restore`（丢工作区）、`restore --staged`（移出暂存）、`--amend`（改最后提交）
- `.gitignore` 只管未跟踪文件，已跟踪的先 `git rm --cached`
