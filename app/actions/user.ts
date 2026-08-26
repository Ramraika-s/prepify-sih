"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { onboardingSchema } from "@/lib/validations/auth";
import { ActionResponse } from "@/lib/types/action";

export async function completeOnboarding(payload: unknown): Promise<ActionResponse> {
  try {
    const parsed = onboardingSchema.safeParse(payload);
    if (!parsed.success) {
      return { success: false, error: "Validation failed", validationErrors: parsed.error.issues };
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "UNAUTHORIZED" };
    }

    // Wrap multi-table inserts into a single RPC for transaction safety
    const { error } = await supabase.rpc("complete_onboarding", {
      p_user_id: user.id,
      p_profile_data: {},
      p_preferences_data: parsed.data,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/", "layout");
    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: error?.message || "An unexpected error occurred" };
  }
}
