import Hero from "@/components/landing/Hero";
import ExamTicker from "@/components/landing/ExamTicker";
import QuestionBank from "@/components/landing/QuestionBank";
import ImpactSection from "@/components/landing/ImpactSection";
import TwoSides from "@/components/landing/TwoSides";
import HowItWorks from "@/components/landing/HowItWorks";
import MoreThanPaper from "@/components/landing/MoreThanPaper";
import TrustStatement from "@/components/landing/TrustStatement";
import CTASection from "@/components/landing/CTASection";
import ScrollToTop from "@/components/landing/ScrollToTop";
import SectionDots from "@/components/landing/SectionDots";

export default function Home() {
  return (
    <main className="relative">
      <SectionDots />
      <Hero />
      <ExamTicker />
      <QuestionBank />
      <ImpactSection />
      <TwoSides />
      <HowItWorks />
      <MoreThanPaper />
      <TrustStatement />
      <CTASection />
      <ScrollToTop />
    </main>
  );
}
