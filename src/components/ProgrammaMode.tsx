
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Home, Lightbulb, SkipForward, Check, Sparkles } from 'lucide-react';
import { PlanItemProgress } from '@/types/database';
import { Helper } from '@/types/helpers';
import { useDailyPlan } from '@/hooks/useDailyPlan';
import RekenenModule from './RekenenModule';
import LezenModule from './LezenModule';
import EngelsModule from './EngelsModule';

interface Props {
  childId: string;
  childName: string;
  selectedHelper: Helper | null;
  onExit: () => void;
}

const ProgrammaMode = ({ childId, childName, selectedHelper, onExit }: Props) => {
  const { items, updateItemStatus } = useDailyPlan(childId);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [showTransition, setShowTransition] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  const currentItem = items[currentItemIndex];
  const totalItems = items.length;
  const completedItems = items.filter(item => item.status === 'completed').length;

  // Find the first non-completed item to start with
  useEffect(() => {
    const firstIncompleteIndex = items.findIndex(item => 
      item.status === 'todo' || item.status === 'in_progress'
    );
    if (firstIncompleteIndex !== -1) {
      setCurrentItemIndex(firstIncompleteIndex);
    }
  }, [items]);

  // Mark current item as in progress when it loads
  useEffect(() => {
    if (currentItem && currentItem.status === 'todo') {
      updateItemStatus(currentItem.id, 'in_progress');
    }
  }, [currentItem]);

  const handleComplete = async () => {
    if (!currentItem) return;

    await updateItemStatus(currentItem.id, 'completed');
    showTransitionAnimation();
  };

  const handleSkip = async () => {
    if (!currentItem) return;

    const confirmed = window.confirm(
      `Weet je zeker dat je "${currentItem.title}" wilt overslaan? Je mAItje bewaart hem voor later!`
    );
    
    if (confirmed) {
      await updateItemStatus(currentItem.id, 'skipped');
      showTransitionAnimation();
    }
  };

  const showTransitionAnimation = () => {
    setShowTransition(true);
    setTimeout(() => {
      setShowTransition(false);
      moveToNext();
    }, 2000);
  };

  const moveToNext = () => {
    const nextIndex = currentItemIndex + 1;
    if (nextIndex >= totalItems) {
      setShowCompletion(true);
    } else {
      setCurrentItemIndex(nextIndex);
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="flex items-center gap-2 mb-4">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
              item.status === 'completed' 
                ? 'bg-maitje-green text-white border-maitje-green' 
                : item.status === 'skipped'
                ? 'bg-gray-300 text-gray-600 border-gray-300'
                : index === currentItemIndex
                ? 'bg-maitje-blue text-white border-maitje-blue animate-pulse'
                : 'bg-white text-gray-400 border-gray-300'
            }`}>
              {item.status === 'completed' ? (
                <Check className="w-4 h-4" />
              ) : item.status === 'skipped' ? (
                <SkipForward className="w-3 h-3" />
              ) : (
                index + 1
              )}
            </div>
            {index < items.length - 1 && (
              <div className={`w-8 h-1 mx-1 rounded ${
                index < completedItems ? 'bg-maitje-green' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderCurrentModule = () => {
    if (!currentItem) return null;

    const moduleProps = {
      onBack: onExit,
      onComplete: handleComplete,
      isProgramMode: true
    };

    switch (currentItem.module_type) {
      case 'rekenen':
        return <RekenenModule {...moduleProps} />;
      case 'lezen':
        return <LezenModule {...moduleProps} />;
      case 'engels':
        return <EngelsModule {...moduleProps} />;
      default:
        return <div>Onbekende module</div>;
    }
  };

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-maitje-cream to-yellow-100 flex items-center justify-center p-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-8xl mb-6 animate-bounce">
            {selectedHelper?.avatar_emoji || '🦉'}
          </div>
          <div className="absolute inset-0 pointer-events-none">
            <div className="animate-pulse">
              <Sparkles className="w-8 h-8 text-yellow-400 absolute top-20 left-20" />
              <Sparkles className="w-6 h-6 text-pink-400 absolute top-32 right-32" />
              <Sparkles className="w-10 h-10 text-blue-400 absolute bottom-40 left-40" />
              <Sparkles className="w-4 h-4 text-green-400 absolute bottom-20 right-20" />
            </div>
          </div>
          
          <h1 className="text-5xl font-nunito font-bold text-gray-800 mb-4">
            Programma Voltooid! 🎉
          </h1>
          
          <div className="bg-white bg-opacity-80 rounded-2xl p-6 mb-8 border-4 border-maitje-green">
            <p className="text-2xl font-nunito text-gray-700 mb-4">
              Fantastisch, {childName}! Je hebt je hele mAItje Plan voor vandaag voltooid!
            </p>
            <p className="text-xl font-nunito text-maitje-blue font-bold">
              {selectedHelper?.name || 'Uli'} is supertrots op je! ⭐
            </p>
          </div>
          
          <button 
            onClick={onExit}
            className="maitje-button text-2xl px-8 py-4"
          >
            Terug naar Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (showTransition) {
    return (
      <div className="min-h-screen bg-maitje-cream flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-6xl mb-6 animate-bounce">
            {selectedHelper?.avatar_emoji || '🦉'}
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg border-4 border-maitje-green">
            <h2 className="text-3xl font-nunito font-bold text-gray-800 mb-4">
              Super gedaan! ⭐
            </h2>
            <p className="text-xl font-nunito text-gray-700">
              Op naar de volgende stap van ons avontuur!
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="min-h-screen bg-maitje-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-maitje-blue rounded-full flex items-center justify-center text-2xl mx-auto mb-4 animate-bounce">
            🦉
          </div>
          <p className="text-gray-600 font-nunito">Programma laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-maitje-cream">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-4 border-maitje-blue p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onExit}
              className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="text-sm">Stop Programma</span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="text-2xl animate-pulse-slow">
                {selectedHelper?.avatar_emoji || '🦉'}
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Stap {currentItemIndex + 1} van {totalItems}</div>
                <div className="font-nunito font-bold text-gray-800">{currentItem.title}</div>
              </div>
            </div>
          </div>
          
          {renderProgressBar()}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {renderCurrentModule()}
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-nunito font-bold shadow-lg transition-colors flex items-center gap-2"
        >
          <Lightbulb className="w-5 h-5" />
          Hint!
        </button>
        
        <button
          onClick={handleComplete}
          className="maitje-button px-6 py-3 shadow-lg flex items-center gap-2"
        >
          <Check className="w-5 h-5" />
          Klaar!
        </button>
        
        <button
          onClick={handleSkip}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-nunito font-bold shadow-lg transition-colors flex items-center gap-2"
        >
          <SkipForward className="w-5 h-5" />
          Overslaan
        </button>
      </div>
    </div>
  );
};

export default ProgrammaMode;
