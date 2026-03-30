import Stripe from "https://esm.sh/stripe@21.0.1";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2026-03-25.dahlia",
});

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error("[Stripe Webhook] Signature error:", err);
    return new Response("Webhook signature verification failed", {
      status: 400,
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          const { error } = await supabase
            .from("orders")
            .update({
              payment_status: "paid",
              stripe_session_id: session.id,
              updated_at: new Date().toISOString(),
            })
            .eq("id", orderId);

          if (error) {
            console.error("[Stripe Webhook] DB update failed:", error.message);
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        const sessionList = await stripe.checkout.sessions.list({
          payment_intent: intent.id,
          limit: 1,
        });
        const orderId = sessionList.data[0]?.metadata?.orderId;
        if (orderId) {
          await supabase
            .from("orders")
            .update({
              payment_status: "failed",
              updated_at: new Date().toISOString(),
            })
            .eq("id", orderId);
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const intent = charge.payment_intent as string | null;
        if (intent) {
          const sessionList = await stripe.checkout.sessions.list({
            payment_intent: intent,
            limit: 1,
          });
          const orderId = sessionList.data[0]?.metadata?.orderId;
          if (orderId) {
            await supabase
              .from("orders")
              .update({
                payment_status: "refunded",
                status: "refunded",
                updated_at: new Date().toISOString(),
              })
              .eq("id", orderId);
          }
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error("[Stripe Webhook] Processing error:", err);
    return new Response("Internal server error", { status: 500 });
  }
});
