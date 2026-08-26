"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, registerStudentSchema, registerInstituteSchema, registerMentorSchema } from "@/lib/validations/auth";
import { ActionResponse } from "@/lib/types/action";

// Simple in-memory rate limiter (per Edge isolate / Node process)
// For a multi-node production setup, replace with @upstash/ratelimit
const rateLimitCache = new Map<string, { count: number; expiresAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitCache.get(ip);
  if (!record || record.expiresAt < now) {
    rateLimitCache.set(ip, { count: 1, expiresAt: now + WINDOW_MS });
    return true;
  }
  if (record.count >= MAX_ATTEMPTS) {
    return false;
  }
  record.count++;
  return true;
}

export async function signIn(payload: unknown): Promise<ActionResponse<{ role: string }>> {
  try {
    const parsed = loginSchema.safeParse(payload);
    if (!parsed.success) {
      return { success: false, error: "Validation failed", validationErrors: parsed.error.issues };
    }

    // Since we don't have request IP in standard server actions easily without headers(), 
    // we use the identifier as the rate limit key.
    const rlKey = `auth_signIn_${parsed.data.identifier}`;
    if (!checkRateLimit(rlKey)) {
      return { success: false, error: "Too many login attempts, please try again later" };
    }

    const supabase = await createClient();
    const { identifier, password } = parsed.data;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: identifier,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    return { success: true, data: { role: profile?.role || parsed.data.role } };
  } catch (error: any) {
    return { success: false, error: error?.message || "An unexpected error occurred" };
  }
}

export async function signUp(payload: unknown): Promise<ActionResponse> {
  try {
    // Basic structural check to determine role before applying specific schema
    if (typeof payload !== "object" || payload === null || !("role" in payload)) {
      return { success: false, error: "Invalid payload" };
    }

    const rawPayload = payload as Record<string, unknown>;
    const role = rawPayload.role as string;
    
    let parsed;
    if (role === "student") parsed = registerStudentSchema.safeParse(payload);
    else if (role === "institute") parsed = registerInstituteSchema.safeParse(payload);
    else if (role === "mentor") parsed = registerMentorSchema.safeParse(payload);
    else return { success: false, error: "Invalid role" };

    if (!parsed.success) {
      return { success: false, error: "Validation failed", validationErrors: parsed.error.issues };
    }

    const supabase = await createClient();
    const { email, password, role: parsedRole, ...metadata } = parsed.data;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: parsedRole,
          ...metadata,
        }
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: error?.message || "An unexpected error occurred" };
  }
}

export async function signOut(): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: error?.message || "An unexpected error occurred" };
  }
}

export async function signOutAndRedirect() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}

export async function deleteAccountAction(): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    
    // Explicit security check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "UNAUTHORIZED" };
    }

    // Since we have ON DELETE CASCADE set up in postgres, 
    // deleting the user from auth.users via Admin API will cleanly wipe all related data.
    const { supabaseAdmin } = await import("@/lib/supabase/server-admin");
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    
    if (deleteError) {
      console.error("Account deletion failed:", deleteError);
      return { success: false, error: deleteError.message };
    }

    await supabase.auth.signOut();
  } catch (error: any) {
    return { success: false, error: error?.message || "An unexpected error occurred" };
  }
  
  redirect("/sign-in");
}
