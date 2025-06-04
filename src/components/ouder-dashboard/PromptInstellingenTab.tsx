
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PromptEditor from './prompt-settings/PromptEditor';
import TestingSandbox from './prompt-settings/TestingSandbox';
import FeedbackAnalysis from './prompt-settings/FeedbackAnalysis';
import PromptVersionManager from './prompt-settings/PromptVersionManager';
import { PromptVersion, FeedbackSession } from '@/types/database';
import { toast } from 'sonner';

const PromptInstellingenTab = () => {
  const { user } = useAuth();
  const [promptVersions, setPromptVersions] = useState<PromptVersion[]>([]);
  const [activePrompt, setActivePrompt] = useState<PromptVersion | null>(null);
  const [feedbackSessions, setFeedbackSessions] = useState<FeedbackSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPromptVersions();
      loadFeedbackSessions();
    }
  }, [user]);

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

  const loadFeedbackSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('feedback_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading feedback sessions:', error);
        return;
      }

      setFeedbackSessions(data || []);
    } catch (error) {
      console.error('Error loading feedback sessions:', error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-maitje-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Prompt instellingen laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-nunito font-bold text-gray-800">Prompt Instellingen</h2>
          <p className="text-gray-600">Beheer en test je AI prompt versies voor weekprogramma generatie</p>
        </div>
        <div className="text-sm text-gray-500">
          Actieve prompt: <span className="font-semibold text-maitje-blue">{activePrompt?.version_name || 'Geen'}</span>
        </div>
      </div>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="editor">📝 Prompt Editor</TabsTrigger>
          <TabsTrigger value="testing">🧪 Test Sandbox</TabsTrigger>
          <TabsTrigger value="feedback">📊 Feedback Analyse</TabsTrigger>
          <TabsTrigger value="versions">📚 Versie Beheer</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6">
          <PromptEditor
            activePrompt={activePrompt}
            onCreateNewVersion={createNewPromptVersion}
            onReloadVersions={loadPromptVersions}
          />
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <TestingSandbox
            activePrompt={activePrompt}
            onCreateSession={loadFeedbackSessions}
          />
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <FeedbackAnalysis
            feedbackSessions={feedbackSessions}
            promptVersions={promptVersions}
            onCreateNewVersion={createNewPromptVersion}
            onReloadSessions={loadFeedbackSessions}
          />
        </TabsContent>

        <TabsContent value="versions" className="space-y-6">
          <PromptVersionManager
            promptVersions={promptVersions}
            activePrompt={activePrompt}
            onSetActive={setActivePromptVersion}
            onReloadVersions={loadPromptVersions}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PromptInstellingenTab;
