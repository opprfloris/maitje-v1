
import React from 'react';
import { Calculator, BookOpen, Globe, Target } from 'lucide-react';

const QuickAccessButtons: React.FC = () => {
  const quickAccess = [
    {
      subject: 'rekenen',
      title: 'Rekenen',
      description: 'Sommen en getallenleer',
      icon: Calculator,
      color: 'bg-blue-500',
      emoji: '🧮',
      exercises: ['Optellen en Aftrekken', 'Tafels', 'Breuken', 'Meetkunde']
    },
    {
      subject: 'begrijpend_lezen',
      title: 'Begrijpend Lezen',
      description: 'Teksten lezen en begrijpen',
      icon: BookOpen,
      color: 'bg-green-500',
      emoji: '📖',
      exercises: ['Korte Verhalen', 'Informatieve Teksten', 'Gedichten', 'Stripverhalen']
    },
    {
      subject: 'engels',
      title: 'Engels',
      description: 'Engelse woorden en zinnen',
      icon: Globe,
      color: 'bg-purple-500',
      emoji: '🇬🇧',
      exercises: ['Woordenschat', 'Luisteroefeningen', 'Gesprekjes', 'Schrijfoefeningen']
    },
  ];

  const handleQuickStart = (subject: string) => {
    console.log('Starting quick exercise for:', subject);
    // Hier zou je naar de specifieke oefening navigeren
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-maitje-green rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-nunito font-bold text-gray-800">
            Snelkoppelingen
          </h2>
        </div>
        <p className="text-gray-600 font-nunito text-lg">
          Start direct met je favoriete vakken!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickAccess.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.subject} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <div className={`${item.color} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <IconComponent className="w-8 h-8" />
                  <span className="text-4xl">{item.emoji}</span>
                </div>
                <h3 className="text-2xl font-nunito font-bold mb-2">
                  {item.title}
                </h3>
                <p className="text-white text-opacity-90">
                  {item.description}
                </p>
              </div>
              
              <div className="p-6">
                <h4 className="font-nunito font-semibold text-gray-800 mb-3">
                  Beschikbare oefeningen:
                </h4>
                <div className="space-y-2 mb-6">
                  {item.exercises.map((exercise, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-600">
                      <div className="w-2 h-2 bg-maitje-blue rounded-full"></div>
                      <span className="font-nunito text-sm">{exercise}</span>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => handleQuickStart(item.subject)}
                  className={`w-full ${item.color} hover:opacity-90 text-white font-nunito font-bold py-3 px-6 rounded-xl transition-all`}
                >
                  Start Nu →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickAccessButtons;
