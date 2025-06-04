
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    if (!user) {
      toast.error('Je moet ingelogd zijn om een programma te genereren');
      return;
    }

    // Validate settings
    const enabledSubjects = Object.entries(settings.subjects)
      .filter(([_, subject]) => subject.enabled && subject.subtopics.length > 0);
    
    if (enabledSubjects.length === 0) {
      toast.error('Selecteer minstens één vakgebied met onderdelen');
      return;
    }

    onGenerationStart();
    
    try {
      // Progress tracking
      onGenerationProgress(10, 'Voorbereiden van AI generatie...');
      
      console.log('Starting AI generation with settings:', settings);
      
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
        console.error('Function invocation error:', functionError);
        throw new Error(`AI generatie fout: ${functionError.message}`);
      }

      onGenerationProgress(60, 'AI genereert vragen en oefeningen...');

      if (!aiResponse?.success) {
        console.error('AI response error:', aiResponse);
        throw new Error(aiResponse?.error || 'Onbekende fout bij AI generatie');
      }

      console.log('AI generation successful:', aiResponse);
      onGenerationProgress(80, 'Programma valideren...');

      if (!aiResponse.programData || !Array.isArray(aiResponse.programData)) {
        throw new Error('Ongeldige programma data ontvangen van AI');
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
        console.error('Database save error:', saveError);
        throw new Error(`Fout bij opslaan: ${saveError.message}`);
      }

      onGenerationProgress(100, 'Programma gereed!');
      toast.success('Weekprogramma succesvol gegenereerd!');
      
      // Small delay to show completion
      setTimeout(async () => {
        await onReloadPrograms();
        onGenerationComplete();
      }, 1000);

    } catch (error) {
      console.error('Error generating AI program:', error);
      toast.error(`Fout bij genereren programma: ${error.message}`);
      onGenerationComplete();
      throw error;
    }
  };

  return { generateProgramWithAI };
};
