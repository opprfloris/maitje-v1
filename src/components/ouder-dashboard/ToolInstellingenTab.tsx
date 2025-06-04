
import React, { useState } from 'react';
import { Settings, Key, Shield, Globe, Mail, HelpCircle } from 'lucide-react';

const ToolInstellingenTab = () => {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4-mini');
  const [contentFilter, setContentFilter] = useState('medium');
  const [language, setLanguage] = useState('nl');

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
            <span className="font-semibold text-gray-800">mAItje v1.2.3</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Laatste update</span>
            <span className="font-semibold text-gray-800">15 oktober 2024</span>
          </div>
        </div>
      </div>

      {/* Accountbeheer */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-6 h-6 text-maitje-blue" />
          <h3 className="text-xl font-nunito font-bold text-gray-800">Accountbeheer</h3>
        </div>
        
        <div className="space-y-3">
          <button className="w-full p-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="font-semibold text-gray-800">E-mailadres wijzigen</div>
            <div className="text-sm text-gray-600">Huidige: ouder@voorbeeld.nl</div>
          </button>
          
          <button className="w-full p-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="font-semibold text-gray-800">Wachtwoord wijzigen</div>
            <div className="text-sm text-gray-600">Laatst gewijzigd: 2 weken geleden</div>
          </button>
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">Selectie AI Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
            >
              <option value="gpt-4-mini">GPT-4-Mini (Aanbevolen)</option>
              <option value="gpt-4">GPT-4 (Krachtig)</option>
              <option value="gemini-pro">Gemini-Pro-Edu</option>
              <option value="llama-3">Llama-3-Instruct-ChildSafe</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Voer uw AI API key in"
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Uw API key wordt versleuteld opgeslagen en alleen gebruikt voor AI-functies
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Content Filters</label>
            <select
              value={contentFilter}
              onChange={(e) => setContentFilter(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
            >
              <option value="strict">Streng (Maximale veiligheid)</option>
              <option value="medium">Gemiddeld (Aanbevolen)</option>
              <option value="relaxed">Ontspannen (Meer vrijheid)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Taal AI Interacties</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
            >
              <option value="nl">Nederlands</option>
              <option value="en">Engels</option>
              <option value="de">Duits</option>
              <option value="fr">Frans</option>
            </select>
          </div>
          
          <button className="w-full maitje-button">
            AI Instellingen Opslaan
          </button>
        </div>
      </div>

      {/* Privacy & Beveiliging */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-green-500" />
          <h3 className="text-xl font-nunito font-bold text-gray-800">Privacy & Beveiliging</h3>
        </div>
        
        <div className="space-y-3">
          <button className="w-full p-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="font-semibold text-gray-800">Privacybeleid</div>
            <div className="text-sm text-gray-600">Bekijk hoe we uw gegevens beschermen</div>
          </button>
          
          <button className="w-full p-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="font-semibold text-gray-800">Dataverzameling instellingen</div>
            <div className="text-sm text-gray-600">Beheer welke data wordt verzameld</div>
          </button>
          
          <button className="w-full p-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="font-semibold text-gray-800">Gegevens exporteren</div>
            <div className="text-sm text-gray-600">Download al uw data</div>
          </button>
        </div>
      </div>

      {/* Contact & Support */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <HelpCircle className="w-6 h-6 text-orange-500" />
          <h3 className="text-xl font-nunito font-bold text-gray-800">Contact & Support</h3>
        </div>
        
        <div className="space-y-3">
          <button className="w-full p-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="font-semibold text-gray-800">Veelgestelde vragen (FAQ)</div>
            <div className="text-sm text-gray-600">Vind snel antwoorden op veel voorkomende vragen</div>
          </button>
          
          <button className="w-full p-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="font-semibold text-gray-800">Contact opnemen</div>
            <div className="text-sm text-gray-600">support@maitje.nl • +31 20 123 4567</div>
          </button>
          
          <button className="w-full p-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="font-semibold text-gray-800">Bug rapporteren</div>
            <div className="text-sm text-gray-600">Help ons de app te verbeteren</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolInstellingenTab;
