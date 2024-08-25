# 使用JDK工具和JFR事件监控Java应用程序安全

## JFR安全事件概述

监控Java应用程序的底层安全配置可以为您提供对其在加密标准方面的整体强度的洞察。JDK 12引入了四个JDK Flight Recorder（JFR）安全事件，默认情况下在`default.jfc`和`profile.jfc` JFR配置文件中禁用：

- `jdk.SecurityPropertyModification` 记录 `Security.setProperty(String key, String value)` 方法调用
- `jdk.TLSHandshake` 跟踪TLS握手活动
- `jdk.X509Validation` 记录在成功的X.509验证中协商的X.509证书的详细信息
- `jdk.X509Certificate` 记录X.509证书的详细信息

这些事件也回传到了Oracle JDK 11.0.5和8u231更新版本。您可以通过修改JFR配置文件或使用标准JFR选项来启用这些事件。请参阅JDK Flight Recorder系列，了解如何配置它以捕获JVM相关事件。

另外两个JFR密码学事件提供了对初始JDK安全属性（`jdk.InitialSecurityProperty`）和服务提供者方法调用次数（`jdk.SecurityProviderService`）的洞察。JDK 20发布宣布了新的`jdk.InitialSecurityProperty`，并且它也被回传到了Oracle JDK 17.0.7和11.0.20更新版本。`jdk.SecurityProviderService`事件自JDK 20发布以来也可用，但也在JDK 17.0.8、11.0.22和8u391更新版本的代码库中。

本教程旨在展示如何利用这些JFR安全事件和其他JDK工具（keytool、JDK Flight Recorder、JDK Mission Control）来监控您的Java应用程序的安全性。

## 观察JDK安全属性

`jdk.InitialSecurityProperty`在JDK 20中引入，用于记录通过`java.security.Security`类加载时的初始安全属性的详细信息。

您也可以通过设置系统属性`java.security.debug=properties`，将初始安全属性打印到标准错误流：

```sh
java -Djava.security.debug=properties
```

`jdk.InitialSecurityProperty`事件默认在`default.jfc`和`profile.jfc` JFR配置文件中启用。

如果您启用了`jdk.SecurityPropertyModification`事件并保持`jdk.InitialSecurityProperty`启用，您可以使用JFR记录来监控所有安全属性的初始设置和任何后续更改。

有几种方法可以全面查看JDK安全属性的更改，包括服务提供者调用：

- 在JFR配置中也启用`jdk.SecurityPropertyModification`和`jdk.SecurityProviderService`

```sh
$JAVA_HOME/bin/jfr configure jdk.SecurityPropertyModification#enabled=true jdk.SecurityProviderService#enabled=true
```

- 添加`-XX:StartFlightRecording`标志，使用默认设置，同时启用`jdk.SecurityPropertyModification`和`jdk.SecurityProviderService`

```sh
java -XX:StartFlightRecording:settings=default,duration=60s,+jdk.SecurityPropertyModification#enabled=true,+jdk.SecurityProviderService#enabled=true
```

- 从JDK Mission Control (JMC)启动JFR记录，通过与运行中的JVM建立连接并配置事件。

您可以从JDK Mission Control (JMC)启动记录，也可以通过命令行使用：

- 使用`-XX:StartFlightRecording`运行java或
- 通过`jcmd`工具执行诊断命令

```sh
jcmd llvmid JFR.start duration=60s filename=recording.jfr
```

一旦您有了`.jfr`记录文件，您可以使用jfr JDK工具打印事件：

```sh
$JAVA_HOME/bin/jfr print --events "*Security*" /tmp/recording.jfr
```

通过分析此命令的输出，您可以观察到`jdk.InitialSecurityProperty`捕获的每个安全属性的初始值以及`jdk.SecurityPropertyModification`事件捕获的更改。

您还可以在JDK Mission Control中检查和可视化捕获事件的演变，通过加载记录文件并导航到`Event Browser > Java Development Kit > Security`部分。

JMC除了事件的表格显示外，还通过其视图提供性能分析见解：

- 火焰视图呈现由JFR事件收集的聚合堆栈跟踪。
- 图表视图呈现累积计数的聚合堆栈跟踪。它以图形格式呈现堆栈跟踪，有助于识别方法路径到其根源。
- 热图视图提供了在特定时间段内发生的事件的视觉表示。
- 依赖视图使用层次边缘捆绑聚合事件，并有助于可视化包之间的依赖关系。

如果您想知道Java应用程序使用的是哪个传输层安全性(TLS)协议版本，这取决于您的JDK和应用程序的配置。

在最新的JDK版本中，默认选项是`TLSv1.3`和`TLSv1.2`。

通过收集运行时数据来确定应用程序使用的确切TLS协议版本最为直接。

接下来的部分将讨论一些可用的工具和日志记录选项。

## 监控TLS协议

要捕获TLS协议信息，您可以将网络协议分析工具附加到运行中的JVM通信的网络接口，并获取有关所有网络流量的信息。

寻找“Server Hello”记录及其伴随的版本值，以确定特定套接字上使用的TLS版本。

但更受Java开发人员欢迎的检查TLS协议版本的方式是通过检查JDK调试日志。

如果您启用`javax.net.debug`系统属性为`ssl:handshake`（即`-Djavax.net.debug=ssl:handshake`），您将获得TLS协议版本值。

下面是一个最近JDK 21版本中的`ServerHello`捕获示例：

