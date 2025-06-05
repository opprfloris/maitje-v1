
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

export type WeekProgram = {
  id: string;
  user_id: string;
  week_number: number;
  year: number;
  status: 'draft' | 'published' | 'completed';
  difficulty_level: string;
  theme?: string;
  program_data: any[];
  created_at: string;
  updated_at: string;
};

export type WeekProgramDay = {
  dag: string;
  oefeningen: WeekProgramExercise[];
};

export type WeekProgramExercise = {
  titel: string;
  type: 'rekenen' | 'taal' | 'engels';
  tijd: string;
  tijdInMinuten: number;
  beschrijving?: string;
  vragen: WeekProgramQuestion[];
};

export type WeekProgramQuestion = {
  vraag: string;
  antwoord: string;
  type: 'multiple_choice' | 'open' | 'waar_onwaar';
  opties?: string[];
};

export type PromptVersion = {
  id: string;
  user_id: string;
  version_name: string;
  prompt_content: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type FeedbackSession = {
  id: string;
  user_id: string;
  prompt_version_id: string;
  session_name: string;
  test_program_data: any[];
  ai_analysis?: string;
  status: 'in_progress' | 'completed' | 'analyzed';
  generation_settings?: any;
  user_notes?: string;
  feedback_completed?: boolean;
  created_at: string;
  updated_at: string;
};

export type QuestionFeedback = {
  id: string;
  session_id: string;
  question_text: string;
  correct_answer: string;
  day_name: string;
  exercise_title: string;
  subject_type: string;
  feedback_category: 'good' | 'incorrect' | 'unclear' | 'too_easy' | 'too_hard';
  user_feedback?: string;
  ai_feedback?: string;
  thumbs_rating?: -1 | 1; // -1 for down, 1 for up
  difficulty_rating?: 'too_easy' | 'just_right' | 'too_hard';
  clarity_rating?: 'clear' | 'somewhat_clear' | 'unclear';
  question_order?: number;
  exercise_type?: string;
  created_at: string;
};

export type AIDocument = {
  id: string;
  user_id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  subject_category?: string;
  description?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
};

export type PromptTemplate = {
  id: string;
  user_id: string;
  template_name: string;
  template_content: string;
  category: string;
  subject_type?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};
