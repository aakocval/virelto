import Stripe from "stripe";

// Falls back to an obviously-fake key so the module can load (e.g. at build
// time) before real Stripe keys are configured; real API calls will simply
// fail with an auth error until STRIPE_SECRET_KEY is set.
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_placeholder",
  { apiVersion: "2026-06-24.dahlia" },
);
