
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Helper } from '@/types/helpers';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  selectedHelper: Helper | null;
  onHelperSelect: (helper: Helper) => void;
}

const HelperSelector = ({ selectedHelper, onHelperSelect }: Props) => {
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHelpers();
  }, []);

  const fetchHelpers = async () => {
    try {
      const { data, error } = await supabase
        .from('helpers')
        .select('*')
        .order('id');

      if (error) {
        console.error('Error fetching helpers:', error);
      } else {
        setHelpers(data || []);
        // Set Uli as default if no helper is selected
        if (!selectedHelper && data && data.length > 0) {
          onHelperSelect(data[0]); // Uli de Uil is first
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHelperSelect = (helper: Helper) => {
    onHelperSelect(helper);
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className="w-24 h-24 bg-maitje-blue rounded-full flex items-center justify-center text-4xl animate-bounce-gentle">
        🦉
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex flex-col items-center">
        {/* Main Avatar */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-24 h-24 bg-maitje-blue rounded-full flex items-center justify-center text-4xl animate-bounce-gentle hover:scale-105 transition-transform duration-200 relative"
        >
          {selectedHelper?.avatar_emoji || '🦉'}
          
          {/* Toggle indicator */}
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </div>
        </button>

        {/* Helper name */}
        <p className="text-sm text-gray-600 mt-2 font-nunito">
          {selectedHelper?.name || 'Kies je hulpje'}
        </p>
      </div>

      {/* Helper Selection Grid */}
      {isOpen && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-white rounded-xl shadow-xl border-2 border-maitje-blue p-4 z-50 min-w-max">
          <p className="text-sm font-nunito font-semibold text-gray-700 mb-3 text-center">
            Kies je hulpje:
          </p>
          <div className="grid grid-cols-3 gap-3">
            {helpers.map((helper) => (
              <button
                key={helper.id}
                onClick={() => handleHelperSelect(helper)}
                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                  selectedHelper?.id === helper.id
                    ? 'bg-maitje-blue bg-opacity-20 border-2 border-maitje-blue'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <div className="text-3xl mb-1">{helper.avatar_emoji}</div>
                <div className="text-xs font-nunito text-gray-700 text-center leading-tight">
                  {helper.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default HelperSelector;
