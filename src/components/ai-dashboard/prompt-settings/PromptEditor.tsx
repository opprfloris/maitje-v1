
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { PromptVersion } from '@/types/database';
import { toast } from 'sonner';
import { Save, FileText, Info, RotateCcw, Copy } from 'lucide-react';

interface PromptEditorProps {
  activePrompt: PromptVersion | null;
  onCreateNewVersion: (versionName: string, content: string) => Promise<void>;
  onReloadVersions: () => Promise<void>;
}

// Default v0.0 baseline prompt
const DEFAULT_PROMPT = `Je bent een ervaren basisschool docent die gespecialiseerd is in het maken van educatieve weekprogramma's voor Nederlandse basisscholen.

CONTEXT:
- Je maakt programma's voor kinderen van 6-12 jaar (groep 3-8)
- Het Nederlandse curriculum volgt de kerndoelen voor basisonderwijs
- Focus op rekenen, begrijpend lezen, en Engels als hoofdvakken
- Activiteiten moeten leeftijdsgeschikt en uitdagend zijn

INSTRUCTIES:
1. Maak een gevarieerd weekprogramma met verschillende activiteiten per dag
2. Balanceer verschillende vakgebieden en moeilijkheidsniveaus
3. Zorg voor duidelijke instructies en verwachte uitkomsten
4. Gebruik Nederlandse educatieve terminologie
5. Maak activiteiten interactief en motiverend

FORMAAT:
Geef antwoord in geldige JSON format met deze structuur:
{
  "week": [
    {
      "dag": "maandag",
      "activiteiten": [
        {
          "vak": "rekenen",
          "titel": "Titel van de activiteit",
          "beschrijving": "Gedetailleerde beschrijving",
          "duur": "30 minuten",
          "niveau": "groep 5"
        }
      ]
    }
  ]
}

KWALITEITSEISEN:
- Activiteiten moeten educatief waardevol zijn
- Duidelijke leerdobestellingen per activiteit
- Realistische tijdsinschattingen
- Variatie in werkvormen (individueel, groepswerk, klassikaal)`;

const PromptEditor = ({ activePrompt, onCreateNewVersion, onReloadVersions }: PromptEditorProps) => {
  const [promptContent, setPromptContent] = useState('');
  const [versionName, setVersionName] = useState('');
  const [saving, setSaving] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    if (activePrompt) {
      setPromptContent(activePrompt.prompt_content);
      setIsEdited(false);
    } else {
      // Show default prompt if no active prompt exists
      setPromptContent(DEFAULT_PROMPT);
      setIsEdited(false);
    }
  }, [activePrompt]);

  const handleContentChange = (value: string) => {
    setPromptContent(value);
    const baselineContent = activePrompt?.prompt_content || DEFAULT_PROMPT;
    setIsEdited(value !== baselineContent);
  };

  const handleSaveNewVersion = async () => {
    if (!versionName.trim()) {
      toast.error('Voer een versie naam in');
      return;
    }

    if (!promptContent.trim()) {
      toast.error('Prompt content mag niet leeg zijn');
      return;
    }

    setSaving(true);
    try {
      await onCreateNewVersion(versionName, promptContent);
      setVersionName('');
      setIsEdited(false);
      toast.success('Nieuwe prompt versie opgeslagen');
    } catch (error) {
      toast.error('Fout bij opslaan nieuwe versie');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const baselineContent = activePrompt?.prompt_content || DEFAULT_PROMPT;
    setPromptContent(baselineContent);
    setIsEdited(false);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(promptContent);
      toast.success('Prompt gekopieerd naar klembord');
    } catch (error) {
      toast.error('Fout bij kopiëren naar klembord');
    }
  };

  const loadDefaultPrompt = () => {
    setPromptContent(DEFAULT_PROMPT);
    setIsEdited(activePrompt ? DEFAULT_PROMPT !== activePrompt.prompt_content : false);
  };

  return (
    <div className="space-y-6">
      {/* Current Active Prompt Info */}
      <div className="maitje-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-maitje-blue rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-nunito font-bold text-gray-800">
                {activePrompt ? 'Huidige Actieve Prompt' : 'Geen Actieve Prompt'}
              </h3>
              <p className="text-gray-600 text-sm">
                {activePrompt 
                  ? `Versie: ${activePrompt.version_name} - ${new Date(activePrompt.created_at).toLocaleDateString('nl-NL')}`
                  : 'Gebruik de standaard v0.0 baseline prompt'
                }
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={loadDefaultPrompt}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              🏠 v0.0 Baseline
            </Button>
            {activePrompt && (
              <Badge variant="default" className="bg-green-500">
                {activePrompt.version_name}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Prompt Editor */}
      <div className="maitje-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-nunito font-bold text-gray-800">
              Prompt Editor {isEdited && <span className="text-orange-600 text-sm">(Niet opgeslagen)</span>}
            </h3>
            <p className="text-gray-600 text-sm">
              Bewerk je prompt en sla op als nieuwe versie voor testing.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleCopyToClipboard}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Kopieer
            </Button>
            {isEdited && (
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt-content">Prompt Content</Label>
            <Textarea
              id="prompt-content"
              value={promptContent}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Voer je prompt content hier in..."
              rows={20}
              className="font-mono text-sm"
            />
          </div>

          {isEdited && (
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                <Save className="w-4 h-4" />
                Nieuwe Versie Opslaan
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="version-name">Versie Naam</Label>
                  <Input
                    id="version-name"
                    value={versionName}
                    onChange={(e) => setVersionName(e.target.value)}
                    placeholder="v1.1 - Verbeterde context"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleSaveNewVersion}
                    disabled={saving || !versionName.trim() || !promptContent.trim()}
                    className="w-full maitje-button"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Opslaan...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Opslaan als Nieuwe Versie
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-orange-600 mt-2">
                Dit wordt de nieuwe actieve prompt voor alle toekomstige generaties
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="maitje-card border-l-4 border-l-blue-500 bg-blue-50">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">💡 Prompt Ontwikkeling Tips</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Start altijd met de v0.0 baseline prompt als uitgangspunt</li>
              <li>• Test elke wijziging uitgebreid in de Test Sandbox</li>
              <li>• Verzamel feedback voordat je een nieuwe versie activeert</li>
              <li>• Gebruik duidelijke versie namen met beschrijvingen</li>
              <li>• Bewaar de baseline v0.0 altijd als fallback optie</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptEditor;
