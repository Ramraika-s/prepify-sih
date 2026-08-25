"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "/features" },
    { name: "Student CBT", href: "/student-cbt" },
    { name: "Institutes", href: "/institutes" },
    { name: "Mentorship", href: "/mentorship" },
  ];

  return (
    <>
      {/* Permanent Fixed Header across all pages */}
      <header className="fixed top-5 left-1/2 -translate-x-1/2 z-[50] w-[92%] max-w-6xl pointer-events-none">
        <div className="flex items-center justify-between px-6 py-3 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] pointer-events-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 group">
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-white/90 transition-colors">
              Prepify
            </span>
          </Link>

          {/* Desktop Nav Links with Active State Detection */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-all ${
                    isActive
                      ? "text-white font-semibold bg-white/10 px-3.5 py-1 rounded-full border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                      : "text-white/70 hover:text-white px-3.5 py-1"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/sign-in"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/contact-us"
              className="px-5 py-2.5 bg-white text-black font-medium text-sm rounded-full hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] transform hover:scale-105 inline-block text-center"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white/80 hover:text-white p-1"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer (z-[100]) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-8 pointer-events-auto md:hidden"
          >
            <div className="flex items-center justify-between">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-white">
                  Prepify
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/80 hover:text-white p-2"
                aria-label="Close menu"
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-6 my-auto">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-2xl font-light transition-colors ${
                      isActive ? "text-white font-semibold" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="flex flex-col gap-4">
              <Link
                href="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-4 text-center border border-white/20 text-white font-medium rounded-full hover:bg-white/10 transition-colors block"
              >
                Sign In
              </Link>
              <Link
                href="/contact-us"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-4 text-center bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] block"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
