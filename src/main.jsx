import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { GameProvider } from './hooks/useGame'
import Landing from './pages/Landing'
import './styles/global.css'

const isLandingRoute = window.location.pathname === '/landing' || window.location.pathname === '/landing/'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isLandingRoute ? <Landing/> : <GameProvider><App/></GameProvider>}
  </React.StrictMode>,
)
