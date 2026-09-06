import { neon } from '@neondatabase/serverless'
import { getAuthenticatedUser } from '../lib/auth.js'

export async function onRequestPatch(context) {
  const user = await getAuthenticatedUser(context)

  if (!user) {
    return Response.json(
      { error: 'Non authentifié' },
      { status: 401 },
    )
  }

  try {
    const body = await context.request.json()
    const notificationId = body.notification_id

    if (!notificationId) {
      return Response.json(
        { error: 'notification_id requis' },
        { status: 400 },
      )
    }

    const sql = neon(context.env.DATABASE_URL)

    const result = await sql`
      UPDATE notifications n
      SET is_read = true
      FROM families f
      WHERE n.notification_id = ${notificationId}
        AND n.family_id = f.family_id
        AND f.auth_user_id = ${user.id}
      RETURNING
        n.notification_id,
        n.is_read
    `

    if (result.length === 0) {
      return Response.json(
        { error: 'Notification introuvable' },
        { status: 404 },
      )
    }

    return Response.json({
      notification: result[0],
    })
  } catch (error) {
    console.error('NOTIFICATIONS READ ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}