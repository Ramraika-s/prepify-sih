"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(payload: any) {
  const supabase = await createClient();
  const { identifier, password } = payload;
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: identifier,
    password,
  });

  if (error) {
    return { error: error.message };
  }
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  return { success: true, role: profile?.role || payload.role };
}

export async function signUp(payload: any) {
  const supabase = await createClient();
  const { email, password, role, ...metadata } = payload;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        ...metadata,
      }
    }
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}

export async function signOutAndRedirect() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth");
}

export async function deleteAccountAction() {
  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_my_account");
  if (error) {
    return { error: error.message };
  }
  await supabase.auth.signOut();
  redirect("/auth");
}
