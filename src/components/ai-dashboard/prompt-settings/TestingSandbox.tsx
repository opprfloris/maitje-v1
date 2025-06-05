
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Wand2, Play, Save } from 'lucide-react';
import { PromptVersion } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ProgramGeneratorBox from '../../ouder-dashboard/lesson-program/ProgramGeneratorBox';
import { GenerationSettings } from '@/hooks/useProgramGenerator';
import { toast } from 'sonner';

interface TestingSandboxProps {
  activePrompt: PromptVersion | null;
  onCreateSession: () => void;
}

const TestingSandbox: React.FC<TestingSandboxProps> = ({
  activePrompt,
  onCreateSession
}) => {
  const { user } = useAuth();
  const [sessionName, setSessionName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProgram, setGeneratedProgram] = useState<any[] | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + start.getDay() + 1) / 7);
  };

  const generateTestProgram = async (settings: GenerationSettings) => {
    if (!user || !activePrompt) {
      toast.error('Geen gebruiker of actieve prompt gevonden');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setCurrentStep('Test programma voorbereiden...');

    try {
      setGenerationProgress(20);
      setCurrentStep('AI generatie starten...');

      const { data: aiResponse, error: functionError } = await supabase.functions.invoke('generate-week-program', {
        body: {
          selectedWeek: getCurrentWeek(),
          selectedYear: new Date().getFullYear(),
          moeilijkheidsgraad: 'op_niveau',
          timePerDay: settings.timePerDay,
          subjects: settings.subjects,
          useAIPersonalization: settings.useAIPersonalization,
          theme: settings.theme,
          userId: user.id,
          kindGroep: 5,
          promptVersionId: activePrompt.id,
          isTestMode: true
        }
      });

      if (functionError) {
        throw new Error(`AI generatie fout: ${functionError.message}`);
      }

      setGenerationProgress(80);
      setCurrentStep('Test programma valideren...');

      if (!aiResponse?.success) {
        throw new Error(aiResponse?.error || 'Onbekende fout bij AI generatie');
      }

      setGenerationProgress(100);
      setCurrentStep('Test programma gereed!');
      setGeneratedProgram(aiResponse.programData);

      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
        setCurrentStep('');
      }, 1000);

    } catch (error) {
      console.error('Error generating test program:', error);
      toast.error(`Fout bij genereren test programma: ${error.message}`);
      setIsGenerating(false);
      setGenerationProgress(0);
      setCurrentStep('');
    }
  };

  const saveAsSession = async () => {
    if (!user || !activePrompt || !generatedProgram || !sessionName.trim()) {
      toast.error('Vul alle vereiste velden in');
      return;
    }

    try {
      const { error } = await supabase
        .from('feedback_sessions')
        .insert({
          user_id: user.id,
          prompt_version_id: activePrompt.id,
          session_name: sessionName,
          test_program_data: generatedProgram,
          status: 'in_progress'
        });

      if (error) {
        throw error;
      }

      toast.success('Test sessie opgeslagen');
      setSessionName('');
      setGeneratedProgram(null);
      onCreateSession();
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error('Fout bij opslaan test sessie');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-maitje-blue" />
            Test Sandbox
          </CardTitle>
          <CardDescription>
            Test je prompt met echte weekprogramma generatie. Perfect voor het valideren van prompt wijzigingen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!activePrompt ? (
            <div className="text-center py-8 text-gray-500">
              <p>Geen actieve prompt gevonden. Maak eerst een prompt aan in de Editor tab.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-blue-800">Actieve prompt:</h4>
                    <p className="text-blue-600">{activePrompt.version_name}</p>
                  </div>
                  <div className="text-sm text-blue-600">
                    Versie van {new Date(activePrompt.created_at).toLocaleDateString('nl-NL')}
                  </div>
                </div>
              </div>

              <ProgramGeneratorBox
                kindGroep={5}
                moeilijkheidsgraad="op_niveau"
                onKindGroepChange={() => {}}
                onMoeilijkheidsgradChange={() => {}}
                onGenerateProgram={generateTestProgram}
                isGenerating={isGenerating}
              />

              {isGenerating && (
                <Card className="border-orange-200">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Test Generatie</span>
                        <span className="text-sm text-gray-600">{generationProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${generationProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600">{currentStep}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {generatedProgram && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-800">✅ Test Programma Gegenereerd</CardTitle>
                    <CardDescription>
                      Bekijk het gegenereerde programma en sla het op als test sessie voor feedback.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold mb-3">Programma Overzicht:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {generatedProgram.map((dag: any, index: number) => (
                          <div key={index} className="text-center">
                            <div className="font-semibold text-gray-800">{dag.dag}</div>
                            <div className="text-sm text-gray-600">
                              {dag.oefeningen?.length || 0} oefeningen
                            </div>
                            <div className="text-xs text-gray-500">
                              {dag.oefeningen?.reduce((sum: number, oef: any) => sum + (oef.tijdInMinuten || 0), 0) || 0} min
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Input
                        value={sessionName}
                        onChange={(e) => setSessionName(e.target.value)}
                        placeholder="Geef deze test sessie een naam (bijv. 'Test Piraten Thema')"
                        className="flex-1"
                      />
                      <Button onClick={saveAsSession} disabled={!sessionName.trim()}>
                        <Save className="w-4 h-4 mr-2" />
                        Opslaan voor Feedback
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestingSandbox;
