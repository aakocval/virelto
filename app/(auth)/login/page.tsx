import { Suspense } from "react";

import { LoginForm } from "@/app/_components/login-form";
import { Card } from "@/shared/ui/card";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 items-center px-6 py-12">
      <Card className="w-full space-y-6 p-8">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Log in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Guest mode works without an account — sign in for a higher daily
            limit.
          </p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </Card>
    </div>
  );
}
