
export type Profile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  child_name?: string;
  created_at: string;
  updated_at: string;
};

export type Child = {
  id: string;
  name: string;
  birth_date?: string;
  school_level: string;
  current_level: number;
  avatar_emoji: string;
  created_at: string;
  updated_at: string;
};

export type FamilyConnection = {
  id: string;
  parent_id: string;
  child_id: string;
  relationship: string;
  is_primary: boolean;
  created_at: string;
};

export type ExerciseSession = {
  id: string;
  child_id: string;
  session_type: string;
  exercise_category: string;
  started_at: string;
  completed_at?: string;
  duration_seconds?: number;
  total_exercises: number;
  correct_answers: number;
  session_data: any;
  created_at: string;
};

export type DailyProgress = {
  id: string;
  child_id: string;
  date: string;
  total_sessions: number;
  total_exercises: number;
  total_correct: number;
  subjects_practiced: string[];
  streak_days: number;
  achievements: any;
  created_at: string;
};

export type DailyPlan = {
  id: string;
  child_id: string;
  date: string;
  plan_items: any;
  created_at: string;
  updated_at: string;
};

export type PlanItemProgress = {
  id: string;
  plan_id: string;
  item_order: number;
  module_type: string;
  exercise_id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed' | 'skipped';
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
};
