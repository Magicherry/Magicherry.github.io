import GlassDefs from './components/glass/GlassDefs'
import Backdrop from './components/fx/Backdrop'
import Nav, { ScrollProgress } from './components/layout/Nav'
import Preloader from './components/layout/Preloader'
import Footer from './components/layout/Footer'
import Hero from './sections/Hero'
import About from './sections/About'
import Stack from './sections/Stack'
import Work from './sections/Work'
import Projects from './sections/Projects'
import Contact from './sections/Contact'
import { LocaleProvider, useLocale } from './lib/i18n'
import { ThemeProvider } from './lib/theme'
import { ScrollProvider } from './lib/scroll'
import { IntroProvider, useIntro } from './lib/intro'

function Shell() {
  const { locale } = useLocale()
  const { markReady } = useIntro()

  return (
    <>
      <a className="skip-link" href="#main">
        {locale === 'zh' ? '跳到主要内容' : 'Skip to content'}
      </a>

      <GlassDefs />
      <Backdrop />
      <Preloader onDone={markReady} />
      <ScrollProgress />
      <Nav />

      {/*
       * Sections are in the DOM from the first commit, so the curtain lifts onto
       * a page that is already laid out. Only the *entrance animations* wait on
       * the intro flag - mounting the content late would show a blank frame and
       * force a full layout pass at the worst possible moment.
       */}
      {/* tabindex="-1" so the skip link can actually land focus here; without
          it the browser scrolls to #main and leaves focus at the document root,
          which defeats the point of the link. */}
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Stack />
        <Work />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <IntroProvider>
          <ScrollProvider>
            <Shell />
          </ScrollProvider>
        </IntroProvider>
      </LocaleProvider>
    </ThemeProvider>
  )
}
