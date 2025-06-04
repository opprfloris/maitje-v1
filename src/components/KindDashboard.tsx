
import React, { useEffect, useState } from 'react';
import { Book, Calculator, User, GraduationCap, ArrowLeft } from 'lucide-react';
import { AppView } from './MaitjeApp';
import { Child, DailyProgress } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  childName: string;
  selectedChild: Child | null;
  onNavigate: (view: AppView) => void;
  onSignOut: () => void;
}

const KindDashboard = ({ childName, selectedChild, onNavigate, onSignOut }: Props) => {
  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedChild) {
      fetchDailyProgress();
    }
  }, [selectedChild]);

  const fetchDailyProgress = async () => {
    if (!selectedChild) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('child_id', selectedChild.id)
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching daily progress:', error);
      } else {
        setDailyProgress(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentLevel = selectedChild?.current_level || 5;
  const streakDays = dailyProgress?.streak_days || 0;
  const todaysSessions = dailyProgress?.total_sessions || 0;

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      {/* Header met terug knop en uitlog knop */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => onNavigate('child-selector')}
          className="flex items-center gap-2 p-3 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Kind Wisselen</span>
        </button>
        
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 p-3 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-sm">Uitloggen</span>
        </button>
      </div>

      {/* Header met welkomstboodschap en Uli de uil */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-24 h-24 bg-maitje-blue rounded-full flex items-center justify-center text-4xl animate-bounce-gentle">
            🦉
          </div>
        </div>
        <h1 className="text-4xl font-nunito font-bold text-gray-800 mb-2">
          Hallo {childName}! 👋
        </h1>
        <p className="text-xl text-gray-600 font-nunito mb-4">
          Uli de uil helpt je vandaag met leren!
        </p>
        
        {/* Leerlevel en Reeks */}
        <div className="flex justify-center gap-6 mb-4">
          <div className="bg-maitje-green text-white px-4 py-2 rounded-xl font-nunito font-bold">
            Leerlevel: {currentLevel}
          </div>
          {streakDays > 0 && (
            <div className="bg-orange-500 text-white px-4 py-2 rounded-xl font-nunito font-bold">
              🔥 {streakDays} dagen op rij!
            </div>
          )}
        </div>

        {/* Tip van Uli */}
        <div className="bg-maitje-blue bg-opacity-20 border-2 border-maitje-blue rounded-xl p-4 mb-6">
          <p className="text-gray-700 font-nunito">
            💡 <strong>Wist-je-datje van Uli:</strong> Als je elke dag 10 minuten oefent, word je heel snel beter in rekenen!
          </p>
        </div>
      </div>

      {/* Vandaag's Voortgang */}
      {dailyProgress && (
        <div className="maitje-card mb-8">
          <h2 className="text-2xl font-nunito font-bold text-gray-800 mb-4 flex items-center gap-3">
            📊 Voortgang van Vandaag
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-maitje-green">{todaysSessions}</div>
              <div className="text-sm text-gray-600">Sessies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-maitje-blue">{dailyProgress.total_exercises}</div>
              <div className="text-sm text-gray-600">Oefeningen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">
                {Math.round((dailyProgress.total_correct / dailyProgress.total_exercises) * 100) || 0}%
              </div>
              <div className="text-sm text-gray-600">Goed</div>
            </div>
          </div>
        </div>
      )}

      {/* Jouw mAItje Plan voor Vandaag */}
      <div className="maitje-card mb-8">
        <h2 className="text-2xl font-nunito font-bold text-gray-800 mb-4 flex items-center gap-3">
          📅 Jouw mAItje Plan voor Vandaag
        </h2>
        <div className="grid gap-4 mb-6">
          <div className="flex items-center gap-4 p-4 bg-maitje-cream rounded-xl border-l-4 border-maitje-green">
            <div className="w-8 h-8 bg-maitje-green rounded-full flex items-center justify-center text-white font-bold">
              1
            </div>
            <div>
              <p className="font-semibold text-gray-800">Tafel van 7 oefenen</p>
              <p className="text-sm text-gray-600">Door elkaar • 10 minuten</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-maitje-cream rounded-xl border-l-4 border-maitje-blue">
            <div className="w-8 h-8 bg-maitje-blue rounded-full flex items-center justify-center text-white font-bold">
              2
            </div>
            <div>
              <p className="font-semibold text-gray-800">Lezen: "De Ruimtereis"</p>
              <p className="text-sm text-gray-600">Met vragen • 15 minuten</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-maitje-cream rounded-xl border-l-4 border-purple-500">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              3
            </div>
            <div>
              <p className="font-semibold text-gray-800">Engels: Dieren woordjes</p>
              <p className="text-sm text-gray-600">10 nieuwe woorden • 8 minuten</p>
            </div>
          </div>
        </div>
        
        <button className="w-full maitje-button text-xl py-6">
          Start Programma →
        </button>
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

      {/* Ouder toegang */}
      <div className="text-center">
        <button
          onClick={() => onNavigate('ouder')}
          className="flex items-center gap-2 mx-auto p-3 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-sm">Ouder Dashboard</span>
          <span className="text-lg">🔒</span>
        </button>
      </div>
    </div>
  );
};

export default KindDashboard;
