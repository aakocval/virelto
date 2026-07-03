"use server";

import { redirect } from "next/navigation";

import { isSupabaseConfigured } from "@/server/auth/config";
import { createSupabaseServerClient } from "@/server/auth/supabase-server";

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

const NOT_CONFIGURED_ERROR =
  "Auth isn't configured yet — add your Supabase keys to .env.local.";

export async function signInWithMagicLink(
  email: string,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: NOT_CONFIGURED_ERROR };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${siteUrl()}/auth/callback` },
  });
  return { error: error?.message ?? null };
}

export async function signInWithGoogle(): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: NOT_CONFIGURED_ERROR };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${siteUrl()}/auth/callback` },
  });

  if (error) return { error: error.message };
  if (data.url) redirect(data.url);
  return { error: null };
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
