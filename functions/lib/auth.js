export async function getAuthenticatedUser(context) {
  const cookie = context.request.headers.get('cookie')

  if (!cookie) {
    return null
  }

    const url = new URL('/api/auth/get-session', context.request.url)

      const response = await fetch(url, {
        headers: {
          cookie,
        },
      })

  if (!response.ok) {
    return null
  }

  const data = await response.json()

  return data?.user ?? null
}

