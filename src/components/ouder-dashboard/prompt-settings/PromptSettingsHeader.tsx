
import React from 'react';
import { PromptVersion } from '@/types/database';

interface PromptSettingsHeaderProps {
  activePrompt: PromptVersion | null;
}

const PromptSettingsHeader = ({ activePrompt }: PromptSettingsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-nunito font-bold text-gray-800">Prompt Instellingen</h2>
        <p className="text-gray-600">Beheer en test je AI prompt versies voor weekprogramma generatie</p>
      </div>
      <div className="text-sm text-gray-500">
        Actieve prompt: <span className="font-semibold text-maitje-blue">{activePrompt?.version_name || 'Geen'}</span>
      </div>
    </div>
  );
};

export default PromptSettingsHeader;
