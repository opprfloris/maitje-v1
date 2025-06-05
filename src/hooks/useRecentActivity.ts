
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface RecentActivity {
  id: string;
  child_id: string;
  activity_type: 'week_program' | 'daily_exercise';
  program_id?: string;
  session_id?: string;
  last_day?: number;
  completed_exercises: number;
  total_exercises: number;
  created_at: string;
  updated_at: string;
}

export const useRecentActivity = (childId: string) => {
  const { user } = useAuth();
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentActivity = async () => {
    if (!user || !childId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('recent_activity')
        .select('*')
        .eq('child_id', childId)
        .order('updated_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentActivity(data || []);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateActivity = async (
    activityType: 'week_program' | 'daily_exercise',
    programId?: string,
    sessionId?: string,
    lastDay?: number,
    completedExercises = 0,
    totalExercises = 0
  ) => {
    if (!user || !childId) return;

    try {
      const { error } = await supabase
        .from('recent_activity')
        .upsert({
          child_id: childId,
          activity_type: activityType,
          program_id: programId,
          session_id: sessionId,
          last_day: lastDay,
          completed_exercises: completedExercises,
          total_exercises: totalExercises,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      await fetchRecentActivity();
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  useEffect(() => {
    fetchRecentActivity();
  }, [user, childId]);

  return {
    recentActivity,
    loading,
    updateActivity,
    refetch: fetchRecentActivity
  };
};
