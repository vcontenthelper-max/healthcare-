import React, { useState } from 'react';
import { Plus, Search, Calendar, Edit, Trash2, Clock, MapPin, User, CheckCircle } from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { AppointmentForm } from './AppointmentForm';

export function Appointments() {
  const { appointments, deleteAppointment, updateAppointment } = useHealth();
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewFilter, setViewFilter] = useState<string>('upcoming');

  const now = new Date();
  const today = new Date().toISOString().split('T')[0];

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const matchesSearch = appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (viewFilter === 'upcoming') {
      matchesFilter = !appointment.completed && appointmentDate >= now;
    } else if (viewFilter === 'past') {
      matchesFilter = appointment.completed || appointmentDate < now;
    } else if (viewFilter === 'today') {
      matchesFilter = appointment.date === today;
    }
    
    return matchesSearch && matchesFilter;
  });

  const upcomingCount = appointments.filter(apt => !apt.completed && new Date(apt.date) >= now).length;
  const todayCount = appointments.filter(apt => apt.date === today).length;
  const completedCount = appointments.filter(apt => apt.completed).length;

  const handleEdit = (appointmentId: string) => {
    setEditingAppointment(appointmentId);
    setShowForm(true);
  };

  const handleDelete = (appointmentId: string) => {
    if (window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
      deleteAppointment(appointmentId);
    }
  };

  const handleToggleComplete = (appointmentId: string, completed: boolean) => {
    updateAppointment(appointmentId, { completed: !completed });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAppointment(null);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'checkup': return 'bg-blue-100 text-blue-800';
      case 'specialist': return 'bg-purple-100 text-purple-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'follow-up': return 'bg-green-100 text-green-800';
      case 'vaccination': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (appointment: any) => {
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
    return !appointment.completed && appointmentDateTime < now;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-2">Manage your healthcare appointments and schedule</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2 px-6 py-3 text-white font-semibold rounded-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Schedule Appointment</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-600">Upcoming</p>
              <p className="text-2xl font-bold text-blue-900">{upcomingCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-orange-600">Today</p>
              <p className="text-2xl font-bold text-orange-900">{todayCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-900">{completedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex space-x-2">
            {[
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'today', label: 'Today' },
              { key: 'past', label: 'Past' },
              { key: 'all', label: 'All' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setViewFilter(key)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  viewFilter === key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length > 0 ? (
        <div className="space-y-4">
          {filteredAppointments
            .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
            .map((appointment) => (
            <div
              key={appointment.id}
              className={`health-card bg-white rounded-xl shadow-md p-6 ${
                isOverdue(appointment) ? 'border-l-4 border-red-500' : ''
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{appointment.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(appointment.type)}`}>
                          {appointment.type}
                        </span>
                        {appointment.completed && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Completed
                          </span>
                        )}
                        {isOverdue(appointment) && (
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            Overdue
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <User className="w-4 h-4 mr-2 text-blue-500" />
                      <span>Dr. {appointment.doctor}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-green-500" />
                      <span>{new Date(appointment.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-purple-500" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600 sm:col-span-2 lg:col-span-3">
                      <MapPin className="w-4 h-4 mr-2 text-red-500" />
                      <span>{appointment.location}</span>
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{appointment.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
                  <button
                    onClick={() => handleToggleComplete(appointment.id, appointment.completed)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      appointment.completed
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{appointment.completed ? 'Completed' : 'Mark Complete'}</span>
                  </button>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(appointment.id)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      aria-label="Edit appointment"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(appointment.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Delete appointment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-6 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm || viewFilter !== 'upcoming' ? 'No appointments found' : 'No upcoming appointments'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || viewFilter !== 'upcoming' 
              ? 'Try adjusting your search or filter criteria'
              : 'Schedule your first appointment to get started'
            }
          </p>
          {!searchTerm && viewFilter === 'upcoming' && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center space-x-2 px-6 py-3 text-white font-semibold rounded-lg mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Schedule Your First Appointment</span>
            </button>
          )}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <AppointmentForm
          appointmentId={editingAppointment}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}