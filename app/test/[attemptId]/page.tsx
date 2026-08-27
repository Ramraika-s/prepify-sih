import ExamRoomView from "@/components/exam/ExamRoomView";

export const metadata = {
  title: "Test in progress - Quero",
};

export default async function ExamRoomPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  return <ExamRoomView attemptId={attemptId} />;
}
