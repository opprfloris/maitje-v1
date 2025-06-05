
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PromptEditor from './prompt-settings/PromptEditor';
import TestingSandbox from './prompt-settings/TestingSandbox';
import FeedbackAnalysis from './prompt-settings/FeedbackAnalysis';
import PromptVersionManager from './prompt-settings/PromptVersionManager';
import { PromptVersion, FeedbackSession } from '@/types/database';
import { toast } from 'sonner';

const AIPromptInstellingenTab = () => {
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

      const typedData: FeedbackSession[] = (data || []).map(session => ({
        ...session,
        test_program_data: Array.isArray(session.test_program_data) ? session.test_program_data : [],
        status: session.status as 'in_progress' | 'completed' | 'analyzed'
      }));

      setFeedbackSessions(typedData);
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
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-maitje-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Prompt instellingen laden...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Prompt Development Workflow</span>
            <div className="text-sm text-gray-500">
              Actieve prompt: <span className="font-semibold text-maitje-blue">{activePrompt?.version_name || 'Geen'}</span>
            </div>
          </CardTitle>
          <CardDescription>
            Ontwikkel en optimaliseer je AI prompts met een data-driven approach. 
            Begin met de default v0.0 prompt en verbeter iteratief op basis van feedback.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="editor">1️⃣ Prompt Editor</TabsTrigger>
          <TabsTrigger value="testing">2️⃣ Test Sandbox</TabsTrigger>
          <TabsTrigger value="feedback">3️⃣ Feedback Analyse</TabsTrigger>
          <TabsTrigger value="versions">4️⃣ Versie Beheer</TabsTrigger>
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

export default AIPromptInstellingenTab;
