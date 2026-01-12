import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const CreateOrderSchema = z.object({
  eventId: z.string().uuid("Invalid event ID format"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().email("Invalid email format").max(255, "Email too long"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits").optional().nullable(),
  amount: z.number().int("Amount must be an integer").positive("Amount must be positive").max(1000000, "Amount exceeds maximum limit"),
});

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
        JSON.stringify({ error: "Payment gateway not configured" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { keyId, keySecret } = configData.content as { keyId: string; keySecret: string };

    if (!keyId || !keySecret) {
      return new Response(
        JSON.stringify({ error: "Payment gateway not configured" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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

    const validationResult = CreateOrderSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: "Validation failed", details: validationResult.error.issues.map(i => i.message) }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { eventId, name, email, phone, amount } = validationResult.data;

    // Verify event exists and is available
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, is_published, seats_available, price")
      .eq("id", eventId)
      .eq("is_published", true)
      .single();

    if (eventError || !event) {
      return new Response(
        JSON.stringify({ error: "Event not found or not available" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (event.seats_available !== null && event.seats_available <= 0) {
      return new Response(
        JSON.stringify({ error: "Event is sold out" }),
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
      console.error("Razorpay error:", await orderResponse.text());
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
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
