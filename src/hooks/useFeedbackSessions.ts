
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { FeedbackSession } from '@/types/database';

export const useFeedbackSessions = () => {
  const { user } = useAuth();
  const [feedbackSessions, setFeedbackSessions] = useState<FeedbackSession[]>([]);

  const loadFeedbackSessions = async () => {
    if (!user) return;

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
        status: session.status as 'in_progress' | 'completed' | 'analyzed'
      }));

      setFeedbackSessions(typedData);
    } catch (error) {
      console.error('Error loading feedback sessions:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadFeedbackSessions();
    }
  }, [user]);

  return {
    feedbackSessions,
    loadFeedbackSessions
  };
};
