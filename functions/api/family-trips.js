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

  try {
    const sql = neon(context.env.DATABASE_URL)

    const result = await sql`
      SELECT
        t.trip_id,
        t.family_id,
        t.school_year_id,
        t.category,
        t.location_id,
        l.name AS location_name,
        t.weekday,
        t.period_id,
        sp.label AS period_label,
        t.time_on_site,
        t.direction,
        t.car_trip_type,
        t.participation_type,
        t.additional_info,
        t.private_note,
        t.status,
        t.created_at,
        t.updated_at
      FROM trips t
      INNER JOIN families f
        ON f.family_id = t.family_id
      INNER JOIN school_years sy
        ON sy.school_year_id = t.school_year_id
      INNER JOIN locations l
        ON l.location_id = t.location_id
        LEFT JOIN stage_periods sp
          ON sp.period_id = t.period_id
      WHERE f.auth_user_id = ${user.id}
        AND sy.status = 'active'
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
        t.trip_id
    `

    return Response.json({
      trips: result,
    })
  } catch (error) {
    console.error('FAMILY TRIPS ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
