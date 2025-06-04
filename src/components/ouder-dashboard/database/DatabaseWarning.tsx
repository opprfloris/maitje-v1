
import React from 'react';

const DatabaseWarning: React.FC = () => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-yellow-600">⚠️</span>
        <p className="text-yellow-800 font-semibold">Developer Tool</p>
      </div>
      <p className="text-yellow-700 text-sm mt-1">
        Dit tabblad is bedoeld voor ontwikkelaars en systeembeheerders. U ziet alleen uw eigen data voor privacy.
      </p>
    </div>
  );
};

export default DatabaseWarning;
