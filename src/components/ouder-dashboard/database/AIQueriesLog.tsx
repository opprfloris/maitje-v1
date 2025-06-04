
import React from 'react';
import { Filter } from 'lucide-react';

interface AIQueriesLogProps {
  queries: Array<{
    id: number;
    query: string;
    timestamp: string;
    executionTime: string;
    rowsAffected: number;
  }>;
}

const AIQueriesLog: React.FC<AIQueriesLogProps> = ({ queries }) => {
  return (
    <div className="maitje-card">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-6 h-6 text-purple-500" />
        <h4 className="text-lg font-nunito font-bold text-gray-800">Recente AI Queries Log</h4>
      </div>
      
      <div className="space-y-3">
        {queries.map((log, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-800">{log.query}</p>
              <p className="text-sm text-gray-600">{new Date(log.timestamp).toLocaleTimeString()} • GPT-4-Mini</p>
            </div>
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
              Succesvol
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIQueriesLog;
