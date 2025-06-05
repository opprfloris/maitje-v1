
import React from 'react';
import { Calendar, Clock, Trophy, Play, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWeekPrograms } from '@/hooks/useWeekPrograms';
import { useWeekProgramProgress } from '@/hooks/useWeekProgramProgress';
import { getWeekDateRange } from '@/utils/weekUtils';

interface WeekProgramSelectorProps {
  childId: string;
  onSelectProgram: (programId: string, hasProgress?: boolean) => void;
  onBack: () => void;
}

const WeekProgramSelector: React.FC<WeekProgramSelectorProps> = ({
  childId,
  onSelectProgram,
  onBack
}) => {
  const { programs, loading: programsLoading } = useWeekPrograms();
  const { 
    getCurrentProgress, 
    getCompletedPrograms, 
    startProgram,
    loading: progressLoading 
  } = useWeekProgramProgress(childId);

  const handleStartProgram = async (programId: string) => {
    const existingProgress = getCurrentProgress(programId);
    
    if (existingProgress) {
      onSelectProgram(programId, true);
    } else {
      const newProgress = await startProgram(programId);
      if (newProgress) {
        onSelectProgram(programId, true);
      }
    }
  };

  const getDaysInWords = () => ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'];

  const getProgramStatus = (programId: string) => {
    const currentProgress = getCurrentProgress(programId);
    const completed = getCompletedPrograms().find(p => p.program_id === programId);
    
    if (completed) return 'completed';
    if (currentProgress) return 'in_progress';
    return 'available';
  };

  const getStatusInfo = (status: string, programId: string) => {
    switch (status) {
      case 'completed':
        return {
          badge: 'Voltooid',
          bgColor: 'bg-green-100 border-green-200',
          icon: <Trophy className="w-5 h-5 text-green-600" />,
          buttonText: 'Opnieuw Starten',
          buttonColor: 'bg-green-500 hover:bg-green-600'
        };
      case 'in_progress':
        const progress = getCurrentProgress(programId);
        const completedDays = progress?.completed_days.length || 0;
        return {
          badge: `${completedDays}/5 dagen`,
          bgColor: 'bg-blue-100 border-blue-200',
          icon: <Play className="w-5 h-5 text-blue-600" />,
          buttonText: 'Doorgaan',
          buttonColor: 'bg-blue-500 hover:bg-blue-600'
        };
      default:
        return {
          badge: 'Nieuw',
          bgColor: 'bg-purple-100 border-purple-200',
          icon: <Sparkles className="w-5 h-5 text-purple-600" />,
          buttonText: 'Start Programma',
          buttonColor: 'bg-purple-500 hover:bg-purple-600'
        };
    }
  };

  if (programsLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-maitje-cream p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-maitje-blue rounded-full flex items-center justify-center text-2xl mx-auto mb-4 animate-bounce">
              🦉
            </div>
            <p className="text-gray-600 font-nunito">Weekprogramma's laden...</p>
          </div>
        </div>
      </div>
    );
  }

  const availablePrograms = programs.filter(p => p.status === 'published');

  return (
    <div className="min-h-screen bg-maitje-cream p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="px-6"
          >
            ← Terug
          </Button>
          <div>
            <h1 className="text-3xl font-nunito font-bold text-gray-800">
              Kies een Weekprogramma
            </h1>
            <p className="text-gray-600 mt-1">
              Selecteer een weekprogramma om mee aan de slag te gaan
            </p>
          </div>
        </div>

        {/* Programs Grid */}
        {availablePrograms.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              📚
            </div>
            <h3 className="text-xl font-nunito font-bold text-gray-800 mb-2">
              Geen weekprogramma's beschikbaar
            </h3>
            <p className="text-gray-600">
              Vraag je ouder om een weekprogramma aan te maken in het ouder dashboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePrograms.map((program) => {
              const status = getProgramStatus(program.id);
              const statusInfo = getStatusInfo(status, program.id);
              const dateRange = getWeekDateRange(program.year, program.week_number);
              const currentProgress = getCurrentProgress(program.id);

              return (
                <div
                  key={program.id}
                  className={`maitje-card transition-all duration-200 hover:shadow-xl hover:scale-105 ${statusInfo.bgColor}`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <span className="font-semibold text-gray-800">
                        Week {program.week_number}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-full border">
                      {statusInfo.icon}
                      <span className="text-sm font-medium">{statusInfo.badge}</span>
                    </div>
                  </div>

                  {/* Date Range */}
                  <p className="text-sm text-gray-600 mb-3">
                    {dateRange.startString} - {dateRange.endString} {program.year}
                  </p>

                  {/* Theme */}
                  {program.theme && (
                    <div className="mb-3">
                      <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                        🎨 {program.theme}
                      </span>
                    </div>
                  )}

                  {/* Difficulty */}
                  <div className="mb-4">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      📊 {program.difficulty_level === 'makkelijker' ? 'Makkelijker' : 
                           program.difficulty_level === 'uitdagend' ? 'Uitdagend' : 'Op niveau'}
                    </span>
                  </div>

                  {/* Progress Bar for in-progress programs */}
                  {status === 'in_progress' && currentProgress && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Voortgang</span>
                        <span>{currentProgress.completed_days.length}/5 dagen</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(currentProgress.completed_days.length / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Activities Preview */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Activiteiten:</p>
                    <div className="text-sm text-gray-600">
                      {program.program_data && program.program_data.length > 0 ? (
                        <p>{program.program_data.length} dagen vol leuke oefeningen!</p>
                      ) : (
                        <p>Weekprogramma wordt geladen...</p>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleStartProgram(program.id)}
                    className={`w-full text-white ${statusInfo.buttonColor}`}
                  >
                    {statusInfo.buttonText}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeekProgramSelector;
