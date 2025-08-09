import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";
import type { Database } from "@/lib/supabase";

type Home = Database["public"]["Tables"]["homes"]["Row"];
type HomeInsert = Database["public"]["Tables"]["homes"]["Insert"];
type HomeUpdate = Database["public"]["Tables"]["homes"]["Update"];

export function useHomes() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["homes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useHome(id: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["home", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id, // Only run the query if the ID is available
  });
}

export function useCreateHome() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (home: HomeInsert) => {
      const { data, error } = await supabase
        .from("homes")
        .insert(home)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homes"] });
      toast.success("Home created successfully");
    },
    onError: (error) => {
      console.error("Error creating home:", error);
      toast.error("Failed to create home");
    },
  });
}

export function useUpdateHome() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: HomeUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("homes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homes"] });
      toast.success("Home updated successfully");
    },
    onError: (error) => {
      console.error("Error updating home:", error);
      toast.error("Failed to update home");
    },
  });
}

export function useDeleteHome() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("homes").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homes"] });
      toast.success("Home deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting home:", error);
      toast.error("Failed to delete home");
    },
  });
}
