
import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { getWeekDateRange } from '@/utils/weekUtils';

interface WeekNavigationProps {
  selectedWeek: number;
  selectedYear: number;
  onWeekChange: (week: number) => void;
  onYearChange: (year: number) => void;
  weekProgrammas: any[];
  currentWeek: number;
}

const WeekNavigation: React.FC<WeekNavigationProps> = ({
  selectedWeek,
  selectedYear,
  onWeekChange,
  onYearChange,
  weekProgrammas,
  currentWeek
}) => {
  const getWeekStatus = (weekNumber: number) => {
    const weekData = weekProgrammas.find(w => w.week_number === weekNumber);
    return weekData?.status || 'empty';
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedWeek > 1) {
        onWeekChange(selectedWeek - 1);
      } else if (selectedYear > 2024) {
        onYearChange(selectedYear - 1);
        onWeekChange(52);
      }
    } else {
      if (selectedWeek < 52) {
        onWeekChange(selectedWeek + 1);
      } else {
        onYearChange(selectedYear + 1);
        onWeekChange(1);
      }
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('nl-NL', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const selectedWeekDateRange = getWeekDateRange(selectedYear, selectedWeek);

  return (
    <div className="maitje-card">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-gray-600" />
        <div>
          <h3 className="text-xl font-nunito font-bold text-gray-800">Weekprogramma Beheer</h3>
          <p className="text-sm text-gray-600">{getCurrentDate()} • Week {currentWeek}</p>
        </div>
      </div>

      {/* Week Timeline */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Weekoverzicht {selectedYear}</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {Array.from({ length: 52 }, (_, i) => i + 1).map((week) => {
            const status = getWeekStatus(week);
            const isSelected = week === selectedWeek;
            const isCurrent = week === currentWeek && selectedYear === new Date().getFullYear();
            
            return (
              <button
                key={week}
                onClick={() => onWeekChange(week)}
                className={`w-10 h-10 rounded-lg text-xs font-semibold transition-colors relative ${
                  isSelected 
                    ? 'bg-maitje-blue text-white ring-2 ring-maitje-blue/30' 
                    : status === 'published'
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : status === 'draft'
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } ${isCurrent ? 'ring-2 ring-black' : ''}`}
              >
                {week}
              </button>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-100 rounded"></div>
            <span>Gepubliceerd</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-100 rounded"></div>
            <span>Concept</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-100 rounded"></div>
            <span>Leeg</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border-2 border-black rounded"></div>
            <span>Huidige week</span>
          </div>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateWeek('prev')}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Vorige Week
        </button>
        
        <div className="text-center">
          <h4 className="text-lg font-bold text-gray-800">
            Week {selectedWeek} - {selectedYear}
          </h4>
          <p className="text-sm text-gray-600">
            {selectedWeekDateRange.startString} - {selectedWeekDateRange.endString}
          </p>
        </div>
        
        <button
          onClick={() => navigateWeek('next')}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          Volgende Week
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default WeekNavigation;
