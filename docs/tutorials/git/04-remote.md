---
title: 远程仓库与 GitHub
---

# 第 4 章 · 远程仓库与 GitHub

**本章目标：**

- 理解本地仓库与远程仓库的关系
- 掌握 clone / push / pull / fetch 四大远程命令
- 完成 GitHub 账号配置与 SSH 密钥连接

## 4.1 远程仓库的角色

本地仓库保存在你电脑上，**远程仓库（remote）**托管在服务器上（GitHub / Gitee / GitLab / 公司内网 Git）。它解决两个问题：

- **备份**：电脑坏了，代码还在
- **协作**：多人从同一个远程仓库推拉代码

一个本地仓库可以关联多个远程（如同时推 GitHub 和 Gitee），最常用的是名为 `origin` 的默认远程。

## 4.2 注册 GitHub 与创建仓库

1. 注册 [github.com](https://github.com/) 账号
2. 点击右上角 **+** → **New repository**
3. 填写仓库名（如 `my-project`），选择 Public（公开）或 Private（私有）
4. **不要**勾选"Add a README"（本地已有仓库时勾了会冲突），点击创建

创建完成，GitHub 会给出两种衔接方式：`https` 或 `ssh` 地址。

## 4.3 关联远程与首次推送

```bash
# 关联远程仓库，命名为 origin
git remote add origin https://github.com/你的用户名/my-project.git

# 首次推送：-u 建立跟踪关系，之后可直接 git push
git push -u origin main

# 查看已关联的远程
git remote -v
```

推送后刷新 GitHub 页面，你的提交历史就出现在网页上了。

## 4.4 日常推送与拉取

```bash
# 推送本地新提交
git push

# 拉取并合并远程的最新改动
git pull

# 只下载远程更新，不合并（先看看再决定）
git fetch
```

::: tip pull 与 fetch 的区别
`pull` = `fetch` + `merge`，一步到位但有合并冲突风险；`fetch` 更保守，先看 `git log origin/main` 了解远程发生了什么，再手动合并。建议习惯 fetch + merge 的工作方式。
:::

### 克隆（clone）别人的项目

从零参与一个已有项目：

```bash
git clone https://github.com/用户名/仓库名.git
cd 仓库名
```

`clone` 会自动完成：下载全部历史 + 关联 origin + 建立跟踪分支，开箱即用。

## 4.5 SSH 密钥：免密安全连接

HTTPS 方式每次推送都要求输入账号密码（token）。SSH 密钥一次配置，永久免密且更安全：

```bash
# 1. 生成密钥对（邮箱换成自己的，一路回车即可）
ssh-keygen -t ed25519 -C "your@email.com"

# 2. 查看公钥内容并复制
cat ~/.ssh/id_ed25519.pub
```

3. 打开 GitHub → **Settings** → **SSH and GPG keys** → **New SSH key**，粘贴公钥
4. 测试连接：

```bash
ssh -T git@github.com
# 看到 Hi 你的用户名! You've successfully authenticated 即成功
```

之后把远程地址换成 SSH 形式（`git@github.com:用户名/仓库名.git`）即可免密推送。

## 4.6 推送被拒绝怎么办

多人协作时，若远程有你没有的新提交，`push` 会被拒绝：

```text
! [rejected] main -> main (fetch first)
```

正确处理：

```bash
git pull          # 拉取远程改动并合并
# 如有冲突，解决冲突后提交
git push          # 再次推送
```

::: warning 永远不要 force push 到公共分支
`git push -f` 会**覆盖远程历史**，队友的提交可能被抹掉。确需强推时用更安全的 `--force-with-lease`，且只推自己的分支。
:::

## 本章小结

- 远程仓库 = 备份 + 协作枢纽；origin 是默认远程名
- `remote add` 关联、`push -u` 首推、`pull/fetch` 同步、`clone` 开箱即用
- SSH 密钥一次配置永久免密；`ssh -T` 验证
- push 被拒先 pull 再 push；公共分支禁止 force push
