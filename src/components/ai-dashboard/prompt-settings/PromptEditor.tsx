
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { PromptVersion } from '@/types/database';
import { toast } from 'sonner';
import { Save, FileText, Info } from 'lucide-react';

interface PromptEditorProps {
  activePrompt: PromptVersion | null;
  onCreateNewVersion: (versionName: string, content: string) => Promise<void>;
  onReloadVersions: () => Promise<void>;
}

const PromptEditor = ({ activePrompt, onCreateNewVersion, onReloadVersions }: PromptEditorProps) => {
  const [promptContent, setPromptContent] = useState(activePrompt?.prompt_content || '');
  const [versionName, setVersionName] = useState('');
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (activePrompt) {
      setPromptContent(activePrompt.prompt_content);
    }
  }, [activePrompt]);

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
      toast.success('Nieuwe prompt versie opgeslagen');
    } catch (error) {
      toast.error('Fout bij opslaan nieuwe versie');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Active Prompt Info */}
      {activePrompt && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-maitje-blue" />
                Huidige Actieve Prompt
              </span>
              <Badge variant="default">{activePrompt.version_name}</Badge>
            </CardTitle>
            <CardDescription>
              {activePrompt.description || 'Geen beschrijving beschikbaar'}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Prompt Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Prompt Editor</CardTitle>
          <CardDescription>
            Bewerk je prompt en sla op als nieuwe versie voor testing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt-content">Prompt Content</Label>
            <Textarea
              id="prompt-content"
              value={promptContent}
              onChange={(e) => setPromptContent(e.target.value)}
              placeholder="Voer je prompt content hier in..."
              rows={12}
              className="font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="version-name">Nieuwe Versie Naam</Label>
              <Input
                id="version-name"
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
                placeholder="v1.1 - Verbeterde context"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSaveNewVersion}
                disabled={saving || !versionName.trim() || !promptContent.trim()}
                className="w-full"
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
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-l-4 border-l-blue-500 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Prompt Ontwikkeling Tips</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Start met de bestaande v0.0 prompt als basis</li>
                <li>• Test elke wijziging in de Test Sandbox</li>
                <li>• Verzamel feedback voordat je een nieuwe versie activeert</li>
                <li>• Gebruik duidelijke versie namen met beschrijvingen</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptEditor;
