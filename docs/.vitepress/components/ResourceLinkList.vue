<script setup lang="ts">
import type { ResourceGroup } from './types'
defineProps<{ groups: ResourceGroup[] }>()
</script>

<template>
  <div v-for="(group, gi) in groups" :key="gi" class="mb-6">
    <!-- Group header -->
    <div class="d-flex align-center ga-2 mb-3">
      <div class="group-icon-badge d-flex align-center justify-center">
        <v-icon v-if="group.icon" size="14">{{ group.icon }}</v-icon>
      </div>
      <span class="text-body-2 font-weight-bold" style="letter-spacing: 0.3px; text-transform: uppercase; color: rgba(var(--v-theme-on-surface), 0.6);">{{ group.name }}</span>
    </div>

    <!-- Resource items -->
    <div class="resource-list">
      <a
        v-for="(r, i) in group.items" :key="i"
        :href="r.url" target="_blank" rel="noopener"
        class="resource-item"
      >
        <div class="resource-item-content">
          <div class="d-flex align-center ga-2 flex-wrap">
            <span class="text-body-2 font-weight-medium">{{ r.title }}</span>
            <span v-if="r.lang" class="tag" :class="r.lang === 'zh' ? 'tag-zh' : 'tag-en'">
              {{ r.lang === 'zh' ? '中文' : 'EN' }}
            </span>
            <span v-if="r.type" class="tag" :class="r.type === 'video' ? 'tag-video' : 'tag-article'">
              {{ r.type === 'video' ? '视频' : '文章' }}
            </span>
          </div>
        </div>
        <v-icon size="16" color="grey-lighten-2" class="resource-arrow">mdi-chevron-right</v-icon>
      </a>
    </div>
  </div>
</template>

<style scoped>
.group-icon-badge {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: rgba(var(--v-theme-on-surface), 0.06);
  color: rgba(var(--v-theme-on-surface), 0.5);
  flex-shrink: 0;
}

.resource-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.26) !important;
  border-radius: 10px;
  background: rgba(var(--v-theme-on-surface), 0.03);
  transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
  color: inherit;
  text-decoration: none !important;
}
.resource-item:hover {
  background: rgba(var(--v-theme-on-surface), 0.06);
  border-color: rgba(var(--v-theme-on-surface), 0.35) !important;
}
.resource-item:hover .resource-arrow { opacity: 1; }

.resource-item-content {
  flex: 1;
  min-width: 0;
}

.resource-arrow {
  opacity: 0;
  color: rgba(var(--v-theme-on-surface), 0.3);
  transition: opacity 0.15s;
}

.tag {
  font-size: 11px;
  padding: 1px 7px;
  border-radius: 4px;
  font-weight: 500;
  line-height: 1.6;
}
.tag-zh { background: rgba(22, 163, 74, 0.1); color: #16a34a; }
.tag-en { background: rgba(37, 99, 235, 0.1); color: #3b82f6; }
.tag-video { background: rgba(234, 88, 12, 0.1); color: #ea580c; }
.tag-article { background: rgba(var(--v-theme-on-surface), 0.05); color: rgba(var(--v-theme-on-surface), 0.5); border: 1px solid rgba(var(--v-theme-on-surface), 0.1); }
</style>
