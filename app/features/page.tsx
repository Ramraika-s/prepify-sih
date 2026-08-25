import FeaturesHero from "@/components/features/FeaturesHero";
import FeatureInspector from "@/components/features/FeatureInspector";
import FeatureMatrix from "@/components/features/FeatureMatrix";
import TechStackBanner from "@/components/features/TechStackBanner";
import BackgroundVideo from "@/components/ui/BackgroundVideo";

export const metadata = {
  title: "Platform Features — Prepify Architecture",
  description: "Explore the technical architecture powering Prepify's 1:1 NTA CBT engine, exam hall telemetry, and institutional test hosting.",
};

export default function FeaturesPage() {
  return (
    <main className="relative min-h-screen bg-transparent text-white pt-10 overflow-hidden">
      {/* Background Video with Animated Pulse Overlay */}
      <BackgroundVideo opacity={0.6} />

      <div className="relative z-10">
        <FeaturesHero />
        <FeatureInspector />
        <FeatureMatrix />
        <TechStackBanner />
      </div>
    </main>
  );
}
