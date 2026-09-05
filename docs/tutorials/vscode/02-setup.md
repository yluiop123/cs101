---
title: 安装与基础配置
---

# 第 2 章 · 安装与基础配置

**本章目标：**

- 完成 VS Code 的下载与安装
- 安装中文语言包，切换中文界面
- 完成几个最重要的人工设置

## 2.1 下载与安装

前往官网 [code.visualstudio.com](https://code.visualstudio.com/) 下载对应系统的安装包：

| 系统 | 安装方式 |
| --- | --- |
| Windows | 下载 `.exe`，双击安装。建议勾选"添加到 PATH"和右键菜单"通过 Code 打开" |
| macOS | 下载 `.zip` 解压，拖入"应用程序"目录 |
| Linux | 使用 `.deb` / `.rpm` 包，或 `snap install code --classic` |

::: tip 安装建议（Windows）
安装向导中请勾选以下两项，后续会非常方便：

- ✅ 将"通过 Code 打开"操作添加到资源管理器目录上下文菜单
- ✅ 将"通过 Code 打开"操作添加到资源管理器文件上下文菜单
:::

安装完成后打开，第一次启动会显示欢迎页（Welcome），可以先不管它。

## 2.2 设置中文界面

VS Code 默认英文界面，安装中文语言包即可切换：

1. 按 `Ctrl+Shift+X`（macOS：`Cmd+Shift+X`）打开**扩展面板**
2. 搜索 `Chinese`
3. 安装 **Chinese (Simplified) (简体中文) Language Pack**
4. 安装后右下角会提示重启，点击 **Restart** 即可

也可以用快捷方式：按 `Ctrl+Shift+P` 打开**命令面板（Command Palette）**，输入 `display`，选择 **Configure Display Language**，选择 `zh-cn`。

::: tip 命令面板是什么
`Ctrl+Shift+P` 呼出的命令面板是 VS Code 的"万能入口"——记住任何功能的名字，就能在这里搜到并执行。它是本教程最高频的快捷键，没有之一。
:::

## 2.3 必做的几项设置

VS Code 的设置分**用户设置**（全局生效）和**工作区设置**（仅当前项目生效，存放在项目 `.vscode/settings.json` 中）。

打开设置的方式：`Ctrl+,`（macOS：`Cmd+,`），或命令面板输入 `settings`。

下面是强烈建议的几项调整（在设置界面搜索对应关键词修改）：

### 自动保存

搜索 `auto save`，将 `files.autoSave` 设为 `afterDelay`。之后再也不用手动 `Ctrl+S` 了，写一步存一步。

### 字体大小

搜索 `font size`，将 `editor.fontSize` 调整为 `16`（默认 14，屏幕大可再调大）。

### 显示空格与缩进线

搜索 `render whitespace`，设为 `boundary`；搜索 `indent guides` 确保开启。缩进问题（尤其是 Python、YAML）会一目了然。

### 自动格式化保存时触发

搜索 `format on save`，勾选 `editor.formatOnSave`。配合语言插件，保存时自动整理代码格式。

::: warning 注意
`formatOnSave` 需要对应语言安装了格式化插件才会生效（如 JS 的 Prettier、Python 的 Black）。没有格式化工具时保存不会有任何变化。
:::

## 2.4 设置同步（Settings Sync）

VS Code 内置配置同步功能（Settings Sync），可以把**设置、快捷键、插件列表、代码片段**同步到你的 GitHub / Microsoft 账号：

1. 点击左下角**齿轮图标** → 选择 **备份和同步设置…**
2. 登录 GitHub 或 Microsoft 账号
3. 换新电脑时登录同一账号，选择"从云端下载"即可一键还原

## 2.5 认识 settings.json

图形界面改设置，本质都是在改一个 JSON 文件。点击设置界面右上角的"打开设置(JSON)"图标，可以看到类似内容：

```json
{
  "files.autoSave": "afterDelay",
  "editor.fontSize": 16,
  "editor.formatOnSave": true,
  "editor.renderWhitespace": "boundary"
}
```

熟练之后直接编辑这个文件更快——尤其在团队协作时，可以把项目统一的规范写进项目根目录的 `.vscode/settings.json`，提交到 Git，全组共用。

## 本章小结

- 官网下载安装，Windows 记得勾选"通过 Code 打开"
- 中文界面靠语言包；命令面板（`Ctrl+Shift+P`）是万能入口
- 必做设置：自动保存、字号、显示空白、formatOnSave
- 登录账号开启 Settings Sync，换机不丢配置
