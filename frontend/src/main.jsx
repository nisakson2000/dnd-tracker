import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { installGlobalErrorCapture } from './utils/logger'

installGlobalErrorCapture()

// Block browser shortcuts that don't make sense in a desktop app
document.addEventListener('keydown', (e) => {
  if (e.key === 'F3' || (e.ctrlKey && e.key === 'g')) {
    e.preventDefault();
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
