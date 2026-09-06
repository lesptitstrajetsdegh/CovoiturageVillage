import { getAuthenticatedUser } from './auth.js'

export async function isAdmin(context) {
  const user = await getAuthenticatedUser(context)

  if (!user) {
    return false
  }

  return user.id === context.env.ADMIN_AUTH_USER_ID
}