import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { useSupabase } from "@/components/providers/supabase-provider";
import { toast } from "sonner";
import type { Database } from "@/lib/supabase";

// Generic hooks
export function useSupabaseQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey,
    queryFn,
    ...options,
  });
}

export function useSupabaseMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
    invalidateQueries?: string[][];
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      options?.onSuccess?.(data);
      options?.invalidateQueries?.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
    },
    onError: options?.onError,
  });
}

// Posts hooks
export function usePosts() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select(
          `
          *,
          profiles:created_by (
            id,
            full_name,
            avatar_url
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const { user } = useSupabase();

  return useMutation({
    mutationFn: async (post: {
      title: string;
      content: string;
      tags?: string[];
      image_url?: string;
      social_link_url?: string;
    }) => {
      const { data, error } = await supabase
        .from("community_posts")
        .insert({
          ...post,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["suggested-posts"] });
      queryClient.invalidateQueries({ queryKey: ["trending-posts"] });
      toast.success("Post created successfully");
    },
    onError: (error) => {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    },
  });
}

export function useUpvotePost() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { data, error } = await supabase.rpc("increment_upvotes", {
        post_id: postId,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["trending-posts"] });
    },
    onError: (error) => {
      console.error("Error upvoting post:", error);
      toast.error("Failed to upvote post");
    },
  });
}

export function useSuggestedPosts() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["suggested-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select(
          `
          *,
          profiles:created_by (
            id,
            full_name,
            avatar_url
          )
        `
        )
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });
}

export function useTrendingPosts() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["trending-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select(
          `
          *,
          profiles:created_by (
            id,
            full_name,
            avatar_url
          )
        `
        )
        .gte("upvotes", 5)
        .order("upvotes", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });
}

// Home detail hooks
export function useRooms(homeId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["rooms", homeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("home_id", homeId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!homeId,
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const { user } = useSupabase();

  return useMutation({
    mutationFn: async (
      room: Omit<Database["public"]["Tables"]["rooms"]["Insert"], "user_id"> & {
        home_id: string;
      }
    ) => {
      const { data, error } = await supabase
        .from("rooms")
        .insert({
          ...room,
          user_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Optimistically update the rooms list for the home so UI shows the new room instantly
      try {
        queryClient.setQueryData<any[]>(["rooms", data.home_id], (old) => {
          if (!old) return [data];
          return [data, ...old];
        });
      } catch (e) {
        // ignore
      }

      // Invalidate related queries to ensure other views refresh (dashboard counts, home detail)
      queryClient.invalidateQueries({ queryKey: ["rooms", data.home_id] });
      queryClient.invalidateQueries({ queryKey: ["home", data.home_id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });

      toast.success("Room created successfully");
    },
    onError: (error) => {
      console.error("Error creating room:", error);
      toast.error("Failed to create room");
    },
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({
      id,
      homeId,
      ...updates
    }: Database["public"]["Tables"]["rooms"]["Update"] & {
      id: string;
      homeId: string;
    }) => {
      const { data, error } = await supabase
        .from("rooms")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rooms", variables.homeId] });
      toast.success("Room updated successfully");
    },
    onError: (error) => {
      console.error("Error updating room:", error);
      toast.error("Failed to update room");
    },
  });
}

export function useOutsideItems(homeId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["outside-items", homeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("outside_items")
        .select("*")
        .eq("home_id", homeId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!homeId,
  });
}

export function useCreateOutsideItem() {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const { user } = useSupabase();

  return useMutation({
    mutationFn: async (
      item: Omit<
        Database["public"]["Tables"]["outside_items"]["Insert"],
        "user_id"
      > & { home_id: string }
    ) => {
      const { data, error } = await supabase
        .from("outside_items")
        .insert({
          ...item,
          user_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["outside-items", data.home_id],
      });
      toast.success("Outside item created successfully");
    },
    onError: (error) => {
      console.error("Error creating outside item:", error);
      toast.error("Failed to create outside item");
    },
  });
}

export function useUpdateOutsideItem() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({
      id,
      homeId,
      ...updates
    }: Database["public"]["Tables"]["outside_items"]["Update"] & {
      id: string;
      homeId: string;
    }) => {
      const { data, error } = await supabase
        .from("outside_items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["outside-items", variables.homeId],
      });
      toast.success("Outside item updated successfully");
    },
    onError: (error) => {
      console.error("Error updating outside item:", error);
      toast.error("Failed to update outside item");
    },
  });
}

export function usePurchases(homeId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["purchases", homeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchases")
        .select("*")
        .eq("home_id", homeId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!homeId,
  });
}

export function useCreatePurchase() {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const { user } = useSupabase();

  return useMutation({
    mutationFn: async (
      purchase: Omit<
        Database["public"]["Tables"]["purchases"]["Insert"],
        "user_id"
      > & { home_id: string }
    ) => {
      const { data, error } = await supabase
        .from("purchases")
        .insert({
          ...purchase,
          user_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["purchases", data.home_id] });
      toast.success("Purchase created successfully");
    },
    onError: (error) => {
      console.error("Error creating purchase:", error);
      toast.error("Failed to create purchase");
    },
  });
}

export function useUpdatePurchase() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({
      id,
      homeId,
      ...updates
    }: Database["public"]["Tables"]["purchases"]["Update"] & {
      id: string;
      homeId: string;
    }) => {
      const { data, error } = await supabase
        .from("purchases")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["purchases", variables.homeId],
      });
      toast.success("Purchase updated successfully");
    },
    onError: (error) => {
      console.error("Error updating purchase:", error);
      toast.error("Failed to update purchase");
    },
  });
}

export function useHomeMaintenance(homeId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["home-maintenance", homeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("home_maintenance")
        .select("*")
        .eq("home_id", homeId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!homeId,
  });
}

export function useCreateHomeMaintenance() {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const { user } = useSupabase();

  return useMutation({
    mutationFn: async (
      maintenance: Omit<
        Database["public"]["Tables"]["home_maintenance"]["Insert"],
        "user_id"
      > & { home_id: string }
    ) => {
      const { data, error } = await supabase
        .from("home_maintenance")
        .insert({
          ...maintenance,
          user_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["home-maintenance", data.home_id],
      });
      toast.success("Maintenance task created successfully");
    },
    onError: (error) => {
      console.error("Error creating maintenance task:", error);
      toast.error("Failed to create maintenance task");
    },
  });
}

export function useUpdateHomeMaintenance() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({
      id,
      homeId,
      ...updates
    }: Database["public"]["Tables"]["home_maintenance"]["Update"] & {
      id: string;
      homeId: string;
    }) => {
      const { data, error } = await supabase
        .from("home_maintenance")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["home-maintenance", variables.homeId],
      });
      toast.success("Maintenance task updated successfully");
    },
    onError: (error) => {
      console.error("Error updating maintenance task:", error);
      toast.error("Failed to update maintenance task");
    },
  });
}

export function useProjects(homeId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["projects", homeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("home_improvements")
        .select("*")
        .eq("home_id", homeId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!homeId,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const { user } = useSupabase();

  return useMutation({
    mutationFn: async (
      project: Omit<
        Database["public"]["Tables"]["home_improvements"]["Insert"],
        "user_id"
      > & { home_id: string }
    ) => {
      const { data, error } = await supabase
        .from("home_improvements")
        .insert({
          ...project,
          user_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects", data.home_id] });
      toast.success("Project created successfully");
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({
      id,
      homeId,
      ...updates
    }: Database["public"]["Tables"]["home_improvements"]["Update"] & {
      id: string;
      homeId: string;
    }) => {
      const { data, error } = await supabase
        .from("home_improvements")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.homeId],
      });
      toast.success("Project updated successfully");
    },
    onError: (error) => {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    },
  });
}

// Vehicle maintenance hooks
export function useVehicleMaintenance(vehicleId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["vehicle-maintenance", vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicle_maintenance")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .order("service_date", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!vehicleId,
  });
}

export function useVehicleLatestMaintenance(vehicleId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["vehicle-latest-maintenance", vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicle_maintenance")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .order("service_date", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    enabled: !!vehicleId,
  });
}

export function useCreateVehicleMaintenance() {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const { user } = useSupabase();

  return useMutation({
    mutationFn: async (
      maintenance: Omit<
        Database["public"]["Tables"]["vehicle_maintenance"]["Insert"],
        "user_id"
      > & { vehicle_id: string }
    ) => {
      // Whitelist fields to avoid leaking any extraneous keys
      const payload = {
        vehicle_id: maintenance.vehicle_id,
        user_id: user?.id as string,
        service_company: maintenance.service_company ?? null,
        service_type: maintenance.service_type ?? null,
        service_date: maintenance.service_date ?? null,
        mileage: maintenance.mileage ?? null,
        cost: maintenance.cost ?? null,
        notes: maintenance.notes ?? null,
        image_url: maintenance.image_url ?? null,
        next_service_mileage: maintenance.next_service_mileage ?? null,
        next_service_date: maintenance.next_service_date ?? null,
        created_at: maintenance.created_at ?? undefined,
      } as Database["public"]["Tables"]["vehicle_maintenance"]["Insert"];

      const { data, error } = await supabase
        .from("vehicle_maintenance")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["vehicle-maintenance", data.vehicle_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["vehicle-latest-maintenance", data.vehicle_id],
      });
      toast.success("Maintenance record created successfully");
    },
    onError: (error) => {
      console.error("Error creating maintenance record:", error);
      toast.error("Failed to create maintenance record");
    },
  });
}

export function useUpdateVehicleMaintenance() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({
      id,
      vehicleId,
      ...updates
    }: Database["public"]["Tables"]["vehicle_maintenance"]["Update"] & {
      id: string;
      vehicleId: string;
    }) => {
      const { data, error } = await supabase
        .from("vehicle_maintenance")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["vehicle-maintenance", variables.vehicleId],
      });
      queryClient.invalidateQueries({
        queryKey: ["vehicle-latest-maintenance", variables.vehicleId],
      });
      toast.success("Maintenance record updated successfully");
    },
    onError: (error) => {
      console.error("Error updating maintenance record:", error);
      toast.error("Failed to update maintenance record");
    },
  });
}

export function useVehicleRepairs(vehicleId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["vehicle-repairs", vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicle_repairs")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .order("service_date", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!vehicleId,
  });
}

export function useCreateVehicleRepair() {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const { user } = useSupabase();

  return useMutation({
    mutationFn: async (
      repair: Omit<
        Database["public"]["Tables"]["vehicle_repairs"]["Insert"],
        "user_id"
      > & { vehicle_id: string }
    ) => {
      const { data, error } = await supabase
        .from("vehicle_repairs")
        .insert({
          ...repair,
          user_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["vehicle-repairs", data.vehicle_id],
      });
      toast.success("Repair record created successfully");
    },
    onError: (error) => {
      console.error("Error creating repair record:", error);
      toast.error("Failed to create repair record");
    },
  });
}

export function useUpdateVehicleRepair() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({
      id,
      vehicleId,
      ...updates
    }: Database["public"]["Tables"]["vehicle_repairs"]["Update"] & {
      id: string;
      vehicleId: string;
    }) => {
      const { data, error } = await supabase
        .from("vehicle_repairs")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["vehicle-repairs", variables.vehicleId],
      });
      toast.success("Repair record updated successfully");
    },
    onError: (error) => {
      console.error("Error updating repair record:", error);
      toast.error("Failed to update repair record");
    },
  });
}

// Notifications hooks
export function useNotifications() {
  const supabase = createClient();
  const { user } = useSupabase();

  return useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user?.id)
        .order("due_date", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
}

export function useMarkNotificationDone() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification marked as done");
    },
    onError: (error) => {
      console.error("Error marking notification:", error);
      toast.error("Failed to mark notification as done");
    },
  });
}

// Home detail hooks (legacy compatibility)
export function useHomeDetail(homeId: string) {
  const rooms = useRooms(homeId);
  const outsideItems = useOutsideItems(homeId);
  const purchases = usePurchases(homeId);
  const maintenance = useHomeMaintenance(homeId);
  const improvements = useProjects(homeId);

  return {
    rooms,
    outsideItems,
    purchases,
    maintenance,
    improvements,
  };
}

// Vehicle detail hooks (legacy compatibility)
export function useVehicleDetail(vehicleId: string) {
  const maintenance = useVehicleMaintenance(vehicleId);
  const repairs = useVehicleRepairs(vehicleId);

  return {
    maintenance,
    repairs,
  };
}
