
import React, { useState } from 'react';
import { BarChart, TrendingUp, MessageSquare, Clock, Target } from 'lucide-react';

const StatistiekenTab = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const askAI = () => {
    // Mock AI response
    setAiResponse(`Op basis van de data zie ik dat ${profile?.child_name || 'uw kind'} sterke vooruitgang boekt in rekenen, maar Engels heeft nog wat extra aandacht nodig. Ik raad aan om volgende week meer focus te leggen op Engelse woordenschat.`);
  };

  const profile = { child_name: 'Joos' }; // Mock profile

  return (
    <div className="space-y-6">
      {/* Periode Selectie */}
      <div className="maitje-card">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-nunito font-bold text-gray-800">Voortgang Overzicht</h3>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
          >
            <option value="week">Deze week</option>
            <option value="lastweek">Vorige week</option>
            <option value="month">Deze maand</option>
            <option value="quarter">Afgelopen 3 maanden</option>
            <option value="all">Alles</option>
          </select>
        </div>
      </div>

      {/* Basisstatistieken */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="maitje-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-maitje-green rounded-full flex items-center justify-center">
              <span className="text-white text-sm">📊</span>
            </div>
            <h4 className="font-semibold text-gray-800">Rekenen</h4>
          </div>
          <div className="text-2xl font-bold text-maitje-green">12/15</div>
          <p className="text-sm text-gray-600">oefeningen voltooid</p>
        </div>

        <div className="maitje-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-maitje-blue rounded-full flex items-center justify-center">
              <span className="text-white text-sm">📖</span>
            </div>
            <h4 className="font-semibold text-gray-800">Lezen</h4>
          </div>
          <div className="text-2xl font-bold text-maitje-blue">8/10</div>
          <p className="text-sm text-gray-600">teksten gelezen</p>
        </div>

        <div className="maitje-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🌍</span>
            </div>
            <h4 className="font-semibold text-gray-800">Engels</h4>
          </div>
          <div className="text-2xl font-bold text-purple-500">6/8</div>
          <p className="text-sm text-gray-600">woordensets</p>
        </div>

        <div className="maitje-card">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-orange-500" />
            <h4 className="font-semibold text-gray-800">Nauwkeurigheid</h4>
          </div>
          <div className="text-2xl font-bold text-orange-500">87%</div>
          <p className="text-sm text-gray-600">correct beantwoord</p>
        </div>

        <div className="maitje-card">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-blue-500" />
            <h4 className="font-semibold text-gray-800">Tijd besteed</h4>
          </div>
          <div className="text-2xl font-bold text-blue-500">2h 45m</div>
          <p className="text-sm text-gray-600">deze week</p>
        </div>

        <div className="maitje-card">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <h4 className="font-semibold text-gray-800">Actieve dagen</h4>
          </div>
          <div className="text-2xl font-bold text-green-500">5</div>
          <p className="text-sm text-gray-600">van de 7 dagen</p>
        </div>
      </div>

      {/* AI Analyse */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-purple-500" />
          <h3 className="text-xl font-nunito font-bold text-gray-800">AI Analyse: Sterke & Zwakke Punten</h3>
        </div>
        
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">🎯 Sterkste punten:</h4>
          <ul className="text-purple-700 space-y-1 mb-4">
            <li>• Uitstekende prestaties bij tafels van 2, 5 en 10</li>
            <li>• Zeer goede tekstbegrip bij informatieve verhalen</li>
            <li>• Consistent actief: elke dag geoefend</li>
          </ul>
          
          <h4 className="font-semibold text-purple-800 mb-2">📈 Aandachtspunten:</h4>
          <ul className="text-purple-700 space-y-1">
            <li>• Tafels van 6 en 8 hebben extra oefening nodig</li>
            <li>• Engelse uitspraak kan worden verbeterd</li>
            <li>• Concentratie neemt af na 15 minuten oefenen</li>
          </ul>
        </div>
      </div>

      {/* AI Chatbot */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="w-6 h-6 text-maitje-green" />
          <h3 className="text-xl font-nunito font-bold text-gray-800">Vraag mAItje over de statistieken</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              placeholder="Bijv. 'Welke rekenonderdelen hebben de meeste aandacht nodig?'"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
            />
            <button
              onClick={askAI}
              className="px-6 py-3 bg-maitje-green text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Vraag
            </button>
          </div>
          
          {aiResponse && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-maitje-green rounded-full flex items-center justify-center text-white text-sm">
                  🦉
                </div>
                <div>
                  <p className="text-gray-800">{aiResponse}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recente Oefeningen */}
      <div className="maitje-card">
        <h3 className="text-xl font-nunito font-bold text-gray-800 mb-4">Recente Oefeningen</h3>
        
        <div className="space-y-3">
          {[
            { date: '6 nov', exercise: 'Tafel van 7 (door elkaar)', score: '9/10', time: '8 min', type: 'rekenen' },
            { date: '6 nov', exercise: 'Leestekst: De Ruimtereis', score: '4/5', time: '12 min', type: 'lezen' },
            { date: '5 nov', exercise: 'Engels: Dieren woordjes', score: '8/10', time: '6 min', type: 'engels' },
            { date: '5 nov', exercise: 'Tafel van 5 (op volgorde)', score: '10/10', time: '5 min', type: 'rekenen' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  item.type === 'rekenen' ? 'bg-maitje-green' :
                  item.type === 'lezen' ? 'bg-maitje-blue' : 'bg-purple-500'
                }`}></div>
                <div>
                  <p className="font-semibold text-gray-800">{item.exercise}</p>
                  <p className="text-sm text-gray-600">{item.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">{item.score}</p>
                <p className="text-sm text-gray-600">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatistiekenTab;
