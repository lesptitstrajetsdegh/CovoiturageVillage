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

    const requiredFields = [
      'requested_name',
      'requested_address_street',
      'requested_address_postal_village',
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

    const sql = neon(context.env.DATABASE_URL)

    const familyResult = await sql`
      SELECT family_id
      FROM families
      WHERE auth_user_id = ${user.id}
        AND status = 'active'
    `

    if (familyResult.length === 0) {
      return Response.json(
        { error: 'Famille introuvable ou non active.' },
        { status: 403 },
      )
    }

    const familyId = familyResult[0].family_id

    const result = await sql`
      INSERT INTO location_requests (
        family_id,
        requested_name,
        requested_address_street,
        requested_address_postal_village,
        status
      )
      VALUES (
        ${familyId},
        ${body.requested_name.trim()},
        ${body.requested_address_street.trim()},
        ${body.requested_address_postal_village.trim()},
        'pending'
      )
      RETURNING
        location_request_id,
        family_id,
        requested_name,
        requested_address_street,
        requested_address_postal_village,
        status,
        created_at,
        updated_at
    `

    await sql`
      INSERT INTO admin_notifications (
        type,
        content,
        expires_at
      )
      VALUES (
        'admin_location_request_pending',
        'Une famille a demandé la création d’un nouveau lieu.',
        NOW() + INTERVAL '1 year'
      )
    `

    return Response.json(
      { request: result[0] },
      { status: 201 },
    )
  } catch (error) {
    console.error('LOCATION REQUEST ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}