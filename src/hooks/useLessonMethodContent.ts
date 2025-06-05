
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface LessonMethodContent {
  id: string;
  method_name: string;
  subject: string;
  content_data: any;
  file_path?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useLessonMethodContent = () => {
  const { user } = useAuth();
  const [content, setContent] = useState<LessonMethodContent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lesson_method_content')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error fetching lesson method content:', error);
    } finally {
      setLoading(false);
    }
  };

  const createContent = async (contentData: {
    method_name: string;
    subject: string;
    content_data: any;
    description?: string;
    file_path?: string;
  }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('lesson_method_content')
        .insert({
          ...contentData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      await fetchContent();
      return data;
    } catch (error) {
      console.error('Error creating lesson method content:', error);
      return null;
    }
  };

  const updateContent = async (id: string, updates: Partial<LessonMethodContent>) => {
    try {
      const { error } = await supabase
        .from('lesson_method_content')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchContent();
    } catch (error) {
      console.error('Error updating lesson method content:', error);
    }
  };

  const deleteContent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lesson_method_content')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      await fetchContent();
    } catch (error) {
      console.error('Error deleting lesson method content:', error);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [user]);

  return {
    content,
    loading,
    createContent,
    updateContent,
    deleteContent,
    refetch: fetchContent,
  };
};
