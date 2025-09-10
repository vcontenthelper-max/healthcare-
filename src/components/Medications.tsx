import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Pill, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { MedicationForm } from './MedicationForm';

export function Medications() {
  const { medications, deleteMedication } = useHealth();
  const [showForm, setShowForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredMedications = medications.filter(medication => {
    const matchesSearch = medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medication.prescribedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && medication.isActive) ||
                         (filterStatus === 'inactive' && !medication.isActive);
    return matchesSearch && matchesFilter;
  });

  const activeMedications = medications.filter(med => med.isActive);
  const inactiveMedications = medications.filter(med => !med.isActive);

  const handleEdit = (medicationId: string) => {
    setEditingMedication(medicationId);
    setShowForm(true);
  };

  const handleDelete = (medicationId: string) => {
    if (window.confirm('Are you sure you want to delete this medication? This action cannot be undone.')) {
      deleteMedication(medicationId);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMedication(null);
  };

  const isExpired = (endDate?: string) => {
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  };

  const getStatusColor = (medication: any) => {
    if (!medication.isActive) return 'bg-gray-100 text-gray-800';
    if (medication.endDate && isExpired(medication.endDate)) return 'bg-red-100 text-red-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (medication: any) => {
    if (!medication.isActive) return 'Inactive';
    if (medication.endDate && isExpired(medication.endDate)) return 'Expired';
    return 'Active';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medications</h1>
          <p className="text-gray-600 mt-2">Track your prescriptions and medication schedule</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2 px-6 py-3 text-white font-semibold rounded-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Medication</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-600">Active</p>
              <p className="text-2xl font-bold text-green-900">{activeMedications.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="flex items-center">
            <Pill className="w-8 h-8 text-gray-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{medications.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-600">With Reminders</p>
              <p className="text-2xl font-bold text-blue-900">
                {medications.filter(med => med.reminders).length}
              </p>
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
              placeholder="Search medications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[140px]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Medications Grid */}
      {filteredMedications.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMedications.map((medication) => (
            <div key={medication.id} className="health-card bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <Pill className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{medication.name}</h3>
                    <p className="text-sm text-gray-600">{medication.dosage}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(medication)}`}>
                    {getStatusText(medication)}
                  </span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(medication.id)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      aria-label="Edit medication"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(medication.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Delete medication"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Frequency</p>
                    <p className="text-sm text-gray-900">{medication.frequency}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Prescribed by</p>
                    <p className="text-sm text-gray-900">Dr. {medication.prescribedBy}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Start Date</p>
                    <p className="text-sm text-gray-900">
                      {new Date(medication.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  {medication.endDate && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">End Date</p>
                      <p className={`text-sm ${isExpired(medication.endDate) ? 'text-red-600' : 'text-gray-900'}`}>
                        {new Date(medication.endDate).toLocaleDateString()}
                        {isExpired(medication.endDate) && (
                          <span className="ml-1 text-xs">(Expired)</span>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {medication.instructions && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Instructions</p>
                    <p className="text-sm text-gray-900">{medication.instructions}</p>
                  </div>
                )}

                {medication.reminders && medication.reminderTimes.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 mr-2" />
                      <p className="text-sm font-medium text-blue-800">Reminders Active</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {medication.reminderTimes.map((time, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Pill className="w-16 h-16 mx-auto mb-6 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm || filterStatus !== 'all' ? 'No medications found' : 'No medications yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Start tracking your medications and prescriptions'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center space-x-2 px-6 py-3 text-white font-semibold rounded-lg mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Medication</span>
            </button>
          )}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <MedicationForm
          medicationId={editingMedication}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}