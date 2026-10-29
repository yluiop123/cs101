// 业务系统：同样使用统一的路线模型 —— 一个分类 = 一个分节，一条 = 一套业务系统教程。
// 系统说明（summary）写在条目上，分类共用的技术栈入口（related）写在分节上；
// 章节正文由 BizSystemChapter.astro 按这里的数据渲染，系统文字只维护这一份。

import { normalizeItem, type RouteItem, type RouteTier } from '@/data/route-model';

export const businessCatalog: RouteTier[] = [
  {
    id: "erp",
    name: "通用企业管理系统",
    related: [
      { title: "Java 技术路线", href: "/tech-stack/java/" },
      { title: "数据库技术路线", href: "/tech-stack/sql-database/" },
      { title: "数据可视化与大屏", href: "/domain/visualization/" },
    ],
    items: [
      {
        slug: "erp",
        kind: 'business',
        title: "ERP 企业资源计划",
        summary: "把财务、采购、库存、生产、人力等核心资源放在同一数据底座上打通，实现「一套账、一条流程」。它不只是记账工具，而是企业运营的中央技术 backbone：统一主数据、规范业务流程、支撑跨部门协同，并为经营决策提供一致的数据口径。",
      },
      {
        slug: "crm",
        kind: 'business',
        title: "CRM 客户关系管理",
        summary: "管理从线索、商机、合同、回款到售后服务的客户全生命周期，把销售过程标准化、客户数据资产化。核心价值是让企业看清「客户是谁、处在哪个阶段、下一步该做什么」，从而提升赢单率、缩短销售周期、降低客户流失。",
      },
      {
        slug: "hrm",
        kind: 'business',
        title: "HRM / HCM 人力资源管理",
        summary: "覆盖组织编制、入转调离、薪酬核算、考勤排班、绩效评估、招聘与人才发展。它既处理高频事务性人事工作，也承载战略性人力规划；对权限隔离、敏感字段脱敏、跨法人多组织支持有较高要求。",
      },
      {
        slug: "fms",
        kind: 'business',
        title: "FMS 财务管理",
        summary: "负责总账、应收应付、资金管理、税务、财务报表与合规。它是企业财务治理与审计追踪的底座，强调职责分离、凭证可追溯、账务强一致；对外通过 API 或事件与业务系统对账，确保「业务发生即财务可见」。",
      },
      {
        slug: "oa",
        kind: 'business',
        title: "OA 协同办公系统",
        summary: "承载审批流、公文流转、知识库、日程、消息通知与协同工作。核心是把分散的人、事、流程串起来，让组织内部的请求、审批、知会、归档有统一入口和可追踪的状态。",
      },
      {
        slug: "ppm",
        kind: 'business',
        title: "PPM 项目与项目组合管理",
        summary: "覆盖项目立项、计划、任务分解、资源分配、工时、成本与组合优先级。它回答「做什么项目、谁来做、花多少、什么时候完成」，并与 HRM 的工时、FMS 的成本形成闭环。",
      },
      {
        slug: "contract-legal",
        kind: 'business',
        title: "合同与法务管理",
        summary: "管理合同起草、审批、签署、履约跟踪、变更与法务案件。核心价值是把合同从「文档」变成「可执行、可追踪、可审计的业务对象」，降低法律风险与履约风险。",
      },
      {
        slug: "bi",
        kind: 'business',
        title: "BI 商业智能与数据可视化",
        summary: "把业务数据转化为指标、报表和可视化看板，支撑经营决策。它不只是「画图」，而是包含数据接入、语义层统一指标口径、分析与可视化呈现的完整链路，让不同角色看到一致、可信、可下钻的数据。",
      },
      {
        slug: "data-platform",
        kind: 'business',
        title: "数据中台 / 业务中台",
        summary: "把跨系统的共享数据与业务能力沉淀为可复用资产，避免每个前台重复建设。数据中台侧重数据资产化、指标治理与标签体系；业务中台侧重把订单、库存、用户等通用能力服务化，供多前端、多渠道复用。",
      },
      {
        slug: "lowcode",
        kind: 'business',
        title: "低代码 / 无代码平台",
        summary: "通过可视化建模快速构建表单、流程和轻应用，降低交付门槛。核心是把常用业务模式抽象为可配置的元数据、表单引擎、流程引擎和规则引擎，让业务人员或实施人员也能参与应用搭建。",
      },
    ],
  },
  {
    id: "manufacturing",
    name: "制造与工业系统",
    related: [
      { title: "上位机与 PLC", href: "/domain/industrial-hmi/" },
      { title: "工业通信协议", href: "/domain/industrial-comms/" },
      { title: "C# 与 .NET 技术路线", href: "/tech-stack/c-sharp/" },
    ],
    items: [
      {
        slug: "mes",
        kind: 'business',
        title: "MES 制造执行系统",
        summary: "填补 ERP 计划层与车间设备层之间的断层：向上承接订单与排产，向下采集执行、质量、设备数据，实现「计划可下达、过程可监控、结果可追溯」。它是车间执行的中枢，也是 ERP 与 DCS/PLC 之间的关键中间层。",
      },
      {
        slug: "aps",
        kind: 'business',
        title: "APS 高级计划与排程",
        summary: "在有限产能、物料、交期等约束下生成可执行的工序级排程，优化交期达成、换型次数与资源利用率。它回答「哪台设备、什么时候、做什么工序」，并把结果下发给 MES 执行。",
      },
      {
        slug: "scada",
        kind: 'business',
        title: "SCADA 数据采集与监控系统",
        summary: "对工业现场设备进行实时数据采集、监视与控制，是 OT 层与 IT 层之间的 supervisory 层。它让操作员在监控主站上看到现场状态、报警与趋势，并向设备下发控制指令。",
      },
      {
        slug: "dcs",
        kind: 'business',
        title: "DCS 分布式控制系统",
        summary: "面向流程工业的分布式实时控制，强调高可靠与确定性。它由专用控制器、冗余网络和操作站组成，通常与 SCADA 配合形成「控制 + 监控」的分工。",
      },
      {
        slug: "plc",
        kind: 'business',
        title: "PLC 可编程逻辑控制器",
        summary: "执行逻辑控制、顺序控制和运动控制，直接驱动现场设备。它是工业自动化最底层的控制单元，通过工业协议与 SCADA/MES 网关通信，向上汇报状态、向下执行动作。",
      },
      {
        slug: "plm",
        kind: 'business',
        title: "PLM 产品生命周期管理",
        summary: "管理产品从概念、设计、BOM、工艺到变更和退役的全生命周期数据。核心是让产品数据在研发、制造、服务之间保持一致，避免「设计一套、生产一套、售后又一套」。",
      },
      {
        slug: "qms",
        kind: 'business',
        title: "QMS 质量管理",
        summary: "覆盖来料检验、过程检验、成品检验、不合格品处理与质量追溯。它把质量标准、抽样方案、检验记录和 SPC 统计过程控制串起来，支撑持续改进与客诉追溯。",
      },
      {
        slug: "eam",
        kind: 'business',
        title: "EAM 企业资产管理",
        summary: "管理设备台账、预防性维护、维修工单、备件库存与设备绩效。核心是让设备「有档案、有计划、有记录、有分析」，降低非计划停机与维护成本。",
      },
      {
        slug: "wms",
        kind: 'business',
        title: "WMS 仓储管理",
        summary: "统筹入库收货、上架、库存实时监控、拣货、包装到出库的全流程物理作业与信息流。它不只是记录库存，而是驱动仓储作业有序运转：WMS 做决策，WCS 驱动传送带、堆垛机、AGV 等设备执行。",
      },
      {
        slug: "tms",
        kind: 'business',
        title: "TMS 运输管理",
        summary: "管理运输计划、承运商、路径优化、运费结算与轨迹跟踪。核心是让「货从哪里来、到哪里去、谁在运、花了多少、现在到哪」全程可见、可算、可优化。",
      },
      {
        slug: "srm",
        kind: 'business',
        title: "SRM 供应商关系管理",
        summary: "管理供应商准入、寻源、招投标、采购协同、绩效评估与风险监控。它把采购从「下单跟单」扩展到「选商、育商、评商」，并与 ERP 采购订单、WMS 到货数据联动。",
      },
      {
        slug: "lims",
        kind: 'business',
        title: "LIMS 实验室信息管理",
        summary: "管理样品接收、检测任务、仪器数据、报告生成与全流程质量追溯。适用于检测/校准、制药、科研等实验室场景，核心是让样品、仪器、人员、方法、结果形成可追溯的闭环。",
      },
    ],
  },
  {
    id: "retail",
    name: "零售与电商系统",
    related: [
      { title: "Web 前端", href: "/tech-stack/frontend/" },
      { title: "缓存与内存存储", href: "/tech-stack/redis/" },
      { title: "数据库技术路线", href: "/tech-stack/sql-database/" },
    ],
    items: [
      {
        slug: "pos",
        kind: 'business',
        title: "POS 门店收银系统",
        summary: "完成门店收银、支付、小票打印、退货与日结。它是零售门店的交易入口，弱网环境下需要本地缓存与离线补传，保证收银不中断。",
      },
      {
        slug: "oms",
        kind: 'business',
        title: "OMS 订单管理系统",
        summary: "统一接收多渠道订单，完成拆单、路由、履约跟踪与售后状态管理。核心是让订单从「下单」到「签收」的全链路状态可见、可干预、可对账。",
      },
      {
        slug: "trade-platform",
        kind: 'business',
        title: "交易中台",
        summary: "把商品、库存、订单、营销等可复用交易能力沉淀为领域服务，支撑多前端、多渠道快速接入。它让新渠道不必重造交易链路，而是复用中台能力并做差异化编排。",
      },
      {
        slug: "pim",
        kind: 'business',
        title: "PIM 商品信息管理",
        summary: "统一管理商品主数据、类目、属性、图片与多渠道分发。核心是保证「同一个商品」在天猫、京东、门店、小程序等渠道的信息一致、可维护、可追溯。",
      },
      {
        slug: "inventory-center",
        kind: 'business',
        title: "库存中心",
        summary: "提供多仓、多渠道库存的实时可见性与分配策略。它回答「哪里有货、有多少、能不能卖、怎么预留」，并通过 Redis 原子操作与异步落库支撑高并发扣减。",
      },
      {
        slug: "member-marketing",
        kind: 'business',
        title: "会员与营销系统",
        summary: "管理会员等级、积分、优惠券、促销活动与精准触达。核心是把客户资产化，通过标签体系和实时事件触发，实现「在对的时间、对的人、给对的权益」。",
      },
      {
        slug: "search-recommend",
        kind: 'business',
        title: "推荐与搜索系统",
        summary: "提供商品/内容搜索、排序与个性化推荐。搜索解决「找得到」，推荐解决「逛得到」；两者通常共享内容特征，采用召回—排序两阶段架构，并在在线推理侧做实时个性化。",
      },
    ],
  },
  {
    id: "finance",
    name: "金融业务系统",
    related: [
      { title: "Java 技术路线", href: "/tech-stack/java/" },
      { title: "消息队列与事件总线", href: "/tech-stack/kafka/" },
      { title: "缓存与内存存储", href: "/tech-stack/redis/" },
    ],
    items: [
      {
        slug: "core-banking",
        kind: 'business',
        title: "核心银行系统",
        summary: "处理存款、贷款、支付结算、客户账户与总账的核心账务。它是银行的账务底座，强一致事务是首要约束；新一代核心向分布式 + 单元化演进，但账务准确性不可妥协。",
      },
      {
        slug: "payment-clearing",
        kind: 'business',
        title: "支付清算系统",
        summary: "作为金融基础设施的「血脉中枢」，提供中央银行货币资金最终结算服务，保障金融市场运转与资金循环。它强调多点多活、高可用与最终一致性，AI 开始进入清算全流程。",
      },
      {
        slug: "credit-management",
        kind: 'business',
        title: "信贷管理系统",
        summary: "覆盖贷前申请、授信审批、贷中放款、贷后监控与催收的全流程。核心是把准入、额度、定价、担保、还款等规则化、流程化，并与核心、征信、支付系统联动。",
      },
      {
        slug: "risk-control",
        kind: 'business',
        title: "风控与反欺诈系统",
        summary: "实时识别交易欺诈、信用风险与异常行为。通常由规则引擎、机器学习模型和实时特征计算组成，决策服务要求毫秒级响应，是金融业务的安全阀。",
      },
      {
        slug: "securities-trading",
        kind: 'business',
        title: "证券交易系统",
        summary: "完成订单撮合、行情分发、交易结算与账户管理。核心是低延迟、强确定性和严格顺序性；撮合引擎常驻内存，行情通过组播分发。",
      },
      {
        slug: "insurance-core",
        kind: 'business',
        title: "保险核心系统",
        summary: "覆盖承保、理赔、保单管理与再保险。产品工厂、规则引擎和工作流是核心组件；新一代系统向微服务与云原生迁移，但批处理与对账仍占重要位置。",
      },
      {
        slug: "asset-management",
        kind: 'business',
        title: "理财与资产管理系统",
        summary: "负责产品估值、份额登记、投资交易与绩效归因。核心是数据准确、估值可审计、交易可追溯，并与托管行、交易所进行数据交换。",
      },
    ],
  },
  {
    id: "healthcare",
    name: "医疗健康系统",
    related: [
      { title: "Java 技术路线", href: "/tech-stack/java/" },
      { title: "数据库技术路线", href: "/tech-stack/sql-database/" },
      { title: "Web 开发 / SaaS", href: "/domain/web-saas/" },
    ],
    items: [
      {
        slug: "his",
        kind: 'business',
        title: "HIS 医院信息系统",
        summary: "覆盖门诊、住院、收费、药房、电子病历等全院核心流程，是医院运营的 central system。它把患者从挂号到离院的业务流、资金流、信息流串起来，并与其他临床系统集成。",
      },
      {
        slug: "emr",
        kind: 'business',
        title: "EMR 电子病历系统",
        summary: "结构化记录诊疗过程，支撑临床决策、质控与科研。核心是让病历从「自由文本」变为「可检索、可统计、可复用」的临床数据资产。",
      },
      {
        slug: "lis",
        kind: 'business',
        title: "LIS 检验信息系统",
        summary: "管理检验申请、样本流转、仪器结果采集与报告发布。核心是样本条码化、仪器接口标准化、危急值规则化，让检验结果快速、准确、可追溯地回到临床。",
      },
      {
        slug: "pacs",
        kind: 'business',
        title: "PACS 影像归档与通信",
        summary: "完成医学影像的采集、存储、传输与诊断阅片。核心是 DICOM 协议、影像归档存储和阅片工作站；AI 辅助诊断作为后处理模块接入。",
      },
      {
        slug: "internet-hospital",
        kind: 'business',
        title: "互联网医院与预约挂号",
        summary: "提供在线复诊、处方流转、预约挂号与患者服务。核心是公网服务与院内系统的安全隔离交换，处方流转需对接监管平台。",
      },
      {
        slug: "medical-insurance",
        kind: 'business',
        title: "医保结算",
        summary: "完成医保费用计算、结算与基金监管接口对接。核心是医保规则库、与医保局接口和对账批处理；政策变动频繁，规则可配置性是关键。",
      },
    ],
  },
  {
    id: "government",
    name: "政务与公共服务系统",
    related: [
      { title: "Web 开发 / SaaS", href: "/domain/web-saas/" },
      { title: "数据库技术路线", href: "/tech-stack/sql-database/" },
      { title: "流量网关与反向代理", href: "/tech-stack/nginx/" },
    ],
    items: [
      {
        slug: "government-service",
        kind: 'business',
        title: "一网通办与政务服务平台",
        summary: "实现跨部门事项统一受理、流转、办结与好差评。核心是统一身份认证、事项库、工作流引擎和电子证照共享，让群众「进一扇门、办多件事」。",
      },
      {
        slug: "approval-supervision",
        kind: 'business',
        title: "行政审批与监管",
        summary: "覆盖行政许可审批、事中事后监管与执法协同。核心是流程引擎、规则引擎和监管对象库，移动执法端与后台通过 API 同步。",
      },
      {
        slug: "city-operation",
        kind: 'business',
        title: "城市运行与网格化治理",
        summary: "实现城市事件的发现、分拨、处置与闭环，支撑基层治理。核心是 GIS 地图底座、事件工单流和视频/物联感知接入，大屏可视化常用于指挥调度。",
      },
      {
        slug: "public-resource-trading",
        kind: 'business',
        title: "公共资源交易",
        summary: "完成招投标、政府采购、土地/产权交易的电子化与全程留痕。核心是电子开评标、CA 认证和围串标分析，对过程存证和不可篡改有较高要求。",
      },
    ],
  },
  {
    id: "logistics",
    name: "物流与交通系统",
    related: [
      { title: "GIS 与地图开发", href: "/domain/gis/" },
      { title: "缓存与内存存储", href: "/tech-stack/redis/" },
      { title: "数据库技术路线", href: "/tech-stack/sql-database/" },
    ],
    items: [
      {
        slug: "logistics-wms-tms",
        kind: 'business',
        title: "WMS / TMS 仓储与运输管理",
        summary: "仓储侧管理入库、上架、库存、拣货、出库；运输侧管理计划、承运商、路径、运费与轨迹。两者共同构成物流执行的核心闭环。",
      },
      {
        slug: "fleet-dispatch",
        kind: 'business',
        title: "车队管理与调度",
        summary: "统一管理车辆、司机、任务与实时调度。核心是 GPS/北斗轨迹接入、调度规则引擎和司机 App，与 TMS 的运输订单形成闭环。",
      },
      {
        slug: "route-pricing",
        kind: 'business',
        title: "路径规划与计价",
        summary: "基于路网和约束生成最优路径，并完成运费/票价计算。核心是 GIS 路网服务、路径规划算法和计价规则引擎，实时路况作为动态输入。",
      },
    ],
  },
  {
    id: "energy",
    name: "能源与公用事业系统",
    related: [
      { title: "上位机与 PLC", href: "/domain/industrial-hmi/" },
      { title: "工业通信协议", href: "/domain/industrial-comms/" },
      { title: "数据库技术路线", href: "/tech-stack/sql-database/" },
    ],
    items: [
      {
        slug: "ems",
        kind: 'business',
        title: "EMS 能源管理系统",
        summary: "完成能源计量、能效分析、负荷预测与优化调度。核心是时序数据库、计量采集网关和能效分析模型，并与 SCADA/DCS 的实时数据对接。",
      },
      {
        slug: "power-dispatch",
        kind: 'business',
        title: "电力调度",
        summary: "实现电网实时监控、调度计划与安全分析。核心是 SCADA/EMS 一体化、状态估计和安全约束调度，对实时性和可靠性要求极高。",
      },
      {
        slug: "billing-revenue",
        kind: 'business',
        title: "计费与营收",
        summary: "完成水/电/气/热的计量计费、账单、收费与营收对账。核心是计费规则引擎、批量出账和多渠道支付对账，与计量采集系统通过文件/API 交换数据。",
      },
    ],
  },
  {
    id: "construction",
    name: "建筑与工程系统",
    related: [
      { title: "GIS 与地图开发", href: "/domain/gis/" },
      { title: "图形与数据可视化", href: "/domain/visualization/" },
      { title: "数据库技术路线", href: "/tech-stack/sql-database/" },
    ],
    items: [
      {
        slug: "bim",
        kind: 'business',
        title: "BIM 建筑信息模型",
        summary: "管理建筑全生命周期的三维信息模型与协同。核心是 IFC 标准、三维渲染和模型轻量化，并与项目管理、运维系统集成。",
      },
      {
        slug: "engineering-project",
        kind: 'business',
        title: "工程项目管理",
        summary: "覆盖进度、成本、合同、质量、安全与文档的项目全过程管理。核心是 WBS、甘特图、成本台账和工作流，并与 BIM 和财务系统对接。",
      },
      {
        slug: "smart-site",
        kind: 'business',
        title: "智慧工地",
        summary: "实现人员实名制、视频监控、环境监测、塔吊/升降机安全监控。核心是 IoT 网关、视频 AI 分析和实名制闸机数据接入，边缘侧常需本地预处理。",
      },
    ],
  },
  {
    id: "education",
    name: "教育与培训系统",
    related: [
      { title: "Web 开发 / SaaS", href: "/domain/web-saas/" },
      { title: "数据库技术路线", href: "/tech-stack/sql-database/" },
      { title: "缓存与内存存储", href: "/tech-stack/redis/" },
    ],
    items: [
      {
        slug: "academic-affairs",
        kind: 'business',
        title: "教务管理",
        summary: "管理学籍、课程、排课、选课、成绩与教学计划。核心是排课算法和工作流；高并发选课场景需要缓存与队列削峰。",
      },
      {
        slug: "lms",
        kind: 'business',
        title: "LMS 学习管理系统",
        summary: "管理课程内容、学习过程、作业考试与学习分析。核心是 SCORM/xAPI 标准、内容存储和学习行为埋点；直播教学常集成第三方音视频服务。",
      },
      {
        slug: "exam-system",
        kind: 'business',
        title: "题库与考试",
        summary: "完成题目管理、组卷、在线考试与自动阅卷。核心是题库模型、组卷策略和防作弊（人脸/切屏检测）；主观题 AI 辅助评阅逐步成熟。",
      },
    ],
  },
  {
    id: "content-marketing",
    name: "内容与营销系统",
    related: [
      { title: "消息队列与事件总线", href: "/tech-stack/kafka/" },
      { title: "搜索与向量数据库", href: "/tech-stack/elasticsearch/" },
      { title: "图形与数据可视化", href: "/domain/visualization/" },
    ],
    items: [
      {
        slug: "cms",
        kind: 'business',
        title: "CMS 内容管理",
        summary: "完成内容的创建、审核、发布与多渠道分发。核心是内容模型、工作流和静态化/SSG；Headless CMS 通过 API 向多端供数。",
      },
      {
        slug: "dam",
        kind: 'business',
        title: "DAM 数字资产管理",
        summary: "集中存储、检索与管理图片、视频、文档等数字资产。核心是对象存储、元数据检索和转码/缩略图服务，并与 CMS、营销系统通过 API 集成。",
      },
      {
        slug: "marketing-automation",
        kind: 'business',
        title: "营销自动化",
        summary: "基于用户行为触发营销、编排客户旅程并做效果归因。核心是事件流（Kafka）、规则引擎和用户分群，与 CRM、推荐系统共享客户标签。",
      },
      {
        slug: "content-review",
        kind: 'business',
        title: "内容审核与推荐",
        summary: "对 UGC/PGC 内容做合规审核，并进行个性化分发。审核侧用规则 + AI 多模态模型；推荐侧用召回—排序架构；两者常共享内容特征。",
      },
    ],
  },
  {
    id: "telecom",
    name: "通信与运营商系统",
    related: [
      { title: "Java 技术路线", href: "/tech-stack/java/" },
      { title: "消息队列与事件总线", href: "/tech-stack/kafka/" },
      { title: "容器技术与集群编排", href: "/tech-stack/kubernetes/" },
    ],
    items: [
      {
        slug: "bss",
        kind: 'business',
        title: "BSS 业务支撑",
        summary: "管理产品、订单、计费、账务与客户。核心是计费引擎、订单流程和客户主数据；传统 BSS 体量大，向云化和微服务改造是长期过程。",
      },
      {
        slug: "oss",
        kind: 'business',
        title: "OSS 运营支撑",
        summary: "管理网络资源、故障、性能与运维工单。核心是资源模型、网管接口和工单流，并与 BSS 通过客户/订单数据关联。",
      },
    ],
  },
  {
    id: "security",
    name: "安全与合规系统",
    related: [
      { title: "网络安全与应用安全", href: "/domain/cybersecurity/" },
      { title: "Linux 与开发环境", href: "/tutorials/linux/" },
      { title: "容器技术与集群编排", href: "/tech-stack/kubernetes/" },
    ],
    items: [
      {
        slug: "siem",
        kind: 'business',
        title: "SIEM 安全信息与事件管理",
        summary: "集中采集安全日志，做关联分析与告警。核心是日志管道、关联规则和威胁情报接入；海量日志常用时序/搜索型存储。",
      },
      {
        slug: "iam",
        kind: 'business',
        title: "IAM 身份与访问管理",
        summary: "统一身份、认证、授权与单点登录。核心是 OAuth2/OIDC/SAML、RBAC/ABAC 和目录服务；零信任场景强调持续验证。",
      },
      {
        slug: "dlp",
        kind: 'business',
        title: "DLP 数据防泄漏",
        summary: "识别、监控和阻断敏感数据的非授权外泄。核心是内容识别（正则/指纹/ML）、多通道管控和策略引擎。",
      },
      {
        slug: "audit-compliance",
        kind: 'business',
        title: "审计与合规",
        summary: "实现操作留痕、合规检查与审计追溯。核心是不可篡改日志存储、审计规则和报表，常与 IAM、SIEM 联动。",
      },
    ],
  },
  {
    id: "industry-special",
    name: "行业专用与其他系统",
    related: [
      { title: "Web 开发 / SaaS", href: "/domain/web-saas/" },
      { title: "数据库技术路线", href: "/tech-stack/sql-database/" },
      { title: "上位机与 PLC", href: "/domain/industrial-hmi/" },
    ],
    items: [
      {
        slug: "hotel-pms",
        kind: 'business',
        title: "PMS 酒店管理",
        summary: "管理预订、入住、房态、收银与夜审。核心是房态中心、预订引擎和 OTA 渠道对接，并与 POS、门锁系统集成。",
      },
      {
        slug: "restaurant-pos",
        kind: 'business',
        title: "餐饮收银与后厨",
        summary: "完成点餐、收银、厨打、桌台与外卖聚合。核心是收银前端、后厨 KDS 和外卖平台 API；弱网离线可用是关键。",
      },
      {
        slug: "case-management",
        kind: 'business',
        title: "案件管理",
        summary: "管理立案、流转、文书、期限与归档。核心是案件模型、工作流、文书模板和期限提醒，电子卷宗与归档存储集成。",
      },
      {
        slug: "agriculture-management",
        kind: 'business',
        title: "农业种植与养殖",
        summary: "管理农事计划、投入品、生长监测与溯源。核心是 IoT 传感数据、农事记录和溯源链；田间移动端离线采集在农业场景中常见。",
      },
    ],
  },
];

/** 按 slug 找业务系统条目与它所属的分节（章节组件用） */
export const findBusinessSystem = (
  slug: string,
): { tier: RouteTier; item: RouteItem } | undefined =>
  businessCatalog
    .flatMap((tier) => tier.items.map((item) => ({ tier, item: normalizeItem(item) })))
    .find(({ item }) => item.slug === slug);
