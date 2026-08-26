import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export const revalidate = 60; // Cache for 60 seconds

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("counseling_articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  return (
    <article className="rounded-2xl border border-border bg-card p-4 space-y-3">
      <header>
        <h1 className="text-xl font-bold">{data.title}</h1>
        {data.summary && <p className="text-sm text-muted-foreground mt-1">{data.summary}</p>}
      </header>
      <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed">
        {data.content}
      </div>
    </article>
  );
}
