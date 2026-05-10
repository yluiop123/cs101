<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: '计算机图形学',
  description: '计算机图形学研究如何利用计算机生成、处理和显示图像，是游戏开发、影视特效、VR/AR、可视化等领域的核心技术。',
  items: [
    {
      name: '图形学基础',
      children: [
        { title: '**坐标系统**：模型坐标、世界坐标、视图坐标、投影坐标' },
        { title: '**基本图元**：点、线、三角形、多边形、网格' },
        { title: '**变换**：平移/旋转/缩放、齐次坐标、变换矩阵' },
        { title: '**光栅化**：线段绘制（Bresenham）、三角形填充、抗锯齿' },
        { title: '**裁剪**：Cohen-Sutherland 线段裁剪、Sutherland-Hodgman 多边形裁剪' },
      ],
    },
    {
      name: '光照与着色',
      children: [
        { title: '**颜色模型**：RGB、HSV、CIE XYZ、色彩空间转换' },
        { title: '**光照模型**：Phong 反射模型、Blinn-Phong、环境光照' },
        { title: '**着色方法**：Flat Shading、Gouraud Shading、Phong Shading' },
        { title: '**纹理映射**：UV 映射、纹理采样、Mipmap、凹凸映射' },
        { title: '**阴影**：Shadow Mapping、阴影体、PCF 软阴影' },
      ],
    },
    {
      name: '渲染管线',
      children: [
        { title: '**固定管线 vs 可编程管线**' },
        { title: '**顶点着色器**：顶点变换、蒙皮、变形' },
        { title: '**片元着色器**：逐像素光照、纹理、颜色输出' },
        { title: '**几何着色器与曲面细分**' },
        { title: '**计算着色器**：通用 GPU 计算（GPGPU）' },
      ],
    },
    {
      name: '三维几何与建模',
      children: [
        { title: '**曲线与曲面**：Bezier 曲线、B 样条、NURBS' },
        { title: '**多边形网格**：半边数据结构、网格简化（Decimation）' },
        { title: '**隐式曲面与距离场**' },
        { title: '**点云与体素表示**' },
      ],
    },
    {
      name: '高级主题',
      children: [
        { title: '**光线追踪**：Ray-Surface 求交、BVH 加速、蒙特卡洛路径追踪' },
        { title: '**全局光照**：光子映射、辐射度方法、实时全局光照' },
        { title: '**物理模拟**：刚体动力学、布料模拟、流体模拟（SPH）' },
        { title: '**实时渲染**：延迟着色、GPU 管线优化、TAA' },
        { title: '**WebGPU / Three.js / OpenGL**：图形 API 与框架实践' },
      ],
    },
  ],
  groups: [
    {
      name: '推荐资源',
      items: [
        { title: '《计算机图形学》（Fundamentals of Computer Graphics）' },
        { title: '《Real-Time Rendering》（第四版）' },
        { title: '《Ray Tracing in One Weekend》' },
        { title: 'LearnOpenGL（learnopengl-cn.github.io）' },
      ],
    },
  ],
}
</script>
<ContentView :data="data" />
