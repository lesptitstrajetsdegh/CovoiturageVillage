import { useEffect, useState } from 'react'

export function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadNotifications = async () => {
    try {
      setError('')

      const response = await fetch('/api/notifications')

      if (!response.ok) {
        throw new Error('Impossible de charger les notifications.')
      }

      const data = await response.json()
      setNotifications(data.notifications ?? [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch('/api/notifications-read', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notification_id: notificationId,
        }),
      })

      if (!response.ok) {
        throw new Error('Impossible de marquer la notification comme lue.')
      }

      setNotifications((current) =>
        current.map((notification) =>
          notification.notification_id === notificationId
            ? { ...notification, is_read: true }
            : notification,
        ),
      )

      window.dispatchEvent(new Event('notifications-updated'))

    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  if (loading) {
    return (
      <main>
        <h1>Notifications</h1>
        <p>Chargement…</p>
      </main>
    )
  }

  return (
    <main>
      <h1>Notifications</h1>

      {error && <p>{error}</p>}

      {notifications.length === 0 ? (
        <p>Vous n’avez aucune notification.</p>
      ) : (
        <section>
          {notifications.map((notification) => (
            <article
              key={notification.notification_id}
              style={{
                fontWeight: notification.is_read ? 'normal' : '600',
                marginBottom: '16px',
              }}
            >
              <p>{notification.content}</p>

              <small>
                {new Date(notification.created_at).toLocaleDateString(
                  'fr-BE',
                )}
              </small>

              {!notification.is_read && (
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      markAsRead(notification.notification_id)
                    }
                  >
                    Marquer comme lue
                  </button>
                </div>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  )
}