
import React, { useState } from 'react';
import { Wand2, Settings, Clock, Brain, Palette, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GenerationSettings } from '@/hooks/useProgramGenerator';
import SubjectSelector, { SubjectData } from './SubjectSelector';

interface ProgramGeneratorBoxProps {
  kindGroep: number;
  moeilijkheidsgraad: 'makkelijker' | 'op_niveau' | 'uitdagend';
  onKindGroepChange: (groep: number) => void;
  onMoeilijkheidsgradChange: (graad: 'makkelijker' | 'op_niveau' | 'uitdagend') => void;
  onGenerateProgram: (settings: GenerationSettings) => void;
  isGenerating: boolean;
  onDeleteProgram?: () => void;
  showDeleteButton?: boolean;
}

const ProgramGeneratorBox: React.FC<ProgramGeneratorBoxProps> = ({
  kindGroep,
  moeilijkheidsgraad,
  onKindGroepChange,
  onMoeilijkheidsgradChange,
  onGenerateProgram,
  isGenerating,
  onDeleteProgram,
  showDeleteButton = false
}) => {
  const [timePerDay, setTimePerDay] = useState(30);
  const [subjects, setSubjects] = useState<Record<string, SubjectData>>({
    rekenen: { 
      enabled: true, 
      subtopics: ['Tafels', 'Verhalen Rekenen', 'Hoofdrekenen'] 
    },
    taal: { 
      enabled: true, 
      subtopics: ['Begrijpend Lezen', 'Woordenschat'] 
    },
    engels: { 
      enabled: true, 
      subtopics: ['Woordenschat', 'Conversatie'] 
    }
  });
  const [useAIPersonalization, setUseAIPersonalization] = useState(true);
  const [theme, setTheme] = useState('');

  const handleSubjectToggle = (subject: string) => {
    setSubjects(prev => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        enabled: !prev[subject].enabled
      }
    }));
  };

  const handleSubtopicToggle = (subject: string, subtopic: string) => {
    setSubjects(prev => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        subtopics: prev[subject].subtopics.includes(subtopic)
          ? prev[subject].subtopics.filter(t => t !== subtopic)
          : [...prev[subject].subtopics, subtopic]
      }
    }));
  };

  const handleGenerate = () => {
    const settings: GenerationSettings = {
      timePerDay,
      subjects,
      useAIPersonalization,
      theme
    };
    onGenerateProgram(settings);
  };

  const getGroepNaam = (groep: number) => {
    return `Groep ${groep}`;
  };

  return (
    <div className="maitje-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Wand2 className="w-6 h-6 text-maitje-blue" />
          <div>
            <h3 className="text-xl font-nunito font-bold text-gray-800">AI Weekprogramma Generator</h3>
            <p className="text-sm text-gray-600">Genereer een gepersonaliseerd weekprogramma voor je kind</p>
          </div>
        </div>
        {showDeleteButton && (
          <Button
            onClick={onDeleteProgram}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Verwijder Programma
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basis Instellingen */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-maitje-blue" />
            <h4 className="font-semibold text-gray-800">Basis Instellingen</h4>
          </div>
          
          {/* Groep Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Groep
            </label>
            <select
              value={kindGroep}
              onChange={(e) => onKindGroepChange(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maitje-blue focus:border-transparent font-medium"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(groep => (
                <option key={groep} value={groep}>
                  {getGroepNaam(groep)}
                </option>
              ))}
            </select>
          </div>

          {/* Moeilijkheidsgraad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Moeilijkheidsgraad
            </label>
            <select
              value={moeilijkheidsgraad}
              onChange={(e) => onMoeilijkheidsgradChange(e.target.value as any)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maitje-blue focus:border-transparent font-medium"
            >
              <option value="makkelijker">🟢 Makkelijker dan groepsniveau</option>
              <option value="op_niveau">🟡 Op groepsniveau</option>
              <option value="uitdagend">🔴 Uitdagender dan groepsniveau</option>
            </select>
          </div>

          {/* Tijd per dag */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-maitje-blue" />
              Tijd per dag: <span className="text-lg font-bold text-maitje-blue">{timePerDay} minuten</span>
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="15"
                max="90"
                step="15"
                value={timePerDay}
                onChange={(e) => setTimePerDay(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>15 min</span>
                <span>30 min</span>
                <span>45 min</span>
                <span>60 min</span>
                <span>75 min</span>
                <span>90 min</span>
              </div>
            </div>
          </div>

          {/* Thema */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-maitje-blue" />
              Thema (optioneel)
            </label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="bijv. piraten, ruimte, dieren, ridders..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maitje-blue focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 Thema wordt toegepast op verhalen rekenen, begrijpend lezen en woordenschat
            </p>
          </div>

          {/* AI Personalisatie */}
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <input
              type="checkbox"
              id="ai-personalization"
              checked={useAIPersonalization}
              onChange={(e) => setUseAIPersonalization(e.target.checked)}
              className="w-5 h-5 text-maitje-blue focus:ring-maitje-blue border-gray-300 rounded"
            />
            <label htmlFor="ai-personalization" className="flex items-center gap-2 text-sm text-gray-700">
              <Brain className="w-4 h-4 text-maitje-blue" />
              AI Personalisatie gebruiken
            </label>
          </div>
        </div>

        {/* Vakgebieden */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-maitje-blue" />
            <h4 className="font-semibold text-gray-800">Vakgebieden</h4>
          </div>

          <SubjectSelector
            subjects={subjects}
            onSubjectToggle={handleSubjectToggle}
            onSubtopicToggle={handleSubtopicToggle}
          />
        </div>
      </div>

      {/* Generate Button */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-maitje-blue hover:bg-maitje-blue/90 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isGenerating ? (
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Programma genereren...
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Wand2 className="w-6 h-6" />
              ✨ Genereer AI Weekprogramma
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProgramGeneratorBox;
