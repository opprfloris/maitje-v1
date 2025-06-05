
import React from 'react';
import { Calendar, Target } from 'lucide-react';

interface ProgramChoiceSectionProps {
  onStartWeekProgram: () => void;
  onStartDailyExercises: () => void;
}

const ProgramChoiceSection: React.FC<ProgramChoiceSectionProps> = ({
  onStartWeekProgram,
  onStartDailyExercises
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Weekprogramma Kaart */}
      <div className="maitje-card hover:shadow-xl transform hover:scale-105 transition-all duration-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-nunito font-bold text-gray-800">Weekprogramma</h3>
            <p className="text-gray-600">Volg je wekelijkse leerplan</p>
          </div>
        </div>
        <button 
          onClick={onStartWeekProgram}
          className="w-full maitje-button text-xl py-4"
        >
          Start Weekprogramma →
        </button>
      </div>

      {/* Dagelijkse Oefeningen Kaart */}
      <div className="maitje-card hover:shadow-xl transform hover:scale-105 transition-all duration-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-maitje-green rounded-xl flex items-center justify-center">
            <Target className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-nunito font-bold text-gray-800">Dagelijkse Oefeningen</h3>
            <p className="text-gray-600">Losse oefeningen per vak</p>
          </div>
        </div>
        <button 
          onClick={onStartDailyExercises}
          className="w-full bg-maitje-green hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-colors text-xl"
        >
          Start Oefeningen →
        </button>
      </div>
    </div>
  );
};

export default ProgramChoiceSection;
