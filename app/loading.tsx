export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05070d] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,rgba(47,107,255,0.14),transparent_70%)]" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-[#2f6bff]/10 rounded-full blur-[140px]" />

      <div className="z-10 flex flex-col items-center gap-7">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-2xl q-gradient-bg blur-xl opacity-40 animate-pulse" />
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80" style={{ animation: "quero-spin 1.8s linear infinite" }}>
            <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
            <circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke="url(#quero-loader-gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="70 150"
            />
            <defs>
              <linearGradient id="quero-loader-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2f6bff" />
                <stop offset="100%" stopColor="#1c4fd6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-9 h-9 rounded-xl q-gradient-bg flex items-center justify-center text-white font-black text-base animate-pulse">
              Q
            </div>
          </div>
        </div>
        <p className="text-white/40 font-mono tracking-[0.25em] uppercase text-xs">Loading Quero</p>
      </div>

      <style>{`
        @keyframes quero-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
