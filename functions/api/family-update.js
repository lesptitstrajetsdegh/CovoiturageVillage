import { neon } from '@neondatabase/serverless'
import { getAuthenticatedUser } from '../lib/auth.js'

export async function onRequestPost(context) {
  try {
    const user = await getAuthenticatedUser(context)

    if (!user) {
      return Response.json(
        { error: 'Non authentifié' },
        { status: 401 },
      )
    }

    const body = await context.request.json()

    const fields = [
      'parent_first_name',
      'parent_last_name',
      'children_last_name',
      'phone',
      'address_street',
      'address_postal_village',
    ]

    for (const field of fields) {
      if (
        typeof body[field] !== 'string' ||
        body[field].trim() === ''
      ) {
        return Response.json(
          { error: `Champ obligatoire manquant : ${field}` },
          { status: 400 },
        )
      }
    }

    const sql = neon(context.env.DATABASE_URL)

    const current = await sql`
      SELECT
        address_street,
        address_postal_village
      FROM families
      WHERE auth_user_id = ${user.id}
    `

    if (current.length === 0) {
      return Response.json(
        { error: 'Famille introuvable' },
        { status: 404 },
      )
    }

    const addressChanged =
      body.address_street.trim() !== current[0].address_street ||
      body.address_postal_village.trim() !==
        current[0].address_postal_village

    const result = addressChanged
      ? await sql`
          UPDATE families
          SET
            parent_first_name = ${body.parent_first_name.trim()},
            parent_last_name = ${body.parent_last_name.trim()},
            children_last_name = ${body.children_last_name.trim()},
            phone = ${body.phone.trim()},
            pending_address_street = ${body.address_street.trim()},
            pending_address_postal_village = ${body.address_postal_village.trim()},
            pending_address_requested_at = NOW(),
            pending_address_status = 'pending',
            updated_at = NOW()
          WHERE auth_user_id = ${user.id}
          RETURNING
            family_id,
            parent_first_name,
            parent_last_name,
            children_last_name,
            address_street,
            address_postal_village,
            phone,
            pending_address_street,
            pending_address_postal_village,
            pending_address_requested_at,
            pending_address_status,
            status,
            created_at,
            updated_at,
            disabled_at
        `
      : await sql`
          UPDATE families
          SET
            parent_first_name = ${body.parent_first_name.trim()},
            parent_last_name = ${body.parent_last_name.trim()},
            children_last_name = ${body.children_last_name.trim()},
            phone = ${body.phone.trim()},
            updated_at = NOW()
          WHERE auth_user_id = ${user.id}
          RETURNING
            family_id,
            parent_first_name,
            parent_last_name,
            children_last_name,
            address_street,
            address_postal_village,
            phone,
            pending_address_street,
            pending_address_postal_village,
            pending_address_requested_at,
            pending_address_status,
            status,
            created_at,
            updated_at,
            disabled_at
        `

    if (addressChanged) {
      await sql`
        INSERT INTO admin_notifications (
          type,
          content,
          expires_at
        )
        VALUES (
          'admin_account_update_pending',
          'Une famille a demandé une modification de son adresse.',
          NOW() + INTERVAL '1 year'
        )
      `
    }

    return Response.json({
      family: result[0],
    })
  } catch (error) {
    console.error('FAMILY UPDATE ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}