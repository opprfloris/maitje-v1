import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Shield, Bell, Eye, FileText, HelpCircle, Mail, Bug, Download, Trash2, Settings, Lock } from 'lucide-react';
import PrivacyDialog from './PrivacyDialog';
import FAQDialog from './FAQDialog';

const ToolInstellingenTab = () => {
  const { user } = useAuth();
  const [privacySettings, setPrivacySettings] = useState({
    weekly_reports: true,
    level_change_notifications: true,
    data_collection_analytics: true,
    data_collection_personalization: true
  });
  const [aiSettings, setAiSettings] = useState({
    content_filter: 'medium',
    language: 'nl'
  });
  const [ouderPincode, setOuderPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const [showFAQDialog, setShowFAQDialog] = useState(false);

  useEffect(() => {
    if (user) {
      loadPrivacySettings();
      loadAISettings();
      loadOuderPincode();
    }
  }, [user]);

  const loadPrivacySettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_privacy_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading privacy settings:', error);
        return;
      }

      if (data) {
        setPrivacySettings({
          weekly_reports: data.weekly_reports ?? true,
          level_change_notifications: data.level_change_notifications ?? true,
          data_collection_analytics: data.data_collection_analytics ?? true,
          data_collection_personalization: data.data_collection_personalization ?? true
        });
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
    }
  };

  const loadAISettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_ai_config')
        .select('content_filter, language')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading AI settings:', error);
        return;
      }

      if (data) {
        setAiSettings({
          content_filter: data.content_filter || 'medium',
          language: data.language || 'nl'
        });
      }
    } catch (error) {
      console.error('Error loading AI settings:', error);
    }
  };

  const loadOuderPincode = () => {
    const storedPincode = localStorage.getItem('ouderPincode') || '1234';
    setOuderPincode(storedPincode);
  };

  const saveAllSettings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Save privacy settings
      const { error: privacyError } = await supabase
        .from('user_privacy_settings')
        .upsert({
          user_id: user.id,
          ...privacySettings,
          updated_at: new Date().toISOString()
        });

      if (privacyError) {
        console.error('Error saving privacy settings:', privacyError);
        toast.error('Fout bij opslaan privacy instellingen');
        return;
      }

      // Save AI settings
      const { error: aiError } = await supabase
        .from('user_ai_config')
        .upsert({
          user_id: user.id,
          content_filter: aiSettings.content_filter,
          language: aiSettings.language,
          updated_at: new Date().toISOString()
        });

      if (aiError) {
        console.error('Error saving AI settings:', aiError);
        toast.error('Fout bij opslaan AI instellingen');
        return;
      }

      // Save pincode to localStorage
      localStorage.setItem('ouderPincode', ouderPincode);

      toast.success('Alle instellingen opgeslagen');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Fout bij opslaan instellingen');
    } finally {
      setLoading(false);
    }
  };

  const updatePrivacySetting = (key: keyof typeof privacySettings, value: boolean) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateAISetting = (key: keyof typeof aiSettings, value: string) => {
    setAiSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDataExport = () => {
    toast.info('Data export functionaliteit komt binnenkort beschikbaar');
  };

  const handleAccountDeletion = () => {
    toast.info('Voor account verwijdering, neem contact op via support@maitje.nl');
  };

  const handleBugReport = () => {
    const subject = encodeURIComponent('Bug Report - mAItje App');
    const body = encodeURIComponent('Beschrijf hier de bug die je hebt gevonden:\n\n1. Wat deed je toen de bug optrad?\n2. Wat verwachtte je dat er zou gebeuren?\n3. Wat gebeurde er in plaats daarvan?\n\nExtra informatie:\n- Browser: \n- Apparaat: \n- Datum/tijd: ');
    window.open(`mailto:support@maitje.nl?subject=${subject}&body=${body}`);
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent('Support - mAItje App');
    window.open(`mailto:support@maitje.nl?subject=${subject}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-nunito font-bold text-gray-800">Tool Instellingen</h2>
          <p className="text-gray-600">Beheer privacy, notificaties, AI en toegangsinstellingen</p>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-maitje-blue rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-nunito font-bold text-gray-800">Privacy Instellingen</h3>
            <p className="text-gray-600">Beheer hoe je gegevens worden gebruikt en welke data wordt verzameld</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-maitje-cream rounded-xl">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Data verzameling voor analytics</Label>
              <p className="text-sm text-gray-600">
                Sta anonieme data verzameling toe om de app te verbeteren
              </p>
            </div>
            <Switch
              checked={privacySettings.data_collection_analytics}
              onCheckedChange={(value) => updatePrivacySetting('data_collection_analytics', value)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-maitje-cream rounded-xl">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Data verzameling voor personalisatie</Label>
              <p className="text-sm text-gray-600">
                Gebruik leergedrag om de ervaring te personaliseren
              </p>
            </div>
            <Switch
              checked={privacySettings.data_collection_personalization}
              onCheckedChange={(value) => updatePrivacySetting('data_collection_personalization', value)}
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-maitje-green rounded-xl flex items-center justify-center">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-nunito font-bold text-gray-800">Notificatie Instellingen</h3>
            <p className="text-gray-600">Kies welke meldingen je wilt ontvangen</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-maitje-cream rounded-xl">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Wekelijkse rapporten</Label>
              <p className="text-sm text-gray-600">
                Ontvang wekelijkse voortgangsrapporten per email
              </p>
            </div>
            <Switch
              checked={privacySettings.weekly_reports}
              onCheckedChange={(value) => updatePrivacySetting('weekly_reports', value)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-maitje-cream rounded-xl">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Niveau wijziging meldingen</Label>
              <p className="text-sm text-gray-600">
                Krijg een melding wanneer je kind een niveau omhoog gaat
              </p>
            </div>
            <Switch
              checked={privacySettings.level_change_notifications}
              onCheckedChange={(value) => updatePrivacySetting('level_change_notifications', value)}
            />
          </div>
        </div>
      </div>

      {/* AI Settings */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-nunito font-bold text-gray-800">AI Instellingen</h3>
            <p className="text-gray-600">Configureer hoe de AI inhoud filtert en welke taal wordt gebruikt</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-maitje-cream rounded-xl">
            <Label className="text-base font-semibold">Content Filter</Label>
            <p className="text-sm text-gray-600 mb-3">Stel de strengheid van content filtering in</p>
            <Select value={aiSettings.content_filter} onValueChange={(value) => updateAISetting('content_filter', value)}>
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

          <div className="p-4 bg-maitje-cream rounded-xl">
            <Label className="text-base font-semibold">Taal</Label>
            <p className="text-sm text-gray-600 mb-3">Kies de hoofdtaal voor de AI</p>
            <Select value={aiSettings.language} onValueChange={(value) => updateAISetting('language', value)}>
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
        </div>
      </div>

      {/* Toegang & Beveiliging */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-nunito font-bold text-gray-800">Toegang & Beveiliging</h3>
            <p className="text-gray-600">Beheer toegangscodes en beveiligingsinstellingen</p>
          </div>
        </div>
        
        <div className="p-4 bg-maitje-cream rounded-xl">
          <Label className="text-base font-semibold">Ouder Dashboard Pincode</Label>
          <p className="text-sm text-gray-600 mb-3">
            Wijzig de pincode voor toegang tot het ouder dashboard (4 cijfers)
          </p>
          <Input
            type="password"
            value={ouderPincode}
            onChange={(e) => setOuderPincode(e.target.value.slice(0, 4))}
            placeholder="Voer nieuwe pincode in"
            maxLength={4}
            className="max-w-xs text-center tracking-widest"
          />
        </div>
      </div>

      {/* Privacy & Help Documents */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-nunito font-bold text-gray-800">Privacy & Help</h3>
            <p className="text-gray-600">Bekijk belangrijke documenten en krijg hulp</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => setShowPrivacyDialog(true)}
            className="maitje-button-secondary flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Privacy Beleid
          </button>
          <button 
            onClick={() => setShowFAQDialog(true)}
            className="maitje-button-secondary flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            FAQ / Hulp
          </button>
        </div>
      </div>

      {/* Contact & Support */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-nunito font-bold text-gray-800">Contact & Support</h3>
            <p className="text-gray-600">Neem contact op voor hulp of rapporteer problemen</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={handleContactSupport}
            className="maitje-button-secondary flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Contact Support
          </button>
          <button 
            onClick={handleBugReport}
            className="maitje-button-secondary flex items-center justify-center gap-2"
          >
            <Bug className="w-4 h-4" />
            Bug Rapporteren
          </button>
        </div>
      </div>

      {/* Data Export & Account */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-nunito font-bold text-gray-800">Data & Account Beheer</h3>
            <p className="text-gray-600">Download je gegevens of verwijder je account</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={handleDataExport}
            className="maitje-button-secondary w-full flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download mijn gegevens
          </button>
          <button 
            onClick={handleAccountDeletion}
            className="w-full p-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Account verwijderen
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button 
          onClick={saveAllSettings}
          disabled={loading}
          className="maitje-button px-8"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Opslaan...
            </>
          ) : (
            'Instellingen Opslaan'
          )}
        </button>
      </div>

      {/* Dialogs */}
      <PrivacyDialog
        isOpen={showPrivacyDialog}
        onClose={() => setShowPrivacyDialog(false)}
      />
      <FAQDialog
        isOpen={showFAQDialog}
        onClose={() => setShowFAQDialog(false)}
      />
    </div>
  );
};

export default ToolInstellingenTab;
