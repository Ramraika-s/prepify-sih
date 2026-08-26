import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileView } from "@/components/dashboard/ProfileView";

export const metadata = {
  title: "Profile | Prepify",
};

export default async function AdminProfilePage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/sign-in");
  }

  const role = user.app_metadata?.role || user.user_metadata?.role || "admin";

  return <ProfileView user={{ ...user, role }} />;
}
