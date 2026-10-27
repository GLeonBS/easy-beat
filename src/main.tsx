import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { installKeyboard } from './input'
import { App } from './ui/App'

installKeyboard()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
