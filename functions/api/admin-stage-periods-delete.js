import { neon } from '@neondatabase/serverless'
import { isAdmin } from '../lib/admin.js'

export async function onRequestDelete(context) {
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

    if (!periodId) {
      return Response.json(
        { error: 'La période est obligatoire.' },
        { status: 400 },
      )
    }

    const sql = neon(context.env.DATABASE_URL)

    const trips = await sql`
      SELECT 1
      FROM trips
      WHERE period_id = ${periodId}
      LIMIT 1
    `

    if (trips.length > 0) {
      return Response.json(
        {
          error:
            'Cette période ne peut pas être supprimée car elle est déjà utilisée par un trajet.',
        },
        { status: 409 },
      )
    }

    const result = await sql`
      DELETE FROM stage_periods
      WHERE period_id = ${periodId}
      RETURNING
        period_id,
        school_year_id,
        label,
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
    console.error('ADMIN STAGE PERIOD DELETE ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}