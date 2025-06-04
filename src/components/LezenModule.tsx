
import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

interface Props {
  onBack: () => void;
}

interface Text {
  id: string;
  title: string;
  content: string;
  questions: {
    type: 'mcq' | 'open';
    question: string;
    options?: string[];
    correctAnswer?: number;
  }[];
}

const sampleTexts: Text[] = [
  {
    id: '1',
    title: 'De Ruimtereis',
    content: `Emma keek door het raam van het ruimteschip. Ze zag de aarde steeds kleiner worden. Het was haar eerste reis naar de maan! Kapitein Jan legde uit hoe het ruimteschip werkt. "We zijn nu al 10.000 kilometer van de aarde af," zei hij. Emma vond het spannend maar ook een beetje eng. Ze miste haar kat Muis al. Gelukkig duurde de reis maar drie dagen. Dan zou ze de eerste persoon van haar klas zijn die op de maan heeft gelopen!`,
    questions: [
      {
        type: 'mcq',
        question: 'Waar gaat Emma naartoe?',
        options: ['Naar Mars', 'Naar de maan', 'Naar een andere planeet'],
        correctAnswer: 1
      },
      {
        type: 'mcq',
        question: 'Hoe ver zijn ze van de aarde af?',
        options: ['1.000 kilometer', '10.000 kilometer', '100.000 kilometer'],
        correctAnswer: 1
      },
      {
        type: 'mcq',
        question: 'Hoe lang duurt de reis?',
        options: ['Twee dagen', 'Drie dagen', 'Vier dagen'],
        correctAnswer: 1
      },
      {
        type: 'open',
        question: 'Waarom denk je dat Emma zowel spannend als eng vindt?'
      }
    ]
  },
  {
    id: '2',
    title: 'Het Verloren Katje',
    content: `Mila hoorde een zacht miauwen in de tuin. Ze keek tussen de struiken en zag een klein, oranje katje. Het katje zag er verdrietig uit en had honger. Mila gaf het wat melk en een stukje brood. Het katje at gulzig. "Waar kom jij vandaan?" vroeg Mila zachtjes. Het katje had een rood halsbandје met een belletje, maar geen naamplaatje. Mila besloot een briefje op de deur te hangen voor de eigenaar.`,
    questions: [
      {
        type: 'mcq',
        question: 'Welke kleur heeft het katje?',
        options: ['Zwart', 'Wit', 'Oranje'],
        correctAnswer: 2
      },
      {
        type: 'mcq',
        question: 'Wat gaf Mila aan het katje?',
        options: ['Melk en brood', 'Water en vis', 'Alleen melk'],
        correctAnswer: 0
      },
      {
        type: 'open',
        question: 'Wat zou jij doen als je een verloren dier vindt?'
      }
    ]
  }
];

