
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, BookOpen, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWeekPrograms } from '@/hooks/useWeekPrograms';

interface WeekProgramSelectorProps {
  childId: string;
  onSelectProgram: (programId: string) => void;
  onBack: () => void;
}

const WeekProgramSelector = ({ childId, onSelectProgram, onBack }: WeekProgramSelectorProps) => {
  const { weekPrograms, loading } = useWeekPrograms(childId);
  const [selectedView, setSelectedView] = useState<'available' | 'completed'>('available');

  const availablePrograms = weekPrograms.filter(program => program.status === 'active' || program.status === 'in_progress');
  const completedPrograms = weekPrograms.filter(program => program.status === 'completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Beschikbaar';
      case 'in_progress': return 'Bezig';
      case 'completed': return 'Voltooid';
      default: return status;
    }
  };

  const currentPrograms = selectedView === 'available' ? availablePrograms : completedPrograms;

  return (
    <div className="min-h-screen bg-maitje-cream">
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Terug naar Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-nunito font-bold text-gray-800">Weekprogramma's</h1>
              <p className="text-gray-600">Kies een weekprogramma om te starten</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => setSelectedView('available')}
            variant={selectedView === 'available' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Beschikbaar ({availablePrograms.length})
          </Button>
          <Button
            onClick={() => setSelectedView('completed')}
            variant={selectedView === 'completed' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            Voltooid ({completedPrograms.length})
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-maitje-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Weekprogramma's laden...</p>
          </div>
        ) : currentPrograms.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-nunito font-semibold text-gray-500 mb-2">
              {selectedView === 'available' ? 'Geen beschikbare programma\'s' : 'Geen voltooide programma\'s'}
            </h3>
            <p className="text-gray-400">
              {selectedView === 'available' 
                ? 'Er zijn momenteel geen weekprogramma\'s beschikbaar.'
                : 'Je hebt nog geen weekprogramma\'s voltooid.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPrograms.map((program) => (
              <div key={program.id} className="maitje-card hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-nunito font-bold text-gray-800 mb-2">
                      Week {program.week_number}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getStatusColor(program.status)}>
                        {getStatusText(program.status)}
                      </Badge>
                      <Badge variant="outline">
                        {program.subject}
                      </Badge>
                    </div>
                  </div>
                </div>

                {program.theme && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>Thema:</strong> {program.theme}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Week {program.week_number}</span>
                  </div>
                  {program.created_at && (
                    <span>
                      {new Date(program.created_at).toLocaleDateString('nl-NL')}
                    </span>
                  )}
                </div>

                <Button
                  onClick={() => onSelectProgram(program.id)}
                  className="w-full maitje-button"
                  disabled={program.status === 'completed'}
                >
                  {program.status === 'completed' ? 'Voltooid' : 
                   program.status === 'in_progress' ? 'Verder gaan' : 'Start programma'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeekProgramSelector;
