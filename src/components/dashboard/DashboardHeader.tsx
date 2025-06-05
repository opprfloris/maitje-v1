
import React from 'react';
import { User } from 'lucide-react';

interface DashboardHeaderProps {
  onSignOut: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onSignOut }) => {
  return (
    <div className="flex justify-end items-center mb-6">
      <button
        onClick={onSignOut}
        className="flex items-center gap-2 p-3 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <User className="w-5 h-5" />
        <span className="text-sm">Uitloggen</span>
      </button>
    </div>
  );
};

export default DashboardHeader;
