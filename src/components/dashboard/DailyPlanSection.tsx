
import React from 'react';
import { useDailyPlan } from '@/hooks/useDailyPlan';

interface DailyPlanSectionProps {
  childId: string;
}

const DailyPlanSection: React.FC<DailyPlanSectionProps> = ({ childId }) => {
  const { items, loading: planLoading } = useDailyPlan(childId);

  return (
    <div className="maitje-card mb-8">
      <h2 className="text-2xl font-nunito font-bold text-gray-800 mb-4 flex items-center gap-3">
        📅 Jouw mAItje Plan voor Vandaag
      </h2>
      
      {planLoading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 bg-maitje-blue rounded-full flex items-center justify-center text-xl mx-auto mb-4 animate-bounce">
            🦉
          </div>
          <p className="text-gray-600 font-nunito">Plan laden...</p>
        </div>
      ) : (
        <div className="grid gap-4 mb-6">
          {items.map((item, index) => (
            <div 
              key={item.id}
              className={`flex items-center gap-4 p-4 bg-maitje-cream rounded-xl border-l-4 ${
                item.status === 'completed' 
                  ? 'border-maitje-green bg-green-50' 
                  : item.status === 'skipped'
                  ? 'border-gray-400 bg-gray-50'
                  : index === 0 ? 'border-maitje-green' 
                  : index === 1 ? 'border-maitje-blue'
                  : 'border-purple-500'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                item.status === 'completed' 
                  ? 'bg-maitje-green' 
                  : item.status === 'skipped'
                  ? 'bg-gray-400'
                  : index === 0 ? 'bg-maitje-green' 
                  : index === 1 ? 'bg-maitje-blue'
                  : 'bg-purple-500'
              }`}>
                {item.status === 'completed' ? '✓' : item.status === 'skipped' ? '⏭' : index + 1}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{item.title}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              {item.status === 'completed' && (
                <div className="ml-auto text-maitje-green font-bold">Voltooid! ⭐</div>
              )}
              {item.status === 'skipped' && (
                <div className="ml-auto text-gray-500 font-bold">Overgeslagen</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyPlanSection;
