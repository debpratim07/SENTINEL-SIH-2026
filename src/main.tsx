import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ConnectedWorkspace from './pages/ConnectedWorkspace'
import './index.css'
import { authCallbackRoute } from './lib/auth-callback'
import { ConnectedAuthProvider } from './context/ConnectedAuthContext'
import { ConnectedProjectProvider } from './context/ConnectedProjectContext'

const callback = authCallbackRoute(new URL(window.location.href))
if (callback.pathname !== window.location.pathname) {
  window.history.replaceState(null, '', `${callback.pathname}${window.location.search}${window.location.hash}`)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConnectedAuthProvider>
      <ConnectedProjectProvider>
        {callback.pathname === '/workspace'
          ? <ConnectedWorkspace authError={callback.error} />
          : <App authError={callback.error} />}
      </ConnectedProjectProvider>
    </ConnectedAuthProvider>
  </React.StrictMode>,
)
