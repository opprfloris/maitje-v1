export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      children: {
        Row: {
          avatar_emoji: string | null
          birth_date: string | null
          created_at: string
          current_level: number
          id: string
          name: string
          school_level: string
          updated_at: string
        }
        Insert: {
          avatar_emoji?: string | null
          birth_date?: string | null
          created_at?: string
          current_level?: number
          id?: string
          name: string
          school_level?: string
          updated_at?: string
        }
        Update: {
          avatar_emoji?: string | null
          birth_date?: string | null
          created_at?: string
          current_level?: number
          id?: string
          name?: string
          school_level?: string
          updated_at?: string
        }
        Relationships: []
      }
      daily_progress: {
        Row: {
          achievements: Json | null
          child_id: string
          created_at: string
          date: string
          id: string
          streak_days: number
          subjects_practiced: string[] | null
          total_correct: number
          total_exercises: number
          total_sessions: number
        }
        Insert: {
          achievements?: Json | null
          child_id: string
          created_at?: string
          date: string
          id?: string
          streak_days?: number
          subjects_practiced?: string[] | null
          total_correct?: number
          total_exercises?: number
          total_sessions?: number
        }
        Update: {
          achievements?: Json | null
          child_id?: string
          created_at?: string
          date?: string
          id?: string
          streak_days?: number
          subjects_practiced?: string[] | null
          total_correct?: number
          total_exercises?: number
          total_sessions?: number
        }
        Relationships: [
          {
            foreignKeyName: "daily_progress_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_results: {
        Row: {
          correct_answer: string
          created_at: string
          exercise_data: Json
          hints_used: number | null
          id: string
          is_correct: boolean
          response_time_ms: number | null
          session_id: string
          user_answer: string | null
        }
        Insert: {
          correct_answer: string
          created_at?: string
          exercise_data: Json
          hints_used?: number | null
          id?: string
          is_correct: boolean
          response_time_ms?: number | null
          session_id: string
          user_answer?: string | null
        }
        Update: {
          correct_answer?: string
          created_at?: string
          exercise_data?: Json
          hints_used?: number | null
          id?: string
          is_correct?: boolean
          response_time_ms?: number | null
          session_id?: string
          user_answer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_results_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "exercise_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_sessions: {
        Row: {
          child_id: string
          completed_at: string | null
          correct_answers: number
          created_at: string
          duration_seconds: number | null
          exercise_category: string
          id: string
          session_data: Json | null
          session_type: string
          started_at: string
          total_exercises: number
        }
        Insert: {
          child_id: string
          completed_at?: string | null
          correct_answers?: number
          created_at?: string
          duration_seconds?: number | null
          exercise_category: string
          id?: string
          session_data?: Json | null
          session_type: string
          started_at?: string
          total_exercises?: number
        }
        Update: {
          child_id?: string
          completed_at?: string | null
          correct_answers?: number
          created_at?: string
          duration_seconds?: number | null
          exercise_category?: string
          id?: string
          session_data?: Json | null
          session_type?: string
          started_at?: string
          total_exercises?: number
        }
        Relationships: [
          {
            foreignKeyName: "exercise_sessions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      family_connections: {
        Row: {
          child_id: string
          created_at: string
          id: string
          is_primary: boolean
          parent_id: string
          relationship: string
        }
        Insert: {
          child_id: string
          created_at?: string
          id?: string
          is_primary?: boolean
          parent_id: string
          relationship?: string
        }
        Update: {
          child_id?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          parent_id?: string
          relationship?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_connections_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_connections_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      generic_tips: {
        Row: {
          created_at: string
          id: number
          text_template: string
        }
        Insert: {
          created_at?: string
          id?: number
          text_template: string
        }
        Update: {
          created_at?: string
          id?: number
          text_template?: string
        }
        Relationships: []
      }
      helpers: {
        Row: {
          avatar_emoji: string
          character_description: string
          created_at: string
          id: number
          name: string
        }
        Insert: {
          avatar_emoji: string
          character_description: string
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          avatar_emoji?: string
          character_description?: string
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          child_name: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          child_name?: string | null
          created_at?: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          child_name?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      specific_tips: {
        Row: {
          created_at: string
          helper_id: number
          id: number
          text: string
        }
        Insert: {
          created_at?: string
          helper_id: number
          id?: number
          text: string
        }
        Update: {
          created_at?: string
          helper_id?: number
          id?: number
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "specific_tips_helper_id_fkey"
            columns: ["helper_id"]
            isOneToOne: false
            referencedRelation: "helpers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_daily_progress: {
        Args: {
          p_child_id: string
          p_date: string
          p_session_type: string
          p_exercises_count: number
          p_correct_count: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
