import type { Localized } from './types'

/**
 * Icons are served from jsDelivr rather than bundled. 35 marks would add real
 * weight to the bundle for decoration that sits below the fold; each <img> is
 * lazy + async-decoded and the grid reserves its box, so a slow or blocked CDN
 * degrades to a labelled cell instead of a layout shift.
 */
const devicon = (path: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/${path}.svg`
const simple = (slug: string) => `https://cdn.simpleicons.org/${slug}`

export interface StackItem {
  name: string
  icon: string
  href: string
  /** Marks that are near-black or near-white and vanish in one of the themes. */
  adaptive?: boolean
}

export interface StackGroup {
  id: string
  label: Localized
  items: readonly StackItem[]
}

export const techStack: readonly StackGroup[] = [
  {
    id: 'languages',
    label: { en: 'Languages', zh: '编程语言' },
    items: [
      { name: 'TypeScript', icon: devicon('typescript/typescript-original'), href: 'https://www.typescriptlang.org/' },
      { name: 'JavaScript', icon: devicon('javascript/javascript-original'), href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
      { name: 'Python', icon: devicon('python/python-original'), href: 'https://www.python.org/' },
      { name: 'Java', icon: devicon('java/java-original'), href: 'https://www.java.com/' },
      { name: 'Go', icon: devicon('go/go-original'), href: 'https://go.dev/' },
    ],
  },
  {
    id: 'frontend',
    label: { en: 'Front-end', zh: '前端' },
    items: [
      { name: 'React', icon: devicon('react/react-original'), href: 'https://react.dev/' },
      { name: 'Next.js', icon: devicon('nextjs/nextjs-original'), href: 'https://nextjs.org/', adaptive: true },
      { name: 'Vue.js', icon: devicon('vuejs/vuejs-original'), href: 'https://vuejs.org/' },
      { name: 'Vite', icon: devicon('vitejs/vitejs-original'), href: 'https://vite.dev/' },
      { name: 'Sass', icon: devicon('sass/sass-original'), href: 'https://sass-lang.com/' },
    ],
  },
  {
    id: 'backend',
    label: { en: 'Back-end', zh: '后端' },
    items: [
      { name: 'Node.js', icon: devicon('nodejs/nodejs-original'), href: 'https://nodejs.org/' },
      { name: 'Spring Boot', icon: devicon('spring/spring-original'), href: 'https://spring.io/projects/spring-boot' },
      { name: 'FastAPI', icon: simple('fastapi'), href: 'https://fastapi.tiangolo.com/' },
      { name: 'Django', icon: devicon('django/django-plain'), href: 'https://www.djangoproject.com/', adaptive: true },
      { name: 'Flask', icon: devicon('flask/flask-original'), href: 'https://flask.palletsprojects.com/', adaptive: true },
      { name: 'Gin', icon: simple('gin'), href: 'https://gin-gonic.com/' },
    ],
  },
  {
    id: 'data',
    label: { en: 'Data & Storage', zh: '数据与存储' },
    items: [
      { name: 'PostgreSQL', icon: devicon('postgresql/postgresql-original'), href: 'https://www.postgresql.org/' },
      { name: 'MySQL', icon: devicon('mysql/mysql-original'), href: 'https://www.mysql.com/' },
      { name: 'MongoDB', icon: devicon('mongodb/mongodb-original'), href: 'https://www.mongodb.com/' },
      { name: 'Redis', icon: devicon('redis/redis-original'), href: 'https://redis.io/' },
      { name: 'Apache Spark', icon: devicon('apachespark/apachespark-original'), href: 'https://spark.apache.org/' },
    ],
  },
  {
    id: 'ai',
    label: { en: 'AI & ML', zh: 'AI 与机器学习' },
    items: [
      { name: 'PyTorch', icon: devicon('pytorch/pytorch-original'), href: 'https://pytorch.org/' },
      { name: 'TensorFlow', icon: devicon('tensorflow/tensorflow-original'), href: 'https://www.tensorflow.org/' },
      { name: 'LangChain', icon: simple('langchain'), href: 'https://www.langchain.com/' },
      { name: 'Ollama', icon: simple('ollama'), href: 'https://ollama.com/', adaptive: true },
    ],
  },
  {
    id: 'infra',
    label: { en: 'Infra & DevOps', zh: '基础设施' },
    items: [
      { name: 'Docker', icon: devicon('docker/docker-original'), href: 'https://www.docker.com/' },
      { name: 'Kubernetes', icon: devicon('kubernetes/kubernetes-original'), href: 'https://kubernetes.io/' },
      { name: 'Git', icon: devicon('git/git-original'), href: 'https://git-scm.com/' },
      { name: 'GitHub Actions', icon: simple('githubactions'), href: 'https://github.com/features/actions' },
    ],
  },
]

/**
 * Same shape as `techStack`, but rendered as one labelled row per group rather
 * than as cards — the categories here are short (two or three marks each), and
 * a grid of eleven near-empty cards would be a lot of chrome for very little
 * content.
 */
export const toolStack: readonly StackGroup[] = [
  {
    id: 'editors',
    label: { en: 'Editors', zh: '编辑器' },
    items: [
      { name: 'VS Code', icon: devicon('vscode/vscode-original'), href: 'https://code.visualstudio.com/' },
      { name: 'Cursor', icon: simple('cursor'), href: 'https://cursor.com/', adaptive: true },
      { name: 'JetBrains', icon: devicon('jetbrains/jetbrains-original'), href: 'https://www.jetbrains.com/' },
      { name: 'Jupyter', icon: devicon('jupyter/jupyter-original'), href: 'https://jupyter.org/' },
    ],
  },
  {
    id: 'ai',
    label: { en: 'AI Coding', zh: 'AI 编程' },
    items: [
      { name: 'Claude Code', icon: `${simple('claude')}/CC785C`, href: 'https://www.anthropic.com/claude-code' },
      { name: 'Codex', icon: simple('openai'), href: 'https://developers.openai.com/codex', adaptive: true },
      { name: 'Copilot', icon: simple('githubcopilot'), href: 'https://github.com/features/copilot', adaptive: true },
      {
        name: 'DeepSeek Harness',
        icon: `${simple('deepseek')}/4D6BFE`,
        href: 'https://github.com/deepseek-ai/DeepSeek-Harness',
      },
    ],
  },
  {
    id: 'craft',
    label: { en: 'Design & API', zh: '设计与接口' },
    items: [
      { name: 'Figma', icon: devicon('figma/figma-original'), href: 'https://www.figma.com/' },
      { name: 'Postman', icon: devicon('postman/postman-original'), href: 'https://www.postman.com/' },
    ],
  },
  {
    id: 'os',
    label: { en: 'Operating Systems', zh: '操作系统' },
    items: [
      { name: 'Windows', icon: devicon('windows11/windows11-original'), href: 'https://www.microsoft.com/windows' },
      { name: 'macOS', icon: devicon('apple/apple-original'), href: 'https://www.apple.com/macos/', adaptive: true },
      { name: 'Linux', icon: devicon('linux/linux-original'), href: 'https://ubuntu.com/desktop/' },
    ],
  },
  {
    id: 'network',
    label: { en: 'Networking', zh: '网络' },
    items: [
      { name: 'Tailscale', icon: simple('tailscale'), href: 'https://tailscale.com/', adaptive: true },
      { name: 'ZeroTier', icon: simple('zerotier'), href: 'https://www.zerotier.com/' },
    ],
  },
]
