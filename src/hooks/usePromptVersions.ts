
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PromptVersion } from '@/types/database';
import { toast } from 'sonner';

// Default v0.0 baseline prompt
const DEFAULT_PROMPT_CONTENT = `Je bent een ervaren basisschool docent die gespecialiseerd is in het maken van educatieve weekprogramma's voor Nederlandse basisscholen.

CONTEXT:
- Je maakt programma's voor kinderen van 6-12 jaar (groep 3-8)
- Het Nederlandse curriculum volgt de kerndoelen voor basisonderwijs
- Focus op rekenen, begrijpend lezen, en Engels als hoofdvakken
- Activiteiten moeten leeftijdsgeschikt en uitdagend zijn

INSTRUCTIES:
1. Maak een gevarieerd weekprogramma met verschillende activiteiten per dag
2. Balanceer verschillende vakgebieden en moeilijkheidsniveaus
3. Zorg voor duidelijke instructies en verwachte uitkomsten
4. Gebruik Nederlandse educatieve terminologie
5. Maak activiteiten interactief en motiverend

FORMAAT:
Geef antwoord in geldige JSON format met deze structuur:
{
  "week": [
    {
      "dag": "maandag",
      "activiteiten": [
        {
          "vak": "rekenen",
          "titel": "Titel van de activiteit",
          "beschrijving": "Gedetailleerde beschrijving",
          "duur": "30 minuten",
          "niveau": "groep 5"
        }
      ]
    }
  ]
}

KWALITEITSEISEN:
- Activiteiten moeten educatief waardevol zijn
- Duidelijke leerdobestellingen per activiteit
- Realistische tijdsinschattingen
- Variatie in werkvormen (individueel, groepswerk, klassikaal)`;

export const usePromptVersions = () => {
  const { user } = useAuth();
  const [promptVersions, setPromptVersions] = useState<PromptVersion[]>([]);
  const [activePrompt, setActivePrompt] = useState<PromptVersion | null>(null);
  const [loading, setLoading] = useState(true);

  const createDefaultPromptIfNeeded = async () => {
    if (!user) return;

    try {
      // Check if there are any prompt versions
      const { data: existingPrompts } = await supabase
        .from('prompt_versions')
        .select('*')
        .eq('user_id', user.id);

      if (!existingPrompts || existingPrompts.length === 0) {
        // Create default v0.0 prompt
        const { data, error } = await supabase
          .from('prompt_versions')
          .insert({
            user_id: user.id,
            version_name: 'v0.0 - Baseline',
            prompt_content: DEFAULT_PROMPT_CONTENT,
            is_active: true
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating default prompt:', error);
          return;
        }

        return data;
      }

      return null;
    } catch (error) {
      console.error('Error checking/creating default prompt:', error);
      return null;
    }
  };

  const loadPromptVersions = async () => {
    if (!user) return;

    try {
      // First ensure default prompt exists
      await createDefaultPromptIfNeeded();

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
      toast.success('Nieuwe prompt versie aangemaakt en geactiveerd');
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
    setActivePromptVersion,
    defaultPromptContent: DEFAULT_PROMPT_CONTENT
  };
};
