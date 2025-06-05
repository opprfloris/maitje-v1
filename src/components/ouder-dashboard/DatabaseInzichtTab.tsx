
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TableSelector, { TableName } from './database/TableSelector';
import DataDisplayContainer from './database/DataDisplayContainer';
import AIQueriesLog from './database/AIQueriesLog';

const DatabaseInzichtTab = () => {
  const [selectedTable, setSelectedTable] = useState<TableName>('profiles');
  const [searchFilter, setSearchFilter] = useState('');

  // Mock queries data for now
  const mockQueries = [
    {
      id: 1,
      query: "SELECT * FROM profiles WHERE created_at > '2024-01-01'",
      timestamp: new Date().toISOString(),
      executionTime: "45ms",
      rowsAffected: 12
    },
    {
      id: 2,
      query: "SELECT COUNT(*) FROM children WHERE current_level > 5",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      executionTime: "23ms",
      rowsAffected: 8
    },
    {
      id: 3,
      query: "UPDATE daily_progress SET streak_days = streak_days + 1",
      timestamp: new Date(Date.now() - 600000).toISOString(),
      executionTime: "67ms",
      rowsAffected: 24
    }
  ];

  return (
    <div className="space-y-6">
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-maitje-blue rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">🗄️</span>
          </div>
          <div>
            <h2 className="text-2xl font-nunito font-bold text-gray-800">Database Inzicht</h2>
            <p className="text-gray-600">Bekijk en analyseer je database gegevens</p>
          </div>
        </div>

        <Tabs defaultValue="tables" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white shadow-sm">
            <TabsTrigger value="tables" className="flex items-center gap-2">
              📊 Data Tabellen
            </TabsTrigger>
            <TabsTrigger value="queries" className="flex items-center gap-2">
              🔍 AI Queries Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tables" className="space-y-6">
            <div className="maitje-card">
              <TableSelector 
                selectedTable={selectedTable}
                onTableChange={setSelectedTable}
                searchFilter={searchFilter}
                onSearchChange={setSearchFilter}
              />
            </div>
            {selectedTable && (
              <div className="maitje-card">
                <DataDisplayContainer 
                  selectedTable={selectedTable} 
                  searchFilter={searchFilter}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="queries" className="space-y-6">
            <div className="maitje-card">
              <AIQueriesLog queries={mockQueries} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DatabaseInzichtTab;
