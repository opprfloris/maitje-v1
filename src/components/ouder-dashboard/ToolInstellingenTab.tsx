
import React, { useState, useEffect } from 'react';
import { Settings, Mail, Bug, Shield, HelpCircle, Key, Save, TestTube, CheckCircle, XCircle, Loader } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PrivacyDialog from './PrivacyDialog';
import FAQDialog from './FAQDialog';

const ToolInstellingenTab = () => {
  const { user, profile } = useAuth();
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [apiKey, setApiKey] = useState('');
  const [contentFilter, setContentFilter] = useState('medium');
  const [language, setLanguage] = useState('nl');
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTestingAPI, setIsTestingAPI] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<{status: 'success' | 'error' | null, message: string}>({status: null, message: ''});

  console.log('Tool instellingen tab loaded, user:', user?.email);

  // Load AI config on component mount
  useEffect(() => {
    if (user) {
      loadAIConfig();
    }
  }, [user]);

  const loadAIConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('user_ai_config')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading AI config:', error);
        return;
      }

      if (data) {
        setSelectedModel(data.selected_model || 'gpt-4o-mini');
        setApiKey(data.api_key_encrypted || '');
        setContentFilter(data.content_filter || 'medium');
        setLanguage(data.language || 'nl');
      }
    } catch (error) {
      console.error('Error loading AI config:', error);
    }
  };

  const saveAIConfig = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const configData = {
        user_id: user.id,
        selected_model: selectedModel,
        api_key_encrypted: apiKey,
        content_filter: contentFilter,
        language: language,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_ai_config')
        .upsert(configData);

      if (error) {
        throw error;
      }

      toast.success('AI instellingen opgeslagen');
      setApiTestResult({status: null, message: ''});
    } catch (error) {
      console.error('Error saving AI config:', error);
      toast.error('Fout bij opslaan AI instellingen');
    } finally {
      setIsLoading(false);
    }
  };

  const testOpenAIConnection = async () => {
    if (!apiKey.trim()) {
      toast.error('Voer eerst je OpenAI API key in');
      return;
    }

    setIsTestingAPI(true);
    setApiTestResult({status: null, message: ''});

    try {
      // First save the API key to Supabase secrets
      await saveAIConfig();
      
      // Wait a moment for the config to be saved
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data, error } = await supabase.functions.invoke('test-openai-connection', {
        body: {}
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        setApiTestResult({
          status: 'success', 
          message: `✅ ${data.message}\nTest response: "${data.testResponse}"\nModel: ${data.model}`
        });
        toast.success('OpenAI API test succesvol!');
      } else {
        setApiTestResult({
          status: 'error', 
          message: `❌ ${data.error}\n${data.details || ''}`
        });
        toast.error(`API test gefaald: ${data.error}`);
      }
    } catch (error) {
      console.error('Error testing OpenAI API:', error);
      setApiTestResult({
        status: 'error', 
        message: `❌ Fout bij testen API verbinding: ${error.message}`
      });
      toast.error('Fout bij testen API verbinding');
    } finally {
      setIsTestingAPI(false);
    }
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent('Contact Support - mAItje App');
    const body = encodeURIComponent(`Hallo mAItje support team,\n\nIk heb een vraag over:\n\n\nMijn accountgegevens:\nEmail: ${user?.email}\nDatum: ${new Date().toLocaleDateString('nl-NL')}\n\nMet vriendelijke groet`);
    window.location.href = `mailto:support@maitje.nl?subject=${subject}&body=${body}`;
  };

  const handleBugReport = () => {
    const subject = encodeURIComponent('Bug rapporteren');
    const body = encodeURIComponent(`Hallo mAItje support team,\n\nIk wil een bug rapporteren:\n\nOmschrijving van het probleem:\n\n\nStappen om het probleem te reproduceren:\n1. \n2. \n3. \n\nVerwacht gedrag:\n\n\nWerkelijk gedrag:\n\n\nMijn accountgegevens:\nEmail: ${user?.email}\nDatum: ${new Date().toLocaleDateString('nl-NL')}\nApp versie: 0.1\n\nMet vriendelijke groet`);
    window.location.href = `mailto:support@maitje.nl?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6">
      {/* App Informatie */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-6 h-6 text-gray-600" />
          <h3 className="text-xl font-nunito font-bold text-gray-800">App Informatie</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">App Versie</span>
            <span className="font-semibold text-gray-800">0.1</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Laatste Update</span>
            <span className="font-semibold text-gray-800">4 juni 2025</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Ingelogd als</span>
            <span className="font-semibold text-gray-800">{user?.email || 'Niet ingelogd'}</span>
          </div>
        </div>
      </div>

      {/* AI Model Configuratie */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-6 h-6 text-purple-500" />
          <h3 className="text-xl font-nunito font-bold text-gray-800">AI Model Configuratie</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">AI Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
            >
              <option value="gpt-4o-mini">GPT-4o-Mini (Aanbevolen)</option>
              <option value="gpt-4o">GPT-4o (Premium)</option>
              <option value="gpt-3.5-turbo">GPT-3.5-Turbo (Basis)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">OpenAI API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Veilig opgeslagen en versleuteld. Haal je API key op van{' '}
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-maitje-blue hover:underline">
                platform.openai.com
              </a>
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Content Filter</label>
            <select
              value={contentFilter}
              onChange={(e) => setContentFilter(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
            >
              <option value="strict">Streng (Extra veilig voor kinderen)</option>
              <option value="medium">Gemiddeld (Aanbevolen)</option>
              <option value="mild">Mild (Basis filtering)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">AI Taal</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
            >
              <option value="nl">Nederlands</option>
              <option value="en">Engels</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={saveAIConfig}
              disabled={isLoading}
              className="maitje-button flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Opslaan...' : 'AI Instellingen Opslaan'}
            </button>

            <button
              onClick={testOpenAIConnection}
              disabled={isTestingAPI || !apiKey.trim()}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTestingAPI ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <TestTube className="w-4 h-4" />
              )}
              {isTestingAPI ? 'Testen...' : 'Test API Verbinding'}
            </button>
          </div>

          {/* API Test Result */}
          {apiTestResult.status && (
            <div className={`p-3 rounded-lg border-l-4 ${
              apiTestResult.status === 'success' 
                ? 'bg-green-50 border-green-400' 
                : 'bg-red-50 border-red-400'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {apiTestResult.status === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-semibold ${
                  apiTestResult.status === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  API Test Resultaat
                </span>
              </div>
              <pre className={`text-sm whitespace-pre-wrap ${
                apiTestResult.status === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {apiTestResult.message}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Contact & Support */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-nunito font-bold text-gray-800">Contact & Support</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleContactSupport}
            className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Mail className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <div className="font-semibold text-blue-800">Contact Opnemen</div>
              <div className="text-sm text-blue-600">support@maitje.nl</div>
            </div>
          </button>

          <button
            onClick={handleBugReport}
            className="flex items-center gap-3 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Bug className="w-5 h-5 text-red-600" />
            <div className="text-left">
              <div className="font-semibold text-red-800">Bug Rapporteren</div>
              <div className="text-sm text-red-600">Meld een probleem</div>
            </div>
          </button>

          <button
            onClick={() => setShowPrivacy(true)}
            className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Shield className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <div className="font-semibold text-green-800">Privacy & Dataverzameling</div>
              <div className="text-sm text-green-600">Bekijk ons beleid</div>
            </div>
          </button>

          <button
            onClick={() => setShowFAQ(true)}
            className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-purple-600" />
            <div className="text-left">
              <div className="font-semibold text-purple-800">Veelgestelde Vragen</div>
              <div className="text-sm text-purple-600">FAQ & Help</div>
            </div>
          </button>
        </div>
      </div>

      {/* Dialogs */}
      <PrivacyDialog isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <FAQDialog isOpen={showFAQ} onClose={() => setShowFAQ(false)} />
    </div>
  );
};

export default ToolInstellingenTab;
