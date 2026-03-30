import * as crypto from "https://deno.land/std@0.208.0/crypto/mod.ts";

const JAZZCASH_MERCHANT_ID = Deno.env.get("JAZZCASH_MERCHANT_ID") || "";
const JAZZCASH_PASSWORD = Deno.env.get("JAZZCASH_PASSWORD") || "";
const JAZZCASH_INTEGRITY_SALT = Deno.env.get("JAZZCASH_INTEGRITY_SALT") || "";
const JAZZCASH_RETURN_URL = Deno.env.get("JAZZCASH_RETURN_URL") || "";
const JAZZCASH_SANDBOX = Deno.env.get("JAZZCASH_SANDBOX") === "true";

const JAZZCASH_ENDPOINT = JAZZCASH_SANDBOX
  ? "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/"
  : "https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/";

function buildHMAC(params: Record<string, string>): string {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => params[k])
    .join("&");
  const message = `${JAZZCASH_INTEGRITY_SALT}&${sorted}`;
  return crypto
    .createHmac("sha256", JAZZCASH_INTEGRITY_SALT)
    .update(message)
    .digest("hex");
}

function getDateTimeString(): string {
  const now = new Date();
  return now.toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);
}

interface JazzCashRequest {
  orderId: string;
  amountPKR: number;
  description: string;
  mobileNumber?: string;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body: JazzCashRequest = await req.json();
    const { orderId, amountPKR, description, mobileNumber } = body;

    if (!orderId || !amountPKR) {
      return new Response(
        JSON.stringify({ error: "orderId and amountPKR are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!JAZZCASH_MERCHANT_ID || !JAZZCASH_PASSWORD || !JAZZCASH_INTEGRITY_SALT) {
      return new Response(
        JSON.stringify({
          stub: true,
          message:
            "JazzCash credentials not configured in Supabase env vars",
          endpoint: JAZZCASH_ENDPOINT,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const txnDateTime = getDateTimeString();
    const expiryDateTime = new Date(Date.now() + 60 * 60 * 1000)
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .slice(0, 14);

    const amountPaisa = String(amountPKR * 100);

    const params: Record<string, string> = {
      pp_Version: "1.1",
      pp_TxnType: "MWALLET",
      pp_Language: "EN",
      pp_MerchantID: JAZZCASH_MERCHANT_ID,
      pp_Password: JAZZCASH_PASSWORD,
      pp_TxnRefNo: `T${orderId.replace(/-/g, "")}`,
      pp_Amount: amountPaisa,
      pp_TxnCurrency: "PKR",
      pp_TxnDateTime: txnDateTime,
      pp_BillReference: orderId,
      pp_Description: description.slice(0, 100),
      pp_TxnExpiryDateTime: expiryDateTime,
      pp_ReturnURL: JAZZCASH_RETURN_URL,
      ...(mobileNumber ? { pp_MobileNumber: mobileNumber } : {}),
    };

    const secureHash = buildHMAC(params);

    return new Response(
      JSON.stringify({
        endpoint: JAZZCASH_ENDPOINT,
        params: { ...params, pp_SecureHash: secureHash },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    console.error("[JazzCash Checkout]", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
