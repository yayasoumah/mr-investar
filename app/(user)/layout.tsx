import { ReactNode } from "react";
import { DashboardHeader } from "@/components/user/dashboard-header";

export default function UserLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      {/* Main Content - Adjusted to account for fixed navbar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        {children}
      </main>
    </div>
  );
} 