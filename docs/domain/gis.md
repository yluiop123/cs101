<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: 'GIS 技术路线',
  description: '地理信息系统（GIS）整合了空间数据采集、存储、处理、分析与可视化全流程，覆盖 Web、移动端、桌面端、服务端等全平台应用，广泛应用于智慧城市、自然资源管理、物流调度、军事国防等领域。',

  items: [
    {
      name: 'GIS 基础与空间数据',
      subtitle: '必修',
      children: [
        {
          title: 'GIS 基本概念',
          description: '坐标系（WGS84 / CGCS2000）、地图投影（墨卡托 / 高斯-克吕格）、比例尺与分辨率',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "尚硅谷 GIS 基础教程", url: "https://www.bilibili.com/video/BV1fA411i7hX", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "GIS 基础知识", url: "https://www.dsac.cn/DataProduct/Index/detail?id=38", icon: "mdi-file-document-outline" },
                { title: "OGC Standards", url: "https://www.ogc.org/standards/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '空间数据模型',
          description: '矢量数据（点/线/面）与栅格数据（DEM / 遥感影像）、矢量瓦片',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Spatial Data Models", url: "https://desktop.arcgis.com/en/arcmap/latest/manage-data/geodatabases/types-of-geodatabases.htm", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '常见数据格式',
          description: 'GeoJSON / Shapefile / GeoTIFF / MVT / GPKG / KML / GML',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "GeoJSON 规范", url: "https://geojson.org/", icon: "mdi-file-document-outline" },
                { title: "Mapbox Vector Tile Spec", url: "https://docs.mapbox.com/vector-tiles/specification/", icon: "mdi-file-document-outline" },
                { title: "GeoPackage 标准", url: "https://www.geopackage.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '地图服务协议',
          description: 'WMS / WMTS / WFS / WCS / TMS / OGC API Features',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "OGC Web 服务", url: "https://www.osgeo.cn/", icon: "mdi-file-document-outline" },
                { title: "OGC API 标准", url: "https://ogcapi.ogc.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '坐标系统与投影转换',
          description: 'Proj.4 / EPSG 注册库、动态投影、坐标系转换参数',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "EPSG 地理参数集", url: "https://epsg.io/", icon: "mdi-file-document-outline" },
                { title: "Proj.4 文档", url: "https://proj.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: 'Web 地图开发',
      subtitle: '必修',
      children: [
        {
          title: 'Leaflet',
          description: '轻量级地图库入门，支持瓦片地图、标记、弹窗、GeoJSON 加载、插件体系',
          resources: [
            {
              name: "视频教程",
              icon: "mdi-play-circle-outline",
              items: [
                { title: "Leaflet 实战", url: "https://www.bilibili.com/video/BV1jY411p7Q8", icon: "mdi-play-circle-outline" }
              ],
            },
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Leaflet 官方教程", url: "https://leafletjs.com/examples.html", icon: "mdi-file-document-outline" },
                { title: "Leaflet 中文文档", url: "https://leafletjs.cn/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'OpenLayers',
          description: '功能全面的地图库，支持多源数据加载、地图控件、空间查询、矢量编辑',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "OpenLayers 官方示例", url: "https://openlayers.org/en/latest/examples/", icon: "mdi-file-document-outline" },
                { title: "OpenLayers API", url: "https://openlayers.org/en/latest/apidoc/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Mapbox GL JS',
          description: '矢量瓦片渲染引擎，Mapbox Studio 样式定制，表达式语法',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Mapbox GL 文档", url: "https://docs.mapbox.com/mapbox-gl-js/", icon: "mdi-file-document-outline" },
                { title: "Mapbox 中国教程", url: "https://docs.mapbox.cn/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '地图交互与可视化',
          description: '缩放平移、点击查询、绘制编辑、热力图、聚类图、轨迹动画',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Leaflet 交互教程", url: "https://leafletjs.com/examples/choropleth/", icon: "mdi-file-document-outline" },
                { title: "Turf.js 空间分析库", url: "https://turfjs.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '前端地图框架设计',
          description: 'React / Vue 地图组件封装、状态管理、分层架构',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "React-Leaflet", url: "https://react-leaflet.js.org/", icon: "mdi-file-document-outline" },
                { title: "Vue Leaflet", url: "https://github.com/vue-leaflet/vue-leaflet", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Cesium 三维地球',
          description: '三维场景、相机控制、影像与地形图层、3D Tiles 加载',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Cesium 官方文档", url: "https://cesium.com/learn/", icon: "mdi-file-document-outline" },
                { title: "Cesium 入门教程", url: "https://www.cnblogs.com/cesium/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '空间数据库与服务端',
      subtitle: '必修',
      children: [
        {
          title: 'PostgreSQL + PostGIS',
          description: '空间数据类型、空间索引（GIST）、空间查询函数（ST_Within / ST_Buffer / ST_Intersects）',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "PostGIS 官方文档", url: "https://postgis.net/documentation/", icon: "mdi-file-document-outline" },
                { title: "PostGIS 中文教程", url: "https://www.bookstack.cn/read/postgis-cn/README.md", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'GeoServer',
          description: '数据发布、样式配置（SLD）、图层组、WMS/WFS/WMTS 服务',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "GeoServer 用户手册", url: "https://docs.geoserver.org/", icon: "mdi-file-document-outline" },
                { title: "GeoServer REST API", url: "https://docs.geoserver.org/latest/en/user/rest/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '服务端 GIS 开发',
          description: 'Python（GeoDjango / Shapely / Fiona）、Node.js（Turf.js / Terraformer）、Java（GeoTools）',
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "GeoDjango 文档", url: "https://docs.djangoproject.com/en/stable/ref/contrib/gis/", icon: "mdi-file-document-outline" },
                { title: "Shapely 文档", url: "https://shapely.readthedocs.io/", icon: "mdi-file-document-outline" },
                { title: "GeoTools 文档", url: "https://docs.geotools.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'MongoDB 地理空间查询',
          description: 'GeoJSON 存储、2dsphere 索引、地理空间聚合管道',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MongoDB 空间查询", url: "https://www.mongodb.com/docs/manual/geospatial-queries/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'GIS Web API 设计',
          description: 'RESTful 空间数据接口、矢量瓦片服务、OGC API 实现',
          optional: true,
        },
      ],
    },
    {
      name: '移动端 GIS',
      subtitle: '选修',
      children: [
        {
          title: 'Android 地图 SDK',
          description: 'Mapbox Android SDK / ArcGIS Runtime SDK for Android / 高德地图 SDK',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Mapbox Android 文档", url: "https://docs.mapbox.com/android/", icon: "mdi-file-document-outline" },
                { title: "ArcGIS Android SDK", url: "https://developers.arcgis.com/android/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'iOS 地图开发',
          description: 'MapKit / ArcGIS Runtime SDK for iOS / Mapbox iOS SDK',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Apple MapKit 文档", url: "https://developer.apple.com/documentation/mapkit/", icon: "mdi-file-document-outline" },
                { title: "Mapbox iOS SDK", url: "https://docs.mapbox.com/ios/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '跨平台地图方案',
          description: 'Flutter（flutter_map / Mapbox GL）、React Native（react-native-maps）',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Flutter Map 插件", url: "https://docs.fleaflet.dev/", icon: "mdi-file-document-outline" },
                { title: "React Native Maps", url: "https://github.com/react-native-maps/react-native-maps", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '离线地图与室内定位',
          description: '离线瓦片缓存、MBTiles 格式、室内定位技术（WiFi / 蓝牙 / UWB）',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "MBTiles 规范", url: "https://github.com/mapbox/mbtiles-spec", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'GPS / GNSS 数据采集',
          description: 'NMEA 协议解析、RTK 高精度定位、移动端轨迹记录',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "NMEA 0183 协议", url: "https://www.nmea.org/", icon: "mdi-file-document-outline" },
                { title: "RTK 定位原理", url: "https://en.wikipedia.org/wiki/Real-time_kinematic_positioning", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
      ],
    },
    {
      name: '桌面客户端 GIS 开发',
      subtitle: '选修',
      children: [
        {
          title: 'Qt / C++ 桌面 GIS 开发',
          description: 'Qt Widgets / QML 界面、Qt 地图模块、OpenGL 集成、自定义地图控件、QGIS 源码架构分析',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Qt 官方文档", url: "https://doc.qt.io/", icon: "mdi-file-document-outline" },
                { title: "QGIS 源码架构", url: "https://github.com/qgis/QGIS", icon: "mdi-file-document-outline" },
                { title: "Qt Charts & GIS", url: "https://doc.qt.io/qt-6/qtcharts-index.html", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '.NET / WPF 桌面 GIS',
          description: 'ArcGIS Runtime SDK for .NET / WPF MapControl、MVVM 架构、矢量与栅格渲染、桌面制图工具开发',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "ArcGIS Runtime .NET", url: "https://developers.arcgis.com/net/", icon: "mdi-file-document-outline" },
                { title: "WPF 官方文档", url: "https://learn.microsoft.com/en-us/dotnet/desktop/wpf/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Java 桌面 GIS',
          description: 'GeoTools 桌面开发、JMapFrame、JavaFX 地图集成、Swing 地图控件、uDig 框架',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "GeoTools 桌面开发", url: "https://docs.geotools.org/latest/userguide/", icon: "mdi-file-document-outline" },
                { title: "JavaFX 地图示例", url: "https://github.com/mapsforge/mapsforge", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Electron 跨平台桌面地图',
          description: 'Web 技术构建桌面 GIS、Electron + Leaflet/Mapbox、Node.js 本地文件读写、系统托盘与原生菜单',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Electron 文档", url: "https://www.electronjs.org/docs", icon: "mdi-file-document-outline" },
                { title: "electron-vite 构建", url: "https://electron-vite.org/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '桌面 GIS 架构设计',
          description: '插件化架构（Plugin）、图层管理、多线程渲染、本地空间数据引擎、SQLite/SpatiaLite 集成',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "SpatiaLite 文档", url: "https://www.gaia-gis.it/gaia-sins/", icon: "mdi-file-document-outline" },
                { title: "桌面 GIS 设计模式", url: "https://www.ogc.org/standard/geopackage/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '跨平台 GIS 框架对比',
          description: 'Qt vs .NET MAUI vs JavaFX vs Electron，选型策略与性能对比',
          optional: true,
        },
      ],
    },
    {
      name: '三维可视化与高级应用',
      subtitle: '选修',
      children: [
        {
          title: 'Cesium 深入进阶',
          description: '3D Tiles 规范与处理、CZML 动态实体、时间序列可视化、地形编辑',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Cesium 3D Tiles 文档", url: "https://cesium.com/learn/3d-tiles/", icon: "mdi-file-document-outline" },
                { title: "CZML 规范", url: "https://github.com/AnalyticalGraphicsInc/czml-writer/wiki/CZML-Guide", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'Three.js GIS 集成',
          description: '自定义 3D 场景、地球渲染、BIM 模型展示、建筑白模',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Three.js 官方文档", url: "https://threejs.org/docs/", icon: "mdi-file-document-outline" },
                { title: "Three.js 入门教程", url: "https://threejs.org/manual/#zh/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'WebGL / WebGPU 渲染',
          description: '高性能地图渲染原理、着色器编程、GPU 加速',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "WebGL 基础教程", url: "https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '空间分析与 GIS 算法',
          description: '缓冲区分析、叠加分析、路径分析、泰森多边形、空间插值',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Turf.js 空间分析", url: "https://turfjs.org/docs/#buffer", icon: "mdi-file-document-outline" },
                { title: "JTS / GEOS", url: "https://github.com/locationtech/jts", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: '智慧城市与 IoT 融合',
          description: '倾斜摄影、BIM+GIS、IoT 传感器数据可视化、数字孪生',
          optional: true,
          resources: [
            {
              name: "官方文档",
              icon: "mdi-file-document-outline",
              items: [
                { title: "Cesium IoT 集成", url: "https://cesium.com/learn/cesiumjs-learn/cesiumjs-real-time-data/", icon: "mdi-file-document-outline" }
              ],
            }
          ]
        },
        {
          title: 'WebGIS 安全与性能',
          description: '瓦片缓存策略、CDN 加速、服务鉴权、跨域配置',
          optional: true,
        },
      ],
    },
  ],
}
</script>
<ContentView :data="data" />
