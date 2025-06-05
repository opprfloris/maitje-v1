
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { FeedbackSession, QuestionFeedback } from '@/types/database';

export const useFeedbackSessions = () => {
  const { user } = useAuth();
  const [feedbackSessions, setFeedbackSessions] = useState<FeedbackSession[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFeedbackSessions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('feedback_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading feedback sessions:', error);
        return;
      }

      const typedData: FeedbackSession[] = (data || []).map(session => ({
        ...session,
        test_program_data: Array.isArray(session.test_program_data) ? session.test_program_data : [],
        status: session.status as 'in_progress' | 'completed' | 'analyzed',
        generation_settings: session.generation_settings || {},
        feedback_completed: session.feedback_completed || false
      }));

      setFeedbackSessions(typedData);
    } catch (error) {
      console.error('Error loading feedback sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSessionNotes = async (sessionId: string, notes: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('feedback_sessions')
        .update({ 
          user_notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Reload sessions to get updated data
      await loadFeedbackSessions();
    } catch (error) {
      console.error('Error updating session notes:', error);
      throw error;
    }
  };

  const saveQuestionFeedback = async (feedback: Omit<QuestionFeedback, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('question_feedback')
        .upsert({
          ...feedback,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving question feedback:', error);
      throw error;
    }
  };

  const getSessionFeedback = async (sessionId: string): Promise<QuestionFeedback[]> => {
    try {
      const { data, error } = await supabase
        .from('question_feedback')
        .select('*')
        .eq('session_id', sessionId)
        .order('day_name', { ascending: true })
        .order('question_order', { ascending: true });

      if (error) throw error;

      return (data || []).map(item => ({
        ...item,
        feedback_category: item.feedback_category as 'good' | 'incorrect' | 'unclear' | 'too_easy' | 'too_hard',
        thumbs_rating: item.thumbs_rating as -1 | 1 | undefined,
        difficulty_rating: item.difficulty_rating as 'too_easy' | 'just_right' | 'too_hard' | undefined,
        clarity_rating: item.clarity_rating as 'clear' | 'somewhat_clear' | 'unclear' | undefined
      }));
    } catch (error) {
      console.error('Error loading session feedback:', error);
      return [];
    }
  };

  const markSessionComplete = async (sessionId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('feedback_sessions')
        .update({ 
          feedback_completed: true,
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await loadFeedbackSessions();
    } catch (error) {
      console.error('Error marking session complete:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      loadFeedbackSessions();
    }
  }, [user]);

  return {
    feedbackSessions,
    loading,
    loadFeedbackSessions,
    updateSessionNotes,
    saveQuestionFeedback,
    getSessionFeedback,
    markSessionComplete
  };
};
