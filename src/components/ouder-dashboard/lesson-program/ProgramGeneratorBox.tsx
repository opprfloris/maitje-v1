
import React, { useState } from 'react';
import { Wand2, Clock, BookOpen, Calculator, Globe, Sparkles, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface ProgramGeneratorBoxProps {
  kindNiveau: number;
  moeilijkheidsgraad: 'makkelijker' | 'op_niveau' | 'uitdagend';
  onMoeilijkheidsgradChange: (value: 'makkelijker' | 'op_niveau' | 'uitdagend') => void;
  onGenerateProgram: (settings: GenerationSettings) => void;
  isGenerating: boolean;
}

interface GenerationSettings {
  timePerDay: number;
  subjects: {
    rekenen: { enabled: boolean; subtopics: string[] };
    taal: { enabled: boolean; subtopics: string[] };
    engels: { enabled: boolean; subtopics: string[] };
  };
  useAIPersonalization: boolean;
  theme: string;
}

const ProgramGeneratorBox: React.FC<ProgramGeneratorBoxProps> = ({
  kindNiveau,
  moeilijkheidsgraad,
  onMoeilijkheidsgradChange,
  onGenerateProgram,
  isGenerating
}) => {
  const [timePerDay, setTimePerDay] = useState(30);
  const [subjects, setSubjects] = useState({
    rekenen: { 
      enabled: true, 
      subtopics: ['Tafels', 'Hoofdrekenen', 'Breuken', 'Meetkunde'] 
    },
    taal: { 
      enabled: true, 
      subtopics: ['Spelling', 'Begrijpend lezen', 'Woordenschat', 'Grammatica'] 
    },
    engels: { 
      enabled: true, 
      subtopics: ['Woorden', 'Zinnen', 'Uitspraak', 'Conversatie'] 
    }
  });
  const [useAIPersonalization, setUseAIPersonalization] = useState(true);
  const [theme, setTheme] = useState('');

  const handleSubjectChange = (subject: keyof typeof subjects, enabled: boolean) => {
    setSubjects(prev => ({
      ...prev,
      [subject]: { ...prev[subject], enabled }
    }));
  };

  const handleGenerate = () => {
    onGenerateProgram({
      timePerDay,
      subjects,
      useAIPersonalization,
      theme
    });
  };

  return (
    <div className="maitje-card">
      <div className="flex items-center gap-3 mb-6">
        <Wand2 className="w-6 h-6 text-purple-500" />
        <h3 className="text-xl font-nunito font-bold text-gray-800">Genereer een week programma</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Niveau & Moeilijkheidsgraad */}
        <div className="space-y-6">
          {/* Kind Niveau Indicator */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Huidig Niveau Kind</label>
            <div className="bg-gradient-to-r from-red-100 via-yellow-100 to-green-100 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Beginner</span>
                <span className="text-sm text-gray-600">Gevorderd</span>
              </div>
              <div className="relative h-3 bg-gray-200 rounded-full">
                <div 
                  className="absolute h-3 bg-gradient-to-r from-maitje-blue to-maitje-green rounded-full"
                  style={{ width: `${(kindNiveau / 10) * 100}%` }}
                ></div>
                <div 
                  className="absolute w-4 h-4 bg-white border-2 border-maitje-blue rounded-full -top-0.5"
                  style={{ left: `calc(${(kindNiveau / 10) * 100}% - 8px)` }}
                ></div>
              </div>
              <div className="text-center mt-2">
                <span className="text-lg font-bold text-maitje-blue">Niveau {kindNiveau}</span>
              </div>
            </div>
          </div>

          {/* Moeilijkheidsgraad */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Moeilijkheidsgraad Instelling</label>
            <div className="space-y-2">
              {[
                { value: 'makkelijker', label: 'Makkelijker', desc: 'Voor extra ondersteuning', color: 'green' },
                { value: 'op_niveau', label: 'Op Niveau', desc: 'Passend bij huidige kunnen', color: 'blue' },
                { value: 'uitdagend', label: 'Uitdagend', desc: 'Voor snellere progressie', color: 'purple' }
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="moeilijkheidsgraad"
                    value={option.value}
                    checked={moeilijkheidsgraad === option.value}
                    onChange={(e) => onMoeilijkheidsgradChange(e.target.value as any)}
                    className="w-4 h-4 text-maitje-blue"
                  />
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">{option.label}</div>
                    <div className="text-xs text-gray-600">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* AI Instellingen */}
        <div className="space-y-6">
          {/* Tijd per dag */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Clock className="inline w-4 h-4 mr-1" />
              Tijd per dag (minuten)
            </label>
            <select 
              value={timePerDay}
              onChange={(e) => setTimePerDay(Number(e.target.value))}
              className="w-full p-2 border rounded-lg"
            >
              <option value={15}>15 minuten</option>
              <option value={30}>30 minuten</option>
              <option value={45}>45 minuten</option>
              <option value={60}>60 minuten</option>
            </select>
          </div>

          {/* Vakgebieden */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Vakgebieden</label>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Calculator className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={subjects.rekenen.enabled}
                      onCheckedChange={(checked) => handleSubjectChange('rekenen', !!checked)}
                    />
                    <span className="font-semibold">Rekenen</span>
                  </div>
                  <div className="text-xs text-gray-600 ml-6">Tafels, Hoofdrekenen, Breuken, Meetkunde</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <BookOpen className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={subjects.taal.enabled}
                      onCheckedChange={(checked) => handleSubjectChange('taal', !!checked)}
                    />
                    <span className="font-semibold">Taal</span>
                  </div>
                  <div className="text-xs text-gray-600 ml-6">Spelling, Begrijpend lezen, Woordenschat, Grammatica</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Globe className="w-5 h-5 text-purple-500" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={subjects.engels.enabled}
                      onCheckedChange={(checked) => handleSubjectChange('engels', !!checked)}
                    />
                    <span className="font-semibold">Engels</span>
                  </div>
                  <div className="text-xs text-gray-600 ml-6">Woorden, Zinnen, Uitspraak, Conversatie</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Personalisatie */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Checkbox 
              checked={useAIPersonalization}
              onCheckedChange={(checked) => setUseAIPersonalization(!!checked)}
            />
            <div>
              <span className="font-semibold text-blue-800">mAItje personalisatie</span>
              <p className="text-xs text-blue-600">Laat AI niveau en eerdere prestaties meenemen</p>
            </div>
          </div>

          {/* Thema */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Sparkles className="inline w-4 h-4 mr-1" />
              Thema (optioneel)
            </label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="bijv. Piraten, Ruimte, Voetbal..."
              className="w-full p-2 border rounded-lg"
            />
            <p className="text-xs text-gray-600 mt-1">AI past oefeningen aan met thematische context waar mogelijk</p>
          </div>
        </div>
      </div>

      {/* Genereer Knop */}
      <div className="mt-6 pt-6 border-t">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !Object.values(subjects).some(s => s.enabled)}
          className="w-full h-12 text-lg font-semibold"
        >
          {isGenerating ? (
            <>
              <Settings className="w-5 h-5 mr-2 animate-spin" />
              mAItje genereert programma...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 mr-2" />
              Genereer AI Weekprogramma
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProgramGeneratorBox;
