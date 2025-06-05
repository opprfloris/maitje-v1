
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

const AIPromptInstellingenTab = () => {
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
      <div className="maitje-card">
        <PromptSettingsHeader activePrompt={activePrompt} />
      </div>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
          <TabsTrigger value="editor" className="flex items-center gap-2">
            📝 Prompt Editor
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center gap-2">
            🧪 Test Sandbox
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-2">
            📊 Feedback Analyse
          </TabsTrigger>
          <TabsTrigger value="versions" className="flex items-center gap-2">
            📚 Versie Beheer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6">
          <PromptEditor
            activePrompt={activePrompt}
            onCreateNewVersion={createNewPromptVersion}
            onReloadVersions={loadPromptVersions}
          />
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <div className="maitje-card">
            <TestingSandbox
              activePrompt={activePrompt}
              onCreateSession={loadFeedbackSessions}
            />
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <div className="maitje-card">
            <FeedbackAnalysis
              feedbackSessions={feedbackSessions}
              promptVersions={promptVersions}
              onCreateNewVersion={createNewPromptVersion}
              onReloadSessions={loadFeedbackSessions}
            />
          </div>
        </TabsContent>

        <TabsContent value="versions" className="space-y-6">
          <div className="maitje-card">
            <PromptVersionManager
              promptVersions={promptVersions}
              activePrompt={activePrompt}
              onSetActive={setActivePromptVersion}
              onReloadVersions={loadPromptVersions}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIPromptInstellingenTab;
