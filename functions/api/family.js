import { neon } from '@neondatabase/serverless'
import { getAuthenticatedUser } from '../lib/auth.js'

export async function onRequest(context) {
  try {
    const user = await getAuthenticatedUser(context)

    if (!user) {
      return Response.json(
        { error: 'Non authentifiÃƒÂ©' },
        { status: 401 },
      )
    }

    const sql = neon(context.env.DATABASE_URL)

    if (context.request.method === 'GET') {
      const result = await sql`
        SELECT
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
        FROM families
        WHERE auth_user_id = ${user.id}
      `

      return Response.json({
        family: result[0]
          ? { ...result[0], email: user.email }
          : null,
      })
    }

    if (context.request.method === 'POST') {
      const body = await context.request.json()

      const requiredFields = [
        'parent_first_name',
        'parent_last_name',
        'children_last_name',
        'address_street',
        'address_postal_village',
        'phone',
      ]

      for (const field of requiredFields) {
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

      const existing = await sql`
        SELECT family_id
        FROM families
        WHERE auth_user_id = ${user.id}
      `

      if (existing.length > 0) {
        return Response.json(
          { error: 'Une famille existe dÃƒÂ©jÃƒÂ  pour ce compte' },
          { status: 409 },
        )
      }

      const result = await sql`
        INSERT INTO families (
          auth_user_id,
          parent_first_name,
          parent_last_name,
          children_last_name,
          address_street,
          address_postal_village,
          phone,
          status
        )
        VALUES (
          ${user.id},
          ${body.parent_first_name.trim()},
          ${body.parent_last_name.trim()},
          ${body.children_last_name.trim()},
          ${body.address_street.trim()},
          ${body.address_postal_village.trim()},
          ${body.phone.trim()},
          'pending'
        )
        RETURNING
          family_id,
          parent_first_name,
          parent_last_name,
          children_last_name,
          address_street,
          address_postal_village,
          phone,
          status,
          created_at,
          updated_at,
          disabled_at
      `

      await sql`
        INSERT INTO admin_notifications (
          type,
          content,
          expires_at
        )
        VALUES (
          'admin_account_pending',
          'Nouvelle inscription en attente.',
          NOW() + INTERVAL '1 year'
        )
      `

      return Response.json(
        {
          family: {
            ...result[0],
            email: user.email,
          },
        },
        { status: 201 },
      )
    }

    return Response.json(
      { error: 'MÃƒÂ©thode non autorisÃƒÂ©e' },
      { status: 405 },
    )
  } catch (error) {
    console.error('FAMILY ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}


