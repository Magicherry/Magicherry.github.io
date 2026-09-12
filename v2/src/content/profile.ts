import type { Localized } from './types'
// Safe in this direction only: copy.ts imports nothing but `./types`.
import { ui } from './copy'
import cvEn from '@/assets/cv/Yuting_Zhou_CV.pdf'
import cvZh from '@/assets/cv/Yuting_Zhou_CV_zh.pdf'
import avatar from '@/assets/avatar/avatar.png'
import portrait from '@/assets/photo/head-cutout.png'
import wechatQr from '@/assets/about/social/Wechat.jpg'
/*
 * Bundled rather than served from a CDN like every other mark here, because
 * there is no icon CDN that carries it: simple-icons has only the monochrome
 * glyph, and the rounded-square app icon exists solely on xiaohongshu.com. That
 * leaves hotlinking `picasso-static.xiaohongshu.com/fe-platform/<sha1>.png`,
 * which is a content-hashed path that rotates whenever they redeploy - and a
 * dead mark is worse than a locally-held 2.4kB.
 *
 * It is their `apple-touch-icon` at 180x180. The favicon is the same artwork but
 * 32x32 inside an .ico, which is under half the pixels this needs on a 2x screen.
 */
import xiaohongshuMark from '@/assets/marks/xiaohongshu.png'

export const profile = {
  /** The small mark in the nav capsule. */
  avatar,
  /** The full-bleed photo on the hero card. */
  portrait,
  name: { en: 'Daniel Zhou', zh: '周昱廷' } satisfies Localized,
  handle: 'Magicherry',
  /*
   * The facts on the hero card. Titles and company are separate fields rather
   * than one pre-joined string so the company can carry its own link, and so the
   * two locales are not each responsible for getting the "@" in the right place.
   */
  current: {
    /* Two concurrent titles at one employer, so they share the company suffix
       rather than each getting a row of their own. */
    titles: [
      { en: 'AI Agent Engineer', zh: 'AI Agent 工程师' },
      { en: 'Business Planning Assistant', zh: '业务规划助理' },
    ] satisfies readonly Localized[],
    /* The registered name, as the CV prints it, now that it has a row to itself
       - "NIO" was a shorthand the old `title @ company` line could not afford to
       spell out. */
    company: {
      en: 'Shanghai NIO Automobile Co., Ltd.',
      zh: '上海蔚来汽车有限公司',
    } satisfies Localized,
    companyUrl: 'https://www.nio.com/',
  },
  location: { en: 'Shanghai, China', zh: '中国 · 上海' } satisfies Localized,
  cv: { en: cvEn, zh: cvZh } satisfies Localized,
  /* The saved-as name, not the asset path - the PDFs are copied in from the
     Resume repo and keep their filenames there. */
  cvFileName: { en: 'Daniel_Zhou_CV.pdf', zh: '周昱廷-简历.pdf' } satisfies Localized,
  /* This site's own repository. Not `Localized` and not in the social list: it
     is one URL in either language, and it is the page you are standing on
     rather than a way to reach the person who wrote it. */
  repo: 'https://github.com/Magicherry/Magicherry.github.io',
} as const

/** Strings the typewriter cycles through under the hero name. */
export const roles: Localized<readonly string[]> = {
  en: [
    'AI Agent Engineer',
    'Front-end Developer',
    'Full-stack Developer',
    'Business Planning Analyst',
    'Machine Learning Engineer',
    'Creative Developer',
  ],
  zh: [
    'AI Agent 工程师',
    '前端开发工程师',
    '全栈开发工程师',
    '业务规划分析师',
    '机器学习工程师',
    '创意开发者',
  ],
}

/** Wraps a value that happens to read the same in every locale. */
const same = (value: string): Localized => ({ en: value, zh: value })

export interface SocialLink {
  id: string
  label: Localized
  /** Localized because the email address differs by locale - see below. */
  href: Localized
  /**
   * The line under the label. For the platforms it describes where the link
   * goes; for email and phone it *is* the address, because that is the thing a
   * visitor actually wants to read and copy.
   */
  hint: Localized
  /**
   * The platform's own mark, in its own colours. Absent for email and phone,
   * which are protocols rather than products and have no official logo - those
   * fall back to a line icon in the site's accent.
   *
   * `cdn.simpleicons.org/<slug>` with no colour parameter serves the brand's
   * registered hex, so the colours here are the official ones rather than
   * something eyeballed.
   */
  mark?: string
  /** Brand hex, used to tint the row on hover. Omitted where it reads badly in
   *  one of the two themes. */
  brand?: string
  /** Near-black marks that would vanish against a dark background. */
  adaptive?: boolean
  /**
   * The mark is a full app icon with its own background, not a glyph on
   * transparent. It gets a corner radius so its ground is clipped to a squircle
   * rather than left as a hard-edged square among silhouettes.
   */
  tile?: boolean
  /**
   * Opens a QR overlay instead of navigating, and carries the code with it.
   *
   * This used to be `overlay: 'wechat'`, with the image and its alt text
   * hardcoded at the other end in Contact.tsx - which meant the *mechanism* was
   * general but the page could only ever show one code. Holding the asset on the
   * entry that needs it makes a second one data, not a branch.
   *
   * A code rather than a link because these are phone-first apps: a desktop
   * visitor cannot follow the URL anyway, and a phone visitor can long-press the
   * image. The alt text is localized because it is the only thing a screen
   * reader gets - "QR code" alone does not say whose, or for what.
   */
  qr?: { image: string; alt: Localized }
  /**
   * Puts this string on the clipboard instead of navigating.
   *
   * For the handles that are not addresses. Discord is the case it exists for:
   * a profile URL there is `/users/<numeric id>`, there is no route for a
   * username, so the handle cannot be turned into a link no matter how it is
   * dressed up - and a row that looks like a link and 404s is worse than one
   * that plainly hands you the name. Copying is also what you actually do with
   * it, since the only way to use a Discord handle is to paste it into Add
   * Friend.
   */
  copy?: string
}

