<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import RoadmapDiagram from './RoadmapDiagram.vue'
import DetailDrawer from './DetailDrawer.vue'
import ResourceLinkList from './ResourceLinkList.vue'
import type { ResourceGroup } from './types'

interface Item {
  title: string; description?: string; optional?: boolean
  resources?: ResourceGroup[]
}

interface RawSection { name: string; subtitle?: string; note?: string; children?: (Item | string)[] }
interface DetailData {
  name: string; description: string
  items?: RawSection[]
  chapters?: RawSection[]
  resources?: ResourceGroup[]
}

const props = defineProps<{ data: DetailData }>()

const sections = computed(() =>
  (props.data.items || props.data.chapters || []).map((s) => ({
    ...s,
    children: (s.children || []).map((c) => (typeof c === 'string' ? { title: c } : c)),
  }))
)

const sectionColors = ['#2563eb', '#0ea5e9', '#9333ea', '#d97706', '#16a34a', '#e44d26', '#336791', '#4b5563']
const sectionColor = (i: number) => sectionColors[i % sectionColors.length]

const selectedItem = ref<Item | null>(null)
const drawer = ref(false)
const viewMode = ref<'document' | 'roadmap'>('document')
const activeSection = ref<number | null>(null)

function openItem(item: Item) {
  selectedItem.value = item
  drawer.value = true
  const idx = sections.value.findIndex(s => (s.children as Item[]).some(c => c.title === item.title))
  if (idx !== -1) {
    activeSection.value = idx
    history.replaceState(null, '', '#item-' + idx)
  }
}

function closeDrawer() {
  drawer.value = false
}

watch(viewMode, async (newMode) => {
  closeDrawer()
  if (newMode === 'document' && activeSection.value !== null) {
    await nextTick()
    await nextTick()
    const el = document.getElementById('item-' + activeSection.value)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
})
</script>

<template>
  <div class="pa-2 pa-md-4">
    <p class="text-body-1 mb-4" style="color: rgba(var(--v-theme-on-surface), 0.6);">{{ data.description }}</p>

    <div class="d-flex align-center mb-6">
      <v-btn-toggle
        v-model="viewMode"
        color="primary"
        density="compact"
        variant="outlined"
        mandatory
        rounded="xl"
        class="view-toggle"
        divided
      >
        <v-btn value="document" prepend-icon="mdi-file-document-outline" class="toggle-btn" size="small">文档</v-btn>
        <v-btn value="roadmap" prepend-icon="mdi-graph-outline" class="toggle-btn" size="small">路线图</v-btn>
      </v-btn-toggle>
    </div>

    <!-- G6 路线图 -->
    <div v-if="viewMode === 'roadmap'" id="roadmap-section" class="mb-6">
      <ClientOnly>
        <RoadmapDiagram :sections="sections" :topic-name="data.name" @item-click="openItem" />
      </ClientOnly>
    </div>

    <!-- 文档内容 -->
    <div v-show="viewMode === 'document'">
    <div v-for="(section, si) in sections" :key="si" class="mb-6">
      <div class="d-flex align-center ga-2 mb-3">
        <h2 :id="'item-' + si" class="text-h5 font-weight-bold ma-0" :style="{ color: sectionColor(si) }">
          {{ section.name }}
        </h2>
        <v-chip v-if="section.subtitle" size="x-small" color="primary" variant="flat" class="font-weight-medium">
          {{ section.subtitle }}
        </v-chip>
      </div>
      <p v-if="section.note" class="text-caption font-italic mb-3" style="color: rgba(var(--v-theme-on-surface), 0.5);">{{ section.note }}</p>

      <v-row>
        <v-col v-for="(child, ii) in section.children" :key="ii" cols="12" sm="6" md="4">
          <v-card
            variant="flat"
            class="item-card"
            :style="{ borderLeft: '4px solid ' + sectionColor(si), borderRadius: '8px' }"
            @click="openItem(child)"
          >
            <div class="d-flex align-center ga-2 pa-4">
              <div class="flex-grow-1 min-w-0">
                <div class="d-flex align-center ga-2">
                  <span class="text-subtitle-2 font-weight-bold">{{ child.title }}</span>
                  <v-chip v-if="child.optional" size="x-small" color="grey" variant="tonal" class="font-weight-medium" style="font-size: 11px;">选修</v-chip>
                  <v-chip v-else size="x-small" color="primary" variant="flat" class="font-weight-medium" style="font-size: 11px;">必修</v-chip>
                </div>
                <div class="text-caption mt-1" style="color: rgba(var(--v-theme-on-surface), 0.6);">{{ child.description }}</div>
              </div>
              <v-icon size="small" class="item-arrow flex-shrink-0">mdi-chevron-right</v-icon>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-card
        v-if="data.resources?.length"
        variant="flat"
        class="pa-4 mt-2"
        style="border: 1px solid rgba(var(--v-theme-on-surface), 0.08); border-radius: 8px;"
      >
        <ResourceLinkList :groups="data.resources" />
      </v-card>
    </div>
    </div>

    <!-- ====== RIGHT-SIDE DRAWER ====== -->
    <DetailDrawer v-model="drawer" :item="selectedItem" />
  </div>
</template>

<style scoped>
.item-card {
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  height: 100%;
}
.item-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border-color: transparent;
}
.item-arrow {
  color: rgba(var(--v-theme-on-surface), 0.25);
  transition: color 0.15s;
}
.item-card:hover .item-arrow {
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.view-toggle {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  background: rgba(var(--v-theme-on-surface), 0.03);
}
.view-toggle .toggle-btn {
  font-weight: 500;
  letter-spacing: 0.3px;
  min-width: 90px;
  text-transform: none;
}
.view-toggle .v-btn--active {
  background: rgb(var(--v-theme-primary)) !important;
  color: #fff !important;
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.3);
}
.view-toggle .v-btn--active .v-icon {
  color: #fff !important;
}
.view-toggle .v-btn:not(.v-btn--active):hover {
  background: rgba(var(--v-theme-on-surface), 0.04);
}

</style>
