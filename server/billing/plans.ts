export interface Plan {
  id: "free" | "pro";
  name: string;
  priceId: string | undefined;
  monthlyPrice: string;
  dailyLimit: number | "unlimited";
  features: string[];
}

export const PLANS: Record<"free" | "pro", Plan> = {
  free: {
    id: "free",
    name: "Free",
    priceId: undefined,
    monthlyPrice: "$0",
    dailyLimit: 10,
    features: [
      "10 operations per day",
      "All core PDF tools",
      "100% client-side processing",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    monthlyPrice: "$6/mo",
    dailyLimit: "unlimited",
    features: [
      "Unlimited operations",
      "All core PDF tools",
      "Priority support",
    ],
  },
};
