
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PromptVersion } from '@/types/database';
import { toast } from 'sonner';

export const usePromptVersions = () => {
  const { user } = useAuth();
  const [promptVersions, setPromptVersions] = useState<PromptVersion[]>([]);
  const [activePrompt, setActivePrompt] = useState<PromptVersion | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPromptVersions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('prompt_versions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading prompt versions:', error);
        toast.error('Fout bij laden prompt versies');
        return;
      }

      setPromptVersions(data || []);
      const active = data?.find(p => p.is_active) || data?.[0];
      setActivePrompt(active || null);
    } catch (error) {
      console.error('Error loading prompt versions:', error);
      toast.error('Fout bij laden prompt versies');
    } finally {
      setLoading(false);
    }
  };

  const createNewPromptVersion = async (versionName: string, content: string) => {
    if (!user) return;

    try {
      // Deactivate current active prompt
      if (activePrompt) {
        await supabase
          .from('prompt_versions')
          .update({ is_active: false })
          .eq('id', activePrompt.id);
      }

      // Create new prompt version
      const { data, error } = await supabase
        .from('prompt_versions')
        .insert({
          user_id: user.id,
          version_name: versionName,
          prompt_content: content,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating prompt version:', error);
        toast.error('Fout bij aanmaken prompt versie');
        return;
      }

      setActivePrompt(data);
      await loadPromptVersions();
      toast.success('Nieuwe prompt versie aangemaakt');
    } catch (error) {
      console.error('Error creating prompt version:', error);
      toast.error('Fout bij aanmaken prompt versie');
    }
  };

  const setActivePromptVersion = async (promptId: string) => {
    if (!user) return;

    try {
      // Deactivate all prompts
      await supabase
        .from('prompt_versions')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // Activate selected prompt
      const { error } = await supabase
        .from('prompt_versions')
        .update({ is_active: true })
        .eq('id', promptId);

      if (error) {
        console.error('Error setting active prompt:', error);
        toast.error('Fout bij instellen actieve prompt');
        return;
      }

      const newActive = promptVersions.find(p => p.id === promptId);
      setActivePrompt(newActive || null);
      await loadPromptVersions();
      toast.success('Actieve prompt ingesteld');
    } catch (error) {
      console.error('Error setting active prompt:', error);
      toast.error('Fout bij instellen actieve prompt');
    }
  };

  useEffect(() => {
    if (user) {
      loadPromptVersions();
    }
  }, [user]);

  return {
    promptVersions,
    activePrompt,
    loading,
    loadPromptVersions,
    createNewPromptVersion,
    setActivePromptVersion
  };
};
