import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Prepify — The Ultimate AI-Powered CBT Platform",
  description: "Experience the real exam before the actual exam. Master your revision, get 1-on-1 mentor guidance, and empower educational institutes at scale.",
};

import { AuthProvider } from "@/lib/auth";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("antialiased select-none", "font-sans", geist.variable)}>
      <body className="bg-black text-white min-h-screen select-none">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
