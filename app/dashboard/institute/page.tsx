import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, BookOpen, GraduationCap, TrendingUp } from "lucide-react";

export default async function InstituteDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("institute_id")
    .eq("user_id", user.id)
    .eq("role", "institute_admin")
    .not("institute_id", "is", null)
    .maybeSingle();

  const instituteId = roleRow?.institute_id ?? null;

  if (!instituteId) {
    return (
      <div className="max-w-lg">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Institute Overview</h1>
        <p className="text-muted-foreground mt-2">No institute admin role found for your account.</p>
      </div>
    );
  }

  const [{ data: batches }, { count: studentCount }, { count: facultyCount }] = await Promise.all([
    supabase.from("institute_batches").select("id, name").eq("institute_id", instituteId).order("created_at", { ascending: false }),
    supabase.from("institute_enrollments").select("id", { count: "exact", head: true }).eq("institute_id", instituteId).eq("status", "active"),
    supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("institute_id", instituteId).eq("role", "faculty"),
  ]);

  const { data: enrollmentRows } = await supabase
    .from("institute_enrollments")
    .select("batch_id")
    .eq("institute_id", instituteId)
    .eq("status", "active");

  const studentsByBatch = new Map<string, number>();
  for (const e of enrollmentRows ?? []) {
    if (!e.batch_id) continue;
    studentsByBatch.set(e.batch_id, (studentsByBatch.get(e.batch_id) ?? 0) + 1);
  }

  const { data: instituteTestIds } = await supabase.from("tests").select("id").eq("institute_id", instituteId);
  const testIdList = (instituteTestIds ?? []).map((t) => t.id);
  let avgScorePct: number | null = null;
  if (testIdList.length) {
    const { data: scoreRows } = await supabase
      .from("test_attempts")
      .select("correct_count, total_questions")
      .in("test_id", testIdList)
      .not("submitted_at", "is", null);
    const withQuestions = (scoreRows ?? []).filter((r) => r.total_questions > 0);
    if (withQuestions.length) {
      avgScorePct = Math.round(
        (withQuestions.reduce((s, r) => s + r.correct_count / r.total_questions, 0) / withQuestions.length) * 100
      );
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Institute Overview</h1>
        <p className="text-muted-foreground mt-2">Manage your batches, track overall performance, and oversee faculty.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{studentCount ?? 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Batches</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{batches?.length ?? 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Faculty</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{facultyCount ?? 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. test score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{avgScorePct === null ? "-" : `${avgScorePct}%`}</div>
            <p className="text-xs text-muted-foreground mt-1">across your institute's tests</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Batches</CardTitle>
          <CardDescription>Active student count per batch.</CardDescription>
        </CardHeader>
        <CardContent>
          {!batches || batches.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No batches yet - create one from Batches & Faculty.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Batch name</TableHead>
                    <TableHead className="text-muted-foreground text-right">Students</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batches.map((b) => (
                    <TableRow key={b.id} className="border-border hover:bg-accent">
                      <TableCell className="font-medium text-foreground">{b.name}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{studentsByBatch.get(b.id) ?? 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
