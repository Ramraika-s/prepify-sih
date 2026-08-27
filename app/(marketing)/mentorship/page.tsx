import MentorshipHero from "@/components/mentorship/MentorshipHero";
import MentorGrid from "@/components/mentorship/MentorGrid";
import SessionRoadmap from "@/components/mentorship/SessionRoadmap";
import BackgroundVideo from "@/components/ui/BackgroundVideo";

export const metadata = {
  title: "1-on-1 Mentorship - Top AIR Ranker Strategy Network",
  description: "Connect 1-on-1 with top JEE Advanced, NEET, and GATE AIR rankers for paper attempt strategy, time allocation, and anxiety control.",
};

export default function MentorshipPage() {
  return (
    <main className="relative min-h-screen bg-transparent text-white pt-10 overflow-hidden">
      {/* Background Video with Grayscale Overlay */}
      <BackgroundVideo opacity={0.35} />

      <div className="relative z-10">
        <MentorshipHero />
        <MentorGrid />
        <SessionRoadmap />
      </div>
    </main>
  );
}
