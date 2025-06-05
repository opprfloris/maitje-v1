
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Clock, Zap, Brain, Award } from 'lucide-react';

const AIAnalyticsTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-maitje-blue" />
            AI Performance Analytics
          </CardTitle>
          <CardDescription>
            Monitor de prestaties van je AI modellen en prompt versies voor continue optimalisatie.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">94.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900">2.3s</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">API Calls Today</p>
                <p className="text-2xl font-bold text-gray-900">247</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Prompts</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prompt Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Prompt Version Performance</CardTitle>
          <CardDescription>
            Vergelijk de prestaties van verschillende prompt versies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Badge variant="default">Actief</Badge>
                  <span className="font-medium">v1.2 - Verbeterde Context</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">96.8% success</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Verbeterde prompt met meer context over Nederlandse curriculum
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Tests:</span> 156
                </div>
                <div>
                  <span className="text-gray-500">Avg Time:</span> 2.1s
                </div>
                <div>
                  <span className="text-gray-500">Feedback Score:</span> 4.8/5
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">Test</Badge>
                  <span className="font-medium">v1.3 - Experimental</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-orange-600 font-medium">89.2% success</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Experimentele versie met aangepaste vraagformulering
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Tests:</span> 42
                </div>
                <div>
                  <span className="text-gray-500">Avg Time:</span> 2.7s
                </div>
                <div>
                  <span className="text-gray-500">Feedback Score:</span> 4.1/5
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 opacity-60">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">Archived</Badge>
                  <span className="font-medium">v0.0 - Default Prompt</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 font-medium">78.4% success</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Oorspronkelijke standaard prompt
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Tests:</span> 203
                </div>
                <div>
                  <span className="text-gray-500">Avg Time:</span> 3.1s
                </div>
                <div>
                  <span className="text-gray-500">Feedback Score:</span> 3.6/5
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance per Vak</CardTitle>
          <CardDescription>
            Zie hoe goed de AI presteert bij verschillende schoolvakken
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-700">
                  R
                </div>
                <span className="font-medium">Rekenen</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
                <span className="text-sm font-medium w-12">94%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-700">
                  T
                </div>
                <span className="font-medium">Taal</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '89%' }}></div>
                </div>
                <span className="text-sm font-medium w-12">89%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-medium text-purple-700">
                  E
                </div>
                <span className="font-medium">Engels</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '86%' }}></div>
                </div>
                <span className="text-sm font-medium w-12">86%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recente Activiteit</CardTitle>
          <CardDescription>
            Laatste AI activiteiten en feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nieuwe prompt versie v1.2 geactiveerd</p>
                <p className="text-xs text-gray-600">2 uur geleden</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Feedback analyse voltooid voor sessie #47</p>
                <p className="text-xs text-gray-600">4 uur geleden</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Document "Rekenen Groep 5" toegevoegd aan library</p>
                <p className="text-xs text-gray-600">1 dag geleden</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAnalyticsTab;
