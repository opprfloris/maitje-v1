
import React, { useState } from 'react';
import { Settings, Sliders, Brain, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

const AIModelConfigTab = () => {
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([2048]);
  const [topP, setTopP] = useState([0.9]);
  const [model, setModel] = useState('gpt-4o-mini');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate saving to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('AI model configuratie opgeslagen');
    } catch (error) {
      toast.error('Fout bij opslaan configuratie');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-maitje-blue rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-nunito font-bold text-gray-800">AI Model Configuratie</h2>
            <p className="text-gray-600">Pas de AI model parameters aan voor optimale prestaties</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold text-gray-700">Model Selectie</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="gpt-4o-mini"
                    name="model"
                    value="gpt-4o-mini"
                    checked={model === 'gpt-4o-mini'}
                    onChange={(e) => setModel(e.target.value)}
                    className="text-maitje-blue"
                  />
                  <label htmlFor="gpt-4o-mini" className="flex items-center gap-2">
                    GPT-4o Mini
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Snel & Goedkoop</Badge>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="gpt-4o"
                    name="model"
                    value="gpt-4o"
                    checked={model === 'gpt-4o'}
                    onChange={(e) => setModel(e.target.value)}
                    className="text-maitje-blue"
                  />
                  <label htmlFor="gpt-4o" className="flex items-center gap-2">
                    GPT-4o
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">Krachtig</Badge>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Temperature: {temperature[0]}
              </Label>
              <Slider
                value={temperature}
                onValueChange={setTemperature}
                max={2}
                min={0}
                step={0.1}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Controleert creativiteit (0 = deterministisch, 2 = zeer creatief)
              </p>
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Max Tokens: {maxTokens[0]}
              </Label>
              <Slider
                value={maxTokens}
                onValueChange={setMaxTokens}
                max={4096}
                min={256}
                step={256}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum aantal tokens in het antwoord
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Top P: {topP[0]}
              </Label>
              <Slider
                value={topP}
                onValueChange={setTopP}
                max={1}
                min={0}
                step={0.1}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Nucleus sampling parameter
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Huidige Configuratie
              </h4>
              <div className="space-y-1 text-sm text-blue-700">
                <p><strong>Model:</strong> {model}</p>
                <p><strong>Temperature:</strong> {temperature[0]}</p>
                <p><strong>Max Tokens:</strong> {maxTokens[0]}</p>
                <p><strong>Top P:</strong> {topP[0]}</p>
              </div>
            </div>

            <Button 
              onClick={handleSave}
              disabled={saving}
              className="w-full maitje-button"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Opslaan...
                </>
              ) : (
                <>
                  <Settings className="w-4 h-4 mr-2" />
                  Configuratie Opslaan
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="maitje-card">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-maitje-green" />
          Aanbevolen Instellingen
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">📚 Educatieve Content</h4>
            <p className="text-sm text-green-700 mb-3">Voor lesprogramma's en educatief materiaal</p>
            <div className="space-y-1 text-xs text-green-600">
              <p>• Temperature: 0.3 (consistent)</p>
              <p>• Max Tokens: 2048</p>
              <p>• Top P: 0.8</p>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">🎨 Creatieve Content</h4>
            <p className="text-sm text-purple-700 mb-3">Voor verhalen en creatieve opdrachten</p>
            <div className="space-y-1 text-xs text-purple-600">
              <p>• Temperature: 0.8 (creatief)</p>
              <p>• Max Tokens: 3072</p>
              <p>• Top P: 0.9</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModelConfigTab;
