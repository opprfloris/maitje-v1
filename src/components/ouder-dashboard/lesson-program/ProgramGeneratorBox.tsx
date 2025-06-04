
import React, { useState } from 'react';
import { Wand2, Clock, BookOpen, Calculator, Globe, Sparkles, Settings, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface ProgramGeneratorBoxProps {
  kindNiveau: number;
  moeilijkheidsgraad: 'makkelijker' | 'op_niveau' | 'uitdagend';
  onKindNiveauChange: (value: number) => void;
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

const allSubtopics = {
  rekenen: ['Tafels', 'Hoofdrekenen', 'Breuken', 'Meetkunde', 'Woordsommen', 'Getalbegrip'],
  taal: ['Spelling', 'Begrijpend lezen', 'Woordenschat', 'Grammatica', 'Schrijven', 'Spreken'],
  engels: ['Woorden', 'Zinnen', 'Uitspraak', 'Conversatie', 'Luisteren', 'Lezen']
};

const ProgramGeneratorBox: React.FC<ProgramGeneratorBoxProps> = ({
  kindNiveau,
  moeilijkheidsgraad,
  onKindNiveauChange,
  onMoeilijkheidsgradChange,
  onGenerateProgram,
  isGenerating
}) => {
  const [timePerDay, setTimePerDay] = useState(30);
  const [subjects, setSubjects] = useState({
    rekenen: { 
      enabled: true, 
      subtopics: ['Tafels', 'Hoofdrekenen'] 
    },
    taal: { 
      enabled: true, 
      subtopics: ['Spelling', 'Begrijpend lezen'] 
    },
    engels: { 
      enabled: true, 
      subtopics: ['Woorden', 'Zinnen'] 
    }
  });
  const [useAIPersonalization, setUseAIPersonalization] = useState(true);
  const [theme, setTheme] = useState('');
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);

  const handleSubjectChange = (subject: keyof typeof subjects, enabled: boolean) => {
    setSubjects(prev => ({
      ...prev,
      [subject]: { ...prev[subject], enabled }
    }));
  };

  const handleSubtopicChange = (subject: keyof typeof subjects, subtopic: string, checked: boolean) => {
    setSubjects(prev => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        subtopics: checked 
          ? [...prev[subject].subtopics, subtopic]
          : prev[subject].subtopics.filter(s => s !== subtopic)
      }
    }));
  };

  const toggleSubjectExpanded = (subject: string) => {
    setExpandedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleGenerate = () => {
    onGenerateProgram({
      timePerDay,
      subjects,
      useAIPersonalization,
      theme
    });
  };

  const subjectConfig = [
    { key: 'rekenen', name: 'Rekenen', icon: Calculator, color: 'blue' },
    { key: 'taal', name: 'Taal', icon: BookOpen, color: 'green' },
    { key: 'engels', name: 'Engels', icon: Globe, color: 'purple' }
  ];

  return (
    <div className="maitje-card">
      <div className="flex items-center gap-3 mb-6">
        <Wand2 className="w-6 h-6 text-purple-500" />
        <h3 className="text-xl font-nunito font-bold text-gray-800">Genereer een week programma</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Niveau & Moeilijkheidsgraad */}
        <div className="space-y-6">
          {/* Kind Niveau Slider */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Huidig Niveau Kind: <span className="text-maitje-blue font-bold">Niveau {kindNiveau}</span>
            </label>
            <div className="bg-gradient-to-r from-red-100 via-yellow-100 to-green-100 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Beginner (1)</span>
                <span className="text-sm text-gray-600">Gevorderd (10)</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={kindNiveau}
                  onChange={(e) => onKindNiveauChange(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3B82F6 0%, #10B981 ${((kindNiveau - 1) / 9) * 100}%, #E5E7EB ${((kindNiveau - 1) / 9) * 100}%, #E5E7EB 100%)`
                  }}
                />
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
            <label className="block text-sm font-semibold text-gray-700 mb-3">Vakgebieden & Onderdelen</label>
            <div className="space-y-3">
              {subjectConfig.map(({ key, name, icon: Icon, color }) => (
                <div key={key} className="border rounded-lg overflow-hidden">
                  <div className="flex items-center gap-3 p-3 bg-gray-50">
                    <Icon className={`w-5 h-5 text-${color}-500`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          checked={subjects[key as keyof typeof subjects].enabled}
                          onCheckedChange={(checked) => handleSubjectChange(key as keyof typeof subjects, !!checked)}
                        />
                        <span className="font-semibold">{name}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSubjectExpanded(key)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      {expandedSubjects.includes(key) ? 
                        <ChevronDown className="w-4 h-4" /> : 
                        <ChevronRight className="w-4 h-4" />
                      }
                    </button>
                  </div>
                  
                  {expandedSubjects.includes(key) && (
                    <div className="p-3 bg-white border-t">
                      <div className="text-xs text-gray-600 mb-2">Selecteer onderdelen:</div>
                      <div className="grid grid-cols-2 gap-2">
                        {allSubtopics[key as keyof typeof allSubtopics].map((subtopic) => (
                          <label key={subtopic} className="flex items-center gap-2 text-sm">
                            <Checkbox
                              checked={subjects[key as keyof typeof subjects].subtopics.includes(subtopic)}
                              onCheckedChange={(checked) => handleSubtopicChange(key as keyof typeof subjects, subtopic, !!checked)}
                              disabled={!subjects[key as keyof typeof subjects].enabled}
                            />
                            <span className={!subjects[key as keyof typeof subjects].enabled ? 'text-gray-400' : ''}>{subtopic}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
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
          disabled={isGenerating || !Object.values(subjects).some(s => s.enabled && s.subtopics.length > 0)}
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
        {!Object.values(subjects).some(s => s.enabled && s.subtopics.length > 0) && (
          <p className="text-xs text-red-600 mt-2 text-center">
            Selecteer minstens één vakgebied met onderdelen
          </p>
        )}
      </div>
    </div>
  );
};

export default ProgramGeneratorBox;
