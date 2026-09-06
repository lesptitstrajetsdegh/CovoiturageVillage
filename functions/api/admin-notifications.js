import { neon } from "@neondatabase/serverless";
import { isAdmin } from "../lib/admin.js";

export async function onRequestGet(context) {
  try {
    const admin = await isAdmin(context);

    if (!admin) {
      return new Response(
        JSON.stringify({ error: "Accès interdit" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const sql = neon(context.env.DATABASE_URL);

    const result = await sql`
      SELECT
        admin_notification_id,
        type,
        content,
        is_read,
        created_at,
        expires_at
      FROM admin_notifications
      WHERE expires_at > NOW()
      ORDER BY created_at DESC
    `;

    return new Response(
      JSON.stringify({ notifications: result }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Erreur notifications admin :", error);

    return new Response(
      JSON.stringify({ error: "Erreur serveur" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}