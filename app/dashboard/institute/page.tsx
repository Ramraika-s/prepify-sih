import Link from "next/link";
import BackgroundVideo from "@/components/ui/BackgroundVideo";

export default function InstituteDashboard() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-black">
      {/* Background Ambience */}
      <BackgroundVideo opacity={0.35} />

      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-zinc-800/[0.15] rounded-full blur-[160px] pointer-events-none" />

      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-xl mx-auto text-center">
        <div className="w-full bg-[#0D0D12]/90 border border-white/10 rounded-3xl p-10 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.8)] relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          
          <h1 className="text-3xl font-bold text-white tracking-tight mb-4">
            Institute Admin Portal
          </h1>
          <p className="text-sm text-zinc-400 mb-8">
            Manage your batches, faculty, and view institutional analytics here.
          </p>
          
          <div className="flex justify-center gap-4">
            <Link href="/" className="px-6 py-2 bg-white text-black text-sm font-medium rounded-xl hover:bg-zinc-200 transition-colors">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
