import { MentorChatClient } from "@/components/mentors/mentor-chat-client";

export default async function MentorChatPage({ params }: { params: Promise<{ mentorId: string }> }) {
  const { mentorId } = await params;
  return (
    <>
      <MentorChatClient mentorId={mentorId} />
    </>
  );
}
