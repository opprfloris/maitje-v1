
import React, { useState } from 'react';
import { User, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const KindInstellingenTab = () => {
  const { profile, updateProfile } = useAuth();
  const [childName, setChildName] = useState(profile?.child_name || '');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [childLevel, setChildLevel] = useState('Groep 5');
  const [selectedHelper, setSelectedHelper] = useState('uli');
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [notifications, setNotifications] = useState({
    weeklyReport: true,
    levelChange: true
  });

  const handleUpdateChildName = async () => {
    if (!childName.trim()) return;
    
    setIsUpdatingName(true);
    try {
      const { error } = await updateProfile({ child_name: childName.trim() });
      if (error) {
        console.error('Error updating child name:', error);
      }
    } catch (error) {
      console.error('Error updating child name:', error);
    } finally {
      setIsUpdatingName(false);
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const helpers = [
    { id: 'uli', name: 'Uli de Uil', emoji: '🦉' },
    { id: 'kiki', name: 'Kiki de Kat', emoji: '🐱' },
    { id: 'barry', name: 'Barry de Beer', emoji: '🐻' },
    { id: 'stella', name: 'Stella de Ster', emoji: '⭐' }
  ];

  return (
    <div className="space-y-6">
      {/* Kind Naam */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-5 h-5 text-maitje-green" />
          <h3 className="text-xl font-nunito font-bold text-gray-800">Kind Naam</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Naam van uw kind</label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Voer de naam van uw kind in"
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
            />
          </div>
          
          <button 
            onClick={handleUpdateChildName}
            disabled={isUpdatingName || !childName.trim() || childName.trim() === profile?.child_name}
            className="w-full maitje-button text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdatingName ? 'Opslaan...' : 'Naam Opslaan'}
          </button>
        </div>
      </div>

      {/* Kind Instellingen */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-5 h-5 text-maitje-blue" />
          <h3 className="text-xl font-nunito font-bold text-gray-800">Kind Instellingen</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Basisniveau Kind</label>
            <select
              value={childLevel}
              onChange={(e) => setChildLevel(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
            >
              <option>Groep 3</option>
              <option>Groep 4</option>
              <option>Groep 5</option>
              <option>Groep 6</option>
              <option>Groep 7</option>
              <option>Groep 8</option>
            </select>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Huidig Leerlevel (abstract):</span>
            <span className="font-bold text-maitje-green ml-2">5</span>
          </div>
          
          <button className="w-full maitje-button text-sm">
            Instellingen Opslaan
          </button>
        </div>
      </div>

      {/* mAItje Hulpje Selectie */}
      <div className="maitje-card">
        <h3 className="text-xl font-nunito font-bold text-gray-800 mb-4">Selectie mAItje Hulpje</h3>
        
        <div className="grid grid-cols-2 gap-3">
          {helpers.map((helper) => (
            <button
              key={helper.id}
              onClick={() => setSelectedHelper(helper.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedHelper === helper.id
                  ? 'border-maitje-green bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-2xl mb-2">{helper.emoji}</div>
              <div className="font-semibold text-gray-800">{helper.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Interessegebieden */}
      <div className="maitje-card">
        <h3 className="text-xl font-nunito font-bold text-gray-800 mb-4">Interessegebieden & Thema's</h3>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Voeg interesse toe (bijv. Dinosaurussen)"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
            />
            <button
              onClick={addInterest}
              className="px-4 py-3 bg-maitje-green text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Toevoegen
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-maitje-blue bg-opacity-20 text-maitje-blue rounded-full text-sm"
              >
                {interest}
                <button
                  onClick={() => removeInterest(interest)}
                  className="text-red-500 hover:text-red-700 ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Notificatievoorkeuren */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-orange-500" />
          <h3 className="text-xl font-nunito font-bold text-gray-800">Notificatievoorkeuren</h3>
        </div>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={notifications.weeklyReport}
              onChange={(e) => setNotifications({...notifications, weeklyReport: e.target.checked})}
              className="w-4 h-4 text-maitje-green border-gray-300 rounded focus:ring-maitje-green"
            />
            <span className="text-gray-700">Stuur wekelijks voortgangsrapport per e-mail</span>
          </label>
          
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={notifications.levelChange}
              onChange={(e) => setNotifications({...notifications, levelChange: e.target.checked})}
              className="w-4 h-4 text-maitje-green border-gray-300 rounded focus:ring-maitje-green"
            />
            <span className="text-gray-700">Melding bij significant leerlevel verandering</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default KindInstellingenTab;
