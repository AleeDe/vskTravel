// SMS via Twilio or local Pakistan SMS provider (Jazz/Zong/Ufone)
// This example uses Twilio. Swap endpoint for local providers.

interface SMSRequest {
  phone: string; // "+92XXXXXXXXXX"
  message: string;
  type?: "order-confirmation" | "service-reminder" | "shipment-update" | "custom";
}

function formatPhone(phone: string): string {
  // Normalize Pakistani numbers
  return phone.startsWith("+92")
    ? phone
    : phone.startsWith("92")
      ? `+${phone}`
      : phone.startsWith("0")
        ? `+92${phone.slice(1)}`
        : `+92${phone}`;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body: SMSRequest = await req.json();
    const { phone, message, type = "custom" } = body;

    if (!phone || !message) {
      return new Response(
        JSON.stringify({ error: "phone and message are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const formattedPhone = formatPhone(phone);

    // Check for provider credentials
    const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioPhone = Deno.env.get("TWILIO_PHONE_NUMBER");

    // Alternative: Local Pakistan SMS provider
    const noorSmsApiKey = Deno.env.get("NOOR_SMS_API_KEY");

    if (!twilioAuthToken && !noorSmsApiKey) {
      // No SMS provider configured — log instead
      console.log("[SMS]", type, "to", formattedPhone, ":", message);
      return new Response(
        JSON.stringify({
          stub: true,
          message: "No SMS provider configured (TWILIO or NOOR_SMS)",
          phone: formattedPhone,
          text: message,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Try Twilio first
    if (twilioAuthToken && twilioAccountSid && twilioPhone) {
      const auth = btoa(`${twilioAccountSid}:${twilioAuthToken}`);
      const params = new URLSearchParams({
        From: twilioPhone,
        To: formattedPhone,
        Body: message,
      });

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("[SMS] Twilio error:", result);
        return new Response(
          JSON.stringify({ error: "Failed to send SMS via Twilio" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          provider: "twilio",
          messageId: result.sid,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fallback: Noor SMS (Pakistan-based)
    if (noorSmsApiKey) {
      const response = await fetch(
        "https://api.noorsms.com/send?sms=" +
          encodeURIComponent(message) +
          "&to=" +
          encodeURIComponent(formattedPhone) +
          "&key=" +
          noorSmsApiKey
      );

      const result = await response.text();

      if (!response.ok) {
        console.error("[SMS] Noor SMS error:", result);
        return new Response(
          JSON.stringify({ error: "Failed to send SMS via Noor" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          provider: "noor",
          response: result,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    throw new Error("No SMS provider available");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("[SMS]", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
