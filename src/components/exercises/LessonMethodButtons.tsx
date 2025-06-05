
import React from 'react';
import { BookOpen, Upload, Plus } from 'lucide-react';
import { useLessonMethodContent } from '@/hooks/useLessonMethodContent';

const LessonMethodButtons: React.FC = () => {
  const { content, loading } = useLessonMethodContent();

  const defaultMethods = [
    {
      name: 'Pluspunt',
      subject: 'rekenen',
      description: 'Rekenmethode Pluspunt',
      color: 'bg-orange-500',
      emoji: '📘',
    },
    {
      name: 'Nieuw Namen',
      subject: 'begrijpend_lezen',
      description: 'Leesmethode Nieuw Namen',
      color: 'bg-indigo-500',
      emoji: '📗',
    },
    {
      name: 'Take it Easy',
      subject: 'engels',
      description: 'Engelse methode Take it Easy',
      color: 'bg-pink-500',
      emoji: '📙',
    },
  ];

  const handleMethodStart = (methodName: string) => {
    console.log('Starting lesson method:', methodName);
    // Hier zou je de oefeningen voor deze methode starten
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-nunito font-bold text-gray-800">
            Lesmethoden
          </h2>
        </div>
        <p className="text-gray-600 font-nunito text-lg">
          Oefen met je bekende lesmethoden
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 border-4 border-maitje-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-nunito">Lesmethoden laden...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Standaard methoden */}
          {defaultMethods.map((method) => (
            <div key={method.name} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <div className={`${method.color} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <BookOpen className="w-8 h-8" />
                  <span className="text-4xl">{method.emoji}</span>
                </div>
                <h3 className="text-xl font-nunito font-bold mb-2">
                  {method.name}
                </h3>
                <p className="text-white text-opacity-90 text-sm">
                  {method.description}
                </p>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <div className="w-2 h-2 bg-maitje-blue rounded-full"></div>
                    <span className="font-nunito text-sm">Hoofdstuk-gebaseerde oefeningen</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <div className="w-2 h-2 bg-maitje-blue rounded-full"></div>
                    <span className="font-nunito text-sm">Aangepast aan jouw niveau</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-maitje-blue rounded-full"></div>
                    <span className="font-nunito text-sm">Voortgang bijhouden</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleMethodStart(method.name)}
                  className={`w-full ${method.color} hover:opacity-90 text-white font-nunito font-bold py-3 px-6 rounded-xl transition-all`}
                >
                  Start Oefenen →
                </button>
              </div>
            </div>
          ))}

          {/* Custom methoden uit database */}
          {content.map((method) => (
            <div key={method.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <div className="bg-gray-600 p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <BookOpen className="w-8 h-8" />
                  <span className="text-4xl">📚</span>
                </div>
                <h3 className="text-xl font-nunito font-bold mb-2">
                  {method.method_name}
                </h3>
                <p className="text-white text-opacity-90 text-sm">
                  {method.description || 'Custom lesmethode'}
                </p>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <div className="w-2 h-2 bg-maitje-blue rounded-full"></div>
                    <span className="font-nunito text-sm">Vak: {method.subject}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-maitje-blue rounded-full"></div>
                    <span className="font-nunito text-sm">Custom content</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleMethodStart(method.method_name)}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-nunito font-bold py-3 px-6 rounded-xl transition-all"
                >
                  Start Oefenen →
                </button>
              </div>
            </div>
          ))}

          {/* Placeholder voor nieuwe methode */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300 hover:border-maitje-blue transition-all duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-nunito font-bold text-gray-600 mb-2">
                Nieuwe Methode
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Voeg je eigen lesmethode toe in de ouder instellingen
              </p>
              <div className="flex items-center justify-center gap-2 text-maitje-blue">
                <Upload className="w-4 h-4" />
                <span className="font-nunito text-sm">Beheer in Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonMethodButtons;
