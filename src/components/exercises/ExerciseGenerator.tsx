
import React, { useState } from 'react';
import { Play, Clock, BookOpen, TrendingUp, Palette } from 'lucide-react';
import { Helper } from '@/types/helpers';
import { useExerciseGenerator, ExerciseSettings } from '@/hooks/useExerciseGenerator';

interface ExerciseGeneratorProps {
  childId: string;
  selectedHelper: Helper | null;
}

const ExerciseGenerator: React.FC<ExerciseGeneratorProps> = ({
  childId,
  selectedHelper
}) => {
  const { loading, generateExercises } = useExerciseGenerator();
  const [settings, setSettings] = useState<ExerciseSettings>({
    subject: 'rekenen',
    duration_minutes: 15,
    difficulty_level: 'op_niveau',
    theme: '',
  });

  const subjects = [
    { value: 'rekenen', label: 'Rekenen', icon: '🧮', color: 'bg-blue-500' },
    { value: 'begrijpend_lezen', label: 'Begrijpend Lezen', icon: '📖', color: 'bg-green-500' },
    { value: 'engels', label: 'Engels', icon: '🇬🇧', color: 'bg-purple-500' },
    { value: 'spelling', label: 'Spelling', icon: '✏️', color: 'bg-orange-500' },
  ];

  const durations = [5, 10, 15, 20, 30];
  
  const difficulties = [
    { value: 'makkelijker', label: 'Makkelijker', color: 'bg-green-400' },
    { value: 'op_niveau', label: 'Op Niveau', color: 'bg-blue-500' },
    { value: 'uitdagender', label: 'Uitdagender', color: 'bg-orange-500' },
  ];

  const themes = [
    'Dieren', 'Sport', 'Voertuigen', 'Natuur', 'Ruimte', 'Koken', 
    'Muziek', 'Kunst', 'Sporten', 'Reizen', 'Technologie'
  ];

  const handleGenerate = async () => {
    const session = await generateExercises(settings, childId);
    if (session) {
      console.log('Generated session:', session);
      // Hier zou je naar de oefenscherm navigeren
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-maitje-blue rounded-xl flex items-center justify-center">
            <Play className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-nunito font-bold text-gray-800">
            AI Oefening Generator
          </h2>
        </div>
        <p className="text-gray-600 font-nunito text-lg">
          {selectedHelper ? `${selectedHelper.name} maakt` : 'Maak'} de perfecte oefening voor jou!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vak Selectie */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-maitje-blue" />
            <h3 className="text-xl font-nunito font-bold text-gray-800">Kies je vak</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {subjects.map((subject) => (
              <button
                key={subject.value}
                onClick={() => setSettings(prev => ({ ...prev, subject: subject.value }))}
                className={`p-4 rounded-xl border-2 transition-all ${
                  settings.subject === subject.value
                    ? 'border-maitje-blue bg-maitje-blue bg-opacity-10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <span className="text-2xl block mb-2">{subject.icon}</span>
                  <span className="font-nunito font-semibold text-gray-800">
                    {subject.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Duur Selectie */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-maitje-blue" />
            <h3 className="text-xl font-nunito font-bold text-gray-800">Hoelang oefenen?</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {durations.map((duration) => (
              <button
                key={duration}
                onClick={() => setSettings(prev => ({ ...prev, duration_minutes: duration }))}
                className={`p-4 rounded-xl border-2 transition-all ${
                  settings.duration_minutes === duration
                    ? 'border-maitje-blue bg-maitje-blue bg-opacity-10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <span className="text-xl font-nunito font-bold text-gray-800">
                    {duration}
                  </span>
                  <span className="text-sm text-gray-600 block">min</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Moeilijkheid Selectie */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-maitje-blue" />
            <h3 className="text-xl font-nunito font-bold text-gray-800">Moeilijkheid</h3>
          </div>
          <div className="space-y-3">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty.value}
                onClick={() => setSettings(prev => ({ ...prev, difficulty_level: difficulty.value }))}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                  settings.difficulty_level === difficulty.value
                    ? 'border-maitje-blue bg-maitje-blue bg-opacity-10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full ${difficulty.color}`}></div>
                <span className="font-nunito font-semibold text-gray-800">
                  {difficulty.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Thema Selectie */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-maitje-blue" />
            <h3 className="text-xl font-nunito font-bold text-gray-800">Kies een thema</h3>
          </div>
          <select
            value={settings.theme}
            onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
            className="w-full p-4 rounded-xl border-2 border-gray-200 font-nunito text-gray-800 focus:border-maitje-blue focus:outline-none"
          >
            <option value="">Geen specifiek thema</option>
            {themes.map((theme) => (
              <option key={theme} value={theme}>{theme}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Generate Button */}
      <div className="text-center mt-8">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-maitje-blue hover:bg-blue-600 text-white font-nunito font-bold text-xl px-12 py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
        >
          {loading ? (
            <>
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Aan het genereren...
            </>
          ) : (
            <>
              <Play className="w-6 h-6" />
              Start Oefening! 🚀
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ExerciseGenerator;
