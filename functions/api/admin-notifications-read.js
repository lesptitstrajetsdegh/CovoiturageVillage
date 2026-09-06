import { neon } from "@neondatabase/serverless";
import { isAdmin } from "../lib/admin.js";

export async function onRequestPatch(context) {
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

    const body = await context.request.json();
    const notificationId = body.notification_id;

    if (!notificationId) {
      return new Response(
        JSON.stringify({ error: "Notification invalide" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const sql = neon(context.env.DATABASE_URL);

    const result = await sql`
      UPDATE admin_notifications
      SET is_read = true
      WHERE admin_notification_id = ${notificationId}
      RETURNING
        admin_notification_id,
        type,
        content,
        is_read,
        created_at,
        expires_at
    `;

    if (result.length === 0) {
      return new Response(
        JSON.stringify({ error: "Notification introuvable" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({ notification: result[0] }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Erreur lecture notification admin :", error);

    return new Response(
      JSON.stringify({ error: "Erreur serveur" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}