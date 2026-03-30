import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface AnalyticsEvent {
  event_name: string; // "page_view", "product_viewed", "service_added_to_cart", etc.
  user_id?: string;
  session_id?: string;
  properties?: Record<string, string | number | boolean>;
  page_path?: string;
  referrer?: string;
  user_agent?: string;
  ip_address?: string;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body: AnalyticsEvent = await req.json();
    const {
      event_name,
      user_id,
      session_id,
      properties,
      page_path,
      referrer,
      user_agent,
      ip_address,
    } = body;

    if (!event_name) {
      return new Response(
        JSON.stringify({ error: "event_name is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get client IP if not provided
    const clientIp =
      ip_address ||
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      "unknown";

    const { error } = await supabase.from("analytics_events").insert({
      event_name,
      user_id: user_id || null,
      session_id: session_id || null,
      properties: properties || {},
      page_path: page_path || null,
      referrer: referrer || null,
      user_agent: user_agent || null,
      ip_address: clientIp,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[Analytics] Insert error:", error.message);
      // Don't fail the request — analytics shouldn't block user actions
      return new Response(JSON.stringify({ success: false, warning: error.message }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("[Analytics]", message);
    // Still return 200 — we don't want to break user experience
    return new Response(JSON.stringify({ success: false, warning: message }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
});
