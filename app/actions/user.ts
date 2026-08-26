"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function completeOnboarding(data: {
  goal: "neet_ug" | "neet_pg";
  academic_stage: string | null;
  exam_year: number | null;
  language: string;
  weak_subjects: string[];
}) {
  const supabase = await createClient();
  const { data: { session }, error: authError } = await supabase.auth.getSession();

  if (authError || !session) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase.from("user_preferences").upsert({
    user_id: session.user.id,
    goal: data.goal,
    academic_stage: data.academic_stage,
    exam_year: data.exam_year,
    language: data.language,
    weak_subjects: data.weak_subjects,
    onboarding_completed: true,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout"); // Revalidate the whole app to pick up new prefs
  return { success: true };
}
