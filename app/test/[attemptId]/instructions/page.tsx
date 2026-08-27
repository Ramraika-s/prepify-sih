import InstructionsView from "@/components/exam/InstructionsView";

export const metadata = {
  title: "Instructions - Quero",
};

export default async function InstructionsPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  return <InstructionsView attemptId={attemptId} />;
}
