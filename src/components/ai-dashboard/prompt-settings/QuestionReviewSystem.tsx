
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThumbsUp, ThumbsDown, Save, CheckCircle } from 'lucide-react';
import { FeedbackSession, QuestionFeedback, WeekProgramDay, WeekProgramQuestion } from '@/types/database';
import { toast } from 'sonner';

interface QuestionReviewSystemProps {
  session: FeedbackSession;
  onSaveFeedback: (feedback: Omit<QuestionFeedback, 'id' | 'created_at'>) => Promise<void>;
  onMarkComplete: (sessionId: string) => Promise<void>;
  existingFeedback: QuestionFeedback[];
}

const QuestionReviewSystem: React.FC<QuestionReviewSystemProps> = ({
  session,
  onSaveFeedback,
  onMarkComplete,
  existingFeedback
}) => {
  const [currentFeedback, setCurrentFeedback] = useState<{[key: string]: Partial<QuestionFeedback>}>({});
  const [activeDay, setActiveDay] = useState<string>('');

  const programData = session.test_program_data as WeekProgramDay[];
  const dayNames = programData.map(day => day.dag);

  useEffect(() => {
    if (dayNames.length > 0 && !activeDay) {
      setActiveDay(dayNames[0]);
    }
  }, [dayNames, activeDay]);

  const getQuestionKey = (dayName: string, exerciseTitle: string, questionIndex: number) => {
    return `${dayName}-${exerciseTitle}-${questionIndex}`;
  };

  const getExistingFeedback = (dayName: string, exerciseTitle: string, questionIndex: number) => {
    return existingFeedback.find(f => 
      f.day_name === dayName && 
      f.exercise_title === exerciseTitle && 
      f.question_order === questionIndex
    );
  };

  const updateQuestionFeedback = (
    dayName: string, 
    exerciseTitle: string, 
    questionIndex: number, 
    question: WeekProgramQuestion,
    updates: Partial<QuestionFeedback>
  ) => {
    const key = getQuestionKey(dayName, exerciseTitle, questionIndex);
    setCurrentFeedback(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        session_id: session.id,
        day_name: dayName,
        exercise_title: exerciseTitle,
        question_text: question.vraag,
        correct_answer: question.antwoord,
        subject_type: programData.find(d => d.dag === dayName)?.oefeningen.find(e => e.titel === exerciseTitle)?.type || 'unknown',
        question_order: questionIndex,
        exercise_type: question.type,
        ...updates
      }
    }));
  };

  const saveQuestionFeedback = async (dayName: string, exerciseTitle: string, questionIndex: number) => {
    const key = getQuestionKey(dayName, exerciseTitle, questionIndex);
    const feedback = currentFeedback[key];
    
    if (!feedback || !feedback.feedback_category) {
      toast.error('Geef minimaal een feedback categorie aan');
      return;
    }

    try {
      await onSaveFeedback(feedback as Omit<QuestionFeedback, 'id' | 'created_at'>);
      toast.success('Feedback opgeslagen');
      
      // Clear from current feedback after saving
      setCurrentFeedback(prev => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
    } catch (error) {
      toast.error('Fout bij opslaan feedback');
    }
  };

  const handleCompleteReview = async () => {
    try {
      await onMarkComplete(session.id);
      toast.success('Feedback review voltooid!');
    } catch (error) {
      toast.error('Fout bij voltooien review');
    }
  };

  const getDifficultyColor = (rating?: string) => {
    switch (rating) {
      case 'too_easy': return 'bg-blue-100 text-blue-800';
      case 'too_hard': return 'bg-red-100 text-red-800';
      case 'just_right': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getClarityColor = (rating?: string) => {
    switch (rating) {
      case 'clear': return 'bg-green-100 text-green-800';
      case 'somewhat_clear': return 'bg-yellow-100 text-yellow-800';
      case 'unclear': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (!programData || programData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Geen programma data beschikbaar voor review</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Question Review voor {session.session_name}</h3>
        <Button onClick={handleCompleteReview} className="bg-green-600 hover:bg-green-700">
          <CheckCircle className="w-4 h-4 mr-2" />
          Review Voltooien
        </Button>
      </div>

      <Tabs value={activeDay} onValueChange={setActiveDay}>
        <TabsList className="grid w-full grid-cols-5">
          {dayNames.map((day) => (
            <TabsTrigger key={day} value={day} className="text-sm">
              {day}
            </TabsTrigger>
          ))}
        </TabsList>

        {dayNames.map((dayName) => {
          const dayData = programData.find(d => d.dag === dayName);
          if (!dayData) return null;

          return (
            <TabsContent key={dayName} value={dayName} className="space-y-4">
              {dayData.oefeningen.map((exercise, exerciseIndex) => (
                <Card key={exerciseIndex}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {exercise.titel} ({exercise.type})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {exercise.vragen.map((question, questionIndex) => {
                      const questionKey = getQuestionKey(dayName, exercise.titel, questionIndex);
                      const existing = getExistingFeedback(dayName, exercise.titel, questionIndex);
                      const current = currentFeedback[questionKey] || {};
                      const isCompleted = !!existing;

                      return (
                        <div key={questionIndex} className={`border rounded-lg p-4 ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                          <div className="space-y-3">
                            <div>
                              <p className="font-medium">Vraag {questionIndex + 1}:</p>
                              <p className="text-gray-700">{question.vraag}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                <strong>Correct antwoord:</strong> {question.antwoord}
                              </p>
                            </div>

                            {isCompleted ? (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <span className="text-sm font-medium text-green-700">Feedback gegeven</span>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                  {existing.thumbs_rating && (
                                    <Badge variant="outline">
                                      {existing.thumbs_rating === 1 ? '👍' : '👎'}
                                    </Badge>
                                  )}
                                  {existing.difficulty_rating && (
                                    <Badge className={getDifficultyColor(existing.difficulty_rating)}>
                                      {existing.difficulty_rating}
                                    </Badge>
                                  )}
                                  {existing.clarity_rating && (
                                    <Badge className={getClarityColor(existing.clarity_rating)}>
                                      {existing.clarity_rating}
                                    </Badge>
                                  )}
                                  {existing.feedback_category && (
                                    <Badge variant="secondary">
                                      {existing.feedback_category}
                                    </Badge>
                                  )}
                                </div>
                                {existing.user_feedback && (
                                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                    {existing.user_feedback}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant={current.thumbs_rating === 1 ? 'default' : 'outline'}
                                    onClick={() => updateQuestionFeedback(dayName, exercise.titel, questionIndex, question, { thumbs_rating: 1 })}
                                  >
                                    <ThumbsUp className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={current.thumbs_rating === -1 ? 'default' : 'outline'}
                                    onClick={() => updateQuestionFeedback(dayName, exercise.titel, questionIndex, question, { thumbs_rating: -1 })}
                                  >
                                    <ThumbsDown className="w-4 h-4" />
                                  </Button>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-sm font-medium">Moeilijkheid:</label>
                                    <div className="flex gap-1 mt-1">
                                      {['too_easy', 'just_right', 'too_hard'].map((rating) => (
                                        <Button
                                          key={rating}
                                          size="sm"
                                          variant={current.difficulty_rating === rating ? 'default' : 'outline'}
                                          onClick={() => updateQuestionFeedback(dayName, exercise.titel, questionIndex, question, { difficulty_rating: rating as any })}
                                          className="text-xs"
                                        >
                                          {rating === 'too_easy' ? 'Te makkelijk' : rating === 'just_right' ? 'Goed' : 'Te moeilijk'}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium">Duidelijkheid:</label>
                                    <div className="flex gap-1 mt-1">
                                      {['clear', 'somewhat_clear', 'unclear'].map((rating) => (
                                        <Button
                                          key={rating}
                                          size="sm"
                                          variant={current.clarity_rating === rating ? 'default' : 'outline'}
                                          onClick={() => updateQuestionFeedback(dayName, exercise.titel, questionIndex, question, { clarity_rating: rating as any })}
                                          className="text-xs"
                                        >
                                          {rating === 'clear' ? 'Duidelijk' : rating === 'somewhat_clear' ? 'Redelijk' : 'Onduidelijk'}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-sm font-medium">Categorie:</label>
                                  <div className="flex gap-1 mt-1 flex-wrap">
                                    {['good', 'incorrect', 'unclear', 'too_easy', 'too_hard'].map((category) => (
                                      <Button
                                        key={category}
                                        size="sm"
                                        variant={current.feedback_category === category ? 'default' : 'outline'}
                                        onClick={() => updateQuestionFeedback(dayName, exercise.titel, questionIndex, question, { feedback_category: category as any })}
                                        className="text-xs"
                                      >
                                        {category === 'good' ? 'Goed' : 
                                         category === 'incorrect' ? 'Fout' :
                                         category === 'unclear' ? 'Onduidelijk' :
                                         category === 'too_easy' ? 'Te makkelijk' : 'Te moeilijk'}
                                      </Button>
                                    ))}
                                  </div>
                                </div>

                                <Textarea
                                  placeholder="Aanvullende feedback (optioneel)..."
                                  value={current.user_feedback || ''}
                                  onChange={(e) => updateQuestionFeedback(dayName, exercise.titel, questionIndex, question, { user_feedback: e.target.value })}
                                  className="min-h-[60px]"
                                />

                                <Button
                                  onClick={() => saveQuestionFeedback(dayName, exercise.titel, questionIndex)}
                                  disabled={!current.feedback_category}
                                  size="sm"
                                >
                                  <Save className="w-4 h-4 mr-2" />
                                  Feedback Opslaan
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default QuestionReviewSystem;
