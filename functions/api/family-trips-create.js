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

  if (context.request.method !== 'POST') {
    return Response.json(
      { error: 'Méthode non autorisée' },
      { status: 405 },
    )
  }

  try {
    const body = await context.request.json()

if (
  body.additional_info !== undefined &&
  body.additional_info !== null &&
  typeof body.additional_info !== 'string'
) {
  return Response.json(
    { error: 'Informations complémentaires invalides.' },
    { status: 400 },
  )
}

if (
  typeof body.additional_info === 'string' &&
  body.additional_info.length > 250
) {
  return Response.json(
    { error: 'Les informations complémentaires ne peuvent pas dépasser 250 caractères.' },
    { status: 400 },
  )
}

const additionalInfo =
  typeof body.additional_info === 'string'
    ? body.additional_info.trim()
    : null

    const sql = neon(context.env.DATABASE_URL)

    const familyResult = await sql`
      SELECT family_id
      FROM families
      WHERE auth_user_id = ${user.id}
        AND status = 'active'
    `

    if (familyResult.length === 0) {
      return Response.json(
        { error: 'Famille introuvable ou non active.' },
        { status: 403 },
      )
    }

    const familyId = familyResult[0].family_id

    const requiredFields = [
      'school_year_id',
      'category',
      'location_id',
      'time_on_site',
      'direction',
      'participation_type',
    ]

    for (const field of requiredFields) {
      if (
        body[field] === undefined ||
        body[field] === null ||
        body[field] === ''
      ) {
        return Response.json(
          { error: `Champ obligatoire manquant : ${field}` },
          { status: 400 },
        )
      }
    }

    const validCategories = ['activity', 'school', 'stage']
    const validDirections = ['outbound', 'return']
    const validParticipationTypes = [
      'drive_with_space',
      'need_ride',
      'interested_rotation',
    ]
    const validCarTripTypes = ['simple', 'round_trip']
    const validWeekdays = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ]

    if (!validCategories.includes(body.category)) {
      return Response.json(
        { error: 'Catégorie invalide.' },
        { status: 400 },
      )
    }

    if (!validDirections.includes(body.direction)) {
      return Response.json(
        { error: 'Direction invalide.' },
        { status: 400 },
      )
    }

    if (!validParticipationTypes.includes(body.participation_type)) {
      return Response.json(
        { error: 'Type de participation invalide.' },
        { status: 400 },
      )
    }

    if (
      typeof body.time_on_site !== 'string' ||
      !/^\d{2}:\d{2}(:\d{2})?$/.test(body.time_on_site)
    ) {
      return Response.json(
        { error: 'Heure sur place invalide.' },
        { status: 400 },
      )
    }

    if (
      typeof body.school_year_id !== 'number' &&
      typeof body.school_year_id !== 'string'
    ) {
      return Response.json(
        { error: 'school_year_id invalide.' },
        { status: 400 },
      )
    }

    if (
      typeof body.location_id !== 'number' &&
      typeof body.location_id !== 'string'
    ) {
      return Response.json(
        { error: 'location_id invalide.' },
        { status: 400 },
      )
    }

    let weekday = null
    let periodId = null
    let carTripType = null

    if (body.category === 'activity') {
      if (!validWeekdays.includes(body.weekday)) {
        return Response.json(
          { error: 'Jour invalide pour une activité.' },
          { status: 400 },
        )
      }

      if (!validCarTripTypes.includes(body.car_trip_type)) {
        return Response.json(
          { error: 'Type de trajet voiture invalide.' },
          { status: 400 },
        )
      }

      weekday = body.weekday
      carTripType = body.car_trip_type
    }

    if (body.category === 'school') {
      if (!validWeekdays.includes(body.weekday)) {
        return Response.json(
          { error: 'Jour invalide pour l’école.' },
          { status: 400 },
        )
      }

      weekday = body.weekday
    }

    if (body.category === 'stage') {
      if (
        typeof body.period_id !== 'number' &&
        typeof body.period_id !== 'string'
      ) {
        return Response.json(
          { error: 'period_id obligatoire pour un stage.' },
          { status: 400 },
        )
      }

      periodId = body.period_id
    }

    const result = await sql`
      INSERT INTO trips (
        family_id,
        school_year_id,
        category,
        location_id,
        weekday,
        period_id,
        time_on_site,
        direction,
        car_trip_type,
        participation_type,
        additional_info,
        status
      )
      VALUES (
        ${familyId},
        ${body.school_year_id},
        ${body.category},
        ${body.location_id},
        ${weekday},
        ${periodId},
        ${body.time_on_site},
        ${body.direction},
        ${carTripType},
        ${body.participation_type},
        ${additionalInfo},
        'active'
      )
      RETURNING
        trip_id,
        family_id,
        school_year_id,
        category,
        location_id,
        weekday,
        period_id,
        time_on_site,
        direction,
        car_trip_type,
        participation_type,
        additional_info,
        status,
        created_at,
        updated_at
    `

    return Response.json(
      { trip: result[0] },
      { status: 201 },
    )
  } catch (error) {
    console.error('FAMILY TRIPS CREATE ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
