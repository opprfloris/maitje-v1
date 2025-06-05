
import React from 'react';
import { Helper } from '@/types/helpers';
import HelperSelector from '@/components/HelperSelector';
import { useHelperTips } from '@/hooks/useHelperTips';

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
      <div className="flex justify-center gap-6 mb-4">
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
    </div>
  );
};

export default WelcomeSection;
