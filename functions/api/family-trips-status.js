import { neon } from '@neondatabase/serverless'
import { getAuthenticatedUser } from '../lib/auth.js'

export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    const user = await getAuthenticatedUser(context)

    if (!user) {
      return Response.json(
        { error: 'Non authentifié' },
        { status: 401 },
      )
    }

    const body = await context.request.json()
    const tripId = Number(body.trip_id)
    const action = body.action

    if (!Number.isInteger(tripId) || tripId <= 0) {
      return Response.json(
        { error: 'Trajet invalide' },
        { status: 400 },
      )
    }

    if (action !== 'pause' && action !== 'reactivate') {
      return Response.json(
        { error: 'Action invalide' },
        { status: 400 },
      )
    }

    const sql = neon(context.env.DATABASE_URL)

    const newStatus = action === 'pause' ? 'paused' : 'active'

    const result = await sql`
      UPDATE trips
      SET
        status = ${newStatus},
        updated_at = NOW()
      WHERE trip_id = ${tripId}
        AND family_id = (
          SELECT family_id
          FROM families
          WHERE auth_user_id = ${user.id}
        )
        AND status = ${action === 'pause' ? 'active' : 'paused'}
      RETURNING
        trip_id,
        family_id,
        school_year_id,
        category,
        location_id,
        weekday,
        period_id,
        time_on_site,
        direction,
        car_trip_type,
        participation_type,
        additional_info,
        status,
        created_at,
        updated_at
    `

    if (result.length === 0) {
      return Response.json(
        { error: 'Trajet introuvable ou action impossible' },
        { status: 400 },
      )
    }

    return Response.json({
      trip: result[0],
    })
  } catch (error) {
    console.error('FAMILY TRIPS STATUS ERROR:', error)

    return Response.json(
      { error: 'Erreur serveur' },
      { status: 500 },
    )
  }
}