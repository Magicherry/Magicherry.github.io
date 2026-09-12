import type { Localized } from './types'
import openaiMark from '@/assets/marks/openai.svg'
/*
 * fnOS is in neither catalogue. Its official wordmark sets the bull glyph beside
 * near-black CJK type, which vanishes on the dark theme, and its app icon is a
 * filled blue tile rather than the flat glyph every other mark here is - so this
 * is the bull alone, cropped from the official logo and squared.
 */
import fnosMark from '@/assets/marks/fnos.png'
/*
 * Straight from each vendor's own site, because simple-icons cannot represent
 * either one. Every icon in that catalogue is a single monochrome path filled
 * with the brand's registered hex, which works for a logo that *is* a
 * silhouette and fails for a logo that is a coloured tile: LM Studio's
 * registered hex is #000000, so the catalogue hands back a black rectangle of
 * bars where the real mark is a violet gradient, and LangChain's blue glyph
 * loses the near-black ground it is drawn on.
 *
 * LangChain publishes theirs as a 550-byte SVG, so that is what this is - the
 * rounded rect and two strokes, vector and exact. LM Studio ships no vector at
 * all; the 192x192 PNG behind their favicon and apple-touch-icon is the largest
 * official raster there is.
 */
import langchainMark from '@/assets/marks/langchain.svg'
import lmstudioMark from '@/assets/marks/lmstudio.png'
/*
 * Django, Flask and Gin, likewise from the projects themselves.
 *
 * Flask is the one that was actually wrong rather than merely generic. devicon
 * draws it as a black horn, so it carried `adaptive` to survive the dark theme -
 * but the icon the project ships is teal (#3babc3), legible on both grounds and
 * needing no inversion at all. The flag was correcting a problem the real logo
 * does not have.
 *
 * Django's is a tile, dark green with a white "dj", so it drops `adaptive` for
 * the same reason the two above do: inverting a coloured ground recolours it.
 * Gin's is the gopher-in-a-glass mascot - the catalogue reduces it to a plain
 * martini outline, which is a different drawing, not a simplified one.
 */
import djangoMark from '@/assets/marks/django.png'
import flaskMark from '@/assets/marks/flask.svg'
import ginMark from '@/assets/marks/gin.png'

/**
 * Icons are served from jsDelivr rather than bundled. 35 marks would add real
 * weight to the bundle for decoration that sits below the fold; each <img> is
 * lazy + async-decoded and the grid reserves its box, so a slow or blocked CDN
 * degrades to a labelled cell instead of a layout shift.
 *
 * The exceptions are all above, and they fall into two kinds. OpenAI's is a
 * failure: `cdn.simpleicons.org/openai` started returning 404 even though the
 * npm package still ships `icons/openai.svg`, the render service's slug index
 * and the package contents having drifted apart - and a mark that has already
 * disappeared once is not worth re-hosting on a second catalogue. The rest are
 * a mismatch: fnOS, LangChain and LM Studio have logos the catalogues cannot
 * carry, being coloured tiles rather than silhouettes.
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
  /**
   * The mark is a filled tile with its own ground, not a glyph on transparent.
   *
   * Gets a corner radius so a vendor who shipped a hard-edged square lands in
   * the same shape as one who rounded it themselves. Never combine with
   * `adaptive`: inverting a coloured tile does not rescue it, it recolours it.
   */
  tile?: boolean
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
      { name: 'Django', icon: djangoMark, href: 'https://www.djangoproject.com/', tile: true },
      { name: 'Flask', icon: flaskMark, href: 'https://flask.palletsprojects.com/' },
      { name: 'Gin', icon: ginMark, href: 'https://gin-gonic.com/' },
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
      { name: 'LangChain', icon: langchainMark, href: 'https://www.langchain.com/', tile: true },
      { name: 'LangGraph', icon: simple('langgraph'), href: 'https://www.langchain.com/langgraph' },
      { name: 'Ollama', icon: simple('ollama'), href: 'https://ollama.com/', adaptive: true },
      { name: 'LM Studio', icon: lmstudioMark, href: 'https://lmstudio.ai/', tile: true },
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
      /* These two used to pin a hex - /CC785C and /4D6BFE - which is exactly the
         eyeballing the note at the top of this file says the catalogue exists to
         avoid. Both had since drifted from the registered values (#D97757 and
         #5786FE), so the override was making them subtly wrong rather than
         safer. Dropped: no colour parameter means the brand's own hex. */
      { name: 'Claude Code', icon: simple('claude'), href: 'https://www.anthropic.com/claude-code' },
      { name: 'Codex', icon: openaiMark, href: 'https://developers.openai.com/codex', adaptive: true },
      { name: 'Copilot', icon: simple('githubcopilot'), href: 'https://github.com/features/copilot', adaptive: true },
      {
        name: 'DeepSeek Harness',
        icon: simple('deepseek'),
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
      { name: 'Ubuntu', icon: devicon('ubuntu/ubuntu-original'), href: 'https://ubuntu.com/desktop/' },
      { name: 'Fedora', icon: devicon('fedora/fedora-original'), href: 'https://fedoraproject.org/' },
      { name: 'fnOS', icon: fnosMark, href: 'https://www.fnnas.com/' },
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

/**
 * Professional certifications, as printed on the CV.
 *
 * Issuer and credential are separate fields rather than one string, because the
 * issuer is the only part with a logo and the two localize independently: the
 * Chinese CV keeps NVIDIA's course titles in English but writes the other two
 * issuers as 阿里云 and 华为. Splitting them means neither has to be invented in
 * the locale the CV does not spell out.
 */
export interface Certification {
  id: string
  /** The credential, without the issuer - that is the line beneath it. */
  name: Localized
  issuer: Localized
  icon: string
  /**
   * The issuer's certification programme, not a verification link. These are
   * printed credentials rather than badges with public proof URLs, so the link
   * says what the qualification *is* instead of implying it can be checked here.
   */
  href: string
}

export const certifications: readonly Certification[] = [
  {
    id: 'nvidia-nlp',
    name: { en: 'Transformer-Based NLP', zh: 'Transformer-Based NLP' },
    issuer: { en: 'NVIDIA', zh: 'NVIDIA' },
    icon: simple('nvidia'),
    href: 'https://www.nvidia.com/en-us/training/',
  },
  {
    id: 'nvidia-dl',
    name: { en: 'Intro to Deep Learning', zh: 'Intro to Deep Learning' },
    issuer: { en: 'NVIDIA', zh: 'NVIDIA' },
    icon: simple('nvidia'),
    href: 'https://www.nvidia.com/en-us/training/',
  },
  {
    id: 'aliyun-aca',
    name: { en: 'ACA (Big Data)', zh: 'ACA（大数据）' },
    issuer: { en: 'Alibaba Cloud', zh: '阿里云' },
    icon: simple('alibabacloud'),
    href: 'https://edu.alibabacloud.com/certification',
  },
  {
    id: 'huawei-hcia',
    name: { en: 'HCIA (Intelligent Computing)', zh: 'HCIA（智能计算）' },
    issuer: { en: 'Huawei', zh: '华为' },
    icon: simple('huawei'),
    href: 'https://e.huawei.com/en/talent/cert/',
  },
]
