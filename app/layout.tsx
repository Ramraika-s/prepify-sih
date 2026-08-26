import type { Metadata } from "next";
import "./globals.css";
import { Geist, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const spaceGrotesk = Space_Grotesk({subsets:['latin'],variable:'--font-heading'});
const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

export const metadata: Metadata = {
  title: "Prepify — The Ultimate AI-Powered CBT Platform",
  description: "Experience the real exam before the actual exam. Master your revision, get 1-on-1 mentor guidance, and empower educational institutes at scale.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon1.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png" }
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Prepify — The Ultimate AI-Powered CBT Platform",
      },
    ],
  },
};
import { AuthProvider } from "@/lib/auth";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("dark antialiased select-none font-sans", geist.variable, spaceGrotesk.variable, jetbrainsMono.variable)}>
      <body className="bg-black text-white min-h-screen select-none">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
