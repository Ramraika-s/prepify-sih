import { MentorDetailClient } from "@/components/mentors/mentor-detail-client";

export default async function MentorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <MentorDetailClient id={id} />
    </>
  );
}
