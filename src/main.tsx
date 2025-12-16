import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import { InstagramProvider } from './context/InstagramContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InstagramProvider>
      <App />
    </InstagramProvider>
  </StrictMode>,
)
