
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Save, Play, Star, MessageSquare, FileText, Clock } from 'lucide-react';
import { usePromptVersions } from '@/hooks/usePromptVersions';
import { usePromptStudio } from '@/hooks/usePromptStudio';
import { useToast } from '@/hooks/use-toast';

const PromptStudio = () => {
  const { toast } = useToast();
  const {
    promptVersions,
    activePrompt,
    loading,
    createNewPromptVersion,
    setActivePromptVersion
  } = usePromptVersions();

  const {
    currentPrompt,
    setCurrentPrompt,
    selectedVersion,
    setSelectedVersion,
    testSettings,
    setTestSettings,
    generatedContent,
    isGenerating,
    runMiniTest,
    feedback,
    setFeedback,
    saveFeedback,
    isSavingFeedback
  } = usePromptStudio();

  const [newVersionDescription, setNewVersionDescription] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Load selected version into editor
  useEffect(() => {
    if (selectedVersion && promptVersions) {
      const version = promptVersions.find(v => v.id === selectedVersion);
      if (version) {
        setCurrentPrompt(version.prompt_content);
      }
    }
  }, [selectedVersion, promptVersions, setCurrentPrompt]);

  // Initialize with active prompt
  useEffect(() => {
    if (activePrompt && !selectedVersion) {
      setCurrentPrompt(activePrompt.prompt_content);
      setSelectedVersion(activePrompt.id);
    }
  }, [activePrompt, selectedVersion, setCurrentPrompt, setSelectedVersion]);

  const handleSaveNewVersion = async () => {
    if (!currentPrompt.trim()) {
      toast({
        title: "Fout",
        description: "Prompt mag niet leeg zijn",
        variant: "destructive"
      });
      return;
    }

    try {
      await createNewPromptVersion(currentPrompt, newVersionDescription);
      setNewVersionDescription('');
      setShowSaveDialog(false);
      toast({
        title: "Succes",
        description: "Nieuwe prompt versie opgeslagen"
      });
    } catch (error) {
      toast({
        title: "Fout",
        description: "Kon prompt versie niet opslaan",
        variant: "destructive"
      });
    }
  };

  const handleRunTest = async () => {
    if (!currentPrompt.trim()) {
      toast({
        title: "Fout",
        description: "Prompt mag niet leeg zijn",
        variant: "destructive"
      });
      return;
    }

    if (!testSettings.module || !testSettings.niveau) {
      toast({
        title: "Fout",
        description: "Module en niveau zijn verplicht",
        variant: "destructive"
      });
      return;
    }

    try {
      await runMiniTest(currentPrompt);
    } catch (error) {
      toast({
        title: "Fout",
        description: "Kon test niet uitvoeren",
        variant: "destructive"
      });
    }
  };

  const handleSaveFeedback = async () => {
    try {
      await saveFeedback();
      toast({
        title: "Succes",
        description: "Feedback opgeslagen"
      });
    } catch (error) {
      toast({
        title: "Fout",
        description: "Kon feedback niet opslaan",
        variant: "destructive"
      });
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-maitje-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Prompt Studio laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Linker Paneel: Prompt Editor & Versiebeheer */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Prompt Editor & Versiebeheer
            </CardTitle>
            <CardDescription>
              Bewerk je prompt en beheer versies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Versie Selector */}
            <div className="space-y-2">
              <Label htmlFor="version-select">Laad Versie</Label>
              <Select value={selectedVersion || ''} onValueChange={setSelectedVersion}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer een prompt versie" />
                </SelectTrigger>
                <SelectContent>
                  {promptVersions?.map((version) => (
                    <SelectItem key={version.id} value={version.id}>
                      <div className="flex items-center gap-2">
                        <span>{version.version_name}</span>
                        {version.is_active && (
                          <Badge variant="secondary" className="text-xs">Actief</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Actieve Prompt Indicator */}
            {activePrompt && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">
                    Huidige actieve prompt: {activePrompt.version_name}
                  </span>
                </div>
              </div>
            )}

            {/* Prompt Editor */}
            <div className="space-y-2">
              <Label htmlFor="prompt-editor">Prompt Inhoud</Label>
              <Textarea
                id="prompt-editor"
                value={currentPrompt}
                onChange={(e) => setCurrentPrompt(e.target.value)}
                placeholder="Voer je prompt in..."
                className="min-h-[300px] font-mono text-sm"
              />
            </div>

            {/* Acties */}
            <div className="flex gap-3">
              <Button
                onClick={() => setShowSaveDialog(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Opslaan als Nieuwe Versie
              </Button>
              
              {selectedVersion && (
                <Button
                  onClick={() => setActivePromptVersion(selectedVersion)}
                  variant="default"
                  className="flex items-center gap-2"
                >
                  Activeer deze Versie
                </Button>
              )}
            </div>

            {/* Save Dialog */}
            {showSaveDialog && (
              <Card className="border-2 border-blue-200">
                <CardContent className="pt-4 space-y-3">
                  <Label htmlFor="version-description">Versie Beschrijving (optioneel)</Label>
                  <Input
                    id="version-description"
                    value={newVersionDescription}
                    onChange={(e) => setNewVersionDescription(e.target.value)}
                    placeholder="Beschrijf de wijzigingen..."
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveNewVersion} size="sm">
                      Opslaan
                    </Button>
                    <Button 
                      onClick={() => setShowSaveDialog(false)} 
                      variant="outline" 
                      size="sm"
                    >
                      Annuleren
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Rechter Paneel: Mini-Sandbox & Beoordeling */}
      <div className="space-y-6">
        {/* Test Configuratie */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Mini Test Sandbox
            </CardTitle>
            <CardDescription>
              Test je prompt met specifieke parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Module</Label>
                <Select 
                  value={testSettings.module} 
                  onValueChange={(value) => setTestSettings({...testSettings, module: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kies module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rekenen">Rekenen</SelectItem>
                    <SelectItem value="taal">Taal/Lezen</SelectItem>
                    <SelectItem value="engels">Engels</SelectItem>
                    <SelectItem value="spelling">Spelling</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Kind Niveau</Label>
                <Select 
                  value={testSettings.niveau} 
                  onValueChange={(value) => setTestSettings({...testSettings, niveau: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kies niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="groep3">Groep 3</SelectItem>
                    <SelectItem value="groep4">Groep 4</SelectItem>
                    <SelectItem value="groep5">Groep 5</SelectItem>
                    <SelectItem value="groep6">Groep 6</SelectItem>
                    <SelectItem value="groep7">Groep 7</SelectItem>
                    <SelectItem value="groep8">Groep 8</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Thema (optioneel)</Label>
              <Input
                value={testSettings.thema}
                onChange={(e) => setTestSettings({...testSettings, thema: e.target.value})}
                placeholder="Bijv. dieren, sport, familie..."
              />
            </div>

            <div className="space-y-2">
              <Label>Aantal Items</Label>
              <Select 
                value={testSettings.aantal_items?.toString()} 
                onValueChange={(value) => setTestSettings({...testSettings, aantal_items: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Aantal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleRunTest}
              className="w-full"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Genereren...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Genereer Test Oefening(en)
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Resultaten & Beoordeling */}
        {generatedContent && generatedContent.length > 0 && (
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
                  onClick={handleSaveFeedback}
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
        )}
      </div>
    </div>
  );
};

export default PromptStudio;
