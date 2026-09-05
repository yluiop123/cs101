---
title: 实战场景与最佳实践
---

# 第 7 章 · 实战场景与最佳实践

**本章目标：**

- 掌握提交规范 Conventional Commits
- 学会典型事故的恢复方法
- 建立一份可落地的 Git 日常习惯清单

## 7.1 提交规范：Conventional Commits

约定式提交（Conventional Commits）是目前最流行的提交信息规范：

```text
<类型>(可选作用域): <描述>

feat(auth): 新增手机号登录
fix(nav): 修复移动端导航错位
```

常用类型：

| 类型 | 含义 |
| --- | --- |
| `feat` | 新功能 |
| `fix` | 缺陷修复 |
| `docs` | 仅文档变更 |
| `style` | 格式调整（不影响逻辑） |
| `refactor` | 重构（既非新增也非修复） |
| `test` | 测试相关 |
| `chore` | 构建/工具链等杂项 |

::: tip 一次提交只做一件事
"原子提交"是仓库可维护性的核心：一个提交对应一个完整、独立的小改动。这样 revert、cherry-pick、排查问题才能精确到点。
:::

## 7.2 事故恢复实战手册

### 场景一：提交到了错误的分支

```bash
# 刚 commit 到 main，其实该在 feature 分支
git switch -c feature/right-place   # 把当前提交带去新分支
git switch main
git reset --hard HEAD~1             # main 回退一个提交
```

### 场景二：一次 commit --amend / rebase 搞砸了

`git reflog` 记录了 HEAD 的每一次移动，是"终极后悔药"：

```bash
git reflog
# 找到搞砸前的位置，如 a1b2c3d
git reset --hard a1b2c3d
```

::: tip 只要 commit 过就丢不了
reflog 默认保留 90 天。哪怕 rebase/reset 折腾乱了，都能凭 reflog 回到任意历史位置——前提是那次改动**提交过**。
:::

### 场景三：误删了未提交的文件

未提交且未 stash 的内容，Git 无能为力。所以重要改动**尽早 commit 到自己的分支**（可以用 `wip:` 前缀标记半成品）。

### 场景四：误把大文件/密钥提交了

```bash
git rm --cached 大文件.zip        # 移出跟踪（本地保留）
echo "大文件.zip" >> .gitignore
git commit -m "chore: 移除误提交的文件"
```

若是**密码/密钥**泄露：立即作废该密钥，再清理历史（`git filter-repo`），最后推送强制的干净历史。

## 7.3 日常习惯清单

```text
开工前：  git pull 先同步，再开新分支开发
开发中：  小步提交，一次一个逻辑单元，用规范前缀
提交前：  git diff --staged 过目改动，git status 确认没有误 add
收工时：  push 到自己的远程分支，PR 描述写清楚"为什么"
长期：    main 永远保持可发布；不熟悉/不确定的操作先建测试分支练手
```

::: warning 三个"永远不要"

1. 永远不要对公共分支 force push
2. 永远不要用 `--hard` reset 前不做 `git status` 确认
3. 永远不要把 `.env`、密钥等敏感文件提交进仓库

:::

## 7.4 下一步学习建议

- **图形化工具**：VS Code 内置 Git 面板（源代码管理）覆盖 90% 日常操作，配合 GitLens 插件体验更佳
- **深入原理**：《Pro Git》中文版（git-scm.com/book/zh）免费权威，建议通读第 10 章"Git 内部原理"
- **团队实践**：在真实项目中坚持使用 PR 流程与提交规范，习惯的养成比知识更重要

## Git 教程结语

从三区模型到团队协作，从冲突解决到事故恢复——Git 的核心不是命令量，而是**在正确场景选正确命令**的意识。建议下一步进入 [Markdown 教程](/tutorials/markdown/)——技术写作与 Git 相辅相成。
