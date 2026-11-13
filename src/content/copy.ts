import type { Localized } from './types'

/**
 * Prose keeps a tiny inline syntax - `**accent**` and `[label](url)` - parsed by
 * <RichText>. The alternative is JSX in the content layer, which drags markup
 * into files a translator should be able to edit, and quietly makes every string
 * un-diffable. Two markers cover everything this site needs.
 */

export const ui = {
  /* One label per section the header links to. They live here rather than in
     Header.tsx so a section's name has a single home. */
  nav: {
    about: { en: 'About', zh: '关于我' },
    stack: { en: 'Stack', zh: '技术栈' },
    work: { en: 'Work', zh: '经历' },
    projects: { en: 'Projects', zh: '项目' },
    contact: { en: 'Contact', zh: '联系' },
  },
  actions: {
    downloadCv: { en: 'Download CV', zh: '下载简历' },
    downloadCvHint: { en: 'Download CV (PDF)', zh: '下载简历（PDF）' },
    viewWork: { en: 'View selected work', zh: '查看项目' },
    source: { en: 'Source', zh: '源码' },
    all: { en: 'All', zh: '全部' },
    scroll: { en: 'Scroll', zh: '向下滚动' },
    close: { en: 'Close', zh: '关闭' },
    backToTop: { en: 'Back to top', zh: '回到顶部' },
    switchLanguage: { en: 'Switch to Chinese', zh: '切换到英文' },
    copied: { en: 'Copied', zh: '已复制' },
    /* Names the destination rather than the act - "GitHub" alone would be the
       fourth unlabelled glyph in a bar where every other control says where it
       goes. It is the button's accessible name as well as its tooltip. */
    github: { en: 'GitHub profile', zh: 'GitHub 主页' },
  },
  /* Labelled by what pressing it *does*, not by the state it is in. */
  language: {
    toggle: { en: '切换到中文', zh: 'Switch to English' },
  },
  sections: {
    /*
     * v1's heading register: a short lead-in plus the noun that matters, with
     * the noun marked by `**...**` and painted in the theme colour by
     * <RichText tone="accent">. The numbered eyebrows that used to sit above
     * these ("02 — Stack") were a second label for a section its own title
     * already names.
     */
    about: {
      title: { en: 'Know Who **I Am**', zh: '关于**我**' },
    },
    stack: {
      title: { en: 'My **Tech Stack**', zh: '我常用的**技术栈**' },
      certifications: { en: 'Certifications', zh: '专业认证' },
      tools: { en: 'Dev Environment & Tools', zh: '开发环境与工具' },
    },
    work: {
      title: { en: 'My **Experience**', zh: '我的**过往经历**' },
      /*
       * States the ordering outright. The rail beside the timeline is a reading
       * indicator - it fills as you scroll - but a vertical line with a
       * directional fill reads as an *axis*, and here downward means backward in
       * time. Naming the order resolves that without reordering a CV, which
       * belongs newest-first.
       */
      order: { en: 'Newest first', zh: '最新在上' },
      education: { en: 'Education', zh: '教育背景' },
      current: { en: 'Current', zh: '在职' },
    },
    projects: {
      title: { en: 'My Previous **Portfolio**', zh: '我做过的**项目**' },
      count: { en: 'projects', zh: '个项目' },
      filter: { en: 'Filter projects by domain', zh: '按领域筛选项目' },
    },
    contact: {
      title: { en: 'Get In **Touch**', zh: '联系**我**' },
      body: {
        en: 'Happy to talk technology, product and ideas — or anything else worth mulling over.',
        zh: '欢迎交流技术、产品、想法及一切值得琢磨的话题。',
      },
    },
  },
  hero: {
    greeting: { en: 'Hi there', zh: '你好呀' },
    intro: { en: 'I am', zh: '我是' },
  },
  about: {
    paragraphs: {
      en: [
        'I\'m currently an **AI Agent Engineer & Business Planning Assistant Analyst** at [NIO](https://www.nio.com/), where I build and ship **enterprise AI agent systems** for manufacturing operations. My work brings together **LLMs and RAG, business process automation and data-driven decision-making** to put AI to work on real business problems. Before that, I did **NLP and LLM** research at the [Rutgers CAIT Lab](https://cait.rutgers.edu/) and helped build large-scale web applications at a **Tencent × Shanghai Metro** joint venture.',
        'On the technical side, my background spans **full-stack development and AI engineering**. I care about **front-end performance and user experience** just as much as **back-end stability and scalability**, and I keep sharpening my skills in **database and API design, data pipelines and containerised deployment**.',
        'I\'m less interested in technical complexity for its own sake than in whether a product actually solves the problem: **fast, maintainable and pleasant to use**. Good work should hold up to technical scrutiny, stay close to what the business really needs, and deliver real value.',
      ],
      zh: [
        '目前，我在[蔚来](https://www.nio.com/)担任**AI Agent 工程师 & 业务规划助理分析师**，聚焦制造运营场景下的**企业级 AI Agent 系统研发与落地**，结合 **LLM / RAG、业务流程自动化与数据驱动决策**，推动 AI 技术与实际业务的深度融合。此前，我曾在 [Rutgers CAIT Lab](https://cait.rutgers.edu/) 从事 **NLP / LLM** 相关研究，并在**腾讯 × 上海地铁**合资公司参与大型 Web 应用的研发与工程实践。',
        '技术上，我具备**全栈开发与 AI 应用工程**的复合背景，既关注**前端性能与交互体验**，也重视**后端架构的稳定性与可扩展性**，并持续实践**数据库与 API 设计、数据处理管道及容器化部署**。',
        '相比单纯追求技术复杂度，我更在意产品能否真正解决问题：**性能出色、易于维护、体验友好**。既经得起技术推敲，也能贴近真实业务需求，让技术价值真正落地。',
      ],
    } satisfies Localized<readonly string[]>,
    /*
     * Each carries an `id` rather than an icon. The icon is a React component,
     * and this file is the one place the site keeps as plain data - so About.tsx
     * maps the id to a glyph and the content layer never imports a component.
     * Keying on an id also means reordering this list cannot silently hand an
     * entry the wrong icon, which an index-aligned array would.
     */
    interests: [
      { id: 'writing', label: { en: 'Tech blogging & product reviews', zh: '技术博客与产品评测' } },
      { id: 'games', label: { en: 'Games & interaction design', zh: '游戏与交互设计' } },
      { id: 'f1', label: { en: 'Formula 1', zh: 'F1 赛事' } },
      { id: 'film', label: { en: 'Film, series & documentaries', zh: '电影、剧集与纪录片' } },
      { id: 'photo', label: { en: 'Photography & video', zh: '摄影与视频创作' } },
    ] satisfies readonly { id: string; label: Localized }[],
    quote: {
      en: 'No matter what your dream is, you have to dedicate yourself entirely to it.',
      zh: '无论你的梦想是什么，你都必须全身心投入其中。',
    },
    quoteAuthor: { en: 'Ayrton Senna', zh: '艾尔顿 · 塞纳' },
    signatureCredit: {
      en: 'Ayrton Senna signature · SVG by Cookieman1.1.1 · CC BY-SA 4.0 · View source and license',
      zh: '艾尔顿·塞纳签名 · SVG 作者 Cookieman1.1.1 · CC BY-SA 4.0 · 查看来源与授权',
    },
  },
  footer: {
    motto: { en: 'Stay curious, keep exploring.', zh: '保持好奇，持续探索。' },
  },
  a11y: {
    /* Named per platform rather than a single "QR code": this is the whole of
       what a screen reader gets for an image that is otherwise unreadable, and
       which app it opens is the only useful thing to say about it. */
    wechatQr: { en: 'WeChat QR code', zh: '微信二维码' },
    avatar: { en: 'Portrait of Daniel Zhou', zh: '周昱廷的头像' },
  },
} as const
