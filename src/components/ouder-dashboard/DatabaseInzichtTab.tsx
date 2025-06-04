
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { TableName } from './database/TableSelector';
import TableSelector from './database/TableSelector';
import DataDisplay from './database/DataDisplay';
import AIQueriesLog from './database/AIQueriesLog';
import DatabaseWarning from './database/DatabaseWarning';

const DatabaseInzichtTab = () => {
  const { user } = useAuth();
  const [selectedTable, setSelectedTable] = useState<TableName>('profiles');
  const [searchFilter, setSearchFilter] = useState('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log('Database inzicht tab loaded, user:', user?.id);

  useEffect(() => {
    loadTableData();
  }, [selectedTable, user]);

  const loadTableData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      let query = supabase.from(selectedTable).select('*');
      
      // Voor gebruiker-specifieke tabellen, filter op user_id
      const userSpecificTables: TableName[] = ['profiles', 'user_interests', 'user_ai_config', 'weekly_programs', 'user_privacy_settings'];
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
      <DatabaseWarning />
      
      <TableSelector
        selectedTable={selectedTable}
        onTableChange={setSelectedTable}
        searchFilter={searchFilter}
        onSearchChange={setSearchFilter}
      />

      <DataDisplay
        selectedTable={selectedTable}
        tableData={tableData}
        filteredData={filteredData}
        isLoading={isLoading}
        searchFilter={searchFilter}
        onRefresh={loadTableData}
        onExport={exportToCSV}
      />

      <AIQueriesLog />
    </div>
  );
};

export default DatabaseInzichtTab;
