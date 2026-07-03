import { ToolPageShell } from "@/app/_components/tool-page-shell";
import { SplitTool } from "@/features/split/SplitTool";

export const metadata = { title: "Split PDF — Virelto" };

export default function SplitPage() {
  return (
    <ToolPageShell
      title="Split PDF"
      description="Extract a page range or split every page into its own file."
    >
      <SplitTool />
    </ToolPageShell>
  );
}
