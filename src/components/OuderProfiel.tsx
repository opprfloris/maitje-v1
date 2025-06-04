
import React, { useState } from 'react';
import { User, Settings, Calendar, BarChart } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const OuderProfiel = ({ onBack }: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState(false);
  const [childLevel, setChildLevel] = useState('Groep 5');

  console.log('Ouder profiel loaded, authenticated:', isAuthenticated);

  const handlePinSubmit = () => {
    if (pinCode === '1234') { // Voor MVP een simpele pincode
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinCode('');
    }
  };

  const weekProgram = [
    { day: 'Maandag', exercises: ['Tafel van 5 (door elkaar)', 'Leestekst: De Hond'] },
    { day: 'Dinsdag', exercises: ['Tafel van 7 (op volgorde)', 'Leestekst: Het Verloren Katje'] },
    { day: 'Woensdag', exercises: ['Tafel van 3 (door elkaar)'] },
    { day: 'Donderdag', exercises: ['Tafel van 8 (op volgorde)', 'Leestekst: De Ruimtereis'] },
    { day: 'Vrijdag', exercises: ['Herhaling alle tafels', 'Leestekst: Het Geheime Bos'] }
  ];

  // Pincode invoer scherm
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen p-6 max-w-md mx-auto flex items-center justify-center">
        <div className="maitje-card w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-maitje-blue rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-nunito font-bold text-gray-800">Ouder/Verzorger Toegang</h1>
            <p className="text-gray-600 mt-2">Voer uw 4-cijferige pincode in</p>
          </div>

          <div className="space-y-4">
            <input
              type="password"
              maxLength={4}
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className={`w-full text-center text-2xl font-bold border-2 rounded-xl p-4 tracking-widest ${
                pinError ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-maitje-blue'
              } focus:outline-none`}
              autoFocus
            />

            {pinError && (
              <p className="text-red-600 text-center">Onjuiste pincode. Probeer opnieuw.</p>
            )}

            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map((num, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (num === '⌫') {
                      setPinCode(prev => prev.slice(0, -1));
                    } else if (num !== '' && pinCode.length < 4) {
                      setPinCode(prev => prev + num);
                    }
                  }}
                  className={`h-12 rounded-lg font-bold text-lg ${
                    num === '' 
                      ? 'invisible' 
                      : 'bg-gray-100 hover:bg-gray-200 transition-colors'
                  }`}
                  disabled={num === ''}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              onClick={handlePinSubmit}
              disabled={pinCode.length !== 4}
              className="w-full maitje-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Inloggen
            </button>

            <button onClick={onBack} className="w-full maitje-button-secondary">
              Annuleren
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            Voor demo: gebruik pincode 1234
          </div>
        </div>
      </div>
    );
  }

  // Ouder dashboard
  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-nunito font-bold text-gray-800">Ouder Dashboard</h1>
        <button onClick={onBack} className="maitje-button-secondary px-4 py-2">
          Uitloggen
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Weekprogramma */}
        <div className="lg:col-span-2">
          <div className="maitje-card">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-maitje-blue" />
              <h2 className="text-2xl font-nunito font-bold text-gray-800">Weekprogramma Beheer</h2>
            </div>
            
            <div className="space-y-4">
              {weekProgram.map((day, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4">
                  <h3 className="font-nunito font-bold text-lg text-gray-800 mb-2">{day.day}</h3>
                  <div className="space-y-2">
                    {day.exercises.map((exercise, exIndex) => (
                      <div key={exIndex} className="flex items-center gap-3 p-2 bg-maitje-cream rounded-lg">
                        <div className="w-6 h-6 bg-maitje-green rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {exIndex + 1}
                        </div>
                        <span className="text-gray-700">{exercise}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border-l-4 border-maitje-blue">
              <p className="text-sm text-gray-700">
                💡 <strong>AI Tip:</strong> Dit weekprogramma is automatisch gegenereerd op basis van het niveau van uw kind en eerdere prestaties.
              </p>
            </div>
          </div>
        </div>

        {/* Instellingen en statistieken */}
        <div className="space-y-6">
          {/* Kind niveau instelling */}
          <div className="maitje-card">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-5 h-5 text-maitje-green" />
              <h3 className="text-xl font-nunito font-bold text-gray-800">Kind Instellingen</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Groepsniveau</label>
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
              
              <button className="w-full maitje-button text-sm">
                Instellingen Opslaan
              </button>
            </div>
          </div>

          {/* Voortgang statistieken */}
          <div className="maitje-card">
            <div className="flex items-center gap-3 mb-4">
              <BarChart className="w-5 h-5 text-maitje-blue" />
              <h3 className="text-xl font-nunito font-bold text-gray-800">Deze Week</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Rekenen oefeningen</span>
                <span className="font-bold text-maitje-green">12/15</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Lezen oefeningen</span>
                <span className="font-bold text-maitje-blue">8/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Gemiddelde score</span>
                <span className="font-bold text-gray-800">87%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OuderProfiel;
