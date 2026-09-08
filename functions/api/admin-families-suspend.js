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

  if (context.request.method !== 'POST') {
    return Response.json(
      { error: 'Méthode non autorisée' },
      { status: 405 },
    )
  }

  try {
    const body = await context.request.json()
    const familyId = body.family_id

    if (
      typeof familyId !== 'string' &&
      typeof familyId !== 'number'
    ) {
      return Response.json(
        { error: 'family_id manquant' },
        { status: 400 },
      )
    }

    const sql = neon(context.env.DATABASE_URL)

    const result = await sql`
      UPDATE families
      SET
        status = 'suspended',
        updated_at = NOW()
      WHERE family_id = ${familyId}
        AND status = 'active'
      RETURNING
        family_id,
        parent_first_name,
        parent_last_name,
        children_last_name,
        address_street,
        address_postal_village,
        phone,
        status,
        created_at,
        updated_at,
        disabled_at
    `

    if (result.length === 0) {
      return Response.json(
        { error: 'Famille introuvable ou non active.' },
        { status: 404 },
      )
    }

    await sql`
      INSERT INTO notifications (
        family_id,
        type,
        content,
        expires_at
      )
      VALUES (
        ${result[0].family_id},
        'account_suspended',
        'Votre compte a été suspendu. Vous n’avez temporairement plus accès aux fonctionnalités de la plateforme. Pour en savoir plus, veuillez consulter les règles de fonctionnement et les conditions générales, ou contacter l’administratrice.',
        NOW() + INTERVAL '1 year'
      )
    `

    return Response.json({
      family: result[0],
    })
  } catch (error) {
    console.error('ADMIN FAMILIES SUSPEND ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}