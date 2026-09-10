import type { Localized } from './types'
import rutgersCrest from '@/assets/education/rutgers.png'
import sitCrest from '@/assets/education/sit.png'

export type Track = 'work' | 'research' | 'internship'

export interface Role {
  id: string
  track: Track
  title: Localized
  company: Localized
  companyUrl?: string
  focus: Localized
  duration: string
  /** Present roles pin to the top of the timeline and get a live indicator. */
  current?: boolean
  bullets: Localized<readonly string[]>
}

export const trackLabels: Record<Track, Localized> = {
  work: { en: 'Full-time', zh: '全职' },
  research: { en: 'Research', zh: '科研' },
  internship: { en: 'Internship', zh: '实习' },
}

export const roles: readonly Role[] = [
  {
    id: 'nio',
    track: 'work',
    current: true,
    title: {
      en: 'AI Agent Engineer & Business Planning Assistant Analyst',
      zh: 'AI Agent 工程师 & 业务规划助理分析师',
    },
    company: { en: 'NIO Inc.', zh: '上海蔚来汽车有限公司' },
    companyUrl: 'https://www.nio.com/',
    focus: {
      en: 'Enterprise AI Agents · LLM/RAG · Business Planning',
      zh: '企业级 AI Agent · LLM/RAG · 业务规划分析',
    },
    duration: '06/2026 — Present',
    bullets: {
      en: [
        'Build enterprise AI agent systems for manufacturing operations with LLMs, RAG and workflow automation.',
        'Ship intelligent solutions for manufacturing cost optimisation and predictive forecasting.',
        'Turn multi-source operational data into decision support the business teams actually run on.',
      ],
      zh: [
        '面向制造运营构建企业级 AI Agent 系统，落地 LLM、RAG 与流程自动化。',
        '交付制造成本优化与预测性分析的智能化解决方案。',
        '将多源运营数据转化为业务团队可用的决策支持。',
      ],
    },
  },
  {
    id: 'cait',
    track: 'research',
    title: { en: 'Research Assistant', zh: '研究助理' },
    company: {
      en: 'Rutgers Center for Advanced Infrastructure and Transportation (CAIT)',
      zh: '罗格斯大学先进基础设施与交通中心（CAIT）',
    },
    companyUrl: 'https://cait.rutgers.edu/',
    focus: {
      en: 'Hierarchical Classification · Data Engineering · LLM Applications',
      zh: '层级文本分类 · 数据工程 · LLM 应用',
    },
    duration: '06/2025 — 05/2026',
    bullets: {
      en: [
        'Architected data pipelines that merge and reconcile 100k+ multi-source railway incident and delay records, with automated deduplication, hierarchical label dictionaries and cross-dataset consistency validation.',
        'Built analysis and visualisation tooling that turns raw operational logs into daily, route-level and location-level metrics, supporting delay pattern analysis and anomaly detection.',
        'Designed and fine-tuned hierarchical multi-label classifiers on pretrained transformers (DeBERTa), modelling structured dependencies with supervised fine-tuning, encoder freezing and dependency-aware evaluation.',
      ],
      zh: [
        '搭建可扩展数据工程流程，整合清洗 10 万+ 多源铁路事故与延误记录，完成自动去重与跨数据集一致性校验，显著提升训练数据质量与复用效率。',
        '开发面向运营日志的分析与可视化工具链，将原始日志转化为按天、线路、站点聚合的结构化指标，支撑延误模式挖掘与异常定位。',
        '构建基于预训练模型（DeBERTa）的层次化多标签分类体系，结合监督微调、编码器冻结策略与依赖约束评估，提高跨层标签预测的一致性与稳健性。',
      ],
    },
  },
  {
    id: 'tenchii',
    track: 'internship',
    title: { en: 'Front-end Engineer, Intern', zh: '前端工程师实习生' },
    company: {
      en: 'Tenchii Digital Tech (Tencent × Shanghai Metro JV)',
      zh: '上海通驰数字科技有限公司（腾讯 × 上海地铁合资）',
    },
    focus: {
      en: 'Front-end Performance · Real-time Systems · Vue/React',
      zh: '前端性能优化 · 实时通信 · Vue/React',
    },
    duration: '06/2023 — 08/2023',
    bullets: {
      en: [
        'Refactored rendering and request pipelines in the Shanghai Transit App, cutting page latency by 30% and lifting retention on key screens.',
        'Built a high-concurrency real-time lottery module on WebSocket and MongoDB, holding low-latency delivery through peak-hour traffic.',
        'Took 3 cross-team prototypes from Axure to production Vue components with product, design and back-end, shortening the validation loop.',
      ],
      zh: [
        '围绕地铁出行核心链路重构组件渲染策略与请求并发控制，页面加载时延降低 30%，并带动关键页面留存指标正向提升。',
        '参与高并发实时抽奖系统建设，基于 WebSocket 与 MongoDB 设计消息分发与状态持久化方案，保障峰值流量下的低延迟推送与数据一致性。',
        '与产品、设计及后端协作完成 3 个跨部门原型从 Axure 到 Vue 组件的工程化落地，缩短原型验证与迭代周期。',
      ],
    },
  },
  {
    id: 'spacecraft',
    track: 'internship',
    title: { en: 'Software Test Engineer, Intern', zh: '软件测试工程师实习生' },
    company: {
      en: 'Shanghai Spacecraft Electromechanical Equipment Co., Ltd.',
      zh: '上海航天机电设备有限公司',
    },
    focus: {
      en: 'Test Automation · CI Integration · Quality Assurance',
      zh: '自动化测试 · CI 集成 · 质量保障',
    },
    duration: '06/2022 — 09/2022',
    bullets: {
      en: [
        'Built a cross-hardware automation framework and wired Pytest/JUnit into CI, improving regression coverage and run stability.',
        'Developed Selenium UI suites and regression workflows that surfaced high-priority defects earlier, reducing release risk and manual test cost.',
        'Standardised defect severity and test reporting so engineers could triage faster and release reviews ran cleaner.',
      ],
      zh: [
        '搭建跨硬件环境自动化测试框架，联通 Pytest/JUnit 与 CI 流程，提升回归测试覆盖率与执行稳定性。',
        '基于 Selenium 建立 UI 自动化脚本与缺陷回归机制，提前暴露高优先级问题，降低上线风险并减少人工回归成本。',
        '建立缺陷分级与回归闭环，沉淀测试报告与风险清单，支持研发快速定位问题并提升版本评审与发布效率。',
      ],
    },
  },
]

export interface Education {
  degree: Localized
  school: Localized
  duration: string
  /** School crest, bundled rather than hot-linked - see below. */
  crest: string
  url: string
}

/*
 * The crests are committed to the repo instead of being loaded from each
 * university's own server. Those are not CDNs: Rutgers serves its mark from a
 * Drupal theme directory that moves on every redeploy, and a visitor in China
 * would be waiting on a transatlantic round trip for a 40px image. Twelve
 * kilobytes in the bundle buys an asset that cannot 404 mid-scroll.
 */
export const education: readonly Education[] = [
  {
    degree: { en: 'M.S. in Computer Science', zh: '计算机科学 硕士' },
    school: { en: 'Rutgers University', zh: '罗格斯大学' },
    duration: '2024 — 2026',
    crest: rutgersCrest,
    url: 'https://www.cs.rutgers.edu/',
  },
  {
    degree: { en: 'B.Eng. in Software Engineering', zh: '软件工程 学士' },
    school: { en: 'Shanghai Institute of Technology', zh: '上海应用技术大学' },
    duration: '2020 — 2024',
    crest: sitCrest,
    url: 'https://www.sit.edu.cn/',
  },
]
