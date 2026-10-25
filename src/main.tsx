import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { installTranslationResilience } from "translation-resilience";
import './index.css'
import App from './App.tsx'
installTranslationResilience();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
