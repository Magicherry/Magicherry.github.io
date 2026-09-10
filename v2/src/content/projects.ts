import type { Localized } from './types'
import streamx from '@/assets/projects/StreamX.png'
import railway from '@/assets/projects/Railway.png'
import trainMulti from '@/assets/projects/train_multi.png'
import fitness from '@/assets/projects/Fitness.png'
import ayenote from '@/assets/projects/AyeNote.png'
import kob from '@/assets/projects/KOB.png'
import managements from '@/assets/projects/Managements.png'
import cider from '@/assets/projects/CiderMusic.png'
import fighters from '@/assets/projects/Fighters.png'

export type ProjectDomain = 'ai' | 'web' | 'data' | 'design'

export interface Project {
  id: string
  image: string
  title: Localized
  summary: Localized
  /** Drives the filter chips. A project may legitimately sit in two domains. */
  domains: readonly ProjectDomain[]
  tags: readonly string[]
  kind: Localized
  year: string
  repo?: string
}

export const domainLabels: Record<ProjectDomain, Localized> = {
  ai: { en: 'AI / ML', zh: 'AI / 机器学习' },
  web: { en: 'Web', zh: 'Web 工程' },
  data: { en: 'Data', zh: '数据' },
  design: { en: 'Design', zh: '设计' },
}

