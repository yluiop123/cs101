<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  type: 'reference',
  name: 'Nginx',
  description: 'Nginx 是高性能的 HTTP 服务器和反向代理服务器，以其高并发、低内存占用和丰富的功能著称，广泛应用于 Web 服务、负载均衡和 API 网关。',
  chapters: [
    {
      name: 'HTTP 服务器',
      children: [
        '静态文件服务：HTML、CSS、JS、图片',
        '自动索引（autoindex）',
        '访问控制：IP 白名单、密码认证（auth_basic）',
        'HTTPS 配置：TLS/SSL 证书集成',
      ]
    },
    {
      name: '反向代理',
      children: [
        '代理后端服务：proxy_pass',
        '请求头转发与修改',
        '缓存反向代理结果',
        'WebSocket 代理',
      ]
    },
    {
      name: '负载均衡',
      children: [
        '轮询（Round Robin）：默认',
        '加权轮询：根据服务器权重分配',
        '最少连接（Least Connections）',
        'IP Hash：会话保持',
        '通用 Hash：根据任意变量进行分发',
      ]
    },
    {
      name: '动静分离',
      children: [
        '静态资源直接由 Nginx 处理',
        '动态请求转发到后端应用服务器',
      ]
    },
    {
      name: '配置结构',
      children: [
        '全局配置：worker_processes、error_log 等',
        'HTTP 配置块：包含 upstream、server、location 等指令',
        'upstream 定义后端服务器组，支持权重配置（weight）',
        'server 块配置监听端口（listen）和域名（server_name）',
        'location 块配置请求路由规则（proxy_pass、alias 等）',
        'location /static/ 使用 alias 指向本地目录，支持 expires 缓存控制',
      ]
    },
    {
      name: '限流与缓存',
      children: [
        'limit_req：请求频率限制（漏桶算法）',
        'limit_conn：并发连接数限制',
        'proxy_cache：缓存后端响应',
        '缓存过期策略：inactive、proxy_cache_valid',
      ]
    },
    {
      name: 'HTTPS',
      children: [
        'SSL 证书配置',
        'HTTP/2 支持',
        'SSL 会话缓存',
        'HSTS、OCSP Stapling',
      ]
    },
    {
      name: '日志',
      children: [
        '访问日志（access_log）：自定义格式',
        '错误日志（error_log）：日志级别控制',
      ]
    },
    {
      name: '生态',
      children: [
        'OpenResty：Nginx + Lua 扩展，实现动态 Web 应用',
        'Nginx Unit：多语言应用服务器',
        'Kong / APISIX：基于 Nginx/OpenResty 的 API 网关',
      ]
    },
  ],
  groups: [
    {
      name: "推荐资源",
      items: [
        { title: "Nginx 官方文档", url: "https://nginx.org/en/docs/" },
        { title: "Nginx 中文文档", url: "https://www.nginx.cn/doc/" }
      ],
    }
  ]
}
</script>
<ContentView :data="data" />
