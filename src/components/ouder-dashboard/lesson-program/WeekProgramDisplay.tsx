
import React from 'react';
import { Check, Edit, RefreshCw, Eye, Clock, Palette, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWeekDateRange } from '@/utils/weekUtils';

interface WeekProgramDisplayProps {
  currentWeekData: any;
  selectedWeek: number;
  selectedYear: number;
  isCurrentOrFutureWeek: boolean;
  onPublishProgram: () => void;
  onReplaceProgram: () => void;
  onDeleteProgram: () => void;
  onDayClick: (dayData: any) => void;
}

const WeekProgramDisplay: React.FC<WeekProgramDisplayProps> = ({
  currentWeekData,
  selectedWeek,
  selectedYear,
  isCurrentOrFutureWeek,
  onPublishProgram,
  onReplaceProgram,
  onDeleteProgram,
  onDayClick
}) => {
  const weekDateRange = getWeekDateRange(selectedYear, selectedWeek);

  return (
    <div className="maitje-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-nunito font-bold text-gray-800">
            Week {selectedWeek} Programma ({weekDateRange.startString} - {weekDateRange.endString})
          </h3>
          {currentWeekData && (
            <div className="mt-2">
              <div className="flex items-center gap-4">
                {/* Status Badge */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  currentWeekData.status === 'published' 
                    ? 'bg-green-100 text-green-800'
                    : currentWeekData.status === 'draft'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    currentWeekData.status === 'published' 
                      ? 'bg-green-500'
                      : currentWeekData.status === 'draft'
                      ? 'bg-yellow-500'
                      : 'bg-gray-500'
                  }`} />
                  {currentWeekData.status === 'published' ? 'Gepubliceerd' :
                   currentWeekData.status === 'draft' ? 'Concept' : 'Leeg'}
                </div>
                
                {/* Theme Badge */}
                {currentWeekData.theme && (
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">{currentWeekData.theme}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          {currentWeekData?.status === 'draft' && (
            <Button onClick={onPublishProgram} size="sm">
              <Check className="w-4 h-4 mr-2" />
              Publiceren
            </Button>
          )}
          {currentWeekData?.status === 'published' && isCurrentOrFutureWeek && (
            <Button 
              onClick={onReplaceProgram}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Vervang Programma
            </Button>
          )}
          {currentWeekData && (
            <Button 
              onClick={onDeleteProgram}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Verwijder
            </Button>
          )}
        </div>
      </div>

      {currentWeekData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {currentWeekData.program_data.map((dag: any, index: number) => {
            const totalTime = dag.oefeningen?.reduce((sum: number, oef: any) => sum + (oef.tijdInMinuten || 0), 0) || 0;
            
            return (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2 text-center">{dag.dag}</h4>
                <div className="text-center mb-3">
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{totalTime} min totaal</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {dag.oefeningen?.map((oefening: any, oefeningIndex: number) => (
                    <div 
                      key={oefeningIndex} 
                      className="bg-white p-3 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => onDayClick(dag)}
                    >
                      <div className="font-semibold text-sm text-gray-800 mb-2">{oefening.titel}</div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className={`px-2 py-1 rounded-full ${
                          oefening.type === 'rekenen' ? 'bg-blue-100 text-blue-800' :
                          oefening.type === 'taal' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {oefening.type}
                        </span>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-3 h-3" />
                          {oefening.tijdInMinuten || 15} min
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 text-xs">
                        <Eye className="w-3 h-3" />
                        {oefening.vragen?.length || 0} vragen
                      </div>
                      {oefening.beschrijving && (
                        <p className="text-xs text-gray-500 mt-1 italic">{oefening.beschrijving}</p>
                      )}
                    </div>
                  )) || (
                    <div className="text-center text-gray-500 text-sm">Geen oefeningen</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Edit className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold mb-2">Geen programma voor deze week</h4>
          <p className="mb-4">Gebruik de AI generator hierboven om een nieuw weekprogramma te maken</p>
        </div>
      )}

      {currentWeekData && (
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-600 text-sm">
            Klik op een dag om alle AI-gegenereerde vragen en oefeningen te bekijken.
          </p>
        </div>
      )}
    </div>
  );
};

export default WeekProgramDisplay;
