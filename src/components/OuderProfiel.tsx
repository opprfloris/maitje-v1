
import React, { useState } from 'react';
import { ArrowLeft, User, BarChart3, Settings, BookOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import StatistiekenTab from './ouder-dashboard/StatistiekenTab';
import KindInstellingenTab from './ouder-dashboard/KindInstellingenTab';
import ToolInstellingenTab from './ouder-dashboard/ToolInstellingenTab';
import LesprogrammaTab from './ouder-dashboard/LesprogrammaTab';

interface OuderProfielProps {
  onBack: () => void;
}

const OuderProfiel = ({ onBack }: OuderProfielProps) => {
  const [activeTab, setActiveTab] = useState('kind-instellingen');

  return (
    <div className="min-h-screen bg-maitje-cream">
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Terug naar Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-nunito font-bold text-gray-800">Ouder Dashboard</h1>
                <p className="text-gray-600">Beheer instellingen en bekijk voortgang</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="kind-instellingen" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Kind Instellingen
            </TabsTrigger>
            <TabsTrigger value="lesprogramma" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Lesprogramma
            </TabsTrigger>
            <TabsTrigger value="statistieken" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Statistieken
            </TabsTrigger>
            <TabsTrigger value="tool-instellingen" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Tool Instellingen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kind-instellingen">
            <KindInstellingenTab />
          </TabsContent>

          <TabsContent value="lesprogramma">
            <LesprogrammaTab />
          </TabsContent>

          <TabsContent value="statistieken">
            <StatistiekenTab />
          </TabsContent>

          <TabsContent value="tool-instellingen">
            <ToolInstellingenTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OuderProfiel;
