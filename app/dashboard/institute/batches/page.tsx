import { BatchesAdminClient } from "@/components/institute/batches-admin-client";

export const metadata = {
  title: "Batch Management | Institute Portal",
};

export default function InstituteBatchesPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Batch Management</h1>
        <p className="text-zinc-400">
          Review join requests, assign students to batches, and post DPPs.
        </p>
      </header>

      <BatchesAdminClient />
    </div>
  );
}
