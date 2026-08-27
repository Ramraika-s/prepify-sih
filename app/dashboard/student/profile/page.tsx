import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileView } from "@/components/dashboard/ProfileView";

export const metadata = {
  title: "Profile | Quero",
};

export default async function StudentProfilePage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/sign-in");
  }

  const role = user.app_metadata?.role || user.user_metadata?.role || "student";

  return <ProfileView user={{ ...user, role }} />;
}
