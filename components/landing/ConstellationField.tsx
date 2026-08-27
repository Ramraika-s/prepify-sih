"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  tw: number; // twinkle phase
};

const STAR_COUNT = 240;
const LINK_DIST = 160;
const CURSOR_LINK_DIST = 220;

export default function ConstellationField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars: Star[] = [];
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };

    const init = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect?.width ?? window.innerWidth;
      height = rect?.height ?? window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.8 + 0.7,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);

      // update + draw stars
      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;
        s.tw += 0.02;

        const twinkle = 0.5 + Math.sin(s.tw) * 0.5;
        ctx.shadowBlur = 6;
        ctx.shadowColor = "rgba(140, 175, 255, 0.9)";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 215, 255, ${0.55 + twinkle * 0.45})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // star-to-star links
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const a = stars[i];
          const b = stars[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(140, 170, 255, ${0.22 * (1 - dist / LINK_DIST)})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      // cursor links — the field reacts to the mouse
      for (const s of stars) {
        const dx = s.x - mouse.x;
        const dy = s.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CURSOR_LINK_DIST) {
          const strength = 1 - dist / CURSOR_LINK_DIST;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(120, 170, 255, ${strength * 0.75})`;
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }
      }

      if (mouse.x > -1000) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, CURSOR_LINK_DIST);
        grad.addColorStop(0, "rgba(70, 130, 255, 0.18)");
        grad.addColorStop(1, "rgba(70, 130, 255, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, CURSOR_LINK_DIST, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(step);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    init();
    step();
    window.addEventListener("resize", init);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
