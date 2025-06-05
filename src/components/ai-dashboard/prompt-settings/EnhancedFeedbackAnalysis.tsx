
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Brain, MessageSquare, ArrowLeft, BarChart3 } from 'lucide-react';
import { FeedbackSession, PromptVersion, QuestionFeedback } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SessionDetailEditor from './SessionDetailEditor';
import QuestionReviewSystem from './QuestionReviewSystem';
import { useFeedbackSessions } from '@/hooks/useFeedbackSessions';

interface EnhancedFeedbackAnalysisProps {
  promptVersions: PromptVersion[];
  onCreateNewVersion: (versionName: string, content: string) => Promise<void>;
}

const EnhancedFeedbackAnalysis: React.FC<EnhancedFeedbackAnalysisProps> = ({
  promptVersions,
  onCreateNewVersion
}) => {
  const { user } = useAuth();
  const {
    feedbackSessions,
    loading,
    loadFeedbackSessions,
    updateSessionNotes,
    saveQuestionFeedback,
    getSessionFeedback,
    markSessionComplete
  } = useFeedbackSessions();

  const [selectedSession, setSelectedSession] = useState<FeedbackSession | null>(null);
  const [sessionFeedback, setSessionFeedback] = useState<QuestionFeedback[]>([]);
  const [activeView, setActiveView] = useState<'overview' | 'detail' | 'review' | 'analysis'>('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  useEffect(() => {
    if (selectedSession) {
      loadSessionFeedback();
    }
  }, [selectedSession]);

  const loadSessionFeedback = async () => {
    if (!selectedSession) return;
    
    try {
      const feedback = await getSessionFeedback(selectedSession.id);
      setSessionFeedback(feedback);
      
      if (selectedSession.ai_analysis) {
        try {
          setAiAnalysis(JSON.parse(selectedSession.ai_analysis));
        } catch {
          setAiAnalysis(null);
        }
      }
    } catch (error) {
      console.error('Error loading session feedback:', error);
    }
  };

  const handleSessionSelect = (session: FeedbackSession) => {
    setSelectedSession(session);
    setActiveView('detail');
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
          userFeedback: selectedSession.user_notes || '',
          currentPrompt: promptVersion.prompt_content
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Analyse mislukt');

      setAiAnalysis(data.analysis);
      await loadFeedbackSessions();
      toast.success('AI analyse voltooid');
    } catch (error) {
      console.error('Error analyzing feedback:', error);
      toast.error(`Fout bij AI analyse: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const createPromptFromAnalysis = async () => {
    if (!aiAnalysis?.newPrompt || !selectedSession) {
      toast.error('Geen nieuwe prompt beschikbaar in analyse');
      return;
    }

    const versionName = `Verbeterd o.b.v. ${selectedSession.session_name} - ${new Date().toLocaleDateString('nl-NL')}`;
    await onCreateNewVersion(versionName, aiAnalysis.newPrompt);
  };

  const getSessionStats = (session: FeedbackSession) => {
    const feedback = sessionFeedback.filter(f => f.session_id === session.id);
    const totalQuestions = session.test_program_data.reduce((sum: number, day: any) => 
      sum + (day.oefeningen?.reduce((daySum: number, ex: any) => daySum + (ex.vragen?.length || 0), 0) || 0), 0
    );
    
    return {
      totalQuestions,
      reviewedQuestions: feedback.length,
      progress: totalQuestions > 0 ? Math.round((feedback.length / totalQuestions) * 100) : 0
    };
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-6 h-6 border-2 border-maitje-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Sessies laden...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-maitje-blue" />
              <div>
                <CardTitle>Enhanced Feedback Analysis</CardTitle>
                <CardDescription>
                  Volledig feedback systeem voor weekprogramma analyse en prompt verbetering
                </CardDescription>
              </div>
            </div>
            {selectedSession && activeView !== 'overview' && (
              <Button
                variant="outline"
                onClick={() => {
                  setActiveView('overview');
                  setSelectedSession(null);
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug naar Overzicht
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {activeView === 'overview' && (
            <div className="space-y-6">
              {feedbackSessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Geen test sessies gevonden.</p>
                  <p className="text-sm">Maak eerst een test in de Test Sandbox.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-semibold">Test Sessies ({feedbackSessions.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {feedbackSessions.map((session) => {
                      const stats = getSessionStats(session);
                      return (
                        <Card 
                          key={session.id}
                          className="cursor-pointer transition-all hover:shadow-md hover:border-maitje-blue"
                          onClick={() => handleSessionSelect(session)}
                        >
                          <CardContent className="pt-4">
                            <div className="space-y-3">
                              <h5 className="font-semibold">{session.session_name}</h5>
                              <p className="text-sm text-gray-600">
                                {new Date(session.created_at).toLocaleDateString('nl-NL', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              
                              <div className="flex flex-wrap gap-1">
                                <Badge variant={session.status === 'analyzed' ? 'default' : 'secondary'}>
                                  {session.status === 'analyzed' ? '✅ Geanalyseerd' : 
                                   session.status === 'completed' ? '📝 Voltooid' : '⏳ In uitvoering'}
                                </Badge>
                                {session.feedback_completed && (
                                  <Badge variant="outline" className="bg-green-50 text-green-700">
                                    Review ✓
                                  </Badge>
                                )}
                              </div>

                              <div className="text-xs text-gray-500">
                                <div className="flex justify-between">
                                  <span>Review progress:</span>
                                  <span>{stats.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                  <div 
                                    className="bg-maitje-blue h-1.5 rounded-full transition-all"
                                    style={{ width: `${stats.progress}%` }}
                                  ></div>
                                </div>
                                <div className="mt-1">
                                  {stats.reviewedQuestions}/{stats.totalQuestions} vragen beoordeeld
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedSession && activeView !== 'overview' && (
            <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="detail">📋 Sessie Details</TabsTrigger>
                <TabsTrigger value="review">⭐ Question Review</TabsTrigger>
                <TabsTrigger value="analysis">🤖 AI Analyse</TabsTrigger>
              </TabsList>

              <TabsContent value="detail" className="mt-6">
                <SessionDetailEditor
                  session={selectedSession}
                  promptVersion={promptVersions.find(p => p.id === selectedSession.prompt_version_id) || null}
                  onUpdateNotes={updateSessionNotes}
                />
              </TabsContent>

              <TabsContent value="review" className="mt-6">
                <QuestionReviewSystem
                  session={selectedSession}
                  onSaveFeedback={saveQuestionFeedback}
                  onMarkComplete={markSessionComplete}
                  existingFeedback={sessionFeedback}
                />
              </TabsContent>

              <TabsContent value="analysis" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Analyse en Prompt Verbetering</CardTitle>
                      <CardDescription>
                        Laat AI alle feedback analyseren en krijg concrete verbeteringen voor je prompt
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                            <BarChart3 className="w-4 h-4" />
                            🔍 Start AI Analyse
                          </div>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {aiAnalysis && (
                    <Card className="border-green-200 bg-green-50">
                      <CardHeader>
                        <CardTitle className="text-green-800">🤖 AI Analyse Resultaten</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-white p-4 rounded-lg">
                          <h5 className="font-semibold mb-3">Samenvatting Analyse:</h5>
                          <pre className="whitespace-pre-wrap text-sm">{aiAnalysis.analysis}</pre>
                        </div>

                        {aiAnalysis.improvements && (
                          <div className="bg-white p-4 rounded-lg">
                            <h5 className="font-semibold mb-3">Concrete Verbeteringen:</h5>
                            <pre className="whitespace-pre-wrap text-sm">{aiAnalysis.improvements}</pre>
                          </div>
                        )}

                        {aiAnalysis.newPrompt && (
                          <div className="bg-white p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-semibold">Verbeterde Prompt:</h5>
                              <Button onClick={createPromptFromAnalysis} size="sm">
                                💾 Opslaan als Nieuwe Versie
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
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedFeedbackAnalysis;
