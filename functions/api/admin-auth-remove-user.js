import { isAdmin } from '../lib/admin.js'

export async function onRequestPost(context) {
  const admin = await isAdmin(context)

  if (!admin) {
    return Response.json(
      { error: 'Accès interdit' },
      { status: 403 },
    )
  }

  try {
    const body = await context.request.json()
    const userId = body?.user_id

    if (!userId) {
      return Response.json(
        { error: 'user_id requis' },
        { status: 400 },
      )
    }

    if (userId === context.env.ADMIN_AUTH_USER_ID) {
      return Response.json(
        { error: 'Impossible de supprimer le compte administrateur' },
        { status: 400 },
      )
    }

    const cookie = context.request.headers.get('cookie')

    const response = await fetch(
      `${context.env.NEON_AUTH_URL}/admin/remove-user`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: cookie ?? '',
          Origin: new URL(context.request.url).origin,
        },
        body: JSON.stringify({
          userId,
        }),
      },
    )

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      return Response.json(
        {
          error: data?.message || data?.error || 'Erreur Neon Auth',
          status: response.status,
          details: data,
        },
        { status: 500 },
      )
    }

    return Response.json({
      success: true,
      removed_user_id: userId,
    })
  } catch (error) {
    console.error('ADMIN AUTH REMOVE USER ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}