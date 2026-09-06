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

  if (context.request.method !== 'GET') {
    return Response.json(
      { error: 'Méthode non autorisée' },
      { status: 405 },
    )
  }

  try {
    const sql = neon(context.env.DATABASE_URL)

    const families = await sql`
      SELECT
        f.family_id,
        f.auth_user_id,
        u.email,
        f.parent_first_name,
        f.parent_last_name,
        f.children_last_name,
        f.address_street,
        f.address_postal_village,
        f.phone,
        f.pending_address_street,
        f.pending_address_postal_village,
        f.pending_address_requested_at,
        f.pending_address_status,
        f.status,
        f.created_at,
        f.updated_at,
        f.disabled_at
      FROM families f
      LEFT JOIN neon_auth."user" u
        ON u.id::text = f.auth_user_id
      ORDER BY f.created_at ASC
    `

    return Response.json({
      families,
    })
  } catch (error) {
    console.error('ADMIN FAMILIES ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}