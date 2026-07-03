import { ToolPageShell } from "@/app/_components/tool-page-shell";
import { DeletePagesTool } from "@/features/delete-pages/DeletePagesTool";

export const metadata = { title: "Delete PDF Pages — Virelto" };

export default function DeletePagesPage() {
  return (
    <ToolPageShell
      title="Delete Pages"
      description="Remove unwanted pages from a PDF."
    >
      <DeletePagesTool />
    </ToolPageShell>
  );
}
