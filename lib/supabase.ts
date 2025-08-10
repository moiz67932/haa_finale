import { createBrowserClient } from "@supabase/ssr";
// Removed: import { createServerClient } from '@supabase/ssr'
// Removed: import { cookies } from 'next/headers'

export type Database = {
  public: {
    Tables: {
      homes: {
        Row: {
          id: string;
          user_id: string;
          nickname: string | null;
          address: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          nickname?: string | null;
          address?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          nickname?: string | null;
          address?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      rooms: {
        Row: {
          id: string;
          home_id: string;
          user_id: string;
          name: string | null;
          paint_color: string | null;
          flooring: string | null;
          installer: string | null;
          purchase_from: string | null;
          warranty_json: any | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          home_id: string;
          user_id: string;
          name?: string | null;
          paint_color?: string | null;
          flooring?: string | null;
          installer?: string | null;
          purchase_from?: string | null;
          warranty_json?: any | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          home_id?: string;
          user_id?: string;
          name?: string | null;
          paint_color?: string | null;
          flooring?: string | null;
          installer?: string | null;
          purchase_from?: string | null;
          warranty_json?: any | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      outside_items: {
        Row: {
          id: string;
          home_id: string;
          user_id: string;
          name: string | null;
          type: string | null;
          notes: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          home_id: string;
          user_id: string;
          name?: string | null;
          type?: string | null;
          notes?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          home_id?: string;
          user_id?: string;
          name?: string | null;
          type?: string | null;
          notes?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      purchases: {
        Row: {
          id: string;
          home_id: string;
          user_id: string;
          item_name: string | null;
          cost: number | null;
          purchase_date: string | null;
          warranty_end_date: string | null;
          notes: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          home_id: string;
          user_id: string;
          item_name?: string | null;
          cost?: number | null;
          purchase_date?: string | null;
          warranty_end_date?: string | null;
          notes?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          home_id?: string;
          user_id?: string;
          item_name?: string | null;
          cost?: number | null;
          purchase_date?: string | null;
          warranty_end_date?: string | null;
          notes?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      home_maintenance: {
        Row: {
          id: string;
          home_id: string;
          user_id: string;
          task_name: string | null;
          due_date: string | null;
          is_completed: boolean;
          notes: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          home_id: string;
          user_id: string;
          task_name?: string | null;
          due_date?: string | null;
          is_completed?: boolean;
          notes?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          home_id?: string;
          user_id?: string;
          task_name?: string | null;
          due_date?: string | null;
          is_completed?: boolean;
          notes?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      home_improvements: {
        Row: {
          id: string;
          home_id: string;
          user_id: string;
          project_name: string | null;
          completion_date: string | null;
          notes: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          home_id: string;
          user_id: string;
          project_name?: string | null;
          completion_date?: string | null;
          notes?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          home_id?: string;
          user_id?: string;
          project_name?: string | null;
          completion_date?: string | null;
          notes?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      vehicles: {
        Row: {
          id: string;
          user_id: string;
          make: string | null;
          model: string | null;
          year: number | null;
          nickname: string | null;
          mileage: number | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          make?: string | null;
          model?: string | null;
          year?: number | null;
          nickname?: string | null;
          mileage?: number | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          make?: string | null;
          model?: string | null;
          year?: number | null;
          nickname?: string | null;
          mileage?: number | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      vehicle_maintenance: {
        Row: {
          id: string;
          vehicle_id: string;
          user_id: string;
          service_company: string | null;
          service_type: string | null;
          service_date: string | null;
          mileage: number | null;
          cost: number | null;
          notes: string | null;
          image_url: string | null;
          next_service_mileage: number | null;
          next_service_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          user_id: string;
          service_company?: string | null;
          service_type?: string | null;
          service_date?: string | null;
          mileage?: number | null;
          cost?: number | null;
          notes?: string | null;
          image_url?: string | null;
          next_service_mileage?: number | null;
          next_service_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          user_id?: string;
          service_type?: string | null;
          service_date?: string | null;
          mileage?: number | null;
          cost?: number | null;
          notes?: string | null;
          image_url?: string | null;
          next_service_mileage?: number | null;
          next_service_date?: string | null;
          created_at?: string;
        };
      };
      vehicle_repairs: {
        Row: {
          id: string;
          vehicle_id: string;
          user_id: string;
          repair_type: string | null;
          service_date: string | null;
          mileage: number | null;
          cost: number | null;
          notes: string | null;
          image_url: string | null;
          warranty_end_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          user_id: string;
          repair_type?: string | null;
          service_date?: string | null;
          mileage?: number | null;
          cost?: number | null;
          notes?: string | null;
          image_url?: string | null;
          warranty_end_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          user_id?: string;
          repair_type?: string | null;
          service_date?: string | null;
          mileage?: number | null;
          cost?: number | null;
          notes?: string | null;
          image_url?: string | null;
          warranty_end_date?: string | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string | null;
          entity_id: string | null;
          message: string | null;
          due_date: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type?: string | null;
          entity_id?: string | null;
          message?: string | null;
          due_date?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string | null;
          entity_id?: string | null;
          message?: string | null;
          due_date?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
      service_providers: {
        Row: {
          id: string;
          created_by: string;
          name: string | null;
          category: string | null;
          phone: string | null;
          email: string | null;
          website: string | null;
          address: string | null;
          rating: number | null;
          tags: string[] | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          created_by: string;
          name?: string | null;
          category?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          address?: string | null;
          rating?: number | null;
          tags?: string[] | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          created_by?: string;
          name?: string | null;
          category?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          address?: string | null;
          rating?: number | null;
          tags?: string[] | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          created_by: string;
          title: string | null;
          content: string | null;
          tags: string[] | null;
          image_url: string | null;
          social_link_url: string | null;
          upvotes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          created_by: string;
          title?: string | null;
          content?: string | null;
          tags?: string[] | null;
          image_url?: string | null;
          social_link_url?: string | null;
          upvotes?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          created_by?: string;
          title?: string | null;
          content?: string | null;
          tags?: string[] | null;
          image_url?: string | null;
          social_link_url?: string | null;
          upvotes?: number;
          created_at?: string;
        };
      };
    };
    Functions: {
      summaries: {
        Args: Record<PropertyKey, never>;
        Returns: {
          homes_count: number;
          vehicles_count: number;
          unread_notifications_count: number;
        }[];
      };
    };
  };
};

export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};
