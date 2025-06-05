
import React from 'react';
import { Clock, BookOpen, Calendar } from 'lucide-react';
import { useRecentActivity } from '@/hooks/useRecentActivity';

interface RecentActivityProps {
  childId: string;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ childId }) => {
  const { recentActivity, loading } = useRecentActivity(childId);

  if (loading) {
    return (
      <div className="maitje-card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const latestActivity = recentActivity[0];

  if (!latestActivity) {
    return (
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-5 h-5 text-maitje-blue" />
          <h3 className="font-nunito font-bold text-gray-800">Laatste Activiteit</h3>
        </div>
        <p className="text-gray-600 text-center py-4">
          Nog geen activiteiten uitgevoerd
        </p>
      </div>
    );
  }

  return (
    <div className="maitje-card">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="w-5 h-5 text-maitje-blue" />
        <h3 className="font-nunito font-bold text-gray-800">Laatste Activiteit</h3>
      </div>
      
      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
        {latestActivity.activity_type === 'week_program' ? (
          <Calendar className="w-6 h-6 text-blue-600" />
        ) : (
          <BookOpen className="w-6 h-6 text-green-600" />
        )}
        
        <div className="flex-1">
          <p className="font-semibold text-gray-800">
            {latestActivity.activity_type === 'week_program' 
              ? `Weekprogramma - Dag ${latestActivity.last_day || 1}`
              : 'Dagelijkse Oefeningen'
            }
          </p>
          <p className="text-sm text-gray-600">
            {latestActivity.completed_exercises} van {latestActivity.total_exercises} voltooid
          </p>
          <p className="text-xs text-gray-500">
            {new Date(latestActivity.updated_at).toLocaleDateString('nl-NL')}
          </p>
        </div>
        
        <div className="text-right">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <span className="text-sm font-bold text-gray-800">
              {Math.round((latestActivity.completed_exercises / latestActivity.total_exercises) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
