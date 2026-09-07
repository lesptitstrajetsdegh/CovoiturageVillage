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
    const tripId = body.trip_id

    if (
      typeof tripId !== 'string' &&
      typeof tripId !== 'number'
    ) {
      return Response.json(
        { error: 'trip_id manquant' },
        { status: 400 },
      )
    }

    const sql = neon(context.env.DATABASE_URL)

    const existing = await sql`
      SELECT
        trip_id,
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
      FROM trips
      WHERE trip_id = ${tripId}
        AND family_id = (
          SELECT family_id
          FROM families
          WHERE auth_user_id = ${user.id}
        )
    `

    if (existing.length === 0) {
      return Response.json(
        { error: 'Trajet introuvable ou non autorisé.' },
        { status: 404 },
      )
    }

    const current = existing[0]

    const schoolYearId =
      body.school_year_id ?? current.school_year_id

    const category =
      body.category ?? current.category

    const locationId =
      body.location_id ?? current.location_id

    const weekday =
      body.weekday !== undefined
        ? body.weekday
        : current.weekday

    const periodId =
      body.period_id !== undefined
        ? body.period_id
        : current.period_id

    const timeOnSite =
      body.time_on_site ?? current.time_on_site

    const direction =
      body.direction ?? current.direction

    const carTripType =
      body.car_trip_type !== undefined
        ? body.car_trip_type
        : current.car_trip_type

    const participationType =
      body.participation_type ?? current.participation_type

    const additionalInfo =
      body.additional_info !== undefined
        ? body.additional_info
        : current.additional_info

    const privateNote =
      body.private_note !== undefined
        ? body.private_note
        : current.private_note

    if (
      privateNote !== null &&
      typeof privateNote !== 'string'
    ) {
      return Response.json(
        { error: 'Repère personnel invalide.' },
        { status: 400 },
      )
    }

    if (
      typeof privateNote === 'string' &&
      privateNote.length > 100
    ) {
      return Response.json(
        { error: 'Le repère personnel ne peut pas dépasser 100 caractères.' },
        { status: 400 },
      )
    }

    if (
      additionalInfo !== null &&
      typeof additionalInfo !== 'string'
    ) {
      return Response.json(
        { error: 'Informations complémentaires invalides.' },
        { status: 400 },
      )
    }
      
    if (
      typeof additionalInfo === 'string' &&
      additionalInfo.length > 250
    ) {
      return Response.json(
        { error: 'Les informations complémentaires ne peuvent pas dépasser 250 caractères.' },
        { status: 400 },
      )
    }

    const validCategories = ['activity', 'school', 'stage']

    const validDirections = [
      'outbound',
      'return',
    ]

    const validParticipationTypes = [
      'drive_with_space',
      'need_ride',
      'interested_rotation',
    ]

    const validCarTripTypes = [
      'simple',
      'round_trip',
    ]

    const validWeekdays = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ]

    if (!validCategories.includes(category)) {
      return Response.json(
        { error: 'Catégorie invalide.' },
        { status: 400 },
      )
    }

    if (!validDirections.includes(direction)) {
      return Response.json(
        { error: 'Direction invalide.' },
        { status: 400 },
      )
    }

    if (!validParticipationTypes.includes(participationType)) {
      return Response.json(
        { error: 'Type de participation invalide.' },
        { status: 400 },
      )
    }

    if (
      typeof timeOnSite !== 'string' ||
      !/^\d{2}:\d{2}(:\d{2})?$/.test(timeOnSite)
    ) {
      return Response.json(
        { error: 'Heure sur place invalide.' },
        { status: 400 },
      )
    }

    if (
      (typeof schoolYearId !== 'number' &&
        typeof schoolYearId !== 'string') ||
      schoolYearId === ''
    ) {
      return Response.json(
        { error: 'school_year_id invalide.' },
        { status: 400 },
      )
    }

    if (
      (typeof locationId !== 'number' &&
        typeof locationId !== 'string') ||
      locationId === ''
    ) {
      return Response.json(
        { error: 'location_id invalide.' },
        { status: 400 },
      )
    }

    let finalWeekday = null
    let finalPeriodId = null
    let finalCarTripType = null

    if (category === 'activity') {
      if (!validWeekdays.includes(weekday)) {
        return Response.json(
          { error: 'Jour invalide pour une activité.' },
          { status: 400 },
        )
      }

      if (!validCarTripTypes.includes(carTripType)) {
        return Response.json(
          { error: 'Type de trajet voiture invalide.' },
          { status: 400 },
        )
      }

      finalWeekday = weekday
      finalCarTripType = carTripType
    }

    if (category === 'school') {
      if (!validWeekdays.includes(weekday)) {
        return Response.json(
          { error: 'Jour invalide pour l’école.' },
          { status: 400 },
        )
      }

      finalWeekday = weekday
    }

    if (category === 'stage') {
      if (
        (typeof periodId !== 'number' &&
          typeof periodId !== 'string') ||
        periodId === ''
      ) {
        return Response.json(
          { error: 'period_id obligatoire pour un stage.' },
          { status: 400 },
        )
      }

      finalPeriodId = periodId
    }

    const result = await sql`
      UPDATE trips
      SET
        school_year_id = ${schoolYearId},
        category = ${category},
        location_id = ${locationId},
        weekday = ${finalWeekday},
        period_id = ${finalPeriodId},
        time_on_site = ${timeOnSite},
        direction = ${direction},
        car_trip_type = ${finalCarTripType},
        participation_type = ${participationType},
        additional_info = ${
          typeof additionalInfo === 'string'
            ? additionalInfo.trim()
            : additionalInfo
        },
        private_note = ${
          typeof privateNote === 'string'
            ? privateNote.trim()
            : privateNote
        },
        updated_at = NOW()
      WHERE trip_id = ${tripId}
        AND family_id = (
          SELECT family_id
          FROM families
          WHERE auth_user_id = ${user.id}
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
        private_note,
        status,
        created_at,
        updated_at
    `

    return Response.json({
      trip: result[0],
    })
  } catch (error) {
    console.error('FAMILY TRIPS UPDATE ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
