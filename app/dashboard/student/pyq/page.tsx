import { createClient } from "@/lib/supabase/server";
import { PyqClient } from "@/components/pyq/pyq-client";

export const metadata = {
  title: "PYQ Library — Prepify",
};

export default async function PyqPage() {
  const supabase = await createClient();
  const exam = "NEET-UG";

  const [
    { data: subjects },
    { data: yearData },
  ] = await Promise.all([
    supabase.from("subjects").select("*").order("sort_order"),
    supabase.from("questions").select("pyq_year").eq("is_pyq", true).eq("pyq_exam", exam).not("pyq_year", "is", null),
  ]);

  const yearSet = new Set<number>();
  yearData?.forEach((r) => r.pyq_year != null && yearSet.add(r.pyq_year));
  const years = Array.from(yearSet).sort((a, b) => b - a);

  return <PyqClient initialSubjects={subjects ?? []} initialYears={years} />;
}
