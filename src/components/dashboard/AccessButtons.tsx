
import React from 'react';
import { User, Brain } from 'lucide-react';

interface AccessButtonsProps {
  onOuderAccess: () => void;
  onAIAccess: () => void;
}

const AccessButtons: React.FC<AccessButtonsProps> = ({ onOuderAccess, onAIAccess }) => {
  return (
    <div className="flex justify-center gap-8">
      <button
        onClick={onOuderAccess}
        className="flex items-center gap-2 p-3 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <User className="w-5 h-5" />
        <span className="text-sm">Ouder Dashboard</span>
        <span className="text-lg">🔒</span>
      </button>
      
      <button
        onClick={onAIAccess}
        className="flex items-center gap-2 p-3 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <Brain className="w-5 h-5" />
        <span className="text-sm">Dev Instellingen</span>
        <span className="text-lg">🔒</span>
      </button>
    </div>
  );
};

export default AccessButtons;
