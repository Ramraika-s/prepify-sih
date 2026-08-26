import { CollegeDetailClient } from "@/components/counseling/college-detail-client";

export default async function CollegeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <CollegeDetailClient id={id} />
    </>
  );
}
