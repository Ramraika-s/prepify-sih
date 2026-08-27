import type { Metadata } from "next";
import "./globals.css";
import { Geist, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const spaceGrotesk = Space_Grotesk({subsets:['latin'],variable:'--font-heading'});
const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

export const metadata: Metadata = {
  title: "Quero - The Ultimate AI-Powered CBT Platform",
  description: "Experience the real exam before the actual exam. Master your revision, get expert faculty guidance, and empower educational institutes at scale.",
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
        alt: "Quero - The Ultimate AI-Powered CBT Platform",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased select-none font-sans", geist.variable, spaceGrotesk.variable, jetbrainsMono.variable)}
    >
      <body className="bg-background text-foreground min-h-screen select-none">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
