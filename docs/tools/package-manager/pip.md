<script setup>
import ContentView from '../../.vitepress/components/ContentView.vue'
const data = {
  name: 'pip',
  description: 'Python 官方包管理器，用于安装、管理和分发 Python 软件包。',
  items: [
    {
      name: '简介与安装',
      children: [
        {
          title: '工具简介',
          description: 'pip（Package Installer for Python）是 Python 生态中最常用的包管理器。它从 PyPI（Python Package Index）安装包，支持依赖解析、虚拟环境管理和版本控制。',
          groups: [{ name: '官方文档', icon: 'mdi-file-document-outline', items: [{ title: 'pip 官网', url: 'https://pip.pypa.io' }, { title: 'PyPI', url: 'https://pypi.org' }] }]
        },
        {
          title: '安装方式',
          description: 'Python 3.4+ 已内置 pip，可通过 python -m pip 直接使用。如未安装，可通过 ensurepip 或 get-pip.py 脚本安装。建议升级到最新版本。',
          groups: [{ name: '安装指南', icon: 'mdi-download', items: [{ title: 'pip 安装文档', url: 'https://pip.pypa.io/en/stable/installation/' }] }]
        }
      ]
    },
    {
      name: '核心功能',
      children: [
        {
          title: '包安装与管理',
          description: '使用 pip install 安装包，pip uninstall 卸载，pip list 列出已安装包，pip show 查看包详情。支持指定版本范围和 extras。',
          groups: [{ name: '教程', icon: 'mdi-play-circle-outline', items: [{ title: 'pip 使用指南', url: 'https://pip.pypa.io/en/stable/user_guide/' }] }]
        },
        {
          title: 'requirements.txt',
          description: '通过 requirements.txt 文件锁定项目依赖，使用 pip install -r requirements.txt 一键安装所有依赖。支持 pip freeze 导出当前环境的包列表。',
          groups: [{ name: '教程', icon: 'mdi-file-document-outline', items: [{ title: 'Requirements 文件', url: 'https://pip.pypa.io/en/stable/user_guide/#requirements-files' }] }]
        },
        {
          title: '虚拟环境',
          description: 'pip 常配合 venv 或 virtualenv 使用，为每个项目创建隔离的 Python 环境，避免包版本冲突。python -m venv .venv 创建虚拟环境。',
          groups: [{ name: '教程', icon: 'mdi-box-shadow', items: [{ title: '虚拟环境指南', url: 'https://docs.python.org/3/library/venv.html' }] }]
        }
      ]
    },
    {
      name: '进阶技巧', subtitle: '选修',
      children: [
        {
          title: '镜像源配置',
          description: '在国内使用可配置清华大学、阿里云等镜像源加速下载。通过 pip config set global.index-url 或修改 pip.conf 文件实现。',
          optional: true,
          groups: [{ name: '参考', icon: 'mdi-server', items: [{ title: '清华镜像源', url: 'https://mirrors.tuna.tsinghua.edu.cn/help/pypi/' }] }]
        },
        {
          title: '替代工具',
          description: '了解 Poetry、PDM 和 uv 等新一代 Python 包管理工具，它们在依赖解析、锁文件和构建方面提供了更好的体验。',
          optional: true,
          groups: [{ name: '对比', icon: 'mdi-chart-bar', items: [{ title: 'Poetry 官网', url: 'https://python-poetry.org' }, { title: 'uv 文档', url: 'https://docs.astral.sh/uv/' }] }]
        }
      ]
    }
  ]
}
</script>
<ContentView :data="data" />
