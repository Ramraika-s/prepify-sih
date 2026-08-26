"use client";

import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface HoverTiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxTilt?: number;
  scale?: number;
}

export function HoverTiltCard({
  children,
  className,
  maxTilt = 10,
  scale = 1.02,
  ...props
}: HoverTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // We rely on CSS media queries for touch fallback
  // but we can also use GSAP for the smoothing
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only apply if pointer is fine (not touch)
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    // Map 0 -> 1 to -maxTilt -> maxTilt
    const tiltX = (0.5 - y) * maxTilt;
    const tiltY = (x - 0.5) * maxTilt;

    gsap.to(cardRef.current, {
      rotateX: tiltX,
      rotateY: tiltY,
      scale,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative transform-gpu will-change-transform",
        "bg-white/5 backdrop-blur-xl border-t border-l border-t-white/10 border-l-white/10 border-b-transparent border-r-transparent rounded-2xl shadow-antigravity",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
