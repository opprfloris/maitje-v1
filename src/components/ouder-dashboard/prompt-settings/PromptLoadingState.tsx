
import React from 'react';

interface PromptLoadingStateProps {
  message?: string;
}

const PromptLoadingState = ({ message = "Prompt instellingen laden..." }: PromptLoadingStateProps) => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-maitje-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default PromptLoadingState;
