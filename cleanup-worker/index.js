import { neon } from '@neondatabase/serverless'

export default {
  async scheduled(event, env, ctx) {
    const sql = neon(env.DATABASE_URL)

    console.log('CLEANUP CRON START')

    // Notifications : conservation de 1 an après leur création.
    await sql`
      DELETE FROM notifications
      WHERE created_at < NOW() - INTERVAL '1 year'
    `

    await sql`
      DELETE FROM admin_notifications
      WHERE created_at < NOW() - INTERVAL '1 year'
    `

    // Trajets archivés : suppression 1 an après leur propre archivage.
    await sql`
      DELETE FROM trips
      WHERE archived_at IS NOT NULL
        AND archived_at < NOW() - INTERVAL '1 year'
    `

    // Périodes de stage archivées : suppression 1 an après leur propre archivage.
    await sql`
      DELETE FROM stage_periods
      WHERE archived_at IS NOT NULL
        AND archived_at < NOW() - INTERVAL '1 year'
    `

    // Années scolaires archivées : suppression 1 an après leur archivage.
    await sql`
      DELETE FROM school_years
      WHERE archived_at IS NOT NULL
        AND archived_at < NOW() - INTERVAL '1 year'
    `

    // Lieux archivés : suppression 1 an après leur propre archivage.
    // Les trajets correspondants ont déjà été supprimés ci-dessus.
    await sql`
      DELETE FROM locations
      WHERE archived_at IS NOT NULL
        AND archived_at < NOW() - INTERVAL '1 year'
    `

    // Familles archivées : suppression 1 an après leur propre archivage.
    // Les dépendances (notifications, demandes de lieux, trajets)
    // ont déjà été traitées ou sont en CASCADE.
    const families = await sql`
      SELECT
        family_id,
        auth_user_id
      FROM families
      WHERE archived_at IS NOT NULL
        AND archived_at < NOW() - INTERVAL '1 year'
    `

    for (const family of families) {
      const response = await fetch(
        `https://console.neon.tech/api/v2/projects/${env.NEON_PROJECT_ID}/branches/${env.NEON_BRANCH_ID}/auth/users/${family.auth_user_id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${env.NEON_API_KEY}`,
          },
        },
      )

      if (!response.ok) {
        const details = await response.text().catch(() => '')
        console.error(
          'NEON AUTH USER DELETE ERROR:',
          family.auth_user_id,
          response.status,
          details,
        )
        continue
      }

      await sql`
        DELETE FROM families
        WHERE family_id = ${family.family_id}
      `
    }

    console.log('CLEANUP CRON END')
  },
}