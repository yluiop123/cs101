<style>
.vp-doc a{
 text-decoration: none;
}
</style>
<script setup>
import { reactive, computed } from 'vue'
import { useData } from 'vitepress'
const { isDark } = useData()
const routes = reactive([
    {
    title:'JAVA技术路线',
    items:[
      {title:'JAVA',subtitle:"AAAAAA",herf:"./route/java/java"},
      {title:'Springboot',subtitle:"AAAAAA",herf:"./route/java/java"},
      {title:'SpringCloud',subtitle:"AAAAAA",herf:"./route/java/java"},
      {title:'SpringCloudAlibaba',subtitle:"AAAAAA",herf:"./route/java/java"},
      {title:'Lombok',subtitle:"AAAAAA",herf:"./route/java/java"},
      {title:'Guava',subtitle:"AAAAAA",herf:"./route/java/java"},
      {title:'Apache-Common',subtitle:"AAAAAA",herf:"./route/java/java"},
      {title:'Maven',subtitle:"AAAAAA",herf:"./route/java/java"},
      {title:'Gradle',subtitle:"AAAAAA",herf:"./route/java/java"},
      {title:'文档处理技术',subtitle:"AAAAAA",herf:"./route/java/java"},
      {title:'lombok',subtitle:"AAAAAA",herf:"./route/java/java"}
    ]
  },{
    title:'前端技术路线',
    items:[
      {title:'Html',subtitle:"AAAAAA"},
      {title:'Css',subtitle:"AAAAAA"},
      {title:'Javascript',subtitle:"AAAAAA"},
      {title:'Vue',subtitle:"AAAAAA"},
      {title:'React',subtitle:"AAAAAA"},
      {title:'Angular',subtitle:"AAAAAA"},
      {title:'Webpack',subtitle:"AAAAAA"},
      {title:'Angular',subtitle:"AAAAAA"},
      {title:'Angular',subtitle:"AAAAAA"},
      {title:'Angular',subtitle:"AAAAAA"},
      {title:'Angular',subtitle:"AAAAAA"},
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
          :subtitle="item.subtitle"
          :title="item.title"
          :href="item.herf"
        >
        </v-card>
      </v-col>
    </v-row>
  </v-card-text>
</v-card>
