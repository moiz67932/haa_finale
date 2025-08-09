import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function getUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function requireAuth() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

// Remove the signOut function since it's now handled client-side
