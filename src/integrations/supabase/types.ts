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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          logo_url: string | null
          name: string
          tier: string
          type: string
          updated_at: string
          website: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          logo_url?: string | null
          name: string
          tier: string
          type: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          logo_url?: string | null
          name?: string
          tier?: string
          type?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      stores: {
        Row: {
          approved: boolean | null
          created_at: string
          rating: number | null
          shop_addr_1: string | null
          shop_addr_1_m: string | null
          shop_addr_2: string | null
          shop_addr_2_m: string | null
          shop_city: string | null
          shop_city_m: string | null
          shop_email: string | null
          shop_hours: string | null
          shop_mdse: string | null
          shop_name: string
          shop_owner: string | null
          shop_phone_1: string | null
          shop_phone_2: string | null
          shop_state: string | null
          shop_state_m: string | null
          shop_website: string | null
          shop_zip: string | null
          shop_zip_m: string | null
          ShopID: string
          updated_at: string
          votes_count: number | null
        }
        Insert: {
          approved?: boolean | null
          created_at?: string
          rating?: number | null
          shop_addr_1?: string | null
          shop_addr_1_m?: string | null
          shop_addr_2?: string | null
          shop_addr_2_m?: string | null
          shop_city?: string | null
          shop_city_m?: string | null
          shop_email?: string | null
          shop_hours?: string | null
          shop_mdse?: string | null
          shop_name: string
          shop_owner?: string | null
          shop_phone_1?: string | null
          shop_phone_2?: string | null
          shop_state?: string | null
          shop_state_m?: string | null
          shop_website?: string | null
          shop_zip?: string | null
          shop_zip_m?: string | null
          ShopID: string
          updated_at?: string
          votes_count?: number | null
        }
        Update: {
          approved?: boolean | null
          created_at?: string
          rating?: number | null
          shop_addr_1?: string | null
          shop_addr_1_m?: string | null
          shop_addr_2?: string | null
          shop_addr_2_m?: string | null
          shop_city?: string | null
          shop_city_m?: string | null
          shop_email?: string | null
          shop_hours?: string | null
          shop_mdse?: string | null
          shop_name?: string
          shop_owner?: string | null
          shop_phone_1?: string | null
          shop_phone_2?: string | null
          shop_state?: string | null
          shop_state_m?: string | null
          shop_website?: string | null
          shop_zip?: string | null
          shop_zip_m?: string | null
          ShopID?: string
          updated_at?: string
          votes_count?: number | null
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
      votes: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          sms_consent: boolean | null
          store_id: string
          user_id: string
          voter_city: string | null
          voter_email: string | null
          voter_phone: string | null
          voter_state: string | null
          voting_method: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          sms_consent?: boolean | null
          store_id: string
          user_id: string
          voter_city?: string | null
          voter_email?: string | null
          voter_phone?: string | null
          voter_state?: string | null
          voting_method?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          sms_consent?: boolean | null
          store_id?: string
          user_id?: string
          voter_city?: string | null
          voter_email?: string | null
          voter_phone?: string | null
          voter_state?: string | null
          voting_method?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "public_stores"
            referencedColumns: ["ShopID"]
          },
          {
            foreignKeyName: "votes_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["ShopID"]
          },
          {
            foreignKeyName: "votes_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores_public"
            referencedColumns: ["ShopID"]
          },
        ]
      }
    }
    Views: {
      public_stores: {
        Row: {
          approved: boolean | null
          created_at: string | null
          rating: number | null
          shop_addr_1: string | null
          shop_addr_2: string | null
          shop_city: string | null
          shop_hours: string | null
          shop_mdse: string | null
          shop_name: string | null
          shop_state: string | null
          shop_website: string | null
          shop_zip: string | null
          ShopID: string | null
          updated_at: string | null
          votes_count: number | null
        }
        Insert: {
          approved?: boolean | null
          created_at?: string | null
          rating?: number | null
          shop_addr_1?: string | null
          shop_addr_2?: string | null
          shop_city?: string | null
          shop_hours?: string | null
          shop_mdse?: string | null
          shop_name?: string | null
          shop_state?: string | null
          shop_website?: string | null
          shop_zip?: string | null
          ShopID?: string | null
          updated_at?: string | null
          votes_count?: number | null
        }
        Update: {
          approved?: boolean | null
          created_at?: string | null
          rating?: number | null
          shop_addr_1?: string | null
          shop_addr_2?: string | null
          shop_city?: string | null
          shop_hours?: string | null
          shop_mdse?: string | null
          shop_name?: string | null
          shop_state?: string | null
          shop_website?: string | null
          shop_zip?: string | null
          ShopID?: string | null
          updated_at?: string | null
          votes_count?: number | null
        }
        Relationships: []
      }
      stores_public: {
        Row: {
          approved: boolean | null
          created_at: string | null
          rating: number | null
          shop_addr_1: string | null
          shop_addr_2: string | null
          shop_city: string | null
          shop_hours: string | null
          shop_mdse: string | null
          shop_name: string | null
          shop_state: string | null
          shop_website: string | null
          shop_zip: string | null
          ShopID: string | null
          updated_at: string | null
          votes_count: number | null
        }
        Insert: {
          approved?: boolean | null
          created_at?: string | null
          rating?: number | null
          shop_addr_1?: string | null
          shop_addr_2?: string | null
          shop_city?: string | null
          shop_hours?: string | null
          shop_mdse?: string | null
          shop_name?: string | null
          shop_state?: string | null
          shop_website?: string | null
          shop_zip?: string | null
          ShopID?: string | null
          updated_at?: string | null
          votes_count?: number | null
        }
        Update: {
          approved?: boolean | null
          created_at?: string | null
          rating?: number | null
          shop_addr_1?: string | null
          shop_addr_2?: string | null
          shop_city?: string | null
          shop_hours?: string | null
          shop_mdse?: string | null
          shop_name?: string | null
          shop_state?: string | null
          shop_website?: string | null
          shop_zip?: string | null
          ShopID?: string | null
          updated_at?: string | null
          votes_count?: number | null
        }
        Relationships: []
      }
      vote_statistics: {
        Row: {
          avg_rating: number | null
          comment_count: number | null
          store_id: string | null
          vote_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "public_stores"
            referencedColumns: ["ShopID"]
          },
          {
            foreignKeyName: "votes_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["ShopID"]
          },
          {
            foreignKeyName: "votes_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores_public"
            referencedColumns: ["ShopID"]
          },
        ]
      }
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
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
