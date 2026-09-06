export async function getAuthenticatedUser(context) {
  const cookie = context.request.headers.get('cookie')

  if (!cookie) {
    return null
  }

  const response = await fetch(
    `${context.env.NEON_AUTH_URL}/get-session`,
    {
      headers: {
        cookie,
      },
    },
  )

  if (!response.ok) {
    return null
  }

  const data = await response.json()

  return data?.user ?? null
}

