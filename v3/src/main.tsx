import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LocaleProvider } from '@/lib/i18n'
import { applyRefractionMode } from '@/lib/refraction'
import App from './App'
import './styles/tokens.css'
import './styles/base.css'

const root = document.getElementById('root')
if (!root) throw new Error('#root is missing from index.html')

/* Before the first commit, so the header never paints one frame on the wrong
   tier and then swaps. */
applyRefractionMode()

createRoot(root).render(
  <StrictMode>
    <LocaleProvider>
      <App />
    </LocaleProvider>
  </StrictMode>,
)
