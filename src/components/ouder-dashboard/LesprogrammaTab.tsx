
import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Settings, Plus, ChevronLeft, ChevronRight, Check, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const LesprogrammaTab = () => {
  const { user } = useAuth();
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [moeilijkheidsgraad, setMoeilijkheidsgraad] = useState<'makkelijker' | 'op_niveau' | 'uitdagend'>('op_niveau');
  const [kindNiveau, setKindNiveau] = useState(5);
  const [weekProgrammas, setWeekProgrammas] = useState<any[]>([]);
  
  const dagen = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'];

  console.log('Lesprogramma tab loaded, selected week:', selectedWeek);

  function getCurrentWeek() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + start.getDay() + 1) / 7);
  }

  useEffect(() => {
    if (user) {
      loadWeekProgrammas();
    }
  }, [user, selectedYear]);

  const loadWeekProgrammas = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('weekly_programs')
        .select('*')
        .eq('user_id', user.id)
        .eq('year', selectedYear)
        .order('week_number');

      if (error) {
        console.error('Error loading weekly programs:', error);
        return;
      }

      setWeekProgrammas(data || []);
    } catch (error) {
      console.error('Error loading weekly programs:', error);
    }
  };

  const getWeekStatus = (weekNumber: number) => {
    const weekData = weekProgrammas.find(w => w.week_number === weekNumber);
    return weekData?.status || 'empty';
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedWeek > 1) {
        setSelectedWeek(selectedWeek - 1);
      } else if (selectedYear > 2024) {
        setSelectedYear(selectedYear - 1);
        setSelectedWeek(52);
      }
    } else {
      if (selectedWeek < 52) {
        setSelectedWeek(selectedWeek + 1);
      } else {
        setSelectedYear(selectedYear + 1);
        setSelectedWeek(1);
      }
    }
  };

  const generateWeekProgram = async () => {
    if (!user) return;

    try {
      const programData = {
        user_id: user.id,
        year: selectedYear,
        week_number: selectedWeek,
        status: 'draft',
        difficulty_level: moeilijkheidsgraad,
        program_data: generateMockProgram(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('weekly_programs')
        .upsert(programData);

      if (error) {
        throw error;
      }

      await loadWeekProgrammas();
    } catch (error) {
      console.error('Error generating week program:', error);
    }
  };

  const generateMockProgram = () => {
    return [
      {
        dag: 'Maandag',
        oefeningen: [
          { titel: 'Tafel van 6', type: 'rekenen', tijd: '10 min' },
          { titel: 'Leestekst: Het Bos', type: 'lezen', tijd: '15 min' }
        ]
      },
      {
        dag: 'Dinsdag', 
        oefeningen: [
          { titel: 'Hoofdrekenen tot 100', type: 'rekenen', tijd: '12 min' },
          { titel: 'Engels: Dieren', type: 'engels', tijd: '10 min' }
        ]
      },
      {
        dag: 'Woensdag',
        oefeningen: [
          { titel: 'Spelling: -ij woorden', type: 'lezen', tijd: '8 min' },
          { titel: 'Tafel van 7', type: 'rekenen', tijd: '10 min' }
        ]
      },
      {
        dag: 'Donderdag',
        oefeningen: [
          { titel: 'Begrijpend lezen', type: 'lezen', tijd: '20 min' },
          { titel: 'Engels: Kleuren', type: 'engels', tijd: '8 min' }
        ]
      },
      {
        dag: 'Vrijdag',
        oefeningen: [
          { titel: 'Gemengd rekenen', type: 'rekenen', tijd: '15 min' },
          { titel: 'Woordenschat uitbreiden', type: 'lezen', tijd: '12 min' }
        ]
      }
    ];
  };

  const currentWeekData = weekProgrammas.find(w => w.week_number === selectedWeek && w.year === selectedYear);

  return (
    <div className="space-y-6">
      {/* Week Navigator & Status Timeline */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-gray-600" />
          <h3 className="text-xl font-nunito font-bold text-gray-800">Weekprogramma Beheer</h3>
        </div>

        {/* Week Timeline */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Weekoverzicht {selectedYear}</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {Array.from({ length: 52 }, (_, i) => i + 1).map((week) => {
              const status = getWeekStatus(week);
              const isSelected = week === selectedWeek;
              
              return (
                <button
                  key={week}
                  onClick={() => setSelectedWeek(week)}
                  className={`w-10 h-10 rounded-lg text-xs font-semibold transition-colors ${
                    isSelected 
                      ? 'bg-maitje-blue text-white ring-2 ring-maitje-blue/30' 
                      : status === 'published'
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {week}
                </button>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 rounded"></div>
              <span>Gepubliceerd</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-100 rounded"></div>
              <span>Concept</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-100 rounded"></div>
              <span>Leeg</span>
            </div>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateWeek('prev')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Vorige Week
          </button>
          
          <div className="text-center">
            <h4 className="text-lg font-bold text-gray-800">Week {selectedWeek} - {selectedYear}</h4>
            <p className="text-sm text-gray-600">
              Status: {currentWeekData?.status === 'published' ? 'Gepubliceerd' : 
                      currentWeekData?.status === 'draft' ? 'Concept' : 'Leeg'}
            </p>
          </div>
          
          <button
            onClick={() => navigateWeek('next')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Volgende Week
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Kind Niveau & Moeilijkheidsgraad */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-nunito font-bold text-gray-800">Niveau & Moeilijkheidsgraad</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kind Niveau Indicator */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Huidig Niveau Kind</label>
            <div className="bg-gradient-to-r from-red-100 via-yellow-100 to-green-100 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Beginner</span>
                <span className="text-sm text-gray-600">Gevorderd</span>
              </div>
              <div className="relative h-3 bg-gray-200 rounded-full">
                <div 
                  className="absolute h-3 bg-gradient-to-r from-maitje-blue to-maitje-green rounded-full"
                  style={{ width: `${(kindNiveau / 10) * 100}%` }}
                ></div>
                <div 
                  className="absolute w-4 h-4 bg-white border-2 border-maitje-blue rounded-full -top-0.5"
                  style={{ left: `calc(${(kindNiveau / 10) * 100}% - 8px)` }}
                ></div>
              </div>
              <div className="text-center mt-2">
                <span className="text-lg font-bold text-maitje-blue">Niveau {kindNiveau}</span>
              </div>
            </div>
          </div>

          {/* Moeilijkheidsgraad Instelling */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Moeilijkheidsgraad Instelling</label>
            <div className="space-y-2">
              {[
                { value: 'makkelijker', label: 'Makkelijker', desc: 'Voor extra ondersteuning', color: 'green' },
                { value: 'op_niveau', label: 'Op Niveau', desc: 'Passend bij huidige kunnen', color: 'blue' },
                { value: 'uitdagend', label: 'Uitdagend', desc: 'Voor snellere progressie', color: 'purple' }
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="moeilijkheidsgraad"
                    value={option.value}
                    checked={moeilijkheidsgraad === option.value}
                    onChange={(e) => setMoeilijkheidsgraad(e.target.value as any)}
                    className="w-4 h-4 text-maitje-blue"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weekprogramma Weergave */}
      <div className="maitje-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-nunito font-bold text-gray-800">Week {selectedWeek} Programma</h3>
          <div className="flex gap-3">
            <button
              onClick={generateWeekProgram}
              className="maitje-button flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Genereer Programma
            </button>
            {currentWeekData?.status === 'draft' && (
              <button className="maitje-button-secondary">
                <Check className="w-4 h-4 mr-2" />
                Publiceren
              </button>
            )}
          </div>
        </div>

        {currentWeekData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {currentWeekData.program_data.map((dag: any, index: number) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-3 text-center">{dag.dag}</h4>
                <div className="space-y-3">
                  {dag.oefeningen.map((oefening: any, oefeningIndex: number) => (
                    <div key={oefeningIndex} className="bg-white p-3 rounded-lg border">
                      <div className="font-semibold text-sm text-gray-800 mb-1">{oefening.titel}</div>
                      <div className="flex items-center justify-between text-xs">
                        <span className={`px-2 py-1 rounded-full ${
                          oefening.type === 'rekenen' ? 'bg-blue-100 text-blue-800' :
                          oefening.type === 'lezen' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {oefening.type}
                        </span>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-3 h-3" />
                          {oefening.tijd}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h4 className="text-lg font-semibold mb-2">Geen programma voor deze week</h4>
            <p className="mb-4">Klik op "Genereer Programma" om een nieuw weekprogramma te maken</p>
          </div>
        )}

        {currentWeekData && (
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800">
              <strong>mAItje Tip:</strong> Dit weekprogramma is automatisch gegenereerd op basis van het niveau van uw kind en eerdere prestaties. 
              U kunt oefeningen aanpassen door erop te klikken.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LesprogrammaTab;
