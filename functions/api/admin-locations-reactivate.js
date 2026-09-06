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

  if (context.request.method !== 'POST') {
    return Response.json(
      { error: 'Méthode non autorisée' },
      { status: 405 },
    )
  }

  try {
    const body = await context.request.json()
    const locationId = body.location_id

    if (
      typeof locationId !== 'string' &&
      typeof locationId !== 'number'
    ) {
      return Response.json(
        { error: 'location_id manquant' },
        { status: 400 },
      )
    }

    const sql = neon(context.env.DATABASE_URL)

    const result = await sql`
      UPDATE locations
      SET
        status = 'active',
        updated_at = NOW()
      WHERE location_id = ${locationId}
        AND status = 'disabled'
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
        { error: 'Lieu introuvable ou non désactivé.' },
        { status: 404 },
      )
    }

    return Response.json({
      location: result[0],
    })
  } catch (error) {
    console.error('ADMIN LOCATIONS REACTIVATE ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}