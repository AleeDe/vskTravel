import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface PayoutRequest {
  partnerId: string;
  month: string; // "2026-03"
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body: PayoutRequest = await req.json();
    const { partnerId, month } = body;

    if (!partnerId || !month) {
      return new Response(
        JSON.stringify({ error: "partnerId and month are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get all commission transactions for partner in this month
    const startDate = `${month}-01`;
    const endDate = new Date(`${month}-01`);
    endDate.setMonth(endDate.getMonth() + 1);
    const endDateStr = endDate.toISOString().split("T")[0];

    const { data: transactions, error: txnErr } = await supabase
      .from("commission_transactions")
      .select("*")
      .eq("partner_id", partnerId)
      .gte("date", startDate)
      .lt("date", endDateStr)
      .eq("status", "settled");

    if (txnErr) {
      console.error("[Payouts] Query error:", txnErr.message);
      return new Response(
        JSON.stringify({ error: txnErr.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const totalCommission = transactions.reduce((s, t) => s + t.commission, 0);
    const totalGross = transactions.reduce((s, t) => s + t.gross, 0);

    // Create payout record
    const { data: payout, error: payoutErr } = await supabase
      .from("partner_payouts")
      .insert({
        partner_id: partnerId,
        month,
        total_commission: totalCommission,
        total_gross: totalGross,
        transaction_count: transactions.length,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (payoutErr) {
      console.error("[Payouts] Insert error:", payoutErr.message);
      return new Response(
        JSON.stringify({ error: payoutErr.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        payout: {
          id: payout.id,
          totalCommission,
          totalGross,
          transactionCount: transactions.length,
        },
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("[Payouts]", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
