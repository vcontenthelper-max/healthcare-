import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import { HealthRecords } from './components/HealthRecords';
import { Medications } from './components/Medications';
import { Appointments } from './components/Appointments';
import { Profile } from './components/Profile';
import { DataExport } from './components/DataExport';
import { useAuth } from './hooks/useAuth';
import { HealthProvider } from './context/HealthContext';
import './App.css';

type View = 'dashboard' | 'records' | 'medications' | 'appointments' | 'profile' | 'export';

function App() {
  const { user, login, logout, register } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isLoginMode, setIsLoginMode] = useState(true);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Personal Health Record Tracker
            </h1>
            <p className="text-lg text-gray-600">
              Securely manage your health information and medical records
            </p>
          </div>
          <AuthForm
            isLoginMode={isLoginMode}
            onToggleMode={() => setIsLoginMode(!isLoginMode)}
            onLogin={login}
            onRegister={register}
          />
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'records':
        return <HealthRecords />;
      case 'medications':
        return <Medications />;
      case 'appointments':
        return <Appointments />;
      case 'profile':
        return <Profile />;
      case 'export':
        return <DataExport />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <HealthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation
          user={user}
          currentView={currentView}
          onNavigate={setCurrentView}
          onLogout={logout}
        />
        <main className="container mx-auto px-4 py-6">
          {renderView()}
        </main>
      </div>
    </HealthProvider>
  );
}

export default App;