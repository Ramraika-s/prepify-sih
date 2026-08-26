import { redirect } from "next/navigation";

export default function TestsPage() {
  redirect("/dashboard/student/tests/new");
}
