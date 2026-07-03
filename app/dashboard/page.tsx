import { redirect } from "next/navigation";

import { BillingPortalButton } from "@/app/_components/billing-portal-button";
import { SignOutButton } from "@/app/_components/sign-out-button";
import { isSupabaseConfigured } from "@/server/auth/config";
import { createSupabaseServerClient } from "@/server/auth/supabase-server";
import { PLANS } from "@/server/billing/plans";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";

export const metadata = { title: "Dashboard — Virelto" };

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end")
    .eq("user_id", user.id)
    .single();

  const plan = PLANS[subscription?.plan === "pro" ? "pro" : "free"];

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <SignOutButton />
      </div>

      <Card className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current plan</p>
            <p className="text-lg font-medium">{plan.name}</p>
          </div>
          <Badge variant={plan.id === "pro" ? "default" : "secondary"}>
            {subscription?.status ?? "inactive"}
          </Badge>
        </div>

        <ul className="space-y-1 text-sm text-muted-foreground">
          {plan.features.map((feature) => (
            <li key={feature}>• {feature}</li>
          ))}
        </ul>

        {plan.id === "pro" ? (
          <BillingPortalButton />
        ) : (
          <a
            href="/pricing"
            className="inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Upgrade to Pro →
          </a>
        )}
      </Card>
    </div>
  );
}
