export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background spatial elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-zinc-800/20 rounded-full blur-[150px] mix-blend-screen" style={{ willChange: 'transform' }} />
      </div>

      {/* Glassmorphism Loader */}
      <div className="z-10 flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-white/10 border-t-white/80 animate-spin" style={{ animationDuration: '1.5s' }} />
          {/* Inner ring */}
          <div className="absolute inset-2 rounded-full border-2 border-white/5 border-b-white/50 animate-spin" style={{ animationDuration: '1s', animationDirection: 'reverse' }} />
          {/* Core glow */}
          <div className="absolute inset-6 bg-white/20 blur-sm rounded-full animate-pulse" />
        </div>
        <p className="text-zinc-400 font-light tracking-widest uppercase text-sm animate-pulse">
          Initializing
        </p>
      </div>
    </div>
  );
}
