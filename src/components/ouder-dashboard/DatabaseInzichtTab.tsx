
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import TableSelector from './database/TableSelector';
import DataDisplay from './database/DataDisplay';
import AIQueriesLog from './database/AIQueriesLog';
import DatabaseWarning from './database/DatabaseWarning';

type TableName = 'profiles' | 'children' | 'family_connections' | 'exercise_sessions' | 'exercise_results' | 'daily_progress' | 'daily_plans' | 'plan_item_progress' | 'weekly_programs' | 'user_ai_config' | 'user_interests' | 'user_privacy_settings' | 'helpers' | 'specific_tips' | 'generic_tips';

const DatabaseInzichtTab = () => {
  const { user } = useAuth();
  const [selectedTable, setSelectedTable] = useState<TableName>('profiles');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiQueries, setAiQueries] = useState<any[]>([]);

  useEffect(() => {
    if (user && selectedTable) {
      fetchData();
    }
  }, [user, selectedTable]);

  useEffect(() => {
    // Simulate AI queries for demonstration
    setAiQueries([
      {
        id: 1,
        query: "SELECT * FROM exercise_sessions WHERE child_id = ? AND created_at > ?",
        timestamp: new Date().toISOString(),
        executionTime: "45ms",
        rowsAffected: 23
      },
      {
        id: 2,
        query: "UPDATE daily_progress SET streak_days = streak_days + 1 WHERE child_id = ?",
        timestamp: new Date(Date.now() - 300000).toISOString(),
        executionTime: "12ms",
        rowsAffected: 1
      }
    ]);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { data: result, error: fetchError } = await supabase
        .from(selectedTable)
        .select('*')
        .limit(100);

      if (fetchError) {
        throw fetchError;
      }

      setData(result || []);
    } catch (err: any) {
      setError(err.message || 'Er is een fout opgetreden bij het ophalen van data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <DatabaseWarning />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TableSelector 
            selectedTable={selectedTable}
            onTableChange={setSelectedTable}
          />
        </div>
        
        <div className="lg:col-span-2">
          <DataDisplay 
            tableName={selectedTable}
            data={data}
            loading={loading}
            error={error}
          />
        </div>
      </div>

      <AIQueriesLog queries={aiQueries} />
    </div>
  );
};

export default DatabaseInzichtTab;
