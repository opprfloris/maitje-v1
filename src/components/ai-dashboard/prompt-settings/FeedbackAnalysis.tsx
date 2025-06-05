
import React from 'react';
import { FeedbackSession, PromptVersion } from '@/types/database';
import EnhancedFeedbackAnalysis from './EnhancedFeedbackAnalysis';

interface FeedbackAnalysisProps {
  feedbackSessions: FeedbackSession[];
  promptVersions: PromptVersion[];
  onCreateNewVersion: (versionName: string, content: string) => Promise<void>;
  onReloadSessions: () => Promise<void>;
}

const FeedbackAnalysis: React.FC<FeedbackAnalysisProps> = ({
  feedbackSessions,
  promptVersions,
  onCreateNewVersion,
  onReloadSessions
}) => {
  return (
    <EnhancedFeedbackAnalysis
      promptVersions={promptVersions}
      onCreateNewVersion={onCreateNewVersion}
    />
  );
};

export default FeedbackAnalysis;
