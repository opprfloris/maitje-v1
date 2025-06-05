
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ExerciseSettings {
  subject: string;
  duration_minutes: number;
  difficulty_level: string;
  theme?: string;
}

export interface GeneratedExercise {
  id: string;
  question: string;
  options?: string[];
  correct_answer: string;
  explanation?: string;
  type: string;
}

export const useExerciseGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);

  const generateExercises = async (settings: ExerciseSettings, childId: string) => {
    setLoading(true);
    try {
      // Eerst sessie aanmaken in database
      const { data: sessionData, error: sessionError } = await supabase
        .from('daily_exercise_sessions')
        .insert({
          child_id: childId,
          session_type: 'ai_generated',
          subject: settings.subject,
          difficulty_level: settings.difficulty_level,
          theme: settings.theme,
          duration_minutes: settings.duration_minutes,
          settings: settings,
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Genereer oefeningen met AI (simulatie voor nu)
      const exercises = await generateAIExercises(settings);
      
      // Update sessie met gegenereerde oefeningen
      const { error: updateError } = await supabase
        .from('daily_exercise_sessions')
        .update({ exercises })
        .eq('id', sessionData.id);

      if (updateError) throw updateError;

      setSession({ ...sessionData, exercises });
      return { ...sessionData, exercises };
    } catch (error) {
      console.error('Error generating exercises:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateAIExercises = async (settings: ExerciseSettings): Promise<GeneratedExercise[]> => {
    // Simulatie van AI generatie - in echte implementatie zou dit een API call zijn
    const exerciseTypes = ['multiple_choice', 'fill_in_blank', 'true_false'];
    const exercises: GeneratedExercise[] = [];
    
    const exerciseCount = Math.max(5, Math.floor(settings.duration_minutes / 3));
    
    for (let i = 0; i < exerciseCount; i++) {
      const type = exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)];
      
      exercises.push({
        id: `exercise_${i + 1}`,
        question: `${settings.subject} vraag ${i + 1} (${settings.difficulty_level}) - ${settings.theme || 'Algemeen'}`,
        options: type === 'multiple_choice' ? ['A', 'B', 'C', 'D'] : undefined,
        correct_answer: type === 'multiple_choice' ? 'A' : 'Correct antwoord',
        explanation: `Uitleg voor vraag ${i + 1}`,
        type,
      });
    }
    
    return exercises;
  };

  const updateProgress = async (sessionId: string, exerciseId: string, isCorrect: boolean) => {
    try {
      // Haal huidige progress op
      const { data: currentSession } = await supabase
        .from('daily_exercise_sessions')
        .select('progress')
        .eq('id', sessionId)
        .single();

      const progress = currentSession?.progress || {};
      progress[exerciseId] = { completed: true, correct: isCorrect };

      // Update progress
      const { error } = await supabase
        .from('daily_exercise_sessions')
        .update({ progress })
        .eq('id', sessionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  return {
    loading,
    session,
    generateExercises,
    updateProgress,
  };
};
