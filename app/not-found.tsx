import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      {/* Background spatial elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[30%] left-[10%] w-96 h-96 bg-zinc-700/10 rounded-full blur-[120px] mix-blend-screen" style={{ willChange: 'transform' }} />
        <div className="absolute bottom-[10%] right-[30%] w-96 h-96 bg-zinc-800/20 rounded-full blur-[100px] mix-blend-screen" style={{ willChange: 'transform' }} />
      </div>

      {/* Glassmorphism Panel */}
      <div className="z-10 bg-white/5 backdrop-blur-2xl border border-white/10 p-12 rounded-3xl max-w-lg w-full shadow-2xl text-center transform-gpu">
        <h1 className="text-7xl font-extrabold tracking-tighter mb-2 text-white drop-shadow-lg">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-4 text-white/90">Page Not Found</h2>
        <p className="text-zinc-400 mb-8 font-light leading-relaxed">
          The coordinate you requested does not exist within our current sector.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-medium rounded-full hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            Return to Base
          </Link>
        </div>
      </div>
    </div>
  );
}
