
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TestSettings {
  module: string;
  niveau: string;
  thema: string;
  aantal_items: number;
}

interface ExerciseFeedback {
  relevance_rating?: string;
  correctness_rating?: string;
  difficulty_rating?: string;
  clarity_rating?: string;
  quality_stars?: number;
  exercise_notes?: string;
}

interface Feedback {
  exercises: { [key: number]: ExerciseFeedback };
  overall_satisfaction?: string;
  general_comments?: string;
}

export const usePromptStudio = () => {
  const { user } = useAuth();
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [testSettings, setTestSettings] = useState<TestSettings>({
    module: '',
    niveau: '',
    thema: '',
    aantal_items: 3
  });
  const [generatedContent, setGeneratedContent] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>({
    exercises: {},
    overall_satisfaction: '',
    general_comments: ''
  });
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);

  const runMiniTest = useCallback(async (promptContent: string) => {
    if (!user) throw new Error('User not authenticated');
    
    setIsGenerating(true);
    try {
      // Create mini session first
      const { data: sessionData, error: sessionError } = await supabase
        .from('prompt_mini_sessions')
        .insert({
          prompt_version_id: selectedVersion,
          test_settings: testSettings,
          generated_content: [],
          user_id: user.id
        })
        .select()
        .single();

      if (sessionError) throw sessionError;
      setCurrentSessionId(sessionData.id);

      // Call the edge function to generate content
      const { data, error } = await supabase.functions.invoke('generate-exercise-mini-test', {
        body: {
          prompt_content: promptContent,
          test_settings: testSettings
        }
      });

      if (error) throw error;

      const content = data.exercises || [];
      setGeneratedContent(content);

      // Update session with generated content
      await supabase
        .from('prompt_mini_sessions')
        .update({
          generated_content: content
        })
        .eq('id', sessionData.id);

      // Reset feedback for new content
      setFeedback({
        exercises: {},
        overall_satisfaction: '',
        general_comments: ''
      });

    } catch (error) {
      console.error('Error running mini test:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [user, selectedVersion, testSettings]);

  const saveFeedback = useCallback(async () => {
    if (!user || !currentSessionId) throw new Error('No session to save feedback for');

    setIsSavingFeedback(true);
    try {
      // Save individual exercise feedback
      const exerciseFeedbackPromises = Object.entries(feedback.exercises).map(([index, exerciseFeedback]) => {
        const exercise = generatedContent[parseInt(index)];
        if (!exercise) return null;

        return supabase
          .from('prompt_test_feedback')
          .insert({
            session_id: currentSessionId,
            prompt_version_id: selectedVersion,
            exercise_data: exercise,
            relevance_rating: exerciseFeedback.relevance_rating,
            correctness_rating: exerciseFeedback.correctness_rating,
            difficulty_rating: exerciseFeedback.difficulty_rating,
            clarity_rating: exerciseFeedback.clarity_rating,
            quality_stars: exerciseFeedback.quality_stars,
            exercise_notes: exerciseFeedback.exercise_notes
          });
      }).filter(Boolean);

      await Promise.all(exerciseFeedbackPromises);

      // Update session with overall feedback
      await supabase
        .from('prompt_mini_sessions')
        .update({
          overall_satisfaction: feedback.overall_satisfaction,
          general_comments: feedback.general_comments
        })
        .eq('id', currentSessionId);

    } catch (error) {
      console.error('Error saving feedback:', error);
      throw error;
    } finally {
      setIsSavingFeedback(false);
    }
  }, [user, currentSessionId, selectedVersion, feedback, generatedContent]);

  return {
    currentPrompt,
    setCurrentPrompt,
    selectedVersion,
    setSelectedVersion,
    testSettings,
    setTestSettings,
    generatedContent,
    isGenerating,
    runMiniTest,
    feedback,
    setFeedback,
    saveFeedback,
    isSavingFeedback
  };
};
