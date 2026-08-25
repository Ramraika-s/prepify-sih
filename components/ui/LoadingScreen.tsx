"use client";

import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  progress: number; // 0 to 100
  isVisible: boolean;
}

export default function LoadingScreen({ progress, isVisible }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white"
        >
          <div className="relative flex flex-col items-center justify-center w-64">
            <motion.div
              className="text-4xl font-light mb-8 tracking-widest"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              PREPIFY
            </motion.div>
            
            <div className="w-full h-[1px] bg-white/20 overflow-hidden relative">
              <motion.div
                className="absolute top-0 left-0 bottom-0 bg-white"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            
            <motion.div 
              className="mt-4 text-xs tracking-widest text-white/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              INITIALIZING EXPERIENCE
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
