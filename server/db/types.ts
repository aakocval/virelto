export interface Profile {
  id: string;
  email: string;
  created_at: string;
}

export type SubscriptionPlan = "free" | "pro";
export type SubscriptionStatus = "inactive" | "active" | "past_due" | "canceled";

export interface Subscription {
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  current_period_end: string | null;
  updated_at: string;
}
