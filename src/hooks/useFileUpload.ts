
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface UploadedExample {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  subject: string;
  ai_analysis?: any;
  generated_exercises: any[];
}

export const useFileUpload = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const uploadFile = async (file: File, subject: string): Promise<UploadedExample | null> => {
    if (!user) {
      toast.error('Je moet ingelogd zijn om bestanden te uploaden');
      return null;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('exercise-examples')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save to database
      const { data, error: dbError } = await supabase
        .from('exercise_examples')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          subject: subject
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast.success('Bestand succesvol geüpload!');
      
      // Convert the database response to our interface
      const uploadedExample: UploadedExample = {
        id: data.id,
        file_name: data.file_name,
        file_path: data.file_path,
        file_type: data.file_type,
        subject: data.subject,
        ai_analysis: data.ai_analysis,
        generated_exercises: Array.isArray(data.generated_exercises) ? data.generated_exercises : []
      };

      return uploadedExample;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Fout bij uploaden van bestand');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const analyzeWithAI = async (exampleId: string, exerciseLength: number = 10): Promise<any[]> => {
    if (!user) return [];

    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-exercise-example', {
        body: { exampleId, exerciseLength }
      });

      if (error) throw error;

      // Update the database with analysis results
      await supabase
        .from('exercise_examples')
        .update({
          ai_analysis: data.analysis,
          generated_exercises: data.exercises
        })
        .eq('id', exampleId);

      toast.success('AI analyse voltooid!');
      return data.exercises || [];
    } catch (error) {
      console.error('AI analysis error:', error);
      toast.error('Fout bij AI analyse');
      return [];
    } finally {
      setAnalyzing(false);
    }
  };

  return {
    uploading,
    analyzing,
    uploadFile,
    analyzeWithAI
  };
};
