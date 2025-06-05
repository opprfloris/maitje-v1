
import React, { useState } from 'react';
import { ArrowLeft, Play, Settings, BookOpen, Calculator, Globe } from 'lucide-react';
import { Helper } from '@/types/helpers';
import ExerciseGenerator from './ExerciseGenerator';
import QuickAccessButtons from './QuickAccessButtons';
import LessonMethodButtons from './LessonMethodButtons';

interface DailyExerciseModeProps {
  childId: string;
  childName: string;
  selectedHelper: Helper | null;
  onExit: () => void;
}

const DailyExerciseMode: React.FC<DailyExerciseModeProps> = ({
  childId,
  childName,
  selectedHelper,
  onExit
}) => {
  const [activeSection, setActiveSection] = useState<'generator' | 'quick' | 'methods'>('generator');

  return (
    <div className="min-h-screen bg-maitje-cream p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onExit}
          className="flex items-center gap-2 p-3 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-nunito">Terug naar Dashboard</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-2xl font-nunito font-bold text-gray-800">
            Dagelijkse Oefeningen
          </h1>
          <p className="text-gray-600">Kies hoe je wilt oefenen, {childName}!</p>
        </div>
        
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      {/* Helper section */}
      {selectedHelper && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 bg-white rounded-xl p-4 shadow-md">
            <span className="text-4xl">{selectedHelper.avatar_emoji}</span>
            <div>
              <p className="font-nunito font-semibold text-gray-800">
                {selectedHelper.name} helpt je vandaag!
              </p>
              <p className="text-sm text-gray-600">Kies wat je wilt doen</p>
            </div>
          </div>
        </div>
      )}

      {/* Section Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-xl p-2 shadow-md flex gap-2">
          <button
            onClick={() => setActiveSection('generator')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-nunito font-semibold transition-all ${
              activeSection === 'generator'
                ? 'bg-maitje-blue text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="hidden sm:inline">AI Generator</span>
          </button>
          
          <button
            onClick={() => setActiveSection('quick')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-nunito font-semibold transition-all ${
              activeSection === 'quick'
                ? 'bg-maitje-green text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Play className="w-5 h-5" />
            <span className="hidden sm:inline">Snelkoppelingen</span>
          </button>
          
          <button
            onClick={() => setActiveSection('methods')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-nunito font-semibold transition-all ${
              activeSection === 'methods'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="hidden sm:inline">Lesmethoden</span>
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto">
        {activeSection === 'generator' && (
          <ExerciseGenerator
            childId={childId}
            selectedHelper={selectedHelper}
          />
        )}
        
        {activeSection === 'quick' && (
          <QuickAccessButtons />
        )}
        
        {activeSection === 'methods' && (
          <LessonMethodButtons />
        )}
      </div>
    </div>
  );
};

export default DailyExerciseMode;
