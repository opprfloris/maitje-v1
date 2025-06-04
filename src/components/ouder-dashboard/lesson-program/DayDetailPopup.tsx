
import React from 'react';
import { X, Clock, CheckCircle } from 'lucide-react';

interface DayDetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  dayData: {
    dag: string;
    oefeningen: Array<{
      titel: string;
      type: string;
      tijd: string;
      vragen?: Array<{
        vraag: string;
        antwoord: string;
        hints?: string[];
      }>;
    }>;
  } | null;
}

const DayDetailPopup: React.FC<DayDetailPopupProps> = ({ isOpen, onClose, dayData }) => {
  if (!isOpen || !dayData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-bold text-gray-800">{dayData.dag} - Oefeningen Detail</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-4">
          <div className="space-y-6">
            {dayData.oefeningen.map((oefening, oefeningIndex) => (
              <div key={oefeningIndex} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-800">{oefening.titel}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      oefening.type === 'rekenen' ? 'bg-blue-100 text-blue-800' :
                      oefening.type === 'taal' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {oefening.type}
                    </span>
                    <div className="flex items-center gap-1 text-gray-600 text-xs">
                      <Clock className="w-3 h-3" />
                      {oefening.tijd}
                    </div>
                  </div>
                </div>
                
                {oefening.vragen && (
                  <div className="space-y-3">
                    <h5 className="font-semibold text-gray-700 text-sm">Gegenereerde vragen:</h5>
                    {oefening.vragen.map((vraag, vraagIndex) => (
                      <div key={vraagIndex} className="bg-white p-3 rounded-lg border-l-4 border-maitje-blue">
                        <div className="flex items-start gap-2">
                          <span className="bg-maitje-blue text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {vraagIndex + 1}
                          </span>
                          <div className="flex-1">
                            <p className="text-gray-800 font-medium">{vraag.vraag}</p>
                            <div className="mt-2 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-green-700 font-semibold text-sm">Antwoord: {vraag.antwoord}</span>
                            </div>
                            {vraag.hints && vraag.hints.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-600 font-semibold">Hints:</p>
                                <ul className="text-xs text-gray-600 ml-2">
                                  {vraag.hints.map((hint, hintIndex) => (
                                    <li key={hintIndex}>• {hint}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayDetailPopup;
