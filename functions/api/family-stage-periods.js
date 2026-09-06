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
        period_id,
        school_year_id,
        label
      FROM stage_periods
      WHERE status = 'active'
        AND school_year_id = ANY(
          SELECT school_year_id
          FROM school_years
          WHERE status IN ('active', 'archived')
        )
      ORDER BY school_year_id, period_id
    `

    return Response.json({
      stage_periods: result,
    })
  } catch (error) {
    console.error('FAMILY STAGE PERIODS ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}