import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginView } from './views/LoginView';
import { StudentDashboard } from './views/student/StudentDashboard';
import { TestRunner } from './views/student/TestRunner';
import { ReviewView } from './views/student/ReviewView';
import { AdminDashboard } from './views/admin/AdminDashboard';
import { AppUpdateModal } from './components/AppUpdateModal';

type Screen = 'dashboard' | 'test' | 'review';

const MainApp: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [activeAttemptId, setActiveAttemptId] = useState<string | null>(null);

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const handleStartTest = (attemptId: string) => {
    setActiveAttemptId(attemptId);
    setScreen('test');
  };

  const handleReviewAttempt = (attemptId: string) => {
    setActiveAttemptId(attemptId);
    setScreen('review');
  };

  const handleExitToDashboard = () => {
    setActiveAttemptId(null);
    setScreen('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar onGoHome={handleExitToDashboard} />
      <AppUpdateModal />

      <main className="flex-1">
        {screen === 'test' && activeAttemptId && (
          <TestRunner
            attemptId={activeAttemptId}
            onSubmitted={(attemptId) => {
              setActiveAttemptId(attemptId);
              setScreen('review');
            }}
            onExit={handleExitToDashboard}
          />
        )}

        {screen === 'review' && activeAttemptId && (
          <ReviewView
            attemptId={activeAttemptId}
            onBack={handleExitToDashboard}
          />
        )}

        {screen === 'dashboard' && (
          isAdmin ? (
            <AdminDashboard onReviewAttempt={handleReviewAttempt} />
          ) : (
            <StudentDashboard
              onStartTest={handleStartTest}
              onReviewAttempt={handleReviewAttempt}
            />
          )
        )}
      </main>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
