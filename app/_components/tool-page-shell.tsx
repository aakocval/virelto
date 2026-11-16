export function ToolPageShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-[2rem] leading-tight font-bold tracking-tight">{title}</h1>
        <p className="mt-1.5 text-base text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}
