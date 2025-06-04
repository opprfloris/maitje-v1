
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface WeekProgram {
  id: string;
  week_number: number;
  year: number;
  status: string;
  difficulty_level: string;
  theme: string | null;
  program_data: any[];
  created_at: string;
  updated_at: string;
}

export const useWeekPrograms = () => {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<WeekProgram[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPrograms = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('weekly_programs')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'published')
        .order('year', { ascending: false })
        .order('week_number', { ascending: false });

      if (error) {
        console.error('Error loading week programs:', error);
        return;
      }

      // Transform the data to match our WeekProgram interface
      const transformedPrograms: WeekProgram[] = (data || []).map(program => ({
        id: program.id,
        week_number: program.week_number,
        year: program.year,
        status: program.status || 'draft',
        difficulty_level: program.difficulty_level || 'op_niveau',
        theme: program.theme,
        program_data: Array.isArray(program.program_data) ? program.program_data : [],
        created_at: program.created_at,
        updated_at: program.updated_at
      }));

      setPrograms(transformedPrograms);
    } catch (error) {
      console.error('Error loading week programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgramByWeek = (year: number, weekNumber: number) => {
    return programs.find(p => p.year === year && p.week_number === weekNumber);
  };

  const getAvailablePrograms = () => {
    return programs.filter(p => p.program_data && p.program_data.length > 0);
  };

  useEffect(() => {
    loadPrograms();
  }, [user]);

  return {
    programs,
    loading,
    loadPrograms,
    getProgramByWeek,
    getAvailablePrograms
  };
};
