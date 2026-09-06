import { neon } from '@neondatabase/serverless'
import { getAuthenticatedUser } from '../lib/auth.js'

export async function onRequest(context) {
  const user = await getAuthenticatedUser(context)

  if (!user) {
    return Response.json(
      { error: 'Non authentifié' },
      { status: 401 },
    )
  }

  try {
    const sql = neon(context.env.DATABASE_URL)

    const result = await sql`
      SELECT
        location_id,
        name,
        address_street,
        address_postal_village,
        status
      FROM locations
      WHERE status = 'active'
      ORDER BY name
    `

    return Response.json({
      locations: result,
    })
  } catch (error) {
    console.error('FAMILY LOCATIONS ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}