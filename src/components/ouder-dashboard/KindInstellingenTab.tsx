
import React, { useState, useEffect } from 'react';
import { User, Tag, X, Plus, Save, Info, Star, Heart } from 'lucide-react';
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
  const [selectedCategorie, setSelectedCategorie] = useState('');
  const [achtergrondInfo, setAchtergrondInfo] = useState('');
  const [extraThemas, setExtraThemas] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const interesseCategorieën = [
    { naam: 'Dieren', icon: '🐾', voorbeelden: ['Dinosaurussen', 'Huisdieren', 'Wilde dieren', 'Zeedieren'] },
    { naam: 'Sport', icon: '⚽', voorbeelden: ['Voetbal', 'Tennis', 'Zwemmen', 'Fietsen'] },
    { naam: 'Wetenschap', icon: '🔬', voorbeelden: ['Ruimtevaart', 'Experimenten', 'Planeten', 'Natuur'] },
    { naam: 'Kunst & Creativiteit', icon: '🎨', voorbeelden: ['Tekenen', 'Muziek', 'Dans', 'Knutselen'] },
    { naam: 'Technologie', icon: '💻', voorbeelden: ['Computers', 'Robots', 'Games', 'Apps'] },
    { naam: 'Avontuur', icon: '🗺️', voorbeelden: ['Piraten', 'Ridders', 'Ontdekkingsreizigers', 'Sprookjes'] }
  ];

  console.log('Kind instellingen tab loaded, profile:', profile);

  useEffect(() => {
    if (profile) {
      setKindNaam(profile.child_name || '');
    }
    loadKindData();
  }, [profile]);

  const loadKindData = async () => {
    if (!user) return;

    try {
      // Load interessegebieden
      const { data: interests, error: interestsError } = await supabase
        .from('user_interests')
        .select('interest_name')
        .eq('user_id', user.id);

      if (interestsError) {
        console.error('Error loading interests:', interestsError);
      } else if (interests) {
        setInteressegebieden(interests.map(item => item.interest_name));
      }

      // Load extra informatie (we'll store this in a new way)
      // For now, we'll use localStorage to store extra info until we add it to the database
      const storedAchtergrond = localStorage.getItem(`achtergrond_${user.id}`) || '';
      const storedThemas = localStorage.getItem(`themas_${user.id}`) || '';
      setAchtergrondInfo(storedAchtergrond);
      setExtraThemas(storedThemas);
    } catch (error) {
      console.error('Error loading kind data:', error);
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

  const addInteresse = async (interesse?: string) => {
    const interesseToAdd = interesse || nieuwInteresse.trim();
    if (!interesseToAdd || !user) return;

    if (interessegebieden.includes(interesseToAdd)) {
      toast.error('Dit interessegebied is al toegevoegd');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_interests')
        .insert({
          user_id: user.id,
          interest_name: interesseToAdd
        });

      if (error) {
        throw error;
      }

      setInteressegebieden([...interessegebieden, interesseToAdd]);
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

  const saveExtraInfo = () => {
    if (!user) return;

    // Store in localStorage for now
    localStorage.setItem(`achtergrond_${user.id}`, achtergrondInfo);
    localStorage.setItem(`themas_${user.id}`, extraThemas);
    toast.success('Extra informatie opgeslagen');
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

      {/* Achtergrond Informatie */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-nunito font-bold text-gray-800">Achtergrond Informatie Kind</h3>
        </div>
        
        <p className="text-gray-600 mb-4">
          Voeg extra informatie toe over uw kind die kan helpen bij het personaliseren van de leeservaring.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Algemene Achtergrond</label>
            <textarea
              value={achtergrondInfo}
              onChange={(e) => setAchtergrondInfo(e.target.value)}
              placeholder="Bijv. Mijn kind houdt van puzzels, heeft moeite met concentratie, werkt het beste in de ochtend..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none resize-vertical"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Extra Thema's & Voorkeuren</label>
            <textarea
              value={extraThemas}
              onChange={(e) => setExtraThemas(e.target.value)}
              placeholder="Bijv. Avontuurlijke verhalen, fantasie werelden, superhelden, prinsessen..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none resize-vertical"
            />
          </div>

          <button
            onClick={saveExtraInfo}
            className="maitje-button"
          >
            <Save className="w-4 h-4 mr-2" />
            Achtergrond Informatie Opslaan
          </button>
        </div>
      </div>

      {/* Uitgebreide Interessegebieden */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <Tag className="w-6 h-6 text-purple-500" />
          <h3 className="text-xl font-nunito font-bold text-gray-800">Interessegebieden & Thema's</h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          Kies interessegebieden om oefeningen en verhalen nog interessanter te maken voor uw kind. Deze informatie wordt gebruikt voor AI personalisatie.
        </p>

        {/* Categorieën */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Kies uit Categorieën</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interesseCategorieën.map((categorie, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-maitje-green transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{categorie.icon}</span>
                  <h5 className="font-semibold text-gray-800">{categorie.naam}</h5>
                </div>
                <div className="space-y-2">
                  {categorie.voorbeelden.map((voorbeeld, vIndex) => (
                    <button
                      key={vIndex}
                      onClick={() => addInteresse(voorbeeld)}
                      disabled={interessegebieden.includes(voorbeeld)}
                      className={`w-full text-left p-2 rounded text-sm transition-colors ${
                        interessegebieden.includes(voorbeeld)
                          ? 'bg-green-50 text-green-700 cursor-not-allowed'
                          : 'bg-gray-50 hover:bg-maitje-green/10 text-gray-700'
                      }`}
                    >
                      {interessegebieden.includes(voorbeeld) && <Star className="w-3 h-3 inline mr-1" />}
                      {voorbeeld}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Eigen interesse toevoegen */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Eigen Interesse Toevoegen</h4>
          <div className="flex gap-3">
            <input
              type="text"
              value={nieuwInteresse}
              onChange={(e) => setNieuwInteresse(e.target.value)}
              placeholder="Bijv. Kastelen, Draken, Koken..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && addInteresse()}
            />
            <button
              onClick={() => addInteresse()}
              className="maitje-button px-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              Toevoegen
            </button>
          </div>
        </div>

        {/* Geselecteerde interessegebieden */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Geselecteerde Interessegebieden ({interessegebieden.length})
          </h4>
          <div className="flex flex-wrap gap-3">
            {interessegebieden.map((interesse, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-maitje-green/10 text-maitje-green px-4 py-2 rounded-full border border-maitje-green/20"
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
              <p className="text-gray-500 italic">Nog geen interessegebieden geselecteerd</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KindInstellingenTab;
