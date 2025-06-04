
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Save, Eye, Copy, RotateCcw } from 'lucide-react';
import { PromptVersion } from '@/types/database';
import { toast } from 'sonner';

interface PromptEditorProps {
  activePrompt: PromptVersion | null;
  onCreateNewVersion: (versionName: string, content: string) => void;
  onReloadVersions: () => void;
}

const PromptEditor: React.FC<PromptEditorProps> = ({
  activePrompt,
  onCreateNewVersion,
  onReloadVersions
}) => {
  const [editedContent, setEditedContent] = useState(activePrompt?.prompt_content || '');
  const [versionName, setVersionName] = useState('');
  const [isEdited, setIsEdited] = useState(false);

  React.useEffect(() => {
    if (activePrompt) {
      setEditedContent(activePrompt.prompt_content);
      setIsEdited(false);
    }
  }, [activePrompt]);

  const handleContentChange = (value: string) => {
    setEditedContent(value);
    setIsEdited(value !== activePrompt?.prompt_content);
  };

  const handleSaveNewVersion = () => {
    if (!versionName.trim()) {
      toast.error('Voer een versie naam in');
      return;
    }

    if (!editedContent.trim()) {
      toast.error('Prompt content kan niet leeg zijn');
      return;
    }

    onCreateNewVersion(versionName, editedContent);
    setVersionName('');
    setIsEdited(false);
  };

  const handleReset = () => {
    if (activePrompt) {
      setEditedContent(activePrompt.prompt_content);
      setIsEdited(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editedContent);
      toast.success('Prompt gekopieerd naar klembord');
    } catch (error) {
      toast.error('Fout bij kopiëren naar klembord');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📝 Prompt Editor
            {isEdited && <span className="text-orange-600 text-sm">(Wijzigingen niet opgeslagen)</span>}
          </CardTitle>
          <CardDescription>
            Bewerk de AI prompt die gebruikt wordt voor het genereren van weekprogramma's. 
            Maak een nieuwe versie om wijzigingen op te slaan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Huidige versie: <span className="font-semibold">{activePrompt?.version_name || 'Geen actieve prompt'}</span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
              >
                <Copy className="w-4 h-4 mr-2" />
                Kopieer
              </Button>
              {isEdited && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          <Textarea
            value={editedContent}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Voer hier je AI prompt in..."
            className="min-h-[400px] font-mono text-sm"
          />

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Tips voor een goede prompt:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Gebruik duidelijke instructies en voorbeelden</li>
              <li>• Specificeer het gewenste format (JSON)</li>
              <li>• Geef context over de doelgroep (groep nummer)</li>
              <li>• Voeg tijdsrichtlijnen toe voor realistische planning</li>
              <li>• Specificeer moeilijkheidsgraad per onderwerp</li>
            </ul>
          </div>

          {isEdited && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-orange-800 mb-3">Nieuwe versie opslaan</h4>
                <div className="flex gap-3">
                  <Input
                    value={versionName}
                    onChange={(e) => setVersionName(e.target.value)}
                    placeholder="Versie naam (bijv. 'Verbeterde vragen v2.1')"
                    className="flex-1"
                  />
                  <Button onClick={handleSaveNewVersion}>
                    <Save className="w-4 h-4 mr-2" />
                    Opslaan
                  </Button>
                </div>
                <p className="text-xs text-orange-600 mt-2">
                  Dit wordt de nieuwe actieve prompt voor alle toekomstige generaties
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptEditor;
