<script setup lang="ts">
import { computed, ref } from 'vue';
import DetailDrawer from './DetailDrawer.vue';
import type { DrawerItem, CardItem } from './types';

const props = defineProps<{
  id: string
  title: string
  icon: string
  color: string
  items: CardItem[]
}>()

const selectedItem = ref<CardItem | null>(null)
const drawer = ref(false)

const drawerItem = computed<DrawerItem | null>(() => {
  if (!selectedItem.value) return null
  return {
    title: selectedItem.value.title,

    resources: selectedItem.value.resources,
  }
})

function openItem(item: CardItem) {
  selectedItem.value = item
  drawer.value = true
}
</script>

<template>
  <section :id="id" class="tutorial-section">
    <!-- Section Header -->
    <div class="section-header d-flex align-center ga-3 mb-3">
      <div class="icon-circle d-flex align-center justify-center mt-2" :style="{ background: color + '18', color: color }">
        <v-icon :icon="icon" size="20" />
      </div>
      <h2 class="text-h5 font-weight-bold ma-0 d-flex align-center" :style="{ color: color, lineHeight: '32px',marginTop:'0px',border:'0px' }">{{ title }}</h2>
    </div>

    <!-- Card Grid -->
    <v-row>
      <v-col v-for="(item, i) in items" :key="i" cols="12" sm="6" md="4">
        <v-card
          class="tutorial-card"
          flat
          @click="openItem(item)"
          :style="{
            borderLeft: '4px solid ' + color,
            borderRadius: '8px',
            cursor: 'pointer',
          }"
        >
          <v-card-text class="pa-4">
            <div class="d-flex align-center ga-2 mb-1">
              <div
                class="card-icon-circle d-flex align-center justify-center flex-shrink-0"
                :style="{ background: color + '18', color: color, width: '28px', height: '28px', borderRadius: '6px' }"
              >
                <v-icon size="16">mdi-book-open-variant</v-icon>
              </div>
              <span class="text-subtitle-2 font-weight-bold">{{ item.title }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- ====== RIGHT-SIDE DRAWER ====== -->
    <DetailDrawer v-model="drawer" :item="drawerItem" />
  </section>
</template>

<style scoped>
.tutorial-section {
  margin-bottom: 32px;
  scroll-margin-top: 80px;
}
.icon-circle {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  flex-shrink: 0;
}
.tutorial-card {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  height: 100%;
}
.tutorial-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border-color: transparent;
}
.section-header {
  scroll-margin-top: 80px;
}
.visit-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.3px;
}
.visit-btn:hover {
  opacity: 0.92;
}
</style>
