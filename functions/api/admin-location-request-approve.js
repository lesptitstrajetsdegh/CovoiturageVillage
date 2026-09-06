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
      WITH pending_request AS (
        SELECT
          location_request_id,
          family_id,
          requested_name,
          requested_address_street,
          requested_address_postal_village
        FROM location_requests
        WHERE location_request_id = ${locationRequestId}
          AND status = 'pending'
      ),
      new_location AS (
        INSERT INTO locations (
          name,
          address_street,
          address_postal_village,
          status,
          created_at,
          updated_at
        )
        SELECT
          requested_name,
          requested_address_street,
          requested_address_postal_village,
          'active',
          now(),
          now()
        FROM pending_request
        RETURNING location_id
      ),
      approved_request AS (
        UPDATE location_requests
        SET
          status = 'approved',
          location_id = new_location.location_id,
          updated_at = now()
        FROM new_location
        WHERE location_requests.location_request_id = ${locationRequestId}
        RETURNING
          location_requests.location_request_id,
          location_requests.family_id,
          location_requests.requested_name,
          location_requests.requested_address_street,
          location_requests.requested_address_postal_village,
          location_requests.status,
          location_requests.location_id,
          location_requests.created_at,
          location_requests.updated_at
      ),
      family_notification AS (
        INSERT INTO notifications (
          family_id,
          type,
          content,
          expires_at
        )
        SELECT
          family_id,
          'location_request_approved',
          'Votre demande de création de lieu a été acceptée par l’administrateur.',
          now() + interval '1 year'
        FROM approved_request
        RETURNING notification_id
      )
      SELECT *
      FROM approved_request
    `

    if (result.length === 0) {
      return Response.json(
        { error: 'Demande introuvable ou déjà traitée.' },
        { status: 404 },
      )
    }

    return Response.json({
      request: result[0],
    })
  } catch (error) {
    console.error('ADMIN LOCATION REQUEST APPROVE ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
