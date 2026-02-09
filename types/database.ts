// ============================================
// TIPOS DE BASE DE DATOS - Supabase
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'user' | 'moderator' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'moderator' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'moderator' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          short_description: string;
          start_date: string;
          end_date: string | null;
          start_time: string | null;
          end_time: string | null;
          location_name: string;
          location_address: string | null;
          location_city: string;
          location_country: string;
          latitude: number | null;
          longitude: number | null;
          organizer_name: string;
          organizer_email: string | null;
          organizer_phone: string | null;
          organizer_website: string | null;
          organizer_instagram: string | null;
          organizer_facebook: string | null;
          featured_image: string;
          gallery_images: string[] | null;
          event_type: string;
          motorcycle_types: string[];
          tags: string[];
          meta_title: string | null;
          meta_description: string | null;
          status: 'pending' | 'approved' | 'rejected' | 'cancelled';
          submitted_by: string | null;
          moderated_by: string | null;
          moderated_at: string | null;
          rejection_reason: string | null;
          view_count: number;
          added_to_calendar_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description: string;
          short_description: string;
          start_date: string;
          end_date?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          location_name: string;
          location_address?: string | null;
          location_city: string;
          location_country?: string;
          latitude?: number | null;
          longitude?: number | null;
          organizer_name: string;
          organizer_email?: string | null;
          organizer_phone?: string | null;
          organizer_website?: string | null;
          organizer_instagram?: string | null;
          organizer_facebook?: string | null;
          featured_image: string;
          gallery_images?: string[] | null;
          event_type?: string;
          motorcycle_types?: string[];
          tags?: string[];
          meta_title?: string | null;
          meta_description?: string | null;
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
          submitted_by?: string | null;
          moderated_by?: string | null;
          moderated_at?: string | null;
          rejection_reason?: string | null;
          view_count?: number;
          added_to_calendar_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string;
          short_description?: string;
          start_date?: string;
          end_date?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          location_name?: string;
          location_address?: string | null;
          location_city?: string;
          location_country?: string;
          latitude?: number | null;
          longitude?: number | null;
          organizer_name?: string;
          organizer_email?: string | null;
          organizer_phone?: string | null;
          organizer_website?: string | null;
          organizer_instagram?: string | null;
          organizer_facebook?: string | null;
          featured_image?: string;
          gallery_images?: string[] | null;
          event_type?: string;
          motorcycle_types?: string[];
          tags?: string[];
          meta_title?: string | null;
          meta_description?: string | null;
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
          submitted_by?: string | null;
          moderated_by?: string | null;
          moderated_at?: string | null;
          rejection_reason?: string | null;
          view_count?: number;
          added_to_calendar_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_favorites: {
        Row: {
          id: string;
          user_id: string;
          event_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          event_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
