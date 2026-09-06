import { neon } from '@neondatabase/serverless'
import { isAdmin } from '../lib/admin.js'

export async function onRequest(context) {
  const admin = await isAdmin(context)

  if (!admin) {
    return Response.json(
      { error: 'Accès interdit' },
      { status: 403 },
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
        status,
        created_at,
        updated_at
      FROM locations
      ORDER BY name
    `

    return Response.json({
      locations: result,
    })
  } catch (error) {
    console.error('ADMIN LOCATIONS ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}