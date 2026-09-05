---
title: 团队协作流程
---

# 第 5 章 · 团队协作流程

**本章目标：**

- 理解 Pull Request 的完整协作闭环
- 掌握团队常用的分支模型
- 学会 fork 工作流参与开源项目

## 5.1 Pull Request：协作的核心机制

Pull Request（简称 PR；GitLab 中叫 Merge Request，MR）是"请求把我的分支合并进目标分支"的正式流程，它让代码合并从"个人行为"升级为"团队审核行为"：

```text
feature 分支推送到远程
        │
        ▼
  在平台上发起 PR ──→ 团队成员 Code Review（代码评审）
        │                    │
        │              提出修改意见
        │                    │
        ◀── 修改并重新推送 ──┘
        │
        ▼
   审核通过 → 合并进 main → 删除 feature 分支
```

::: tip PR 的价值
评审（Code Review）不仅把关质量，更是团队知识共享的过程——每个人都能从别人的代码和意见中学到东西。
:::

## 5.2 典型的 PR 操作流程

以 GitHub 为例：

1. 在自己的 feature 分支完成开发并 `git push`
2. 打开 GitHub 仓库页面，点击 **Compare & pull request**
3. 填写标题（说明做了什么）与描述（为什么这样做、如何验证）
4. 指定评审人（Reviewers），等待审核
5. 根据评审意见继续修改、推送——PR 会自动包含新提交
6. 评审通过后点击 **Merge pull request** 完成合并

## 5.3 分支模型：团队怎么组织分支

### GitHub Flow（简单、主流）

```text
main ──┬───┬───┬──────→  始终保持可发布
       │   │   │
       └─feature-a（短命分支，完成即合回）
```

只有一条长期分支 `main`，所有功能从它切出、完成后经 PR 合回。适合持续部署的中小团队，**推荐默认选择**。

### Git Flow（复杂、企业级）

```text
main     ──── 生产版本
hotfix   ──── 紧急修复
develop  ──── 集成分支
feature  ──── 功能开发
release  ──── 发布准备
```

适合版本发布节奏严格的传统软件。新团队不建议一上来就用，理解概念即可。

## 5.4 分支命名与提交规范

统一的命名让仓库历史一目了然：

```text
feature/用户登录
feature/login-form
fix/navbar-overflow
hotfix/支付超时
docs/api-description
```

提交信息推荐 **Conventional Commits（约定式提交）**规范，第 7 章详细展开。

## 5.5 fork 工作流：参与开源项目

给不属于自己的开源仓库贡献代码，用的是 fork（分叉）工作流：

```bash
# 1. 在 GitHub 网页上点 Fork，得到自己的副本
# 2. 克隆自己的副本
git clone https://github.com/你的用户名/目标项目.git

# 3. 关联原仓库为 upstream，用于同步最新代码
git remote add upstream https://github.com/原作者/目标项目.git

# 4. 开新分支做修改，推送到自己的副本
git switch -c fix/typo
git commit -am "docs: 修正错别字"
git push origin fix/typo

# 5. 在 GitHub 网页上从你的副本向原仓库发起 PR
```

开源项目的 README 通常有 CONTRIBUTING.md 说明贡献规范，动手前先读它。

## 本章小结

- PR = "请求合并 + 代码评审"的正式协作闭环
- GitHub Flow 单主干最主流；Git Flow 适合严格发布制
- 分支命名 feature/fix/hotfix/docs 前缀，提交信息用约定式提交
- fork + upstream 参与开源：副本开发、推回原仓库提 PR
