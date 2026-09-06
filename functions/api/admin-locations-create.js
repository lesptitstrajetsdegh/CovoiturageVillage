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

    const name = body?.name?.trim()
    const addressStreet = body?.address_street?.trim()
    const addressPostalVillage = body?.address_postal_village?.trim()

    if (!name || !addressStreet || !addressPostalVillage) {
      return Response.json(
        {
          error:
            'Le nom, la rue et le code postal/village sont obligatoires.',
        },
        { status: 400 },
      )
    }

    const sql = neon(context.env.DATABASE_URL)

    const result = await sql`
      INSERT INTO locations (
        name,
        address_street,
        address_postal_village,
        status,
        created_at,
        updated_at
      )
      VALUES (
        ${name},
        ${addressStreet},
        ${addressPostalVillage},
        'active',
        now(),
        now()
      )
      RETURNING
        location_id,
        name,
        address_street,
        address_postal_village,
        status,
        created_at,
        updated_at
    `

    return Response.json({
      location: result[0],
    })
  } catch (error) {
    console.error('ADMIN LOCATION CREATE ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}