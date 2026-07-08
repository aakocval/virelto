import { ToolPageShell } from "@/app/_components/tool-page-shell";
import { SignTool } from "@/features/sign/SignTool";

export const metadata = { title: "Sign PDF" };

export default function SignPage() {
  return (
    <ToolPageShell
      title="Sign PDF"
      description="Add text and signatures to fill out and sign forms."
    >
      <SignTool />
    </ToolPageShell>
  );
}
