
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useFamilyConnections } from './useFamilyConnections';

export interface WeekProgram {
  id: string;
  user_id: string;
  week_number: number;
  year: number;
  theme?: string;
  difficulty_level?: string;
  status?: string;
  program_data?: any;
  created_at: string;
  updated_at: string;
}

export const useWeekPrograms = (childId?: string) => {
  const { user } = useAuth();
  const { getParentIdForChild } = useFamilyConnections();
  const [programs, setPrograms] = useState<WeekProgram[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      let userId = user?.id;
      
      // Als we een childId hebben, probeer de parent te vinden
      if (childId && childId !== 'dummy-child-id') {
        const parentId = getParentIdForChild(childId);
        if (parentId) {
          userId = parentId;
        }
      }

      if (!userId) {
        setPrograms([]);
        return;
      }

      const { data, error } = await supabase
        .from('weekly_programs')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'published') // Alleen gepubliceerde programma's tonen voor kinderen
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching week programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgramById = async (id: string): Promise<WeekProgram | null> => {
    try {
      const { data, error } = await supabase
        .from('weekly_programs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching program by id:', error);
      return null;
    }
  };

  const getProgramByWeek = (year: number, weekNumber: number): WeekProgram | null => {
    return programs.find(p => p.year === year && p.week_number === weekNumber) || null;
  };

  useEffect(() => {
    fetchPrograms();
  }, [user, childId]);

  return {
    programs,
    loading,
    refetch: fetchPrograms,
    getProgramById,
    getProgramByWeek,
  };
};
