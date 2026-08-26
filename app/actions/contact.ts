"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitContactForm(payload: any) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("contact_messages")
    .insert([payload]);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
