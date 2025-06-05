
import React, { useEffect, useState } from 'react';
import { AppView } from './MaitjeApp';
import { Helper } from '@/types/helpers';
import { useAuth } from '@/contexts/AuthContext';
import ProgrammaMode from './ProgrammaMode';
import WeekProgramSelector from './weekprogram/WeekProgramSelector';
import WeekProgramMode from './weekprogram/WeekProgramMode';
import DashboardHeader from './dashboard/DashboardHeader';
import WelcomeSection from './dashboard/WelcomeSection';
import ProgramChoiceSection from './dashboard/ProgramChoiceSection';
import DailyPlanSection from './dashboard/DailyPlanSection';
import SubjectButtons from './dashboard/SubjectButtons';
import AccessButtons from './dashboard/AccessButtons';
import PincodeModal from './dashboard/PincodeModal';

interface Props {
  onNavigate: (view: AppView) => void;
  onSignOut: () => void;
}

const KindDashboard = ({ onNavigate, onSignOut }: Props) => {
  const { profile } = useAuth();
  const [selectedHelper, setSelectedHelper] = useState<Helper | null>(null);
  const [showProgramma, setShowProgramma] = useState(false);
  const [showWeekProgramSelector, setShowWeekProgramSelector] = useState(false);
  const [selectedWeekProgram, setSelectedWeekProgram] = useState<string | null>(null);
  const [showAIPincode, setShowAIPincode] = useState(false);
  const [showOuderPincode, setShowOuderPincode] = useState(false);
  const [aiPincode, setAIPincode] = useState('');
  const [ouderPincode, setOuderPincode] = useState('');

  const handleHelperSelect = (helper: Helper) => {
    setSelectedHelper(helper);
    localStorage.setItem('selectedHelper', JSON.stringify(helper));
  };

  const startProgramma = () => {
    setShowProgramma(true);
  };

  const exitProgramma = () => {
    setShowProgramma(false);
  };

  const startWeekProgram = () => {
    setShowWeekProgramSelector(true);
  };

  const handleSelectWeekProgram = (programId: string) => {
    setSelectedWeekProgram(programId);
    setShowWeekProgramSelector(false);
  };

  const exitWeekProgram = () => {
    setSelectedWeekProgram(null);
    setShowWeekProgramSelector(false);
  };

  const handleAIAccess = () => {
    setShowAIPincode(true);
  };

  const handleOuderAccess = () => {
    setShowOuderPincode(true);
  };

  const handleAIPincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiPincode === '1234' || aiPincode === '0000') {
      setShowAIPincode(false);
      setAIPincode('');
      onNavigate('dev-dashboard');
    } else {
      alert('Onjuiste pincode. Probeer 1234.');
      setAIPincode('');
    }
  };

  const handleOuderPincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPincode = localStorage.getItem('ouderPincode') || '1234';
    if (ouderPincode === storedPincode) {
      setShowOuderPincode(false);
      setOuderPincode('');
      onNavigate('ouder');
    } else {
      alert(`Onjuiste pincode. Probeer ${storedPincode}.`);
      setOuderPincode('');
    }
  };

  // Load helper from localStorage on mount
  useEffect(() => {
    const storedHelper = localStorage.getItem('selectedHelper');
    if (storedHelper) {
      try {
        setSelectedHelper(JSON.parse(storedHelper));
      } catch (error) {
        console.error('Error parsing stored helper:', error);
      }
    }
  }, []);

  const childName = profile?.child_name || 'daar';

  // Show different screens based on state
  if (selectedWeekProgram) {
    return (
      <WeekProgramMode
        programId={selectedWeekProgram}
        childId="dummy-child-id"
        childName={childName}
        selectedHelper={selectedHelper}
        onExit={exitWeekProgram}
      />
    );
  }

  if (showWeekProgramSelector) {
    return (
      <WeekProgramSelector
        childId="dummy-child-id"
        onSelectProgram={handleSelectWeekProgram}
        onBack={() => setShowWeekProgramSelector(false)}
      />
    );
  }

  if (showProgramma) {
    return (
      <ProgrammaMode
        childId="dummy-child-id"
        childName={childName}
        selectedHelper={selectedHelper}
        onExit={exitProgramma}
      />
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <DashboardHeader onSignOut={onSignOut} />
      
      <WelcomeSection
        childName={childName}
        selectedHelper={selectedHelper}
        onHelperSelect={handleHelperSelect}
      />

      <ProgramChoiceSection
        onStartWeekProgram={startWeekProgram}
        onStartDailyExercises={startProgramma}
      />

      <DailyPlanSection childId="dummy-child-id" />

      <SubjectButtons onNavigate={onNavigate} />

      <AccessButtons
        onOuderAccess={handleOuderAccess}
        onAIAccess={handleAIAccess}
      />

      <PincodeModal
        isOpen={showAIPincode}
        title="Dev Instellingen Toegang"
        description="Voer de pincode in voor toegang tot ontwikkelaar instellingen."
        pincode={aiPincode}
        onPincodeChange={setAIPincode}
        onSubmit={handleAIPincodeSubmit}
        onClose={() => {
          setShowAIPincode(false);
          setAIPincode('');
        }}
        tipText="Tip: Probeer 1234 voor demo toegang"
      />

      <PincodeModal
        isOpen={showOuderPincode}
        title="Ouder Dashboard Toegang"
        description="Voer de pincode in voor toegang tot het ouder dashboard."
        pincode={ouderPincode}
        onPincodeChange={setOuderPincode}
        onSubmit={handleOuderPincodeSubmit}
        onClose={() => {
          setShowOuderPincode(false);
          setOuderPincode('');
        }}
        tipText="Tip: De standaard pincode is 1234"
      />
    </div>
  );
};

export default KindDashboard;
