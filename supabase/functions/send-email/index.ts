import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface EmailRequest {
  to: string;
  subject: string;
  template: "order-confirmation" | "order-shipped" | "service-reminder" | "custom";
  data?: Record<string, string | number | boolean>;
  html?: string;
}

function getTemplate(
  template: string,
  data: Record<string, string | number | boolean>
): string {
  switch (template) {
    case "order-confirmation":
      return `
        <h2>Order Confirmed! 🎉</h2>
        <p>Hi ${data.customerName},</p>
        <p>Your order <strong>${data.orderNumber}</strong> has been confirmed.</p>
        <p><strong>Order Total:</strong> PKR ${data.totalAmount}</p>
        <p>You can track your order in your <a href="${data.dashboardUrl}">account dashboard</a>.</p>
        <p>Thank you for choosing VSK Travel!</p>
      `;

    case "order-shipped":
      return `
        <h2>Your Order is On the Way! 📦</h2>
        <p>Hi ${data.customerName},</p>
        <p>Order <strong>${data.orderNumber}</strong> has been shipped.</p>
        <p><strong>Tracking:</strong> ${data.trackingNumber || "Updates coming soon"}</p>
        <p>Check your <a href="${data.dashboardUrl}">account</a> for updates.</p>
      `;

    case "service-reminder":
      return `
        <h2>Reminder: Your Service Booking 🎫</h2>
        <p>Hi ${data.customerName},</p>
        <p>Don't forget! Your <strong>${data.serviceName}</strong> booking is on <strong>${data.serviceDate}</strong>.</p>
        <p>Meeting point: ${data.meetingPoint || "Check your booking details"}</p>
        <p>Contact: ${data.partnerPhone || "Partner details in dashboard"}</p>
      `;

    case "custom":
    default:
      return data.html || "";
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body: EmailRequest = await req.json();
    const { to, subject, template, data = {}, html } = body;

    if (!to || !subject) {
      return new Response(
        JSON.stringify({ error: "to and subject are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!resendApiKey) {
      // Resend not configured — log instead
      console.log("[Email] Would send to", to, ":", subject, data);
      return new Response(
        JSON.stringify({
          stub: true,
          message: "RESEND_API_KEY not configured",
          email: to,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const emailHtml =
      template === "custom" && html ? html : getTemplate(template, data);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "VSK Travel <noreply@vsktravel.pk>",
        to,
        subject,
        html: emailHtml,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("[Email] Resend error:", result);
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: true, messageId: result.id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("[Email]", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
