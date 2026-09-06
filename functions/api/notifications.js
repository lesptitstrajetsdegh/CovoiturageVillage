import { neon } from "@neondatabase/serverless";
import { getAuthenticatedUser } from "../lib/auth.js";

export async function onRequestGet(context) {
  try {
    const user = await getAuthenticatedUser(context);

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Non authentifié" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const sql = neon(context.env.DATABASE_URL);

    const result = await sql`
      SELECT
        n.notification_id,
        n.type,
        n.content,
        n.is_read,
        n.created_at,
        n.expires_at
      FROM notifications n
      JOIN families f
        ON f.family_id = n.family_id
      WHERE f.auth_user_id = ${user.id}
        AND n.expires_at > NOW()
      ORDER BY n.created_at DESC
    `;

    return new Response(
      JSON.stringify({ notifications: result }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

    } catch (error) {
    console.error('NOTIFICATIONS ERROR:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}