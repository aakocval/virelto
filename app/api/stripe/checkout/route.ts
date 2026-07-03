import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/server/auth/config";
import { createSupabaseServerClient } from "@/server/auth/supabase-server";
import { PLANS } from "@/server/billing/plans";
import { stripe } from "@/server/billing/stripe";

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function POST() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Sign-in isn't configured yet." },
      { status: 501 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const priceId = PLANS.pro.priceId;
  if (!priceId) {
    return NextResponse.json(
      { error: "Pro plan is not configured yet." },
      { status: 500 },
    );
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: subscription?.stripe_customer_id ?? undefined,
    customer_email: subscription?.stripe_customer_id ? undefined : user.email,
    client_reference_id: user.id,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl()}/dashboard?upgraded=1`,
    cancel_url: `${siteUrl()}/pricing`,
  });

  return NextResponse.json({ url: session.url });
}
