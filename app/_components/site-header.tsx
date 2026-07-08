import { FileText } from "lucide-react";
import Link from "next/link";

import { isSupabaseConfigured } from "@/server/auth/config";
import { createSupabaseServerClient } from "@/server/auth/supabase-server";
import { Button } from "@/shared/ui/button";
import { ThemeToggle } from "@/shared/ui/theme-toggle";

export async function SiteHeader() {
  const user = isSupabaseConfigured()
    ? (await (await createSupabaseServerClient()).auth.getUser()).data.user
    : null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <FileText className="size-5 text-primary" />
          <span>Virelto Tools</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/pricing">Pricing</Link>
          </Button>
          <ThemeToggle />
          {user ? (
            <Button size="sm" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <Button size="sm" asChild>
              <Link href="/login">Log in</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
