
import React from 'react';
import { Book, Calculator, User } from 'lucide-react';
import { AppView } from './MaitjeApp';

interface Props {
  childName: string;
  onNavigate: (view: AppView) => void;
}

const KindDashboard = ({ childName, onNavigate }: Props) => {
  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
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
        <p className="text-xl text-gray-600 font-nunito">
          Uli de uil helpt je vandaag met leren!
        </p>
      </div>

      {/* Jouw Maitje Plan voor Vandaag */}
      <div className="maitje-card mb-8">
        <h2 className="text-2xl font-nunito font-bold text-gray-800 mb-4 flex items-center gap-3">
          📅 Jouw Maitje Plan voor Vandaag
        </h2>
        <div className="grid gap-4">
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
        </div>
      </div>

      {/* Hoofdmenu knoppen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
              <p className="text-gray-600">Oefen je tafels</p>
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
      </div>

      {/* Ouder toegang */}
      <div className="text-center">
        <button
          onClick={() => onNavigate('ouder')}
          className="flex items-center gap-2 mx-auto p-3 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-sm">Ouder/Verzorger toegang</span>
          <span className="text-lg">🔒</span>
        </button>
      </div>
    </div>
  );
};

export default KindDashboard;
