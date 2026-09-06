import { useEffect, useState } from 'react'

export function AdminNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadNotifications = async () => {
    try {
      setError('')

      const response = await fetch('/api/admin-notifications')

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
      const response = await fetch('/api/admin-notifications-read', {
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
          notification.admin_notification_id === notificationId
            ? { ...notification, is_read: true }
            : notification,
        ),
      )

      window.dispatchEvent(new Event('admin-notifications-updated'))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  if (loading) {
    return (
      <section>
        <h2>Notifications</h2>
        <p>Chargement…</p>
      </section>
    )
  }

  return (
    <section>
      <details>
        <summary><h2>Notifications</h2></summary>

      {error && <p>{error}</p>}

      {notifications.length === 0 ? (
        <p>Vous n’avez aucune notification.</p>
      ) : (
        <div>
          {notifications.map((notification) => (
            <article
              key={notification.admin_notification_id}
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
                      markAsRead(notification.admin_notification_id)
                    }
                  >
                    Marquer comme lue
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </details>
    </section>
  )
}