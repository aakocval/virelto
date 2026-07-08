import { ToolPageShell } from "@/app/_components/tool-page-shell";
import { PdfToImagesTool } from "@/features/pdf-to-images/PdfToImagesTool";

export const metadata = { title: "PDF to Images" };

export default function PdfToImagesPage() {
  return (
    <ToolPageShell
      title="PDF to Images"
      description="Export any page as a high-quality PNG or JPEG."
    >
      <PdfToImagesTool />
    </ToolPageShell>
  );
}
