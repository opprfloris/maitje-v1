
import React from 'react';
import { Book, Calculator, GraduationCap } from 'lucide-react';
import { AppView } from '@/components/MaitjeApp';

interface SubjectButtonsProps {
  onNavigate: (view: AppView) => void;
}

const SubjectButtons: React.FC<SubjectButtonsProps> = ({ onNavigate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <button
        onClick={() => onNavigate('rekenen')}
        className="maitje-card hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-left"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-maitje-green rounded-xl flex items-center justify-center">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-nunito font-bold text-gray-800">Rekenen</h3>
            <p className="text-gray-600">Oefen je tafels en sommen</p>
          </div>
        </div>
        <div className="text-maitje-green font-semibold">Klik om te starten →</div>
      </button>

      <button
        onClick={() => onNavigate('lezen')}
        className="maitje-card hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-left"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-maitje-blue rounded-xl flex items-center justify-center">
            <Book className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-nunito font-bold text-gray-800">Begrijpend Lezen</h3>
            <p className="text-gray-600">Lees verhalen en beantwoord vragen</p>
          </div>
        </div>
        <div className="text-maitje-blue font-semibold">Klik om te starten →</div>
      </button>

      <button
        onClick={() => onNavigate('engels')}
        className="maitje-card hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-left"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-nunito font-bold text-gray-800">Engels Leren</h3>
            <p className="text-gray-600">Oefen Engelse woordjes</p>
          </div>
        </div>
        <div className="text-purple-500 font-semibold">Klik om te starten →</div>
      </button>
    </div>
  );
};

export default SubjectButtons;
