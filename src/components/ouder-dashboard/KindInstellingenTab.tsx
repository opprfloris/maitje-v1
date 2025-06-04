
import React, { useState, useEffect } from 'react';
import { User, Tag, X, Plus, Save, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const KindInstellingenTab = () => {
  const { user, profile, updateProfile } = useAuth();
  const [kindNaam, setKindNaam] = useState('');
  const [basisniveau, setBasisniveau] = useState('Groep 5');
  const [huidigLevel, setHuidigLevel] = useState(5);
  const [interessegebieden, setInteressegebieden] = useState<string[]>([]);
  const [nieuwInteresse, setNieuwInteresse] = useState('');
  const [weekelijksRapport, setWeekelijksRapport] = useState(true);
  const [levelNotificaties, setLevelNotificaties] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  console.log('Kind instellingen tab loaded, profile:', profile);

  useEffect(() => {
    if (profile) {
      setKindNaam(profile.child_name || '');
    }
    loadInteressegebieden();
    loadPrivacySettings();
  }, [profile]);

  const loadInteressegebieden = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_interests')
        .select('interest_name')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading interests:', error);
        return;
      }

      if (data) {
        setInteressegebieden(data.map(item => item.interest_name));
      }
    } catch (error) {
      console.error('Error loading interests:', error);
    }
  };

  const loadPrivacySettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_privacy_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading privacy settings:', error);
        return;
      }

      if (data) {
        setWeekelijksRapport(data.weekly_reports);
        setLevelNotificaties(data.level_change_notifications);
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
    }
  };

  const saveKindNaam = async () => {
    if (!kindNaam.trim()) {
      toast.error('Voer een naam in voor uw kind');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await updateProfile({ child_name: kindNaam.trim() });
      if (error) {
        throw error;
      }
      toast.success('Kindnaam opgeslagen');
    } catch (error) {
      console.error('Error saving child name:', error);
      toast.error('Fout bij opslaan kindnaam');
    } finally {
      setIsLoading(false);
    }
  };

  const addInteresse = async () => {
    if (!nieuwInteresse.trim() || !user) return;

    const interesse = nieuwInteresse.trim();
    if (interessegebieden.includes(interesse)) {
      toast.error('Dit interessegebied is al toegevoegd');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_interests')
        .insert({
          user_id: user.id,
          interest_name: interesse
        });

      if (error) {
        throw error;
      }

      setInteressegebieden([...interessegebieden, interesse]);
      setNieuwInteresse('');
      toast.success('Interessegebied toegevoegd');
    } catch (error) {
      console.error('Error adding interest:', error);
      toast.error('Fout bij toevoegen interessegebied');
    }
  };

  const removeInteresse = async (interesse: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_interests')
        .delete()
        .eq('user_id', user.id)
        .eq('interest_name', interesse);

      if (error) {
        throw error;
      }

      setInteressegebieden(interessegebieden.filter(i => i !== interesse));
      toast.success('Interessegebied verwijderd');
    } catch (error) {
      console.error('Error removing interest:', error);
      toast.error('Fout bij verwijderen interessegebied');
    }
  };

  const saveNotificatieSettings = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const settingsData = {
        user_id: user.id,
        weekly_reports: weekelijksRapport,
        level_change_notifications: levelNotificaties,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_privacy_settings')
        .upsert(settingsData);

      if (error) {
        throw error;
      }

      toast.success('Notificatie-instellingen opgeslagen');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast.error('Fout bij opslaan instellingen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Kind Naam */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-6 h-6 text-gray-600" />
          <h3 className="text-xl font-nunito font-bold text-gray-800">Kind Informatie</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Kind Naam</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={kindNaam}
                onChange={(e) => setKindNaam(e.target.value)}
                placeholder="Bijv. Joos, Emma, Max..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
              />
              <button
                onClick={saveKindNaam}
                disabled={isLoading}
                className="maitje-button px-6 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                Opslaan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Kind Instellingen */}
      <div className="maitje-card">
        <h3 className="text-xl font-nunito font-bold text-gray-800 mb-4">Kind Instellingen</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Basisniveau Kind</label>
            <select
              value={basisniveau}
              onChange={(e) => setBasisniveau(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
            >
              <option value="Groep 3">Groep 3</option>
              <option value="Groep 4">Groep 4</option>
              <option value="Groep 5">Groep 5</option>
              <option value="Groep 6">Groep 6</option>
              <option value="Groep 7">Groep 7</option>
              <option value="Groep 8">Groep 8</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Huidig Leerlevel (abstract)</label>
            <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg">
              <span className="text-lg font-bold text-maitje-blue">{huidigLevel}</span>
              <span className="text-sm text-gray-600 ml-2">Automatisch bepaald door mAItje</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button className="maitje-button">
            Instellingen Opslaan
          </button>
        </div>
      </div>

      {/* Interessegebieden */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <Tag className="w-6 h-6 text-purple-500" />
          <h3 className="text-xl font-nunito font-bold text-gray-800">Interessegebieden & Thema's</h3>
        </div>
        
        <p className="text-gray-600 mb-4">
          Voeg interessegebieden toe om oefeningen interessanter te maken voor uw kind.
        </p>

        {/* Toevoegen van nieuwe interesse */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={nieuwInteresse}
            onChange={(e) => setNieuwInteresse(e.target.value)}
            placeholder="Bijv. Dinosaurussen, Ruimtevaart, Voetbal..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
            onKeyPress={(e) => e.key === 'Enter' && addInteresse()}
          />
          <button
            onClick={addInteresse}
            className="maitje-button px-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            Toevoegen
          </button>
        </div>

        {/* Lijst van interessegebieden */}
        <div className="flex flex-wrap gap-2">
          {interessegebieden.map((interesse, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-maitje-green/10 text-maitje-green px-3 py-2 rounded-full border border-maitje-green/20"
            >
              <Tag className="w-4 h-4" />
              <span className="font-medium">{interesse}</span>
              <button
                onClick={() => removeInteresse(interesse)}
                className="text-red-500 hover:text-red-700 ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {interessegebieden.length === 0 && (
            <p className="text-gray-500 italic">Nog geen interessegebieden toegevoegd</p>
          )}
        </div>
      </div>

      {/* Notificatievoorkeuren */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-nunito font-bold text-gray-800">Notificatievoorkeuren</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-800">Wekelijks voortgangsrapport</h4>
              <p className="text-sm text-gray-600">Ontvang elke week een samenvatting van de voortgang van uw kind</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={weekelijksRapport}
                onChange={(e) => setWeekelijksRapport(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-maitje-green/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-maitje-green"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-800">Niveau verandering melding</h4>
              <p className="text-sm text-gray-600">Krijg een melding wanneer uw kind een nieuw niveau bereikt</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={levelNotificaties}
                onChange={(e) => setLevelNotificaties(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-maitje-green/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-maitje-green"></div>
            </label>
          </div>

          <button
            onClick={saveNotificatieSettings}
            disabled={isLoading}
            className="maitje-button disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Opslaan...' : 'Notificatie-instellingen Opslaan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KindInstellingenTab;
