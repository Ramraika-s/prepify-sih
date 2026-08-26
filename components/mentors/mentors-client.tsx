"use client";

import { useMemo, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFetch as useQuery } from "@/lib/use-fetch";
import { supabase } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, Star, MessageCircle, Search, Users } from "lucide-react";
import { LANGUAGE_OPTIONS, YEAR_OPTIONS, yearLabel, type MentorRow } from "@/lib/mentors";
import { HoverTiltCard } from "@/components/ui/hover-tilt-card";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function MentorsClient() {
  const searchParams = useSearchParams();
  const initialCollege = searchParams.get("college") ?? "";

  const [q, setQ] = useState("");
  const [state, setState] = useState("");
  const [collegeId, setCollegeId] = useState(initialCollege);
  const [year, setYear] = useState("");
  const [language, setLanguage] = useState("");
  const [gender, setGender] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  const { data: mentors = [], isLoading } = useQuery({
    queryKey: ["mentors-directory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mentors")
        .select("*, colleges(id, name, state, city)")
        .eq("verification_status", "verified")
        .eq("is_active", true)
        .order("rating", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as MentorRow[];
    },
  });

  const states = useMemo(
    () => [...new Set(mentors.map((m: any) => m.colleges?.state).filter(Boolean) as string[])].sort(),
    [mentors],
  );
  const colleges = useMemo(() => {
    const map = new Map<string, string>();
    mentors.forEach((m: any) => { if (m.colleges) map.set(m.colleges.id, m.colleges.name); });
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [mentors]);

  const filtered = mentors.filter((m: any) => {
    if (q && !`${m.full_name} ${m.colleges?.name ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (state && m.colleges?.state !== state) return false;
    if (collegeId && m.college_id !== collegeId) return false;
    if (year && m.current_year !== year) return false;
    if (language && !(m.languages ?? []).includes(language)) return false;
    if (gender && m.gender !== gender) return false;
    return true;
  });

  useGSAP(() => {
    if (filtered.length > 0 && containerRef.current) {
      gsap.from(".mentor-card", {
        y: 40,
        opacity: 0,
        stagger: 0.05,
        duration: 0.6,
        ease: "back.out(1.2)",
      });
    }
  }, { dependencies: [filtered.length, isLoading], scope: containerRef });

  return (
    <div className="min-h-screen pb-28 text-white">
      <section className="relative overflow-hidden mb-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-antigravity p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <Badge className="bg-white/20 text-white border-0 mb-4 backdrop-blur-md">1:1 Guidance</Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold leading-tight tracking-tight text-shadow-metric">
            Get guidance from verified MBBS students studying in your dream medical college.
          </h1>
          <p className="mt-4 text-zinc-300 font-sans text-lg">
            Real students. Real experience. Book a chat or a call in minutes.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#find" className="rounded-full bg-white text-black px-6 py-2.5 text-sm font-semibold hover:bg-zinc-200 transition-colors">Find Mentor</a>
            <Link href="/dashboard/mentor/apply" className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2.5 text-sm font-semibold hover:bg-white/20 transition-colors">
              Become a Mentor
            </Link>
          </div>
        </div>
      </section>

      <main id="find" className="space-y-6">
        <HoverTiltCard className="p-4 space-y-3" maxTilt={3}>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <Input 
              className="pl-9 bg-black/40 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-white/30 rounded-xl" 
              placeholder="Search mentor or college" 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <Select value={state} onChange={setState} placeholder="State" options={states.map((s) => [s, s])} />
            <Select value={collegeId} onChange={setCollegeId} placeholder="College" options={colleges} />
            <Select value={year} onChange={setYear} placeholder="Year" options={YEAR_OPTIONS.map((y) => [y.value, y.label])} />
            <Select value={language} onChange={setLanguage} placeholder="Language" options={LANGUAGE_OPTIONS.map((l) => [l, l])} />
            <Select value={gender} onChange={setGender} placeholder="Gender" options={[["male", "Male"], ["female", "Female"], ["other", "Other"]]} />
            <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white" onClick={() => { setQ(""); setState(""); setCollegeId(""); setYear(""); setLanguage(""); setGender(""); }}>
              Reset
            </Button>
          </div>
        </HoverTiltCard>

        {isLoading && <div className="text-sm font-mono text-zinc-400 text-center py-12 animate-pulse">Scanning network...</div>}

        {!isLoading && filtered.length === 0 && (
          <HoverTiltCard className="p-12 text-center flex flex-col items-center justify-center gap-4 text-zinc-400">
            <Users size={32} className="opacity-50" />
            <p className="font-sans text-lg">No mentors match these criteria.</p>
          </HoverTiltCard>
        )}

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m: any) => (
            <HoverTiltCard key={m.id} className="mentor-card p-5 flex flex-col justify-between">
              <div className="flex gap-4">
                <Avatar url={m.photo_url} name={m.full_name} size={64} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <h3 className="font-heading font-bold text-lg tracking-tight truncate text-white">{m.full_name}</h3>
                    <BadgeCheck size={16} className="text-white shrink-0" />
                  </div>
                  <div className="text-sm font-sans text-zinc-300 truncate">
                    {yearLabel(m.current_year)} · {m.colleges?.name}
                  </div>
                  <div className="text-xs font-mono text-zinc-500 truncate mt-0.5">
                    {m.colleges?.city ? `${m.colleges.city}, ` : ""}{m.colleges?.state}
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs font-mono">
                    <span className="flex items-center gap-1 font-semibold text-amber-300 text-shadow-metric">
                      <Star size={12} className="fill-amber-300" />
                      {Number(m.rating).toFixed(1)}
                    </span>
                    <span className="text-zinc-400">({m.total_reviews} reviews)</span>
                    <span className="text-zinc-400">{m.total_sessions} sessions</span>
                  </div>
                  {(m.languages ?? []).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(m.languages ?? []).slice(0, 4).map((l: any) => (
                        <span key={l} className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-mono tracking-wide text-zinc-300">{l}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <Link href={`/dashboard/student/mentors/${m.id}`} className="col-span-2">
                  <Button className="w-full bg-white text-black hover:bg-zinc-200 font-sans font-semibold rounded-xl">View Profile</Button>
                </Link>
                <Link href={`/dashboard/student/mentors/chat/${m.id}`}>
                  <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10 rounded-xl"><MessageCircle size={16} /></Button>
                </Link>
              </div>
            </HoverTiltCard>
          ))}
        </div>
      </main>
    </div>
  );
}

function Select({ value, onChange, placeholder, options }: {
  value: string; onChange: (v: string) => void; placeholder: string; options: [string, string][];
}) {
  return (
    <select
      className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-white/30 cursor-pointer"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}

export function Avatar({ url, name, size = 56 }: { url: string | null; name: string; size?: number }) {
  return (
    <div
      className="rounded-2xl bg-white/10 overflow-hidden shrink-0 border border-white/20 flex items-center justify-center font-heading font-bold text-xl text-zinc-400 shadow-inner"
      style={{ height: size, width: size }}
    >
      {url ? <img src={url} alt={name} className="h-full w-full object-cover" /> : name.slice(0, 1).toUpperCase()}
    </div>
  );
}
