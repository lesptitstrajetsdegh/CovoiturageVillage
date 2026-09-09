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
    const familyId = body.family_id

    if (
      typeof familyId !== 'string' &&
      typeof familyId !== 'number'
    ) {
      return Response.json(
        { error: 'family_id manquant' },
        { status: 400 },
      )
    }

    const sql = neon(context.env.DATABASE_URL)

    const result = await sql`
      UPDATE families
      SET
        address_street = pending_address_street,
        address_postal_village = pending_address_postal_village,
        pending_address_street = NULL,
        pending_address_postal_village = NULL,
        pending_address_requested_at = NULL,
        pending_address_status = NULL,
        updated_at = NOW()
      WHERE family_id = ${familyId}
        AND pending_address_status = 'pending'
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

    if (result.length === 0) {
      return Response.json(
        { error: 'Aucune demande d’adresse en attente pour cette famille.' },
        { status: 404 },
      )
    }

await sql`
  INSERT INTO notifications (
    family_id,
    type,
    content,
    expires_at
  )
  VALUES (
    ${result[0].family_id},
    'address_approved',
    'Votre demande de changement d’adresse a été acceptée par l’administrateur.',
    NOW() + INTERVAL '1 year'
  )
`

    return Response.json({
      family: result[0],
    })
  } catch (error) {
    console.error('ADMIN ADDRESS APPROVE ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
