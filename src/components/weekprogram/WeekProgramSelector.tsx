
import React, { useState } from 'react';
import { Calendar, Clock, Trophy, Play, CheckCircle, Sparkles, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWeekPrograms } from '@/hooks/useWeekPrograms';
import { useWeekProgramProgress } from '@/hooks/useWeekProgramProgress';
import { getWeekDateRange } from '@/utils/weekUtils';
import WeekNavigator from './WeekNavigator';
import RecentActivity from '../dashboard/RecentActivity';

interface WeekProgramSelectorProps {
  childId: string;
  onSelectProgram: (programId: string, hasProgress?: boolean) => void;
  onBack: () => void;
}

type ViewMode = 'total' | 'week';

const WeekProgramSelector: React.FC<WeekProgramSelectorProps> = ({
  childId,
  onSelectProgram,
  onBack
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('total');
  const { programs, loading: programsLoading } = useWeekPrograms();
  const { 
    getCurrentProgress, 
    getCompletedPrograms, 
    startProgram,
    loading: progressLoading 
  } = useWeekProgramProgress(childId);

  if (viewMode === 'week') {
    return (
      <WeekNavigator
        childId={childId}
        onSelectProgram={onSelectProgram}
        onBack={() => setViewMode('total')}
      />
    );
  }

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
          bgColor: 'bg-gray-100 border-gray-300 opacity-75',
          icon: <Trophy className="w-5 h-5 text-gray-500" />,
          buttonText: 'Voltooid',
          buttonColor: 'bg-gray-400 cursor-not-allowed',
          disabled: true
        };
      case 'in_progress':
        const progress = getCurrentProgress(programId);
        const completedDays = progress?.completed_days.length || 0;
        return {
          badge: `${completedDays}/5 dagen`,
          bgColor: 'bg-yellow-100 border-yellow-300',
          icon: <Play className="w-5 h-5 text-yellow-600" />,
          buttonText: 'Doorgaan',
          buttonColor: 'bg-yellow-500 hover:bg-yellow-600',
          disabled: false
        };
      default:
        return {
          badge: 'Nieuw',
          bgColor: 'bg-white border-gray-200',
          icon: <Sparkles className="w-5 h-5 text-purple-600" />,
          buttonText: 'Start Programma',
          buttonColor: 'bg-purple-500 hover:bg-purple-600',
          disabled: false
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline">
              ← Terug
            </Button>
            <div>
              <h1 className="text-3xl font-nunito font-bold text-gray-800">
                Weekprogramma's
              </h1>
              <p className="text-gray-600 mt-1">
                Kies hoe je de programma's wilt bekijken
              </p>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setViewMode('total')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                viewMode === 'total'
                  ? 'bg-maitje-blue text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Totaal Overzicht</span>
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                viewMode === 'week'
                  ? 'bg-maitje-blue text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Week Overzicht</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity childId={childId} />

        {/* Programs Grid */}
        <div className="mt-6">
          <h2 className="text-xl font-nunito font-bold text-gray-800 mb-4">
            Alle Programma's
          </h2>
          
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
                    className={`maitje-card transition-all duration-200 hover:shadow-xl ${statusInfo.bgColor} ${
                      status !== 'completed' ? 'hover:scale-105' : ''
                    }`}
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
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
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
                      disabled={statusInfo.disabled}
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
    </div>
  );
};

export default WeekProgramSelector;
