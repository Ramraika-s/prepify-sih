import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { rpc } from "@/lib/supabase-rpc";

export type StudentEnrollment = {
  enrollment_id: string;
  institute_id: string;
  institute_name: string;
  batch_id: string | null;
  batch_name: string | null;
  status: "pending" | "active" | "rejected" | "removed";
  requested_at: string;
};

/** The current student's own institute enrollment (if any), fetched once per mount. */
export function useInstituteContextForStudent() {
  const { user, loading: authLoading } = useAuth();
  const [enrollment, setEnrollment] = useState<StudentEnrollment | null | undefined>(undefined);

  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    rpc<StudentEnrollment[]>("my_institute_enrollment").then(({ data }) => {
      if (!cancelled) setEnrollment(data?.[0] ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  return { enrollment, isLoading: authLoading || enrollment === undefined };
}
