import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, CheckCircle, Star, Trophy, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWeekPrograms } from '@/hooks/useWeekPrograms';
import { useWeekProgramProgress } from '@/hooks/useWeekProgramProgress';
import { Helper } from '@/types/helpers';
import { getWeekDateRange } from '@/utils/weekUtils';

interface WeekProgramModeProps {
  programId: string;
  childId: string;
  childName: string;
  selectedHelper: Helper | null;
  onExit: () => void;
}

const WeekProgramMode: React.FC<WeekProgramModeProps> = ({
  programId,
  childId,
  childName,
  selectedHelper,
  onExit
}) => {
  const { getProgramByWeek, getProgramById } = useWeekPrograms();
  const { getCurrentProgress, updateDayProgress } = useWeekProgramProgress(childId);
  
  const [currentDay, setCurrentDay] = useState(1);
  const [dayActivities, setDayActivities] = useState<any[]>([]);
  const [completedActivities, setCompletedActivities] = useState<Set<number>>(new Set());
  const [program, setProgram] = useState<any>(null);

  const progress = getCurrentProgress(programId);

  // Helper function to get current week number
  function getCurrentWeekNumber(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + start.getDay() + 1) / 7);
  }

  // Load program data
  useEffect(() => {
    const loadProgram = async () => {
      if (programId) {
        const programData = await getProgramById(programId);
        setProgram(programData);
      } else if (progress) {
        // Try to find by week if no specific programId
        const weekProgram = getProgramByWeek(
          progress.started_at ? new Date(progress.started_at).getFullYear() : new Date().getFullYear(), 
          getCurrentWeekNumber()
        );
        setProgram(weekProgram);
      }
    };
    
    loadProgram();
  }, [programId, progress, getProgramById, getProgramByWeek]);

  useEffect(() => {
    if (progress) {
      setCurrentDay(progress.current_day);
      
      // Load day progress
      const savedProgress = progress.day_progress[progress.current_day] || {};
      const completedIds = savedProgress.completedActivities || [];
      setCompletedActivities(new Set(completedIds));
    }
  }, [progress]);

  useEffect(() => {
    if (program && program.program_data && program.program_data.length > 0) {
      const dayData = program.program_data[currentDay - 1];
      if (dayData && dayData.oefeningen) {
        setDayActivities(dayData.oefeningen);
      }
    }
  }, [program, currentDay]);

  const dayNames = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'];

  const toggleActivity = async (activityIndex: number) => {
    const newCompleted = new Set(completedActivities);
    
    if (newCompleted.has(activityIndex)) {
      newCompleted.delete(activityIndex);
    } else {
      newCompleted.add(activityIndex);
    }
    
    setCompletedActivities(newCompleted);

    // Save progress
    if (progress) {
      const dayProgress = {
        completedActivities: Array.from(newCompleted),
        totalActivities: dayActivities.length,
        lastUpdated: new Date().toISOString()
      };

      const allCompleted = newCompleted.size === dayActivities.length;
      
      await updateDayProgress(
        progress.id,
        currentDay,
        dayProgress,
        allCompleted
      );
    }
  };

  const goToNextDay = () => {
    if (currentDay < 5) {
      setCurrentDay(currentDay + 1);
      setCompletedActivities(new Set());
    }
  };

  const goToPrevDay = () => {
    if (currentDay > 1) {
      setCurrentDay(currentDay - 1);
      
      // Load previous day progress
      if (progress) {
        const savedProgress = progress.day_progress[currentDay - 1] || {};
        const completedIds = savedProgress.completedActivities || [];
        setCompletedActivities(new Set(completedIds));
      }
    }
  };

  const getSubjectIcon = (type: string) => {
    switch (type) {
      case 'rekenen': return '🧮';
      case 'taal': return '📚';
      case 'engels': return '🇬🇧';
      default: return '📝';
    }
  };

  const getSubjectColor = (type: string) => {
    switch (type) {
      case 'rekenen': return 'bg-green-100 border-green-200 text-green-800';
      case 'taal': return 'bg-blue-100 border-blue-200 text-blue-800';
      case 'engels': return 'bg-purple-100 border-purple-200 text-purple-800';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const isDayCompleted = (day: number) => {
    return progress?.completed_days.includes(day) || false;
  };

  const totalCompletedDays = progress?.completed_days.length || 0;
  const weekProgress = (totalCompletedDays / 5) * 100;

  if (!program || !progress) {
    return (
      <div className="min-h-screen bg-maitje-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-maitje-blue rounded-full flex items-center justify-center text-2xl mx-auto mb-4 animate-bounce">
            🦉
          </div>
          <p className="text-gray-600 font-nunito">Weekprogramma laden...</p>
        </div>
      </div>
    );
  }

  const dateRange = getWeekDateRange(2025, program.week_number);

  return (
    <div className="min-h-screen bg-maitje-cream">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onExit}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug
            </Button>
            <div>
              <h1 className="text-xl font-nunito font-bold text-gray-800">
                Week {program.week_number} - {dayNames[currentDay - 1]}
              </h1>
              <p className="text-sm text-gray-600">
                {dateRange.startString} - {dateRange.endString}
              </p>
            </div>
          </div>
          
          {selectedHelper && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedHelper.avatar_emoji}</span>
              <span className="text-sm font-medium text-gray-700">{selectedHelper.name}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Week Progress */}
        <div className="maitje-card mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-nunito font-bold text-gray-800">Week Voortgang</h2>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            {dayNames.map((dayName, index) => {
              const dayNumber = index + 1;
              const isCompleted = isDayCompleted(dayNumber);
              const isCurrent = dayNumber === currentDay;
              
              return (
                <div
                  key={dayNumber}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-maitje-blue border-maitje-blue text-white'
                      : isCompleted
                      ? 'bg-green-100 border-green-300 text-green-800'
                      : 'bg-gray-100 border-gray-200 text-gray-600'
                  }`}
                  onClick={() => setCurrentDay(dayNumber)}
                >
                  <div className="text-center">
                    <div className="text-lg mb-1">
                      {isCompleted ? '✅' : isCurrent ? '📍' : '📅'}
                    </div>
                    <div className="text-xs font-medium">{dayName.slice(0, 2)}</div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Totale voortgang</span>
            <span>{totalCompletedDays}/5 dagen voltooid</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${weekProgress}%` }}
            />
          </div>
        </div>

        {/* Helper Tip */}
        {selectedHelper && (
          <div className="maitje-card mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-start gap-3">
              <span className="text-3xl">{selectedHelper.avatar_emoji}</span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  {selectedHelper.name} zegt:
                </h3>
                <p className="text-gray-700">
                  {isDayCompleted(currentDay) 
                    ? `Geweldig werk ${childName}! Je hebt ${dayNames[currentDay - 1]} al afgerond. Ga zo door! 🌟`
                    : `Hoi ${childName}! Laten we samen ${dayNames[currentDay - 1]} aangaan. Je kan het! 💪`
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Day Activities */}
        <div className="maitje-card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-maitje-blue" />
              <h2 className="text-xl font-nunito font-bold text-gray-800">
                {dayNames[currentDay - 1]} Activiteiten
              </h2>
            </div>
            <div className="text-sm text-gray-600">
              {completedActivities.size} van {dayActivities.length} voltooid
            </div>
          </div>

          {dayActivities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Geen activiteiten voor deze dag.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dayActivities.map((activity, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    completedActivities.has(index)
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleActivity(index)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      completedActivities.has(index)
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 text-gray-400'
                    }`}>
                      {completedActivities.has(index) ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{getSubjectIcon(activity.type)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSubjectColor(activity.type)}`}>
                          {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{activity.tijd}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-gray-800 mb-1">{activity.titel}</h3>
                      {activity.beschrijving && (
                        <p className="text-sm text-gray-600">{activity.beschrijving}</p>
                      )}
                    </div>
                    
                    {completedActivities.has(index) && (
                      <div className="text-yellow-500">
                        <Star className="w-6 h-6 fill-current" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Day Navigation */}
          <div className="flex justify-between items-center mt-6 pt-6 border-t">
            <Button
              onClick={goToPrevDay}
              disabled={currentDay === 1}
              variant="outline"
            >
              ← Vorige Dag
            </Button>
            
            <div className="text-center">
              {completedActivities.size === dayActivities.length && dayActivities.length > 0 && (
                <div className="text-green-600 font-semibold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Dag voltooid! 🎉
                </div>
              )}
            </div>
            
            <Button
              onClick={goToNextDay}
              disabled={currentDay === 5}
              variant="outline"
            >
              Volgende Dag →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekProgramMode;
