import CBTHero from "@/components/student-cbt/CBTHero";
import SimulatorPreview from "@/components/student-cbt/SimulatorPreview";
import CBTFeaturesBento from "@/components/student-cbt/CBTFeaturesBento";
import ExamPatternBreakdown from "@/components/student-cbt/ExamPatternBreakdown";
import BackgroundVideo from "@/components/ui/BackgroundVideo";

export const metadata = {
  title: "Student CBT Simulator - NTA JEE, NEET & GATE Practice",
  description: "Practice in an authentic 1:1 replica of official NTA and GATE test software. Features time-per-question telemetry, negative marking protection, and offline session resilience.",
};

export default function StudentCBTPage() {
  return (
    <main className="relative min-h-screen bg-transparent text-white pt-10 overflow-hidden">
      {/* Background Video with Animated Pulse Overlay */}
      <BackgroundVideo opacity={0.6} />

      <div className="relative z-10">
        <CBTHero />
        <SimulatorPreview />
        <CBTFeaturesBento />
        <ExamPatternBreakdown />
      </div>
    </main>
  );
}
