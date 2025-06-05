
import React, { useState } from 'react';
import { ArrowLeft, Bot, Settings, FileText, Database, MessageSquare, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import AIModelConfigTab from './ai-dashboard/AIModelConfigTab';
import AIPromptInstellingenTab from './ai-dashboard/AIPromptInstellingenTab';
import DocumentLibraryTab from './ai-dashboard/DocumentLibraryTab';
import AIAnalyticsTab from './ai-dashboard/AIAnalyticsTab';
import ContentManagementTab from './dev-dashboard/ContentManagementTab';

interface DevDashboardProps {
  onBack: () => void;
}

const DevDashboard = ({ onBack }: DevDashboardProps) => {
  const [activeTab, setActiveTab] = useState('ai-config');

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
                <h1 className="text-2xl font-nunito font-bold text-gray-800">Dev Dashboard</h1>
                <p className="text-gray-600">AI & Content Management</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="ai-config" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              AI Config
            </TabsTrigger>
            <TabsTrigger value="prompts" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Prompts
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="content-management" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Content Management
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai-config">
            <AIModelConfigTab />
          </TabsContent>

          <TabsContent value="prompts">
            <AIPromptInstellingenTab />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentLibraryTab />
          </TabsContent>

          <TabsContent value="content-management">
            <ContentManagementTab />
          </TabsContent>

          <TabsContent value="analytics">
            <AIAnalyticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DevDashboard;
