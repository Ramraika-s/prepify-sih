export default function GlassSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-busy="true"
      aria-hidden="true"
      className={`relative overflow-hidden bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl ${className}`}
    >
      {/* Shimmer effect */}
      <div 
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
