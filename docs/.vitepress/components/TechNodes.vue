<script setup lang="ts">
import { withBase } from 'vitepress'
import { computed } from 'vue'
import { tutorialIndex } from '../tutorial-index'
import { routePlan, seriesMeta } from '../route-plan'

const props = defineProps<{ page: string }>()

const colors = ['#2563eb', '#0ea5e9', '#9333ea', '#d97706']

const tiers = computed(() =>
  (routePlan[props.page] || []).map((t, i) => ({
    name: t.name,
    color: colors[i % colors.length],
    items: t.items.map((slug) => ({
      slug,
      title: tutorialIndex[slug]?.title ?? seriesMeta[slug] ?? slug,
      chapters: tutorialIndex[slug]?.chapters.length,
      href: tutorialIndex[slug] ? withBase(`/tutorials/${slug}/`) : undefined,
    })),
  }))
)
</script>

<template>
  <div>
    <section v-for="t in tiers" :key="t.name" class="node-group">
      <h2 class="text-h5 font-weight-bold mb-3" :style="{ color: t.color, lineHeight: '32px' }">{{ t.name }}</h2>
      <v-row>
        <v-col v-for="n in t.items" :key="n.slug" cols="12" sm="6" md="4">
          <v-card
            v-if="n.href"
            class="node-card"
            flat
            :href="n.href"
            :style="{ borderLeft: '4px solid ' + t.color, borderRadius: '8px' }"
          >
            <v-card-text class="pa-4 d-flex align-center ga-2">
              <v-icon size="16" :style="{ color: t.color }">mdi-book-open-variant</v-icon>
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
