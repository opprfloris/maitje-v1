
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Save, Star, MessageSquare } from 'lucide-react';

interface ExerciseFeedback {
  relevance_rating?: string;
  correctness_rating?: string;
  difficulty_rating?: string;
  clarity_rating?: string;
  quality_stars?: number;
  exercise_notes?: string;
}

interface Feedback {
  exercises: { [key: number]: ExerciseFeedback };
  overall_satisfaction?: string;
  general_comments?: string;
}

interface ExerciseReviewProps {
  generatedContent: any[];
  feedback: Feedback;
  setFeedback: (feedback: Feedback) => void;
  onSaveFeedback: () => Promise<void>;
  isSavingFeedback: boolean;
}

const ExerciseReview = ({
  generatedContent,
  feedback,
  setFeedback,
  onSaveFeedback,
  isSavingFeedback
}: ExerciseReviewProps) => {
  const renderStarRating = (rating: number, onChange: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`p-1 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
          >
            <Star className="w-4 h-4 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  if (!generatedContent || generatedContent.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Resultaten & Beoordeling
        </CardTitle>
        <CardDescription>
          Beoordeel de gegenereerde oefeningen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Gegenereerde Oefeningen */}
        <div className="space-y-4">
          {generatedContent.map((exercise: any, index: number) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="font-medium">Vraag {index + 1}</div>
              <div className="text-sm text-gray-600 whitespace-pre-wrap">
                {exercise.question}
              </div>
              <div className="text-sm">
                <strong>Antwoord:</strong> {exercise.answer}
              </div>

              <Separator />

              {/* Beoordeling per vraag */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <Label>Relevantie</Label>
                  <Select 
                    value={feedback.exercises[index]?.relevance_rating || ''} 
                    onValueChange={(value) => {
                      const newFeedback = { ...feedback };
                      if (!newFeedback.exercises[index]) newFeedback.exercises[index] = {};
                      newFeedback.exercises[index].relevance_rating = value;
                      setFeedback(newFeedback);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="good">Goed</SelectItem>
                      <SelectItem value="doubt">Twijfel</SelectItem>
                      <SelectItem value="bad">Slecht</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Correctheid</Label>
                  <Select 
                    value={feedback.exercises[index]?.correctness_rating || ''} 
                    onValueChange={(value) => {
                      const newFeedback = { ...feedback };
                      if (!newFeedback.exercises[index]) newFeedback.exercises[index] = {};
                      newFeedback.exercises[index].correctness_rating = value;
                      setFeedback(newFeedback);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="correct">Correct</SelectItem>
                      <SelectItem value="uncertain">Onzeker</SelectItem>
                      <SelectItem value="incorrect">Incorrect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Moeilijkheid</Label>
                  <Select 
                    value={feedback.exercises[index]?.difficulty_rating || ''} 
                    onValueChange={(value) => {
                      const newFeedback = { ...feedback };
                      if (!newFeedback.exercises[index]) newFeedback.exercises[index] = {};
                      newFeedback.exercises[index].difficulty_rating = value;
                      setFeedback(newFeedback);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="too_easy">Te Makkelijk</SelectItem>
                      <SelectItem value="good">Goed</SelectItem>
                      <SelectItem value="too_hard">Te Moeilijk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Duidelijkheid</Label>
                  <Select 
                    value={feedback.exercises[index]?.clarity_rating || ''} 
                    onValueChange={(value) => {
                      const newFeedback = { ...feedback };
                      if (!newFeedback.exercises[index]) newFeedback.exercises[index] = {};
                      newFeedback.exercises[index].clarity_rating = value;
                      setFeedback(newFeedback);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clear">Duidelijk</SelectItem>
                      <SelectItem value="unclear">Onduidelijk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Kwaliteit (1-5 sterren)</Label>
                {renderStarRating(
                  feedback.exercises[index]?.quality_stars || 0,
                  (rating) => {
                    const newFeedback = { ...feedback };
                    if (!newFeedback.exercises[index]) newFeedback.exercises[index] = {};
                    newFeedback.exercises[index].quality_stars = rating;
                    setFeedback(newFeedback);
                  }
                )}
              </div>

              <div className="space-y-2">
                <Label>Opmerking</Label>
                <Textarea
                  value={feedback.exercises[index]?.exercise_notes || ''}
                  onChange={(e) => {
                    const newFeedback = { ...feedback };
                    if (!newFeedback.exercises[index]) newFeedback.exercises[index] = {};
                    newFeedback.exercises[index].exercise_notes = e.target.value;
                    setFeedback(newFeedback);
                  }}
                  placeholder="Korte opmerking over deze vraag..."
                  className="min-h-[60px]"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Algemene Beoordeling */}
        <Separator />
        <div className="space-y-4">
          <h4 className="font-medium">Algemene Beoordeling</h4>
          
          <div className="space-y-2">
            <Label>Voldoet deze set aan verwachting?</Label>
            <Select 
              value={feedback.overall_satisfaction || ''} 
              onValueChange={(value) => setFeedback({...feedback, overall_satisfaction: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecteer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Ja</SelectItem>
                <SelectItem value="partial">Gedeeltelijk</SelectItem>
                <SelectItem value="no">Nee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Algemene Opmerkingen</Label>
            <Textarea
              value={feedback.general_comments || ''}
              onChange={(e) => setFeedback({...feedback, general_comments: e.target.value})}
              placeholder="Algemene feedback over de testresultaten..."
              className="min-h-[80px]"
            />
          </div>

          <Button 
            onClick={onSaveFeedback}
            className="w-full"
            disabled={isSavingFeedback}
          >
            {isSavingFeedback ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Opslaan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Sla Beoordeling Op
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseReview;
