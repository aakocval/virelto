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
    <div className="mx-auto w-full max-w-[980px] px-4 py-14 sm:py-20">
      <section className="mx-auto max-w-2xl text-center">
        <h1 className="text-5xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl">
          PDF tools that never leave your browser
        </h1>
        <p className="mt-5 text-xl text-muted-foreground text-balance">
          Merge, split, rotate, and organize PDFs instantly. No uploads, no
          waiting, no privacy trade-offs.
        </p>
      </section>

      <section className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link key={tool.slug} href={`/tools/${tool.slug}`}>
            <Card className="h-full gap-4 px-6 transition-transform duration-200 active:scale-[0.98] sm:hover:scale-[1.015]">
              <div
                className="flex size-11 items-center justify-center rounded-[0.8rem] text-white"
                style={{ backgroundColor: tool.color }}
              >
                <tool.icon className="size-6" strokeWidth={1.75} />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                {tool.name}
              </h2>
              <p className="-mt-2 text-[0.9375rem] text-muted-foreground">
                {tool.description}
              </p>
            </Card>
          </Link>
        ))}
      </section>

      <section className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {HIGHLIGHTS.map((item) => (
          <div
            key={item.title}
            className="flex flex-col items-start gap-2 rounded-[1.25rem] bg-card p-6"
          >
            <item.icon className="size-5 text-primary" strokeWidth={2} />
            <h3 className="font-semibold text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
