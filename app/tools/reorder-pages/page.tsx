import { ToolPageShell } from "@/app/_components/tool-page-shell";
import { ReorderPagesTool } from "@/features/reorder-pages/ReorderPagesTool";

export const metadata = { title: "Reorder PDF Pages — Virelto" };

export default function ReorderPagesPage() {
  return (
    <ToolPageShell
      title="Reorder Pages"
      description="Drag pages into the order you need."
    >
      <ReorderPagesTool />
    </ToolPageShell>
  );
}
