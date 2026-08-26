"use server";

import { createClient } from "@/lib/supabase/server";

export async function subscribeNewsletter(email: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("subscribers")
    .insert([{ email }]);

  if (error) {
    // Check if it's a unique violation
    if (error.code === '23505') {
      return { error: "You are already subscribed!" };
    }
    return { error: error.message };
  }

  return { success: true };
}
