import { createClient } from "@/lib/supabase/server";
import { PyqClient } from "@/components/pyq/pyq-client";

export const metadata = {
  title: "PYQ Library - Quero",
};

export default async function PyqPage() {
  const supabase = await createClient();
  const { data: subjects } = await supabase.from("subjects").select("*").order("sort_order");

  return <PyqClient initialSubjects={subjects ?? []} />;
}
