
import React from 'react';
import { FileText, Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PromptVersion } from '@/types/database';

interface PromptSettingsHeaderProps {
  activePrompt: PromptVersion | null;
}

const PromptSettingsHeader = ({ activePrompt }: PromptSettingsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-maitje-blue rounded-xl flex items-center justify-center">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-nunito font-bold text-gray-800">Prompt Instellingen</h2>
          <p className="text-gray-600">Beheer en optimaliseer je AI prompts</p>
        </div>
      </div>
      {activePrompt && (
        <div className="text-right">
          <Badge className="mb-2 bg-green-100 text-green-800">
            Actief: {activePrompt.version_name}
          </Badge>
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date(activePrompt.created_at).toLocaleDateString('nl-NL')}
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptSettingsHeader;
