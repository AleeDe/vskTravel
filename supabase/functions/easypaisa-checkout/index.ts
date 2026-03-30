import * as crypto from "https://deno.land/std@0.208.0/crypto/mod.ts";

const EASYPAISA_STORE_ID = Deno.env.get("EASYPAISA_STORE_ID") || "";
const EASYPAISA_HASH_KEY = Deno.env.get("EASYPAISA_HASH_KEY") || "";
const EASYPAISA_RETURN_URL = Deno.env.get("EASYPAISA_RETURN_URL") || "";
const EASYPAISA_SANDBOX = Deno.env.get("EASYPAISA_SANDBOX") === "true";

const EASYPAISA_ENDPOINT = EASYPAISA_SANDBOX
  ? "https://easypay.easypaisa.com.pk/easypay-sandbox/index.jsf"
  : "https://easypay.easypaisa.com.pk/easypay/index.jsf";

function hashPayload(data: string): string {
  return crypto
    .createHmac("sha256", EASYPAISA_HASH_KEY)
    .update(data)
    .digest("base64");
}

interface EasyPaisaRequest {
  orderId: string;
  amountPKR: number;
  description: string;
  customerEmail?: string;
  customerMobile?: string;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body: EasyPaisaRequest = await req.json();
    const { orderId, amountPKR, description, customerEmail, customerMobile } =
      body;

    if (!orderId || !amountPKR) {
      return new Response(
        JSON.stringify({ error: "orderId and amountPKR are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!EASYPAISA_STORE_ID || !EASYPAISA_HASH_KEY) {
      return new Response(
        JSON.stringify({
          stub: true,
          message:
            "EasyPaisa credentials not configured in Supabase env vars",
          endpoint: EASYPAISA_ENDPOINT,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const expiryDate = new Date(Date.now() + 60 * 60 * 1000)
      .toISOString()
      .replace("T", " ")
      .slice(0, 19);

    const amount = amountPKR.toFixed(2);

    const hashString = `${amount}${expiryDate}${orderId}MA${EASYPAISA_RETURN_URL}${EASYPAISA_STORE_ID}`;
    const hash = hashPayload(hashString);

    const params: Record<string, string> = {
      storeId: EASYPAISA_STORE_ID,
      orderId,
      transactionAmount: amount,
      mobileAccountNo: customerMobile || "",
      emailAddress: customerEmail || "",
      transactionType: "MA",
      tokenExpiry: expiryDate,
      merchantPaymentMethod: "",
      description: description.slice(0, 100),
      successUrl: EASYPAISA_RETURN_URL,
      failureUrl: EASYPAISA_RETURN_URL,
      hashValue: hash,
    };

    return new Response(
      JSON.stringify({ endpoint: EASYPAISA_ENDPOINT, params }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    console.error("[EasyPaisa Checkout]", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
