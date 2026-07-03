import { ToolPageShell } from "@/app/_components/tool-page-shell";
import { RotateTool } from "@/features/rotate/RotateTool";

export const metadata = { title: "Rotate PDF — Virelto" };

export default function RotatePage() {
  return (
    <ToolPageShell
      title="Rotate PDF"
      description="Fix sideways or upside-down pages in seconds."
    >
      <RotateTool />
    </ToolPageShell>
  );
}
