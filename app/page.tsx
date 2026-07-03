import { Lock, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

import { Card } from "@/shared/ui/card";
import { TOOLS } from "@/shared/utils/tools";

const HIGHLIGHTS = [
  {
    icon: Lock,
    title: "100% private",
    description:
      "Files are processed entirely in your browser. Nothing is ever uploaded to a server.",
  },
  {
    icon: Zap,
    title: "Instant",
    description:
      "Web Workers keep the UI responsive, even on large files, with no upload wait.",
  },
  {
    icon: ShieldCheck,
    title: "Free to use",
    description: "Every core tool is free — sign up only for higher daily limits.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <section className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          PDF tools that never leave your browser
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-balance">
          Merge, split, rotate, and organize PDFs instantly. No uploads, no
          waiting, no privacy trade-offs.
        </p>
      </section>

      <section className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link key={tool.slug} href={`/tools/${tool.slug}`}>
            <Card className="flex h-full flex-col gap-3 p-6 transition-colors hover:border-primary/50 hover:bg-muted/40">
              <tool.icon className="size-6 text-primary" />
              <h2 className="font-medium text-foreground">{tool.name}</h2>
              <p className="text-sm text-muted-foreground">
                {tool.description}
              </p>
            </Card>
          </Link>
        ))}
      </section>

      <section className="mt-20 grid grid-cols-1 gap-8 border-t border-border pt-12 sm:grid-cols-3">
        {HIGHLIGHTS.map((item) => (
          <div key={item.title} className="flex flex-col items-start gap-2">
            <item.icon className="size-5 text-primary" />
            <h3 className="font-medium text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
