import { Suspense } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Spinner } from "@/components/ui/spinner";
import AuthGuard from "@/components/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Spinner />}>
      <AuthGuard>
        <div className="flex h-screen bg-gray-50">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow-lg flex-shrink-0">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex flex-col flex-1">
            {/* Navbar */}
            <div className="h-16 bg-white shadow-md flex items-center px-6"></div>

            {/* Page Content */}
            <main className="flex-1 overflow-auto p-2">{children}</main>
          </div>
        </div>
      </AuthGuard>
    </Suspense>
  );
}
