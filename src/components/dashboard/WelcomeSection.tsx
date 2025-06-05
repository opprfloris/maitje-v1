
import React from 'react';
import { Helper } from '@/types/helpers';
import HelperSelector from '@/components/HelperSelector';
import { useHelperTips } from '@/hooks/useHelperTips';
import { useDailyPlan } from '@/hooks/useDailyPlan';

interface WelcomeSectionProps {
  childName: string;
  selectedHelper: Helper | null;
  onHelperSelect: (helper: Helper) => void;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  childName,
  selectedHelper,
  onHelperSelect
}) => {
  const { currentTip, loading: tipLoading } = useHelperTips(selectedHelper);
  const { plan, loading: planLoading } = useDailyPlan('dummy-child-id');

  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-6">
        <HelperSelector
          selectedHelper={selectedHelper}
          onHelperSelect={onHelperSelect}
        />
      </div>
      <h1 className="text-4xl font-nunito font-bold text-gray-800 mb-2">
        Hallo {childName}! 👋
      </h1>
      <p className="text-xl text-gray-600 font-nunito mb-4">
        {selectedHelper ? `${selectedHelper.name} helpt je vandaag met leren!` : 'Kies een hulpje om je te helpen met leren!'}
      </p>
      
      {/* Leerlevel */}
      <div className="flex justify-center gap-6 mb-6">
        <div className="bg-maitje-green text-white px-4 py-2 rounded-xl font-nunito font-bold">
          Leerlevel: 5
        </div>
      </div>

      {/* Tip van het gekozen hulpje */}
      {selectedHelper && (
        <div className="bg-maitje-blue bg-opacity-20 border-2 border-maitje-blue rounded-xl p-4 mb-6">
          {tipLoading ? (
            <p className="text-gray-700 font-nunito">
              💭 <strong>{selectedHelper.name}</strong> bedenkt een tip voor je...
            </p>
          ) : (
            <p className="text-gray-700 font-nunito">
              💡 <strong>Wist-je-datje van {selectedHelper.name}:</strong> {currentTip}
            </p>
          )}
        </div>
      )}

      {/* mAItje Plan voor vandaag */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6 mb-6 shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-2xl">🦉</span>
          <h2 className="text-2xl font-nunito font-bold">mAItje Plan voor Vandaag</h2>
        </div>
        
        {planLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="font-nunito">Plan wordt geladen...</span>
          </div>
        ) : plan && plan.plan_items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plan.plan_items.slice(0, 3).map((item: any, index: number) => (
              <div key={index} className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{item.icon || '📚'}</span>
                  <h3 className="font-nunito font-semibold text-sm">{item.title}</h3>
                </div>
                <p className="text-xs text-white text-opacity-90">{item.description}</p>
                <div className="mt-2">
                  <div className="bg-white bg-opacity-30 rounded-full h-2">
                    <div 
                      className="bg-white rounded-full h-2 transition-all duration-300"
                      style={{ width: `${item.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="font-nunito text-lg mb-3">
              Je persoonlijke leerplan wordt voorbereid! 🎯
            </p>
            <p className="font-nunito text-sm text-white text-opacity-90">
              Begin met oefenen en ik maak een perfect plan voor jou.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeSection;
