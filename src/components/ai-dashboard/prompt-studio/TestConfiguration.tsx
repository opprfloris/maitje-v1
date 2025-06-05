
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play } from 'lucide-react';

interface TestSettings {
  module: string;
  niveau: string;
  thema?: string;
  aantal_items: number;
}

interface TestConfigurationProps {
  testSettings: TestSettings;
  setTestSettings: (settings: TestSettings) => void;
  onRunTest: () => Promise<void>;
  isGenerating: boolean;
}

const TestConfiguration = ({
  testSettings,
  setTestSettings,
  onRunTest,
  isGenerating
}: TestConfigurationProps) => {
  return (
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
          onClick={onRunTest}
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
  );
};

export default TestConfiguration;
