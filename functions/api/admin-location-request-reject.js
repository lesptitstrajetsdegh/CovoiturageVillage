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
    const locationRequestId = body?.location_request_id

    if (!locationRequestId) {
      return Response.json(
        { error: 'location_request_id manquant' },
        { status: 400 },
      )
    }

    const sql = neon(context.env.DATABASE_URL)

    const result = await sql`
      WITH rejected_request AS (
        UPDATE location_requests
        SET
          status = 'rejected',
          updated_at = now()
        WHERE location_request_id = ${locationRequestId}
          AND status = 'pending'
        RETURNING
          location_request_id,
          family_id,
          requested_name,
          requested_address_street,
          requested_address_postal_village,
          status,
          location_id,
          created_at,
          updated_at
      )
      INSERT INTO notifications (
        family_id,
        type,
        content,
        expires_at
      )
      SELECT
        family_id,
        'location_request_rejected',
        'Votre demande de création de lieu a été refusée par l’administrateur.',
        now() + interval '1 year'
      FROM rejected_request
      RETURNING
        notification_id
    `

    if (result.length === 0) {
      return Response.json(
        { error: 'Demande introuvable ou déjà traitée.' },
        { status: 404 },
      )
    }

    return Response.json({
      success: true,
    })
  } catch (error) {
    console.error('ADMIN LOCATION REQUEST REJECT ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
