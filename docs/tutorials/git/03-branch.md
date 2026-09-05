---
title: 分支管理
---

# 第 3 章 · 分支管理

**本章目标：**

- 理解分支的本质与意义
- 熟练创建、切换、合并、删除分支
- 学会解决合并冲突

## 3.1 什么是分支

分支（branch）让你**在不影响主线的前提下并行开发**。典型场景：

```text
main（稳定版，随时可发布）
 ├── feature/login     开发登录功能
 ├── feature/search    开发搜索功能
 └── fix/header-bug    修复紧急 bug
```

每个功能一条分支，互不干扰；开发完成再合回 main。这是现代团队协作的基石。

**分支的本质**：Git 中分支只是一个指向某个提交的**可移动指针**，创建分支近乎零成本——这与很多其他 VCS 的"复制整个目录"完全不同，也是 Git 快的原因之一。

## 3.2 分支基本操作

```bash
# 查看所有分支（当前分支带 * 号）
git branch

# 创建分支
git branch feature/login

# 切换分支（推荐新命令）
git switch feature/login

# 创建并切换，一步到位（最常用）
git switch -c feature/login

# 删除已合并的分支
git branch -d feature/login

# 强制删除未合并的分支
git branch -D feature/login
```

::: tip switch 与 checkout
老教程多用 `git checkout`，它身兼数职容易混淆。Git 2.23 后推荐：切分支用 `git switch`，撤销文件用 `git restore`，checkout 仅保留兼容用途。
:::

## 3.3 合并：git merge

在 feature 分支完成开发后，切回 main 合并：

```bash
git switch main
git merge feature/login
```

Git 尽力**自动合并**：如果两个分支改的是不同文件或同一文件的不同区域，一切自动完成。

合并成功后删除功能分支：

```bash
git branch -d feature/login
```

## 3.4 解决合并冲突

当两个分支**修改了同一文件的同一处**，Git 无法自动决定用谁的，合并会暂停并报告冲突：

```text
<<<<<<< HEAD
main 分支上的内容
=======
feature 分支上的内容
>>>>>>> feature/login
```

解决步骤：

1. 打开冲突文件，找到 `<<<<<<<` 到 `>>>>>>>` 的冲突块
2. 人工决策：保留哪部分，或融合两者，**删除全部特殊标记行**
3. `git add 冲突文件` 标记冲突已解决
4. `git commit` 完成合并

::: tip 冲突不可怕
冲突只发生在"两个人改了同一处"时——它恰恰提醒你这里需要沟通。编辑器（如 VS Code）会高亮冲突块并提供"采用当前/采用对方"按钮，处理起来很快。
:::

## 3.5 快进合并与 --no-ff

```bash
# 默认：可能产生"快进"（fast-forward），不生成合并提交
git merge feature/login

# 强制生成一个合并提交，保留"这里发生过合并"的历史
git merge --no-ff feature/login -m "merge: 合并登录功能"
```

团队规范通常要求 `--no-ff`：功能分支的来龙去脉在历史上清晰可见。

## 3.6 常见的分支模型

小型团队/个人项目最简模型：

```text
main     稳定可用，每个提交都可发布
 └─ feature/*   每个新功能开一条，完成即合回并删除
```

更完整的 Git Flow / GitHub Flow 等工作流在第 5 章展开。

## 本章小结

- 分支 = 指向提交的指针，创建零成本
- `git switch -c` 创建并切换；`merge` 合并；`branch -d` 删除
- 冲突处理：定位标记块 → 人工取舍 → add → commit
- `--no-ff` 保留合并记录，团队规范标配
