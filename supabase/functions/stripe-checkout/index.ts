import Stripe from "https://esm.sh/stripe@21.0.1";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2026-03-25.dahlia",
});

interface LineItem {
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CheckoutRequest {
  items: LineItem[];
  orderId: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body: CheckoutRequest = await req.json();
    const { items, orderId, customerEmail, successUrl, cancelUrl } = body;

    if (!items?.length) {
      return new Response(
        JSON.stringify({ error: "No items provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "pkr",
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.title,
          ...(item.image ? { images: [item.image] } : {}),
        },
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      ...(customerEmail ? { customer_email: customerEmail } : {}),
      metadata: { orderId },
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: cancelUrl,
      payment_method_types: ["card"],
    });

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    console.error("[Stripe Checkout]", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
