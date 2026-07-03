import { Check } from "lucide-react";
import Link from "next/link";

import { UpgradeButton } from "@/app/_components/upgrade-button";
import { PLANS } from "@/server/billing/plans";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";

export const metadata = { title: "Pricing — Virelto" };

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Simple pricing
        </h1>
        <p className="mt-2 text-muted-foreground">
          Every core tool is free. Upgrade only if you need unlimited daily
          usage.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card className="space-y-4 p-6">
          <div>
            <h2 className="font-medium">{PLANS.free.name}</h2>
            <p className="text-3xl font-semibold">{PLANS.free.monthlyPrice}</p>
          </div>
          <ul className="space-y-2 text-sm">
            {PLANS.free.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check className="size-4 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Start for free</Link>
          </Button>
        </Card>

        <Card className="space-y-4 border-primary p-6">
          <div>
            <h2 className="font-medium">{PLANS.pro.name}</h2>
            <p className="text-3xl font-semibold">{PLANS.pro.monthlyPrice}</p>
          </div>
          <ul className="space-y-2 text-sm">
            {PLANS.pro.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check className="size-4 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
          <UpgradeButton />
        </Card>
      </div>
    </div>
  );
}
