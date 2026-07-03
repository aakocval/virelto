import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/server/auth/config";
import { createSupabaseServerClient } from "@/server/auth/supabase-server";
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

  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  if (!subscription?.stripe_customer_id) {
    return NextResponse.json(
      { error: "No billing account found." },
      { status: 404 },
    );
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${siteUrl()}/dashboard`,
  });

  return NextResponse.json({ url: session.url });
}
