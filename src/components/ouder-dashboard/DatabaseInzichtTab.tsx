
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TableSelector from './database/TableSelector';
import DataDisplay from './database/DataDisplay';
import AIQueriesLog from './database/AIQueriesLog';

const DatabaseInzichtTab = () => {
  const [selectedTable, setSelectedTable] = useState<string>('');

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
                onTableSelect={setSelectedTable}
                selectedTable={selectedTable}
              />
            </div>
            {selectedTable && (
              <div className="maitje-card">
                <DataDisplay tableName={selectedTable} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="queries" className="space-y-6">
            <div className="maitje-card">
              <AIQueriesLog />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DatabaseInzichtTab;
