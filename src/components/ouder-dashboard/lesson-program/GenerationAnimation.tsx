
import React from 'react';
import { Sparkles, Brain, BookOpen, Wand2 } from 'lucide-react';

interface GenerationAnimationProps {
  isVisible: boolean;
  progress: number;
  currentStep: string;
}

const GenerationAnimation: React.FC<GenerationAnimationProps> = ({ isVisible, progress, currentStep }) => {
  if (!isVisible) return null;

  const steps = [
    { icon: Brain, label: 'Niveau analyseren', color: 'text-blue-500' },
    { icon: BookOpen, label: 'Oefeningen selecteren', color: 'text-green-500' },
    { icon: Sparkles, label: 'Thema toepassen', color: 'text-purple-500' },
    { icon: Wand2, label: 'Programma maken', color: 'text-orange-500' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-maitje-blue to-maitje-green rounded-full flex items-center justify-center mx-auto mb-4">
            <Wand2 className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">mAItje genereert uw programma</h3>
          <p className="text-gray-600">{currentStep}</p>
        </div>

        <div className="space-y-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-maitje-blue to-maitje-green h-3 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === Math.floor(progress / 25);
              const isCompleted = index < Math.floor(progress / 25);
              
              return (
                <div 
                  key={index}
                  className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                    isActive ? 'bg-blue-50 scale-105' : isCompleted ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${
                    isActive ? 'text-blue-500 animate-spin' : 
                    isCompleted ? 'text-green-500' : 'text-gray-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    isActive ? 'text-blue-700' : 
                    isCompleted ? 'text-green-700' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerationAnimation;
