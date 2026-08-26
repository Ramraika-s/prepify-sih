import ResultView from "@/components/exam/ResultView";

export const metadata = {
  title: "Test result — Prepify",
};

export default async function ResultPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  return <ResultView attemptId={attemptId} />;
}
