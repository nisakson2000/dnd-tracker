import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { loadSettings, applySettings } from './utils/applySettings'

// Apply theme/scale settings before first render
applySettings(loadSettings());

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
