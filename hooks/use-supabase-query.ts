import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { useSupabase } from "@/components/providers/supabase-provider";
import { toast } from "sonner";

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
export function useHomeDetail(homeId: string) {
  const supabase = createClient();

  const rooms = useQuery({
    queryKey: ["home-rooms", homeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("home_id", homeId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const outsideItems = useQuery({
    queryKey: ["home-outside", homeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("outside_items")
        .select("*")
        .eq("home_id", homeId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const purchases = useQuery({
    queryKey: ["home-purchases", homeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchases")
        .select("*")
        .eq("home_id", homeId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const maintenance = useQuery({
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
  });

  const improvements = useQuery({
    queryKey: ["home-improvements", homeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("home_improvements")
        .select("*")
        .eq("home_id", homeId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return {
    rooms,
    outsideItems,
    purchases,
    maintenance,
    improvements,
  };
}

// Vehicle detail hooks
export function useVehicleDetail(vehicleId: string) {
  const supabase = createClient();

  const maintenance = useQuery({
    queryKey: ["vehicle-maintenance", vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicle_maintenance")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const repairs = useQuery({
    queryKey: ["vehicle-repairs", vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicle_repairs")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return {
    maintenance,
    repairs,
  };
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
