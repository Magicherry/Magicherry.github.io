import type { Localized } from './types'

/**
 * Copy for the interactive agent window in the hero.
 *
 * The window behaves like a small chat client. Every sidebar entry, every
 * suggestion chip and every typed question resolves to a *topic*, and each
 * topic has a question (what appears in the user's bubble when it is opened
 * from the sidebar) and a lead (the first line of the reply). The bodies of
 * the replies are drawn from the real content files - projects.ts,
 * experience.ts, profile.ts, stacks.ts - so the window never says anything the
 * rest of the page does not.
 */

export type Topic =
  | 'intro'
  | 'about'
  | 'projects'
  | 'experience'
  | 'github'
  | 'contact'
  | 'stack'
  | 'nio'
  | 'rail'
  | 'unknown'

export const agent = {
  a11y: {
    en: 'Magicherry agent: an interactive introduction. Pick a topic or ask a question.',
    zh: 'Magicherry 智能体：可交互的自我介绍。选择话题或直接提问。',
  },
  newSession: { en: 'New session', zh: '新会话' },
  nav: {
    projects: { en: 'Projects', zh: '项目' },
    experience: { en: 'Experience', zh: '经历' },
    github: { en: 'GitHub', zh: 'GitHub' },
  },
  workspace: { en: 'Workspace', zh: '工作区' },
  folder: { en: 'Portfolio', zh: '作品集' },
  /* The sessions in the Portfolio folder. Each opens a topic. */
  sessions: [
    { topic: 'intro', label: { en: 'Meet Magicherry', zh: '认识 Magicherry' } },
    { topic: 'nio', label: { en: 'What I do at NIO', zh: '在蔚来做什么' } },
    { topic: 'rail', label: { en: 'Railway incident research', zh: '铁路事故分类研究' } },
    { topic: 'github', label: { en: 'Recent code activity', zh: '最近的代码动态' } },
  ] satisfies readonly { topic: Topic; label: Localized }[],
  folders: [
    { topic: 'nio', label: { en: 'NIO manufacturing ops', zh: '蔚来制造运营' } },
    { topic: 'projects', label: { en: 'Side projects', zh: '个人项目' } },
  ] satisfies readonly { topic: Topic; label: Localized }[],

  /* What the user "asks" when a topic is opened from the sidebar or a chip. */
  questions: {
    about: { en: "I'd like to know more about you", zh: '想多了解一些关于你的事' },
    intro: { en: 'Could you introduce yourself?', zh: '可以介绍一下你自己吗？' },
    projects: { en: 'Show me your projects', zh: '看看你做过的项目' },
    experience: { en: 'Walk me through your experience', zh: '介绍一下你的工作经历' },
    github: { en: 'What have you been coding lately?', zh: '最近在写什么代码？' },
    contact: { en: 'How can I reach you?', zh: '怎么联系你？' },
    stack: { en: "What's your stack?", zh: '你常用哪些技术？' },
    nio: { en: 'What do you do at NIO?', zh: '你在蔚来具体做什么？' },
    rail: { en: 'Tell me about the railway incident research', zh: '讲讲铁路事故分类的研究' },
  } satisfies Record<Exclude<Topic, 'unknown'>, Localized>,

  /* The first line of each reply. */
  leads: {
    projects: { en: "Here's what I've built - open any of them:", zh: '这些是我做过的项目，点开可以看源码：' },
    experience: { en: 'My experience, newest first:', zh: '我的经历，从最近的开始：' },
    github: { en: 'My GitHub activity over the past year:', zh: '这是我过去一年在 GitHub 上的动态：' },
    contact: { en: 'Any of these will reach me:', zh: '这些方式都能找到我：' },
    stack: { en: 'What I reach for, by area:', zh: '我常用的技术，按方向分：' },
    nio: {
      en: "At NIO I'm a Business Analyst Assistant and AI Agent Engineer. Mainly three things:",
      zh: '我在蔚来担任业务分析助理兼 AI Agent 工程师，主要做三件事：',
    },
    rail: { en: 'At Rutgers CAIT the research covered:', zh: '在 Rutgers CAIT 的研究主要包括：' },
    unknown: {
      en: "That's beyond what this demo agent knows. Try one of the topics just above the message box.",
      zh: '这个问题超出了这个演示助手的范围，可以试试输入框上方的这些话题。',
    },
  },

  greeting: { en: 'Hi! What would you like to know?', zh: '你好！想了解我的哪方面？' },

  /* Suggestion chips, pinned above the composer. */
  chips: [
    /* Worded as the visitor's question, like the other chips are its topics:
       the visitor is the one asking, so it is "about you", not "about me". */
    { topic: 'about', label: { en: 'About you', zh: '关于你' } },
    { topic: 'projects', label: { en: 'Projects', zh: '项目' } },
    { topic: 'experience', label: { en: 'Experience', zh: '经历' } },
    { topic: 'github', label: { en: 'GitHub activity', zh: 'GitHub 动态' } },
    { topic: 'stack', label: { en: 'Stack', zh: '技术栈' } },
    { topic: 'contact', label: { en: 'Contact', zh: '联系方式' } },
  ] satisfies readonly { topic: Topic; label: Localized }[],

  seeAbout: { en: 'More about me on the page', zh: '在页面中查看关于我' },
  seeAllProjects: { en: 'See all on the page', zh: '在页面中查看全部' },
  seeStack: { en: 'Full stack on the page', zh: '在页面中查看完整技术栈' },
  seeExperience: { en: 'Full experience on the page', zh: '在页面中查看完整经历' },
  openGithub: { en: 'Open GitHub profile', zh: '打开 GitHub 主页' },
  source: { en: 'Source', zh: '源码' },
  internal: { en: 'Internal', zh: '内部项目' },
  current: { en: 'Current', zh: '在职' },
  education: { en: 'Education', zh: '教育背景' },

  github: {
    total: { en: '{n} contributions in the last year', zh: '过去一年共 {n} 次贡献' },
    less: { en: 'Less', zh: '少' },
    more: { en: 'More', zh: '多' },
    repos: { en: 'Recently updated', zh: '最近更新的仓库' },
    publicRepos: { en: 'public repos', zh: '个公开仓库' },
    followers: { en: 'followers', zh: '位关注者' },
    loading: { en: 'Reading GitHub…', zh: '正在读取 GitHub…' },
    error: {
      en: "Couldn't reach GitHub just now - the profile has it all:",
      zh: '暂时读取不到 GitHub 数据，可以直接去主页看：',
    },
    contributionsOn: { en: '{n} on {date}', zh: '{date}：{n} 次' },
  },

  wechat: { en: 'WeChat - scan to add', zh: '微信扫码添加' },
  inputLabel: { en: 'Ask Magicherry', zh: '向 Magicherry 提问' },
  send: { en: 'Send', zh: '发送' },
} as const

