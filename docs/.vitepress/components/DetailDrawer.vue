<script setup lang="ts">
import { computed } from 'vue'
import ResourceLinkList from './ResourceLinkList.vue'
import type { DrawerItem } from './types'

const props = defineProps<{
  modelValue: boolean
  item: DrawerItem | null
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

const drawerModel = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
})
</script>

<template>
  <transition name="fade">
    <div v-if="modelValue" class="drawer-scrim" @click="drawerModel = false" />
  </transition>

  <transition name="slide">
    <div v-if="modelValue" class="drawer-wrapper">
      <div class="drawer-card">
        <!-- Header -->
        <div class="drawer-header d-flex align-center justify-space-between">
          <div class="d-flex align-center ga-3 text-truncate" v-if="item">
            <v-chip v-if="item.optional" size="x-small" color="grey" variant="tonal" class="font-weight-medium" style="font-size: 11px;">选修</v-chip>
            <v-chip v-else size="x-small" color="primary" variant="flat" class="font-weight-medium" style="font-size: 11px;">必修</v-chip>
            <span class="text-h6 font-weight-bold text-truncate">{{ item.title }}</span>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" color="grey" class="flex-shrink-0" @click="drawerModel = false" />
        </div>

        <v-divider />

        <div class="drawer-body">
          <div v-if="item">
            <div v-if="item.description" class="description-card">
              <p class="text-body-2 mb-0" style="color: rgba(var(--v-theme-on-surface), 0.7); line-height: 1.7;">{{ item.description }}</p>
            </div>

            <ResourceLinkList v-if="item.groups?.length" :groups="item.groups" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style>
.drawer-scrim {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  z-index: 1000;
}

.drawer-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  width: 46vw;
  max-width: 620px;
  height: 100vh;
  z-index: 1001;
}

.drawer-card {
  height: 100vh;
  background: rgb(var(--v-theme-surface));
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.drawer-header {
  padding: 20px 24px 16px;
  flex-shrink: 0;
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px 32px;
}

.description-card {
  background: rgba(var(--v-theme-on-surface), 0.03);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 10px;
  padding: 16px 18px;
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .drawer-wrapper { width: 100vw; max-width: 100vw; }
  .drawer-header { padding: 16px; }
  .drawer-body { padding: 16px; }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
