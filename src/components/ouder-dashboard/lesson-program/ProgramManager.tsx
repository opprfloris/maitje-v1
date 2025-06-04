
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ProgramManagerProps {
  weekProgrammas: any[];
  selectedWeek: number;
  selectedYear: number;
  onReloadPrograms: () => void;
}

const ProgramManager: React.FC<ProgramManagerProps> = ({
  weekProgrammas,
  selectedWeek,
  selectedYear,
  onReloadPrograms
}) => {
  const { user } = useAuth();

  const publishProgram = async () => {
    if (!user) return;
    
    const currentWeekData = weekProgrammas.find(w => w.week_number === selectedWeek && w.year === selectedYear);
    if (!currentWeekData) return;

    try {
      const { error } = await supabase
        .from('weekly_programs')
        .update({ status: 'published', updated_at: new Date().toISOString() })
        .eq('id', currentWeekData.id);

      if (error) throw error;
      
      await onReloadPrograms();
    } catch (error) {
      console.error('Error publishing program:', error);
    }
  };

  return { publishProgram };
};

export default ProgramManager;
