import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema for payment verification
const VerifyPaymentSchema = z.object({
  razorpay_order_id: z.string().regex(/^order_[A-Za-z0-9]+$/, "Invalid order ID format"),
  razorpay_payment_id: z.string().regex(/^pay_[A-Za-z0-9]+$/, "Invalid payment ID format"),
  razorpay_signature: z.string().regex(/^[a-f0-9]{64}$/, "Invalid signature format"),
  registrationId: z.string().uuid("Invalid registration ID format"),
});

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
        JSON.stringify({ error: "Payment gateway not configured" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { keySecret } = configData.content as { keyId: string; keySecret: string };

    // Parse and validate input
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validationResult = VerifyPaymentSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: "Validation failed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, registrationId } = validationResult.data;

    // Verify the registration exists and is pending
    const { data: existingReg, error: regCheckError } = await supabase
      .from("event_registrations")
      .select("id, payment_status")
      .eq("id", registrationId)
      .single();

    if (regCheckError || !existingReg) {
      return new Response(
        JSON.stringify({ error: "Registration not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (existingReg.payment_status === "completed") {
      return new Response(
        JSON.stringify({ error: "Payment already verified", verified: true }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify signature
    const signatureBody = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = createHmac("sha256", keySecret)
      .update(signatureBody)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      // Update registration as failed
      await supabase
        .from("event_registrations")
        .update({ payment_status: "failed" })
        .eq("id", registrationId);

      return new Response(
        JSON.stringify({ error: "Payment verification failed", verified: false }),
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
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
