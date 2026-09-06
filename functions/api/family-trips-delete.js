import { neon } from '@neondatabase/serverless'
import { getAuthenticatedUser } from '../lib/auth.js'

export async function onRequest(context) {
  const user = await getAuthenticatedUser(context)

  if (!user) {
    return Response.json(
      { error: 'Non authentifié' },
      { status: 401 },
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
    const tripId = body.trip_id

    if (
      typeof tripId !== 'string' &&
      typeof tripId !== 'number'
    ) {
      return Response.json(
        { error: 'trip_id manquant' },
        { status: 400 },
      )
    }

    const sql = neon(context.env.DATABASE_URL)

    const result = await sql`
      DELETE FROM trips
      WHERE trip_id = ${tripId}
        AND family_id = (
          SELECT family_id
          FROM families
          WHERE auth_user_id = ${user.id}
        )
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
        status,
        created_at,
        updated_at
    `

    if (result.length === 0) {
      return Response.json(
        { error: 'Trajet introuvable ou non autorisé.' },
        { status: 404 },
      )
    }

    return Response.json({
      trip: result[0],
    })
  } catch (error) {
    console.error('FAMILY TRIPS DELETE ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
