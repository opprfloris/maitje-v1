
import { supabase } from '@/integrations/supabase/client';
import { Child, ExerciseSession } from '@/types/database';

export const useProgress = () => {
  const startSession = async (
    child: Child,
    sessionType: string,
    exerciseCategory: string
  ): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('exercise_sessions')
        .insert({
          child_id: child.id,
          session_type: sessionType,
          exercise_category: exerciseCategory,
          started_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error starting session:', error);
      return null;
    }
  };

  const recordAnswer = async (
    sessionId: string,
    exerciseData: any,
    userAnswer: string,
    correctAnswer: string,
    responseTime: number
  ) => {
    try {
      const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
      
      const { error } = await supabase
        .from('exercise_results')
        .insert({
          session_id: sessionId,
          exercise_data: exerciseData,
          user_answer: userAnswer,
          correct_answer: correctAnswer,
          is_correct: isCorrect,
          response_time_ms: responseTime,
        });

      if (error) throw error;
      return isCorrect;
    } catch (error) {
      console.error('Error recording answer:', error);
      return false;
    }
  };

  const completeSession = async (
    sessionId: string,
    totalExercises: number,
    correctAnswers: number
  ) => {
    try {
      const now = new Date().toISOString();
      
      // Update session with completion data
      const { data: sessionData, error: sessionError } = await supabase
        .from('exercise_sessions')
        .update({
          completed_at: now,
          total_exercises: totalExercises,
          correct_answers: correctAnswers,
        })
        .eq('id', sessionId)
        .select('child_id, session_type')
        .single();

      if (sessionError) throw sessionError;

      // Update daily progress
      const today = new Date().toISOString().split('T')[0];
      const { error: progressError } = await supabase.rpc('update_daily_progress', {
        p_child_id: sessionData.child_id,
        p_date: today,
        p_session_type: sessionData.session_type,
        p_exercises_count: totalExercises,
        p_correct_count: correctAnswers,
      });

      if (progressError) throw progressError;
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

  return {
    startSession,
    recordAnswer,
    completeSession,
  };
};
