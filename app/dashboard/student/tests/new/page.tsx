import { Suspense } from "react";
import { NewTestClient } from "@/components/tests/new-test-client";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Create Test — Prepify",
};

export default function NewTestPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      }
    >
      <NewTestClient />
    </Suspense>
  );
}
