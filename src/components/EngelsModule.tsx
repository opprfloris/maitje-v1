
import React, { useState } from 'react';
import { ArrowLeft, Check, Lightbulb } from 'lucide-react';

interface Props {
  onBack: () => void;
}

interface Word {
  dutch: string;
  english: string;
}

const EngelsModule = ({ onBack }: Props) => {
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [direction, setDirection] = useState<'nl-en' | 'en-nl'>('nl-en');

  const wordSets = {
    kleuren: [
      { dutch: 'rood', english: 'red' },
      { dutch: 'blauw', english: 'blue' },
      { dutch: 'groen', english: 'green' },
      { dutch: 'geel', english: 'yellow' },
      { dutch: 'paars', english: 'purple' },
      { dutch: 'oranje', english: 'orange' },
      { dutch: 'zwart', english: 'black' },
      { dutch: 'wit', english: 'white' },
      { dutch: 'roze', english: 'pink' },
      { dutch: 'bruin', english: 'brown' }
    ],
    dieren: [
      { dutch: 'hond', english: 'dog' },
      { dutch: 'kat', english: 'cat' },
      { dutch: 'paard', english: 'horse' },
      { dutch: 'koe', english: 'cow' },
      { dutch: 'schaap', english: 'sheep' },
      { dutch: 'varken', english: 'pig' },
      { dutch: 'vogel', english: 'bird' },
      { dutch: 'vis', english: 'fish' },
      { dutch: 'konijn', english: 'rabbit' },
      { dutch: 'muis', english: 'mouse' }
    ],
    schoolspullen: [
      { dutch: 'boek', english: 'book' },
      { dutch: 'potlood', english: 'pencil' },
      { dutch: 'pen', english: 'pen' },
      { dutch: 'schrift', english: 'notebook' },
      { dutch: 'tas', english: 'bag' },
      { dutch: 'gum', english: 'eraser' },
      { dutch: 'liniaal', english: 'ruler' },
      { dutch: 'tafel', english: 'table' },
      { dutch: 'stoel', english: 'chair' },
      { dutch: 'bord', english: 'board' }
    ]
  };

  const currentWords = selectedSet ? wordSets[selectedSet as keyof typeof wordSets] : [];
  const currentWord = currentWords[currentWordIndex];

  const handleSetSelection = (setName: string) => {
    setSelectedSet(setName);
    setCurrentWordIndex(0);
    setUserAnswer('');
    setShowFeedback(false);
  };

  const checkAnswer = () => {
    const correctAnswer = direction === 'nl-en' ? currentWord.english : currentWord.dutch;
    const correct = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase();
    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const nextWord = () => {
    if (currentWordIndex < currentWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setUserAnswer('');
      setShowFeedback(false);
    } else {
      // Terug naar set selectie als alle woorden gedaan zijn
      setSelectedSet(null);
      setCurrentWordIndex(0);
      setUserAnswer('');
      setShowFeedback(false);
    }
  };

  const showHint = () => {
    const correctAnswer = direction === 'nl-en' ? currentWord.english : currentWord.dutch;
    setUserAnswer(correctAnswer.charAt(0) + '...');
  };

  // Set selectie scherm
  if (!selectedSet) {
    return (
      <div className="min-h-screen bg-maitje-cream p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-2xl">
                🇬🇧
              </div>
              <div>
                <h1 className="text-3xl font-nunito font-bold text-gray-800">Engels Leren</h1>
                <p className="text-gray-600">Kies een woordenset om te oefenen</p>
              </div>
            </div>
          </div>

          {/* Richtingskeuze */}
          <div className="maitje-card mb-6">
            <h2 className="text-xl font-nunito font-bold text-gray-800 mb-4">Kies oefenrichting:</h2>
            <div className="flex gap-4">
              <button
                onClick={() => setDirection('nl-en')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  direction === 'nl-en' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-300 hover:border-purple-300'
                }`}
              >
                <div className="font-semibold">Nederlands → Engels</div>
                <div className="text-sm text-gray-600">Typ de Engelse vertaling</div>
              </button>
              <button
                onClick={() => setDirection('en-nl')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  direction === 'en-nl' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-300 hover:border-purple-300'
                }`}
              >
                <div className="font-semibold">Engels → Nederlands</div>
                <div className="text-sm text-gray-600">Typ de Nederlandse vertaling</div>
              </button>
            </div>
          </div>

          {/* Woordensets */}
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(wordSets).map(([setName, words]) => (
              <button
                key={setName}
                onClick={() => handleSetSelection(setName)}
                className="maitje-card hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-left"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center text-2xl">
                    {setName === 'kleuren' && '🎨'}
                    {setName === 'dieren' && '🐕'}
                    {setName === 'schoolspullen' && '📚'}
                  </div>
                  <div>
                    <h3 className="text-xl font-nunito font-bold text-gray-800 capitalize">{setName}</h3>
                    <p className="text-gray-600">{words.length} woorden</p>
                  </div>
                </div>
                <div className="text-purple-500 font-semibold">Start oefening →</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Oefening scherm
  return (
    <div className="min-h-screen bg-maitje-cream p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setSelectedSet(null)}
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-nunito font-bold text-gray-800 capitalize">{selectedSet}</h1>
            <p className="text-gray-600">Vraag {currentWordIndex + 1} van {currentWords.length}</p>
          </div>
        </div>

        <div className="maitje-card text-center">
          <div className="mb-8">
            <p className="text-gray-600 mb-2">
              {direction === 'nl-en' ? 'Wat is de Engelse vertaling van:' : 'Wat is de Nederlandse vertaling van:'}
            </p>
            <div className="text-4xl font-nunito font-bold text-gray-800 mb-6">
              {direction === 'nl-en' ? currentWord.dutch : currentWord.english}
            </div>
          </div>

          {!showFeedback ? (
            <div className="space-y-6">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                placeholder="Typ je antwoord..."
                className="w-full text-center text-2xl p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                autoFocus
              />
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  className="maitje-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Controleer
                </button>
                
                <button
                  onClick={showHint}
                  className="maitje-button-secondary flex items-center gap-2"
                >
                  <Lightbulb className="w-5 h-5" />
                  Hint
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className={isCorrect ? 'feedback-correct' : 'feedback-incorrect'}>
                {isCorrect ? (
                  <>
                    <div className="text-2xl">✅</div>
                    <div>
                      <div className="font-bold">Goed zo!</div>
                      <div>Het juiste antwoord is: {direction === 'nl-en' ? currentWord.english : currentWord.dutch}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl">❌</div>
                    <div>
                      <div className="font-bold">Oeps!</div>
                      <div>Het juiste antwoord is: {direction === 'nl-en' ? currentWord.english : currentWord.dutch}</div>
                    </div>
                  </>
                )}
              </div>
              
              <button
                onClick={nextWord}
                className="maitje-button"
              >
                {currentWordIndex < currentWords.length - 1 ? 'Volgende Woord' : 'Terug naar Overzicht'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EngelsModule;
