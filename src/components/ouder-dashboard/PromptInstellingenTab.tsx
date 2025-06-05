
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PromptEditor from './prompt-settings/PromptEditor';
import TestingSandbox from './prompt-settings/TestingSandbox';
import FeedbackAnalysis from './prompt-settings/FeedbackAnalysis';
import PromptVersionManager from './prompt-settings/PromptVersionManager';
import PromptLoadingState from './prompt-settings/PromptLoadingState';
import PromptSettingsHeader from './prompt-settings/PromptSettingsHeader';
import { usePromptVersions } from '@/hooks/usePromptVersions';
import { useFeedbackSessions } from '@/hooks/useFeedbackSessions';

const PromptInstellingenTab = () => {
  const {
    promptVersions,
    activePrompt,
    loading,
    loadPromptVersions,
    createNewPromptVersion,
    setActivePromptVersion
  } = usePromptVersions();

  const { feedbackSessions, loadFeedbackSessions } = useFeedbackSessions();

  if (loading) {
    return <PromptLoadingState />;
  }

  return (
    <div className="space-y-6">
      <PromptSettingsHeader activePrompt={activePrompt} />

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
