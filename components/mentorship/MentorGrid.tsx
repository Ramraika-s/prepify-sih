"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";

interface Mentor {
  id: number;
  name: string;
  rank: string;
  college: string;
  exam: "jee" | "neet" | "gate";
  scarcityBadge: string;
  isWaitlisted?: boolean;
  topics: string[];
}

const mentorList: Mentor[] = [
  {
    id: 1,
    name: "Aravind Sharma",
    rank: "JEE Adv AIR 42",
    college: "IIT Bombay — B.Tech Computer Science",
    exam: "jee",
    scarcityBadge: "Only 2 slots left for Sunday",
    topics: ["Physics Mechanics", "Maths Calculus", "Negative Marking Control"],
  },
  {
    id: 2,
    name: "Dr. Priya Verma",
    rank: "NEET 715 / 720 (AIR 19)",
    college: "AIIMS New Delhi — MBBS",
    exam: "neet",
    scarcityBadge: "1 slot remaining this week",
    topics: ["NCERT Biology Edge", "Organic Synthesis", "Time Management"],
  },
  {
    id: 3,
    name: "Rohan Kulkarni",
    rank: "GATE CS AIR 14",
    college: "IISc Bangalore — M.Tech CS",
    exam: "gate",
    scarcityBadge: "Waitlisted (Next availability: Nov 14)",
    isWaitlisted: true,
    topics: ["Algorithms & DS", "NAT Numerical Accuracy", "Virtual Calc Mastery"],
  },
  {
    id: 4,
    name: "Siddharth Nambiar",
    rank: "JEE Adv AIR 184",
    college: "IIT Delhi — Electrical Engineering",
    exam: "jee",
    scarcityBadge: "3 slots available",
    topics: ["Physical Chemistry", "Paper Attempt Order", "Anxiety Control"],
  },
];

export default function MentorGrid() {
  const [filter, setFilter] = useState<"all" | "jee" | "neet" | "gate">("all");
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const filteredMentors = filter === "all" ? mentorList : mentorList.filter((m) => m.exam === filter);

  return (
    <section id="mentor-grid" className="py-16 px-6 md:px-12 max-w-7xl mx-auto border-b border-zinc-800/60">
      <Reveal delay={100}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Verified AIR Ranker Network
            </h2>
            <p className="text-zinc-400 text-sm font-normal max-w-xl">
              1-on-1 video sessions focused purely on exam paper strategy, time allocation, and confidence.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-[#0D0D11] border border-zinc-800 self-start md:self-auto">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                filter === "all" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              All Mentors
            </button>
            <button
              onClick={() => setFilter("jee")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                filter === "jee" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              JEE Advanced
            </button>
            <button
              onClick={() => setFilter("neet")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                filter === "neet" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              NEET UG
            </button>
            <button
              onClick={() => setFilter("gate")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                filter === "gate" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              GATE CS
            </button>
          </div>
        </div>
      </Reveal>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMentors.map((mentor, idx) => (
          <Reveal key={mentor.id} delay={150 + idx * 100}>
            <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-zinc-700 transition-colors h-full">
              <div>
                {/* Header Row with Scarcity Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <span className="px-2.5 py-1 rounded bg-zinc-800 text-white font-mono text-[11px] font-bold border border-zinc-700">
                      {mentor.rank}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-2">{mentor.name}</h3>
                    <p className="text-zinc-400 text-xs font-mono">{mentor.college}</p>
                  </div>

                  {/* Scarcity Badge */}
                  <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold whitespace-nowrap border ${
                    mentor.isWaitlisted
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                  }`}>
                    ⚡ {mentor.scarcityBadge}
                  </span>
                </div>

                {/* Topic Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {mentor.topics.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-lg bg-black/60 border border-zinc-800 text-zinc-300 text-[11px] font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Row */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-mono">1-on-1 Video Session (45m)</span>
                <button
                  onClick={() => { setSelectedMentor(mentor); setBookingSuccess(false); }}
                  disabled={mentor.isWaitlisted}
                  className={`px-5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    mentor.isWaitlisted
                      ? "bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed"
                      : "bg-white text-black hover:bg-zinc-200"
                  }`}
                >
                  {mentor.isWaitlisted ? "Join Waitlist" : "Reserve 1-on-1 Slot"}
                </button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Booking Modal Teaser */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <div className="text-xs font-mono font-bold text-white uppercase">RESERVE STRATEGY SESSION</div>
              <button
                onClick={() => setSelectedMentor(null)}
                className="text-zinc-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            {bookingSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="text-emerald-400 text-2xl font-bold">✓ Slot Reserved</div>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  Your 45-minute strategy call with <span className="text-white font-bold">{selectedMentor.name}</span> ({selectedMentor.rank}) is confirmed. Meeting link sent to your email.
                </p>
                <button
                  onClick={() => setSelectedMentor(null)}
                  className="mt-3 px-5 py-2 bg-zinc-800 text-white text-xs rounded-lg hover:bg-zinc-700"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-black/60 p-4 rounded-xl border border-zinc-800">
                  <div className="text-white font-bold text-sm">{selectedMentor.name}</div>
                  <div className="text-xs text-emerald-400 font-mono">{selectedMentor.rank}</div>
                  <div className="text-[11px] text-zinc-400 mt-1">{selectedMentor.college}</div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-2">Select Session Date</label>
                  <select className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-xs text-white">
                    <option>Saturday (Nov 15) — 4:00 PM IST</option>
                    <option>Sunday (Nov 16) — 11:00 AM IST</option>
                    <option>Sunday (Nov 16) — 7:00 PM IST</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-2">Primary Session Focus</label>
                  <select className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-xs text-white">
                    <option>Paper Attempt Strategy & Speed</option>
                    <option>Negative Marking & Guessing Control</option>
                    <option>3-Hour Exam Hall Anxiety Management</option>
                  </select>
                </div>

                <button
                  onClick={() => setBookingSuccess(true)}
                  className="w-full py-3 bg-white text-black font-semibold text-xs rounded-xl hover:bg-zinc-200 transition-all mt-2"
                >
                  Confirm Session Reservation
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
