
import React from 'react';
import { Download, Eye } from 'lucide-react';
import { tables, TableName } from './TableSelector';

interface DataDisplayProps {
  selectedTable: TableName;
  tableData: any[];
  filteredData: any[];
  isLoading: boolean;
  searchFilter: string;
  onRefresh: () => void;
  onExport: () => void;
}

const DataDisplay: React.FC<DataDisplayProps> = ({
  selectedTable,
  tableData,
  filteredData,
  isLoading,
  searchFilter,
  onRefresh,
  onExport
}) => {
  return (
    <div className="maitje-card">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-nunito font-bold text-gray-800">
          Tabel: {tables.find(t => t.id === selectedTable)?.name}
          {isLoading && <span className="text-sm text-gray-500 ml-2">(Laden...)</span>}
        </h4>
        <div className="flex gap-2">
          <button 
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
          >
            <Eye className="w-4 h-4" />
            Vernieuwen
          </button>
          <button 
            onClick={onExport}
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
  );
};

export default DataDisplay;
