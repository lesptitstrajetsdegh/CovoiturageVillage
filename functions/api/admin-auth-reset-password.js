import { isAdmin } from '../lib/admin.js'

function generateTemporaryPassword() {
  const chars =
    'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%'

  const values = crypto.getRandomValues(new Uint32Array(16))

  return Array.from(values, (value) => chars[value % chars.length]).join('')
}

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
        {
          error:
            'Impossible de réinitialiser le mot de passe du compte administrateur.',
        },
        { status: 400 },
      )
    }

    const temporaryPassword = generateTemporaryPassword()

    const cookie = context.request.headers.get('cookie')

    const setPasswordResponse = await fetch(
      `${context.env.NEON_AUTH_URL}/admin/set-user-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: cookie ?? '',
          Origin: new URL(context.request.url).origin,
        },
        body: JSON.stringify({
          userId,
          newPassword: temporaryPassword,
        }),
      },
    )

    const setPasswordData = await setPasswordResponse
      .json()
      .catch(() => null)

    if (!setPasswordResponse.ok) {
      return Response.json(
        {
          error:
            setPasswordData?.message ||
            setPasswordData?.error ||
            'Erreur lors de la réinitialisation du mot de passe.',
        },
        { status: 500 },
      )
    }

    const revokeSessionsResponse = await fetch(
      `${context.env.NEON_AUTH_URL}/admin/revoke-user-sessions`,
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

    const revokeSessionsData = await revokeSessionsResponse
      .json()
      .catch(() => null)

    if (!revokeSessionsResponse.ok) {
      console.error(
        'ADMIN AUTH REVOKE SESSIONS ERROR:',
        revokeSessionsData,
      )

      return Response.json(
        {
          error:
            'Le mot de passe a été modifié, mais les sessions existantes n’ont pas pu être révoquées.',
        },
        { status: 500 },
      )
    }

    return Response.json({
      success: true,
      temporary_password: temporaryPassword,
    })
  } catch (error) {
    console.error('ADMIN AUTH RESET PASSWORD ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}