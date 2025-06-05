
import React from 'react';
import PromptStudio from '../ai-dashboard/PromptStudio';

const PromptInstellingenTab = () => {
  return (
    <div className="space-y-6">
      <div className="maitje-card">
        <div className="p-6">
          <h2 className="text-2xl font-nunito font-bold text-gray-800 mb-2">
            🎯 Prompt Studio
          </h2>
          <p className="text-gray-600">
            Geïntegreerde omgeving voor het ontwikkelen, testen en verfijnen van AI-prompts
          </p>
        </div>
      </div>
      
      <PromptStudio />
    </div>
  );
};

export default PromptInstellingenTab;
