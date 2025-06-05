
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, CheckCircle, Play, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWeekPrograms } from '@/hooks/useWeekPrograms';
import { useWeekProgramProgress } from '@/hooks/useWeekProgramProgress';
import { getWeekDateRange } from '@/utils/weekUtils';

interface WeekNavigatorProps {
  childId: string;
  onSelectProgram: (programId: string, hasProgress?: boolean) => void;
  onBack: () => void;
}

const WeekNavigator: React.FC<WeekNavigatorProps> = ({
  childId,
  onSelectProgram,
  onBack
}) => {
  const currentYear = new Date().getFullYear();
  const currentWeek = Math.ceil((new Date().getTime() - new Date(currentYear, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
  
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  
  const { programs } = useWeekPrograms();
  const { 
    getCurrentProgress, 
    getCompletedPrograms, 
    startProgram 
  } = useWeekProgramProgress(childId);

  const publishedPrograms = programs.filter(p => p.status === 'published');
  const currentProgram = publishedPrograms.find(p => p.year === selectedYear && p.week_number === selectedWeek);
  
  const getProgramStatus = (programId: string) => {
    const currentProgress = getCurrentProgress(programId);
    const completed = getCompletedPrograms().find(p => p.program_id === programId);
    
    if (completed) return 'completed';
    if (currentProgress) return 'in_progress';
    return 'available';
  };

  const handleStartProgram = async () => {
    if (!currentProgram) return;
    
    const existingProgress = getCurrentProgress(currentProgram.id);
    
    if (existingProgress) {
      onSelectProgram(currentProgram.id, true);
    } else {
      const newProgress = await startProgram(currentProgram.id);
      if (newProgress) {
        onSelectProgram(currentProgram.id, true);
      }
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      if (selectedWeek >= 52) {
        setSelectedYear(selectedYear + 1);
        setSelectedWeek(1);
      } else {
        setSelectedWeek(selectedWeek + 1);
      }
    } else {
      if (selectedWeek <= 1) {
        setSelectedYear(selectedYear - 1);
        setSelectedWeek(52);
      } else {
        setSelectedWeek(selectedWeek - 1);
      }
    }
  };

  const dateRange = getWeekDateRange(selectedYear, selectedWeek);
  const status = currentProgram ? getProgramStatus(currentProgram.id) : null;

  const getStatusInfo = () => {
    if (!currentProgram) {
      return {
        icon: <Lock className="w-6 h-6 text-gray-400" />,
        text: 'Geen programma beschikbaar',
        color: 'bg-gray-100 text-gray-600',
        buttonText: null,
        disabled: true
      };
    }

    switch (status) {
      case 'completed':
        const completed = getCompletedPrograms().find(p => p.program_id === currentProgram.id);
        return {
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          text: `Voltooid op ${new Date(completed?.completed_at || '').toLocaleDateString('nl-NL')}`,
          color: 'bg-green-100 text-green-800',
          buttonText: 'Opnieuw Starten',
          disabled: false
        };
      case 'in_progress':
        const progress = getCurrentProgress(currentProgram.id);
        return {
          icon: <Play className="w-6 h-6 text-blue-600" />,
          text: `Dag ${progress?.current_day} - ${progress?.completed_days.length}/5 dagen voltooid`,
          color: 'bg-blue-100 text-blue-800',
          buttonText: 'Doorgaan',
          disabled: false
        };
      default:
        return {
          icon: <Calendar className="w-6 h-6 text-purple-600" />,
          text: 'Klaar om te starten',
          color: 'bg-purple-100 text-purple-800',
          buttonText: 'Start Programma',
          disabled: false
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-maitje-cream p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button onClick={onBack} variant="outline">
            ← Terug
          </Button>
          <h1 className="text-3xl font-nunito font-bold text-gray-800">
            Week Overzicht
          </h1>
        </div>

        {/* Week Navigation */}
        <div className="maitje-card mb-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => navigateWeek('prev')}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="text-center">
              <h2 className="text-2xl font-nunito font-bold text-gray-800">
                Week {selectedWeek}, {selectedYear}
              </h2>
              <p className="text-gray-600">
                {dateRange.startString} - {dateRange.endString}
              </p>
            </div>
            
            <Button
              onClick={() => navigateWeek('next')}
              variant="outline"
              size="sm"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Program Status */}
          <div className={`p-6 rounded-xl ${statusInfo.color} mb-6`}>
            <div className="flex items-center gap-4 mb-4">
              {statusInfo.icon}
              <div>
                <h3 className="font-nunito font-bold text-lg">
                  {currentProgram ? `${currentProgram.theme || 'Weekprogramma'}` : 'Geen Programma'}
                </h3>
                <p>{statusInfo.text}</p>
              </div>
            </div>
            
            {statusInfo.buttonText && (
              <Button
                onClick={handleStartProgram}
                disabled={statusInfo.disabled}
                className="w-full"
              >
                {statusInfo.buttonText}
              </Button>
            )}
          </div>

          {/* Daily Preview */}
          {currentProgram && currentProgram.program_data && (
            <div>
              <h4 className="font-nunito font-bold text-gray-800 mb-4">Dagindeling:</h4>
              <div className="grid grid-cols-5 gap-3">
                {['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'].map((day, index) => {
                  const dayNumber = index + 1;
                  const dayData = currentProgram.program_data[index];
                  const progress = getCurrentProgress(currentProgram.id);
                  const isCompleted = progress?.completed_days.includes(dayNumber);
                  const isCurrent = progress?.current_day === dayNumber;
                  
                  return (
                    <div
                      key={day}
                      className={`p-3 rounded-lg border-2 text-center ${
                        isCompleted
                          ? 'bg-green-100 border-green-300 text-green-800'
                          : isCurrent
                          ? 'bg-blue-100 border-blue-300 text-blue-800'
                          : 'bg-gray-50 border-gray-200 text-gray-600'
                      }`}
                    >
                      <div className="text-lg mb-1">
                        {isCompleted ? '✅' : isCurrent ? '📍' : '📅'}
                      </div>
                      <div className="text-xs font-bold">{day.slice(0, 3)}</div>
                      {dayData && (
                        <div className="text-xs mt-1">
                          {dayData.oefeningen?.length || 0} oefeningen
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeekNavigator;
