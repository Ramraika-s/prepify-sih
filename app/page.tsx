"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import LenisProvider from "@/components/providers/LenisProvider";
import LoadingScreen from "@/components/ui/LoadingScreen";
import HeroSection from "@/components/landing/HeroSection";
import FeatureSection from "@/components/landing/FeatureSection";
import FinalCallToAction from "@/components/landing/FinalCallToAction";

// Dynamically import ScrollCanvas with SSR disabled
const ScrollCanvas = dynamic(() => import("@/components/ui/ScrollCanvas"), {
  ssr: false,
});

export default function Home() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  const handleCanvasReady = () => {
    const elapsed = Date.now() - startTimeRef.current;
    const MIN_DURATION = 1000; // 1.0 second minimum loading duration
    const remainingTime = Math.max(0, MIN_DURATION - elapsed);

    setTimeout(() => {
      setIsCanvasReady(true);
    }, remainingTime);
  };

  return (
    <LenisProvider>
      <main className="relative w-full min-h-screen">
        <LoadingScreen 
          progress={loadingProgress} 
          isVisible={!isCanvasReady} 
        />

        {/* 3D Canvas Background (z-[-10]) */}
        <ScrollCanvas 
          onProgress={setLoadingProgress} 
          onReady={handleCanvasReady} 
        />

        {/* Shiny Black Tint Overlay (z-[0]) */}
        <div className="fixed inset-0 z-[0] pointer-events-none bg-black/30 bg-gradient-to-b from-black/80 via-transparent to-black/80" />

        {/* Content Overlay Track (z-[10]) */}
        <div className="relative z-[10] pointer-events-none">
          
          {/* Milestone 1 */}
          <HeroSection />
          
          {/* Milestone 2 */}
          <FeatureSection 
            headline="Supercharge Your Preparation" 
            subHeadline="Stop guessing what the exam will feel like. Our platform is built to eliminate test anxiety and optimize your revision through a blend of technology and human expertise."
            alignment="left"
            features={[
              {
                title: "Flawless CBT Simulation",
                description: "Practice in an environment that perfectly mirrors real-world testing interfaces. Familiarity breeds confidence."
              },
              {
                title: "AI-Powered Revision",
                description: "Our intelligent engine analyzes your test patterns, identifies your weak points, and builds custom revision paths to maximize your score."
              },
              {
                title: "Expert Mentor Guides",
                description: "Never feel lost. Connect with top-tier mentors who provide personalized strategies, emotional support, and doubt resolution."
              }
            ]}
          />

          {/* Milestone 3 */}
          <FeatureSection 
            headline="Empower Your Institute with Next-Gen Tools" 
            subHeadline="Bring your classroom into the future. We provide educational institutes with the infrastructure to track, manage, and elevate their students' success at scale."
            alignment="right"
            features={[
              {
                title: "Centralized Command Center",
                description: "Onboard your students effortlessly and track their progress through comprehensive, real-time dashboards."
              },
              {
                title: "Actionable AI Insights",
                description: "Let AI do the heavy lifting. Get detailed analytics on cohort performance to know exactly where your teaching interventions are needed most."
              },
              {
                title: "Scale Your Mentorship",
                description: "Assign your own faculty or tap into our network of expert mentors to guide your students individually without overwhelming your staff."
              }
            ]}
          />

          {/* Milestone 4 */}
          <FinalCallToAction />

        </div>
      </main>
    </LenisProvider>
  );
}
