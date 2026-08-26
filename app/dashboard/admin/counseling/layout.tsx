import { AdminCounselingLayoutClient } from "@/components/admin/admin-counseling-layout-client";

export default function AdminCounselingLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminCounselingLayoutClient>
      {children}
    </AdminCounselingLayoutClient>
  );
}
