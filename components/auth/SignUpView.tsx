"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import BackgroundVideo from "@/components/ui/BackgroundVideo";
import { signUp } from "@/app/actions/auth";

type Role = "student" | "institute" | "mentor";

export default function SignUpView() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("student");

  // Common Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Student specific
  const [targetExam, setTargetExam] = useState("JEE Main & Advanced 2026");

  // Institute specific
  const [instituteName, setInstituteName] = useState("");
  const [batchSize, setBatchSize] = useState("500–2,500 Students");

  // Mentor specific
  const [specialty, setSpecialty] = useState("Physics");

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!agreeTerms) {
      setErrorMessage("Please accept the Terms of Service to create your account.");
      return;
    }

    setIsLoading(true);

    const payload = {
      role,
      email,
      password,
      ...(role === "student" && { fullName, targetExam }),
      ...(role === "institute" && { instituteName, batchSize }),
      ...(role === "mentor" && { fullName, specialty }),
    };

    try {
      const result = await signUp(payload);

      if (!result.success) {
        setErrorMessage(result.error);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setIsSuccess(true);

      const redirectPath = `/dashboard/${role}`;

      router.push(redirectPath);
    } catch (err) {
      console.error("Registration error:", err);
      setErrorMessage("Unable to connect to registration server. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-black">
      {/* Background Ambience */}
      <BackgroundVideo opacity={0.35} />

      {/* Radial Gradient Glow Overlays */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-zinc-800/[0.15] rounded-full blur-[160px] pointer-events-none" />

      {/* Grid Overlay Lines */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full bg-[#0D0D12]/90 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.8)] relative overflow-hidden"
        >
          {/* Top Shine */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          {/* Header Title */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
            <div className="flex items-center gap-2 group mb-2">
              <span className="text-2xl font-bold tracking-tight text-white group-hover:text-white/90">
                Quero
              </span>
              <span className="text-[10px] font-mono text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded-full">
                JOIN
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Create your account
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Start your journey with NTA-grade CBT practice & mentor guidance
            </p>
          </div>

          {/* Role Switcher Tabs (3 Options) */}
          <div className="relative flex p-1.5 bg-black/60 border border-zinc-800/80 rounded-2xl mb-8">
            {(
              [
                { id: "student", label: "Student CBT" },
                { id: "institute", label: "Institute Admin" },
                { id: "mentor", label: "Faculty / Mentor" },
              ] as const
            ).map((tab) => {
              const isActive = role === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setRole(tab.id);
                    setErrorMessage("");
                  }}
                  className={`relative flex-1 py-2.5 text-xs sm:text-sm font-medium transition-colors z-10 ${isActive ? "text-white font-semibold" : "text-zinc-400 hover:text-zinc-200"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSignUpRoleTab"
                      className="absolute inset-0 bg-zinc-800/90 border border-white/15 rounded-xl shadow-md"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Success Animation Banner */}
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center space-y-4"
            >
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-2xl animate-bounce">
                ✓
              </div>
              <h3 className="text-xl font-bold text-white">Account Created Successfully</h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto">
                Welcome to Quero! Setting up your {role === "student" ? "Student CBT Dashboard" : role === "institute" ? "Institute Portal Workspace" : "Mentor Directory Profile"}...
              </p>
              <div className="pt-4 flex items-center justify-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                <span className="text-xs font-mono text-zinc-400">Initializing Workspace</span>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Option 1: Student CBT */}
              {role === "student" && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 bg-black/70 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="rahul.sharma@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-black/70 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-2">
                      Target Exam
                    </label>
                    <select
                      value={targetExam}
                      onChange={(e) => setTargetExam(e.target.value)}
                      className="w-full px-4 py-3 bg-black/70 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-white transition-colors"
                    >
                      <option value="JEE Main & Advanced 2026">JEE Main & Advanced 2026</option>
                      <option value="NEET-UG 2026">NEET-UG 2026</option>
                      <option value="GATE Computer Science (CS)">GATE Computer Science (CS)</option>
                      <option value="GATE Electronics & Comm (EC)">GATE Electronics & Comm (EC)</option>
                      <option value="CAT / MBA Entrance">CAT / MBA Entrance</option>
                      <option value="Class 12 Boards (CBSE/ISC)">Class 12 Boards (CBSE/ISC)</option>
                    </select>
                  </div>
                </>
              )}

              {/* Role Option 2: Institute Admin */}
              {role === "institute" && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-2">
                      Coaching / Educational Institute Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Entrance Institute, Kota"
                      value={instituteName}
                      onChange={(e) => setInstituteName(e.target.value)}
                      className="w-full px-4 py-3 bg-black/70 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-2">
                      Director / Admin Work Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="director@apexkota.edu.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-black/70 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-2">
                      Monthly Candidate Batch Capacity
                    </label>
                    <select
                      value={batchSize}
                      onChange={(e) => setBatchSize(e.target.value)}
                      className="w-full px-4 py-3 bg-black/70 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-white transition-colors"
                    >
                      <option value="100–500 Students">100–500 Students</option>
                      <option value="500–2,500 Students">500–2,500 Students</option>
                      <option value="2,500+ Students">2,500+ Students (Multi-center)</option>
                    </select>
                  </div>
                </>
              )}

              {/* Role Option 3: Faculty / Mentor */}
              {role === "mentor" && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-2">
                      Faculty / Mentor Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. H. C. Verma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 bg-black/70 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-2">
                      Primary Subject Specialty
                    </label>
                    <select
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="w-full px-4 py-3 bg-black/70 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-white transition-colors"
                    >
                      <option value="Physics">Physics (Mechanics, Electrodynamics)</option>
                      <option value="Organic & Inorganic Chemistry">Organic & Inorganic Chemistry</option>
                      <option value="Mathematics">Mathematics (Calculus, Algebra)</option>
                      <option value="Biology / Botany & Zoology">Biology / Botany & Zoology</option>
                      <option value="Computer Science & Data Structures">Computer Science & Data Structures</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-2">
                      Institutional / Personal Work Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="mentor.physics@quero.ai"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-black/70 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all"
                    />
                  </div>
                </>
              )}

              {/* Password Input */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-2">
                  Create Master Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-black/70 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors p-1"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.038 10.038 0 013.682-.788c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded bg-black border-zinc-700 text-white focus:ring-0 focus:ring-offset-0 cursor-pointer accent-white"
                  />
                  <span className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    I agree to the Terms of Service & Privacy Policy
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 bg-white text-black font-semibold text-xs sm:text-sm rounded-xl hover:bg-zinc-200 active:scale-[0.99] transition-all shadow-[0_0_25px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create {role === "student" ? "Student" : role === "institute" ? "Institute Admin" : "Faculty"} Account</span>
                    <span>→</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <span className="relative px-4 bg-[#0D0D12] text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
                  OR SIGN UP WITH
                </span>
              </div>

              {/* SSO Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    const { createClient } = await import("@/lib/supabase/client");
                    const supabase = createClient();
                    const { error } = await supabase.auth.signInWithOAuth({
                      provider: "google",
                      options: {
                        redirectTo: `${window.location.origin}/api/auth/callback?role=${role}`,
                      }
                    });
                    if (error) {
                      setErrorMessage("Unable to initialize Google SSO. Please try again.");
                    }
                  }}
                  className="py-3 px-4 bg-black/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2.5"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                    <path fill="#FBBC05" d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.3C.6 9.3 0 11.6 0 14s.6 4.7 1.6 6.7l3.7-2.9z" />
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 22.4 12 23z" />
                  </svg>
                  <span>Google Sign Up</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole("institute");
                  }}
                  className="py-3 px-4 bg-black/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2.5"
                >
                  <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0l-3-3m3 3l3-3" />
                  </svg>
                  <span>Institute Identity</span>
                </button>
              </div>
            </form>
          )}

          {/* Footer Sign In Link */}
          <div className="mt-8 pt-6 border-t border-zinc-800/80 text-center">
            <p className="text-xs text-zinc-400">
              Already have a Quero account?{" "}
              <Link href="/sign-in" className="text-white font-medium hover:underline">
                Sign in to your account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
