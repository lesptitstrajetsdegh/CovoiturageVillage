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

    const schoolYearId = body?.school_year_id
    const label = body?.label?.trim()

    if (!schoolYearId || !label) {
      return Response.json(
        {
          error:
            "L'année scolaire et le nom de la période sont obligatoires.",
        },
        { status: 400 },
      )
    }

    const sql = neon(context.env.DATABASE_URL)

    const result = await sql`
      INSERT INTO stage_periods (
        school_year_id,
        label,
        created_at
      )
      VALUES (
        ${schoolYearId},
        ${label},
        now()
      )
      RETURNING
        period_id,
        school_year_id,
        label,
        status,
        created_at
    `

    return Response.json({
      stage_period: result[0],
    })
  } catch (error) {
    console.error('ADMIN STAGE PERIOD CREATE ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}