import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { applyRefractionMode } from './lib/glassSupport'
import './styles/base.css'

// Probe before the first React commit so no surface ever paints at the wrong
// tier and then swaps under the visitor.
applyRefractionMode()

const container = document.getElementById('root')
if (!container) throw new Error('#root is missing from index.html')

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
