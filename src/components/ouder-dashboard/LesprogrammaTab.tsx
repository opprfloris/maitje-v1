
import React, { useState } from 'react';
import { Calendar, Plus, Save, Wand2, ChevronLeft, ChevronRight } from 'lucide-react';

const LesprogrammaTab = () => {
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = current week, 1 = next week, etc.
  const [focusArea, setFocusArea] = useState('balanced');
  const [weekTheme, setWeekTheme] = useState('');
  
  const weekProgram = [
    { 
      day: 'Maandag', 
      exercises: [
        { id: '1', title: 'Tafel van 5 (door elkaar)', type: 'rekenen', time: '10 min' },
        { id: '2', title: 'Leestekst: De Hond', type: 'lezen', time: '15 min' },
        { id: '3', title: 'Engels: Kleuren', type: 'engels', time: '8 min' }
      ]
    },
    { 
      day: 'Dinsdag', 
      exercises: [
        { id: '4', title: 'Tafel van 7 (op volgorde)', type: 'rekenen', time: '10 min' },
        { id: '5', title: 'Leestekst: Het Verloren Katje', type: 'lezen', time: '12 min' }
      ]
    },
    { 
      day: 'Woensdag', 
      exercises: [
        { id: '6', title: 'Tafel van 3 (door elkaar)', type: 'rekenen', time: '10 min' },
        { id: '7', title: 'Engels: Dieren', type: 'engels', time: '8 min' }
      ]
    },
    { 
      day: 'Donderdag', 
      exercises: [
        { id: '8', title: 'Tafel van 8 (op volgorde)', type: 'rekenen', time: '10 min' },
        { id: '9', title: 'Leestekst: De Ruimtereis', type: 'lezen', time: '15 min' },
        { id: '10', title: 'Engels: Schoolspullen', type: 'engels', time: '8 min' }
      ]
    },
    { 
      day: 'Vrijdag', 
      exercises: [
        { id: '11', title: 'Herhaling alle tafels', type: 'rekenen', time: '15 min' },
        { id: '12', title: 'Leestekst: Het Geheime Bos', type: 'lezen', time: '12 min' }
      ]
    }
  ];

  const generateProgram = () => {
    console.log('Generating AI program with focus:', focusArea, 'theme:', weekTheme);
    // AI integration would happen here
  };

  const getExerciseColor = (type: string) => {
    switch (type) {
      case 'rekenen': return 'border-maitje-green bg-green-50';
      case 'lezen': return 'border-maitje-blue bg-blue-50';
      case 'engels': return 'border-purple-500 bg-purple-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const weekDates = [
    'Deze week (4-8 Nov)',
    'Volgende week (11-15 Nov)',
    'Week daarna (18-22 Nov)',
    'Week erna (25-29 Nov)'
  ];

  return (
    <div className="space-y-6">
      {/* Week Navigator */}
      <div className="maitje-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-nunito font-bold text-gray-800">Weekprogramma Planning</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedWeek(Math.max(0, selectedWeek - 1))}
              disabled={selectedWeek === 0}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 bg-maitje-blue text-white rounded-lg font-semibold">
              {weekDates[selectedWeek] || `Week +${selectedWeek}`}
            </span>
            <button
              onClick={() => setSelectedWeek(selectedWeek + 1)}
              disabled={selectedWeek >= 3}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* AI Controls */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <Wand2 className="w-5 h-5 text-purple-500" />
          <h3 className="text-xl font-nunito font-bold text-gray-800">AI Programma Generatie</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Focus instellen voor mAItje</label>
            <select
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
            >
              <option value="balanced">Gebalanceerd</option>
              <option value="rekenen">Meer focus op Rekenen</option>
              <option value="lezen">Meer focus op Lezen</option>
              <option value="engels">Meer focus op Engels</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Overkoepelend Thema (optioneel)</label>
            <input
              type="text"
              value={weekTheme}
              onChange={(e) => setWeekTheme(e.target.value)}
              placeholder="bijv. Avontuur, Natuur, Ruimtevaart"
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
            />
          </div>
        </div>
        
        <button
          onClick={generateProgram}
          className="w-full maitje-button flex items-center justify-center gap-2"
        >
          <Wand2 className="w-4 h-4" />
          Genereer programma voor {weekDates[selectedWeek]?.toLowerCase() || 'geselecteerde week'}
        </button>
      </div>

      {/* Week Program */}
      <div className="maitje-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-maitje-blue" />
            <h2 className="text-2xl font-nunito font-bold text-gray-800">Weekprogramma {weekDates[selectedWeek]}</h2>
          </div>
          <button className="maitje-button flex items-center gap-2">
            <Save className="w-4 h-4" />
            Opslaan & Publiceren
          </button>
        </div>
        
        <div className="space-y-4">
          {weekProgram.map((day, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-nunito font-bold text-lg text-gray-800">{day.day}</h3>
                <button className="p-2 text-maitje-green hover:bg-green-50 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                {day.exercises.map((exercise, exIndex) => (
                  <div key={exIndex} className={`flex items-center justify-between p-3 rounded-lg border-2 ${getExerciseColor(exercise.type)}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-sm font-bold border">
                        {exIndex + 1}
                      </div>
                      <div>
                        <span className="text-gray-800 font-medium">{exercise.title}</span>
                        <span className="text-gray-600 text-sm ml-2">• {exercise.time}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="px-2 py-1 text-xs bg-white rounded hover:bg-gray-50 border">
                        Vervang
                      </button>
                      <button className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded">
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border-l-4 border-maitje-blue">
          <p className="text-sm text-gray-700">
            💡 <strong>mAItje Tip:</strong> Sleep oefeningen tussen dagen, klik op 'Vervang' voor alternatieven, of voeg nieuwe oefeningen toe met de + knop.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LesprogrammaTab;
