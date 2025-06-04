
import React from 'react';
import { X, Clock, CheckCircle, BookOpen } from 'lucide-react';

interface DayDetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  dayData: {
    dag: string;
    oefeningen: Array<{
      titel: string;
      type: string;
      tijd: string;
      tijdInMinuten?: number;
      beschrijving?: string;
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

  const totalTime = dayData.oefeningen.reduce((sum, oef) => sum + (oef.tijdInMinuten || 0), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-maitje-blue to-maitje-green">
          <div className="text-white">
            <h3 className="text-xl font-bold">{dayData.dag} - Oefeningen Detail</h3>
            <p className="text-blue-100 text-sm">Totale tijd: {totalTime} minuten</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          <div className="space-y-8">
            {dayData.oefeningen.map((oefening, oefeningIndex) => (
              <div key={oefeningIndex} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg mb-1">{oefening.titel}</h4>
                    {oefening.beschrijving && (
                      <p className="text-gray-600 text-sm">{oefening.beschrijving}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      oefening.type === 'rekenen' ? 'bg-blue-100 text-blue-800' :
                      oefening.type === 'taal' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {oefening.type}
                    </span>
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <Clock className="w-4 h-4" />
                      {oefening.tijd}
                    </div>
                  </div>
                </div>
                
                {oefening.vragen && oefening.vragen.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="w-5 h-5 text-maitje-blue" />
                      <h5 className="font-semibold text-gray-700">Gegenereerde vragen ({oefening.vragen.length})</h5>
                    </div>
                    
                    <div className="grid gap-4">
                      {oefening.vragen.map((vraag, vraagIndex) => (
                        <div key={vraagIndex} className="bg-white p-4 rounded-lg border-l-4 border-maitje-blue shadow-sm">
                          <div className="flex items-start gap-3">
                            <span className="bg-maitje-blue text-white text-sm rounded-full w-7 h-7 flex items-center justify-center font-bold flex-shrink-0">
                              {vraagIndex + 1}
                            </span>
                            <div className="flex-1 space-y-3">
                              <div>
                                <h6 className="font-semibold text-gray-800 mb-2">Vraag:</h6>
                                <p className="text-gray-800 bg-gray-50 p-3 rounded border">{vraag.vraag}</p>
                              </div>
                              
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <h6 className="font-semibold text-green-700">Antwoord:</h6>
                                </div>
                                <p className="text-green-700 font-medium bg-green-50 p-3 rounded border border-green-200">
                                  {vraag.antwoord}
                                </p>
                              </div>
                              
                              {vraag.hints && vraag.hints.length > 0 && (
                                <div>
                                  <h6 className="font-semibold text-gray-700 mb-2">Hints:</h6>
                                  <ul className="space-y-1">
                                    {vraag.hints.map((hint, hintIndex) => (
                                      <li key={hintIndex} className="text-gray-600 bg-yellow-50 p-2 rounded border-l-4 border-yellow-300">
                                        💡 {hint}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {(!oefening.vragen || oefening.vragen.length === 0) && (
                  <div className="text-center py-8 text-gray-500 bg-white rounded border-2 border-dashed border-gray-200">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>Geen specifieke vragen gegenereerd voor deze oefening</p>
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
