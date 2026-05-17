<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import RoadmapDiagram from './RoadmapDiagram.vue'
import DetailDrawer from './DetailDrawer.vue'
import type { ResourceGroup } from './types'

interface Item {
  title: string; description: string; optional?: boolean
  resources?: ResourceGroup[]
}

interface ItemSection { name: string; subtitle?: string; note?: string; children: Item[] }
interface DetailData {
  name: string; description: string
  items: ItemSection[]
}

const props = defineProps<{ data: DetailData }>()

const selectedItem = ref<Item | null>(null)
const drawer = ref(false)
const viewMode = ref<'document' | 'roadmap'>('document')
const activeSection = ref<number | null>(null)

function openItem(item: Item) {
  selectedItem.value = item
  drawer.value = true
  const idx = props.data.items.findIndex(s => s.children.includes(item))
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
        <RoadmapDiagram :sections="data.items" :topic-name="data.name" @item-click="openItem" />
      </ClientOnly>
    </div>

    <!-- 文档内容 -->
    <div v-show="viewMode === 'document'">
    <div v-for="(section, si) in data.items" :key="si" class="mb-6">
      <div class="d-flex align-center ga-2 mb-3">
        <h2 :id="'item-' + si" class="text-h5 font-weight-bold ma-0">
          {{ section.name }}
        </h2>
        <v-chip v-if="section.subtitle" size="x-small" color="primary" variant="flat" class="font-weight-medium">
          {{ section.subtitle }}
        </v-chip>
      </div>
      <p v-if="section.note" class="text-caption font-italic mb-3" style="color: rgba(var(--v-theme-on-surface), 0.5);">{{ section.note }}</p>

      <div class="d-flex flex-column ga-2">
        <v-card
          v-for="(child, ii) in section.children" :key="ii"
          rounded="lg"
          variant="flat"
          class="item-card"
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
      </div>
    </div>
    </div>

    <!-- ====== RIGHT-SIDE DRAWER ====== -->
    <DetailDrawer v-model="drawer" :item="selectedItem" />
  </div>
</template>

<style scoped>
.item-card {
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08) !important;
}
.item-card:hover {
  border-color: rgb(var(--v-theme-primary)) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06) !important;
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
