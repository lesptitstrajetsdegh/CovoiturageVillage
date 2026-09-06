import { Route, Routes } from 'react-router-dom'
import { Account } from './pages/account'
import { Notifications } from './pages/notifications'
import { Auth } from './pages/auth'
import { Home } from './pages/home'
import { Family } from './pages/family'
import { Admin } from './pages/admin'
import { Navigation } from './components/Navigation'
import Rules from './pages/Rules'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Legal from './pages/Legal'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <>
      <Navigation />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/account/*" element={<Account />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/family" element={<Family />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      <Footer />

    </>
  )
}