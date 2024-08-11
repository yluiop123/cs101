# 入门指南：Java基础

## JDK的安装

### JDK的下载

1.首先，我们打开openjdk官网链接：https://jdk.java.net/  。

![openjdk官网](./image/001.png )

2.如图，我们点击后打开下载页面。

![下载页面](./image/002.png )

可以看到有如下五个版本，当前页面中是最新的包，如果需要指定版本，请在左侧选择即可：

- Linux/AArch64
- Linux/x64
- macOS/x64
- macOS/AArch64
- Windows/x64

### JDK的安装

#### Windows/x64 系统下安装

1. 点击Windows/x64 的zip安装包下载到本地，然后解压到某个文件夹下（路径名不要包含中文）
![jdk解压地址](./image/003.png ) 
2. 搜索`查看高级系统设置` 
![查看高级系统设置](./image/004.png)
3. 点击 `环境变量` 
![环境变量](./image/005.png)
4. 在`系统变量`中点击 `新建` 
![系统变量](./image/006.png)
5. 输入变量名`JAVA_HOME`和变量值`D:\JetBrains\jdk-22.0.2`（对应JDK解压目录），点击确定。
![JAVA_HOME](./image/007.png)
6. 选中Path 点击编辑
![Path](./image/008.png)
7. 点击 `新建` 增加 `%JAVA_HOME%\bin` 后确定。
![Path](./image/009.png)
8. 打开命令行（快捷键 `win+R` 然后输入cmd 点击确定，
   然后输入命令
   ```
   java -version
   ```
   如果打印出如下信息则安装成功
   ![测试JDK](./image/010.png)

#### Linux/x64系统下安装
1. jdk下载
如果你的Linux系统是基于x86_64架构的，你应该下载Linux/x64版本的JDK。如果你的系统是基于ARM 64位架构的，比如使用ARM处理器的设备，那么你应该下载Linux/AArch64版本的JDK
2. 解压缩下载的文件
使用 `tar` 命令解压到你选择的目录，例如：
```bash
tar -xvf openjdk-22.0.2_linux-x64_bin.tar.gz -C /opt/
```
请将 openjdk-22.0.2_linux-x64_bin.tar.gz 替换为你下载的文件名。
3. 设置环境变量
打开你的shell配置文件，例如 ~/.bashrc 或 ~/.zshrc，添加以下行：
```bash
export JAVA_HOME=/opt/jdk-22.0.2
export PATH=$PATH:$JAVA_HOME/bin
```
请将 /opt/jdk-22.0.2 替换为你的实际JDK安装路径。
4. 应用配置更改
运行以下命令使更改生效：
```bash
source ~/.bashrc  # 或者source ~/.zshrc，取决于你使用的shell
```
5. 验证安装
```bash
java -version
```   
这应该输出JDK 22的版本信息。

#### macOS系统下安装
1. jdk下载
如果你的Linux系统是基于x86_64架构的，你应该下载Linux/x64版本的JDK。如果你的系统是基于ARM 64位架构的，比如使用ARM处理器的设备，那么你应该下载Linux/AArch64版本的JDK
2. 解压缩下载的文件
打开下载的.tar.gz或.dmg文件，并将JDK拖动到/Library/Java/JavaVirtualMachines/目录。
3. 设置环境变量
打开你的shell配置文件，如~/.bash_profile、~/.zshrc或~/.bashrc，添加以下行：
```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 22)
export PATH=$JAVA_HOME/bin:$PATH
```
确保将22替换为你安装的JDK版本。
4. 应用配置更改
运行以下命令使更改生效：
```bash
source ~/.bash_profile # 或者source ~/.zshrc或source ~/.bashrc，取决于你使用的shell
```
5. 验证安装
```bash
java -version
```   
这应该输出JDK 22的版本信息。


