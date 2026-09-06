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
        school_year_id,
        label,
        status,
        created_at
      FROM school_years
      WHERE status = 'active'
      ORDER BY label
    `

    return Response.json({
      school_years: result,
    })
  } catch (error) {
    console.error('FAMILY SCHOOL YEARS ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}