/**
 * Routes a typed question to a topic by keyword. Deliberately simple and
 * deliberately honest: this is a demo with fixed answers, not a model, and
 * anything it cannot place gets a reply that says so and offers the topics it
 * does know.
 */
const ROUTES: readonly [Topic, RegExp][] = [
  ['github', /github|代码|commit|贡献|提交|仓库|repo|coding|code/i],
  ['nio', /蔚来|\bnio\b|制造|manufactur/i],
  ['rail', /铁路|rail|cait|deberta|事故|incident|研究|research/i],
  ['projects', /项目|作品|project|portfolio|built|做过/i],
  ['experience', /经历|经验|工作|实习|履历|简历|experience|\bwork|\bjob|career|\bcv\b|resume|intern/i],
  ['stack', /技术|技能|栈|框架|语言|stack|tech|skill|framework|language/i],
  ['contact', /联系|邮箱|邮件|微信|电话|领英|contact|email|mail|wechat|phone|linkedin|reach/i],
  /* Before `intro`: "about you" asks for the longer self-portrait, not the
     one-paragraph introduction. */
  ['about', /关于你|关于我|兴趣|爱好|理念|about you|about me|yourself|interest|hobb/i],
  ['intro', /介绍|你是谁|你好|hello|\bhi\b|who are you|introduce/i],
]

export function routeTopic(text: string): Topic {
  for (const [topic, pattern] of ROUTES) if (pattern.test(text)) return topic
  return 'unknown'
}
