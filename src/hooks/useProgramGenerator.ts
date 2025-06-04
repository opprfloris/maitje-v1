
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface GenerationSettings {
  timePerDay: number;
  subjects: {
    rekenen: { enabled: boolean; subtopics: string[] };
    taal: { enabled: boolean; subtopics: string[] };
    engels: { enabled: boolean; subtopics: string[] };
  };
  useAIPersonalization: boolean;
  theme: string;
}

interface UseProgramGeneratorProps {
  selectedWeek: number;
  selectedYear: number;
  moeilijkheidsgraad: 'makkelijker' | 'op_niveau' | 'uitdagend';
  kindNiveau: number;
  onGenerationStart: () => void;
  onGenerationProgress: (progress: number, step: string) => void;
  onGenerationComplete: () => void;
  onReloadPrograms: () => void;
}

export const useProgramGenerator = ({
  selectedWeek,
  selectedYear,
  moeilijkheidsgraad,
  kindNiveau,
  onGenerationStart,
  onGenerationProgress,
  onGenerationComplete,
  onReloadPrograms
}: UseProgramGeneratorProps) => {
  const { user } = useAuth();

  const generateProgramWithAI = async (settings: GenerationSettings) => {
    if (!user) return;

    onGenerationStart();
    
    try {
      // Progress tracking
      onGenerationProgress(25, 'Voorbereiden van AI generatie...');
      
      // Call the AI edge function
      const { data: aiResponse, error: functionError } = await supabase.functions.invoke('generate-week-program', {
        body: {
          selectedWeek,
          selectedYear,
          moeilijkheidsgraad,
          timePerDay: settings.timePerDay,
          subjects: settings.subjects,
          useAIPersonalization: settings.useAIPersonalization,
          theme: settings.theme,
          userId: user.id,
          kindNiveau
        }
      });

      if (functionError) {
        throw new Error(`AI generatie fout: ${functionError.message}`);
      }

      onGenerationProgress(75, 'AI genereert vragen en oefeningen...');

      if (!aiResponse.success) {
        throw new Error(aiResponse.error || 'Onbekende fout bij AI generatie');
      }

      onGenerationProgress(90, 'Programma opslaan...');

      // Save the AI-generated program to database
      const weekProgramData = {
        user_id: user.id,
        year: selectedYear,
        week_number: selectedWeek,
        status: 'draft',
        difficulty_level: moeilijkheidsgraad,
        program_data: aiResponse.programData,
        updated_at: new Date().toISOString()
      };

      const { error: saveError } = await supabase
        .from('weekly_programs')
        .upsert(weekProgramData);

      if (saveError) {
        throw saveError;
      }

      onGenerationProgress(100, 'Programma gereed!');
      
      // Small delay to show completion
      setTimeout(async () => {
        await onReloadPrograms();
        onGenerationComplete();
      }, 1000);

    } catch (error) {
      console.error('Error generating AI program:', error);
      onGenerationComplete();
      // You might want to show a toast error here
      throw error;
    }
  };

  return { generateProgramWithAI };
};
