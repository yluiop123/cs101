<script setup>
import ContentView from '../.vitepress/components/ContentView.vue'
const data = {
  name: '软件工程',
  description: '软件工程研究如何系统化、规范化地开发和维护软件，涵盖需求分析、设计、编码、测试、部署与维护的完整生命周期。',
  items: [
    {
      name: '软件过程模型',
      children: [
        { title: '**瀑布模型**：顺序阶段、文档驱动' },
        { title: '**敏捷开发**：Scrum、Kanban、迭代增量' },
        { title: '**统一过程（RUP）**：用例驱动、架构核心' },
        { title: '**DevOps**：开发运维一体化、持续交付' },
        { title: '**极限编程（XP）**：TDD、结对编程、持续集成' },
      ],
    },
    {
      name: '需求工程',
      children: [
        { title: '**需求获取**：用户访谈、问卷调查、原型法' },
        { title: '**需求分析**：用例图、用户故事、功能/非功能需求' },
        { title: '**需求规格说明**：SRS 文档、验收标准' },
        { title: '**需求管理**：优先级划分、变更控制、追溯矩阵' },
      ],
    },
    {
      name: '软件设计',
      children: [
        { title: '**设计原则**：SOLID、DRY、KISS、YAGNI、高内聚低耦合' },
        { title: '**设计模式**：创建型、结构型、行为型（GoF 23 种）' },
        { title: '**架构风格**：分层架构、微服务、事件驱动、CQRS' },
        { title: '**UML 建模**：类图、时序图、活动图、状态图' },
        { title: '**领域驱动设计（DDD）**：限界上下文、实体、值对象、聚合' },
      ],
    },
    {
      name: '软件质量与测试',
      children: [
        { title: '**测试层次**：单元测试、集成测试、系统测试、验收测试' },
        { title: '**自动化测试**：Selenium、JUnit、Pytest、Cypress' },
        { title: '**代码审查**：Code Review 流程、静态分析、Lint' },
        { title: '**性能测试**：负载测试、压力测试、JMeter、Gatling' },
        { title: '**软件质量度量**：代码覆盖率、圈复杂度、MTBF' },
      ],
    },
    {
      name: '项目管理',
      children: [
        { title: '**项目计划**：WBS 分解、甘特图、里程碑' },
        { title: '**风险管理**：风险识别、评估、应对策略' },
        { title: '**配置管理**：版本控制、变更管理、构建管理' },
        { title: '**团队协作**：Git Flow、Code Review、沟通模型' },
        { title: '**软件估算**：功能点分析、COCOMO 模型' },
      ],
    },
  ],
  groups: [
    {
      name: '推荐资源',
      items: [
        { title: '《软件工程：实践者的研究方法》（Pressman）' },
        { title: '《人月神话》（Fred Brooks）' },
        { title: '《重构：改善既有代码的设计》（Martin Fowler）' },
      ],
    },
  ],
}
</script>
<ContentView :data="data" />
