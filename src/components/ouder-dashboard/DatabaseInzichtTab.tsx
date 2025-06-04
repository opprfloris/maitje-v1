
import React, { useState, useEffect } from 'react';
import { Database, HelpCircle, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import TableSelector from './database/TableSelector';
import DataDisplay from './database/DataDisplay';
import AIQueriesLog from './database/AIQueriesLog';
import DatabaseWarning from './database/DatabaseWarning';

type TableName = 'profiles' | 'children' | 'family_connections' | 'exercise_sessions' | 'exercise_results' | 'daily_progress' | 'daily_plans' | 'plan_item_progress' | 'weekly_programs' | 'user_privacy_settings' | 'user_ai_config' | 'user_interests' | 'helpers' | 'specific_tips' | 'generic_tips';

const DatabaseInzichtTab = () => {
  const { user } = useAuth();
  const [selectedTable, setSelectedTable] = useState<TableName>('profiles');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tableOptions: { value: TableName; label: string }[] = [
    { value: 'profiles', label: 'Gebruikersprofielen' },
    { value: 'children', label: 'Kinderen' },
    { value: 'family_connections', label: 'Familieverbindingen' },
    { value: 'exercise_sessions', label: 'Oefensessies' },
    { value: 'exercise_results', label: 'Oefen resultaten' },
    { value: 'daily_progress', label: 'Dagelijkse voortgang' },
    { value: 'daily_plans', label: 'Dagplannen' },
    { value: 'plan_item_progress', label: 'Plan item voortgang' },
    { value: 'weekly_programs', label: 'Weekprogrammas' },
    { value: 'user_privacy_settings', label: 'Privacy instellingen' },
    { value: 'user_ai_config', label: 'AI configuratie' },
    { value: 'user_interests', label: 'Gebruikersinteresses' },
    { value: 'helpers', label: 'Helpers' },
    { value: 'specific_tips', label: 'Specifieke tips' },
    { value: 'generic_tips', label: 'Algemene tips' }
  ];

  const fetchData = async (tableName: TableName) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data: tableData, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .limit(20);

      if (fetchError) {
        throw fetchError;
      }

      setData(tableData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedTable);
  }, [selectedTable, user]);

  return (
    <div className="space-y-6">
      <DatabaseWarning />

      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-nunito font-bold text-gray-800">Database Inzichten</h3>
        </div>

        <TableSelector 
          selectedTable={selectedTable}
          onTableChange={setSelectedTable}
          tableOptions={tableOptions}
        />

        <DataDisplay 
          data={data}
          loading={loading}
          error={error}
          tableName={selectedTable}
        />
      </div>

      <AIQueriesLog />

      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-green-500" />
          <h4 className="text-lg font-nunito font-bold text-gray-800">Database Statistieken</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-semibold text-blue-800">Totaal Records</h5>
            <p className="text-2xl font-bold text-blue-600">{data.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h5 className="font-semibold text-green-800">Actieve Tabellen</h5>
            <p className="text-2xl font-bold text-green-600">{tableOptions.length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h5 className="font-semibold text-purple-800">Data Status</h5>
            <p className="text-2xl font-bold text-purple-600">Live</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseInzichtTab;
