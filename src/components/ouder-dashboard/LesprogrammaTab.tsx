
import React, { useState, useEffect } from 'react';
import { Check, Eye, Edit, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import WeekNavigation from './lesson-program/WeekNavigation';
import ProgramGeneratorBox from './lesson-program/ProgramGeneratorBox';
import DayDetailPopup from './lesson-program/DayDetailPopup';
import GenerationAnimation from './lesson-program/GenerationAnimation';

interface GenerationSettings {
  timePerDay: number;
  subjects: {
    rekenen: { enabled: boolean; subtopics: string[] };
    taal: { enabled: boolean; subtopics: string[] };
    engels: { enabled: boolean; subtopics: string[] };
  };
  useAIPersonalization: boolean;
  theme: string;
}

const LesprogrammaTab = () => {
  const { user } = useAuth();
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [moeilijkheidsgraad, setMoeilijkheidsgraad] = useState<'makkelijker' | 'op_niveau' | 'uitdagend'>('op_niveau');
  const [kindNiveau, setKindNiveau] = useState(5);
  const [weekProgrammas, setWeekProgrammas] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentGenerationStep, setCurrentGenerationStep] = useState('');
  const [selectedDayData, setSelectedDayData] = useState<any>(null);
  const [isDayPopupOpen, setIsDayPopupOpen] = useState(false);
  
  const dagen = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'];

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

  const generateProgramWithAI = async (settings: GenerationSettings) => {
    if (!user) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    
    try {
      // Simulate AI generation with progress steps
      const steps = [
        { progress: 25, step: 'Analyseren van niveau en prestaties...' },
        { progress: 50, step: 'Selecteren van passende oefeningen...' },
        { progress: 75, step: 'Toepassen van thema en personalisatie...' },
        { progress: 100, step: 'Finalizing weekprogramma...' }
      ];

      for (const stepData of steps) {
        setCurrentGenerationStep(stepData.step);
        setGenerationProgress(stepData.progress);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Generate enhanced program with AI features
      const programData = generateEnhancedProgram(settings);

      const weekProgramData = {
        user_id: user.id,
        year: selectedYear,
        week_number: selectedWeek,
        status: 'draft',
        difficulty_level: moeilijkheidsgraad,
        program_data: programData,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('weekly_programs')
        .upsert(weekProgramData);

      if (error) {
        throw error;
      }

      await loadWeekProgrammas();
    } catch (error) {
      console.error('Error generating AI program:', error);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
      setCurrentGenerationStep('');
    }
  };

  const generateEnhancedProgram = (settings: GenerationSettings) => {
    const enabledSubjects = Object.entries(settings.subjects)
      .filter(([_, subject]) => subject.enabled)
      .map(([name, _]) => name);

    const timePerSubject = Math.floor(settings.timePerDay / enabledSubjects.length);
    
    return dagen.map(dag => ({
      dag,
      oefeningen: enabledSubjects.map(subject => {
        const exercises = generateSubjectExercises(subject, settings.theme, timePerSubject);
        return exercises;
      }).flat()
    }));
  };

  const generateSubjectExercises = (subject: string, theme: string, timeMinutes: number) => {
    const baseExercises = {
      rekenen: [
        { titel: 'Tafel van 7', type: 'rekenen' },
        { titel: 'Hoofdrekenen tot 100', type: 'rekenen' },
        { titel: 'Breuken vergelijken', type: 'rekenen' }
      ],
      taal: [
        { titel: 'Spelling -ij woorden', type: 'taal' },
        { titel: 'Begrijpend lezen', type: 'taal' },
        { titel: 'Woordenschat uitbreiden', type: 'taal' }
      ],
      engels: [
        { titel: 'English: Animals', type: 'engels' },
        { titel: 'English: Colors', type: 'engels' },
        { titel: 'English: Family', type: 'engels' }
      ]
    };

    const exercises = baseExercises[subject as keyof typeof baseExercises] || [];
    const selectedExercise = exercises[Math.floor(Math.random() * exercises.length)];
    
    // Apply theme if provided
    if (theme) {
      selectedExercise.titel = applyThemeToExercise(selectedExercise.titel, theme);
    }

    // Add generated questions
    const vragen = generateQuestionsForExercise(selectedExercise, theme);

    return {
      ...selectedExercise,
      tijd: `${timeMinutes} min`,
      vragen
    };
  };

  const applyThemeToExercise = (title: string, theme: string) => {
    const themeMap: Record<string, Record<string, string>> = {
      'piraten': {
        'Tafel van 7': 'Piraten schatten tellen (tafel van 7)',
        'Spelling -ij woorden': 'Piraten woorden met -ij',
        'English: Animals': 'English: Pirate Animals'
      },
      'ruimte': {
        'Tafel van 7': 'Ruimte raketten tellen (tafel van 7)',
        'Spelling -ij woorden': 'Ruimte woorden met -ij',
        'English: Animals': 'English: Space Animals'
      }
    };

    const lowerTheme = theme.toLowerCase();
    return themeMap[lowerTheme]?.[title] || `${title} (${theme} thema)`;
  };

  const generateQuestionsForExercise = (exercise: any, theme: string) => {
    // Generate 3-5 sample questions based on exercise type
    const questionCount = Math.floor(Math.random() * 3) + 3;
    const questions = [];

    for (let i = 0; i < questionCount; i++) {
      if (exercise.type === 'rekenen') {
        const num1 = Math.floor(Math.random() * 12) + 1;
        const num2 = Math.floor(Math.random() * 12) + 1;
        questions.push({
          vraag: theme ? `Hoeveel ${theme} schatten zijn ${num1} × ${num2}?` : `${num1} × ${num2} = ?`,
          antwoord: (num1 * num2).toString(),
          hints: [`Begin met ${num1} × ${Math.floor(num2/2)}`, `Tel per ${num1}`]
        });
      } else if (exercise.type === 'taal') {
        const words = ['vrijdag', 'bijzonder', 'krijgen', 'schrijven'];
        const word = words[Math.floor(Math.random() * words.length)];
        questions.push({
          vraag: `Schrijf het woord "${word}" correct op.`,
          antwoord: word,
          hints: ['Let op de -ij spelling', 'Spreek het woord langzaam uit']
        });
      } else if (exercise.type === 'engels') {
        const animals = ['cat', 'dog', 'bird', 'fish'];
        const animal = animals[Math.floor(Math.random() * animals.length)];
        questions.push({
          vraag: `How do you say "${animal}" in English?`,
          antwoord: animal,
          hints: ['Think about the sound', 'What pet is this?']
        });
      }
    }

    return questions;
  };

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
      
      await loadWeekProgrammas();
    } catch (error) {
      console.error('Error publishing program:', error);
    }
  };

  const handleDayClick = (dayData: any) => {
    setSelectedDayData(dayData);
    setIsDayPopupOpen(true);
  };

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
        kindNiveau={kindNiveau}
        moeilijkheidsgraad={moeilijkheidsgraad}
        onMoeilijkheidsgradChange={setMoeilijkheidsgraad}
        onGenerateProgram={generateProgramWithAI}
        isGenerating={isGenerating}
      />

      {/* Weekprogramma Display */}
      <div className="maitje-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-nunito font-bold text-gray-800">Week {selectedWeek} Programma</h3>
          <div className="flex gap-2">
            {currentWeekData?.status === 'draft' && (
              <Button onClick={publishProgram} size="sm">
                <Check className="w-4 h-4 mr-2" />
                Publiceren
              </Button>
            )}
            {currentWeekData?.status === 'published' && isCurrentOrFutureWeek && (
              <Button 
                onClick={() => generateProgramWithAI({
                  timePerDay: 30,
                  subjects: {
                    rekenen: { enabled: true, subtopics: [] },
                    taal: { enabled: true, subtopics: [] },
                    engels: { enabled: true, subtopics: [] }
                  },
                  useAIPersonalization: true,
                  theme: ''
                })}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Vervang Programma
              </Button>
            )}
          </div>
        </div>

        {currentWeekData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {currentWeekData.program_data.map((dag: any, index: number) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-3 text-center">{dag.dag}</h4>
                <div className="space-y-3">
                  {dag.oefeningen.map((oefening: any, oefeningIndex: number) => (
                    <div 
                      key={oefeningIndex} 
                      className="bg-white p-3 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleDayClick(dag)}
                    >
                      <div className="font-semibold text-sm text-gray-800 mb-1">{oefening.titel}</div>
                      <div className="flex items-center justify-between text-xs">
                        <span className={`px-2 py-1 rounded-full ${
                          oefening.type === 'rekenen' ? 'bg-blue-100 text-blue-800' :
                          oefening.type === 'taal' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {oefening.type}
                        </span>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Eye className="w-3 h-3" />
                          {oefening.vragen?.length || 0} vragen
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Geen programma voor deze week</h4>
            <p className="mb-4">Gebruik de AI generator hierboven om een nieuw weekprogramma te maken</p>
          </div>
        )}

        {currentWeekData && (
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800">
              <strong>Status:</strong> {
                currentWeekData.status === 'published' ? 'Gepubliceerd' :
                currentWeekData.status === 'draft' ? 'Concept - kan nog bewerkt worden' : 'Concept'
              }
            </p>
            <p className="text-blue-600 text-sm mt-1">
              Klik op een dag om alle gegenereerde vragen en oefeningen te bekijken.
            </p>
          </div>
        )}
      </div>

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