```json
"ServerHello": {
  "server version": "TLSv1.2",
  "random": "D36A78A81EA96FA48CAA23D0397E2EDD1FBA783D2B105A8C00D58D7EE74E24A4",
  "session id": "A998EB34379D24829F6E8884D4D2BCC39BACEF6D77C4B9435D104779DC6003CD",
  "cipher suite": "TLS_AES_256_GCM_SHA384(0x1302)",
  "compression methods": "00",
  "extensions": [
    "supported_versions (43)": {
      "selected version": [TLSv1.3]
    },
    "key_share (51)": {
      "server_share": {
        "named group": x25519
        "key_exchange": {
          0000: 39 EC 40 25 89 1A 75 FF EF 53 0C 36 58 57 1F F8 9.@%..u..S.6XW..
          0010: 23 F6 07 D6 9E A8 E4 43 F1 6C 20 F7 AE 5E B1 79 #......C.l ..^.y
        }
      }
    }
  ]
}
```

上面的输出显示，这个特定连接使用了`TLSv1.3`（`"selected version": [TLSv1.3]`）。

从长远来看，检查日志可能是一个繁琐的任务，因此通过JDK Flight Recorder捕获TLS信息是一个有价值的选项。

`jdk.TLSHandshake`事件捕获了JDK执行的每次TLS握手的核心信息。要启用它，您可以执行以下操作：

- 只需在JFR配置文件中将`jdk.TLSHandshake`选项切换为`true`：

  ```xml
  <event name="jdk.TLSHandshake">
    <setting name="enabled">true</setting>
    <setting name="stackTrace">true</setting>
  </event>
  ```

- 在终端窗口中运行`jfr configure`命令

```sh
$JAVA_HOME/bin/jfr configure jdk.TLSHandshake#enabled=true jdk.TLSHandshake#stackTrace=true
```

- 添加`-XX:StartFlightRecording`标志，使用默认设置，同时`jdk.TLSHandshake`也启用：

```sh
java -XX:StartFlightRecording:settings=default,duration=60s,+jdk.TLSHandshake#enabled=true,+jdk.TLSHandshake#stackTrace=true
```

- 通过与运行中的JVM建立连接并配置事件，从JDK Mission Control (JMC)启动JFR记录。

您可以从JDK Mission Control (JMC)或通过命令行启动记录：

- 使用`-XX:StartFlightRecording`运行java或
- 通过`jcmd`工具执行诊断命令

```sh
jcmd llvmid JFR.start duration=60s filename=/tmp/TLS.jfr
```

一旦您获得了记录，您可以使用jfr或在JDK Mission Control中分析`TLSHandshake`事件数据。

例如，运行以下`jfr print`命令将显示TLS握手活动：

```sh
$JAVA_HOME/bin/jfr print --events "TLS*" /tmp/TLS.jfr
```

如果您已经启用了TLS握手事件和堆栈跟踪，您可以使用JFR记录来确定应用程序使用的确切TLS协议版本。

## 监控X.509证书

X.509证书是Java安全架构的关键组成部分，它们用于在TLS握手期间建立身份和加密参数。

`jdk.X509Validation`事件记录了在TLS握手期间验证的X.509证书的详细信息。启用此事件将为您提供有关证书属性和验证结果的详细信息。

要启用`jdk.X509Validation`事件，您可以：

- 在JFR配置文件中将`jdk.X509Validation`选项切换为`true`：

  ```xml
  <event name="jdk.X509Validation">
    <setting name="enabled">true</setting>
    <setting name="stackTrace">true</setting>
  </event>
  ```

- 运行`jfr configure`命令

```sh
$JAVA_HOME_HOME/bin/jfr configure jdk.X509Validation#enabled=true jdk.X509Validation#stackTrace=true
```

- 添加`-XX:StartFlightRecording`标志，使用默认设置，同时启用`jdk.X509Validation`

```sh
java -XX:StartFlightRecording:settings=default,duration=60s,+jdk.X509Validation#enabled=true,+jdk.X509Validation#stackTrace=true
```

- 从JDK Mission Control启动JFR记录。

您可以使用以下命令分析`X509Validation`事件：

```sh
$JAVA_HOME/bin/jfr print --events "X509Validation" /tmp/X509.jfr
```

`jdk.X509Certificate`事件记录了应用程序使用的X.509证书的详细信息。它提供了对证书属性的洞察，例如：

- 序列号
- 主题
- 有效期
- 签名算法
- 密钥用法
- 扩展

要启用`jdk.X509Certificate`事件，您可以：

- 在JFR配置文件中将`jdk.X509Certificate`选项切换为`true`

  ```xml
  <event name="jdk.X509Certificate">
    <setting name="enabled">true</setting>
  </event>
  ```

- 运行`jfr configure`命令

```sh
$JAVA_HOME/bin/jfr configure jdk.X509Certificate#enabled=true
```

- 添加`-XX:StartFlightRecording`标志，使用默认设置，同时启用`jdk.X509Certificate`

```sh
java -XX:StartFlightRecording:settings=default,duration=60s,+jdk.X509Certificate#enabled=true
```

- 从JDK Mission Control启动JFR记录。

您可以使用以下命令分析`X509Certificate`事件：

```sh
$JAVA_HOME/bin/jfr print --events "X509Certificate" /tmp/X509.jfr
```

## 结论

在本文中，我们介绍了如何使用JDK Flight Recorder事件和JDK工具来监控Java应用程序的安全性。我们讨论了如何启用和分析JFR安全事件，以及如何使用JDK Mission Control来可视化和分析捕获的数据。

通过利用这些工具和事件，您可以获得对Java应用程序安全配置和行为的洞察，并采取适当的措施来提高其整体安全性。

## 有用的链接：

- JDK 12中的JFR安全事件
- JDK Flight Recorder指南
- JDK Mission Control用户指南
- Java安全架构概述


