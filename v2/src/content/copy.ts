import type { Localized } from './types'

/**
 * Prose keeps a tiny inline syntax - `**accent**` and `[label](url)` - parsed by
 * <RichText>. The alternative is JSX in the content layer, which drags markup
 * into files a translator should be able to edit, and quietly makes every string
 * un-diffable. Two markers cover everything this site needs.
 */

export const ui = {
  nav: {
    home: { en: 'Home', zh: '首页' },
    about: { en: 'About', zh: '关于' },
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
    copied: { en: 'Copied', zh: '已复制' },
  },
  /* Labelled by what pressing it *does*, not by the state it is in. */
  theme: {
    dark: { en: 'Switch to light theme', zh: '切换到浅色主题' },
    light: { en: 'Switch to dark theme', zh: '切换到深色主题' },
  },
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
      title: { en: 'Know Who **I Am**', zh: '进一步了解**我**' },
    },
    stack: {
      title: { en: 'Professional **Skillset**', zh: '我常用的**技术栈**' },
      certifications: { en: 'Certifications', zh: '专业认证' },
      tools: { en: 'Tools I Use', zh: '工具与工作流' },
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
        en: 'Open to conversations about technology, product, ideas — and anything else worth turning over.',
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
        'Today I am an **AI Agent Engineer** at [NIO](https://www.nio.com/), building **enterprise agent systems** for manufacturing operations across **LLMs and RAG**, **workflow automation** and **data-driven decision support**. Before that I researched **NLP and LLMs** at the [Rutgers CAIT Lab](https://cait.rutgers.edu/), and shipped large-scale web applications at a **Tencent × Shanghai Metro** joint venture.',
        'I work across the stack — from **responsive, detail-obsessed interfaces** to **dependable back-end services**, with real practice in **database design, API design, data pipelines and containerised deployment**.',
        'What I actually care about is that the result is **fast, maintainable and kind to the person using it**. A system that holds up technically *and* feels natural in the hand is the whole goal.',
      ],
      zh: [
        '现在我在 [蔚来](https://www.nio.com/) 担任 **AI Agent 工程师**，面向制造运营构建**企业级 Agent 系统**，围绕 **LLM / RAG**、**流程自动化**与**数据驱动的决策支持**展开。此前我在 [Rutgers CAIT Lab](https://cait.rutgers.edu/) 从事 **NLP / LLM** 研究，并在**腾讯 × 上海地铁**合资公司参与大规模 Web 应用的工程建设。',
        '在技术上我横跨前后端——既关注**界面的响应速度与交互细节**，也重视**后端服务的稳定与可靠**，并持续实践**数据库与 API 设计、数据处理流程和容器化部署**。',
        '我真正在意的，是做出来的东西**足够快、便于维护、对人友好**。既能经得起技术推敲，也能让人用得自然顺手。',
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
      { id: 'writing', label: { en: 'Tech writing & product teardowns', zh: '技术博客与产品评测' } },
      { id: 'games', label: { en: 'Games & interaction design', zh: '游戏与交互设计' } },
      { id: 'f1', label: { en: 'Formula 1 race weekends', zh: 'F1 赛事' } },
      { id: 'film', label: { en: 'Film, series & documentaries', zh: '电影、剧集与纪录片' } },
      { id: 'photo', label: { en: 'Photography & video', zh: '摄影与视频创作' } },
    ] satisfies readonly { id: string; label: Localized }[],
    quote: {
      en: 'No matter what your dream is, you have to dedicate yourself entirely to it.',
      zh: '无论你的梦想是什么，你都必须全身心投入其中。',
    },
    quoteAuthor: { en: 'Ayrton Senna', zh: '艾尔顿 · 塞纳' },
  },
  footer: {
    motto: { en: 'Keep frosty & curious.', zh: '保持好奇，持续探索。' },
    rights: { en: 'All rights reserved.', zh: '保留所有权利。' },
    /*
     * The repository behind *this page*, not the profile the contact section
     * already links to. A site whose whole argument is "an engineer built this"
     * should be willing to show the receipts.
     *
     * Deliberately not `ui.actions.source`, which every project card uses and
     * which held exactly this string. The word is the same but the referent is
     * not - on a card "Source" means that project's, here it means the page you
     * are standing on - and only one of the two can afford to leave it implied.
     * Do not merge them back together.
     */
    source: { en: "This site's source", zh: '本站源码' },
    sourceHint: { en: 'Open the repository on GitHub', zh: '在 GitHub 上打开仓库' },
  },
  a11y: {
    /* Named per platform rather than a single "QR code": this is the whole of
       what a screen reader gets for an image that is otherwise unreadable, and
       which app it opens is the only useful thing to say about it. */
    wechatQr: { en: 'WeChat QR code', zh: '微信二维码' },
    avatar: { en: 'Portrait of Daniel Zhou', zh: '周昱廷的头像' },
  },
} as const