// LinkedIn was withdrawn from simple-icons over trademark, so its mark comes
// from devicon instead - still the official asset, just a different host.
const simpleMark = (slug: string) => `https://cdn.simpleicons.org/${slug}`

/*
 * Email is locale-aware, matching what the two CVs already do: the English
 * resume prints the Gmail address, the Chinese one the 163 address. A reader on
 * the Chinese side of the site is likely mailing from inside the GFW, where
 * Gmail is a dead end.
 *
 * Everything here is already public in the downloadable CV, so putting it in the
 * page adds convenience rather than exposure - with the caveat that plain text
 * in HTML is far easier to harvest than the same string inside a PDF.
 */
export const socials: readonly SocialLink[] = [
  {
    id: 'email',
    label: { en: 'Email', zh: '邮箱' },
    href: { en: 'mailto:zyt680129@gmail.com', zh: 'mailto:zyt680129@163.com' },
    hint: { en: 'zyt680129@gmail.com', zh: 'zyt680129@163.com' },
  },
  {
    id: 'phone',
    label: { en: 'Phone', zh: '电话' },
    href: same('tel:+8613681756546'),
    hint: same('+86 136 8175 6546'),
  },
  {
    id: 'github',
    label: same('GitHub'),
    href: same('https://github.com/Magicherry'),
    hint: { en: '@Magicherry', zh: '@Magicherry' },
    mark: simpleMark('github'),
    // #181717 - invisible on a dark card, so the mark is inverted there and the
    // hover tint falls back to the site accent.
    adaptive: true,
  },
  {
    id: 'linkedin',
    label: same('LinkedIn'),
    href: same('https://www.linkedin.com/in/yuting-zhou-magicherry/'),
    hint: { en: 'yuting-zhou-magicherry', zh: 'yuting-zhou-magicherry' },
    mark: 'https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/linkedin/linkedin-original.svg',
    brand: '#0076b2',
  },
  {
    id: 'wechat',
    label: { en: 'WeChat', zh: '微信' },
    href: same('#wechat'),
    hint: { en: 'Show QR code', zh: '显示二维码' },
    mark: simpleMark('wechat'),
    brand: '#07c160',
    qr: { image: wechatQr, alt: ui.a11y.wechatQr },
  },
  {
    id: 'discord',
    label: same('Discord'),
    /* Never followed - the click is intercepted - but a real fragment rather
       than `#`, so the row still has a target if scripting is off. */
    href: same('#discord'),
    /* The handle itself, because it is the thing you take away from this row. */
    hint: same('magicherry'),
    copy: 'magicherry',
    mark: simpleMark('discord'),
    brand: '#5865f2',
  },
  {
    id: 'bilibili',
    label: same('Bilibili'),
    href: same('https://space.bilibili.com/155876727'),
    hint: { en: 'space.bilibili.com', zh: 'Bilibili 主页' },
    mark: simpleMark('bilibili'),
    brand: '#00a1d6',
  },
  {
    id: 'xiaohongshu',
    /*
     * `rednote`, and the lowercase is the brand's rather than a slip - it is how
     * the app has been listed in both stores since the 2024-25 rebrand (RED ->
     * REDnote -> rednote). "Xiaohongshu" is the pinyin of the Chinese name and
     * what international press uses, but it is not the English brand, and this
     * site already resolves that the same way one line above: 微信's English
     * label is WeChat, not Weixin.
     *
     * The id stays `xiaohongshu` because it keys the simple-icons slug.
     */
    label: { en: 'rednote', zh: '小红书' },
    href: same('https://www.xiaohongshu.com/user/profile/64c5b9f2000000000e024af2'),
    /* The number rather than the URL, for the same reason GitHub's hint is the
       handle: that path is a 24-character object id nobody reads, while the
       Xiaohongshu ID is what you would actually type into the app's search. */
    hint: { en: 'ID 6193834538', zh: '小红书号 6193834538' },
    mark: xiaohongshuMark,
    /* The only mark on this list that is a *tile* rather than a glyph - the app
       icon carries its own red ground, so it needs the corner radius the others
       have no use for. See `.linkIcon img[data-tile]`. */
    tile: true,
    brand: '#ff2442',
  },
]

/** Headline numbers for the hero's stat strip. */
export const stats: readonly { value: string; label: Localized }[] = [
  { value: '2026', label: { en: 'MSc graduate', zh: '届硕士毕业生' } },
  { value: '9', label: { en: 'Past projects', zh: '个历史项目' } },
  { value: '2', label: { en: 'Languages spoken', zh: '门工作语言' } },
]
