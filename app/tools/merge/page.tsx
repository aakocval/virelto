import { ToolPageShell } from "@/app/_components/tool-page-shell";
import { MergeTool } from "@/features/merge/MergeTool";

export const metadata = { title: "Merge PDF" };

export default function MergePage() {
  return (
    <ToolPageShell
      title="Merge PDF"
      description="Combine multiple PDFs into one file, entirely in your browser."
    >
      <MergeTool />
    </ToolPageShell>
  );
}
