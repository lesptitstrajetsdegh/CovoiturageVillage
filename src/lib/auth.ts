import { createAuthClient } from '@neondatabase/auth'
import { BetterAuthReactAdapter } from '@neondatabase/auth/react/adapters'

export const auth = createAuthClient(
  '/api/auth',
  {
    adapter: BetterAuthReactAdapter(),
  },
)