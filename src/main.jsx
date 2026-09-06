import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, useNavigate } from 'react-router-dom'
import { NeonAuthUIProvider } from '@neondatabase/auth/react/ui'
import '@neondatabase/auth/ui/css'
import './index.css'
import App from './App.jsx'
import { auth } from './lib/auth'

function AuthProvider({ children }) {
  const navigate = useNavigate()

  return (
    <NeonAuthUIProvider
      authClient={auth}
      navigate={navigate}
      redirectTo="/account"
      Link={({ children, href }) => <Link to={href}>{children}</Link>}
    >
      {children}
    </NeonAuthUIProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)