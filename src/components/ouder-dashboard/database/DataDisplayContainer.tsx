
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DataDisplay from './DataDisplay';
import { TableName } from './TableSelector';

interface DataDisplayContainerProps {
  selectedTable: TableName;
  searchFilter: string;
}

const DataDisplayContainer: React.FC<DataDisplayContainerProps> = ({
  selectedTable,
  searchFilter
}) => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTableData = async () => {
    if (!selectedTable) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from(selectedTable)
        .select('*')
        .limit(100);

      if (error) {
        console.error('Error fetching table data:', error);
        setTableData([]);
      } else {
        setTableData(data || []);
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
      setTableData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [selectedTable]);

  const filteredData = tableData.filter(row => {
    if (!searchFilter) return true;
    
    return Object.values(row).some(value => 
      String(value || '').toLowerCase().includes(searchFilter.toLowerCase())
    );
  });

  const handleExport = () => {
    if (filteredData.length === 0) return;

    const headers = Object.keys(filteredData[0]);
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTable}_export.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <DataDisplay
      selectedTable={selectedTable}
      tableData={tableData}
      filteredData={filteredData}
      isLoading={isLoading}
      searchFilter={searchFilter}
      onRefresh={fetchTableData}
      onExport={handleExport}
    />
  );
};

export default DataDisplayContainer;
