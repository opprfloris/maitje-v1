
import React, { useState, useEffect } from 'react';
import { ArrowDown, Check, X } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const RekenenModule = ({ onBack }: Props) => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [exerciseMode, setExerciseMode] = useState<'sequence' | 'random' | null>(null);
  const [currentSum, setCurrentSum] = useState<{a: number, b: number} | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{type: 'correct' | 'incorrect' | null, message: string}>({type: null, message: ''});
  const [score, setScore] = useState({correct: 0, total: 0});

  console.log('Rekenen module loaded, selected table:', selectedTable, 'mode:', exerciseMode);

  const generateSum = () => {
    if (!selectedTable) return;
    
    if (exerciseMode === 'sequence') {
      const currentPosition = score.total % 10;
      setCurrentSum({a: selectedTable, b: currentPosition + 1});
    } else {
      const randomB = Math.floor(Math.random() * 10) + 1;
      setCurrentSum({a: selectedTable, b: randomB});
    }
    setUserAnswer('');
    setFeedback({type: null, message: ''});
  };

  useEffect(() => {
    if (selectedTable && exerciseMode) {
      generateSum();
    }
  }, [selectedTable, exerciseMode]);

  const checkAnswer = () => {
    if (!currentSum || !userAnswer) return;
    
    const correctAnswer = currentSum.a * currentSum.b;
    const isCorrect = parseInt(userAnswer) === correctAnswer;
    
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    if (isCorrect) {
      setFeedback({type: 'correct', message: 'Goed zo! 🎉'});
    } else {
      setFeedback({type: 'incorrect', message: `Oeps! Het juiste antwoord is ${correctAnswer}.`});
    }
  };

  const nextSum = () => {
    generateSum();
  };

  // Tafel selectie scherm
  if (!selectedTable) {
    return (
      <div className="min-h-screen p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="maitje-button-secondary px-4 py-2">
            ← Terug
          </button>
          <h1 className="text-3xl font-nunito font-bold text-gray-800">Rekenen - Tafels</h1>
        </div>

        <div className="maitje-card">
          <h2 className="text-2xl font-nunito font-bold text-gray-800 mb-6">Welke tafel wil je oefenen?</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(table => (
              <button
                key={table}
                onClick={() => setSelectedTable(table)}
                className="maitje-button text-xl h-20"
              >
                Tafel van {table}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Modus selectie scherm
  if (!exerciseMode) {
    return (
      <div className="min-h-screen p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setSelectedTable(null)} className="maitje-button-secondary px-4 py-2">
            ← Terug
          </button>
          <h1 className="text-3xl font-nunito font-bold text-gray-800">Tafel van {selectedTable}</h1>
        </div>

        <div className="maitje-card">
          <h2 className="text-2xl font-nunito font-bold text-gray-800 mb-6">Hoe wil je oefenen?</h2>
          <div className="grid gap-4">
            <button
              onClick={() => setExerciseMode('sequence')}
              className="maitje-button text-left p-6 h-auto"
            >
              <div className="text-xl font-bold mb-2">Op volgorde</div>
              <div className="text-sm opacity-90">Van {selectedTable} x 1 tot {selectedTable} x 10</div>
            </button>
            <button
              onClick={() => setExerciseMode('random')}
              className="maitje-button-secondary text-left p-6 h-auto"
            >
              <div className="text-xl font-bold mb-2">Door elkaar</div>
              <div className="text-sm opacity-90">Sommen in willekeurige volgorde</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Oefening scherm
  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => setExerciseMode(null)} className="maitje-button-secondary px-4 py-2">
          ← Terug
        </button>
        <div className="text-right">
          <div className="text-lg font-nunito font-bold text-gray-800">
            Score: {score.correct}/{score.total}
          </div>
          <div className="text-sm text-gray-600">Tafel van {selectedTable}</div>
        </div>
      </div>

      {currentSum && (
        <div className="maitje-card text-center max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="text-6xl font-nunito font-bold text-gray-800 mb-6">
              {currentSum.a} × {currentSum.b} = ?
            </div>
            
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="text-4xl font-nunito font-bold text-center border-4 border-gray-300 rounded-xl p-4 w-48 focus:border-maitje-green focus:outline-none"
              placeholder="?"
              autoFocus
            />
          </div>

          {feedback.type && (
            <div className={feedback.type === 'correct' ? 'feedback-correct' : 'feedback-incorrect'}>
              {feedback.type === 'correct' ? (
                <Check className="w-6 h-6 flex-shrink-0" />
              ) : (
                <X className="w-6 h-6 flex-shrink-0" />
              )}
              <span className="text-lg font-semibold">{feedback.message}</span>
            </div>
          )}

          <div className="mt-8 flex gap-4 justify-center">
            {!feedback.type ? (
              <>
                <button onClick={checkAnswer} className="maitje-button" disabled={!userAnswer}>
                  Controleer
                </button>
                <button className="maitje-button-secondary" disabled>
                  Hint 💡
                </button>
              </>
            ) : (
              <button onClick={nextSum} className="maitje-button">
                Volgende Som →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RekenenModule;
