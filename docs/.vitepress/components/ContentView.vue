<script setup lang="ts">
import { ref, watch } from 'vue'
import RoadmapDiagram from './RoadmapDiagram.vue'

interface ResourceItem { title: string; url: string; icon?: string }

interface ResourceGroup {
  name: string
  icon?: string
  items: ResourceItem[]
}

interface Item {
  title: string; description: string; optional?: boolean; note?: string; detail?: string
  groups?: ResourceGroup[]
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

function openItem(item: Item) {
  selectedItem.value = item
  drawer.value = true
}

function closeDrawer() {
  drawer.value = false
}

watch(viewMode, () => {
  closeDrawer()
})
</script>

<template>
  <div class="pa-2 pa-md-4">
    <p class="text-body-1 text-grey-darken-1 mb-4">{{ data.description }}</p>

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
        <v-btn value="document" prepend-icon="mdi-file-document-outline" class="toggle-btn" size="small">文档视图</v-btn>
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
      <div class="d-flex ga-2 mb-3" style="align-items: baseline;">
        <h2 :id="'item-' + si" class="text-h4 font-weight-bold ma-0">{{ section.name }}</h2>
        <v-chip v-if="section.subtitle" size="x-small" color="primary" variant="flat" class="font-weight-medium subtitle-chip">
          {{ section.subtitle }}
        </v-chip>
      </div>
      <p v-if="section.note" class="text-caption text-grey font-italic mb-3">{{ section.note }}</p>

      <div class="d-flex flex-column ga-1">
        <v-card
          v-for="(child, ii) in section.children" :key="ii"
          variant="outlined" color="grey"
          class="item-card"
          @click="openItem(child)"
        >
          <div class="d-flex align-center ga-3 pa-3">
            <v-icon :color="child.optional ? 'grey-lighten-1' : 'success'" size="small">
              {{ child.optional ? 'mdi-circle' : 'mdi-check-circle' }}
            </v-icon>
            <div class="flex-grow-1 min-w-0">
              <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">{{ child.title }}</div>
              <div class="text-caption text-grey mt-1 text-truncate">{{ child.description }}</div>
            </div>
            <v-icon size="small" color="grey-lighten-1" class="item-arrow">mdi-chevron-right</v-icon>
          </div>
        </v-card>
      </div>
    </div>
    </div>

    <!-- ====== DRAWER SCRIM ====== -->
    <transition name="fade">
      <div v-if="drawer" class="drawer-scrim" @click="closeDrawer" />
    </transition>

    <!-- ====== RIGHT-SIDE DRAWER ====== -->
    <transition name="slide">
      <div v-if="drawer" class="drawer-wrapper">
        <v-card class="drawer-card" elevation="4">
          <div class="d-flex align-center justify-space-between px-6 pt-5 pb-0">
            <span class="text-truncate pr-2" v-if="selectedItem">
              <v-icon :color="selectedItem.optional ? 'grey-lighten-1' : 'success'" size="small" class="mr-1">
                {{ selectedItem.optional ? 'mdi-circle' : 'mdi-check-circle' }}
              </v-icon>
              <span class="text-subtitle-1 font-weight-bold">{{ selectedItem.title }}</span>
            </span>
            <v-btn icon="mdi-close" variant="text" size="small" color="grey" class="flex-shrink-0" @click="closeDrawer" />
          </div>
          <v-divider class="ma-4" />

          <div class="px-6 pb-6 drawer-body" v-if="selectedItem">
            <p class="text-body-1 mb-4">{{ selectedItem.description }}</p>

            <v-alert
              v-if="selectedItem.detail"
              variant="tonal" color="info" class="mb-4"
              style="white-space: pre-wrap;"
              icon="mdi-information"
            >{{ selectedItem.detail }}</v-alert>

            <v-alert
              v-if="selectedItem.note"
              variant="tonal" color="warning" class="mb-4"
              style="white-space: pre-wrap;"
              icon="mdi-alert"
            >{{ selectedItem.note }}</v-alert>

            <div v-if="selectedItem.groups?.length" class="mb-4">
              <div v-for="(group, gi) in selectedItem.groups" :key="gi" class="mb-4">
                <div class="d-flex align-center ga-2 mb-1">
                  <v-icon v-if="group.icon" size="small" color="grey-darken-1">{{ group.icon }}</v-icon>
                  <span class="text-subtitle-2 font-weight-bold text-grey-darken-2">{{ group.name }}</span>
                </div>
                <v-list lines="one" class="bg-transparent">
                  <v-list-item
                    v-for="(r, i) in group.items" :key="i"
                    :href="r.url" target="_blank" rel="noopener"
                    :title="r.title"
                    :prepend-icon="r.icon || 'mdi-link-variant'"
                    color="primary"
                  />
                </v-list>
              </div>
            </div>
          </div>
        </v-card>
      </div>
    </transition>
  </div>
</template>

<style>
.drawer-scrim {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
}
.drawer-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  width: 50vw;
  max-width: 680px;
  height: 100vh;
  z-index: 1001;
}
.drawer-wrapper .v-card.drawer-card {
  height: 100vh;
  border-radius: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.drawer-wrapper .drawer-body {
  flex: 1;
  overflow-y: auto;
}
@media (max-width: 768px) {
  .drawer-wrapper {
    width: 100vw;
    max-width: 100vw;
  }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.25s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>

<style scoped>
.item-card { cursor: pointer !important; transition: all 0.15s !important; }
.item-card:hover { border-color: rgb(var(--v-theme-primary)) !important; }
.item-card:hover .item-arrow { opacity: 0.8; }
.item-card--no-click { cursor: default !important; }
.item-arrow { opacity: 0.4; transition: opacity 0.15s; }

.view-toggle {
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: #f8f9fa;
}
.view-toggle .toggle-btn {
  font-weight: 500;
  letter-spacing: 0.3px;
  min-width: 100px;
}
.view-toggle .v-btn--active {
  background: rgb(var(--v-theme-primary)) !important;
  color: #fff !important;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
}
.view-toggle .v-btn--active .v-icon {
  color: #fff !important;
}

</style>
