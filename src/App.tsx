import { useLocale } from '@/lib/i18n'
import { site } from '@/content/site'
import Backdrop from '@/components/fx/Backdrop'
import Header from '@/components/Header'
import Hero from '@/sections/Hero'
import About from '@/sections/About'
import Work from '@/sections/Work'
import Projects from '@/sections/Projects'
import Stack from '@/sections/Stack'
import Contact from '@/sections/Contact'
import Footer from '@/sections/Footer'
import BackToTop from '@/components/BackToTop'

export default function App() {
  const { t } = useLocale()

  return (
    <>
      <a className="skip-link" href="#about">
        {t(site.a11y.skip)}
      </a>
      <Backdrop />
      <Header />
      <main>
        <Hero />
        <About />
        <Work />
        <Projects />
        <Stack />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
