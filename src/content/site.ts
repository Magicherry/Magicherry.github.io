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
    /* The status badge above the headline. Says "now", because the pulsing
       dot beside it does - a bare "NIO · Shanghai" left the dot unexplained. */
    label: { en: 'Now at NIO in Shanghai', zh: '现就职于上海蔚来' },
    headline: { en: "Hi, I'm Daniel Zhou", zh: 'Hi，我是周昱廷' },
    lines: {
      en: ['I build enterprise AI agent systems for manufacturing operations, with equal care for the engineering, the visual design and the interaction.'],
      zh: ['致力于构建面向制造运营的企业级 AI Agent 系统，兼顾技术实现、界面美学与交互体验。'],
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
      en: "I'm Daniel Zhou. I work on business analysis and AI agents at NIO, bringing AI into manufacturing operations and building systems that solve real business problems.",
      zh: '我是周昱廷（Daniel Zhou），目前在蔚来从事业务分析与 AI Agent 研发，致力于将人工智能融入制造运营场景，构建真正解决业务问题的智能系统。',
    },
    canHelp: { en: 'What I focus on:', zh: '我关注的方向：' },
    items: [
      {
        title: { en: 'AI agents', zh: 'AI Agent' },
        body: {
          en: 'Enterprise AI apps built on LLMs, RAG and workflow automation.',
          zh: '基于 LLM / RAG 与流程自动化，构建企业级智能应用。',
        },
      },
      {
        title: { en: 'Business analysis', zh: '业务分析' },
        body: {
          en: 'Pulling data together across teams to find insights and inform operational decisions.',
          zh: '整合跨业务域数据，挖掘业务洞察，辅助运营决策。',
        },
      },
      {
        title: { en: 'NLP research', zh: 'NLP 研究' },
        body: {
          en: 'Transformer-based text classification research at Rutgers CAIT.',
          zh: '曾在 Rutgers CAIT 开展基于 Transformer 的文本分类研究。',
        },
      },
      {
        title: { en: 'Full-stack development', zh: '全栈开发' },
        body: {
          en: 'Complete, reliable apps, from back-end architecture to front-end interaction.',
          zh: '从后端架构到前端交互，打造完整、可靠的应用体验。',
        },
      },
      {
        title: { en: 'Side projects', zh: '个人项目' },
        body: {
          en: 'Chasing ideas I find interesting and turning them into useful, well-crafted tools.',
          zh: '探索有趣的技术想法，打磨实用且注重细节的工具。',
        },
      },
    ] satisfies readonly { title: Localized; body: Localized }[],
    more: { en: "There's more to see - keep exploring.", zh: '更多故事，欢迎继续探索。' },
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
    offClock: { en: 'Off the clock', zh: '工作之余' },
    /* The section's title. v3's own rather than copy.ts's "关于我", which v2
       still uses; `**...**` is the accented part, as in v2's titles. */
    heading: { en: 'What I **Build & Explore**', zh: '我的**技术探索与工程实践**' },
    cards: {
      agents: {
        title: { en: 'Enterprise AI agents', zh: '企业级 AI Agent' },
        body: {
          en: 'Enterprise agents for manufacturing operations, built on LLMs, RAG and workflow automation, putting AI to work on real business problems.',
          zh: '融合 LLM、RAG 与工作流自动化，构建面向制造运营的企业级智能体，推动 AI 能力在真实业务场景中落地。',
        },
      },
      fullstack: {
        title: { en: 'Full-stack engineering', zh: '全栈工程' },
        body: {
          en: 'Fast, polished front ends and stable, scalable back ends, from API design to data processing and containerised deployment.',
          zh: '兼顾前端性能与交互体验、后端稳定性与可扩展性，覆盖 API 设计、数据处理与容器化部署。',
        },
      },
      research: {
        title: { en: 'NLP & data research', zh: 'NLP 与数据研究' },
        body: {
          en: 'A hierarchical DeBERTa classifier for more than 100,000 railway incident records, with work on constrained inference and model evaluation.',
          zh: '基于 DeBERTa 构建层级文本分类模型，处理 10 万余条铁路事故记录，探索约束推理与模型评估。',
        },
      },
      stack: {
        title: { en: 'Tech stack', zh: '技术栈' },
        body: {
          en: 'Everything from AI applications and front- and back-end development to data storage and cloud-native infrastructure.',
          zh: '覆盖 AI 应用、前后端开发、数据存储与云原生基础设施。',
        },
      },
    },
    /* Labels inside the card illustrations. */
    /* The agent demo: a request, four steps each with what it found, and the
       brief they produce. Its 6.8% is the full-stack dashboard's figure, so
       the two cards tell one story. */
    agentRun: { en: 'Cost analysis agent', zh: '成本分析 Agent' },
    ask: { en: 'Break down Q3 costs by line and advise on Q4', zh: '分析 Q3 各产线成本，给出 Q4 建议' },
    steps: [
      {
        label: { en: 'Search cost reports', zh: '检索成本文档' },
        detail: { en: '8 docs · relevance 0.82', zh: '8 篇文档 · 相关度 0.82' },
      },
      {
        label: { en: 'Query production database', zh: '查询生产数据库' },
        detail: { en: '1,284 rows · 6 lines', zh: '1,284 行 · 6 条产线' },
      },
      {
        label: { en: "Forecast next quarter's spend", zh: '预测下季度支出' },
        detail: { en: 'Q4 −6.8% · MAPE 4.1%', zh: 'Q4 −6.8% · MAPE 4.1%' },
      },
      {
        label: { en: 'Write the decision brief', zh: '生成决策简报' },
        detail: { en: '3 recommendations', zh: '3 条建议' },
      },
    ] satisfies readonly { label: Localized; detail: Localized }[],
    brief: {
      summary: { en: '4 steps · 9.1s · 3.2k tokens', zh: '4 步 · 9.1s · 3.2k tokens' },
      title: { en: 'Q4 decision brief', zh: 'Q4 决策简报' },
      points: {
        en: [
          'Welding energy runs 12% over plan — shift loads off-peak',
          'Battery-line scrap is down — keep the current process',
          'Q4 total cost forecast down 6.8%',
        ],
        zh: ['焊装线能耗高出计划 12%，建议错峰排产', '电池线物料损耗下降，维持现有方案', '预计 Q4 总成本环比下降 6.8%'],
      } satisfies Localized<readonly string[]>,
      sent: { en: 'Sent to the operations team', zh: '已推送至运营团队' },
    },
    running: { en: 'Running', zh: '运行中' },
    done: { en: 'Done', zh: '已完成' },
    /* The full-stack demo's three tabs - one change carried from the code,
       through tests and a container rollout, to the page that calls it. */
    ship: {
      code: { en: 'Changes', zh: '改动' },
      terminal: { en: 'Terminal', zh: '终端' },
      preview: { en: 'Preview', zh: '预览' },
      chartTitle: { en: 'Q4 cost forecast', zh: 'Q4 成本预测' },
      chartMeta: { en: 'By production line', zh: '按产线' },
      delta: { en: 'vs Q3', zh: '环比 Q3' },
      /* The status pill in the tab bar, one per act. */
      stages: {
        editing: { en: 'Editing', zh: '编辑中' },
        building: { en: 'Building', zh: '构建中' },
        live: { en: 'Live', zh: '已上线' },
      },
      /* The chart's columns: the shops of a car plant. */
      lines: {
        en: ['Stamp', 'Weld', 'Paint', 'Assy', 'Pack', 'Drive'],
        zh: ['冲压', '焊装', '涂装', '总装', '电池', '电驱'],
      } satisfies Localized<readonly string[]>,
    },
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
        /* Not "欢迎交流…" / "Happy to talk…": the CTA right below opens that
           way, and the two read as one line said twice. */
        en: "Whether it's tech, product or a new idea, I'd love to hear from you.",
        zh: '无论是技术、产品还是新想法，都期待你的来信。',
      },
    },
    github: {
      title: { en: 'Source', zh: '源码' },
      body: {
        en: 'This site is fully open source. Feel free to explore the code.',
        zh: '本站代码完全开源，欢迎查看与交流。',
      },
    },
    copy: { en: 'Copy', zh: '复制' },
    copied: { en: 'Copied', zh: '已复制' },
  },

  cta: {
    title: { en: "Got an idea? Let's talk", zh: '一起聊聊你的想法' },
    body: {
      en: 'Happy to talk AI agents, product and engineering — or anything else worth mulling over.',
      zh: '欢迎交流 AI Agent、产品与工程，以及一切值得琢磨的话题。',
    },
  },

  footer: {
    scan: { en: 'Scan to add', zh: '扫码添加' },
    license: { en: 'Open source · MIT', zh: '开源 · MIT' },
    source: { en: 'Source', zh: '源码' },
    cv: { en: 'CV', zh: '简历' },
  },

  menu: {
    open: { en: 'Open menu', zh: '打开菜单' },
    close: { en: 'Close menu', zh: '关闭菜单' },
  },

  /* Names that only assistive tech hears - landmarks and groups. Kept here
     with the rest of the copy so they switch language with the page. */
  a11y: {
    skip: { en: 'Skip to content', zh: '跳到正文' },
    primaryNav: { en: 'Primary', zh: '主导航' },
    menuNav: { en: 'Site menu', zh: '站点菜单' },
    footerNav: { en: 'Footer', zh: '页脚' },
    language: { en: 'Language', zh: '语言' },
  },

  /* The appearance toggle names what it will do, not what is showing. */
  theme: {
    toLight: { en: 'Switch to light mode', zh: '切换到浅色模式' },
    toDark: { en: 'Switch to dark mode', zh: '切换到深色模式' },
  },

  /* The CV split button: the main half downloads the current language's CV,
     the chevron opens a menu with both. */
  cv: {
    options: { en: 'CV versions', zh: '简历版本' },
    zh: { en: 'Chinese CV', zh: '中文简历' },
    en: { en: 'English CV', zh: '英文简历' },
  },
} as const
