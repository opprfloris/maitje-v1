
import React, { useState } from 'react';
import { Wand2, Settings, Clock, Brain, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GenerationSettings } from '@/hooks/useProgramGenerator';

interface ProgramGeneratorBoxProps {
  kindGroep: number;
  moeilijkheidsgraad: 'makkelijker' | 'op_niveau' | 'uitdagend';
  onKindGroepChange: (groep: number) => void;
  onMoeilijkheidsgradChange: (graad: 'makkelijker' | 'op_niveau' | 'uitdagend') => void;
  onGenerateProgram: (settings: GenerationSettings) => void;
  isGenerating: boolean;
}

const ProgramGeneratorBox: React.FC<ProgramGeneratorBoxProps> = ({
  kindGroep,
  moeilijkheidsgraad,
  onKindGroepChange,
  onMoeilijkheidsgradChange,
  onGenerateProgram,
  isGenerating
}) => {
  const [timePerDay, setTimePerDay] = useState(30);
  const [subjects, setSubjects] = useState({
    rekenen: { 
      enabled: true, 
      subtopics: ['Tafels', 'Breuken', 'Hoofdrekenen', 'Verhalen Rekenen', 'Meetkunde'] 
    },
    taal: { 
      enabled: true, 
      subtopics: ['Begrijpend Lezen', 'Woordenschat', 'Spelling', 'Grammatica'] 
    },
    engels: { 
      enabled: true, 
      subtopics: ['Woordenschat', 'Conversatie', 'Luisteren'] 
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
      <div className="flex items-center gap-3 mb-6">
        <Wand2 className="w-6 h-6 text-maitje-blue" />
        <div>
          <h3 className="text-xl font-nunito font-bold text-gray-800">AI Weekprogramma Generator</h3>
          <p className="text-sm text-gray-600">Genereer een gepersonaliseerd weekprogramma voor je kind</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basis Instellingen */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Basis Instellingen
          </h4>
          
          {/* Groep Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Groep
            </label>
            <select
              value={kindGroep}
              onChange={(e) => onKindGroepChange(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maitje-blue focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Moeilijkheidsgraad
            </label>
            <select
              value={moeilijkheidsgraad}
              onChange={(e) => onMoeilijkheidsgradChange(e.target.value as any)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maitje-blue focus:border-transparent"
            >
              <option value="makkelijker">Makkelijker dan groepsniveau</option>
              <option value="op_niveau">Op groepsniveau</option>
              <option value="uitdagend">Uitdagender dan groepsniveau</option>
            </select>
          </div>

          {/* Tijd per dag */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Tijd per dag (minuten)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="15"
                max="90"
                step="15"
                value={timePerDay}
                onChange={(e) => setTimePerDay(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-lg font-semibold text-maitje-blue min-w-[60px]">
                {timePerDay} min
              </span>
            </div>
          </div>
        </div>

        {/* Geavanceerde Instellingen */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Vakgebieden
          </h4>

          {/* Vakken selectie */}
          <div className="space-y-3">
            {Object.entries(subjects).map(([key, subject]) => (
              <div key={key} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={key}
                  checked={subject.enabled}
                  onChange={() => handleSubjectToggle(key)}
                  className="w-4 h-4 text-maitje-blue focus:ring-maitje-blue border-gray-300 rounded"
                />
                <label htmlFor={key} className="flex-1 text-sm font-medium text-gray-700 capitalize">
                  {key === 'rekenen' ? 'Rekenen' : key === 'taal' ? 'Taal' : 'Engels'}
                </label>
                <span className="text-xs text-gray-500">
                  {subject.subtopics.length} onderdelen
                </span>
              </div>
            ))}
          </div>

          {/* Thema */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Thema (optioneel)
            </label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="bijv. piraten, ruimte, dieren..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maitje-blue focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Thema wordt toegepast op verhalen rekenen, begrijpend lezen en woordenschat
            </p>
          </div>

          {/* AI Personalisatie */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="ai-personalization"
              checked={useAIPersonalization}
              onChange={(e) => setUseAIPersonalization(e.target.checked)}
              className="w-4 h-4 text-maitje-blue focus:ring-maitje-blue border-gray-300 rounded"
            />
            <label htmlFor="ai-personalization" className="text-sm text-gray-700">
              AI Personalisatie gebruiken
            </label>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-maitje-blue hover:bg-maitje-blue/90 text-white py-3 text-lg font-semibold"
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Programma genereren...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Wand2 className="w-5 h-5" />
              Genereer AI Weekprogramma
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProgramGeneratorBox;
