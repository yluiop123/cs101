<script setup lang="ts">
import { withBase } from 'vitepress'
import { computed } from 'vue'
import { tutorialIndex } from '../tutorial-index'

const props = defineProps<{ page: string }>()

const modules = import.meta.glob('../roadmap/*.ts', { eager: true }) as Record<
  string,
  { default: { name: string; description?: string; items?: any[]; chapters?: any[] } }
>

// 节点标题 → 站内教程系列。按关键词最长匹配，系列不存在时该卡置灰不跳转。
const ALIASES: [string, string[]][] = [
  ['typescript', ['typescript']],
  ['javascript', ['javascript']],
  ['nodejs', ['node.js', 'nodejs', 'node 运行时', 'node']],
  ['markdown', ['markdown']],
  ['tailwind', ['tailwind']],
  ['angular', ['angular']],
  ['vscode', ['vs code', 'vscode']],
  ['react', ['react']],
  ['regex', ['正则']],
  ['python', ['python']],
  ['html', ['html']],
  ['rust', ['rust']],
  ['vite', ['vite']],
  ['vue', ['vue']],
  ['css', ['css']],
  ['git', ['git']],
  ['java', ['java']],
  ['go', ['golang', 'go 语言', 'go']],
]

function seriesFor(title: string): string | undefined {
  const t = title.toLowerCase()
  let best: { slug: string; len: number } | undefined
  for (const [slug, keys] of ALIASES) {
    for (const k of keys) {
      // 纯 ASCII 别名要卡词边界，否则 Cargo / Angular 里的 go 会被误判
      const hit = /^[a-z0-9.]+$/.test(k)
        ? new RegExp(`(^|[^a-z0-9])${k.replace(/\./g, '\\.')}([^a-z0-9]|$)`).test(t)
        : t.includes(k)
      if (hit && (!best || k.length > best.len)) best = { slug, len: k.length }
    }
  }
  return best && tutorialIndex[best.slug] ? best.slug : undefined
}

const colors = ['#2563eb', '#0ea5e9', '#9333ea', '#d97706', '#16a34a', '#e44d26', '#336791', '#4b5563']

const data = computed(() => modules[`../roadmap/${props.page}.ts`]?.default)
const sections = computed(() => {
  // 一页之内，同一套教程只出一张卡：后面的同系列节点不再重复出卡
  const seen = new Set<string>()
  return ((data.value?.items || data.value?.chapters || []) as any[]).map((s, i) => ({
    name: s.name,
    color: colors[i % colors.length],
    items: (s.children || [])
      .map((c: any) => {
        const title = typeof c === 'string' ? c : c.title
        const slug = seriesFor(title)
        return { title, slug, href: slug ? withBase(`/tutorials/${slug}/`) : undefined }
      })
      .filter((n: any) => (n.slug ? !seen.has(n.slug) && (seen.add(n.slug), true) : true)),
  }))
})
</script>

<template>
  <div>
    <p v-if="data?.description" class="text-body-1 mb-6" style="color: rgba(var(--v-theme-on-surface), 0.6);">
      {{ data.description }}
    </p>
    <section v-for="s in sections" :key="s.name" class="node-group">
      <h2 class="text-h5 font-weight-bold mb-3" :style="{ color: s.color, lineHeight: '32px' }">{{ s.name }}</h2>
      <v-row>
        <v-col v-for="n in s.items" :key="n.title" cols="12" sm="6" md="4">
          <v-card
            v-if="n.slug"
            class="node-card"
            flat
            :href="n.href"
            :style="{ borderLeft: '4px solid ' + s.color, borderRadius: '8px' }"
          >
            <v-card-text class="pa-4 d-flex align-center ga-2">
              <v-icon size="16" :style="{ color: s.color }">mdi-book-open-variant</v-icon>
              <span class="text-subtitle-2 font-weight-bold">{{ n.title }}</span>
            </v-card-text>
          </v-card>
          <v-card
            v-else
            class="node-card node-card-muted"
            flat
            :style="{ borderLeft: '4px solid rgba(var(--v-theme-on-surface), 0.18)', borderRadius: '8px' }"
          >
            <v-card-text class="pa-4 d-flex align-center ga-2">
              <v-icon size="16">mdi-book-outline</v-icon>
              <span class="text-subtitle-2 font-weight-bold">{{ n.title }}</span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </section>
  </div>
</template>

<style scoped>
.node-group {
  margin-bottom: 32px;
}
.node-card {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  height: 100%;
}
.node-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border-color: transparent;
}
.node-card-muted {
  opacity: 0.55;
}
</style>
