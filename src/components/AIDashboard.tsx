
import React, { useState } from 'react';
import { ArrowLeft, Brain, FileText, Settings, Database, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import AIPromptInstellingenTab from './ai-dashboard/AIPromptInstellingenTab';
import AIModelConfigTab from './ai-dashboard/AIModelConfigTab';
import DocumentLibraryTab from './ai-dashboard/DocumentLibraryTab';
import AIAnalyticsTab from './ai-dashboard/AIAnalyticsTab';

interface AIDashboardProps {
  onBack: () => void;
}

const AIDashboard = ({ onBack }: AIDashboardProps) => {
  const [activeTab, setActiveTab] = useState('prompt-settings');

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
                <h1 className="text-2xl font-nunito font-bold text-gray-800 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-maitje-blue" />
                  AI Instellingen
                </h1>
                <p className="text-gray-600">Ontwikkelaar tools voor AI optimalisatie en prompt management</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="prompt-settings" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Prompt Instellingen
            </TabsTrigger>
            <TabsTrigger value="model-config" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              AI Model Config
            </TabsTrigger>
            <TabsTrigger value="document-library" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Document Library
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              AI Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prompt-settings">
            <AIPromptInstellingenTab />
          </TabsContent>

          <TabsContent value="model-config">
            <AIModelConfigTab />
          </TabsContent>

          <TabsContent value="document-library">
            <DocumentLibraryTab />
          </TabsContent>

          <TabsContent value="analytics">
            <AIAnalyticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIDashboard;
