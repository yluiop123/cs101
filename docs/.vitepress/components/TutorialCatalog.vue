<script setup lang="ts">
import { withBase } from 'vitepress'
import { tutorialSeries } from '../tutorial-meta'

function tutorialUrl(slug: string): string {
  return withBase(`/tutorials/${slug}/`)
}
</script>

<template>
  <div class="tutorial-catalog">
    <section
      v-for="s in tutorialSeries"
      :id="s.id"
      :key="s.id"
      class="tutorial-section"
    >
      <!-- Section Header -->
      <div class="section-header d-flex align-center ga-3 mb-3">
        <div
          class="icon-circle d-flex align-center justify-center mt-2"
          :style="{ background: s.color + '18', color: s.color }"
        >
          <v-icon :icon="s.icon" size="20" />
        </div>
        <h2
          class="text-h5 font-weight-bold ma-0 d-flex align-center"
          :style="{ color: s.color, lineHeight: '32px', marginTop: '0px', border: '0px' }"
        >
          {{ s.title }}
        </h2>
      </div>

      <!-- Card Grid -->
      <v-row>
        <v-col v-for="t in s.tutorials" :key="t.slug" cols="12" sm="6" md="4">
          <v-card
            v-if="t.status !== 'planned'"
            class="tutorial-card"
            flat
            :href="tutorialUrl(t.slug)"
            :style="{
              borderLeft: '4px solid ' + s.color,
              borderRadius: '8px',
              cursor: 'pointer',
            }"
          >
            <v-card-text class="pa-4">
              <div class="d-flex align-center ga-2 mb-1">
                <div
                  class="card-icon-circle d-flex align-center justify-center flex-shrink-0"
                  :style="{ background: s.color + '18', color: s.color, width: '28px', height: '28px', borderRadius: '6px' }"
                >
                  <v-icon size="16">mdi-book-open-variant</v-icon>
                </div>
                <span class="text-subtitle-2 font-weight-bold">{{ t.title }}</span>
              </div>
            </v-card-text>
          </v-card>
          <v-card
            v-else
            class="tutorial-card tutorial-card-disabled"
            flat
            :style="{
              borderLeft: '4px solid ' + s.color,
              borderRadius: '8px',
            }"
          >
            <v-card-text class="pa-4">
              <div class="d-flex align-center ga-2 mb-1">
                <div
                  class="card-icon-circle d-flex align-center justify-center flex-shrink-0"
                  :style="{ background: s.color + '18', color: s.color, width: '28px', height: '28px', borderRadius: '6px' }"
                >
                  <v-icon size="16">mdi-book-open-variant</v-icon>
                </div>
                <span class="text-subtitle-2 font-weight-bold">{{ t.title }}</span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </section>
  </div>
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
.tutorial-card-disabled {
  opacity: 0.62;
}
</style>
