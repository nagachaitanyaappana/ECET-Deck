import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginView } from './views/LoginView';
import { StudentDashboard } from './views/student/StudentDashboard';
import { TestRunner } from './views/student/TestRunner';
import { ReviewView } from './views/student/ReviewView';
import { AdminDashboard } from './views/admin/AdminDashboard';

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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Ambient background glow effects matching Login page */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-blue-600/25 via-indigo-600/15 to-transparent blur-3xl pointer-events-none -z-0" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[400px] bg-gradient-to-t from-violet-600/20 to-transparent blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar onGoHome={handleExitToDashboard} />

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
