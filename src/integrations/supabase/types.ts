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
      ai_documents: {
        Row: {
          created_at: string
          description: string | null
          document_name: string
          document_type: string
          file_path: string
          id: string
          subject_category: string | null
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_name: string
          document_type: string
          file_path: string
          id?: string
          subject_category?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          document_name?: string
          document_type?: string
          file_path?: string
          id?: string
          subject_category?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
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
      daily_exercise_sessions: {
        Row: {
          child_id: string
          completed_at: string | null
          created_at: string
          difficulty_level: string
          duration_minutes: number
          exercises: Json
          id: string
          progress: Json
          session_type: string
          settings: Json
          started_at: string | null
          subject: string
          theme: string | null
          updated_at: string
        }
        Insert: {
          child_id: string
          completed_at?: string | null
          created_at?: string
          difficulty_level?: string
          duration_minutes?: number
          exercises?: Json
          id?: string
          progress?: Json
          session_type: string
          settings?: Json
          started_at?: string | null
          subject: string
          theme?: string | null
          updated_at?: string
        }
        Update: {
          child_id?: string
          completed_at?: string | null
          created_at?: string
          difficulty_level?: string
          duration_minutes?: number
          exercises?: Json
          id?: string
          progress?: Json
          session_type?: string
          settings?: Json
          started_at?: string | null
          subject?: string
          theme?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      daily_plans: {
        Row: {
          child_id: string
          created_at: string
          date: string
          id: string
          plan_items: Json
          updated_at: string
        }
        Insert: {
          child_id: string
          created_at?: string
          date?: string
          id?: string
          plan_items?: Json
          updated_at?: string
        }
        Update: {
          child_id?: string
          created_at?: string
          date?: string
          id?: string
          plan_items?: Json
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
      feedback_sessions: {
        Row: {
          ai_analysis: string | null
          created_at: string
          feedback_completed: boolean | null
          generation_settings: Json | null
          id: string
          prompt_version_id: string
          session_name: string
          status: string
          test_program_data: Json
          updated_at: string
          user_id: string
          user_notes: string | null
        }
        Insert: {
          ai_analysis?: string | null
          created_at?: string
          feedback_completed?: boolean | null
          generation_settings?: Json | null
          id?: string
          prompt_version_id: string
          session_name: string
          status?: string
          test_program_data?: Json
          updated_at?: string
          user_id: string
          user_notes?: string | null
        }
        Update: {
          ai_analysis?: string | null
          created_at?: string
          feedback_completed?: boolean | null
          generation_settings?: Json | null
          id?: string
          prompt_version_id?: string
          session_name?: string
          status?: string
          test_program_data?: Json
          updated_at?: string
          user_id?: string
          user_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_sessions_prompt_version_id_fkey"
            columns: ["prompt_version_id"]
            isOneToOne: false
            referencedRelation: "prompt_versions"
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
      lesson_method_content: {
        Row: {
          content_data: Json
          created_at: string
          description: string | null
          file_path: string | null
          id: string
          is_active: boolean
          method_name: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content_data?: Json
          created_at?: string
          description?: string | null
          file_path?: string | null
          id?: string
          is_active?: boolean
          method_name: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content_data?: Json
          created_at?: string
          description?: string | null
          file_path?: string | null
          id?: string
          is_active?: boolean
          method_name?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      plan_item_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          exercise_id: string
          id: string
          item_order: number
          module_type: string
          plan_id: string
          started_at: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          exercise_id: string
          id?: string
          item_order: number
          module_type: string
          plan_id: string
          started_at?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          exercise_id?: string
          id?: string
          item_order?: number
          module_type?: string
          plan_id?: string
          started_at?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_item_progress_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "daily_plans"
            referencedColumns: ["id"]
          },
        ]
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
      prompt_templates: {
        Row: {
          category: string
          created_at: string
          id: string
          is_public: boolean
          subject_type: string | null
          template_content: string
          template_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          is_public?: boolean
          subject_type?: string | null
          template_content: string
          template_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          is_public?: boolean
          subject_type?: string | null
          template_content?: string
          template_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prompt_versions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          prompt_content: string
          success_rate: number | null
          tags: string[] | null
          test_count: number | null
          updated_at: string
          user_id: string
          version_name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          prompt_content: string
          success_rate?: number | null
          tags?: string[] | null
          test_count?: number | null
          updated_at?: string
          user_id: string
          version_name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          prompt_content?: string
          success_rate?: number | null
          tags?: string[] | null
          test_count?: number | null
          updated_at?: string
          user_id?: string
          version_name?: string
        }
        Relationships: []
      }
      question_feedback: {
        Row: {
          ai_feedback: string | null
          clarity_rating: string | null
          correct_answer: string
          created_at: string
          day_name: string
          difficulty_rating: string | null
          exercise_title: string
          exercise_type: string | null
          feedback_category: string
          id: string
          question_order: number | null
          question_text: string
          session_id: string
          subject_type: string
          thumbs_rating: number | null
          user_feedback: string | null
        }
        Insert: {
          ai_feedback?: string | null
          clarity_rating?: string | null
          correct_answer: string
          created_at?: string
          day_name: string
          difficulty_rating?: string | null
          exercise_title: string
          exercise_type?: string | null
          feedback_category: string
          id?: string
          question_order?: number | null
          question_text: string
          session_id: string
          subject_type: string
          thumbs_rating?: number | null
          user_feedback?: string | null
        }
        Update: {
          ai_feedback?: string | null
          clarity_rating?: string | null
          correct_answer?: string
          created_at?: string
          day_name?: string
          difficulty_rating?: string | null
          exercise_title?: string
          exercise_type?: string | null
          feedback_category?: string
          id?: string
          question_order?: number | null
          question_text?: string
          session_id?: string
          subject_type?: string
          thumbs_rating?: number | null
          user_feedback?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "feedback_sessions"
            referencedColumns: ["id"]
          },
        ]
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
      user_ai_config: {
        Row: {
          api_key_encrypted: string | null
          content_filter: string | null
          created_at: string
          id: string
          language: string | null
          selected_model: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key_encrypted?: string | null
          content_filter?: string | null
          created_at?: string
          id?: string
          language?: string | null
          selected_model?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          api_key_encrypted?: string | null
          content_filter?: string | null
          created_at?: string
          id?: string
          language?: string | null
          selected_model?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_interests: {
        Row: {
          created_at: string
          id: string
          interest_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interest_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interest_name?: string
          user_id?: string
        }
        Relationships: []
      }
      user_privacy_settings: {
        Row: {
          created_at: string
          data_collection_analytics: boolean | null
          data_collection_personalization: boolean | null
          id: string
          level_change_notifications: boolean | null
          updated_at: string
          user_id: string
          weekly_reports: boolean | null
        }
        Insert: {
          created_at?: string
          data_collection_analytics?: boolean | null
          data_collection_personalization?: boolean | null
          id?: string
          level_change_notifications?: boolean | null
          updated_at?: string
          user_id: string
          weekly_reports?: boolean | null
        }
        Update: {
          created_at?: string
          data_collection_analytics?: boolean | null
          data_collection_personalization?: boolean | null
          id?: string
          level_change_notifications?: boolean | null
          updated_at?: string
          user_id?: string
          weekly_reports?: boolean | null
        }
        Relationships: []
      }
      weekly_program_progress: {
        Row: {
          child_id: string
          completed_at: string | null
          completed_days: number[] | null
          created_at: string | null
          current_day: number | null
          day_progress: Json | null
          id: string
          program_id: string
          started_at: string | null
          total_time_spent: number | null
          updated_at: string | null
        }
        Insert: {
          child_id: string
          completed_at?: string | null
          completed_days?: number[] | null
          created_at?: string | null
          current_day?: number | null
          day_progress?: Json | null
          id?: string
          program_id: string
          started_at?: string | null
          total_time_spent?: number | null
          updated_at?: string | null
        }
        Update: {
          child_id?: string
          completed_at?: string | null
          completed_days?: number[] | null
          created_at?: string | null
          current_day?: number | null
          day_progress?: Json | null
          id?: string
          program_id?: string
          started_at?: string | null
          total_time_spent?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "weekly_program_progress_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "weekly_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_programs: {
        Row: {
          created_at: string
          difficulty_level: string | null
          id: string
          program_data: Json | null
          status: string | null
          theme: string | null
          updated_at: string
          user_id: string
          week_number: number
          year: number
        }
        Insert: {
          created_at?: string
          difficulty_level?: string | null
          id?: string
          program_data?: Json | null
          status?: string | null
          theme?: string | null
          updated_at?: string
          user_id: string
          week_number: number
          year: number
        }
        Update: {
          created_at?: string
          difficulty_level?: string | null
          id?: string
          program_data?: Json | null
          status?: string | null
          theme?: string | null
          updated_at?: string
          user_id?: string
          week_number?: number
          year?: number
        }
        Relationships: []
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
