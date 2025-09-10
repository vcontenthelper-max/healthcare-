import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Heart, AlertTriangle, Activity, Shield, Stethoscope } from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { HealthRecordForm } from './HealthRecordForm';

export function HealthRecords() {
  const { records, deleteRecord } = useHealth();
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || record.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'allergy': return AlertTriangle;
      case 'vital': return Activity;
      case 'treatment': return Stethoscope;
      case 'vaccination': return Shield;
      default: return Heart;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'allergy': return 'text-red-600 bg-red-100';
      case 'vital': return 'text-blue-600 bg-blue-100';
      case 'treatment': return 'text-green-600 bg-green-100';
      case 'vaccination': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (recordId: string) => {
    setEditingRecord(recordId);
    setShowForm(true);
  };

  const handleDelete = (recordId: string) => {
    if (window.confirm('Are you sure you want to delete this health record? This action cannot be undone.')) {
      deleteRecord(recordId);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRecord(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Records</h1>
          <p className="text-gray-600 mt-2">Manage your medical history and health information</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2 px-6 py-3 text-white font-semibold rounded-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Record</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search health records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[160px]"
            >
              <option value="all">All Types</option>
              <option value="allergy">Allergies</option>
              <option value="vital">Vitals</option>
              <option value="treatment">Treatments</option>
              <option value="vaccination">Vaccinations</option>
              <option value="test">Tests</option>
            </select>
          </div>
        </div>
      </div>

      {/* Records Grid */}
      {filteredRecords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((record) => {
            const TypeIcon = getTypeIcon(record.type);
            return (
              <div key={record.id} className="health-card bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${getTypeColor(record.type)}`}>
                    <TypeIcon className="w-6 h-6" />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(record.id)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      aria-label="Edit record"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">{record.title}</h3>
                    {record.severity && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(record.severity)}`}>
                        {record.severity}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-3">{record.description}</p>

                  {record.value && record.unit && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900">
                        Value: <span className="text-blue-600">{record.value} {record.unit}</span>
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(record.type)}`}>
                      {record.type}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                  </div>

                  {record.doctor && (
                    <p className="text-sm text-gray-500 flex items-center">
                      <Stethoscope className="w-4 h-4 mr-1" />
                      Dr. {record.doctor}
                    </p>
                  )}

                  {record.notes && (
                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-xs text-gray-500 font-medium mb-1">Notes:</p>
                      <p className="text-sm text-gray-600">{record.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Heart className="w-16 h-16 mx-auto mb-6 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm || filterType !== 'all' ? 'No records found' : 'No health records yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Start building your health history by adding your first record'
            }
          </p>
          {!searchTerm && filterType === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center space-x-2 px-6 py-3 text-white font-semibold rounded-lg mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Record</span>
            </button>
          )}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <HealthRecordForm
          recordId={editingRecord}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}