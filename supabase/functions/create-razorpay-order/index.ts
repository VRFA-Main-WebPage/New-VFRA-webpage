import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    // Get Razorpay config from website_content
    const { data: configData } = await supabase
      .from("website_content")
      .select("content")
      .eq("section_key", "razorpay_config")
      .single();

    if (!configData?.content) {
      return new Response(
        JSON.stringify({ error: "Razorpay not configured. Please configure in admin panel." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { keyId, keySecret } = configData.content as { keyId: string; keySecret: string };

    if (!keyId || !keySecret) {
      return new Response(
        JSON.stringify({ error: "Razorpay keys not configured" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { eventId, name, email, phone, amount } = await req.json();

    if (!eventId || !name || !email || !amount) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Razorpay order
    const auth = btoa(`${keyId}:${keySecret}`);
    const orderResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency: "INR",
        receipt: `event_${eventId}_${Date.now()}`,
        notes: {
          event_id: eventId,
          customer_name: name,
          customer_email: email,
        },
      }),
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.text();
      console.error("Razorpay error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to create order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const order = await orderResponse.json();

    // Create registration record
    const { data: registration, error: regError } = await supabase
      .from("event_registrations")
      .insert({
        event_id: eventId,
        name,
        email,
        phone: phone || null,
        amount,
        order_id: order.id,
        payment_status: "pending",
      })
      .select()
      .single();

    if (regError) {
      console.error("Registration error:", regError);
      return new Response(
        JSON.stringify({ error: "Failed to create registration" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        orderId: order.id,
        registrationId: registration.id,
        keyId,
        amount: order.amount,
        currency: order.currency,
      }),
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
