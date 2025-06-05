
import React from 'react';
import { BookOpen, Download, ExternalLink } from 'lucide-react';

const LessonMethodButtons: React.FC = () => {
  const freeMethods = [
    {
      name: 'Khan Academy',
      subject: 'Rekenen & Wiskunde',
      description: 'Gratis online lessen en oefeningen',
      url: 'https://nl.khanacademy.org/',
      color: 'bg-green-600',
      emoji: '🎓',
      features: ['Video lessen', 'Interactieve oefeningen', 'Voortgangsrapportage']
    },
    {
      name: 'Duolingo',
      subject: 'Engels',
      description: 'Speelse taal lessen',
      url: 'https://www.duolingo.com/',
      color: 'bg-green-500',
      emoji: '🦉',
      features: ['Gamificatie', 'Dagelijkse streaks', 'Spraakherkenning']
    },
    {
      name: 'OpenStax',
      subject: 'Verschillende vakken',
      description: 'Open source schoolboeken',
      url: 'https://openstax.org/',
      color: 'bg-blue-600',
      emoji: '📚',
      features: ['Gratis tekstboeken', 'PDF downloads', 'Peer reviewed']
    },
    {
      name: 'Scratch',
      subject: 'Programmeren',
      description: 'Leer programmeren met blokken',
      url: 'https://scratch.mit.edu/',
      color: 'bg-orange-500',
      emoji: '🐱',
      features: ['Visueel programmeren', 'Creatieve projecten', 'Community']
    },
    {
      name: 'Coursera Kids',
      subject: 'Algemeen',
      description: 'Gratis cursussen voor kinderen',
      url: 'https://www.coursera.org/',
      color: 'bg-purple-600',
      emoji: '🌟',
      features: ['Universiteitsniveau', 'Certificaten', 'Video content']
    },
    {
      name: 'BBC Bitesize',
      subject: 'Alle vakken',
      description: 'Educatieve content van de BBC',
      url: 'https://www.bbc.co.uk/bitesize',
      color: 'bg-red-600',
      emoji: '📺',
      features: ['Video content', 'Games', 'Quizzes']
    }
  ];

  const handleMethodClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-nunito font-bold text-gray-800">
            Gratis Lesmethoden
          </h2>
        </div>
        <p className="text-gray-600 font-nunito text-lg">
          Ontdek gratis educatieve platforms en tools
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {freeMethods.map((method) => (
          <div 
            key={method.name} 
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <div className={`${method.color} p-6 text-white`}>
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="w-8 h-8" />
                <span className="text-4xl">{method.emoji}</span>
              </div>
              <h3 className="text-xl font-nunito font-bold mb-2">
                {method.name}
              </h3>
              <p className="text-white text-opacity-90 text-sm">
                {method.subject}
              </p>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                {method.description}
              </p>
              
              <h4 className="font-nunito font-semibold text-gray-800 mb-3">
                Kenmerken:
              </h4>
              <div className="space-y-2 mb-6">
                {method.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="font-nunito text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => handleMethodClick(method.url)}
                className={`w-full ${method.color} hover:opacity-90 text-white font-nunito font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2`}
              >
                <ExternalLink className="w-4 h-4" />
                Ga naar {method.name}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Upload Option */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-dashed border-blue-200">
        <div className="text-center">
          <Download className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-nunito font-bold text-gray-800 mb-2">
            Eigen Lesmethode Toevoegen
          </h3>
          <p className="text-gray-600 mb-4">
            Heb je eigen materialen? Upload ze via het Dev Dashboard
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-nunito font-bold py-2 px-6 rounded-lg transition-colors">
            Naar Dev Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonMethodButtons;
