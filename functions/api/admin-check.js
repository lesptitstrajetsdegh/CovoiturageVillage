import { isAdmin } from '../lib/admin.js'

export async function onRequestGet(context) {
  const admin = await isAdmin(context)

  return new Response(
    JSON.stringify({ isAdmin: admin }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}