const LezenModule = ({ onBack }: Props) => {
  const [selectedText, setSelectedText] = useState<Text | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [openAnswer, setOpenAnswer] = useState('');
  const [feedback, setFeedback] = useState<{type: 'correct' | 'incorrect' | null, message: string}>({type: null, message: ''});
  const [score, setScore] = useState({correct: 0, total: 0});

  console.log('Lezen module loaded, selected text:', selectedText?.title);

  const checkMCQ = () => {
    if (selectedAnswer === null || !selectedText) return;
    
    const currentQuestion = selectedText.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    if (isCorrect) {
      setFeedback({type: 'correct', message: 'Goed zo! 🎉'});
    } else {
      const correctOption = currentQuestion.options?.[currentQuestion.correctAnswer!];
      setFeedback({type: 'incorrect', message: `Oeps! Het juiste antwoord is: ${correctOption}`});
    }
  };

  const nextQuestion = () => {
    if (!selectedText) return;
    
    if (currentQuestionIndex < selectedText.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setOpenAnswer('');
      setFeedback({type: null, message: ''});
    } else {
      // Quiz voltooid
      alert(`Quiz voltooid! Score: ${score.correct}/${score.total}`);
      setSelectedText(null);
      setCurrentQuestionIndex(0);
      setScore({correct: 0, total: 0});
    }
  };

  const submitOpenAnswer = () => {
    if (!openAnswer.trim()) return;
    
    setScore(prev => ({
      correct: prev.correct + 1, // Open vragen tellen altijd als goed
      total: prev.total + 1
    }));
    
    setFeedback({type: 'correct', message: 'Goed gedaan! Je antwoord is opgeslagen. 📝'});
  };

  // Tekst selectie scherm
  if (!selectedText) {
    return (
      <div className="min-h-screen p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="maitje-button-secondary px-4 py-2">
            ← Terug
          </button>
          <h1 className="text-3xl font-nunito font-bold text-gray-800">Begrijpend Lezen</h1>
        </div>

        <div className="maitje-card">
          <h2 className="text-2xl font-nunito font-bold text-gray-800 mb-6">Kies een verhaal om te lezen:</h2>
          <div className="grid gap-4">
            {sampleTexts.map(text => (
              <button
                key={text.id}
                onClick={() => setSelectedText(text)}
                className="maitje-card hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-left border-2 border-transparent hover:border-maitje-blue"
              >
                <h3 className="text-xl font-nunito font-bold text-gray-800 mb-2">{text.title}</h3>
                <p className="text-gray-600">{text.questions.length} vragen • {Math.ceil(text.content.length / 200)} minuten lezen</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = selectedText.questions[currentQuestionIndex];

  // Lees en vraag scherm
  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => setSelectedText(null)} className="maitje-button-secondary px-4 py-2">
          ← Terug
        </button>
        <div className="text-right">
          <div className="text-lg font-nunito font-bold text-gray-800">
            Score: {score.correct}/{score.total}
          </div>
          <div className="text-sm text-gray-600">
            Vraag {currentQuestionIndex + 1} van {selectedText.questions.length}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Tekst sectie */}
        <div className="maitje-card">
          <h2 className="text-2xl font-nunito font-bold text-gray-800 mb-4">{selectedText.title}</h2>
          <div className="text-lg leading-relaxed text-gray-700 max-h-96 overflow-y-auto">
            {selectedText.content}
          </div>
        </div>

        {/* Vraag sectie */}
        <div className="maitje-card">
          <h3 className="text-xl font-nunito font-bold text-gray-800 mb-4">
            Vraag {currentQuestionIndex + 1}
          </h3>
          
          <p className="text-lg text-gray-700 mb-6">{currentQuestion.question}</p>

          {currentQuestion.type === 'mcq' ? (
            <div className="space-y-3">
              {currentQuestion.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(index)}
                  className={`w-full p-4 text-left border-2 rounded-xl transition-all ${
                    selectedAnswer === index
                      ? 'border-maitje-blue bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-semibold">{String.fromCharCode(65 + index)}.</span> {option}
                </button>
              ))}
            </div>
          ) : (
            <textarea
              value={openAnswer}
              onChange={(e) => setOpenAnswer(e.target.value)}
              placeholder="Typ hier je antwoord..."
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-maitje-blue focus:outline-none min-h-32 text-lg"
            />
          )}

          {feedback.type && (
            <div className={`mt-6 ${feedback.type === 'correct' ? 'feedback-correct' : 'feedback-incorrect'}`}>
              {feedback.type === 'correct' ? (
                <Check className="w-6 h-6 flex-shrink-0" />
              ) : (
                <X className="w-6 h-6 flex-shrink-0" />
              )}
              <span className="text-lg font-semibold">{feedback.message}</span>
            </div>
          )}

          <div className="mt-6 flex gap-4">
            {!feedback.type ? (
              <>
                {currentQuestion.type === 'mcq' ? (
                  <button 
                    onClick={checkMCQ} 
                    className="maitje-button" 
                    disabled={selectedAnswer === null}
                  >
                    Controleer
                  </button>
                ) : (
                  <button 
                    onClick={submitOpenAnswer} 
                    className="maitje-button" 
                    disabled={!openAnswer.trim()}
                  >
                    Verstuur Antwoord
                  </button>
                )}
                <button className="maitje-button-secondary" disabled>
                  Hint 💡
                </button>
              </>
            ) : (
              <button onClick={nextQuestion} className="maitje-button">
                {currentQuestionIndex < selectedText.questions.length - 1 ? 'Volgende Vraag →' : 'Quiz Voltooien 🎉'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LezenModule;
