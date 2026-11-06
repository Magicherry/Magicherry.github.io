import type { Localized } from './types'

/**
 * Copy that exists only in v3's layout.
 *
 * Everything that is a *fact* - roles, projects, the stack, contact channels,
 * the About paragraphs - still comes from the files v2 wrote (`copy.ts`,
 * `profile.ts`, `experience.ts`, ...), copied in unchanged so the two sites say
 * the same things. This file holds only what v3's structure needs and v2's did
 * not: the hero headline, the mock window's chrome, card titles, the CTA.
 *
 * Section titles come from copy.ts (v2's), accent markers and all.
 */

export const site = {
  hero: {
    /* The mono eyebrow above the headline. */
    label: { en: 'NIO · Shanghai', zh: '蔚来 · 上海' },
    headline: { en: "Hi, I'm Daniel Zhou", zh: 'Hi，我是周昱廷' },
    lines: {
      en: ['Building enterprise agent systems for manufacturing operations — and interfaces that sweat the details.'],
      zh: ['专注制造运营场景下的企业级 AI Agent 系统研发，同时注重界面设计的细节与交互体验。'],
    } satisfies Localized<readonly string[]>,
    viewWork: { en: 'View projects', zh: '查看项目' },
  },

  /*
   * The hero agent window's own chrome and intro text. Its sidebar, topics
   * and replies live in content/agent.ts.
   */
  window: {
    thought: { en: 'Thought', zh: '已思考' },
    thinking: { en: 'Thinking', zh: '思考中' },
    intro: {
      en: 'I am Daniel Zhou (Magicherry), Business Analyst Assistant & AI Agent Engineer at NIO, building enterprise agent systems for manufacturing operations.',
      zh: '我是周昱廷（Magicherry），在蔚来担任业务分析助理兼 AI Agent 工程师，构建面向制造运营的企业级 Agent 系统。',
    },
    canHelp: { en: 'What I work on:', zh: '我在做的事：' },
    items: [
      {
        title: { en: 'Enterprise AI agents', zh: '企业级 Agent' },
        body: {
          en: 'LLM / RAG systems and workflow automation for manufacturing.',
          zh: 'LLM / RAG 与流程自动化，服务制造运营。',
        },
      },
      {
        title: { en: 'Decision support', zh: '决策支持' },
        body: {
          en: 'Turning multi-source operational data into numbers teams run on.',
          zh: '把多源运营数据变成团队可用的决策依据。',
        },
      },
      {
        title: { en: 'NLP research', zh: 'NLP 研究' },
        body: {
          en: 'Hierarchical classification on transformers at Rutgers CAIT.',
          zh: '在 Rutgers CAIT 做基于 Transformer 的层级分类。',
        },
      },
      {
        title: { en: 'Full-stack engineering', zh: '全栈工程' },
        body: {
          en: 'From fast, careful interfaces to dependable back-ends.',
          zh: '从流畅的界面到稳定的后端服务。',
        },
      },
      {
        title: { en: 'Side projects', zh: '个人项目' },
        body: {
          en: 'Desktop apps, recommenders and tools I wanted to exist.',
          zh: '桌面应用、推荐系统，以及我自己想用的工具。',
        },
      },
    ] satisfies readonly { title: Localized; body: Localized }[],
    more: { en: 'Scroll on for the rest.', zh: '更多内容，继续往下看。' },
    placeholder: {
      en: 'Ask about projects, experience or how to reach me…',
      zh: '问问项目、经历，或者怎么联系我…',
    },
    permission: { en: 'Read-only', zh: '只读模式' },
    model: 'Magicherry-Agent',
    effort: { en: 'High', zh: '高' },
  },

  about: {
    /* Heading of the interests card beside the About prose (v2's wording). */
    offClock: { en: 'Off the clock', zh: '工作之外' },
    /* The section's title. v3's own rather than copy.ts's "关于我", which v2
       still uses; `**...**` is the accented part, as in v2's titles. */
    heading: { en: 'My **Engineering & Exploration**', zh: '我的**技术探索与工程实践**' },
    cards: {
      agents: {
        title: { en: 'Enterprise AI agents', zh: '企业级 AI Agent' },
        body: {
          en: 'Combining LLMs, RAG and workflow automation into enterprise agents for manufacturing operations, bringing AI into real business use.',
          zh: '融合 LLM、RAG 与工作流自动化，构建面向制造运营的企业级智能体，推动 AI 能力在真实业务场景中落地。',
        },
      },
      fullstack: {
        title: { en: 'Full-stack engineering', zh: '全栈工程' },
        body: {
          en: 'Front-end performance and interaction alongside back-end stability and scale, across API design, data processing and containerised deployment.',
          zh: '兼顾前端性能与交互体验、后端稳定性与可扩展性，覆盖 API 设计、数据处理与容器化部署。',
        },
      },
      research: {
        title: { en: 'NLP & data research', zh: 'NLP 与数据研究' },
        body: {
          en: 'Hierarchical text classification on DeBERTa over 100k+ railway incident records, exploring constrained inference and model evaluation.',
          zh: '基于 DeBERTa 构建层级文本分类模型，处理 10 万余条铁路事故记录，探索约束推理与模型评估。',
        },
      },
      stack: {
        title: { en: 'Tech stack', zh: '技术栈' },
        body: {
          en: 'Spanning AI applications, front- and back-end development, data storage and cloud-native infrastructure.',
          zh: '覆盖 AI 应用、前后端开发、数据存储与云原生基础设施。',
        },
      },
    },
    /* Labels inside the card illustrations. */
    agentRun: { en: 'Agent run', zh: 'Agent 运行' },
    steps: [
      { en: 'Retrieve cost documents', zh: '检索成本文档' },
      { en: 'Query production database', zh: '查询生产数据库' },
      { en: 'Forecast next-quarter spend', zh: '预测下季度支出' },
      { en: 'Draft decision brief', zh: '生成决策简报' },
    ] satisfies readonly Localized[],
    running: { en: 'Running', zh: '运行中' },
    done: { en: 'Done', zh: '已完成' },
    diffTab: { en: 'Round 1 changes', zh: '第 1 轮改动' },
    labels: { en: 'Predicted labels', zh: '预测标签' },
    /* The pause control each looping illustration carries. */
    pause: { en: 'Pause demo', zh: '暂停演示' },
    play: { en: 'Play demo', zh: '播放演示' },
    /* The classifier demo cycles through these records. Label paths
       are the model's own class names, so they stay in English. */
    records: [
      {
        id: '#48213',
        text: {
          en: '"Signal failure near Newark Penn delayed NE Corridor trains 25 min."',
          zh: '"纽瓦克站附近信号故障，东北走廊列车延误 25 分钟。"',
        },
        labels: [
          { path: ['Infrastructure'], score: 0.97 },
          { path: ['Infrastructure', 'Signal'], score: 0.91 },
          { path: ['Infrastructure', 'Signal', 'Failure'], score: 0.84 },
        ],
      },
      {
        id: '#51907',
        text: {
          en: '"Trespasser on the tracks near Secaucus; trains held for 40 min."',
          zh: '"锡考克斯附近有人闯入轨道，列车停驶 40 分钟。"',
        },
        labels: [
          { path: ['Safety'], score: 0.95 },
          { path: ['Safety', 'Trespassing'], score: 0.88 },
          { path: ['Safety', 'Trespassing', 'Police Activity'], score: 0.79 },
        ],
      },
      {
        id: '#53418',
        text: {
          en: '"Brake fault on train 3847 at Metropark; passengers transferred, 30 min delay."',
          zh: '"3847 次列车在 Metropark 站制动故障，乘客换乘，延误 30 分钟。"',
        },
        labels: [
          { path: ['Equipment'], score: 0.96 },
          { path: ['Equipment', 'Rolling Stock'], score: 0.9 },
          { path: ['Equipment', 'Rolling Stock', 'Brake Failure'], score: 0.82 },
        ],
      },
      {
        id: '#55062',
        text: {
          en: '"Flooding at Hoboken terminal; inbound service suspended for 2 hours."',
          zh: '"霍博肯终点站积水，进站列车暂停运营 2 小时。"',
        },
        labels: [
          { path: ['Weather'], score: 0.94 },
          { path: ['Weather', 'Precipitation'], score: 0.87 },
          { path: ['Weather', 'Precipitation', 'Flooding'], score: 0.81 },
        ],
      },
      {
        id: '#56730',
        text: {
          en: '"Overhead wire down between Rahway and Linden; diesel rescue sent."',
          zh: '"Rahway 至 Linden 区间接触网断线，已调派内燃机车救援。"',
        },
        labels: [
          { path: ['Infrastructure'], score: 0.95 },
          { path: ['Infrastructure', 'Power'], score: 0.89 },
          { path: ['Infrastructure', 'Power', 'Catenary'], score: 0.77 },
        ],
      },
      {
        id: '#58104',
        text: {
          en: '"No conductor available for train 6612; service cancelled."',
          zh: '"6612 次列车无列车长可调度，该班次取消。"',
        },
        labels: [
          { path: ['Operations'], score: 0.93 },
          { path: ['Operations', 'Crew'], score: 0.86 },
          { path: ['Operations', 'Crew', 'Unavailable'], score: 0.8 },
        ],
      },
    ] satisfies readonly {
      id: string
      text: Localized
      labels: readonly { path: readonly string[]; score: number }[]
    }[],
  },

  work: {
    roles: { en: 'Work experience', zh: '工作经历' },
    education: { en: 'Education', zh: '教育背景' },
    current: { en: 'Current', zh: '在职' },
    /* The timeline. Each bar carries a short name - the full registered
       names do not fit beside a two-month bar - and the detail below it
       spells the full name out. Keyed by role id, and by URL for degrees. */
    now: { en: 'Now', zh: '今天' },
    eduKind: { en: 'Education', zh: '教育' },
    short: {
      nio: { en: 'NIO', zh: '蔚来' },
      cait: { en: 'Rutgers CAIT', zh: 'Rutgers CAIT' },
      tenchii: { en: 'Tencent × Shanghai Metro', zh: '腾讯 × 上海地铁' },
      spacecraft: { en: 'Shanghai Spacecraft', zh: '上海航天机电' },
    } satisfies Record<string, Localized>,
    eduShort: {
      'https://www.cs.rutgers.edu/': { en: 'Rutgers · M.S. CS', zh: '罗格斯 · 计算机硕士' },
      'https://www.sit.edu.cn/': { en: 'SIT · B.Eng. SE', zh: '上应大 · 软件工程学士' },
    } satisfies Record<string, Localized>,
  },

  projects: {
    /* In place of the source link, for projects built inside a company. */
    private: { en: 'Internal — source not public', zh: '企业内部项目 · 源码未公开' },
  },

  connect: {
    email: {
      title: { en: 'Email', zh: '邮件' },
      body: {
        en: 'The fastest way to reach me. I usually reply within a day.',
        zh: '最快的联系方式，通常一天内回复。',
      },
    },
    github: {
      title: { en: 'Source', zh: '源码' },
      body: {
        en: 'This site is open source. Clone it, read it, borrow from it.',
        zh: '本站完全开源，欢迎克隆、阅读或借鉴。',
      },
    },
    copy: { en: 'Copy', zh: '复制' },
    copied: { en: 'Copied', zh: '已复制' },
  },

  cta: {
    title: { en: "Let's build something", zh: '期待与你交流更多可能' },
    body: {
      en: 'Open to conversations about AI agents, product and engineering — and anything else worth turning over.',
      zh: '欢迎交流 AI Agent、产品与工程，以及一切值得琢磨的话题。',
    },
  },

  footer: {
    wechat: { en: 'WeChat', zh: '微信' },
    scan: { en: 'Scan to add', zh: '扫码添加' },
    license: { en: 'Open source · MIT', zh: '开源 · MIT' },
    source: { en: 'Source', zh: '源码' },
    cv: { en: 'CV', zh: '简历' },
  },

  menu: {
    open: { en: 'Open menu', zh: '打开菜单' },
    close: { en: 'Close menu', zh: '关闭菜单' },
  },

  /* The CV split button: the main half downloads the current language's CV,
     the chevron opens a menu with both. */
  cv: {
    options: { en: 'CV versions', zh: '简历版本' },
    zh: { en: 'Chinese CV', zh: '中文简历' },
    en: { en: 'English CV', zh: '英文简历' },
  },
} as const
