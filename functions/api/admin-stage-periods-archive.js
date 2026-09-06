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
    const periodId = body?.period_id

    if (
      typeof periodId !== 'string' &&
      typeof periodId !== 'number'
    ) {
      return Response.json(
        { error: 'period_id manquant' },
        { status: 400 },
      )
    }

    const sql = neon(context.env.DATABASE_URL)

    const result = await sql`
      UPDATE stage_periods
      SET
        status = 'archived'
      WHERE period_id = ${periodId}
        AND status = 'active'
      RETURNING
        period_id,
        school_year_id,
        label,
        status,
        created_at
    `

    if (result.length === 0) {
      return Response.json(
        { error: 'Période introuvable ou déjà archivée.' },
        { status: 404 },
      )
    }

    return Response.json({
      stage_period: result[0],
    })
  } catch (error) {
    console.error('ADMIN STAGE PERIOD ARCHIVE ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}