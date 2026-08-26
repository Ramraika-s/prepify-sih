import { supabase } from "@/lib/supabase/client";

export const MENTOR_BUCKET = "mentor-verification-docs";
export const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10; // 10 years

export const YEAR_OPTIONS = [
  { value: "1st", label: "1st Year MBBS" },
  { value: "2nd", label: "2nd Year MBBS" },
  { value: "3rd", label: "3rd Year MBBS" },
  { value: "final", label: "Final Year MBBS" },
  { value: "intern", label: "Intern" },
] as const;

export const LANGUAGE_OPTIONS = [
  "English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam",
  "Marathi", "Bengali", "Gujarati", "Punjabi", "Odia", "Assamese",
] as const;

export function yearLabel(v: string) {
  return YEAR_OPTIONS.find((y) => y.value === v)?.label ?? v;
}

import type { Database } from "@/lib/supabase/types";

export type MentorRow = Database["public"]["Tables"]["mentors"]["Row"] & {
  colleges?: { id: string; name: string; state: string; city: string | null } | null;
};

export type PricingRow = Database["public"]["Tables"]["mentor_session_pricing"]["Row"];

/** Uploads a file to the private mentor bucket and returns a long-lived signed URL. */
export async function uploadMentorFile(userId: string, folder: string, file: File) {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/${folder}/${crypto.randomUUID()}.${ext}`;
  const up = await supabase.storage.from(MENTOR_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type,
  });
  if (up.error) throw up.error;
  const signed = await supabase.storage.from(MENTOR_BUCKET).createSignedUrl(path, SIGNED_URL_TTL);
  if (signed.error) throw signed.error;
  return signed.data.signedUrl;
}
