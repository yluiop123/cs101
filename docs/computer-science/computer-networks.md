<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: '计算机网络',
  description: '计算机网络是分布式系统和互联网的基础，理解网络协议栈对后端开发、安全、运维等方向至关重要。',
  items: [
    {
      name: 'OSI 七层模型',
      children: [
        { title: '**物理层**：比特流传输、接口标准' },
        { title: '**数据链路层**：帧、MAC 地址、以太网、差错检测' },
        { title: '**网络层**：IP 路由、分组转发、子网划分' },
        { title: '**传输层**：TCP/UDP、端口管理' },
        { title: '**会话层**：会话建立与管理、同步点' },
        { title: '**表示层**：数据加密、压缩、序列化' },
        { title: '**应用层**：HTTP、FTP、SMTP、DNS' },
      ],
    },
    {
      name: 'TCP/IP 协议栈',
      children: [
        { title: '**网络接口层**：以太网、Wi-Fi、PPP' },
        { title: '**网络层**：IP、ICMP、ARP、RARP' },
        { title: '**传输层**：TCP、UDP' },
        { title: '**应用层**：HTTP、HTTPS、DNS、WebSocket、SSH' },
      ],
    },
    {
      name: 'TCP 协议',
      children: [
        { title: '**三次握手 / 四次挥手**' },
        { title: '**流量控制**：滑动窗口' },
        { title: '**拥塞控制**：慢启动、拥塞避免、快重传、快恢复' },
        { title: '**可靠传输**：序列号、确认应答、超时重传' },
        { title: '**TCP 状态**：SYN_SENT、ESTABLISHED、TIME_WAIT 等' },
        { title: '**Nagle 算法与延迟确认**' },
      ],
    },
    {
      name: 'UDP 协议',
      children: [
        { title: '无连接、不可靠、低延迟' },
        { title: '适用场景：视频直播、DNS 查询、QUIC' },
        { title: '**校验和**：可选、简单差错检测' },
        { title: '无拥塞控制、无重传机制' },
      ],
    },
    {
      name: 'HTTP / HTTPS',
      children: [
        { title: '**HTTP/1.1**：持久连接、管线化' },
        { title: '**HTTP/2**：多路复用、头部压缩、Server Push' },
        { title: '**HTTP/3**：基于 QUIC（UDP）' },
        { title: '**HTTPS**：TLS/SSL 握手、证书体系' },
        { title: '**TLS 1.3**：0-RTT、更简握手' },
        { title: '**请求方法**：GET、POST、PUT、DELETE、OPTIONS' },
        { title: '**状态码**：2xx 成功、3xx 重定向、4xx 客户端错误、5xx 服务端错误' },
      ],
    },
    {
      name: 'DNS',
      children: [
        { title: '域名解析过程' },
        { title: '递归查询 vs 迭代查询' },
        { title: 'DNS 缓存' },
        { title: '**DNS 记录**：A、AAAA、CNAME、MX、NS' },
        { title: '**DNS 劫持与防护**' },
      ],
    },
    {
      name: 'NAT 与 CDN',
      children: [
        { title: '**NAT**：网络地址转换、端口映射' },
        { title: '**CDN**：内容分发网络、边缘节点、回源' },
        { title: '**反向代理**：正向代理 vs 反向代理' },
      ],
    },
    {
      name: '网络安全协议',
      children: [
        { title: '**TLS/SSL**：握手流程、加密套件' },
        { title: '**数字证书**：CA 体系、X.509' },
        { title: '**IPsec**：VPN、传输模式/隧道模式' },
        { title: '**SSH**：安全远程登录' },
        { title: '**防火墙**：包过滤、状态检测、应用层网关' },
      ],
    },
    {
      name: '负载均衡',
      children: [
        { title: '**四层负载均衡**：基于 IP + 端口' },
        { title: '**七层负载均衡**：基于 HTTP 内容' },
        { title: '**调度算法**：轮询、最少连接、IP Hash' },
        { title: '**健康检查**：主动探测、被动检测' },
        { title: '**会话保持**：Cookie、源地址绑定' },
      ],
    },
  ],
  groups: [
    {
      name: "推荐资源",
      items: [
        { title: "《计算机网络：自顶向下方法》" },
        { title: "《TCP/IP 详解》" },
        { title: "《HTTP 权威指南》" }
      ],
    }
  ]
}
</script>
<ContentView :data="data" />
