<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: '网络安全',
  description: '网络安全是保障信息系统安全性的关键领域，涉及防御、检测和应急响应等多个方面。',

  items: [
    {
      name: '计算机基础',
      subtitle: '必修',
      children: [
        {
          title: '计算机网络',
          description: 'OSI 七层模型、TCP/IP 协议栈、三次握手 / 四次挥手',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "计算机网络教程", url: "https://www.bilibili.com/video/BV1xJ41197hH", icon: "mdi-play-circle-outline" },
                { title: "Computer Networking Full Course", url: "https://www.youtube.com/watch?v=qiQR5rTSshw", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "计算机网络", url: "https://www.runoob.com/w3cnote/summary-of-computer-network.html", icon: "mdi-file-document-outline" },
                { title: "Computer Networking", url: "https://www.computernetworkingnotes.com/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '操作系统原理',
          description: '进程与线程、内存管理、文件系统、权限模型',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "操作系统教程", url: "https://www.bilibili.com/video/BV1YE411w7UV", icon: "mdi-play-circle-outline" },
                { title: "Operating Systems", url: "https://www.youtube.com/watch?v=26QPDBe-NB8", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "操作系统", url: "https://www.runoob.com/linux/linux-system-administration.html", icon: "mdi-file-document-outline" },
                { title: "OS Tutorial", url: "https://www.tutorialspoint.com/operating_system/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Linux 基础',
          description: '常用命令、用户与权限、网络配置、服务管理',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Linux 教程", url: "https://www.bilibili.com/video/BV1nW411L7xm", icon: "mdi-play-circle-outline" },
                { title: "Linux Full Course", url: "https://www.youtube.com/watch?v=ZtqEdQkrcwA", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Kali Linux 官方文档", url: "https://www.kali.org/docs/", icon: "mdi-file-document-outline" },
                { title: "Linux Command Guide", url: "https://linuxcommand.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Python 基础',
          description: 'Socket 编程、网络请求、数据包处理（Scapy）',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Python 教程", url: "https://www.bilibili.com/video/BV1ex411x7Em", icon: "mdi-play-circle-outline" },
                { title: "Python Full Course", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "菜鸟教程 Python", url: "https://www.runoob.com/python3/python3-tutorial.html", icon: "mdi-file-document-outline" },
                { title: "Scapy Docs", url: "https://scapy.readthedocs.io/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'C 语言基础',
          description: '指针与内存管理（二进制漏洞分析必备）',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "C 语言教程", url: "https://www.bilibili.com/video/BV1oi4y1g7CF", icon: "mdi-play-circle-outline" },
                { title: "C Programming Full Course", url: "https://www.youtube.com/watch?v=KJgsSFOSQv0", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "C 语言教程", url: "https://www.runoob.com/cprogramming/c-tutorial.html", icon: "mdi-file-document-outline" },
                { title: "C Programming", url: "https://www.tutorialspoint.com/cprogramming/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '数据库基础',
          description: 'SQL 语句（SQL 注入分析需要）',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "SQL 教程", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "SQL 教程", url: "https://www.runoob.com/sql/sql-tutorial.html", icon: "mdi-file-document-outline" },
                { title: "SQL Tutorial", url: "https://www.w3schools.com/sql/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: 'Web 安全核心',
      subtitle: '必修',
      children: [
        {
          title: 'HTTP / HTTPS 协议',
          description: '请求方法、状态码、Cookie / Session、TLS 握手',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "HTTP 协议教程", url: "https://www.bilibili.com/video/BV1js411g7Fw", icon: "mdi-play-circle-outline" },
                { title: "HTTP Explained", url: "https://www.youtube.com/watch?v=iYM2zFP3Zn0", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "HTTP 协议", url: "https://www.runoob.com/http/http-tutorial.html", icon: "mdi-file-document-outline" },
                { title: "MDN HTTP", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'XSS（跨站脚本）',
          description: '反射型 / 存储型 / DOM 型、CSP 防御',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "XSS 教程", url: "https://www.youtube.com/watch?v=EoaDgUgS6QA", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "OWASP XSS", url: "https://owasp.org/www-community/attacks/xss/", icon: "mdi-file-document-outline" },
                { title: "PortSwigger XSS", url: "https://portswigger.net/web-security/cross-site-scripting", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'CSRF（跨站请求伪造）',
          description: 'Token 验证、SameSite Cookie',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "CSRF 详解", url: "https://www.youtube.com/watch?v=eWEgUcHPle0", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "OWASP CSRF", url: "https://owasp.org/www-community/attacks/csrf", icon: "mdi-file-document-outline" },
                { title: "PortSwigger CSRF", url: "https://portswigger.net/web-security/csrf", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'SQL 注入',
          description: '联合查询 / 报错 / 布尔盲注 / 时间盲注、预编译防御',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "SQL 注入教程", url: "https://www.bilibili.com/video/BV1Gt411x7yV", icon: "mdi-play-circle-outline" },
                { title: "SQL Injection", url: "https://www.youtube.com/watch?v=ciNHn38EyRc", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "OWASP SQL Injection", url: "https://owasp.org/www-community/attacks/SQL_Injection", icon: "mdi-file-document-outline" },
                { title: "PortSwigger SQLi", url: "https://portswigger.net/web-security/sql-injection", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'SSRF（服务端请求伪造）',
          description: '内网探测、协议利用、URL 白名单防御',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "SSRF 详解", url: "https://xz.aliyun.com/t/7673", icon: "mdi-file-document-outline" },
                { title: "SSRF Guide", url: "https://portswigger.net/web-security/ssrf", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '文件上传漏洞',
          description: '绕过检测、WebShell 上传、文件类型校验',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "文件上传漏洞", url: "https://www.youtube.com/watch?v=z7nOHy2FJ-Y", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "文件上传漏洞", url: "https://www.cnblogs.com/-zhong/p/11767943.html", icon: "mdi-file-document-outline" },
                { title: "File Upload Vulns", url: "https://portswigger.net/web-security/file-upload", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'RCE（远程代码执行）',
          description: '命令注入、反序列化漏洞',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "RCE 详解", url: "https://xz.aliyun.com/t/7396", icon: "mdi-file-document-outline" },
                { title: "RCE Guide", url: "https://portswigger.net/web-security/os-command-injection", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'JWT 安全',
          description: 'JWT 伪造、算法混淆、密钥泄露',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "JWT 安全", url: "https://www.youtube.com/watch?v=7Q17ubqLmwc", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "JWT 安全指南", url: "https://jwt.io/introduction", icon: "mdi-file-document-outline" },
                { title: "JWT Attacks", url: "https://portswigger.net/web-security/jwt", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '渗透测试实战',
      subtitle: '必修',
      children: [
        {
          title: 'Kali Linux 环境搭建',
          description: '工具集使用、网络扫描、漏洞扫描',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Kali Linux 教程", url: "https://www.bilibili.com/video/BV1M54y1H7zN", icon: "mdi-play-circle-outline" },
                { title: "Kali Linux Full Course", url: "https://www.youtube.com/watch?v=ZkLlHByIYGk", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Kali Linux 官方文档", url: "https://www.kali.org/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '信息收集',
          description: '子域名枚举（Sublist3r）、端口扫描（Nmap）、指纹识别',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Nmap 教程", url: "https://www.youtube.com/watch?v=4t4kWjWIEQg", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Nmap 参考指南", url: "https://nmap.org/man/zh/", icon: "mdi-file-document-outline" },
                { title: "Nmap Reference Guide", url: "https://nmap.org/docs.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Burp Suite',
          description: '代理抓包、Repeater / Intruder、插件扩展',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Burp Suite 教程", url: "https://www.bilibili.com/video/BV1rP4y1j7CN", icon: "mdi-play-circle-outline" },
                { title: "Burp Suite Full Course", url: "https://www.youtube.com/watch?v=oRQ3N_V3-NY", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Burp Suite 官方教程", url: "https://portswigger.net/web-security", icon: "mdi-file-document-outline" },
                { title: "PortSwigger Research", url: "https://portswigger.net/research", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Metasploit Framework',
          description: '漏洞利用模块、Payload 生成、Meterpreter',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Metasploit 教程", url: "https://www.youtube.com/watch?v=uOZFFYy3_Ig", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Metasploit 官方文档", url: "https://docs.metasploit.com/", icon: "mdi-file-document-outline" },
                { title: "Metasploit Guide", url: "https://www.offensive-security.com/metasploit-unleashed/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '漏洞扫描工具',
          description: 'AWVS / Nessus / OpenVAS 扫描与报告解读',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Nessus 教程", url: "https://www.youtube.com/watch?v=__JjHQRmXEY", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "OpenVAS 官方文档", url: "https://www.greenbone.net/en/", icon: "mdi-file-document-outline" },
                { title: "Nessus Docs", url: "https://docs.tenable.com/nessus/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '社会工程学',
          description: '钓鱼邮件、诱导攻击、社工工具（SET）',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "社会工程学", url: "https://www.freebuf.com/articles/network/257778.html", icon: "mdi-file-document-outline" },
                { title: "Social Engineering Toolkit", url: "https://github.com/trustedsec/social-engineer-toolkit", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '内网渗透',
          description: '横向移动、提权、隧道（frp / ngrok）、域渗透',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "内网渗透教程", url: "https://www.youtube.com/watch?v=pIlYJf1JZqI", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Ired Team 笔记", url: "https://www.ired.team/", icon: "mdi-file-document-outline" },
                { title: "Internal Penetration", url: "https://www.ired.team/offensive-security-experiments", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '安全开发与代码审计',
      subtitle: '必修',
      children: [
        {
          title: '安全编码规范',
          description: '输入校验、输出编码、最小权限原则',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "安全编码规范", url: "https://www.cnvd.org.cn/", icon: "mdi-file-document-outline" },
                { title: "SEI CERT Coding", url: "https://wiki.sei.cmu.edu/confluence/display/seccode/SEI+CERT+Coding+Standards", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Java / Python Web 安全审计',
          description: '常见漏洞模式、代码审计工具（Fortify / SonarQube）',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "代码审计教程", url: "https://www.youtube.com/watch?v=3NzOl8m6Pqk", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "SonarQube 官方文档", url: "https://docs.sonarqube.org/latest/", icon: "mdi-file-document-outline" },
                { title: "Fortify Docs", url: "https://www.microfocus.com/en-us/cyberres/application-security/static-code-analyzer", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'SDL（安全开发生命周期）',
          description: '威胁建模、安全需求、安全测试',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "威胁建模", url: "https://www.youtube.com/watch?v=oR9L0eWqRFs", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "SDL 实践", url: "https://www.microsoft.com/en-us/securityengineering/sdl", icon: "mdi-file-document-outline" },
                { title: "Microsoft SDL", url: "https://www.microsoft.com/en-us/securityengineering/sdl", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '逆向分析',
          description: 'IDA Pro / Ghidra 反编译、调试器（x64dbg / OllyDbg）',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "逆向分析教程", url: "https://www.bilibili.com/video/BV1c4411C7hD", icon: "mdi-play-circle-outline" },
                { title: "Ghidra Tutorial", url: "https://www.youtube.com/watch?v=kx7kZ5S6G_U", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Ghidra 官方文档", url: "https://ghidra-sre.org/", icon: "mdi-file-document-outline" },
                { title: "Reverse Engineering", url: "https://www.begin.re/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '二进制漏洞',
          description: '缓冲区溢出、ROP、格式化字符串',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "二进制漏洞教程", url: "https://www.youtube.com/watch?v=1S0aBV-Waeo", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "缓冲区溢出", url: "https://zh.wikipedia.org/wiki/%E7%BC%93%E5%86%B2%E5%8C%BA%E6%BA%A2%E5%87%BA", icon: "mdi-file-document-outline" },
                { title: "Binary Exploitation", url: "https://pwn.college/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '安全运维与防护',
      subtitle: '必修',
      children: [
        {
          title: '防火墙与 WAF',
          description: 'iptables / nftables 规则、ModSecurity 规则编写',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "iptables 教程", url: "https://www.youtube.com/watch?v=7VwL90F2H00", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "iptables 详解", url: "https://www.zsythink.net/archives/tag/iptables/", icon: "mdi-file-document-outline" },
                { title: "ModSecurity Docs", url: "https://coreruleset.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'IDS / IPS',
          description: 'Snort / Suricata 入侵检测规则、告警分析',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Snort 官方文档", url: "https://www.snort.org/documents", icon: "mdi-file-document-outline" },
                { title: "Suricata Docs", url: "https://suricata.readthedocs.io/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '日志分析与 SIEM',
          description: 'ELK 日志平台、Splunk 查询、异常检测',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "ELK 教程", url: "https://www.bilibili.com/video/BV1iJ411i7Dv", icon: "mdi-play-circle-outline" },
                { title: "ELK Stack Tutorial", url: "https://www.youtube.com/watch?v=aq7wnlT-ncY", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "ELK 中文指南", url: "https://www.elastic.co/guide/cn/elastic-stack/current/index.html", icon: "mdi-file-document-outline" },
                { title: "Splunk Docs", url: "https://docs.splunk.com/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '基线检查与加固',
          description: '系统基线、数据库加固、中间件安全配置',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "安全基线", url: "https://www.cisecurity.org/cis-benchmarks/", icon: "mdi-file-document-outline" },
                { title: "CIS Benchmarks", url: "https://www.cisecurity.org/cis-benchmarks/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '零信任架构',
          description: '身份认证、设备信任、最小权限访问',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "零信任架构", url: "https://www.youtube.com/watch?v=Gg3LQ8wn2F0", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "零信任架构", url: "https://www.nist.gov/publications/zero-trust-architecture", icon: "mdi-file-document-outline" },
                { title: "NIST Zero Trust", url: "https://www.nist.gov/publications/zero-trust-architecture", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '云安全',
          description: '安全组配置、IAM 策略、容器安全（Trivy / Falco）',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "云安全教程", url: "https://www.youtube.com/watch?v=3c-iBn73dDE", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "AWS IAM 文档", url: "https://docs.aws.amazon.com/zh_cn/IAM/latest/UserGuide/", icon: "mdi-file-document-outline" },
                { title: "Trivy Docs", url: "https://trivy.dev/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '应急响应与取证',
      subtitle: '选修',
      children: [
        {
          title: '应急响应流程',
          description: '事件分类、遏制、根因分析、恢复、复盘',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "应急响应教程", url: "https://www.youtube.com/watch?v=5DzY9JjQqIY", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "应急响应", url: "https://www.freebuf.com/articles/es/260565.html", icon: "mdi-file-document-outline" },
                { title: "Incident Response", url: "https://www.nist.gov/cyberframework", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '数字取证',
          description: '内存取证（Volatility）、磁盘取证（FTK Imager）',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "数字取证教程", url: "https://www.youtube.com/watch?v=Z3A6e8_8bYc", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Volatility 官方文档", url: "https://volatility3.readthedocs.io/", icon: "mdi-file-document-outline" },
                { title: "Forensic Guide", url: "https://www.cfreds.nist.gov/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '恶意代码分析',
          description: '静态分析（PE 结构、YARA）、动态分析（沙箱 Cuckoo）',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "YARA 官方文档", url: "https://yara.readthedocs.io/", icon: "mdi-file-document-outline" },
                { title: "Malware Analysis", url: "https://practicalmalwareanalysis.com/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '安全合规',
          description: '等保 2.0 / GDPR / ISO 27001 合规要求',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "等保 2.0 标准", url: "https://www.dengbao.com/", icon: "mdi-file-document-outline" },
                { title: "GDPR Compliance", url: "https://gdpr.eu/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '认证与持续学习',
      subtitle: '选修',
      children: [
        {
          title: 'CISSP',
          description: '安全与风险管理、资产安全、安全架构',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "CISSP 认证指南", url: "https://www.isc2.org/Certifications/CISSP", icon: "mdi-file-document-outline" },
                { title: "CISSP Official", url: "https://www.isc2.org/Certifications/CISSP", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'OSCP / PNPT',
          description: '实战渗透测试认证',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "OSCP 认证", url: "https://www.offensive-security.com/pwk-oscp/", icon: "mdi-file-document-outline" },
                { title: "PNPT Certification", url: "https://www.tcm-sec.com/pnpt/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'CTF 竞赛',
          description: 'Bugku / XCTF / Hack The Box / TryHackMe',
          optional: true,
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "CTF 教程", url: "https://www.bilibili.com/video/BV1U4411N7WX", icon: "mdi-play-circle-outline" },
                { title: "CTF Full Course", url: "https://www.youtube.com/watch?v=eg0Fr492wBA", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Hack The Box", url: "https://www.hackthebox.com/", icon: "mdi-file-document-outline" },
                { title: "TryHackMe", url: "https://tryhackme.com/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
  ],
}
</script>
<ContentView :data="data" />
