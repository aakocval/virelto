"use client";

import { useCallback, useEffect, useState } from "react";

import { PLAN_DAILY_LIMITS, type PlanId } from "@/shared/utils/constants";

function todayKey(): string {
  return `virelto_usage_${new Date().toISOString().slice(0, 10)}`;
}

function readUsage(): number {
  if (typeof window === "undefined") return 0;
  return Number(window.localStorage.getItem(todayKey()) ?? "0");
}

export function useUsageLimit(plan: PlanId = "guest") {
  const [used, setUsed] = useState(0);
  const limit = PLAN_DAILY_LIMITS[plan];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after mount
    setUsed(readUsage());
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
