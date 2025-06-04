
import React from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import AuthPage from './AuthPage';
import KindDashboard from './KindDashboard';
import RekenenModule from './RekenenModule';
import LezenModule from './LezenModule';
import EngelsModule from './EngelsModule';
import OuderProfiel from './OuderProfiel';

export type AppView = 'dashboard' | 'rekenen' | 'lezen' | 'engels' | 'ouder';

const AppContent = () => {
  const { user, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = React.useState<AppView>('dashboard');

  console.log('Current view:', currentView, 'User:', user?.email);

  if (loading) {
    return (
      <div className="min-h-screen bg-maitje-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-maitje-blue rounded-full flex items-center justify-center text-2xl mx-auto mb-4 animate-bounce">
            🦉
          </div>
          <p className="text-gray-600 font-nunito">Laden...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const handleSignOut = async () => {
    await signOut();
    setCurrentView('dashboard');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <KindDashboard
            onNavigate={setCurrentView}
            onSignOut={handleSignOut}
          />
        );
      case 'rekenen':
        return (
          <RekenenModule
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'lezen':
        return (
          <LezenModule
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'engels':
        return (
          <EngelsModule
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'ouder':
        return (
          <OuderProfiel
            onBack={() => setCurrentView('dashboard')}
          />
        );
      default:
        return (
          <KindDashboard
            onNavigate={setCurrentView}
            onSignOut={handleSignOut}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-maitje-cream">
      {renderView()}
    </div>
  );
};

const MaitjeApp = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default MaitjeApp;
