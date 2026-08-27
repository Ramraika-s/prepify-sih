"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";

export default function DemoRequestForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    instituteName: "",
    city: "Kota",
    batchSize: "500–2,500 Students",
    directorName: "",
    email: "",
    phone: "",
  });

  const handleNext = () => {
    if (step < 3) setStep((prev) => (prev + 1) as any);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => (prev - 1) as any);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="b2b-demo" className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
      <Reveal delay={100}>
        <div className="max-w-2xl mx-auto bg-[#0D0D11] border border-zinc-800 rounded-2xl p-8 sm:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block mb-2">
              B2B PARTNERSHIP
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Schedule a Guided Institute Demo
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm">
              Complete the 3-step setup wizard to receive custom pricing and a white-label preview account.
            </p>
          </div>

          {/* Progress Indicator */}
          {!submitted && (
            <div className="flex items-center justify-center gap-3 mb-8 text-xs font-mono">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                step === 1 ? "bg-white text-black border-white font-bold" : "bg-zinc-900 border-zinc-800 text-zinc-400"
              }`}>
                <span>1</span>
                <span>Institute</span>
              </div>
              <span className="text-zinc-700">-</span>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                step === 2 ? "bg-white text-black border-white font-bold" : "bg-zinc-900 border-zinc-800 text-zinc-400"
              }`}>
                <span>2</span>
                <span>Batch Size</span>
              </div>
              <span className="text-zinc-700">-</span>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                step === 3 ? "bg-white text-black border-white font-bold" : "bg-zinc-900 border-zinc-800 text-zinc-400"
              }`}>
                <span>3</span>
                <span>Contact</span>
              </div>
            </div>
          )}

          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="inline-flex h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 items-center justify-center text-xl font-bold">
                ✓
              </div>
              <h3 className="text-xl font-bold text-white">Demo Access Requested</h3>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Thank you, <span className="text-white font-semibold">{formData.directorName || "Director"}</span>. Our institutional solutions team will contact <span className="text-white font-semibold">{formData.email}</span> within 2 business hours with your white-label staging portal credentials.
              </p>
              <button
                onClick={() => { setSubmitted(false); setStep(1); }}
                className="mt-4 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium rounded-lg transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: Low Friction */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-2">Institute Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Academy Kota"
                      value={formData.instituteName}
                      onChange={(e) => setFormData({ ...formData, instituteName: e.target.value })}
                      className="w-full px-4 py-3 bg-black/60 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-2">Primary City / Operating Center</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 bg-black/60 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-white transition-colors"
                    >
                      <option value="Kota">Kota, Rajasthan</option>
                      <option value="Delhi">Delhi / NCR</option>
                      <option value="Hyderabad">Hyderabad, Telangana</option>
                      <option value="Patna">Patna, Bihar</option>
                      <option value="Pune">Pune, Maharashtra</option>
                      <option value="Kolkata">Kolkata, West Bengal</option>
                      <option value="Other">Other City</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full py-3.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-zinc-200 transition-all mt-4"
                  >
                    Continue to Step 2 →
                  </button>
                </div>
              )}

              {/* STEP 2: Qualification (Clickable Batch Size Pills) */}
              {step === 2 && (
                <div className="space-y-4">
                  <label className="block text-xs font-medium text-zinc-300 mb-2">How many candidates do you test monthly?</label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {["100–500 Students", "500–2,500 Students", "2,500+ Students"].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setFormData({ ...formData, batchSize: size })}
                        className={`p-4 rounded-xl border text-xs text-left font-medium transition-all ${
                          formData.batchSize === size
                            ? "bg-zinc-800 border-white text-white shadow-sm"
                            : "bg-black/40 border-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-5 py-3 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-medium rounded-xl transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 py-3.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-zinc-200 transition-all"
                    >
                      Continue to Step 3 →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Conversion */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-2">Director / HOD Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. R. K. Sharma"
                      value={formData.directorName}
                      onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
                      className="w-full px-4 py-3 bg-black/60 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-2">Work Email</label>
                    <input
                      type="email"
                      required
                      placeholder="director@institute.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-black/60 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-2">Contact Phone (WhatsApp)</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-black/60 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-5 py-3 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-medium rounded-xl transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                      Request Director Demo Link
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </Reveal>
    </section>
  );
}
