"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSupabase } from "@/components/providers/supabase-provider";
import { Spinner } from "@/components/ui/spinner";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading }: any = useSupabase();

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Show a loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  // Render children if user is authenticated
  return <>{children}</>;
}
