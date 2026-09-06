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
        school_year_id,
        label,
        status,
        created_at
      FROM school_years
      ORDER BY label
    `

    return Response.json({
      school_years: result,
    })
  } catch (error) {
    console.error('ADMIN SCHOOL YEARS ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}