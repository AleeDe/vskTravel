import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface OrderItem {
  type: "product" | "service";
  ref_id: string;
  title: string;
  price: number;
  quantity: number;
  variant?: string;
  serviceDate?: string;
  travelers?: number;
}

interface CreateOrderRequest {
  customer_id?: string;
  contact: { fullName: string; email: string; phone: string };
  shipping?: { address: string; city: string; postalCode: string };
  payment_method: string;
  items: OrderItem[];
  notes?: string;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body: CreateOrderRequest = await req.json();
    const { contact, shipping, payment_method, items, customer_id, notes } =
      body;

    if (!items?.length) {
      return new Response(
        JSON.stringify({ error: "No items provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const orderNumber = `VSK-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_id: customer_id || null,
        customer_name: contact.fullName,
        customer_email: contact.email,
        customer_phone: contact.phone,
        shipping_address: shipping || null,
        payment_method,
        payment_status:
          payment_method === "pay_at_venue" ? "pending" : "awaiting_payment",
        status: "pending",
        total_amount: total,
        notes: notes || null,
      })
      .select("id, order_number")
      .single();

    if (orderErr || !order) {
      console.error("[Create Order] Insert error:", orderErr?.message);
      return new Response(
        JSON.stringify({
          error: orderErr?.message || "Failed to create order",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      item_type: item.type,
      service_id: item.type === "service" ? item.ref_id : null,
      product_id: item.type === "product" ? item.ref_id : null,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      variant: item.variant || null,
      service_date: item.serviceDate || null,
      travelers: item.travelers || null,
    }));

    const { error: itemsErr } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsErr) {
      console.error("[Create Order] Items insert error:", itemsErr.message);
    }

    return new Response(
      JSON.stringify({
        orderId: order.id,
        orderNumber: order.order_number,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("[Create Order]", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
