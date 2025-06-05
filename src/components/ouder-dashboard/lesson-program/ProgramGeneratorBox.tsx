
import React, { useState } from 'react';
import { Wand2, Settings, Sparkles, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import SubjectSelector from './SubjectSelector';
import { GenerationSettings } from '@/hooks/useProgramGenerator';

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
  showDeleteButton
}) => {
  const [timePerDay, setTimePerDay] = useState(30);
  const [useAIPersonalization, setUseAIPersonalization] = useState(true);
  const [theme, setTheme] = useState('');
  const [subjects, setSubjects] = useState({
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

  const handleGenerate = () => {
    const settings: GenerationSettings = {
      timePerDay,
      subjects,
      useAIPersonalization,
      theme
    };
    onGenerateProgram(settings);
  };

  return (
    <div className="maitje-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-maitje-blue rounded-xl flex items-center justify-center">
          <Wand2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-nunito font-bold text-gray-800">AI Programma Generator</h3>
          <p className="text-gray-600">Laat AI een gepersonaliseerd weekprogramma maken</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basis Instellingen */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Basis Instellingen
          </h4>
          
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Kind Groep</Label>
              <Select value={kindGroep.toString()} onValueChange={(value) => onKindGroepChange(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Groep 3</SelectItem>
                  <SelectItem value="4">Groep 4</SelectItem>
                  <SelectItem value="5">Groep 5</SelectItem>
                  <SelectItem value="6">Groep 6</SelectItem>
                  <SelectItem value="7">Groep 7</SelectItem>
                  <SelectItem value="8">Groep 8</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Moeilijkheidsgraad</Label>
              <Select value={moeilijkheidsgraad} onValueChange={onMoeilijkheidsgradChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="makkelijker">Makkelijker dan niveau</SelectItem>
                  <SelectItem value="op_niveau">Op niveau</SelectItem>
                  <SelectItem value="uitdagend">Uitdagend</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Tijd per dag (minuten)</Label>
              <Input
                type="number"
                value={timePerDay}
                onChange={(e) => setTimePerDay(parseInt(e.target.value) || 30)}
                min={15}
                max={120}
                step={15}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Thema (optioneel)</Label>
              <Input
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Bijv. Piraten, Ruimtevaart, Dieren..."
              />
            </div>
          </div>
        </div>

        {/* Vakken Selectie */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Vakken & Onderwerpen</h4>
          <SubjectSelector subjects={subjects} onSubjectsChange={setSubjects} />
        </div>
      </div>

      {/* AI Personalisatie */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-800">AI Personalisatie</h4>
              <p className="text-sm text-gray-600 mt-1">
                Wanneer ingeschakeld, gebruikt de AI de extra informatie die je hebt toegevoegd bij Kind Instellingen 
                (interessegebieden, thema's, achtergrond informatie) om het programma nog gepersonaliseerder te maken.
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-purple-600">
                <Info className="w-3 h-3" />
                <span>Gebaseerd op jouw kind instellingen en interessegebieden</span>
              </div>
            </div>
          </div>
          <Switch
            checked={useAIPersonalization}
            onCheckedChange={setUseAIPersonalization}
          />
        </div>
      </div>

      {/* Actie Knoppen */}
      <div className="flex justify-between items-center mt-6">
        <div>
          {showDeleteButton && onDeleteProgram && (
            <Button
              onClick={onDeleteProgram}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Programma Verwijderen
            </Button>
          )}
        </div>
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="maitje-button"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Genereren...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Genereer AI Programma
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProgramGeneratorBox;
