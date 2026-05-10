<script setup lang="ts">
import { Graph, treeToGraphData } from '@antv/g6';
import { onMounted, onUnmounted, ref } from 'vue';

interface ResourceGroup { name: string; icon?: string; items: { title: string; url: string; icon?: string }[] }

interface Item {
  title: string; description?: string; optional?: boolean; note?: string; detail?: string
  groups?: ResourceGroup[]
}

interface Section { name: string; subtitle?: string; children: Item[] }

const props = defineProps<{
  sections: Section[]
  topicName?: string
}>()

const emit = defineEmits<{
  (e: 'itemClick', item: Item): void
}>()

const containerRef = ref<HTMLDivElement>()
const rendered = ref(false)
let graph: Graph | null = null

function escapeLabel(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .replace(/\|/g, '·')
    .replace(/"/g, "'")
    .trim()
}

function truncate(text: string, max = 28): string {
  const cleaned = text.replace(/\*\*/g, '').trim()
  return cleaned.length > max ? cleaned.slice(0, max) + '…' : cleaned
}

function estimateNodeWidth(text: string, fontSize: number): number {
  let width = 0
  for (const ch of text) {
    if (/[一-鿿]/.test(ch)) {
      width += fontSize
    } else {
      width += fontSize * 0.6
    }
  }
  return Math.max(width + 48, 100)
}

function estimateNodeHeight(fontSize: number): number {
  return fontSize + 20
}

function buildTree() {
  return {
    id: 'ROOT',
    data: { nodeType: 'root' as const, label: escapeLabel(props.topicName || '学习路线') },
    children: props.sections.map((sec, si) => ({
      id: `S${si}`,
      data: { nodeType: 'section' as const, label: escapeLabel(sec.name) },
      children: sec.children
        .map((child, ci): { id: string; data: { nodeType: 'item'; label: string; optional?: boolean; item: Item } } | null => {
          const label = truncate(escapeLabel(child.title))
          if (!label) return null
          return {
            id: `I${si}_${ci}`,
            data: { nodeType: 'item', label, optional: child.optional, item: child },
          }
        })
        .filter((x): x is NonNullable<typeof x> => x != null),
    })),
  }
}

onMounted(() => {
  const el = containerRef.value
  if (!el) return

  const tree = buildTree()
  const data = treeToGraphData(tree)

  graph = new Graph({
    container: el,
    data,
    node: {
      type: 'rect',
      style: (d: any) => {
        const nt = d?.data?.nodeType
        const opt = d?.data?.optional
        const label = d?.data?.label || ''

        if (nt === 'root') {
          const w = estimateNodeWidth(label, 14)
          const h = estimateNodeHeight(14)
          return {
            size: [w, h],
            radius: 6,
            fill: '#4caf50',
            stroke: '#388e3c',
            lineWidth: 2,
            labelText: label,
            labelFill: '#fff',
            labelFontWeight: 'bold',
            labelFontSize: 14,
            labelPlacement: 'center',
            cursor: 'pointer',
          }
        }
        if (nt === 'section') {
          const w = estimateNodeWidth(label, 13)
          const h = estimateNodeHeight(13)
          return {
            size: [w, h],
            radius: 4,
            fill: '#e3f2fd',
            stroke: '#90caf9',
            lineWidth: 2,
            labelText: label,
            labelFill: '#1565c0',
            labelFontWeight: 'bold',
            labelFontSize: 13,
            labelPlacement: 'center',
            cursor: 'pointer',
          }
        }
        const w = estimateNodeWidth(label, 12)
        const h = estimateNodeHeight(12)
        return {
          size: [w, h],
          radius: 4,
          fill: opt ? '#f5f5f5' : '#e8f5e9',
          stroke: opt ? '#bbb' : '#81c784',
          lineWidth: 1,
          labelText: label,
          labelFill: opt ? '#888' : '#2e7d32',
          labelFontSize: 12,
          labelPlacement: 'center',
          cursor: 'pointer',
        }
      },
    },
    edge: {
      type: 'polyline',
      style: {
        stroke: '#bbb',
        lineWidth: 1.5,
        strokeOpacity: 0.8,
        router: {
          type: 'orth',
        },
      },
    },
    layout: {
      type: 'indented',
      direction: 'LR',
      indent: 130,
      getHeight: () => 20,
    },
    behaviors: [],
    autoResize: true,
    animation: false,
  })

  graph.on('node:click', (event: any) => {
    if (!graph || !event) return
    const nodeId = event.itemId ?? event.target?.id
    if (!nodeId) return
    try {
      const nodeData = graph.getNodeData(nodeId) as { data?: Record<string, any> } | undefined
      if (nodeData?.data?.nodeType === 'item' && nodeData.data.item) {
        emit('itemClick', nodeData.data.item as Item)
      }
    } catch (e) {
      // ignore click errors
    }
  })

  graph.render().then(() => {
    const g = graph
    if (!g) return
    let minY = Infinity, maxY = -Infinity
    // 通过 getNodes() 获取渲染后的节点实例（含布局位置）
    try {
      const items: any[] = (g as any).getNodes?.() ?? []
      items.forEach((node: any) => {
        const model = node.getModel?.() ?? node.getData?.() ?? node
        const y = model?.y
        if (typeof y === 'number') {
          const size = model?.size
          const nh = Array.isArray(size) ? size[1] : (typeof size === 'number' ? size : 32)
          minY = Math.min(minY, y - nh / 2)
          maxY = Math.max(maxY, y + nh / 2)
        }
      })
    } catch { /* ignore */ }
    // 后备：从 getNodeData 读
    if (!isFinite(minY)) {
      try {
        const all: any[] = (() => {
          const d: any = g.getNodeData()
          return Array.isArray(d) ? d : Object.values(d)
        })()
        all.forEach((n: any) => {
          const y = n?.y ?? n?.style?.y ?? n?.data?.y
          if (typeof y === 'number') {
            const size = n?.size ?? n?.style?.size
            const nh = Array.isArray(size) ? size[1] : (typeof size === 'number' ? size : 32)
            minY = Math.min(minY, y - nh / 2)
            maxY = Math.max(maxY, y + nh / 2)
          }
        })
      } catch { /* ignore */ }
    }
    if (isFinite(minY) && maxY > minY) {
      el.style.height = (maxY - minY + 80) + 'px'
      requestAnimationFrame(() => { try { g.resize() } catch { /* ignore */ } })
    }
    rendered.value = true
  })
})

onUnmounted(() => {
  if (graph && !graph.destroyed) {
    graph.destroy()
    graph = null
  }
})
</script>

<template>
  <div ref="containerRef" class="roadmap-wrap" />
  <!-- <div v-if="rendered" class="text-caption text-grey text-center mt-1">💡 点击知识点节点可查看详情</div> -->
</template>

<style scoped>
.roadmap-wrap {
  width: 100vw;
  min-height: 400px;
  overflow: hidden;
  margin-left: calc(-50vw + 50%);
}
</style>
