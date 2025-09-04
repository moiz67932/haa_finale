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
  <div className="flex h-screen overflow-hidden bg-[url('/carousels/homepage-2.png')] bg-cover bg-center bg-fixed">
          {/* Sidebar */}
          <div className="w-48 flex-shrink-0 bg-white border-r border-gray-200">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex flex-col flex-1 relative">
            <main className="flex-1 overflow-auto p-6 space-y-6">
              <div className="min-h-full">{children}</div>
            </main>
          </div>
        </div>
      </AuthGuard>
    </Suspense>
  );
}
