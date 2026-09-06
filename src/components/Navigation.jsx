import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../lib/auth'

export function Navigation() {
  const navigate = useNavigate()
  const session = auth.useSession()
  const user = session.data?.user
  const [unreadCount, setUnreadCount] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false) 
  const [adminUnreadCount, setAdminUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) {
      setUnreadCount(0)
      setIsAdmin(false)
      return
    }

    const loadUnreadCount = async () => {
      try {
        const response = await fetch('/api/notifications')

        if (!response.ok) {
          return
        }

        const data = await response.json()
        const notifications = data.notifications ?? []

        setUnreadCount(
          notifications.filter(
            (notification) => !notification.is_read,
          ).length,
        )
      } catch {
        // On ne bloque pas la navigation si les notifications ne peuvent pas être chargées.
      }
    }

    const loadAdminStatus = async () => {
      try {
        const response = await fetch('/api/admin-check')

        if (!response.ok) {
          setIsAdmin(false)
          return
        }

        const data = await response.json()
        setIsAdmin(data.isAdmin === true)
      } catch {
        setIsAdmin(false)
      }
    }

    const loadAdminUnreadCount = async () => {
      try {
        const response = await fetch('/api/admin-notifications')
    
        if (!response.ok) {
          setAdminUnreadCount(0)
          return
        }
    
        const data = await response.json()
    
        const unreadCount = (data.notifications ?? []).filter(
          (notification) => !notification.is_read,
        ).length
    
        setAdminUnreadCount(unreadCount)
      } catch {
        setAdminUnreadCount(0)
      }
    }

    loadUnreadCount()
    loadAdminStatus()
    loadAdminUnreadCount()

    window.addEventListener(
      'notifications-updated',
      loadUnreadCount,
    )

    window.addEventListener(
      'admin-notifications-updated',
      loadAdminUnreadCount,
    )

    return () => {
      window.removeEventListener(
        'notifications-updated',
        loadUnreadCount,
      )

      window.removeEventListener(
        'admin-notifications-updated',
        loadAdminUnreadCount,
      )

    }
  }, [user])

  if (session.isPending) {
    return null
  }

  const handleSignOut = async () => {
  await auth.signOut()
  navigate('/')
}

  return (
    <nav className="app-navigation">
      <Link to="/">Accueil</Link>

      {user ? (
        <>
          <span className="app-navigation-user">
            Connecté : {user.name}
          </span>

          <Link to="/account">Mon compte</Link>
          <Link to="/family">Mes trajets</Link>

          <Link to="/notifications">
            🔔 Notifications
            {unreadCount > 0 && ` (${unreadCount})`}
          </Link>

          {isAdmin && (
            <Link to="/admin">
              Console admin{adminUnreadCount > 0 && ` (${adminUnreadCount})`}
            </Link>
          )}

          <button type="button" onClick={handleSignOut}>
            Se déconnecter
          </button>
        </>
      ) : (
        <>
          <Link to="/auth/sign-in">Se connecter</Link>
          <Link to="/auth/sign-up">Créer un compte</Link>
        </>
      )}
    </nav>
  )
}