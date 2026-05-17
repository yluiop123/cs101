<script setup lang="ts">
defineProps<{
  categories: {
    name: string
    icon: string
    color?: string
    items: { title: string; url: string; desc?: string; external?: boolean }[]
  }[]
}>()
</script>

<template>
  <div class="tutorial-grid">
    <v-row>
      <v-col v-for="(cat, ci) in categories" :key="ci" cols="12" sm="6" lg="4" class="mb-2">
        <v-card variant="outlined" class="h-100 tutorial-card" color="grey">
          <div class="d-flex align-center ga-2 pt-4 pb-2 px-4">
            <v-icon :color="cat.color || 'primary'">{{ cat.icon }}</v-icon>
            <span class="text-h6 font-weight-bold">{{ cat.name }}</span>
          </div>
          <v-divider class="mx-4" />
          <v-card-text class="pa-4">
            <div v-for="(item, ii) in cat.items" :key="ii" class="mb-2">
              <a
                :href="item.url"
                :target="item.external !== false ? '_blank' : undefined"
                :rel="item.external !== false ? 'noopener' : undefined"
                class="tutorial-link text-decoration-none"
              >
                <div class="d-flex align-center ga-2">
                  <v-icon size="x-small" color="primary">mdi-book-open-variant</v-icon>
                  <span class="text-body-2 font-weight-medium">{{ item.title }}</span>
                </div>
                <div v-if="item.desc" class="text-caption text-grey mt-1" style="margin-left: 22px;">
                  {{ item.desc }}
                </div>
              </a>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.tutorial-card {
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.tutorial-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}
.tutorial-link {
  display: block;
  padding: 6px 8px;
  border-radius: 6px;
  transition: background 0.15s;
  color: inherit;
}
.tutorial-link:hover {
  background: rgba(0, 0, 0, 0.04);
}
</style>
