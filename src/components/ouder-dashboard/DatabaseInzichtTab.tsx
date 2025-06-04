
import React, { useState } from 'react';
import { Database, Search, Filter, Download } from 'lucide-react';

const DatabaseInzichtTab = () => {
  const [selectedTable, setSelectedTable] = useState('profiles');
  const [searchFilter, setSearchFilter] = useState('');

  const tables = [
    { id: 'profiles', name: 'Ouder Accounts', description: 'Gebruikersprofielen en instellingen' },
    { id: 'children', name: 'Kinderen', description: 'Kind profielen en niveaus' },
    { id: 'daily_plans', name: 'Dagplannen', description: 'Gegenereerde lesprogramma\'s' },
    { id: 'plan_item_progress', name: 'Oefening Voortgang', description: 'Status van individuele oefeningen' },
    { id: 'exercise_sessions', name: 'Oefensessies', description: 'Voltooide oefensessies en scores' },
    { id: 'helpers', name: 'mAItje Hulpjes', description: 'Beschikbare AI assistenten' }
  ];

  const mockData = {
    profiles: [
      { id: '1', email: 'ouder@voorbeeld.nl', first_name: 'Jan', last_name: 'Janssen', child_name: 'Joos' },
      { id: '2', email: 'mama@test.nl', first_name: 'Maria', last_name: 'Smit', child_name: 'Emma' }
    ],
    children: [
      { id: '1', name: 'Joos', school_level: 'Groep 5', current_level: 5, avatar_emoji: '👦' },
      { id: '2', name: 'Emma', school_level: 'Groep 4', current_level: 4, avatar_emoji: '👧' }
    ],
    daily_plans: [
      { id: '1', child_id: '1', date: '2024-11-06', plan_items: 3 },
      { id: '2', child_id: '2', date: '2024-11-06', plan_items: 2 }
    ]
  };

  const currentData = mockData[selectedTable as keyof typeof mockData] || [];

  return (
    <div className="space-y-6">
      {/* Warning */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-yellow-600">⚠️</span>
          <p className="text-yellow-800 font-semibold">Developer Tool</p>
        </div>
        <p className="text-yellow-700 text-sm mt-1">
          Dit tabblad is bedoeld voor ontwikkelaars en systeembeheerders. Wijzig geen data tenzij je weet wat je doet.
        </p>
      </div>

      {/* Tabel Selectie */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-6 h-6 text-gray-600" />
          <h3 className="text-xl font-nunito font-bold text-gray-800">Database Inzicht</h3>
        </div>
        
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Selecteer Tabel</label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
            >
              {tables.map((table) => (
                <option key={table.id} value={table.id}>
                  {table.name} - {table.description}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Zoeken/Filteren</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Zoek in tabel..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Data Weergave */}
      <div className="maitje-card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-nunito font-bold text-gray-800">
            Tabel: {tables.find(t => t.id === selectedTable)?.name}
          </h4>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Download className="w-4 h-4" />
            Exporteer CSV
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {currentData.length > 0 && Object.keys(currentData[0]).map((key) => (
                  <th key={key} className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {Object.values(row).map((value, cellIndex) => (
                    <td key={cellIndex} className="border border-gray-300 px-4 py-2 text-gray-800">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          
          {currentData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Geen data beschikbaar voor deze tabel
            </div>
          )}
        </div>
      </div>

      {/* AI Queries Log */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-6 h-6 text-purple-500" />
          <h4 className="text-lg font-nunito font-bold text-gray-800">Recente AI Queries Log</h4>
        </div>
        
        <div className="space-y-3">
          {[
            { time: '14:32', query: 'Genereer weekprogramma voor Joos', model: 'GPT-4-Mini', status: 'Succesvol' },
            { time: '14:15', query: 'Analyseer voortgang kind', model: 'GPT-4-Mini', status: 'Succesvol' },
            { time: '13:45', query: 'Geef hint voor rekensom', model: 'GPT-4-Mini', status: 'Succesvol' }
          ].map((log, index) => (
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
    </div>
  );
};

export default DatabaseInzichtTab;
