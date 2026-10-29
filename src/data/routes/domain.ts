// 24 条应用领域路线的板块（RouteTier[]），键为 domain-<slug>。
// 纯数据文件：只放配置，类型与逻辑在 src/data/route-model.ts。

import type { RouteTier } from '@/data/route-model';

export const domainRoutes: Record<string, RouteTier[]> = {
  'domain-ai-ml': [
    { name: '入门 · 数学与编程基础', items: ['python', 'data-science', 'dsa'] },
    { name: '进阶 · 机器学习与深度学习', items: ['machine-learning', 'deep-learning', 'nlp'] },
    { name: '精通 · 大模型应用', items: ['llm-app', 'prompt-engineering', 'rag', 'agent'] },
    { name: '实战与生态 · 部署、评测与运维', items: ['model-deploy', 'eval', 'fastapi', 'docker', 'kubernetes'] },
  ],
  'domain-big-data': [
    { name: '入门 · 基础与语言', items: ['sql', 'python', 'linux'] },
    { name: '进阶 · 存储与消息', items: ['mysql', 'redis', 'kafka', 'mongodb'] },
    { name: '精通 · 计算引擎与数仓', items: ['spark', 'flink', 'etl', 'data-warehouse'] },
    { name: '实战与生态 · 平台、分析与运维', items: ['docker', 'kubernetes', 'elasticsearch', 'bi', 'big-data'] },
  ],
  'domain-blockchain-web3': [
    { name: '入门 · 基础与密码学', items: ['network', 'c', 'python'] },
    { name: '进阶 · 链上开发', items: ['blockchain', 'rust', 'node-backend'] },
    { name: '精通 · 系统与性能', items: ['os', 'dsa', 'security'] },
    { name: '实战与生态 · 部署与运维', items: ['docker', 'kubernetes', 'linux'] },
  ],
  'domain-cybersecurity': [
    { name: '入门 · 基础与工具', items: ['linux', 'network', 'python'] },
    { name: '进阶 · 攻防技术', items: ['security', 'os', 'c'] },
    { name: '精通 · 逆向与底层', items: ['dsa', 'design-patterns'] },
    { name: '实战与生态 · 云与运维', items: ['docker', 'kubernetes', 'nginx', 'sql'] },
  ],
  'domain-devops-cloud': [
    { name: '入门 · 系统与网络', items: ['linux', 'network'] },
    { name: '进阶 · 容器与编排', items: ['docker', 'kubernetes', 'nginx'] },
    { name: '精通 · 原理与语言', items: ['os', 'go', 'python'] },
    { name: '实战与生态 · 平台工程', items: ['security', 'prometheus', 'big-data'] },
  ],
  'domain-embedded-iot': [
    { name: '入门 · C 与硬件基础', items: ['c', 'c-pointers', 'linux', 'network'] },
    { name: '进阶 · 系统与外设', items: ['embedded', 'rtos', 'embedded-linux', 'cpp'] },
    { name: '精通 · 机器人与算法', items: ['ros2', 'motion-planning', 'sensor-fusion', 'rust'] },
    { name: '实战与生态 · 联网、云与安全', items: ['iot-gateway', 'mqtt', 'docker', 'security'] },
  ],
  'domain-fintech': [
    { name: '入门 · 语言与数据', items: ['python', 'sql', 'mysql'] },
    { name: '进阶 · 系统与网络', items: ['c', 'network', 'os'] },
    { name: '精通 · 量化与算法', items: ['dsa', 'quant', 'machine-learning'] },
    { name: '实战与生态 · 风控与运维', items: ['redis', 'kafka', 'docker', 'security'] },
  ],
  'domain-game-vr-ar': [
    { name: '入门 · 语言与数学', items: ['c', 'cpp', 'dsa'] },
    { name: '进阶 · 引擎与图形', items: ['game-dev', 'csharp', 'design-patterns'] },
    { name: '精通 · 性能与底层', items: ['os', 'network'] },
    { name: '实战与生态 · 上线与运维', items: ['docker', 'nginx', 'embedded'] },
  ],
  'domain-gis': [
    { name: '入门 · 前端与数据基础', items: ['javascript', 'html', 'css'] },
    { name: '进阶 · 空间数据与数据库', items: ['sql', 'postgresql', 'mongodb'] },
    { name: '精通 · 算法与系统', items: ['dsa', 'os', 'network'] },
    { name: '实战与生态 · 服务与部署', items: ['docker', 'nginx', 'node-backend'] },
  ],
  'domain-mobile-dev': [
    { name: '入门 · 语言与工具', items: ['javascript'] },
    { name: '进阶 · 跨端框架', items: ['flutter', 'react-native', 'typescript'] },
    { name: '精通 · 网络与架构', items: ['network', 'design-patterns', 'sql'] },
    { name: '实战与生态 · 质量与发布', items: ['testing', 'docker', 'nginx'] },
  ],
  'domain-visualization': [
    { name: '入门 · 前端与数据', items: ['html', 'css', 'javascript'] },
    { name: '进阶 · 数据处理', items: ['data-science', 'sql', 'typescript'] },
    { name: '精通 · 算法与性能', items: ['dsa', 'os', 'network'] },
    { name: '实战与生态 · 服务与部署', items: ['node-backend', 'docker', 'nginx'] },
  ],
  'domain-web-saas': [
    { name: '入门 · 前端与语言', items: ['html', 'css', 'javascript', 'typescript'] },
    { name: '进阶 · 服务端与数据', items: ['nodejs', 'node-backend', 'sql', 'mysql', 'redis'] },
    { name: '精通 · 原理与安全', items: ['network', 'os', 'security', 'design-patterns'] },
    { name: '实战与生态 · 交付与运维', items: ['vite', 'vue', 'react', 'docker', 'kubernetes', 'nginx'] },
  ],
  'domain-desktop-app': [
    { name: '入门 · 语言与桌面 GUI', items: ['csharp', 'cpp', 'wpf', 'qt'] },
    { name: '进阶 · 跨平台桌面框架', items: ['electron', 'tauri', 'maui', 'winui'] },
    { name: '精通 · 架构与系统集成', items: ['design-patterns', 'sql', 'network', 'security'] },
    { name: '实战与生态 · 打包、更新与质量', items: ['packaging', 'auto-update', 'testing'] },
  ],
  'domain-industrial-hmi': [
    { name: '入门 · 语言与界面基础', items: ['csharp', 'wpf', 'qt', 'python'] },
    { name: '进阶 · 工业通信协议', items: ['serial-port', 'tcp-udp', 'modbus', 'opc-ua', 'mqtt'] },
    { name: '精通 · PLC、组态与运动控制', items: ['plc-programming', 'ladder-logic', 'scada', 'hmi-design', 'servo-motion'] },
    { name: '实战与生态 · 采集、报表与部署', items: ['industrial-comms', 'realtime-chart', 'report-export', 'packaging', 'auto-update'] },
  ],
  'domain-database-systems': [
    { name: '入门 · 关系型与 SQL', items: ['sql', 'mysql', 'postgresql'] },
    { name: '进阶 · 查询与建模', items: ['data-modeling', 'indexing', 'query-optimization', 'transactions'] },
    { name: '精通 · 内核与分布式', items: ['database-internals', 'replication', 'sharding', 'os'] },
    { name: '实战 · 多模存储与运维', items: ['redis', 'mongodb', 'elasticsearch', 'clickhouse', 'backup-recovery'] },
  ],
  'domain-scientific-computing': [
    { name: '基础 · 数学与编程', items: ['python', 'numpy', 'scipy', 'matlab'] },
    { name: '进阶 · 数值与建模', items: ['numerical-methods', 'simulation', 'mesh', 'fem'] },
    { name: '精通 · 图形与可视化', items: ['opengl', 'vtk', 'geometry'] },
    { name: '实战 · 工程软件与集成', items: ['cad-dev', 'cae', 'bim', 'plugin-dev'] },
  ],
  'domain-os-system': [
    { name: '入门 · 系统原理', items: ['os', 'linux', 'shell'] },
    { name: '进阶 · 内核与驱动', items: ['kernel', 'drivers', 'syscall', 'memory-management'] },
    { name: '精通 · 编译与运行时', items: ['compiler', 'interpreter', 'vm', 'linker'] },
    { name: '实战 · 性能与调试', items: ['perf-analysis', 'debugging', 'tracing', 'ebpf'] },
  ],
  'domain-media-streaming': [
    { name: '入门 · 音视频基础', items: ['media-basics', 'ffmpeg', 'h264-codec'] },
    { name: '进阶 · 协议与传输', items: ['rtmp-rtsp', 'hls-dash', 'webrtc'] },
    { name: '精通 · 流媒体服务', items: ['media-server', 'transcoding', 'cdn-delivery'] },
    { name: '实战 · 实时音视频应用', items: ['live-streaming', 'video-conference', 'realtime-media'] },
  ],
  'domain-software-engineering': [
    { name: '入门 · 工程基础', items: ['code-quality', 'unit-testing'] },
    { name: '进阶 · 设计与架构', items: ['design-patterns', 'architecture', 'refactoring', 'uml'] },
    { name: '精通 · 测试与质量', items: ['integration-testing', 'e2e-testing', 'api-testing', 'perf-testing', 'static-analysis', 'code-review'] },
    { name: '实战 · 协作与交付', items: ['ci-cd', 'testing', 'agile', 'tech-writing', 'ai-coding'] },
  ],
  'domain-robotics': [
    { name: '入门 · 软件与数学基础', items: ['python', 'cpp', 'linux'] },
    { name: '进阶 · ROS 2 与感知', items: ['ros2', 'sensor-fusion', 'motion-planning'] },
    { name: '精通 · 实时与嵌入式', items: ['embedded-linux', 'rtos', 'iot-gateway'] },
    { name: '实战与生态 · 仿真与部署', items: ['simulation', 'docker', 'kubernetes'] },
  ],
  'domain-industrial-comms': [
    { name: '入门 · 通信基础', items: ['serial-port', 'tcp-udp', 'network'] },
    { name: '进阶 · 现场总线与工业协议', items: ['modbus', 'opc-ua', 'mqtt'] },
    { name: '精通 · 设备联网与数据采集', items: ['industrial-comms', 'iot-gateway', 'plc-programming'] },
    { name: '实战与生态 · 上位机与可视化', items: ['realtime-chart', 'report-export', 'scada'] },
  ],
  'domain-scada-hmi': [
    { name: '入门 · 组态与监控基础', items: ['hmi-design', 'scada', 'realtime-chart'] },
    { name: '进阶 · 数据与报警', items: ['report-export', 'opc-ua', 'modbus'] },
    { name: '精通 · 上位机开发', items: ['csharp', 'wpf', 'qt'] },
    { name: '实战与生态 · 系统集成', items: ['industrial-comms', 'plc-programming', 'docker'] },
  ],
  'domain-motion-control': [
    { name: '入门 · 运动控制基础', items: ['servo-motion', 'plc-programming', 'ladder-logic'] },
    { name: '进阶 · 现场总线与协议', items: ['modbus', 'opc-ua', 'industrial-comms'] },
    { name: '精通 · 轨迹规划与算法', items: ['motion-planning', 'sensor-fusion', 'cpp'] },
    { name: '实战与生态 · 上位机与调试', items: ['csharp', 'realtime-chart', 'qt'] },
  ],
  'domain-data-engineering': [
    { name: '入门 · SQL 与数据建模', items: ['sql', 'data-modeling', 'python'] },
    { name: '进阶 · 采集与传输', items: ['etl', 'kafka', 'flink'] },
    { name: '精通 · 数仓与计算引擎', items: ['data-warehouse', 'spark', 'big-data'] },
    { name: '实战与生态 · 平台与优化', items: ['docker', 'kubernetes', 'query-optimization'] },
  ],
};
