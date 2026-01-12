import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get Razorpay config
    const { data: configData } = await supabase
      .from("website_content")
      .select("content")
      .eq("section_key", "razorpay_config")
      .single();

    if (!configData?.content) {
      return new Response(
        JSON.stringify({ error: "Razorpay not configured" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { keySecret } = configData.content as { keyId: string; keySecret: string };

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, registrationId } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !registrationId) {
      return new Response(
        JSON.stringify({ error: "Missing payment verification data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      // Update registration as failed
      await supabase
        .from("event_registrations")
        .update({ payment_status: "failed" })
        .eq("id", registrationId);

      return new Response(
        JSON.stringify({ error: "Invalid payment signature", verified: false }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update registration as completed
    const { error: updateError } = await supabase
      .from("event_registrations")
      .update({
        payment_status: "completed",
        payment_id: razorpay_payment_id,
      })
      .eq("id", registrationId);

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update registration" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Decrement seats available for the event
    const { data: registration } = await supabase
      .from("event_registrations")
      .select("event_id")
      .eq("id", registrationId)
      .single();

    if (registration?.event_id) {
      await supabase.rpc("decrement_event_seats", { p_event_id: registration.event_id });
    }

    return new Response(
      JSON.stringify({ verified: true, paymentId: razorpay_payment_id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
