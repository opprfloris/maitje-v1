
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WeekProgramProgress {
  id: string;
  child_id: string;
  program_id: string;
  current_day: number;
  completed_days: number[];
  day_progress: Record<string, any>;
  started_at: string;
  completed_at?: string;
  total_time_spent: number;
  created_at: string;
  updated_at: string;
}

export const useWeekProgramProgress = (childId: string) => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<WeekProgramProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProgress = async () => {
    if (!user || !childId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('weekly_program_progress')
        .select('*')
        .eq('child_id', childId)
        .order('started_at', { ascending: false });

      if (error) {
        console.error('Error loading progress:', error);
        return;
      }

      setProgressData(data || []);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const startProgram = async (programId: string) => {
    if (!user || !childId) return null;

    try {
      const { data, error } = await supabase
        .from('weekly_program_progress')
        .insert({
          child_id: childId,
          program_id: programId,
          current_day: 1,
          completed_days: [],
          day_progress: {},
          total_time_spent: 0
        })
        .select()
        .single();

      if (error) throw error;

      await loadProgress();
      toast.success('Weekprogramma gestart!');
      return data;
    } catch (error) {
      console.error('Error starting program:', error);
      toast.error('Fout bij starten programma');
      return null;
    }
  };

  const updateDayProgress = async (
    progressId: string, 
    day: number, 
    dayProgress: Record<string, any>,
    completed: boolean = false
  ) => {
    if (!user) return;

    try {
      const currentProgress = progressData.find(p => p.id === progressId);
      if (!currentProgress) return;

      const updates: any = {
        day_progress: {
          ...currentProgress.day_progress,
          [day]: dayProgress
        },
        updated_at: new Date().toISOString()
      };

      if (completed && !currentProgress.completed_days.includes(day)) {
        updates.completed_days = [...currentProgress.completed_days, day];
        updates.current_day = Math.min(day + 1, 5);
      }

      // Check if all days are completed
      if (updates.completed_days && updates.completed_days.length === 5) {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('weekly_program_progress')
        .update(updates)
        .eq('id', progressId);

      if (error) throw error;

      await loadProgress();
      
      if (completed) {
        toast.success(`Dag ${day} voltooid! 🎉`);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Fout bij opslaan voortgang');
    }
  };

  const getCurrentProgress = (programId: string) => {
    return progressData.find(p => p.program_id === programId && !p.completed_at);
  };

  const getCompletedPrograms = () => {
    return progressData.filter(p => p.completed_at);
  };

  useEffect(() => {
    loadProgress();
  }, [user, childId]);

  return {
    progressData,
    loading,
    loadProgress,
    startProgram,
    updateDayProgress,
    getCurrentProgress,
    getCompletedPrograms
  };
};
