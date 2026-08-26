import GlassSkeleton from "@/components/ui/GlassSkeleton";

export default function InstituteLoading() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <GlassSkeleton className="h-10 w-64" />
        <GlassSkeleton className="h-6 w-96" />
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid gap-6">
        {/* We use precise height classes to prevent CLS */}
        <GlassSkeleton className="h-[400px] w-full" />
      </div>
    </div>
  );
}
