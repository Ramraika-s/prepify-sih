"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollCanvasProps {
  onProgress?: (progress: number) => void;
  onReady?: () => void;
}

const FRAME_COUNT = 230;
const BUFFER_PERCENTAGE = 0.15; // 15% of frames needed to unlock UI
const REQUIRED_BUFFER = Math.ceil(FRAME_COUNT * BUFFER_PERCENTAGE);

export default function ScrollCanvas({ onProgress, onReady }: ScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(FRAME_COUNT).fill(null));
  const [loadedCount, setLoadedCount] = useState(0);
  const isReadyRef = useRef(false);

  // Preload images
  useEffect(() => {
    let currentLoaded = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const indexStr = i.toString().padStart(4, "0");
      img.src = `/assets/frame_${indexStr}.webp`;

      img.onload = () => {
        imagesRef.current[i - 1] = img;
        currentLoaded++;
        setLoadedCount(currentLoaded);

        if (onProgress) {
          const progress = (currentLoaded / FRAME_COUNT) * 100;
          onProgress(progress);
        }

        if (!isReadyRef.current && currentLoaded >= REQUIRED_BUFFER) {
          isReadyRef.current = true;
          if (onReady) onReady();
        }
      };
    }

    // Cleanup memory on unmount
    return () => {
      imagesRef.current.forEach((img) => {
        if (img) {
          img.onload = null;
          img.src = "";
        }
      });
      imagesRef.current = new Array(FRAME_COUNT).fill(null);
    };
  }, [onProgress, onReady]);

  // Handle scroll and resize rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let currentFrame = 0;

    const render = () => {
      // Calculate which frame we should be on based on scroll
      const html = document.documentElement;
      const scrollFraction = html.scrollTop / (html.scrollHeight - window.innerHeight);
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor(scrollFraction * FRAME_COUNT)
      );

      // Only attempt to draw if the frame has changed or on initial loads/resizes
      // However, we'll redraw every frame to handle potential late-loading images gracefully
      currentFrame = frameIndex || 0;

      const img = imagesRef.current[currentFrame];

      if (img && img.complete) {
        // Calculate dimensions to cover the canvas (like object-fit: cover)
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        let renderWidth, renderHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
          renderWidth = canvas.width;
          renderHeight = canvas.width / imgRatio;
          offsetX = 0;
          offsetY = (canvas.height - renderHeight) / 2;
        } else {
          renderWidth = canvas.height * imgRatio;
          renderHeight = canvas.height;
          offsetX = (canvas.width - renderWidth) / 2;
          offsetY = 0;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial sizing
    render(); // Start loop

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-screen pointer-events-none -z-10"
    />
  );
}
