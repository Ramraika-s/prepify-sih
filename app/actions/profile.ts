"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { ActionResponse } from "@/lib/types/action";

const updateProfileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").optional(),
  avatar_url: z.string().url().optional().or(z.literal("")),
  target_exam: z.string().optional(),
  institute_name: z.string().optional(),
  batch_size: z.string().optional(),
  specialty: z.string().optional(),
});

export async function updateProfileDetails(payload: unknown): Promise<ActionResponse> {
  try {
    const parsed = updateProfileSchema.safeParse(payload);
    if (!parsed.success) {
      return { success: false, error: "Validation failed", validationErrors: parsed.error.issues };
    }

    const supabase = await createClient();
    
    // Explicit security check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "UNAUTHORIZED" };
    }

    const updates = parsed.data;

    // Update user_metadata in auth.users
    const { error: updateError } = await supabase.auth.updateUser({
      data: updates
    });

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Revalidate layout to flush cache and update UI instantly
    revalidatePath("/", "layout");

    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: error?.message || "An unexpected error occurred" };
  }
}

const updatePasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function updatePassword(payload: unknown): Promise<ActionResponse> {
  try {
    const parsed = updatePasswordSchema.safeParse(payload);
    if (!parsed.success) {
      return { success: false, error: "Validation failed", validationErrors: parsed.error.issues };
    }

    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "UNAUTHORIZED" };
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: parsed.data.password,
    });

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: error?.message || "An unexpected error occurred" };
  }
}
