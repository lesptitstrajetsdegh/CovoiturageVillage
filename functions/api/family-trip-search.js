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

    const category = url.searchParams.get('category')
    if (!['activity', 'school', 'stage'].includes(category)) {
      return Response.json(
        { error: 'Catégorie de recherche invalide ou manquante' },
        { status: 400 },
      )
    }
    const locationIds = url.searchParams.getAll('location_id')
    const weekday = url.searchParams.get('weekday')
    const periodId = url.searchParams.get('period_id')
    const time = url.searchParams.get('time')
    const direction = url.searchParams.get('direction')
    const carTripType = url.searchParams.get('car_trip_type')
    const participationTypes = url.searchParams.getAll(
      'participation_type',
    )

    if (category === 'stage' && weekday) {
      return Response.json(
        { error: 'Le jour ne peut pas être utilisé pour un stage' },
    { status: 400 },
      )
    }

    if (category !== 'stage' && periodId) {
      return Response.json(
        { error: 'La période de stage ne peut être utilisée que pour un stage' },
        { status: 400 },
      )
    }

    if (category !== 'activity' && carTripType) {
      return Response.json(
        { error: 'Le type de trajet ne peut être utilisé que pour une activité' },
        { status: 400 },
      )
    }

    const sql = neon(context.env.DATABASE_URL)

    const result = await sql`
      SELECT
        t.trip_id,
        t.category,
        t.weekday,
        t.period_id,
        sp.label AS period_label,
        t.time_on_site,
        t.direction,
        t.car_trip_type,
        t.participation_type,
        t.additional_info,
        l.name AS location_name,
        f.parent_first_name,
        f.parent_last_name,
        f.children_last_name
      FROM trips t
      INNER JOIN families f
        ON f.family_id = t.family_id
      INNER JOIN locations l
        ON l.location_id = t.location_id
      LEFT JOIN stage_periods sp
        ON sp.period_id = t.period_id
      INNER JOIN school_years sy
        ON sy.school_year_id = t.school_year_id
WHERE
  t.status = 'active'
  AND f.status = 'active'
  AND sy.status = 'active'
  AND f.auth_user_id <> ${user.id}

  AND (
    ${category}::text IS NULL
    OR t.category = ${category}::text
  )

  AND (
    ${locationIds.length} = 0
    OR t.location_id = ANY(${locationIds})
  )

  AND (
    NULLIF(${weekday}, '')::text IS NULL
    OR t.weekday = NULLIF(${weekday}, '')::text
  )

  AND (
    NULLIF(${periodId}, '')::bigint IS NULL
    OR t.period_id = NULLIF(${periodId}, '')::bigint
  )

  AND (
    NULLIF(${time}, '')::text IS NULL
    OR (
      t.time_on_site BETWEEN
        (NULLIF(${time}, '')::time - INTERVAL '15 minutes')
        AND
        (NULLIF(${time}, '')::time + INTERVAL '15 minutes')
    )
  )

  AND (
    NULLIF(${direction}, '')::text IS NULL
    OR t.direction = NULLIF(${direction}, '')::text
  )

  AND (
    NULLIF(${carTripType}, '')::text IS NULL
    OR t.car_trip_type = NULLIF(${carTripType}, '')::text
  )

  AND (
    ${participationTypes.length} = 0
    OR t.participation_type = ANY(${participationTypes})
  )

      ORDER BY
        t.category,
        CASE t.weekday
          WHEN 'monday' THEN 1
          WHEN 'tuesday' THEN 2
          WHEN 'wednesday' THEN 3
          WHEN 'thursday' THEN 4
          WHEN 'friday' THEN 5
          WHEN 'saturday' THEN 6
          WHEN 'sunday' THEN 7
          ELSE 8
        END,
        t.time_on_site,
        t.direction,
        l.name,
        t.trip_id
    `

    return Response.json({
      trips: result,
    })
  } catch (error) {
    console.error('FAMILY TRIP SEARCH ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}