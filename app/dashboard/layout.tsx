import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Prepify",
  description: "Your personalized Prepify dashboard and analytics portal.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
