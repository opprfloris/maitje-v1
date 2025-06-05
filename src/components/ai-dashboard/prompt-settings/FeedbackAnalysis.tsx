
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, MessageSquare, Sparkles, Save } from 'lucide-react';
import { FeedbackSession, PromptVersion, QuestionFeedback } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FeedbackAnalysisProps {
  feedbackSessions: FeedbackSession[];
  promptVersions: PromptVersion[];
  onCreateNewVersion: (versionName: string, content: string) => Promise<void>;
  onReloadSessions: () => Promise<void>;
}

const FeedbackAnalysis: React.FC<FeedbackAnalysisProps> = ({
  feedbackSessions,
  promptVersions,
  onCreateNewVersion,
  onReloadSessions
}) => {
  const { user } = useAuth();
  const [selectedSession, setSelectedSession] = useState<FeedbackSession | null>(null);
  const [sessionFeedback, setSessionFeedback] = useState<QuestionFeedback[]>([]);
  const [userFeedback, setUserFeedback] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  const loadSessionFeedback = async (session: FeedbackSession) => {
    setIsLoadingFeedback(true);
    try {
      const { data, error } = await supabase
        .from('question_feedback')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at');

      if (error) {
        throw error;
      }

      const typedData: QuestionFeedback[] = (data || []).map(item => ({
        ...item,
        feedback_category: item.feedback_category as 'good' | 'incorrect' | 'unclear' | 'too_easy' | 'too_hard'
      }));

      setSessionFeedback(typedData);
      setSelectedSession(session);
      
      if (session.ai_analysis) {
        try {
          setAiAnalysis(JSON.parse(session.ai_analysis));
        } catch {
          setAiAnalysis(null);
        }
      } else {
        setAiAnalysis(null);
      }
    } catch (error) {
      console.error('Error loading session feedback:', error);
      toast.error('Fout bij laden feedback');
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const analyzeWithAI = async () => {
    if (!selectedSession) return;

    setIsAnalyzing(true);
    try {
      const promptVersion = promptVersions.find(p => p.id === selectedSession.prompt_version_id);
      if (!promptVersion) {
        throw new Error('Prompt versie niet gevonden');
      }

      const { data, error } = await supabase.functions.invoke('analyze-feedback', {
        body: {
          sessionId: selectedSession.id,
          userFeedback,
          currentPrompt: promptVersion.prompt_content
        }
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Analyse mislukt');
      }

      setAiAnalysis(data.analysis);
      onReloadSessions();
      toast.success('AI analyse voltooid');
    } catch (error) {
      console.error('Error analyzing feedback:', error);
      toast.error(`Fout bij AI analyse: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const createPromptFromAnalysis = async () => {
    if (!aiAnalysis?.newPrompt) {
      toast.error('Geen nieuwe prompt beschikbaar in analyse');
      return;
    }

    const versionName = `Verbeterd o.b.v. ${selectedSession?.session_name} - ${new Date().toLocaleDateString('nl-NL')}`;
    await onCreateNewVersion(versionName, aiAnalysis.newPrompt);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-maitje-blue" />
            AI Feedback Analysis
          </CardTitle>
          <CardDescription>
            Analyseer feedback van test sessies en genereer verbeterde prompt versies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feedbackSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Geen test sessies gevonden.</p>
              <p className="text-sm">Maak eerst een test in de Test Sandbox.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Selecteer Test Sessie:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {feedbackSessions.map((session) => (
                    <Card 
                      key={session.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedSession?.id === session.id ? 'ring-2 ring-maitje-blue' : ''
                      }`}
                      onClick={() => loadSessionFeedback(session)}
                    >
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <h5 className="font-semibold">{session.session_name}</h5>
                          <p className="text-sm text-gray-600">
                            {new Date(session.created_at).toLocaleDateString('nl-NL')}
                          </p>
                          <Badge variant={session.status === 'analyzed' ? 'default' : 'secondary'}>
                            {session.status === 'analyzed' ? '✅ Geanalyseerd' : '⏳ Nog niet geanalyseerd'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {selectedSession && (
                <Card>
                  <CardHeader>
                    <CardTitle>Sessie: {selectedSession.session_name}</CardTitle>
                    <CardDescription>
                      Analyseer de test resultaten en genereer verbeteringen
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isLoadingFeedback ? (
                      <div className="text-center py-4">
                        <div className="w-6 h-6 border-2 border-maitje-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Feedback laden...</p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <h5 className="font-semibold mb-3">Test Data Overview:</h5>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2">
                              Test uitgevoerd op: {new Date(selectedSession.created_at).toLocaleDateString('nl-NL')}
                            </p>
                            <p className="text-sm text-gray-600">
                              Programma data: {selectedSession.test_program_data?.length || 0} dagen gegenereerd
                            </p>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-semibold mb-3">Aanvullende Feedback:</h5>
                          <Textarea
                            value={userFeedback}
                            onChange={(e) => setUserFeedback(e.target.value)}
                            placeholder="Voeg hier je observaties toe over de gegenereerde test data..."
                            className="min-h-[100px]"
                          />
                        </div>

                        <Button
                          onClick={analyzeWithAI}
                          disabled={isAnalyzing}
                          className="w-full"
                        >
                          {isAnalyzing ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              AI analyseren...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              Analyseer met AI
                            </div>
                          )}
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}

              {aiAnalysis && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-800">🤖 AI Analyse Resultaten</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white p-4 rounded-lg">
                      <h5 className="font-semibold mb-3">Analyse:</h5>
                      <pre className="whitespace-pre-wrap text-sm">{aiAnalysis.analysis}</pre>
                    </div>

                    {aiAnalysis.improvements && (
                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-semibold mb-3">Verbeteringen:</h5>
                        <pre className="whitespace-pre-wrap text-sm">{aiAnalysis.improvements}</pre>
                      </div>
                    )}

                    {aiAnalysis.newPrompt && (
                      <div className="bg-white p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold">Nieuwe Prompt:</h5>
                          <Button onClick={createPromptFromAnalysis} size="sm">
                            <Save className="w-4 h-4 mr-2" />
                            Opslaan als Nieuwe Versie
                          </Button>
                        </div>
                        <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded border max-h-60 overflow-y-auto">
                          {aiAnalysis.newPrompt}
                        </pre>
                      </div>
                    )}
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

export default FeedbackAnalysis;
