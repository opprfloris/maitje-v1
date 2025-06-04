
import React from 'react';
import { Filter } from 'lucide-react';

const AIQueriesLog: React.FC = () => {
  const queries = [
    { time: '14:32', query: 'Genereer weekprogramma voor kind', model: 'GPT-4-Mini', status: 'Succesvol' },
    { time: '14:15', query: 'Analyseer voortgang statistieken', model: 'GPT-4-Mini', status: 'Succesvol' },
    { time: '13:45', query: 'Geef hint voor rekensom', model: 'GPT-4-Mini', status: 'Succesvol' },
    { time: '13:20', query: 'Personaliseer oefening thema', model: 'GPT-4-Mini', status: 'Succesvol' }
  ];

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
              <p className="text-sm text-gray-600">{log.time} • {log.model}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              log.status === 'Succesvol' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {log.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIQueriesLog;