export const projects: readonly Project[] = [
  {
    id: 'streamx',
    image: streamx,
    title: { en: 'StreamX — Movie Recommender', zh: 'StreamX 电影推荐系统' },
    summary: {
      en: 'A personalised recommender combining Matrix Factorization (SGD, ALS), SVD and TextCNN, with end-to-end preprocessing, MAE/RMSE/NDCG evaluation and a full-stack web app on top.',
      zh: '面向电影推荐场景的个性化推荐系统，整合矩阵分解（SGD、ALS）、SVD 与 TextCNN，覆盖数据清洗、特征处理、模型训练到效果评估的完整流程，并最终落地为可交互的全栈 Web 应用。',
    },
    domains: ['ai', 'web'],
    tags: ['Python', 'Matrix Factorization', 'TextCNN', 'Next.js', 'Django'],
    kind: { en: 'Personal', zh: '个人项目' },
    year: '2026',
    repo: 'https://github.com/Magicherry/Movies-Recommendation',
  },
  {
    id: 'rail-classifier',
    image: railway,
    title: { en: 'Intelligent Rail Incident Classifier', zh: '智能铁路事故分类系统' },
    summary: {
      en: 'A hierarchical NLP system on DeBERTa that classifies real railway incident logs across multiple structured label levels, with a full training and evaluation pipeline behind it.',
      zh: '基于 DeBERTa 预训练语言模型构建的分层 NLP 系统，对真实轨道交通事件日志进行多层级自动分类，覆盖数据预处理、标签体系组织与评估流程设计。',
    },
    domains: ['ai', 'data'],
    tags: ['Python', 'DeBERTa-v3', 'Hierarchical Learning', 'Fine-tuning', 'NLP'],
    kind: { en: 'Company Internal', zh: '企业内部项目' },
    year: '2025',
  },
  {
    id: 'rail-spatial',
    image: trainMulti,
    title: { en: 'Rail Spatial-temporal Analyzer', zh: '铁路时空分析系统' },
    summary: {
      en: 'A Qt desktop application that turns raw train telemetry into readable space-time diagrams, so researchers can reason about a given day and corridor at a glance.',
      zh: '基于 Qt 的原生桌面应用，将原始列车运行数据转换为直观的时空图与可视化结果，帮助研究人员围绕特定日期与区段快速理解列车活动情况。',
    },
    domains: ['data'],
    tags: ['Python', 'PyQt', 'NumPy', 'Pandas', 'Matplotlib'],
    kind: { en: 'Company Internal', zh: '企业内部项目' },
    year: '2025',
  },
  {
    id: 'pose',
    image: fitness,
    title: { en: 'Real-time Pose Estimation', zh: '实时人体姿态估计系统' },
    summary: {
      en: 'Runs Google MoveNet against a live webcam feed to track body keypoints and give instant feedback on movement accuracy.',
      zh: '使用 Google MoveNet 模型进行实时姿态估计，直接从摄像头画面识别人体关键点，并对动作完成度与准确性给出即时反馈。',
    },
    domains: ['ai'],
    tags: ['Python', 'MoveNet', 'OpenCV', 'PyTorch', 'TensorFlow'],
    kind: { en: 'Personal', zh: '个人项目' },
    year: '2024',
    repo: 'https://github.com/Magicherry/Pose_Estimation',
  },
  {
    id: 'ayenote',
    image: ayenote,
    title: { en: 'AyeNote — Cloud Notes', zh: 'AyeNote 云笔记' },
    summary: {
      en: 'A full-stack note-taking app with a Vue 3 front-end and a Django back-end, plus scraping and mining passes that analyse how the content is actually used.',
      zh: '全栈云笔记应用，前端基于 Vue3、后端基于 Django，并结合网页抓取与数据挖掘能力分析用户数据与内容行为。',
    },
    domains: ['web', 'data'],
    tags: ['Vue 3', 'Django', 'MySQL', 'Beautiful Soup', 'AJAX'],
    kind: { en: 'Personal', zh: '个人项目' },
    year: '2023',
    repo: 'https://github.com/Magicherry/AyeNote',
  },
  {
    id: 'kob',
    image: kob,
    title: { en: 'King of Bots — Real-time Battle Platform', zh: 'King of Bots 实时对战平台' },
    summary: {
      en: 'A real-time strategy game on Spring Boot and Vue 3, with WebSocket match synchronisation and JWT-backed sessions.',
      zh: '实时策略游戏项目，后端 Spring Boot、前端 Vue3，涵盖用户对战、实时同步与状态管理等核心能力。',
    },
    domains: ['web'],
    tags: ['Java', 'Spring Boot', 'Vue 3', 'WebSocket', 'JWT'],
    kind: { en: 'Personal', zh: '个人项目' },
    year: '2023',
    repo: 'https://github.com/Magicherry/King-of-Bots',
  },
  {
    id: 'management',
    image: managements,
    title: { en: 'Management Dashboard', zh: '后台管理系统' },
    summary: {
      en: 'A back-office system on Spring Boot and MyBatis Plus with a clean front/back separation and MD5-secured credentials.',
      zh: '基于 Spring Boot 与 MyBatis Plus 的综合管理后台，具备清晰的前后端分层结构与权限相关功能。',
    },
    domains: ['web'],
    tags: ['Java', 'Spring Boot', 'MyBatis Plus', 'Vue 3', 'MySQL'],
    kind: { en: 'Personal', zh: '个人项目' },
    year: '2022',
    repo: 'https://github.com/Magicherry/Management_Web_System',
  },
  {
    id: 'cider',
    image: cider,
    title: { en: 'Music App UX Design', zh: 'Music App 交互设计' },
    summary: {
      en: 'A high-fidelity prototype for a music streaming client, built in Axure RP 9 around Apple Music’s information hierarchy.',
      zh: '音乐流媒体应用的高保真 UX 原型，使用 Axure RP 9 完成设计与交互演示，重点关注信息层级与播放流程的体验衔接。',
    },
    domains: ['design'],
    tags: ['Axure RP', 'UX', 'Prototyping'],
    kind: { en: 'Personal', zh: '个人项目' },
    year: '2022',
    repo: 'https://github.com/Magicherry/Music-App-Ui-Design',
  },
  {
    id: 'fighters',
    image: fighters,
    title: { en: 'King of Fighters', zh: '经典拳皇' },
    summary: {
      en: 'A classic fighting game rebuilt in plain HTML, CSS and JavaScript, with modular character state and two-player keyboard play.',
      zh: '使用原生 HTML、CSS 与 JavaScript 复刻的经典格斗游戏，支持双人键盘对战，并以模块化结构组织游戏逻辑与角色状态。',
    },
    domains: ['web', 'design'],
    tags: ['HTML', 'JavaScript', 'CSS'],
    kind: { en: 'Personal', zh: '个人项目' },
    year: '2021',
    repo: 'https://github.com/Magicherry/King-of-Fighters',
  },
]
