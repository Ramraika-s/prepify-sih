import InstituteHero from "@/components/institutes/InstituteHero";
import DashboardPreview from "@/components/institutes/DashboardPreview";
import InstituteFeaturesBento from "@/components/institutes/InstituteFeaturesBento";
import DemoRequestForm from "@/components/institutes/DemoRequestForm";
import BackgroundVideo from "@/components/ui/BackgroundVideo";

export const metadata = {
  title: "For Institutes - Quero B2B Testing Server",
  description: "Enterprise CBT simulation, multi-center roll number management, and director performance analytics for coaching institutes.",
};

export default function InstitutesPage() {
  return (
    <main className="relative min-h-screen bg-transparent text-white pt-10 overflow-hidden">
      {/* Background Video with Grayscale Overlay */}
      <BackgroundVideo opacity={0.35} />

      <div className="relative z-10">
        <InstituteHero />
        <DashboardPreview />
        <InstituteFeaturesBento />
        <DemoRequestForm />
      </div>
    </main>
  );
}
