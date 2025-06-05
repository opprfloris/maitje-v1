
import React, { useState } from 'react';
import { Calculator, BookOpen, Globe, Target, Upload } from 'lucide-react';
import FileUploader from './FileUploader';

const QuickAccessButtons: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);

  const quickAccess = [
    {
      subject: 'rekenen',
      title: 'Rekenen',
      description: 'Sommen en getallenleer',
      icon: Calculator,
      color: 'bg-blue-500',
      emoji: '🧮',
      exercises: ['Optellen en Aftrekken', 'Vermenigvuldigen en Delen', 'Tafels Oefenen', 'Breuken', 'Hoofdrekenen', 'Verhalen Sommen']
    },
    {
      subject: 'begrijpend_lezen',
      title: 'Begrijpend Lezen',
      description: 'Teksten lezen en begrijpen',
      icon: BookOpen,
      color: 'bg-green-500',
      emoji: '📖',
      exercises: ['Korte Verhalen', 'Informatieve Teksten', 'Vraag en Antwoord', 'Samenvatten', 'Hoofdidee Vinden', 'Detail Vragen']
    },
    {
      subject: 'engels',
      title: 'Engels',
      description: 'Engelse woorden en zinnen',
      icon: Globe,
      color: 'bg-purple-500',
      emoji: '🇬🇧',
      exercises: ['Woordenschat', 'Zinnen Maken', 'Luisteroefeningen', 'Gesprekjes', 'Werkwoorden', 'Spelling']
    },
  ];

  const handleQuickStart = (subject: string) => {
    setSelectedSubject(subject);
    setShowUploader(true);
  };

  const handleAnalysisComplete = (exercises: any[]) => {
    console.log('Generated exercises:', exercises);
    // Hier zou je naar de oefeningen navigeren
    setShowUploader(false);
  };

  if (showUploader && selectedSubject) {
    const subject = quickAccess.find(s => s.subject === selectedSubject);
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setShowUploader(false)}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            ← Terug naar overzicht
          </button>
          <h2 className="text-2xl font-nunito font-bold text-gray-800">
            {subject?.title} - Upload Voorbeeld
          </h2>
        </div>
        
        <FileUploader
          subject={selectedSubject}
          onAnalysisComplete={handleAnalysisComplete}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-maitje-green rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-nunito font-bold text-gray-800">
            Start Snel
          </h2>
        </div>
        <p className="text-gray-600 font-nunito text-lg">
          Upload een voorbeeldoefening en laat AI een vergelijkbare maken!
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
                  className={`w-full ${item.color} hover:opacity-90 text-white font-nunito font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2`}
                >
                  <Upload className="w-4 h-4" />
                  Upload Voorbeeld →
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
