import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prepify — The Ultimate AI-Powered CBT Platform",
  description: "Experience the real exam before the actual exam. Master your revision, get 1-on-1 mentor guidance, and empower educational institutes at scale.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased select-none">
      <body className="bg-black text-white min-h-screen select-none">
        {children}
      </body>
    </html>
  );
}
