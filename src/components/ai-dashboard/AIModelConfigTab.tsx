
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Brain, Key, Shield, Zap } from 'lucide-react';

const AIModelConfigTab = () => {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [contentFilter, setContentFilter] = useState('medium');
  const [language, setLanguage] = useState('nl');
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserConfig();
    }
  }, [user]);

  const loadUserConfig = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_ai_config')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user config:', error);
        return;
      }

      if (data) {
        setSelectedModel(data.selected_model || 'gpt-4o-mini');
        setContentFilter(data.content_filter || 'medium');
        setLanguage(data.language || 'nl');
        // Note: API key is encrypted, so we don't load it
      }
    } catch (error) {
      console.error('Error loading user config:', error);
    }
  };

  const saveConfiguration = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_ai_config')
        .upsert({
          user_id: user.id,
          selected_model: selectedModel,
          content_filter: contentFilter,
          language: language,
          api_key_encrypted: apiKey ? btoa(apiKey) : undefined,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving config:', error);
        toast.error('Fout bij opslaan configuratie');
        return;
      }

      toast.success('AI configuratie opgeslagen');
      setApiKey(''); // Clear the API key input for security
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Fout bij opslaan configuratie');
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    if (!apiKey && !selectedModel) {
      toast.error('Voer eerst een API key en model in');
      return;
    }

    setTestingConnection(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-openai-connection', {
        body: { 
          api_key: apiKey,
          model: selectedModel
        }
      });

      if (error) {
        console.error('Connection test failed:', error);
        toast.error('Verbinding mislukt: ' + error.message);
        return;
      }

      if (data.success) {
        toast.success('Verbinding succesvol! AI model werkt correct.');
      } else {
        toast.error('Verbinding mislukt: ' + data.error);
      }
    } catch (error) {
      console.error('Connection test error:', error);
      toast.error('Fout bij testen verbinding');
    } finally {
      setTestingConnection(false);
    }
  };

  const modelOptions = [
    { value: 'gpt-4o-mini', label: 'GPT-4O Mini', description: 'Snel en kosteneffectief', badge: 'Aanbevolen' },
    { value: 'gpt-4o', label: 'GPT-4O', description: 'Krachtig en accuraat', badge: 'Premium' },
    { value: 'gpt-4.5-preview', label: 'GPT-4.5 Preview', description: 'Nieuwste functies', badge: 'Experimental' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-maitje-blue" />
            AI Model Configuratie
          </CardTitle>
          <CardDescription>
            Configureer je OpenAI API verbinding en model instellingen voor optimale prestaties.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* API Key Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-maitje-blue" />
              <Label className="text-base font-semibold">OpenAI API Key</Label>
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono"
              />
              <p className="text-sm text-gray-600">
                Je API key wordt versleuteld opgeslagen. Verkrijg een key via{' '}
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-maitje-blue hover:underline">
                  OpenAI Dashboard
                </a>
              </p>
            </div>
          </div>

          <Separator />

          {/* Model Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-maitje-blue" />
              <Label className="text-base font-semibold">AI Model</Label>
            </div>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue placeholder="Selecteer een model" />
              </SelectTrigger>
              <SelectContent>
                {modelOptions.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="font-medium">{model.label}</div>
                        <div className="text-sm text-gray-600">{model.description}</div>
                      </div>
                      <Badge variant={model.badge === 'Aanbevolen' ? 'default' : 'secondary'}>
                        {model.badge}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Content Filter */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-maitje-blue" />
              <Label className="text-base font-semibold">Content Filter</Label>
            </div>
            <Select value={contentFilter} onValueChange={setContentFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Laag - Minimale filtering</SelectItem>
                <SelectItem value="medium">Medium - Standaard filtering</SelectItem>
                <SelectItem value="high">Hoog - Strenge filtering</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Language */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Taal</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nl">Nederlands</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              onClick={testConnection} 
              variant="outline"
              disabled={testingConnection}
              className="flex items-center gap-2"
            >
              {testingConnection ? (
                <div className="w-4 h-4 border-2 border-maitje-blue border-t-transparent rounded-full animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              Test Verbinding
            </Button>
            <Button 
              onClick={saveConfiguration}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Key className="w-4 h-4" />
              )}
              Configuratie Opslaan
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Model Performance Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-maitje-blue">GPT-4O Mini</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Beste prijs/prestatie verhouding</li>
                <li>• Geschikt voor meeste educatieve content</li>
                <li>• Snelle response tijden</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-maitje-blue">GPT-4O</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Hoogste kwaliteit output</li>
                <li>• Complexe redeneertaken</li>
                <li>• Uitgebreide context begrip</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIModelConfigTab;
