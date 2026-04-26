<style>
</style>
<script setup>
import { reactive, computed } from 'vue'
import { useData } from 'vitepress'
const { isDark } = useData()
const routes = reactive([
    {
    title:'JAVA技术路线',
    items:[
      {title:'JAVA',herf:"./route/java/java"},
      {title:'Springboot',herf:"./route/java/java"},
      {title:'SpringCloud',herf:"./route/java/java"},
      {title:'SpringCloudAlibaba',herf:"./route/java/java"},
      {title:'Lombok',herf:"./route/java/java"},
      {title:'Guava',herf:"./route/java/java"},
      {title:'Apache-Common',herf:"./route/java/java"},
      {title:'Maven',herf:"./route/java/java"},
      {title:'Gradle',herf:"./route/java/java"},
      {title:'lombok',herf:"./route/java/java"},
      {title:'POI',herf:"./route/java/java"},
    ]
  },{
    title:'Python技术路线',
    items:[
      {title:'Python'},
      {title:'FastAPI'},
      {title:'NumPy'},
      {title:'Pandas'},
      {title:'SciPy'},
      {title:'Polars'},
      {title:'LangChain'},
      {title:'Matplotlib'},
      {title:'Playwright'},
      {title:'Scrapy'},
      {title:'Netmiko'},
    ]
  },{
    title:'GO技术路线',
    items:[
      {title:'GO'},
      {title:'Gin'},
      {title:'GORM'},
      {title:'go-redis'},
      {title:'SciPy'},
      {title:'Polars'},
      {title:'LangChain'},
      {title:'Matplotlib'},
      {title:'Playwright'},
      {title:'Scrapy'},
      {title:'Netmiko'},
    ]
  },{
    title:'前端技术路线',
    items:[
      {title:'Html'},
      {title:'Css'},
      {title:'Javascript'},
      {title:'Vue'},
      {title:'React'},
      {title:'Angular'},
      {title:'Vite'},
      {title:'Nest'},
      {title:'Next'},
      {title:'Nuxt'},
      {title:'Angular'},
    ]
  }])

// 一个计算属性 ref
const colorTheme = computed(() => {
  return isDark.value ? 
  {
    color:'#000000',
    subColor:'#5672cd'
  } 
  : 
  {
    color:'white',
    subColor:'#5672cd'
  }
})

function goHerf(herf) {
  location.href = herf;
}
</script>
<v-card 
  width="100%"
  v-for="(route, i) in routes"
  :color="colorTheme.color" >
  <v-card-title class="text-h6 text-md-h5 text-lg-h4">{{route.title}}</v-card-title>
  <v-card-text>
    <v-row dense>
      <v-col
        v-for="(item, i) in route.items"
        :key="i"
        cols="12"
        md="4"
      >
        <v-card
          class="mx-auto text-center"
          rel="noopener"
          :color="colorTheme.subColor"
          :title="item.title"
          @click="goHerf(item.herf)"
        >
        </v-card>
      </v-col>
    </v-row>
  </v-card-text>
</v-card>
