import { neon } from '@neondatabase/serverless'
import { isAdmin } from '../lib/admin.js'

export async function onRequestGet(context) {
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
        location_request_id,
        family_id,
        requested_name,
        requested_address_street,
        requested_address_postal_village,
        status,
        location_id,
        created_at,
        updated_at
      FROM location_requests
      ORDER BY created_at DESC
    `

    return Response.json({
      location_requests: result,
    })
  } catch (error) {
    console.error('ADMIN LOCATION REQUESTS ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
