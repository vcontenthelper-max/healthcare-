import React, { useState, useEffect } from 'react';
import { X, Save, AlertTriangle } from 'lucide-react';
import { useHealth, type HealthRecord } from '../context/HealthContext';

interface HealthRecordFormProps {
  recordId?: string | null;
  onClose: () => void;
}

export function HealthRecordForm({ recordId, onClose }: HealthRecordFormProps) {
  const { records, addRecord, updateRecord } = useHealth();
  const [formData, setFormData] = useState({
    type: 'treatment' as HealthRecord['type'],
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    doctor: '',
    severity: 'low' as HealthRecord['severity'],
    value: '',
    unit: '',
    notes: '',
  });
  const [errors, setErrors] = useState<string[]>([]);

  const isEditing = recordId !== null;
  const existingRecord = records.find(r => r.id === recordId);

  useEffect(() => {
    if (existingRecord) {
      setFormData({
        type: existingRecord.type,
        title: existingRecord.title,
        description: existingRecord.description,
        date: existingRecord.date,
        doctor: existingRecord.doctor || '',
        severity: existingRecord.severity || 'low',
        value: existingRecord.value || '',
        unit: existingRecord.unit || '',
        notes: existingRecord.notes || '',
      });
    }
  }, [existingRecord]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setErrors([]);
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.title.trim()) newErrors.push('Title is required');
    if (!formData.description.trim()) newErrors.push('Description is required');
    if (!formData.date) newErrors.push('Date is required');

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const recordData = {
      type: formData.type,
      title: formData.title.trim(),
      description: formData.description.trim(),
      date: formData.date,
      doctor: formData.doctor.trim() || undefined,
      severity: formData.severity,
      value: formData.value.trim() || undefined,
      unit: formData.unit.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    };

    if (isEditing && recordId) {
      updateRecord(recordId, recordData);
    } else {
      addRecord(recordData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Health Record' : 'Add Health Record'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close form"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <h3 className="text-sm font-semibold text-red-800">Please fix the following errors:</h3>
              </div>
              <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                Record Type *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="allergy">Allergy</option>
                <option value="vital">Vital Signs</option>
                <option value="treatment">Treatment</option>
                <option value="vaccination">Vaccination</option>
                <option value="test">Test Result</option>
              </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Annual Physical Exam, Penicillin Allergy, Blood Pressure Reading"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Provide detailed information about this health record..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="doctor" className="block text-sm font-semibold text-gray-700 mb-2">
                Healthcare Provider
              </label>
              <input
                type="text"
                id="doctor"
                name="doctor"
                value={formData.doctor}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Dr. Smith, Johnson Medical Center"
              />
            </div>

            <div>
              <label htmlFor="severity" className="block text-sm font-semibold text-gray-700 mb-2">
                Severity Level
              </label>
              <select
                id="severity"
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {(formData.type === 'vital' || formData.type === 'test') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="value" className="block text-sm font-semibold text-gray-700 mb-2">
                  Value/Reading
                </label>
                <input
                  type="text"
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="120/80, 98.6, 150"
                />
              </div>

              <div>
                <label htmlFor="unit" className="block text-sm font-semibold text-gray-700 mb-2">
                  Unit
                </label>
                <input
                  type="text"
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="mmHg, °F, mg/dL, bpm"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any additional information, follow-up instructions, or observations..."
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-6 py-3 text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2 px-6 py-3 text-white font-semibold rounded-lg"
            >
              <Save className="w-5 h-5" />
              <span>{isEditing ? 'Update Record' : 'Save Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}