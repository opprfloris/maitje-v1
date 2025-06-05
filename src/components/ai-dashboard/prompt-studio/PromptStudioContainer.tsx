
import React, { useEffect } from 'react';
import { usePromptVersions } from '@/hooks/usePromptVersions';
import { usePromptStudio } from '@/hooks/usePromptStudio';
import { useToast } from '@/hooks/use-toast';
import PromptEditor from './PromptEditor';
import TestConfiguration from './TestConfiguration';
import ExerciseReview from './ExerciseReview';

const PromptStudioContainer = () => {
  const { toast } = useToast();
  const {
    promptVersions,
    activePrompt,
    loading,
    createNewPromptVersion,
    setActivePromptVersion
  } = usePromptVersions();

  const {
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
  } = usePromptStudio();

  // Load selected version into editor
  useEffect(() => {
    if (selectedVersion && promptVersions) {
      const version = promptVersions.find(v => v.id === selectedVersion);
      if (version) {
        setCurrentPrompt(version.prompt_content);
      }
    }
  }, [selectedVersion, promptVersions, setCurrentPrompt]);

  // Initialize with active prompt
  useEffect(() => {
    if (activePrompt && !selectedVersion) {
      setCurrentPrompt(activePrompt.prompt_content);
      setSelectedVersion(activePrompt.id);
    }
  }, [activePrompt, selectedVersion, setCurrentPrompt, setSelectedVersion]);

  const handleSaveNewVersion = async (description: string) => {
    if (!currentPrompt.trim()) {
      toast({
        title: "Fout",
        description: "Prompt mag niet leeg zijn",
        variant: "destructive"
      });
      return;
    }

    try {
      await createNewPromptVersion(currentPrompt, description);
      toast({
        title: "Succes",
        description: "Nieuwe prompt versie opgeslagen"
      });
    } catch (error) {
      toast({
        title: "Fout",
        description: "Kon prompt versie niet opslaan",
        variant: "destructive"
      });
    }
  };

  const handleActivateVersion = async (versionId: string) => {
    try {
      await setActivePromptVersion(versionId);
      toast({
        title: "Succes",
        description: "Prompt versie geactiveerd"
      });
    } catch (error) {
      toast({
        title: "Fout",
        description: "Kon prompt versie niet activeren",
        variant: "destructive"
      });
    }
  };

  const handleRunTest = async () => {
    if (!currentPrompt.trim()) {
      toast({
        title: "Fout",
        description: "Prompt mag niet leeg zijn",
        variant: "destructive"
      });
      return;
    }

    if (!testSettings.module || !testSettings.niveau) {
      toast({
        title: "Fout",
        description: "Module en niveau zijn verplicht",
        variant: "destructive"
      });
      return;
    }

    try {
      await runMiniTest(currentPrompt);
    } catch (error) {
      toast({
        title: "Fout",
        description: "Kon test niet uitvoeren",
        variant: "destructive"
      });
    }
  };

  const handleSaveFeedback = async () => {
    try {
      await saveFeedback();
      toast({
        title: "Succes",
        description: "Feedback opgeslagen"
      });
    } catch (error) {
      toast({
        title: "Fout",
        description: "Kon feedback niet opslaan",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-maitje-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Prompt Studio laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Linker Paneel: Prompt Editor & Versiebeheer */}
      <div className="space-y-6">
        <PromptEditor
          promptVersions={promptVersions}
          currentPrompt={currentPrompt}
          setCurrentPrompt={setCurrentPrompt}
          selectedVersion={selectedVersion}
          setSelectedVersion={setSelectedVersion}
          activePrompt={activePrompt}
          onSaveNewVersion={handleSaveNewVersion}
          onActivateVersion={handleActivateVersion}
        />
      </div>

      {/* Rechter Paneel: Mini-Sandbox & Beoordeling */}
      <div className="space-y-6">
        <TestConfiguration
          testSettings={testSettings}
          setTestSettings={setTestSettings}
          onRunTest={handleRunTest}
          isGenerating={isGenerating}
        />

        <ExerciseReview
          generatedContent={generatedContent}
          feedback={feedback}
          setFeedback={setFeedback}
          onSaveFeedback={handleSaveFeedback}
          isSavingFeedback={isSavingFeedback}
        />
      </div>
    </div>
  );
};

export default PromptStudioContainer;
