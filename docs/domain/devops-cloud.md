<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: 'DevOps / 云计算 / 运维',
  description: 'DevOps 和云计算是现代软件交付的基础设施，强调自动化、可观测性和可靠性。',

  items: [
    {
      name: '操作系统与基础工具',
      subtitle: '必修',
      children: [
        {
          title: 'Linux 系统管理',
          description: '文件系统、进程管理、用户权限、systemd 服务管理',
          groups: [
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
                { title: "Linux 命令大全", url: "https://www.runoob.com/linux/linux-command-manual.html", icon: "mdi-file-document-outline" },
                { title: "Linux Administration", url: "https://www.tutorialspoint.com/linux_admin/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Shell 脚本编程',
          description: '变量、循环、条件判断、函数、sed / awk 文本处理',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Shell 教程", url: "https://www.bilibili.com/video/BV1hW41177NC", icon: "mdi-play-circle-outline" },
                { title: "Shell Scripting Full Course", url: "https://www.youtube.com/watch?v=e7BufAVwDiM", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Shell 教程", url: "https://www.runoob.com/linux/linux-shell.html", icon: "mdi-file-document-outline" },
                { title: "Bash Scripting Guide", url: "https://tldp.org/LDP/Bash-Beginners-Guide/html/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '文本编辑器',
          description: 'Vim 操作、Vim 配置与插件',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Vim 教程", url: "https://www.bilibili.com/video/BV1tE411F7F3", icon: "mdi-play-circle-outline" },
                { title: "Vim Full Course", url: "https://www.youtube.com/watch?v=RZ4p-saaQRk", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Vim 教程", url: "https://www.runoob.com/linux/linux-vim.html", icon: "mdi-file-document-outline" },
                { title: "Vim Documentation", url: "https://vimhelp.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '网络基础',
          description: 'IP 地址 / 子网掩码、路由、DNS 解析、iptables 规则',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "计算机网络教程", url: "https://www.bilibili.com/video/BV1xJ41197hH", icon: "mdi-play-circle-outline" },
                { title: "Networking Full Course", url: "https://www.youtube.com/watch?v=qiQR5rTSshw", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "计算机网络", url: "https://www.runoob.com/w3cnote/summary-of-computer-network.html", icon: "mdi-file-document-outline" },
                { title: "Computer Networking", url: "https://www.tutorialspoint.com/computer_networking/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '版本控制',
          description: 'Git 分支策略、Git Flow、GitHub / GitLab 协作流程',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 Git 教程", url: "https://www.bilibili.com/video/BV1vy4y1s7k6", icon: "mdi-play-circle-outline" },
                { title: "Git Full Course", url: "https://www.youtube.com/watch?v=8JJ101D3knE", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Git 教程", url: "https://www.runoob.com/git/git-tutorial.html", icon: "mdi-file-document-outline" },
                { title: "Git Docs", url: "https://git-scm.com/doc", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Go / Python 编程',
          description: '自动化脚本、CLI 工具开发、REST API 调用',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Go 教程", url: "https://www.bilibili.com/video/BV1ME411Y71o", icon: "mdi-play-circle-outline" },
                { title: "Go Full Course", url: "https://www.youtube.com/watch?v=YS4e4q9oBaU", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Go 语言教程", url: "https://www.runoob.com/go/go-tutorial.html", icon: "mdi-file-document-outline" },
                { title: "Go Docs", url: "https://go.dev/doc/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '容器化与编排',
      subtitle: '必修',
      children: [
        {
          title: 'Docker 核心',
          description: '镜像构建、Dockerfile 编写、docker-compose 编排',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 Docker 教程", url: "https://www.bilibili.com/video/BV1gr4y1U7CY", icon: "mdi-play-circle-outline" },
                { title: "Docker Full Course", url: "https://www.youtube.com/watch?v=3c-iBn73dDE", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Docker 从入门到实践", url: "https://yeasy.gitbook.io/docker_practice/", icon: "mdi-file-document-outline" },
                { title: "Docker Official Docs", url: "https://docs.docker.com/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Docker 网络与存储',
          description: 'Bridge / Host / Overlay 网络、Volume / Bind Mount',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Docker 网络", url: "https://yeasy.gitbook.io/docker_practice/network", icon: "mdi-file-document-outline" },
                { title: "Docker Storage", url: "https://docs.docker.com/storage/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Docker 最佳实践',
          description: '多阶段构建、镜像瘦身、安全扫描',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Docker 最佳实践", url: "https://www.youtube.com/watch?v=8vXoMqWgbQQ", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Dockerfile 最佳实践", url: "https://yeasy.gitbook.io/docker_practice/image/dockerfile", icon: "mdi-file-document-outline" },
                { title: "Docker Best Practices", url: "https://docs.docker.com/develop/dev-best-practices/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Kubernetes 核心概念',
          description: 'Pod、Deployment、Service、ConfigMap / Secret',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 Kubernetes 教程", url: "https://www.bilibili.com/video/BV1Qv4y1T7Fv", icon: "mdi-play-circle-outline" },
                { title: "K8s Full Course", url: "https://www.youtube.com/watch?v=X48VuDVv0do", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Kubernetes 官方文档", url: "https://kubernetes.io/zh-cn/docs/", icon: "mdi-file-document-outline" },
                { title: "K8s Official Docs", url: "https://kubernetes.io/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'kubectl 日常操作',
          description: '资源查询、日志查看、端口转发、滚动更新',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "kubectl 教程", url: "https://www.youtube.com/watch?v=HlAXp0_M6f0", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "kubectl 速查表", url: "https://kubernetes.io/zh-cn/docs/reference/kubectl/cheatsheet/", icon: "mdi-file-document-outline" },
                { title: "kubectl Cheat Sheet", url: "https://kubernetes.io/docs/reference/kubectl/cheatsheet/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Helm',
          description: 'Chart 结构、模板化部署、仓库管理',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Helm 教程", url: "https://www.youtube.com/watch?v=5_J7RWLLVeQ", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Helm 官方文档", url: "https://helm.sh/zh/docs/", icon: "mdi-file-document-outline" },
                { title: "Helm Docs", url: "https://helm.sh/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Kustomize',
          description: '声明式配置管理、环境差异化',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Kustomize 官方文档", url: "https://kustomize.io/", icon: "mdi-file-document-outline" },
                { title: "Kustomize Guide", url: "https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Podman / containerd',
          description: '无守护进程容器引擎、CRI 接口',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Podman 官方文档", url: "https://podman.io/docs", icon: "mdi-file-document-outline" },
                { title: "containerd Docs", url: "https://containerd.io/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: 'CI/CD 流水线',
      subtitle: '必修',
      children: [
        {
          title: 'GitHub Actions',
          description: 'Workflow 编写、Job / Step 定义、矩阵构建',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "GitHub Actions 教程", url: "https://www.youtube.com/watch?v=R8_veQiYBjI", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "GitHub Actions 官方文档", url: "https://docs.github.com/zh/actions", icon: "mdi-file-document-outline" },
                { title: "GitHub Actions Docs", url: "https://docs.github.com/en/actions", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'GitLab CI',
          description: '.gitlab-ci.yml 配置、Runner 搭建、Pipeline 可视化',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "GitLab CI 教程", url: "https://www.youtube.com/watch?v=Qmzfy3rw5lQ", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "GitLab CI 官方文档", url: "https://docs.gitlab.com/ee/ci/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Jenkins',
          description: 'Pipeline as Code（Declarative / Scripted）、插件生态',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Jenkins 教程", url: "https://www.bilibili.com/video/BV1tb4y1C7p4", icon: "mdi-play-circle-outline" },
                { title: "Jenkins Full Course", url: "https://www.youtube.com/watch?v=6YZvp2GwT0A", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Jenkins 官方文档", url: "https://www.jenkins.io/zh/doc/", icon: "mdi-file-document-outline" },
                { title: "Jenkins Docs", url: "https://www.jenkins.io/doc/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '制品管理',
          description: 'Nexus / Artifactory / Docker Registry 搭建与配置',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Nexus 官方文档", url: "https://help.sonatype.com/repomanager3", icon: "mdi-file-document-outline" },
                { title: "Artifactory Docs", url: "https://www.jfrog.com/confluence/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '自动化测试集成',
          description: '单元测试、代码扫描（SonarQube）、构建质量门禁',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "SonarQube 教程", url: "https://www.youtube.com/watch?v=v_TE8fQhE0o", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "SonarQube 官方文档", url: "https://docs.sonarqube.org/latest/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'ArgoCD',
          description: 'GitOps 声明式部署、应用自动同步',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "ArgoCD 教程", url: "https://www.youtube.com/watch?v=MeU5_k9mOq8", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "ArgoCD 官方文档", url: "https://argo-cd.readthedocs.io/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '基础设施即代码 (IaC)',
      subtitle: '必修',
      children: [
        {
          title: 'Terraform 核心',
          description: 'HCL 语法、Provider / Resource / State 管理',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Terraform 教程", url: "https://www.bilibili.com/video/BV1iU4y1k7UA", icon: "mdi-play-circle-outline" },
                { title: "Terraform Full Course", url: "https://www.youtube.com/watch?v=7xngnjfIlK4", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Terraform 官方文档", url: "https://developer.hashicorp.com/terraform/docs", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Terraform 进阶',
          description: 'Module 封装、远程 State（S3 / Consul）、Workspace',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Terraform Module", url: "https://developer.hashicorp.com/terraform/language/modules", icon: "mdi-file-document-outline" },
                { title: "Terraform State", url: "https://developer.hashicorp.com/terraform/language/state", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Ansible',
          description: 'Playbook 编写、Inventory 管理、Role 复用',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Ansible 教程", url: "https://www.bilibili.com/video/BV1Ut411s7FJ", icon: "mdi-play-circle-outline" },
                { title: "Ansible Full Course", url: "https://www.youtube.com/watch?v=1id6ERvfo08", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Ansible 官方文档", url: "https://docs.ansible.com/ansible/latest/index.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '配置管理',
          description: 'Ansible 批量配置分发、环境一致性保障',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Ansible 最佳实践", url: "https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html", icon: "mdi-file-document-outline" },
                { title: "Configuration Management", url: "https://www.ansible.com/use-cases/configuration-management", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Pulumi',
          description: '通用编程语言定义基础设施（TypeScript / Python / Go）',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Pulumi 教程", url: "https://www.youtube.com/watch?v=QfJTJs24-JM", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Pulumi 官方文档", url: "https://www.pulumi.com/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Packer',
          description: '统一镜像构建（AMI / VM / Docker）',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Packer 教程", url: "https://www.youtube.com/watch?v=2FF2v65pyFk", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Packer 官方文档", url: "https://developer.hashicorp.com/packer/docs", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '监控与可观测性',
      subtitle: '必修',
      children: [
        {
          title: 'Prometheus',
          description: '指标采集、PromQL 查询、Alertmanager 告警',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Prometheus 教程", url: "https://www.bilibili.com/video/BV1rv4y1J7yP", icon: "mdi-play-circle-outline" },
                { title: "Prometheus Full Course", url: "https://www.youtube.com/watch?v=h4Sl21AKiDg", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Prometheus 官方文档", url: "https://prometheus.io/docs/introduction/overview/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Grafana',
          description: 'Dashboard 面板、数据源配置、告警通知',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Grafana 教程", url: "https://www.youtube.com/watch?v=kk7B0O36iWQ", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Grafana 官方文档", url: "https://grafana.com/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '日志收集（ELK / Loki）',
          description: 'Filebeat / Fluentd 日志采集、Elasticsearch 存储、Kibana 可视化',
          groups: [
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
                { title: "Loki Docs", url: "https://grafana.com/docs/loki/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '链路追踪',
          description: 'Jaeger / Zipkin 分布式追踪、OpenTelemetry 标准',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "OpenTelemetry 教程", url: "https://www.youtube.com/watch?v=idRqFfbX9_A", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "OpenTelemetry 官方文档", url: "https://opentelemetry.io/docs/", icon: "mdi-file-document-outline" },
                { title: "Jaeger Docs", url: "https://www.jaegertracing.io/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'SLO / SLI / SLA',
          description: '服务可用性指标定义、错误预算',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "SLO 实践", url: "https://www.infoq.cn/article/slo-best-practice", icon: "mdi-file-document-outline" },
                { title: "Google SRE Book", url: "https://sre.google/sre-book/service-level-objectives/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'APM 工具',
          description: 'Datadog / New Relic / SkyWalking',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "SkyWalking 官方文档", url: "https://skywalking.apache.org/docs/", icon: "mdi-file-document-outline" },
                { title: "Datadog Docs", url: "https://docs.datadoghq.com/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '云服务平台',
      subtitle: '必修',
      children: [
        {
          title: 'AWS 核心服务',
          description: 'EC2、S3、RDS、VPC、ELB、IAM 权限管理',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "AWS 教程", url: "https://www.bilibili.com/video/BV1kf4y1H7Lq", icon: "mdi-play-circle-outline" },
                { title: "AWS Full Course", url: "https://www.youtube.com/watch?v=ulprqHHWlng", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "AWS 官方文档", url: "https://docs.aws.amazon.com/zh_cn/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '阿里云核心服务',
          description: 'ECS、OSS、RDS、VPC、SLB、RAM',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "阿里云教程", url: "https://www.bilibili.com/video/BV1PE411j7eT", icon: "mdi-play-circle-outline" },
                { title: "Alibaba Cloud Tutorial", url: "https://www.youtube.com/watch?v=Z3SChFpN8H0", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "阿里云文档", url: "https://help.aliyun.com/", icon: "mdi-file-document-outline" },
                { title: "Alibaba Cloud Docs", url: "https://www.alibabacloud.com/help", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '云原生数据库',
          description: 'AWS Aurora / 阿里云 PolarDB、Redis 托管服务',
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "AWS Aurora 文档", url: "https://aws.amazon.com/cn/rds/aurora/", icon: "mdi-file-document-outline" },
                { title: "PolarDB Docs", url: "https://www.alibabacloud.com/help/polardb", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '对象存储',
          description: 'S3 / OSS 权限策略、生命周期管理、CDN 加速',
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "AWS S3 教程", url: "https://www.youtube.com/watch?v=e6w9LwZJFIA", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "阿里云 OSS 文档", url: "https://help.aliyun.com/product/31815.html", icon: "mdi-file-document-outline" },
                { title: "AWS S3 Docs", url: "https://docs.aws.amazon.com/s3/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Azure / GCP',
          description: 'AKS / GKE 托管 Kubernetes、Cloud Functions',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Azure 官方文档", url: "https://docs.azure.cn/zh-cn/", icon: "mdi-file-document-outline" },
                { title: "GCP Docs", url: "https://cloud.google.com/docs", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '多云与混合云',
          description: '云互联、云迁移策略、成本优化',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "多云架构", url: "https://www.ibm.com/cloud/learn/multicloud", icon: "mdi-file-document-outline" },
                { title: "Hybrid Cloud Guide", url: "https://cloud.google.com/hybrid-cloud", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '容器安全与合规',
      subtitle: '选修',
      children: [
        {
          title: '镜像安全扫描',
          description: 'Trivy / Clair / Anchore',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Trivy 教程", url: "https://www.youtube.com/watch?v=7NnPpE9sXhc", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Trivy 官方文档", url: "https://trivy.dev/", icon: "mdi-file-document-outline" },
                { title: "Clair Docs", url: "https://clairproject.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Kubernetes 安全',
          description: 'RBAC / PodSecurityPolicy / NetworkPolicy / OPA Gatekeeper',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "K8s 安全教程", url: "https://www.youtube.com/watch?v=O2eLb3O6hB8", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "K8s 安全", url: "https://kubernetes.io/zh-cn/docs/concepts/security/", icon: "mdi-file-document-outline" },
                { title: "OPA Gatekeeper", url: "https://open-policy-agent.github.io/gatekeeper/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '密钥管理',
          description: 'HashiCorp Vault / AWS Secrets Manager / Kubernetes External Secrets',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "HashiCorp Vault 教程", url: "https://www.youtube.com/watch?v=VYfl-VZbBas", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Vault 官方文档", url: "https://developer.hashicorp.com/vault/docs", icon: "mdi-file-document-outline" },
                { title: "AWS Secrets Manager", url: "https://docs.aws.amazon.com/secretsmanager/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '合规审计',
          description: 'CIS Benchmark、kube-bench、kube-hunter',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "CIS Benchmark", url: "https://www.cisecurity.org/benchmark/kubernetes", icon: "mdi-file-document-outline" },
                { title: "kube-bench", url: "https://github.com/aquasecurity/kube-bench", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: 'SRE 与高可用架构',
      subtitle: '选修',
      children: [
        {
          title: '容量规划',
          description: '压力测试、资源评估、弹性伸缩（HPA / VPA / Cluster Autoscaler）',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "K8s 弹性伸缩", url: "https://www.youtube.com/watch?v=oB8WrBI3_kI", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "HPA 官方文档", url: "https://kubernetes.io/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/", icon: "mdi-file-document-outline" },
                { title: "Cluster Autoscaler", url: "https://github.com/kubernetes/autoscaler", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '故障演练',
          description: 'Chaos Engineering、Litmus / Chaos Mesh',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Chaos Engineering 教程", url: "https://www.youtube.com/watch?v=RoXHlEoVE7A", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Chaos Mesh 官方文档", url: "https://chaos-mesh.org/docs/", icon: "mdi-file-document-outline" },
                { title: "Litmus Docs", url: "https://litmuschaos.io/docs/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '容灾与备份',
          description: '跨区域复制、RTO / RPO 定义、定期恢复演练',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "容灾备份", url: "https://www.alibabacloud.com/help/zh/disaster-recovery", icon: "mdi-file-document-outline" },
                { title: "Disaster Recovery", url: "https://aws.amazon.com/disaster-recovery/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '成本治理',
          description: '云成本分析（FinOps）、资源优化、预留实例',
          optional: true,
          groups: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "FinOps 指南", url: "https://www.finops.org/", icon: "mdi-file-document-outline" },
                { title: "AWS Cost Management", url: "https://aws.amazon.com/aws-cost-management/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'SRE 实践',
          description: '值班 On-Call、事故管理、事后复盘（Blameless Postmortem）',
          optional: true,
          groups: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "SRE 教程", url: "https://www.youtube.com/watch?v=uTEOsU3v4sI", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Google SRE 中文版", url: "https://sre.google/books/", icon: "mdi-file-document-outline" },
                { title: "SRE Workbook", url: "https://sre.google/workbook/", icon: "mdi-file-document-outline" }
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
