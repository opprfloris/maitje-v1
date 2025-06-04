
import React, { useState } from 'react';
import { User, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KindInstellingenTab from './ouder-dashboard/KindInstellingenTab';
import LesprogrammaTab from './ouder-dashboard/LesprogrammaTab';
import StatistiekenTab from './ouder-dashboard/StatistiekenTab';
import ToolInstellingenTab from './ouder-dashboard/ToolInstellingenTab';
import DatabaseInzichtTab from './ouder-dashboard/DatabaseInzichtTab';

interface Props {
  onBack: () => void;
}

const OuderProfiel = ({ onBack }: Props) => {
  const { profile } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState(false);

  console.log('Ouder profiel loaded, authenticated:', isAuthenticated);

  const handlePinSubmit = () => {
    if (pinCode === '1234') { // Voor MVP een simpele pincode
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinCode('');
    }
  };

  // Pincode invoer scherm
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen p-6 max-w-md mx-auto flex items-center justify-center">
        <div className="maitje-card w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-maitje-blue rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-nunito font-bold text-gray-800">Ouder/Verzorger Toegang</h1>
            <p className="text-gray-600 mt-2">Voer uw 4-cijferige pincode in</p>
          </div>

          <div className="space-y-4">
            <input
              type="password"
              maxLength={4}
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className={`w-full text-center text-2xl font-bold border-2 rounded-xl p-4 tracking-widest ${
                pinError ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-maitje-blue'
              } focus:outline-none`}
              autoFocus
            />

            {pinError && (
              <p className="text-red-600 text-center">Onjuiste pincode. Probeer opnieuw.</p>
            )}

            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map((num, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (num === '⌫') {
                      setPinCode(prev => prev.slice(0, -1));
                    } else if (num !== '' && pinCode.length < 4) {
                      setPinCode(prev => prev + num);
                    }
                  }}
                  className={`h-12 rounded-lg font-bold text-lg ${
                    num === '' 
                      ? 'invisible' 
                      : 'bg-gray-100 hover:bg-gray-200 transition-colors'
                  }`}
                  disabled={num === ''}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              onClick={handlePinSubmit}
              disabled={pinCode.length !== 4}
              className="w-full maitje-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Inloggen
            </button>

            <button onClick={onBack} className="w-full maitje-button-secondary">
              Annuleren
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            Voor demo: gebruik pincode 1234
          </div>
        </div>
      </div>
    );
  }

  // Ouder dashboard met tabs
  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-3xl font-nunito font-bold text-gray-800">Ouder Dashboard</h1>
        </div>
        <button onClick={onBack} className="maitje-button-secondary px-4 py-2">
          Terug naar Kind App
        </button>
      </div>

      <Tabs defaultValue="kind" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="kind" className="text-sm">Kind & Instellingen</TabsTrigger>
          <TabsTrigger value="lesprogramma" className="text-sm">Lesprogramma</TabsTrigger>
          <TabsTrigger value="statistieken" className="text-sm">Statistieken & Analyse</TabsTrigger>
          <TabsTrigger value="tools" className="text-sm">Tool & AI Instellingen</TabsTrigger>
          <TabsTrigger value="database" className="text-sm">Database Inzicht</TabsTrigger>
        </TabsList>

        <TabsContent value="kind">
          <KindInstellingenTab />
        </TabsContent>

        <TabsContent value="lesprogramma">
          <LesprogrammaTab />
        </TabsContent>

        <TabsContent value="statistieken">
          <StatistiekenTab />
        </TabsContent>

        <TabsContent value="tools">
          <ToolInstellingenTab />
        </TabsContent>

        <TabsContent value="database">
          <DatabaseInzichtTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OuderProfiel;
