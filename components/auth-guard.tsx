"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSupabase } from "@/components/providers/supabase-provider";
import { Spinner } from "@/components/ui/spinner";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading }: any = useSupabase();
  const [mounted, setMounted] = useState(false);

  // ensure we don't redirect during hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Redirect to login if user is not authenticated and the component has mounted
    if (mounted && !loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router, mounted]);

  // Show a loading spinner while checking authentication
  if (loading || !mounted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  // Render children if user is authenticated
  return <>{children}</>;
}
