"use client";

import { useCallback, useEffect, useState } from "react";

import { isSupabaseConfigured } from "@/server/auth/config";
import { createSupabaseBrowserClient } from "@/server/auth/supabase-browser";
import { PLAN_DAILY_LIMITS, type PlanId } from "@/shared/utils/constants";

function todayKey(): string {
  return `virelto-tools_usage_${new Date().toISOString().slice(0, 10)}`;
}

function readUsage(): number {
  if (typeof window === "undefined") return 0;
  return Number(window.localStorage.getItem(todayKey()) ?? "0");
}

export function useUsageLimit(plan: PlanId = "guest") {
  const [used, setUsed] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const limit = PLAN_DAILY_LIMITS[plan];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after mount
    setUsed(readUsage());
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let cancelled = false;
    async function checkAdmin() {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!cancelled && profile?.role === "admin") setIsAdmin(true);
    }
    void checkAdmin();

    return () => {
      cancelled = true;
    };
  }, []);

  const recordUsage = useCallback(() => {
    if (typeof window === "undefined") return;
    const next = readUsage() + 1;
    window.localStorage.setItem(todayKey(), String(next));
    setUsed(next);
  }, []);

  return {
    used,
    limit,
    remaining: Math.max(limit - used, 0),
    hasReachedLimit: used >= limit,
    recordUsage,
  };
}
