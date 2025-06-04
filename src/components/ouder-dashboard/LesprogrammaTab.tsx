
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import WeekNavigation from './lesson-program/WeekNavigation';
import ProgramGeneratorBox from './lesson-program/ProgramGeneratorBox';
import DayDetailPopup from './lesson-program/DayDetailPopup';
import GenerationAnimation from './lesson-program/GenerationAnimation';
import WeekProgramDisplay from './lesson-program/WeekProgramDisplay';
import { useProgramGenerator, GenerationSettings } from '@/hooks/useProgramGenerator';
import { useProgramManager } from '@/hooks/useProgramManager';

const LesprogrammaTab = () => {
  const { user } = useAuth();
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [moeilijkheidsgraad, setMoeilijkheidsgraad] = useState<'makkelijker' | 'op_niveau' | 'uitdagend'>('op_niveau');
  const [kindGroep, setKindGroep] = useState(5);
  const [weekProgrammas, setWeekProgrammas] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentGenerationStep, setCurrentGenerationStep] = useState('');
  const [selectedDayData, setSelectedDayData] = useState<any>(null);
  const [isDayPopupOpen, setIsDayPopupOpen] = useState(false);

  function getCurrentWeek() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + start.getDay() + 1) / 7);
  }

  useEffect(() => {
    if (user) {
      loadWeekProgrammas();
    }
  }, [user, selectedYear]);

  const loadWeekProgrammas = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('weekly_programs')
        .select('*')
        .eq('user_id', user.id)
        .eq('year', selectedYear)
        .order('week_number');

      if (error) {
        console.error('Error loading weekly programs:', error);
        return;
      }

      setWeekProgrammas(data || []);
    } catch (error) {
      console.error('Error loading weekly programs:', error);
    }
  };

  const handleGenerationStart = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
  };

  const handleGenerationProgress = (progress: number, step: string) => {
    setGenerationProgress(progress);
    setCurrentGenerationStep(step);
  };

  const handleGenerationComplete = () => {
    setIsGenerating(false);
    setGenerationProgress(0);
    setCurrentGenerationStep('');
  };

  const handleDayClick = (dayData: any) => {
    setSelectedDayData(dayData);
    setIsDayPopupOpen(true);
  };

  const deleteCurrentProgram = async () => {
    if (!user || !currentWeekData) return;

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
      loadWeekProgrammas();
    } catch (error) {
      console.error('Error deleting program:', error);
      toast.error('Fout bij verwijderen programma');
    }
  };

  const programGenerator = useProgramGenerator({
    selectedWeek,
    selectedYear,
    moeilijkheidsgraad,
    kindGroep,
    onGenerationStart: handleGenerationStart,
    onGenerationProgress: handleGenerationProgress,
    onGenerationComplete: handleGenerationComplete,
    onReloadPrograms: loadWeekProgrammas
  });

  const programManager = useProgramManager({
    weekProgrammas,
    selectedWeek,
    selectedYear,
    onReloadPrograms: loadWeekProgrammas
  });

  const currentWeekData = weekProgrammas.find(w => w.week_number === selectedWeek && w.year === selectedYear);
  const isCurrentOrFutureWeek = selectedYear > new Date().getFullYear() || 
    (selectedYear === new Date().getFullYear() && selectedWeek >= getCurrentWeek());

  return (
    <div className="space-y-6">
      <WeekNavigation
        selectedWeek={selectedWeek}
        selectedYear={selectedYear}
        onWeekChange={setSelectedWeek}
        onYearChange={setSelectedYear}
        weekProgrammas={weekProgrammas}
        currentWeek={getCurrentWeek()}
      />

      <ProgramGeneratorBox
        kindGroep={kindGroep}
        moeilijkheidsgraad={moeilijkheidsgraad}
        onKindGroepChange={setKindGroep}
        onMoeilijkheidsgradChange={setMoeilijkheidsgraad}
        onGenerateProgram={programGenerator.generateProgramWithAI}
        isGenerating={isGenerating}
        onDeleteProgram={deleteCurrentProgram}
        showDeleteButton={!!currentWeekData}
      />

      <WeekProgramDisplay
        currentWeekData={currentWeekData}
        selectedWeek={selectedWeek}
        isCurrentOrFutureWeek={isCurrentOrFutureWeek}
        onPublishProgram={programManager.publishProgram}
        onReplaceProgram={() => programGenerator.generateProgramWithAI({
          timePerDay: 30,
          subjects: {
            rekenen: { enabled: true, subtopics: ['Tafels', 'Verhalen Rekenen', 'Hoofdrekenen'] },
            taal: { enabled: true, subtopics: ['Begrijpend Lezen', 'Woordenschat'] },
            engels: { enabled: true, subtopics: ['Woordenschat', 'Conversatie'] }
          },
          useAIPersonalization: true,
          theme: ''
        })}
        onDayClick={handleDayClick}
      />

      <GenerationAnimation
        isVisible={isGenerating}
        progress={generationProgress}
        currentStep={currentGenerationStep}
      />

      <DayDetailPopup
        isOpen={isDayPopupOpen}
        onClose={() => setIsDayPopupOpen(false)}
        dayData={selectedDayData}
      />
    </div>
  );
};

export default LesprogrammaTab;
