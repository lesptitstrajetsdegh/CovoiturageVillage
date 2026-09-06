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

    if (!schoolYearId) {
      return Response.json(
        { error: 'L’identifiant de l’année scolaire est obligatoire.' },
        { status: 400 },
      )
    }

    const sql = neon(context.env.DATABASE_URL)

    const result = await sql`
      UPDATE school_years
      SET
        status = 'archived',
        archived_at = NOW()
      WHERE school_year_id = ${schoolYearId}
      RETURNING
        school_year_id,
        label,
        status,
        created_at
    `

    if (result.length === 0) {
      return Response.json(
        { error: 'Année scolaire introuvable.' },
        { status: 404 },
      )
    }

    await sql`
      UPDATE trips
      SET
        status = 'archived',
        archived_at = NOW(),
        updated_at = NOW()
      WHERE school_year_id = ${schoolYearId}
    `

    await sql`
      UPDATE stage_periods
      SET
        status = 'archived',
        archived_at = NOW()
      WHERE school_year_id = ${schoolYearId}
    `

    return Response.json({
      school_year: result[0],
    })
  } catch (error) {
    console.error('ADMIN SCHOOL YEAR ARCHIVE ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
