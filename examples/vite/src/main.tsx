import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@krds.ui/react/style'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
