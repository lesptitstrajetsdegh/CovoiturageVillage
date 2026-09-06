import { handleAuthProxyRequest } from '@neondatabase/auth/server'

interface Env {
  NEON_AUTH_URL: string
  NEON_AUTH_COOKIE_SECRET: string
}

export const onRequest = async (context: {
  request: Request
  params: {
    path?: string | string[]
  }
  env: Env
}) => {
  const { request, params, env } = context

  const path = Array.isArray(params.path)
    ? params.path.join('/')
    : params.path ?? ''

  try {
    console.log('NEON AUTH REQUEST')
    console.log('method:', request.method)
    console.log('path:', path)
    console.log('baseUrl:', env.NEON_AUTH_URL)
    console.log('cookie secret length:', env.NEON_AUTH_COOKIE_SECRET?.length)

    const response = await handleAuthProxyRequest({
      request,
      path,
      baseUrl: env.NEON_AUTH_URL,
      cookieSecret: env.NEON_AUTH_COOKIE_SECRET,
    })

    console.log('NEON AUTH RESPONSE:', response.status)
console.log('NEON AUTH RESPONSE BODY:', await response.clone().text())

    return response
  } catch (error) {
    console.error('NEON AUTH ERROR:', error)

    return new Response(
      JSON.stringify({
        error: 'Neon Auth proxy error',
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }
}