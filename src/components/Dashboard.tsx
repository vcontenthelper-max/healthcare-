import React from 'react';
import { 
  Heart, 
  Calendar, 
  Pill, 
  AlertCircle, 
  TrendingUp, 
  Clock, 
  Shield,
  Activity
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';

interface DashboardProps {
  onNavigate: (view: 'dashboard' | 'records' | 'medications' | 'appointments' | 'profile' | 'export') => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { records, medications, appointments } = useHealth();

  const upcomingAppointments = appointments
    .filter(apt => !apt.completed && new Date(apt.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const activeMedications = medications.filter(med => med.isActive);
  const recentRecords = records
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const stats = [
    {
      title: 'Health Records',
      value: records.length.toString(),
      icon: Heart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      onClick: () => onNavigate('records'),
    },
    {
      title: 'Active Medications',
      value: activeMedications.length.toString(),
      icon: Pill,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      onClick: () => onNavigate('medications'),
    },
    {
      title: 'Upcoming Appointments',
      value: upcomingAppointments.length.toString(),
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      onClick: () => onNavigate('appointments'),
    },
    {
      title: 'Health Score',
      value: '92%',
      icon: Activity,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      onClick: () => onNavigate('records'),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Health Dashboard</h1>
        <p className="text-lg text-gray-600">
          Stay on top of your health with personalized insights and reminders
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ title, value, icon: Icon, color, bgColor, onClick }) => (
          <button
            key={title}
            onClick={onClick}
            className="health-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
              </div>
              <div className={`${bgColor} p-3 rounded-lg`}>
                <Icon className={`w-8 h-8 ${color}`} />
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Calendar className="w-6 h-6 text-purple-600 mr-2" />
              Upcoming Appointments
            </h2>
            <button
              onClick={() => onNavigate('appointments')}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              View All
            </button>
          </div>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{appointment.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">Dr. {appointment.doctor}</p>
                      <p className="text-sm text-gray-500 flex items-center mt-2">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                      ${appointment.type === 'checkup' ? 'bg-blue-100 text-blue-800' :
                        appointment.type === 'specialist' ? 'bg-purple-100 text-purple-800' :
                        appointment.type === 'emergency' ? 'bg-red-100 text-red-800' :
                        'bg-green-100 text-green-800'}`}>
                      {appointment.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No upcoming appointments scheduled</p>
              <button
                onClick={() => onNavigate('appointments')}
                className="btn-primary mt-4 px-6 py-2 text-white font-medium rounded-lg"
              >
                Schedule Appointment
              </button>
            </div>
          )}
        </div>

        {/* Active Medications */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Pill className="w-6 h-6 text-green-600 mr-2" />
              Active Medications
            </h2>
            <button
              onClick={() => onNavigate('medications')}
              className="text-green-600 hover:text-green-700 font-medium text-sm"
            >
              Manage All
            </button>
          </div>
          {activeMedications.length > 0 ? (
            <div className="space-y-4">
              {activeMedications.slice(0, 3).map((medication) => (
                <div key={medication.id} className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{medication.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{medication.dosage}</p>
                      <p className="text-sm text-gray-500 mt-1">{medication.frequency}</p>
                    </div>
                    {medication.reminders && (
                      <div className="flex items-center text-green-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        <span className="text-xs font-medium">Reminders On</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Pill className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No active medications recorded</p>
              <button
                onClick={() => onNavigate('medications')}
                className="btn-primary mt-4 px-6 py-2 text-white font-medium rounded-lg"
              >
                Add Medication
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Health Records */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Heart className="w-6 h-6 text-blue-600 mr-2" />
            Recent Health Records
          </h2>
          <button
            onClick={() => onNavigate('records')}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View All Records
          </button>
        </div>
        {recentRecords.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentRecords.map((record) => (
              <div key={record.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                    ${record.type === 'allergy' ? 'bg-red-100 text-red-800' :
                      record.type === 'vital' ? 'bg-blue-100 text-blue-800' :
                      record.type === 'treatment' ? 'bg-green-100 text-green-800' :
                      record.type === 'vaccination' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'}`}>
                    {record.type}
                  </span>
                  {record.severity && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${record.severity === 'high' ? 'bg-red-100 text-red-800' :
                        record.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'}`}>
                      {record.severity}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{record.title}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{record.description}</p>
                <p className="text-xs text-gray-500">
                  {new Date(record.date).toLocaleDateString()}
                  {record.doctor && ` • Dr. ${record.doctor}`}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Heart className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No health records yet</p>
            <button
              onClick={() => onNavigate('records')}
              className="btn-primary mt-4 px-6 py-2 text-white font-medium rounded-lg"
            >
              Add Health Record
            </button>
          </div>
        )}
      </div>

      {/* Health Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start">
          <div className="bg-blue-100 p-3 rounded-lg mr-4 flex-shrink-0">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Health Tip of the Day</h3>
            <p className="text-gray-700 mb-4">
              Regular health check-ups can help detect potential health issues early. 
              Make sure to schedule your annual physical exam and keep your vaccinations up to date.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Preventive Care
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Wellness
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}