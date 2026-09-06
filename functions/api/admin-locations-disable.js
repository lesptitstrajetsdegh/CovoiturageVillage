import { neon } from '@neondatabase/serverless'
import { isAdmin } from '../lib/admin.js'

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
    const locationId = body?.location_id

    if (!locationId) {
      return Response.json(
        { error: 'Identifiant du lieu manquant.' },
        { status: 400 },
      )
    }

    const sql = neon(context.env.DATABASE_URL)

    const result = await sql`
      UPDATE locations
      SET
        status = 'disabled',
        updated_at = now()
      WHERE location_id = ${locationId}
      RETURNING
        location_id,
        name,
        address_street,
        address_postal_village,
        status,
        created_at,
        updated_at
    `

    if (result.length === 0) {
      return Response.json(
        { error: 'Lieu introuvable.' },
        { status: 404 },
      )
    }

    return Response.json({
      location: result[0],
    })
  } catch (error) {
    console.error('ADMIN LOCATION DISABLE ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}