export function BackgroundTexture() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      <div className="absolute inset-0 bg-background" />
      {/* Mesh Gradient / Ambient Light */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-foreground/[0.04] blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-foreground/[0.04] blur-[120px]" />

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.15] dark:opacity-30 mix-blend-overlay" />
    </div>
  );
}
