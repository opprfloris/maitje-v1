
import React from 'react';

const PromptLoadingState = () => {
  return (
    <div className="maitje-card text-center py-12">
      <div className="w-16 h-16 bg-maitje-blue rounded-full flex items-center justify-center text-2xl mx-auto mb-4 animate-bounce">
        🦉
      </div>
      <h3 className="text-xl font-nunito font-bold text-gray-800 mb-2">Prompt gegevens laden...</h3>
      <p className="text-gray-600">Even geduld terwijl we je prompt versies ophalen</p>
    </div>
  );
};

export default PromptLoadingState;
