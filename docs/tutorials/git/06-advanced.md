---
title: 进阶技巧
---

# 第 6 章 · 进阶技巧

**本章目标：**

- 理解 rebase 与 merge 的区别及适用场景
- 掌握 stash / cherry-pick / tag 的实用价值
- 分清 reset 三种模式与 revert 的回退策略

## 6.1 变基：git rebase

变基（rebase）把当前分支的提交"搬到"另一条分支的最新提交之后，让历史呈现为一条直线：

```text
merge 合并后的历史：            rebase 后的历史：
      A---B---M---D                 A---B---C'---D'
       \     /                      （C' 是 C 的重写版本）
        C---┘
```

典型用法——把 main 的最新改动同步到自己的功能分支：

```bash
git switch feature/login
git rebase main
# 语义：把 feature/login 上的提交，重新放到 main 的最新提交之后
```

::: warning 黄金法则
**不要对已推送到公共分支的提交执行 rebase**——它会改写提交 ID，等于篡改公共历史，队友会"拉到分裂的历史"。rebase 只用于整理自己未共享的提交。
:::

### 交互式变基：整理提交

```bash
git rebase -i HEAD~3   # 整理最近 3 个提交
```

打开编辑器后可以为每个提交选择动作：

| 命令 | 缩写 | 作用 |
| --- | --- | --- |
| pick | p | 保留该提交 |
| squash | s | 合并到上一个提交，融合提交说明 |
| reword | r | 修改提交说明 |
| drop | d | 丢弃该提交 |

最常用场景：开发中产生了 5 个零碎提交（"改一下""再改一下"），合并前用 squash 收拾成 1 个干净的提交。

## 6.2 暂存现场：git stash

正改一半，突然要切分支处理紧急问题？改动还没到能提交的程度——用储藏（stash）：

```bash
git stash            # 把当前未提交的改动存起来，工作区变干净
git stash list       # 查看储藏列表
git stash pop        # 恢复最近一次储藏并删除记录
git stash apply      # 恢复但保留记录
```

## 6.3 摘取提交：git cherry-pick

把某一条提交"复制"到当前分支，适合把某个 bug 修复单独摘到别的分支：

```bash
git cherry-pick a1b2c3d
```

## 6.4 打标签：git tag

标签（tag）用于给重要节点（通常是版本发布）做永久标记，与分支不同——标签指向后不再移动：

```bash
git tag v1.0.0                    # 轻量标签
git tag -a v1.0.0 -m "首个正式版"  # 附注标签（推荐）
git push origin v1.0.0            # 推送标签
git tag -l                        # 列出所有标签
```

## 6.5 回退：reset 与 revert

### git reset：移动分支指针

```bash
git reset --soft a1b2c3d   # 回退提交，改动保留在暂存区
git reset --mixed a1b2c3d  # 回退提交，改动保留在工作区（默认）
git reset --hard a1b2c3d   # 彻底回退，改动全部丢弃（危险！）
```

::: danger --hard 会丢代码
`--hard` 丢弃的未提交改动无法找回。执行前务必 `git status` 确认没有重要改动未保存。
:::

### git revert：反向提交

```bash
git revert a1b2c3d   # 生成一条"抵消"该提交的新提交
```

reset 是"改写历史"，revert 是"追加历史"。**公共分支上的回退永远用 revert**——它不篡改任何已有提交，队友拉取时不会出问题。

## 本章小结

- rebase 重放提交形成直线历史；公共分支禁用（黄金法则）
- `rebase -i` 的 squash 整理零碎提交；stash 保存临时现场
- cherry-pick 单独摘取提交；tag 标记发布节点
- reset 改写历史（--hard 危险），revert 追加反向提交——公共分支只许 revert
