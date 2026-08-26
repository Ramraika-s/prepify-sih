"use client";

import { useState } from "react";
import Link from "next/link";
import { subscribeNewsletter } from "@/app/actions/newsletter";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const result = await subscribeNewsletter(email);

      if (result.error) {
        throw new Error(result.error);
      }

      setSubscribed(true);
      setEmail("");
    } catch (error: any) {
      setErrorMsg(error.message || "Unable to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerLinks = [
    {
      title: "Platform",
      links: [
        { name: "Features Overview", href: "/features" },
        { name: "CBT Simulator", href: "/student-cbt" },
        { name: "1-on-1 Mentorship", href: "/mentorship" },
        { name: "Institute Dashboard", href: "/institutes" },
      ],
    },
    {
      title: "Supported Exams",
      links: [
        { name: "JEE Main & Advanced", href: "/student-cbt" },
        { name: "NEET UG", href: "/student-cbt" },
        { name: "GATE", href: "/student-cbt" },
        { name: "UPSC CSE", href: "/student-cbt" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press & News", href: "/press" },
        { name: "Contact Support", href: "/contact-us" },
      ],
    },
    {
      title: "Legal & Trust",
      links: [
        { name: "Privacy Policy", href: "/legal/privacy" },
        { name: "Terms of Service", href: "/legal/terms" },
        { name: "Security Audit", href: "/legal/security" },
        { name: "Compliance", href: "/legal/compliance" },
      ],
    },
  ];

  return (
    <footer className="relative z-[40] w-full bg-black/95 backdrop-blur-2xl border-t border-white/10 text-white pointer-events-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-12">
        {/* Top Header & Newsletter Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <span className="text-3xl font-bold tracking-tight text-white">
                  Prepify
                </span>
              </Link>
              <p className="text-white/70 text-lg font-light leading-relaxed max-w-md">
                Experience the real exam before the actual exam. Optimizing preparation through AI simulation and expert human mentorship.
              </p>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Stay Ahead of Exam Trends
              </h3>
              <p className="text-white/70 text-sm font-light leading-relaxed mb-6">
                Subscribe to our weekly strategy digest for pattern analysis, revision blueprints, and top percentile tips.
              </p>
            </div>

            {subscribed ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
                ✓ Thank you for subscribing! Check your inbox soon.
              </div>
            ) : (
              <div className="space-y-2">
                {errorMsg && (
                  <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                    {errorMsg}
                  </div>
                )}
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 px-5 py-3.5 rounded-full bg-black/60 border border-white/15 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/40 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-3.5 bg-white text-black font-medium text-sm rounded-full hover:bg-white/90 disabled:bg-white/50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Joining...</span>
                      </>
                    ) : (
                      <span>Join Newsletter</span>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* 4 Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-b border-white/10">
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold tracking-wider text-white uppercase mb-6">
                {col.title}
              </h4>
              <ul className="space-y-3.5">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Copyright & Social Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Prepify Inc. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Twitter / X
            </a>
            <a href="#" className="hover:text-white transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Discord
            </a>
            <a href="#" className="hover:text-white transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
