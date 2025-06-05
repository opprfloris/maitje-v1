
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseProgramManagerProps {
  weekProgrammas: any[];
  selectedWeek: number;
  selectedYear: number;
  onReloadPrograms: () => void;
}

export const useProgramManager = ({
  weekProgrammas,
  selectedWeek,
  selectedYear,
  onReloadPrograms
}: UseProgramManagerProps) => {
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
      toast.success('Weekprogramma gepubliceerd');
    } catch (error) {
      console.error('Error publishing program:', error);
      toast.error('Fout bij publiceren programma');
    }
  };

  const deleteProgram = async () => {
    if (!user) return;
    
    const currentWeekData = weekProgrammas.find(w => w.week_number === selectedWeek && w.year === selectedYear);
    if (!currentWeekData) return;

    if (!confirm(`Weet je zeker dat je het programma voor week ${selectedWeek} wilt verwijderen?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('weekly_programs')
        .delete()
        .eq('id', currentWeekData.id);

      if (error) {
        throw error;
      }

      toast.success('Weekprogramma verwijderd');
      await onReloadPrograms();
    } catch (error) {
      console.error('Error deleting program:', error);
      toast.error('Fout bij verwijderen programma');
    }
  };

  return { publishProgram, deleteProgram };
};
