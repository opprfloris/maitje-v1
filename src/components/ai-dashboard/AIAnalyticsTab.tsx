
import React from 'react';
import { TrendingUp, Activity, Users, Clock, BarChart3, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AIAnalyticsTab = () => {
  // Mock analytics data
  const stats = {
    totalRequests: 1247,
    avgResponseTime: 2.3,
    successRate: 98.5,
    activeUsers: 156
  };

  const weeklyData = [
    { day: 'Ma', requests: 45, success: 44 },
    { day: 'Di', requests: 52, success: 51 },
    { day: 'Wo', requests: 38, success: 37 },
    { day: 'Do', requests: 61, success: 60 },
    { day: 'Vr', requests: 48, success: 48 },
    { day: 'Za', requests: 23, success: 23 },
    { day: 'Zo', requests: 31, success: 30 }
  ];

  const topPrompts = [
    { name: 'Weekprogramma Generatie', usage: 342, success: 99.1 },
    { name: 'Rekenen Opdrachten', usage: 156, success: 97.4 },
    { name: 'Lezen Comprehensie', usage: 89, success: 98.9 },
    { name: 'Engels Vocabulaire', usage: 67, success: 96.3 }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="maitje-card text-center">
          <div className="w-12 h-12 bg-maitje-blue rounded-xl flex items-center justify-center mx-auto mb-3">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.totalRequests}</h3>
          <p className="text-gray-600">Totale Requests</p>
          <Badge className="mt-2 bg-green-100 text-green-800">+12% deze week</Badge>
        </div>

        <div className="maitje-card text-center">
          <div className="w-12 h-12 bg-maitje-green rounded-xl flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.avgResponseTime}s</h3>
          <p className="text-gray-600">Gem. Responstijd</p>
          <Badge className="mt-2 bg-blue-100 text-blue-800">-0.2s verbeterd</Badge>
        </div>

        <div className="maitje-card text-center">
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.successRate}%</h3>
          <p className="text-gray-600">Succes Rate</p>
          <Badge className="mt-2 bg-green-100 text-green-800">Uitstekend</Badge>
        </div>

        <div className="maitje-card text-center">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.activeUsers}</h3>
          <p className="text-gray-600">Actieve Gebruikers</p>
          <Badge className="mt-2 bg-green-100 text-green-800">+8% groei</Badge>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-maitje-blue rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-nunito font-bold text-gray-800">Weekoverzicht</h3>
            <p className="text-gray-600">AI requests en success rate per dag</p>
          </div>
        </div>

        <div className="space-y-4">
          {weeklyData.map((day, index) => (
            <div key={day.day} className="flex items-center gap-4">
              <div className="w-8 text-sm font-semibold text-gray-600">{day.day}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                <div 
                  className="bg-maitje-blue h-full rounded-full transition-all duration-300"
                  style={{ width: `${(day.requests / 70) * 100}%` }}
                />
                <div 
                  className="absolute top-0 bg-maitje-green h-full rounded-full transition-all duration-300"
                  style={{ width: `${(day.success / 70) * 100}%` }}
                />
              </div>
              <div className="text-sm text-gray-600 min-w-[100px]">
                {day.requests} requests ({day.success} succes)
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-maitje-blue rounded-full"></div>
            <span className="text-gray-600">Totale Requests</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-maitje-green rounded-full"></div>
            <span className="text-gray-600">Succesvolle Requests</span>
          </div>
        </div>
      </div>

      {/* Top Performing Prompts */}
      <div className="maitje-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-maitje-green rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-nunito font-bold text-gray-800">Top Prompt Performance</h3>
            <p className="text-gray-600">Meest gebruikte prompts en hun prestaties</p>
          </div>
        </div>

        <div className="space-y-4">
          {topPrompts.map((prompt, index) => (
            <div key={prompt.name} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{prompt.name}</h4>
                <Badge className="bg-blue-100 text-blue-800">
                  #{index + 1}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {prompt.usage} keer gebruikt
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Succes:</span>
                  <Badge className={
                    prompt.success > 98 ? 'bg-green-100 text-green-800' :
                    prompt.success > 95 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {prompt.success}%
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="maitje-card">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          💡 Performance Inzichten
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">✅ Sterke Punten</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Zeer hoge success rate (98.5%)</li>
              <li>• Snelle responstijden</li>
              <li>• Groeiend gebruikersbestand</li>
              <li>• Stabiele prestaties</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">🎯 Verbeterpunten</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Optimaliseer responstijd verder</li>
              <li>• Verhoog Engels prompt prestaties</li>
              <li>• Meer analytics voor gebruikers</li>
              <li>• A/B test nieuwe prompt versies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalyticsTab;
