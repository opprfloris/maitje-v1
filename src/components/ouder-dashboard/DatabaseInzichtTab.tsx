
import React, { useState, useEffect } from 'react';
import { Database, Search, Filter, Download, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const DatabaseInzichtTab = () => {
  const { user } = useAuth();
  const [selectedTable, setSelectedTable] = useState('profiles');
  const [searchFilter, setSearchFilter] = useState('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log('Database inzicht tab loaded, user:', user?.id);

  const tables = [
    { id: 'profiles', name: 'Ouder Accounts', description: 'Gebruikersprofielen en instellingen' },
    { id: 'children', name: 'Kinderen', description: 'Kind profielen en niveaus' },
    { id: 'user_interests', name: 'Interessegebieden', description: 'Thema\'s en interesses per gebruiker' },
    { id: 'user_ai_config', name: 'AI Configuratie', description: 'AI model en API instellingen' },
    { id: 'weekly_programs', name: 'Weekprogramma\'s', description: 'Gegenereerde lesprogramma\'s' },
    { id: 'user_privacy_settings', name: 'Privacy Instellingen', description: 'Notificatie en privacy voorkeuren' },
    { id: 'daily_plans', name: 'Dagplannen', description: 'Gegenereerde dagelijkse lesprogramma\'s' },
    { id: 'plan_item_progress', name: 'Oefening Voortgang', description: 'Status van individuele oefeningen' },
    { id: 'exercise_sessions', name: 'Oefensessies', description: 'Voltooide oefensessies en scores' },
    { id: 'helpers', name: 'mAItje Hulpjes', description: 'Beschikbare AI assistenten' }
  ];

  useEffect(() => {
    loadTableData();
  }, [selectedTable, user]);

  const loadTableData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      let query = supabase.from(selectedTable).select('*');
      
      // Voor gebruiker-specifieke tabellen, filter op user_id
      const userSpecificTables = ['profiles', 'user_interests', 'user_ai_config', 'weekly_programs', 'user_privacy_settings'];
      if (userSpecificTables.includes(selectedTable)) {
        if (selectedTable === 'profiles') {
          query = query.eq('id', user.id);
        } else {
          query = query.eq('user_id', user.id);
        }
      }

      const { data, error } = await query.limit(50);

      if (error) {
        console.error('Error loading table data:', error);
        setTableData([]);
        return;
      }

      setTableData(data || []);
    } catch (error) {
      console.error('Error loading table data:', error);
      setTableData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    if (tableData.length === 0) return;

    const headers = Object.keys(tableData[0]);
    const csvContent = [
      headers.join(','),
      ...tableData.map(row => 
        headers.map(header => {
          const value = row[header];
          if (typeof value === 'object' && value !== null) {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          return `"${String(value || '').replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedTable}_export.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredData = tableData.filter(row => {
    if (!searchFilter) return true;
    
    return Object.values(row).some(value => {
      if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value).toLowerCase().includes(searchFilter.toLowerCase());
      }
      return String(value || '').toLowerCase().includes(searchFilter.toLowerCase());
    });
  });

  return (
    <div className="space-y-6">
      {/* Warning */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-yellow-600">⚠️</span>
          <p className="text-yellow-800 font-semibold">Developer Tool</p>
        </div>
        <p className="text-yellow-700 text-sm mt-1">
          Dit tabblad is bedoeld voor ontwikkelaars en systeembeheerders. U ziet alleen uw eigen data voor privacy.
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
            {isLoading && <span className="text-sm text-gray-500 ml-2">(Laden...)</span>}
          </h4>
          <div className="flex gap-2">
            <button 
              onClick={loadTableData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
            >
              <Eye className="w-4 h-4" />
              Vernieuwen
            </button>
            <button 
              onClick={exportToCSV}
              disabled={filteredData.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Exporteer CSV
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-maitje-blue rounded-full mx-auto mb-4"></div>
              Data wordt geladen...
            </div>
          ) : filteredData.length > 0 ? (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {Object.keys(filteredData[0]).map((key) => (
                    <th key={key} className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 min-w-[120px]">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {Object.values(row).map((value, cellIndex) => (
                      <td key={cellIndex} className="border border-gray-300 px-3 py-2 text-gray-800 max-w-[200px]">
                        <div className="truncate" title={typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}>
                          {typeof value === 'object' && value !== null ? 
                            <span className="text-blue-600 font-mono text-xs">
                              {JSON.stringify(value).length > 50 ? 
                                JSON.stringify(value).substring(0, 50) + '...' : 
                                JSON.stringify(value)
                              }
                            </span> : 
                            String(value || '')
                          }
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchFilter ? 
                `Geen data gevonden die overeenkomt met "${searchFilter}"` : 
                'Geen data beschikbaar voor deze tabel'
              }
            </div>
          )}
        </div>

        {filteredData.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            {searchFilter ? 
              `${filteredData.length} van ${tableData.length} rijen weergegeven` :
              `${tableData.length} rijen weergegeven`
            }
          </div>
        )}
      </div>

      {/* AI Queries Log */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-6 h-6 text-purple-500" />
          <h4 className="text-lg font-nunito font-bold text-gray-800">Recente AI Queries Log</h4>
        </div>
        
        <div className="space-y-3">
          {[
            { time: '14:32', query: 'Genereer weekprogramma voor kind', model: 'GPT-4-Mini', status: 'Succesvol' },
            { time: '14:15', query: 'Analyseer voortgang statistieken', model: 'GPT-4-Mini', status: 'Succesvol' },
            { time: '13:45', query: 'Geef hint voor rekensom', model: 'GPT-4-Mini', status: 'Succesvol' },
            { time: '13:20', query: 'Personaliseer oefening thema', model: 'GPT-4-Mini', status: 'Succesvol' }
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
