import React from 'react';
import { User, Heart, Pill, Calendar, Settings, Download, LogOut } from 'lucide-react';
import type { User as UserType } from '../hooks/useAuth';

interface NavigationProps {
  user: UserType;
  currentView: string;
  onNavigate: (view: 'dashboard' | 'records' | 'medications' | 'appointments' | 'profile' | 'export') => void;
  onLogout: () => void;
}

export function Navigation({ user, currentView, onNavigate, onLogout }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Heart },
    { id: 'records', label: 'Health Records', icon: User },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'export', label: 'Export Data', icon: Download },
    { id: 'profile', label: 'Profile', icon: Settings },
  ];

  return (
    <nav className="bg-white shadow-lg border-b-2 border-blue-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Heart className="text-blue-600 w-8 h-8" />
            <h1 className="text-xl font-bold text-gray-900">HealthTracker</h1>
          </div>
          
          <div className="hidden md:flex space-x-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onNavigate(id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentView === id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onNavigate(id as any)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg min-w-max transition-all duration-200 ${
                  currentView === id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}