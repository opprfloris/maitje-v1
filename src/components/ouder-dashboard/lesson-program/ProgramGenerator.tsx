
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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

interface ProgramGeneratorProps {
  selectedWeek: number;
  selectedYear: number;
  moeilijkheidsgraad: 'makkelijker' | 'op_niveau' | 'uitdagend';
  onGenerationStart: () => void;
  onGenerationProgress: (progress: number, step: string) => void;
  onGenerationComplete: () => void;
  onReloadPrograms: () => void;
}

const ProgramGenerator: React.FC<ProgramGeneratorProps> = ({
  selectedWeek,
  selectedYear,
  moeilijkheidsgraad,
  onGenerationStart,
  onGenerationProgress,
  onGenerationComplete,
  onReloadPrograms
}) => {
  const { user } = useAuth();
  const dagen = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'];

  const generateProgramWithAI = async (settings: GenerationSettings) => {
    if (!user) return;

    onGenerationStart();
    
    try {
      // Simulate AI generation with progress steps
      const steps = [
        { progress: 25, step: 'Analyseren van niveau en prestaties...' },
        { progress: 50, step: 'Selecteren van passende oefeningen...' },
        { progress: 75, step: 'Toepassen van thema en personalisatie...' },
        { progress: 100, step: 'Finalizing weekprogramma...' }
      ];

      for (const stepData of steps) {
        onGenerationProgress(stepData.progress, stepData.step);
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

      await onReloadPrograms();
    } catch (error) {
      console.error('Error generating AI program:', error);
    } finally {
      onGenerationComplete();
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

  return { generateProgramWithAI };
};

export default ProgramGenerator;
