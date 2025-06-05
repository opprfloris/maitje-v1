
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
      
      // Convert the database response to our interface with proper typing
      const typedData: RecentActivity[] = (data || []).map(item => ({
        id: item.id,
        child_id: item.child_id,
        activity_type: item.activity_type as 'week_program' | 'daily_exercise',
        program_id: item.program_id,
        session_id: item.session_id,
        last_day: item.last_day,
        completed_exercises: item.completed_exercises || 0,
        total_exercises: item.total_exercises || 0,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setRecentActivity(typedData);
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
