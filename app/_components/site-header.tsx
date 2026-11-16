import Link from "next/link";

import { LogoMark } from "@/app/_components/logo";
import { isSupabaseConfigured } from "@/server/auth/config";
import { createSupabaseServerClient } from "@/server/auth/supabase-server";
import { Button } from "@/shared/ui/button";
import { ThemeToggle } from "@/shared/ui/theme-toggle";

export async function SiteHeader() {
  const user = isSupabaseConfigured()
    ? (await (await createSupabaseServerClient()).auth.getUser()).data.user
    : null;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-12 max-w-[980px] items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-[1.0625rem] font-semibold tracking-tight"
        >
          <LogoMark className="size-6" />
          Virelto
        </Link>

        <nav className="flex items-center gap-1">
          <ThemeToggle />
          {user ? (
            <Button size="sm" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
