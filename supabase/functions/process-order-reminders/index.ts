import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req) => {
  // Only allow POST from Supabase or your cron service
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${Deno.env.get("CRON_SECRET")}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // 1. Send reminders for service bookings happening in 24 hours
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const { data: upcomingServices, error: serviceErr } = await supabase
      .from("order_items")
      .select(
        `
        id, title, booking_date, order_id,
        orders(customer_id)
      `
      )
      .eq("item_type", "service")
      .eq("booking_date", tomorrowStr)
      .is("reminder_sent_at", null);

    if (serviceErr) {
      console.error("[Reminders] Service query error:", serviceErr.message);
    } else {
      // Send SMS/Email reminders
      for (const item of upcomingServices || []) {
        const order = Array.isArray(item.orders) ? item.orders[0] : item.orders;
        if (!order?.customer_id) continue;

        const { data: profile } = await supabase
          .from('profiles')
          .select('email, full_name, phone')
          .eq('id', order.customer_id)
          .single();

        try {
          // Send SMS reminder
          if (profile?.phone) {
            await fetch(`${supabaseUrl}/functions/v1/send-sms`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                phone: profile.phone,
                message: `Reminder: Your ${item.title} booking is tomorrow! Check your VSK Travel account for details.`,
                type: "service-reminder",
              }),
            });
          }

          // Send Email reminder
          await fetch(`${supabaseUrl}/functions/v1/send-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: profile?.email ?? '',
              subject: `Reminder: Your ${item.title} Booking Tomorrow`,
              template: "service-reminder",
              data: {
                customerName: profile?.full_name ?? 'Customer',
                serviceName: item.title,
                serviceDate: item.booking_date,
                dashboardUrl:
                  Deno.env.get("FRONTEND_URL") + "/dashboard/orders",
              },
            }),
          });

          // Mark as reminded
          await supabase
            .from("order_items")
            .update({ reminder_sent_at: new Date().toISOString() })
            .eq("id", item.id);
        } catch (err) {
          console.error("[Reminders] Failed to send reminder for item", item.id, err);
        }
      }
    }

    // 2. Auto-expire pending orders after 24 hours
    const yesterdayIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: expiredOrders, error: expireErr } = await supabase
      .from("orders")
      .select("id")
      .eq("status", "pending")
      .eq("payment_status", "pending")
      .lt("created_at", yesterdayIso);

    if (expireErr) {
      console.error("[Reminders] Expire query error:", expireErr.message);
    } else {
      const expireCount = expiredOrders?.length || 0;
      if (expireCount > 0) {
        const { error: updateErr } = await supabase
          .from("orders")
          .update({ status: "expired" })
          .in(
            "id",
            expiredOrders?.map((o) => o.id) || []
          );

        if (updateErr) {
          console.error("[Reminders] Expire update error:", updateErr.message);
        } else {
          console.log("[Reminders] Expired", expireCount, "old pending orders");
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Order reminders processed successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("[Reminders]", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
