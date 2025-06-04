
import React, { useState } from 'react';
import KindDashboard from './KindDashboard';
import RekenenModule from './RekenenModule';
import LezenModule from './LezenModule';
import EngelsModule from './EngelsModule';
import OuderProfiel from './OuderProfiel';

export type AppView = 'dashboard' | 'rekenen' | 'lezen' | 'engels' | 'ouder';

const MaitjeApp = () => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [childName] = useState('Emma'); // Voor nu hardcoded

  console.log('Current view:', currentView);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <KindDashboard childName={childName} onNavigate={setCurrentView} />;
      case 'rekenen':
        return <RekenenModule onBack={() => setCurrentView('dashboard')} />;
      case 'lezen':
        return <LezenModule onBack={() => setCurrentView('dashboard')} />;
      case 'engels':
        return <EngelsModule onBack={() => setCurrentView('dashboard')} />;
      case 'ouder':
        return <OuderProfiel onBack={() => setCurrentView('dashboard')} />;
      default:
        return <KindDashboard childName={childName} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-maitje-cream">
      {renderView()}
    </div>
  );
};

export default MaitjeApp;
