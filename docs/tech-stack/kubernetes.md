<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  type: 'reference',
  name: 'Kubernetes',
  description: 'Kubernetes（K8s）是业界标准的容器编排平台，用于自动化容器化应用的部署、扩展和管理。',
  chapters: [
    {
      name: '控制平面（Control Plane）',
      children: [
        'kube-apiserver：集群 API 入口，所有组件通信的枢纽',
        'kube-controller-manager：运行控制器（Deployment、Node、Namespace 等）',
        'kube-scheduler：将 Pod 调度到合适的 Node',
        'etcd：分布式键值存储，保存集群状态',
      ]
    },
    {
      name: '工作节点（Node）',
      children: [
        'kubelet：管理节点上的 Pod 和容器',
        'kube-proxy：网络代理与负载均衡',
        '容器运行时（Container Runtime）：Docker、containerd、CRI-O',
      ]
    },
    {
      name: 'Pod',
      children: [
        '最小调度单元，包含一个或多个容器',
        '共享网络命名空间和存储卷',
        '生命周期：Pending → Running → Succeeded / Failed',
      ]
    },
    {
      name: '工作负载',
      children: [
        'Deployment：无状态应用，滚动更新、回滚',
        'StatefulSet：有状态应用，稳定的网络标识和存储',
        'DaemonSet：每个 Node 运行一个 Pod，日志采集等',
        'Job / CronJob：批处理任务与定时任务',
      ]
    },
    {
      name: '服务与网络',
      children: [
        'Service：Pod 的稳定访问入口',
        'ClusterIP：集群内虚拟 IP',
        'NodePort：节点端口映射',
        'LoadBalancer：云负载均衡器',
        'Ingress：七层路由，域名/路径分发',
      ]
    },
    {
      name: '配置与存储',
      children: [
        'ConfigMap：非敏感配置数据',
        'Secret：敏感信息（密码、Token、证书）',
        'Volume：容器数据持久化',
        'PersistentVolume（PV）与 PersistentVolumeClaim（PVC）',
        'StorageClass：动态存储供应',
      ]
    },
    {
      name: '常用操作',
      children: [
        'kubectl create deployment nginx --image=nginx：创建部署',
        'kubectl scale deployment nginx --replicas=3：扩缩容',
        'kubectl rollout status deployment nginx：查看更新状态',
        'kubectl rollout undo deployment nginx：回滚更新',
        'kubectl get pods -o wide：查看 Pod 列表',
        'kubectl describe pod my-pod：查看 Pod 详情',
        'kubectl logs -f deployment/my-app：查看日志',
        'kubectl expose deployment nginx --port=80 --type=NodePort：暴露服务',
        'kubectl port-forward pod/my-pod 8080:80：端口转发',
      ]
    },
    {
      name: '进阶主题',
      children: [
        'Helm：Kubernetes 包管理器，Chart 模板化部署',
        'Operator：使用 CRD 扩展 Kubernetes API',
        '服务网格：Istio、Linkerd 提供服务间通信、可观测性',
        'HPA：基于 CPU/内存/自定义指标的自动扩缩容',
        'RBAC：基于角色的访问控制',
      ]
    },
  ],
  groups: [
    {
      name: "推荐资源",
      items: [
        { title: "Kubernetes 官方文档", url: "https://kubernetes.io/docs/" },
        { title: "Kubernetes 中文文档", url: "https://kubernetes.io/zh-cn/docs/" }
      ],
    }
  ]
}
</script>
<ContentView :data="data" />
