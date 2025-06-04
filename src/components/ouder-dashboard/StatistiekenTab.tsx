
import React, { useState } from 'react';
import { BarChart, Calendar, TrendingUp, Clock, Award, MessageSquare, ChevronDown } from 'lucide-react';
import { LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatistiekenTab = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('deze_week');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showCustomPeriod, setShowCustomPeriod] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');

  console.log('Statistieken tab loaded, selected period:', selectedPeriod);

  // Mock data voor grafieken
  const voortgangData = [
    { naam: 'Ma', rekenen: 85, lezen: 92, engels: 78 },
    { naam: 'Di', rekenen: 88, lezen: 89, engels: 82 },
    { naam: 'Wo', rekenen: 92, lezen: 94, engels: 85 },
    { naam: 'Do', rekenen: 87, lezen: 88, engels: 79 },
    { naam: 'Vr', rekenen: 95, lezen: 96, engels: 88 },
  ];

  const tijdData = [
    { dag: 'Maandag', tijd: 18 },
    { dag: 'Dinsdag', tijd: 22 },
    { dag: 'Woensdag', tijd: 15 },
    { dag: 'Donderdag', tijd: 20 },
    { dag: 'Vrijdag', tijd: 25 },
  ];

  const levelEvolutieData = [
    { week: 'Week 1', level: 4.2 },
    { week: 'Week 2', level: 4.5 },
    { week: 'Week 3', level: 4.8 },
    { week: 'Week 4', level: 5.1 },
    { week: 'Week 5', level: 5.3 },
  ];

  const handleCustomPeriodApply = () => {
    if (customStartDate && customEndDate) {
      setSelectedPeriod('custom');
      console.log('Custom period applied:', customStartDate, 'to', customEndDate);
      // Hier zou je de data kunnen filteren op basis van de geselecteerde periode
    }
  };

  const handleAiQuestion = () => {
    if (aiQuestion.trim()) {
      console.log('AI Question asked:', aiQuestion);
      // Hier zou je de AI query kunnen verwerken
      setAiQuestion('');
    }
  };

  const aiInsights = [
    "Joos scoort consistent hoog op begrijpend lezen met informatieve teksten",
    "De tafels van 6 en 8 hebben nog extra aandacht nodig",
    "Engels woordenschat groeit gestaag, vooral bij dieren en kleuren",
    "Beste prestaties worden geleverd tussen 16:00-17:00"
  ];

  const gepersonaliseerdeAanbevelingen = [
    "Focus deze week extra op de tafel van 8 met spel-elementen",
    "Voeg meer dinosaurus-thema toe aan rekensommen (interesse van Joos)",
    "Probeer korte 10-minuten sessies voor Engels in plaats van 20 minuten",
    "Beloon goede scores met extra keuze in volgende oefening"
  ];

  const recenteOefeningen = [
    { datum: '2025-06-04', oefening: 'Tafel van 7', score: '9/10', tijd: '8 min' },
    { datum: '2025-06-04', oefening: 'Leestekst: De Hond', score: '8/8', tijd: '12 min' },
    { datum: '2025-06-03', oefening: 'Engels: Kleuren', score: '7/8', tijd: '6 min' },
    { datum: '2025-06-03', oefening: 'Hoofdrekenen tot 50', score: '12/15', tijd: '10 min' },
    { datum: '2025-06-02', oefening: 'Spelling: -ij woorden', score: '6/8', tijd: '7 min' },
  ];

  return (
    <div className="space-y-6">
      {/* Periode Selectie */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-gray-600" />
          <h3 className="text-xl font-nunito font-bold text-gray-800">Periode Selectie</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Snelle Selectie</label>
            <select
              value={selectedPeriod}
              onChange={(e) => {
                setSelectedPeriod(e.target.value);
                if (e.target.value !== 'custom') {
                  setShowCustomPeriod(false);
                }
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
            >
              <option value="deze_week">Deze Week</option>
              <option value="vorige_week">Vorige Week</option>
              <option value="deze_maand">Deze Maand</option>
              <option value="vorige_maand">Vorige Maand</option>
              <option value="afgelopen_3_maanden">Afgelopen 3 Maanden</option>
              <option value="dit_jaar">Dit Jaar</option>
              <option value="alles">Alles</option>
              <option value="custom">Aangepaste Periode</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Specifieke Periode</label>
            <button
              onClick={() => setShowCustomPeriod(!showCustomPeriod)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none flex items-center justify-between hover:bg-gray-50"
            >
              <span>{showCustomPeriod ? 'Verberg datum kiezer' : 'Kies specifieke datums'}</span>
              <ChevronDown className={`w-4 h-4 transform transition-transform ${showCustomPeriod ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {showCustomPeriod && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Van Datum</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tot Datum</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
                />
              </div>
              <div>
                <button
                  onClick={handleCustomPeriodApply}
                  disabled={!customStartDate || !customEndDate}
                  className="w-full maitje-button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Toepassen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Basis Statistieken */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-green-500" />
          <h3 className="text-xl font-nunito font-bold text-gray-800">
            Deze Week - {selectedPeriod === 'custom' && customStartDate && customEndDate 
              ? `${new Date(customStartDate).toLocaleDateString('nl-NL')} - ${new Date(customEndDate).toLocaleDateString('nl-NL')}`
              : 'Overzicht'}
          </h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">12/15</div>
            <div className="text-sm text-gray-600">Rekenen oefeningen</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">8/10</div>
            <div className="text-sm text-gray-600">Lezen oefeningen</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">6/8</div>
            <div className="text-sm text-gray-600">Engels oefeningen</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">87%</div>
            <div className="text-sm text-gray-600">Correcte antwoorden</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">5</div>
            <div className="text-sm text-gray-600">Actieve dagen</div>
          </div>
        </div>
      </div>

      {/* Grafieken */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voortgang per Module */}
        <div className="maitje-card">
          <h4 className="text-lg font-nunito font-bold text-gray-800 mb-4">Voortgang per Module</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={voortgangData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="naam" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rekenen" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="lezen" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="engels" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Tijd Besteed */}
        <div className="maitje-card">
          <h4 className="text-lg font-nunito font-bold text-gray-800 mb-4">Tijd Besteed (minuten)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={tijdData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dag" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tijd" fill="#06B6D4" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leerlevel Evolutie */}
      <div className="maitje-card">
        <h4 className="text-lg font-nunito font-bold text-gray-800 mb-4">Leerlevel Evolutie</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={levelEvolutieData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis domain={[3, 7]} />
            <Tooltip />
            <Line type="monotone" dataKey="level" stroke="#F59E0B" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recente Oefeningen */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6 text-blue-500" />
          <h4 className="text-lg font-nunito font-bold text-gray-800">Recente Oefeningen</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Datum</th>
                <th className="text-left py-2">Oefening</th>
                <th className="text-left py-2">Score</th>
                <th className="text-left py-2">Tijd</th>
              </tr>
            </thead>
            <tbody>
              {recenteOefeningen.map((oefening, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 text-sm text-gray-600">{new Date(oefening.datum).toLocaleDateString('nl-NL')}</td>
                  <td className="py-3 font-medium text-gray-800">{oefening.oefening}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      parseInt(oefening.score.split('/')[0]) / parseInt(oefening.score.split('/')[1]) >= 0.8
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {oefening.score}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-600">{oefening.tijd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Analyse */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Inzichten */}
        <div className="maitje-card">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-yellow-500" />
            <h4 className="text-lg font-nunito font-bold text-gray-800">AI Analyse: Sterke & Zwakke Punten</h4>
          </div>
          
          <div className="space-y-3">
            {aiInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-blue-800 text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Gepersonaliseerde Aanbevelingen */}
        <div className="maitje-card">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <h4 className="text-lg font-nunito font-bold text-gray-800">AI Gepersonaliseerde Aanbevelingen</h4>
          </div>
          
          <div className="space-y-3">
            {gepersonaliseerdeAanbevelingen.map((aanbeveling, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-green-800 text-sm">{aanbeveling}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Chatbot */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="w-6 h-6 text-purple-500" />
          <h4 className="text-lg font-nunito font-bold text-gray-800">Vraag mAItje over de Statistieken</h4>
        </div>
        
        <div className="flex gap-3">
          <input
            type="text"
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            placeholder="Bijv. 'Welke rekenonderdelen hebben de meeste aandacht nodig?' of 'Hoe verhoudt de voortgang van deze maand zich tot vorige maand?'"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
            onKeyPress={(e) => e.key === 'Enter' && handleAiQuestion()}
          />
          <button
            onClick={handleAiQuestion}
            disabled={!aiQuestion.trim()}
            className="maitje-button px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Vraag
          </button>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Voorbeeldvragen:</strong></p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Welke rekenonderdelen hebben de meeste aandacht nodig?</li>
            <li>Geef tips om de tafels van 8 te verbeteren</li>
            <li>Op basis van de huidige voortgang, welk thema zou volgende week goed aansluiten?</li>
            <li>Wat is de ideale studietijd voor mijn kind?</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StatistiekenTab;
