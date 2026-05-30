export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blogs: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          category: string | null
          author: string | null
          thumbnail_url: string | null
          seo_title: string | null
          seo_description: string | null
          status: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content: string
          category?: string | null
          author?: string | null
          thumbnail_url?: string | null
          seo_title?: string | null
          seo_description?: string | null
          status?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          category?: string | null
          author?: string | null
          thumbnail_url?: string | null
          seo_title?: string | null
          seo_description?: string | null
          status?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      case_studies: {
        Row: {
          category: string
          client: string
          created_at: string
          description: string
          id: string
          image_url: string | null
          impact: string | null
          is_active: boolean | null
          is_featured: boolean | null
          outcome: string | null
          services: string[] | null
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          client: string
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          impact?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          outcome?: string | null
          services?: string[] | null
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          client?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          impact?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          outcome?: string | null
          services?: string[] | null
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cases: {
        Row: {
          assigned_to: string | null
          case_id: string
          category: string
          client_email: string | null
          client_name: string
          client_phone: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          notes: string | null
          priority: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          case_id?: string
          category?: string
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          priority?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          case_id?: string
          category?: string
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          priority?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          additional_details: Json | null
          certificate_number: string
          certificate_type: string
          course_name: string | null
          created_at: string
          created_by: string | null
          expiry_date: string | null
          id: string
          issue_date: string
          logo_url: string | null
          recipient_email: string | null
          recipient_name: string
          signature_url: string | null
          signing_authority_designation: string | null
          signing_authority_name: string
          status: string
          updated_at: string
        }
        Insert: {
          additional_details?: Json | null
          certificate_number: string
          certificate_type?: string
          course_name?: string | null
          created_at?: string
          created_by?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string
          logo_url?: string | null
          recipient_email?: string | null
          recipient_name: string
          signature_url?: string | null
          signing_authority_designation?: string | null
          signing_authority_name: string
          status?: string
          updated_at?: string
        }
        Update: {
          additional_details?: Json | null
          certificate_number?: string
          certificate_type?: string
          course_name?: string | null
          created_at?: string
          created_by?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string
          logo_url?: string | null
          recipient_email?: string | null
          recipient_name?: string
          signature_url?: string | null
          signing_authority_designation?: string | null
          signing_authority_name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          category: string | null
          company: string | null
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          category?: string | null
          company?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          category?: string | null
          company?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          amount: number
          created_at: string
          email: string
          event_id: string
          id: string
          name: string
          order_id: string | null
          payment_id: string | null
          payment_status: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          email: string
          event_id: string
          id?: string
          name: string
          order_id?: string | null
          payment_id?: string | null
          payment_status?: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          email?: string
          event_id?: string
          id?: string
          name?: string
          order_id?: string | null
          payment_id?: string | null
          payment_status?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          event_date: string
          event_time: string | null
          event_type: string
          id: string
          is_published: boolean | null
          location: string | null
          mode: string | null
          price: string | null
          seats_available: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date: string
          event_time?: string | null
          event_type?: string
          id?: string
          is_published?: boolean | null
          location?: string | null
          mode?: string | null
          price?: string | null
          seats_available?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date?: string
          event_time?: string | null
          event_type?: string
          id?: string
          is_published?: boolean | null
          location?: string | null
          mode?: string | null
          price?: string | null
          seats_available?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      milestones: {
        Row: {
          created_at: string
          description: string
          id: string
          is_active: boolean | null
          sort_order: number | null
          title: string
          updated_at: string
          year: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          title: string
          updated_at?: string
          year: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          title?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      offer_letters: {
        Row: {
          content: Json
          created_at: string
          created_by: string | null
          id: string
          letter_type: Database["public"]["Enums"]["offer_letter_type"]
          recipient_company: string | null
          recipient_designation: string | null
          recipient_email: string
          recipient_name: string
          responded_at: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["offer_letter_status"]
          subject: string
          updated_at: string
          valid_from: string
          valid_until: string | null
        }
        Insert: {
          content?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          letter_type: Database["public"]["Enums"]["offer_letter_type"]
          recipient_company?: string | null
          recipient_designation?: string | null
          recipient_email: string
          recipient_name: string
          responded_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["offer_letter_status"]
          subject: string
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
        }
        Update: {
          content?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          letter_type?: Database["public"]["Enums"]["offer_letter_type"]
          recipient_company?: string | null
          recipient_designation?: string | null
          recipient_email?: string
          recipient_name?: string
          responded_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["offer_letter_status"]
          subject?: string
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      office_locations: {
        Row: {
          address: string
          city: string
          created_at: string
          id: string
          is_active: boolean | null
          is_headquarters: boolean | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_headquarters?: boolean | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_headquarters?: boolean | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          sort_order: number | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          sort_order?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          sort_order?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string
          features: string[] | null
          href: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          features?: string[] | null
          href?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          features?: string[] | null
          href?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          credentials: string | null
          id: string
          is_active: boolean | null
          name: string
          photo_url: string | null
          role: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          credentials?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          photo_url?: string | null
          role: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          credentials?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          photo_url?: string | null
          role?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author: string
          created_at: string
          id: string
          is_active: boolean | null
          organization: string | null
          quote: string
          rating: number | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          author: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          organization?: string | null
          quote: string
          rating?: number | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          author?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          organization?: string | null
          quote?: string
          rating?: number | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      website_content: {
        Row: {
          content: Json
          created_at: string
          id: string
          section_key: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          section_key: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          section_key?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      offer_letter_status:
        | "draft"
        | "sent"
        | "accepted"
        | "declined"
        | "expired"
      offer_letter_type:
        | "client_proposal"
        | "employment_offer"
        | "partnership_contract"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      offer_letter_status: ["draft", "sent", "accepted", "declined", "expired"],
      offer_letter_type: [
        "client_proposal",
        "employment_offer",
        "partnership_contract",
      ],
    },
  },
} as const
