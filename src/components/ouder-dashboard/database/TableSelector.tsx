
import React from 'react';
import { Database, Search } from 'lucide-react';

type TableName = 'profiles' | 'children' | 'user_interests' | 'user_ai_config' | 'weekly_programs' | 'user_privacy_settings' | 'daily_plans' | 'plan_item_progress' | 'exercise_sessions' | 'helpers';

interface TableSelectorProps {
  selectedTable: TableName;
  onTableChange: (table: TableName) => void;
  searchFilter: string;
  onSearchChange: (search: string) => void;
}

const tables = [
  { id: 'profiles' as const, name: 'Ouder Accounts', description: 'Gebruikersprofielen en instellingen' },
  { id: 'children' as const, name: 'Kinderen', description: 'Kind profielen en niveaus' },
  { id: 'user_interests' as const, name: 'Interessegebieden', description: 'Thema\'s en interesses per gebruiker' },
  { id: 'user_ai_config' as const, name: 'AI Configuratie', description: 'AI model en API instellingen' },
  { id: 'weekly_programs' as const, name: 'Weekprogramma\'s', description: 'Gegenereerde lesprogramma\'s' },
  { id: 'user_privacy_settings' as const, name: 'Privacy Instellingen', description: 'Notificatie en privacy voorkeuren' },
  { id: 'daily_plans' as const, name: 'Dagplannen', description: 'Gegenereerde dagelijkse lesprogramma\'s' },
  { id: 'plan_item_progress' as const, name: 'Oefening Voortgang', description: 'Status van individuele oefeningen' },
  { id: 'exercise_sessions' as const, name: 'Oefensessies', description: 'Voltooide oefensessies en scores' },
  { id: 'helpers' as const, name: 'mAItje Hulpjes', description: 'Beschikbare AI assistenten' }
];

const TableSelector: React.FC<TableSelectorProps> = ({
  selectedTable,
  onTableChange,
  searchFilter,
  onSearchChange
}) => {
  const handleTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onTableChange(e.target.value as TableName);
  };

  return (
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
            onChange={handleTableChange}
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
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Zoek in tabel..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-maitje-green focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { tables };
export type { TableName };
export default TableSelector;
