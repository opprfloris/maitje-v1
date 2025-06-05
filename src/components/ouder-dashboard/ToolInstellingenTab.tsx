
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Shield, Bell, Eye, FileText, HelpCircle, Mail, Bug, Download, Trash2 } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const [showFAQDialog, setShowFAQDialog] = useState(false);

  useEffect(() => {
    if (user) {
      loadPrivacySettings();
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

  const savePrivacySettings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_privacy_settings')
        .upsert({
          user_id: user.id,
          ...privacySettings,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving privacy settings:', error);
        toast.error('Fout bij opslaan privacy instellingen');
        return;
      }

      toast.success('Privacy instellingen opgeslagen');
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      toast.error('Fout bij opslaan privacy instellingen');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: keyof typeof privacySettings, value: boolean) => {
    setPrivacySettings(prev => ({
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
    <div className="space-y-6 bg-maitje-cream min-h-screen p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-nunito font-bold text-gray-800">Tool Instellingen</h2>
          <p className="text-gray-600">Beheer privacy, notificaties en data verzameling instellingen</p>
        </div>
      </div>

      {/* Privacy Settings */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-maitje-blue" />
            Privacy Instellingen
          </CardTitle>
          <CardDescription>
            Beheer hoe je gegevens worden gebruikt en welke data wordt verzameld.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Data verzameling voor analytics</Label>
                <p className="text-sm text-muted-foreground">
                  Sta anonieme data verzameling toe om de app te verbeteren
                </p>
              </div>
              <Switch
                checked={privacySettings.data_collection_analytics}
                onCheckedChange={(value) => updateSetting('data_collection_analytics', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Data verzameling voor personalisatie</Label>
                <p className="text-sm text-muted-foreground">
                  Gebruik leergedrag om de ervaring te personaliseren
                </p>
              </div>
              <Switch
                checked={privacySettings.data_collection_personalization}
                onCheckedChange={(value) => updateSetting('data_collection_personalization', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-maitje-blue" />
            Notificatie Instellingen
          </CardTitle>
          <CardDescription>
            Kies welke meldingen je wilt ontvangen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Wekelijkse rapporten</Label>
                <p className="text-sm text-muted-foreground">
                  Ontvang wekelijkse voortgangsrapporten per email
                </p>
              </div>
              <Switch
                checked={privacySettings.weekly_reports}
                onCheckedChange={(value) => updateSetting('weekly_reports', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Niveau wijziging meldingen</Label>
                <p className="text-sm text-muted-foreground">
                  Krijg een melding wanneer je kind een niveau omhoog gaat
                </p>
              </div>
              <Switch
                checked={privacySettings.level_change_notifications}
                onCheckedChange={(value) => updateSetting('level_change_notifications', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Help Documents */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-maitje-blue" />
            Privacy & Help
          </CardTitle>
          <CardDescription>
            Bekijk belangrijke documenten en krijg hulp.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowPrivacyDialog(true)}
            >
              <Shield className="w-4 h-4 mr-2" />
              Privacy Beleid
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowFAQDialog(true)}
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              FAQ / Hulp
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Support */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-maitje-blue" />
            Contact & Support
          </CardTitle>
          <CardDescription>
            Neem contact op voor hulp of rapporteer problemen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleContactSupport}
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleBugReport}
            >
              <Bug className="w-4 h-4 mr-2" />
              Bug Rapporteren
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Export & Account */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-maitje-blue" />
            Data & Account Beheer
          </CardTitle>
          <CardDescription>
            Download je gegevens of verwijder je account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleDataExport}
            >
              <Download className="w-4 h-4 mr-2" />
              Download mijn gegevens
            </Button>
            <Button 
              variant="outline" 
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleAccountDeletion}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Account verwijderen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={savePrivacySettings}
          disabled={loading}
          className="px-8 bg-maitje-blue hover:bg-maitje-blue/90"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Opslaan...
            </>
          ) : (
            'Instellingen Opslaan'
          )}
        </Button>
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
