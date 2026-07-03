import { ToolPageShell } from "@/app/_components/tool-page-shell";
import { ImagesToPdfTool } from "@/features/images-to-pdf/ImagesToPdfTool";

export const metadata = { title: "Images to PDF — I Like PDF" };

export default function ImagesToPdfPage() {
  return (
    <ToolPageShell
      title="Images to PDF"
      description="Turn JPG or PNG photos into a single PDF document."
    >
      <ImagesToPdfTool />
    </ToolPageShell>
  );
}
