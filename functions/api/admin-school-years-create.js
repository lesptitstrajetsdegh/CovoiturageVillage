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
    const label = body?.label?.trim()

    if (!label) {
      return Response.json(
        { error: 'Le libellé est obligatoire.' },
        { status: 400 },
      )
    }

    const sql = neon(context.env.DATABASE_URL)

    const result = await sql`
      INSERT INTO school_years (label, status)
      VALUES (${label}, 'active')
      RETURNING
        school_year_id,
        label,
        status,
        created_at
    `

    return Response.json({
      school_year: result[0],
    })
  } catch (error) {
    console.error('ADMIN SCHOOL YEAR CREATE ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}