
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, FileText } from 'lucide-react';
import { PromptVersion } from '@/types/database';

interface PromptEditorProps {
  promptVersions: PromptVersion[] | null;
  currentPrompt: string;
  setCurrentPrompt: (prompt: string) => void;
  selectedVersion: string | null;
  setSelectedVersion: (version: string | null) => void;
  activePrompt: PromptVersion | null;
  onSaveNewVersion: (description: string) => Promise<void>;
  onActivateVersion: (versionId: string) => Promise<void>;
}

const PromptEditor = ({
  promptVersions,
  currentPrompt,
  setCurrentPrompt,
  selectedVersion,
  setSelectedVersion,
  activePrompt,
  onSaveNewVersion,
  onActivateVersion
}: PromptEditorProps) => {
  const [newVersionDescription, setNewVersionDescription] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleSaveNewVersion = async () => {
    await onSaveNewVersion(newVersionDescription);
    setNewVersionDescription('');
    setShowSaveDialog(false);
  };

  return (
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
              onClick={() => onActivateVersion(selectedVersion)}
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
  );
};

export default PromptEditor;
