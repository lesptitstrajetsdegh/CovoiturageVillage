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

  try {
    const sql = neon(context.env.DATABASE_URL)

    const result = await sql`
      SELECT
        period_id,
        school_year_id,
        label,
        status,
        created_at
      FROM stage_periods
      ORDER BY period_id
    `

    return Response.json({
      stage_periods: result,
    })
  } catch (error) {
    console.error('ADMIN STAGE PERIODS ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}