import React, { useEffect, useState } from 'react';
import { Book, Calculator, User, GraduationCap, Clock, Star, Target, TrendingUp, Globe, ChevronRight, Brain, Calendar } from 'lucide-react';
import { AppView } from './MaitjeApp';
import { Helper } from '@/types/helpers';
import { useAuth } from '@/contexts/AuthContext';
import HelperSelector from './HelperSelector';
import { useHelperTips } from '@/hooks/useHelperTips';
import { useDailyPlan } from '@/hooks/useDailyPlan';
import ProgrammaMode from './ProgrammaMode';
import WeekProgramSelector from './weekprogram/WeekProgramSelector';
import WeekProgramMode from './weekprogram/WeekProgramMode';

interface Props {
  onNavigate: (view: AppView) => void;
  onSignOut: () => void;
}

const KindDashboard = ({ onNavigate, onSignOut }: Props) => {
  const { profile } = useAuth();
  const [selectedHelper, setSelectedHelper] = useState<Helper | null>(null);
  const [showProgramma, setShowProgramma] = useState(false);
  const [showWeekProgramSelector, setShowWeekProgramSelector] = useState(false);
  const [selectedWeekProgram, setSelectedWeekProgram] = useState<string | null>(null);
  const [showAIPincode, setShowAIPincode] = useState(false);
  const [showOuderPincode, setShowOuderPincode] = useState(false);
  const [aiPincode, setAIPincode] = useState('');
  const [ouderPincode, setOuderPincode] = useState('');
  
  const { currentTip, loading: tipLoading } = useHelperTips(selectedHelper);
  const { items, loading: planLoading } = useDailyPlan('dummy-child-id'); // We'll use a dummy ID for now

  const handleHelperSelect = (helper: Helper) => {
    setSelectedHelper(helper);
    localStorage.setItem('selectedHelper', JSON.stringify(helper));
  };

  const startProgramma = () => {
    setShowProgramma(true);
  };

  const exitProgramma = () => {
    setShowProgramma(false);
  };

  const startWeekProgram = () => {
    setShowWeekProgramSelector(true);
  };

  const handleSelectWeekProgram = (programId: string) => {
    setSelectedWeekProgram(programId);
    setShowWeekProgramSelector(false);
  };

  const exitWeekProgram = () => {
    setSelectedWeekProgram(null);
    setShowWeekProgramSelector(false);
  };

  const handleAIAccess = () => {
    setShowAIPincode(true);
  };

  const handleOuderAccess = () => {
    setShowOuderPincode(true);
  };

  const handleAIPincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple pincode check - in production this should be more secure
    if (aiPincode === '1234' || aiPincode === '0000') {
      setShowAIPincode(false);
      setAIPincode('');
      onNavigate('dev-dashboard'); // Changed from 'ai-dashboard' to 'dev-dashboard'
    } else {
      alert('Onjuiste pincode. Probeer 1234.');
      setAIPincode('');
    }
  };

  const handleOuderPincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Get stored parent pincode or use default
    const storedPincode = localStorage.getItem('ouderPincode') || '1234';
    if (ouderPincode === storedPincode) {
      setShowOuderPincode(false);
      setOuderPincode('');
      onNavigate('ouder');
    } else {
      alert(`Onjuiste pincode. Probeer ${storedPincode}.`);
      setOuderPincode('');
    }
  };

  // Load helper from localStorage on mount
  useEffect(() => {
    const storedHelper = localStorage.getItem('selectedHelper');
    if (storedHelper) {
      try {
        setSelectedHelper(JSON.parse(storedHelper));
      } catch (error) {
        console.error('Error parsing stored helper:', error);
      }
    }
  }, []);

  const childName = profile?.child_name || 'daar';

  // Show different screens based on state
  if (selectedWeekProgram) {
    return (
      <WeekProgramMode
        programId={selectedWeekProgram}
        childId="dummy-child-id"
        childName={childName}
        selectedHelper={selectedHelper}
        onExit={exitWeekProgram}
      />
    );
  }

  if (showWeekProgramSelector) {
    return (
      <WeekProgramSelector
        childId="dummy-child-id"
        onSelectProgram={handleSelectWeekProgram}
        onBack={() => setShowWeekProgramSelector(false)}
      />
    );
  }

  if (showProgramma) {
    return (
      <ProgrammaMode
        childId="dummy-child-id"
        childName={childName}
        selectedHelper={selectedHelper}
        onExit={exitProgramma}
      />
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      {/* Header met uitlog knop */}
      <div className="flex justify-end items-center mb-6">
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 p-3 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-sm">Uitloggen</span>
        </button>
      </div>

      {/* Header met welkomstboodschap en Helper selector */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-6">
          <HelperSelector
            selectedHelper={selectedHelper}
            onHelperSelect={handleHelperSelect}
          />
        </div>
        <h1 className="text-4xl font-nunito font-bold text-gray-800 mb-2">
          Hallo {childName}! 👋
        </h1>
        <p className="text-xl text-gray-600 font-nunito mb-4">
          {selectedHelper ? `${selectedHelper.name} helpt je vandaag met leren!` : 'Kies een hulpje om je te helpen met leren!'}
        </p>
        
        {/* Leerlevel */}
        <div className="flex justify-center gap-6 mb-4">
          <div className="bg-maitje-green text-white px-4 py-2 rounded-xl font-nunito font-bold">
            Leerlevel: 5
          </div>
        </div>

        {/* Tip van het gekozen hulpje */}
        {selectedHelper && (
          <div className="bg-maitje-blue bg-opacity-20 border-2 border-maitje-blue rounded-xl p-4 mb-6">
            {tipLoading ? (
              <p className="text-gray-700 font-nunito">
                💭 <strong>{selectedHelper.name}</strong> bedenkt een tip voor je...
              </p>
            ) : (
              <p className="text-gray-700 font-nunito">
                💡 <strong>Wist-je-datje van {selectedHelper.name}:</strong> {currentTip}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Programma Keuze Sectie */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Weekprogramma Kaart */}
        <div className="maitje-card hover:shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-nunito font-bold text-gray-800">Weekprogramma</h3>
              <p className="text-gray-600">Volg je wekelijkse leerplan</p>
            </div>
          </div>
          <button 
            onClick={startWeekProgram}
            className="w-full maitje-button text-xl py-4"
          >
            Start Weekprogramma →
          </button>
        </div>

        {/* Dagelijkse Oefeningen Kaart */}
        <div className="maitje-card hover:shadow-xl transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-maitje-green rounded-xl flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-nunito font-bold text-gray-800">Dagelijkse Oefeningen</h3>
              <p className="text-gray-600">Losse oefeningen per vak</p>
            </div>
          </div>
          <button 
            onClick={startProgramma}
            className="w-full bg-maitje-green hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-colors text-xl"
          >
            Start Oefeningen →
          </button>
        </div>
      </div>

      {/* Jouw mAItje Plan voor Vandaag */}
      <div className="maitje-card mb-8">
        <h2 className="text-2xl font-nunito font-bold text-gray-800 mb-4 flex items-center gap-3">
          📅 Jouw mAItje Plan voor Vandaag
        </h2>
        
        {planLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 bg-maitje-blue rounded-full flex items-center justify-center text-xl mx-auto mb-4 animate-bounce">
              🦉
            </div>
            <p className="text-gray-600 font-nunito">Plan laden...</p>
          </div>
        ) : (
          <div className="grid gap-4 mb-6">
            {items.map((item, index) => (
              <div 
                key={item.id}
                className={`flex items-center gap-4 p-4 bg-maitje-cream rounded-xl border-l-4 ${
                  item.status === 'completed' 
                    ? 'border-maitje-green bg-green-50' 
                    : item.status === 'skipped'
                    ? 'border-gray-400 bg-gray-50'
                    : index === 0 ? 'border-maitje-green' 
                    : index === 1 ? 'border-maitje-blue'
                    : 'border-purple-500'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  item.status === 'completed' 
                    ? 'bg-maitje-green' 
                    : item.status === 'skipped'
                    ? 'bg-gray-400'
                    : index === 0 ? 'bg-maitje-green' 
                    : index === 1 ? 'bg-maitje-blue'
                    : 'bg-purple-500'
                }`}>
                  {item.status === 'completed' ? '✓' : item.status === 'skipped' ? '⏭' : index + 1}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                {item.status === 'completed' && (
                  <div className="ml-auto text-maitje-green font-bold">Voltooid! ⭐</div>
                )}
                {item.status === 'skipped' && (
                  <div className="ml-auto text-gray-500 font-bold">Overgeslagen</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hoofdmenu knoppen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => onNavigate('rekenen')}
          className="maitje-card hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-left"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-maitje-green rounded-xl flex items-center justify-center">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-nunito font-bold text-gray-800">Rekenen</h3>
              <p className="text-gray-600">Oefen je tafels en sommen</p>
            </div>
          </div>
          <div className="text-maitje-green font-semibold">Klik om te starten →</div>
        </button>

        <button
          onClick={() => onNavigate('lezen')}
          className="maitje-card hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-left"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-maitje-blue rounded-xl flex items-center justify-center">
              <Book className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-nunito font-bold text-gray-800">Begrijpend Lezen</h3>
              <p className="text-gray-600">Lees verhalen en beantwoord vragen</p>
            </div>
          </div>
          <div className="text-maitje-blue font-semibold">Klik om te starten →</div>
        </button>

        <button
          onClick={() => onNavigate('engels')}
          className="maitje-card hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-left"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-nunito font-bold text-gray-800">Engels Leren</h3>
              <p className="text-gray-600">Oefen Engelse woordjes</p>
            </div>
          </div>
          <div className="text-purple-500 font-semibold">Klik om te starten →</div>
        </button>
      </div>

      {/* Toegang knoppen */}
      <div className="flex justify-center gap-8">
        <button
          onClick={handleOuderAccess}
          className="flex items-center gap-2 p-3 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-sm">Ouder Dashboard</span>
          <span className="text-lg">🔒</span>
        </button>
        
        <button
          onClick={handleAIAccess}
          className="flex items-center gap-2 p-3 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Brain className="w-5 h-5" />
          <span className="text-sm">Dev Instellingen</span>
          <span className="text-lg">🔒</span>
        </button>
      </div>

      {/* AI Pincode Modal */}
      {showAIPincode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-nunito font-bold text-gray-800 mb-4">
              Dev Instellingen Toegang
            </h3>
            <p className="text-gray-600 mb-6">
              Voer de pincode in voor toegang tot ontwikkelaar instellingen.
            </p>
            <form onSubmit={handleAIPincodeSubmit}>
              <input
                type="password"
                value={aiPincode}
                onChange={(e) => setAIPincode(e.target.value)}
                placeholder="Voer pincode in"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-center text-xl tracking-widest"
                maxLength={4}
                autoFocus
              />
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAIPincode(false);
                    setAIPincode('');
                  }}
                  className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="flex-1 p-3 bg-maitje-blue text-white rounded-lg hover:bg-maitje-blue/90"
                >
                  Toegang
                </button>
              </div>
            </form>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Tip: Probeer 1234 voor demo toegang
            </p>
          </div>
        </div>
      )}

      {/* Ouder Pincode Modal */}
      {showOuderPincode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-nunito font-bold text-gray-800 mb-4">
              Ouder Dashboard Toegang
            </h3>
            <p className="text-gray-600 mb-6">
              Voer de pincode in voor toegang tot het ouder dashboard.
            </p>
            <form onSubmit={handleOuderPincodeSubmit}>
              <input
                type="password"
                value={ouderPincode}
                onChange={(e) => setOuderPincode(e.target.value)}
                placeholder="Voer pincode in"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-center text-xl tracking-widest"
                maxLength={4}
                autoFocus
              />
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowOuderPincode(false);
                    setOuderPincode('');
                  }}
                  className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="flex-1 p-3 bg-maitje-blue text-white rounded-lg hover:bg-maitje-blue/90"
                >
                  Toegang
                </button>
              </div>
            </form>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Tip: De standaard pincode is 1234
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KindDashboard;
