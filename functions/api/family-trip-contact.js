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

  if (context.request.method !== 'GET') {
    return Response.json(
      { error: 'Méthode non autorisée' },
      { status: 405 },
    )
  }

  try {
    const url = new URL(context.request.url)
    const tripId = url.searchParams.get('trip_id')

    if (!tripId) {
      return Response.json(
        { error: 'Trajet manquant' },
        { status: 400 },
      )
    }

    const sql = neon(context.env.DATABASE_URL)

    const result = await sql`
      SELECT
        f.parent_first_name,
        f.parent_last_name,
        f.children_last_name,
        f.phone
      FROM trips t
      INNER JOIN families f
        ON f.family_id = t.family_id
      INNER JOIN school_years sy
        ON sy.school_year_id = t.school_year_id
      WHERE
        t.trip_id = ${tripId}
        AND t.status = 'active'
        AND f.status = 'active'
        AND sy.status = 'active'
        AND f.auth_user_id <> ${user.id}
    `

    if (result.length === 0) {
      return Response.json(
        { error: 'Trajet introuvable ou inaccessible' },
        { status: 404 },
      )
    }

    return Response.json({
      contact: result[0],
    })
  } catch (error) {
    console.error('FAMILY TRIP CONTACT ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}