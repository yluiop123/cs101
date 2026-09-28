<script setup lang="ts">
import { withBase } from 'vitepress'

interface TechCard { title: string; url: string }
interface TechGroup { name: string; color: string; items: TechCard[] }

const groups: TechGroup[] = [
  {
    name: '编程语言',
    color: '#2563eb',
    items: [
      { title: 'Java', url: '/tutorials/java/' },
      { title: 'Python', url: '/tutorials/python/' },
      { title: 'Go', url: '/tutorials/go/' },
      { title: 'Rust', url: '/tutorials/rust/' },
      { title: 'JavaScript / TypeScript', url: '/tech-stack/javascript-typescript' },
      { title: 'Web 前端', url: '/tech-stack/frontend' },
      { title: 'C / C++', url: '/tech-stack/c-cpp' },
      { title: 'C#', url: '/tech-stack/c-sharp' },
      { title: 'Kotlin / Swift / Dart', url: '/tech-stack/kotlin-swift-dart' },
    ],
  },
  {
    name: '数据库',
    color: '#336791',
    items: [
      { title: 'SQL 与关系型数据库', url: '/tech-stack/sql-database' },
      { title: 'MySQL', url: '/tech-stack/mysql' },
      { title: 'PostgreSQL', url: '/tech-stack/postgresql' },
      { title: 'Redis', url: '/tech-stack/redis' },
      { title: 'MongoDB', url: '/tech-stack/mongodb' },
      { title: 'Elasticsearch', url: '/tech-stack/elasticsearch' },
    ],
  },
  {
    name: '中间件',
    color: '#d97706',
    items: [
      { title: 'Kafka / 消息队列', url: '/tech-stack/kafka' },
      { title: 'Nginx', url: '/tech-stack/nginx' },
    ],
  },
  {
    name: '运维与云',
    color: '#0ea5e9',
    items: [
      { title: 'Docker', url: '/tech-stack/docker' },
      { title: 'Kubernetes', url: '/tech-stack/kubernetes' },
    ],
  },
]

const href = (url: string) => withBase(url)
</script>

<template>
  <div>
    <section v-for="g in groups" :key="g.name" class="tech-group">
      <h2 class="text-h5 font-weight-bold mb-3" :style="{ color: g.color, lineHeight: '32px' }">{{ g.name }}</h2>
      <v-row>
        <v-col v-for="t in g.items" :key="t.title" cols="12" sm="6" md="4">
          <v-card
            class="tech-card"
            flat
            :href="href(t.url)"
            :style="{ borderLeft: '4px solid ' + g.color, borderRadius: '8px' }"
          >
            <v-card-text class="pa-4 d-flex align-center ga-2">
              <v-icon size="16" :style="{ color: g.color }">mdi-book-open-variant</v-icon>
              <span class="text-subtitle-2 font-weight-bold">{{ t.title }}</span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </section>
  </div>
</template>

<style scoped>
.tech-group {
  margin-bottom: 32px;
}
.tech-card {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  height: 100%;
  cursor: pointer;
}
.tech-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border-color: transparent;
}
</style>
