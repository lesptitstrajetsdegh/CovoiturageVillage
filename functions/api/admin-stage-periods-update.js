import { neon } from '@neondatabase/serverless'
import { isAdmin } from '../lib/admin.js'

export async function onRequestPatch(context) {
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
    const label = body?.label?.trim()
    const status = body?.status

    if (
      !periodId ||
      !label ||
      !['active', 'archived'].includes(status)
    ) {
      return Response.json(
        { error: 'Le nom et le statut de la période sont obligatoires.' },
        { status: 400 },
      )
    }

    const sql = neon(context.env.DATABASE_URL)

    const result = await sql`
      UPDATE stage_periods
      SET
        label = ${label},
        status = ${status}
      WHERE period_id = ${periodId}
      RETURNING
        period_id,
        school_year_id,
        label,
        status,
        created_at
    `

    if (result.length === 0) {
      return Response.json(
        { error: 'Période de stage introuvable.' },
        { status: 404 },
      )
    }

    return Response.json({
      stage_period: result[0],
    })
  } catch (error) {
    console.error('ADMIN STAGE PERIOD UPDATE ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}