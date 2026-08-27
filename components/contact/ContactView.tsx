"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BackgroundVideo from "@/components/ui/BackgroundVideo";
import { contactSchema, type ContactFormData } from "@/lib/validations/contact";
import { submitContactForm } from "@/app/actions/contact";

export default function ContactView() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      topic: "General Inquiry",
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    setErrorMessage("");
    try {
      const result = await submitContactForm({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        message: data.message,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      setIsSuccess(true);
      reset();
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to connect to the server. Please check your network.");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white selection:bg-white/20 selection:text-white pt-24 pb-20">
      <BackgroundVideo opacity={0.15} />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] sm:text-xs font-mono text-zinc-400 mb-6 uppercase tracking-wider">
              24/7 Priority Support
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
              Get in <span className="text-zinc-500">touch.</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              Whether you are a student facing a technical issue, an institute looking for a custom B2B deployment, or a mentor wanting to join our faculty-our team is ready to assist.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-12"
          >
            <div>
              <h3 className="text-xl font-semibold mb-6">Direct Channels</h3>
              <div className="space-y-6">
                <div className="group flex gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-900 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-black border border-zinc-800 flex items-center justify-center shrink-0 group-hover:border-zinc-600 transition-colors">
                    <svg className="w-4 h-4 text-zinc-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Student Support</p>
                    <p className="text-xs text-zinc-400 mt-1">support@quero.ai</p>
                  </div>
                </div>

                <div className="group flex gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-900 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-black border border-zinc-800 flex items-center justify-center shrink-0 group-hover:border-zinc-600 transition-colors">
                    <svg className="w-4 h-4 text-zinc-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Institute Partnerships</p>
                    <p className="text-xs text-zinc-400 mt-1">b2b@quero.ai</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6">Headquarters</h3>
              <div className="p-6 rounded-2xl bg-[#0D0D12] border border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Quero Technologies Pvt. Ltd.<br />
                  TechPark Workspace, Block C<br />
                  Koramangala, Bengaluru<br />
                  Karnataka 560034, India
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-[#0D0D12]/90 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.8)] relative"
          >
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

            {isSuccess ? (
              <div className="py-16 text-center space-y-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-2xl mx-auto">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-white">Message Sent</h3>
                <p className="text-sm text-zinc-400 max-w-xs mx-auto">
                  Thank you for reaching out. Our support team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-8 px-6 py-2 bg-zinc-900 border border-zinc-800 text-white text-xs rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400">First Name</label>
                    <input
                      {...register("firstName")}
                      type="text"
                      className={`w-full px-4 py-3 bg-black/70 border rounded-xl text-sm text-white focus:outline-none focus:ring-1 transition-all ${errors.firstName ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : "border-zinc-800 focus:border-white focus:ring-white/20"
                        }`}
                      placeholder="John"
                    />
                    {errors.firstName && <p className="text-[10px] text-red-400">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400">Last Name</label>
                    <input
                      {...register("lastName")}
                      type="text"
                      className={`w-full px-4 py-3 bg-black/70 border rounded-xl text-sm text-white focus:outline-none focus:ring-1 transition-all ${errors.lastName ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : "border-zinc-800 focus:border-white focus:ring-white/20"
                        }`}
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="text-[10px] text-red-400">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400">Email Address</label>
                  <input
                    {...register("email")}
                    type="email"
                    className={`w-full px-4 py-3 bg-black/70 border rounded-xl text-sm text-white focus:outline-none focus:ring-1 transition-all ${errors.email ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : "border-zinc-800 focus:border-white focus:ring-white/20"
                      }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-[10px] text-red-400">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400">Topic</label>
                  <select
                    {...register("topic")}
                    className={`w-full px-4 py-3 bg-black/70 border rounded-xl text-sm text-white focus:outline-none transition-colors ${errors.topic ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : "border-zinc-800 focus:border-white"
                      }`}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Institute Partnership">Institute Partnership</option>
                    <option value="Billing & Subscriptions">Billing & Subscriptions</option>
                  </select>
                  {errors.topic && <p className="text-[10px] text-red-400">{errors.topic.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400">Message</label>
                  <textarea
                    {...register("message")}
                    rows={4}
                    className={`w-full px-4 py-3 bg-black/70 border rounded-xl text-sm text-white focus:outline-none focus:ring-1 transition-all resize-none ${errors.message ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : "border-zinc-800 focus:border-white focus:ring-white/20"
                      }`}
                    placeholder="How can we help you?"
                  />
                  {errors.message && <p className="text-[10px] text-red-400">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-white text-black font-semibold text-sm rounded-xl hover:bg-zinc-200 disabled:bg-zinc-400 disabled:cursor-not-allowed active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Message</span>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
