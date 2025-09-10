import React, { useState } from 'react';
import { Download, FileText, Calendar, Pill, Heart, Check, AlertCircle } from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { useAuth } from '../hooks/useAuth';

export function DataExport() {
  const { records, medications, appointments } = useHealth();
  const { user } = useAuth();
  const [exportFormat, setExportFormat] = useState<'pdf' | 'json' | 'csv'>('pdf');
  const [selectedData, setSelectedData] = useState({
    records: true,
    medications: true,
    appointments: true,
    profile: true,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const handleDataToggle = (dataType: keyof typeof selectedData) => {
    setSelectedData(prev => ({
      ...prev,
      [dataType]: !prev[dataType]
    }));
  };

  const generateExportData = () => {
    const exportData: any = {};
    
    if (selectedData.profile && user) {
      exportData.profile = {
        name: user.name,
        email: user.email,
        role: user.role,
        dateOfBirth: user.dateOfBirth,
        phone: user.phone,
        emergencyContact: user.emergencyContact,
        memberSince: user.createdAt,
      };
    }
    
    if (selectedData.records) {
      exportData.healthRecords = records;
    }
    
    if (selectedData.medications) {
      exportData.medications = medications;
    }
    
    if (selectedData.appointments) {
      exportData.appointments = appointments;
    }
    
    exportData.exportDate = new Date().toISOString();
    exportData.exportedBy = user?.name;
    
    return exportData;
  };

  const downloadJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = (data: any, filename: string) => {
    let csvContent = '';
    
    // Add profile data
    if (data.profile) {
      csvContent += 'Profile Information\n';
      Object.entries(data.profile).forEach(([key, value]) => {
        csvContent += `${key},${value}\n`;
      });
      csvContent += '\n';
    }
    
    // Add health records
    if (data.healthRecords && data.healthRecords.length > 0) {
      csvContent += 'Health Records\n';
      csvContent += 'Type,Title,Description,Date,Doctor,Severity,Value,Unit,Notes\n';
      data.healthRecords.forEach((record: any) => {
        csvContent += `${record.type},${record.title},"${record.description}",${record.date},${record.doctor || ''},${record.severity || ''},${record.value || ''},${record.unit || ''},"${record.notes || ''}"\n`;
      });
      csvContent += '\n';
    }
    
    // Add medications
    if (data.medications && data.medications.length > 0) {
      csvContent += 'Medications\n';
      csvContent += 'Name,Dosage,Frequency,Start Date,End Date,Prescribed By,Instructions,Active,Reminders\n';
      data.medications.forEach((med: any) => {
        csvContent += `${med.name},${med.dosage},${med.frequency},${med.startDate},${med.endDate || ''},${med.prescribedBy},"${med.instructions}",${med.isActive},${med.reminders}\n`;
      });
      csvContent += '\n';
    }
    
    // Add appointments
    if (data.appointments && data.appointments.length > 0) {
      csvContent += 'Appointments\n';
      csvContent += 'Type,Title,Doctor,Location,Date,Time,Notes,Completed\n';
      data.appointments.forEach((apt: any) => {
        csvContent += `${apt.type},${apt.title},${apt.doctor},${apt.location},${apt.date},${apt.time},"${apt.notes || ''}",${apt.completed}\n`;
      });
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generatePDFContent = (data: any) => {
    let content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Health Records Export</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .section { margin: 30px 0; }
          .section h2 { color: #2563EB; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f8f9fa; font-weight: bold; }
          .profile-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .export-info { background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 30px; }
          @media print { body { margin: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Personal Health Records</h1>
          <p>Exported by: ${data.exportedBy}</p>
          <p>Export Date: ${new Date(data.exportDate).toLocaleDateString()}</p>
        </div>
    `;
    
    if (data.profile) {
      content += `
        <div class="section">
          <h2>Profile Information</h2>
          <div class="profile-info">
            <div><strong>Name:</strong> ${data.profile.name}</div>
            <div><strong>Email:</strong> ${data.profile.email}</div>
            <div><strong>Phone:</strong> ${data.profile.phone || 'Not provided'}</div>
            <div><strong>Date of Birth:</strong> ${data.profile.dateOfBirth ? new Date(data.profile.dateOfBirth).toLocaleDateString() : 'Not provided'}</div>
            <div><strong>Emergency Contact:</strong> ${data.profile.emergencyContact || 'Not provided'}</div>
            <div><strong>Account Type:</strong> ${data.profile.role}</div>
          </div>
        </div>
      `;
    }
    
    if (data.healthRecords && data.healthRecords.length > 0) {
      content += `
        <div class="section">
          <h2>Health Records (${data.healthRecords.length} records)</h2>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Date</th>
                <th>Doctor</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
      `;
      data.healthRecords.forEach((record: any) => {
        content += `
          <tr>
            <td style="text-transform: capitalize;">${record.type}</td>
            <td>${record.title}</td>
            <td>${new Date(record.date).toLocaleDateString()}</td>
            <td>${record.doctor || 'N/A'}</td>
            <td>${record.description}</td>
          </tr>
        `;
      });
      content += `</tbody></table></div>`;
    }
    
    if (data.medications && data.medications.length > 0) {
      content += `
        <div class="section">
          <h2>Medications (${data.medications.length} medications)</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Prescribed By</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
      `;
      data.medications.forEach((med: any) => {
        content += `
          <tr>
            <td>${med.name}</td>
            <td>${med.dosage}</td>
            <td>${med.frequency}</td>
            <td>Dr. ${med.prescribedBy}</td>
            <td>${med.isActive ? 'Active' : 'Inactive'}</td>
          </tr>
        `;
      });
      content += `</tbody></table></div>`;
    }
    
    if (data.appointments && data.appointments.length > 0) {
      content += `
        <div class="section">
          <h2>Appointments (${data.appointments.length} appointments)</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
      `;
      data.appointments.forEach((apt: any) => {
        content += `
          <tr>
            <td>${apt.title}</td>
            <td>Dr. ${apt.doctor}</td>
            <td>${new Date(apt.date).toLocaleDateString()}</td>
            <td>${apt.time}</td>
            <td>${apt.location}</td>
            <td>${apt.completed ? 'Completed' : 'Scheduled'}</td>
          </tr>
        `;
      });
      content += `</tbody></table></div>`;
    }
    
    content += `
        <div class="export-info">
          <p><strong>Note:</strong> This document contains your personal health information. Please store it securely and share only with authorized healthcare providers.</p>
        </div>
      </body>
      </html>
    `;
    
    return content;
  };

  const downloadPDF = (data: any, filename: string) => {
    const htmlContent = generatePDFContent(data);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.replace('.pdf', '.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportComplete(false);
    
    try {
      const exportData = generateExportData();
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `health-records-${timestamp}`;
      
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      switch (exportFormat) {
        case 'json':
          downloadJSON(exportData, `${filename}.json`);
          break;
        case 'csv':
          downloadCSV(exportData, `${filename}.csv`);
          break;
        case 'pdf':
          downloadPDF(exportData, `${filename}.pdf`);
          break;
      }
      
      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const hasSelectedData = Object.values(selectedData).some(Boolean);
  const getTotalItems = () => {
    let total = 0;
    if (selectedData.records) total += records.length;
    if (selectedData.medications) total += medications.length;
    if (selectedData.appointments) total += appointments.length;
    if (selectedData.profile) total += 1;
    return total;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Export Health Data</h1>
        <p className="text-lg text-gray-600">
          Download your health records in various formats for backup or sharing with healthcare providers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Data Selection */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Heart className="w-6 h-6 text-blue-600 mr-2" />
              Select Data to Export
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="profile"
                    checked={selectedData.profile}
                    onChange={() => handleDataToggle('profile')}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="profile" className="ml-3 flex items-center">
                    <FileText className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-gray-900 font-medium">Profile Information</span>
                  </label>
                </div>
                <span className="text-sm text-gray-500">1 item</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="records"
                    checked={selectedData.records}
                    onChange={() => handleDataToggle('records')}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="records" className="ml-3 flex items-center">
                    <Heart className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-gray-900 font-medium">Health Records</span>
                  </label>
                </div>
                <span className="text-sm text-gray-500">{records.length} items</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="medications"
                    checked={selectedData.medications}
                    onChange={() => handleDataToggle('medications')}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="medications" className="ml-3 flex items-center">
                    <Pill className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-900 font-medium">Medications</span>
                  </label>
                </div>
                <span className="text-sm text-gray-500">{medications.length} items</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="appointments"
                    checked={selectedData.appointments}
                    onChange={() => handleDataToggle('appointments')}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="appointments" className="ml-3 flex items-center">
                    <Calendar className="w-5 h-5 text-purple-500 mr-2" />
                    <span className="text-gray-900 font-medium">Appointments</span>
                  </label>
                </div>
                <span className="text-sm text-gray-500">{appointments.length} items</span>
              </div>
            </div>
          </div>

          {/* Format Selection */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Export Format</h2>
            
            <div className="space-y-4">
              <div className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <input
                  type="radio"
                  id="pdf"
                  name="format"
                  value="pdf"
                  checked={exportFormat === 'pdf'}
                  onChange={(e) => setExportFormat(e.target.value as 'pdf')}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="pdf" className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">PDF Document</p>
                      <p className="text-sm text-gray-600">Professional format, ideal for sharing with doctors</p>
                    </div>
                    <FileText className="w-8 h-8 text-red-500" />
                  </div>
                </label>
              </div>

              <div className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <input
                  type="radio"
                  id="json"
                  name="format"
                  value="json"
                  checked={exportFormat === 'json'}
                  onChange={(e) => setExportFormat(e.target.value as 'json')}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="json" className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">JSON File</p>
                      <p className="text-sm text-gray-600">Machine-readable format for data analysis</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-500" />
                  </div>
                </label>
              </div>

              <div className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <input
                  type="radio"
                  id="csv"
                  name="format"
                  value="csv"
                  checked={exportFormat === 'csv'}
                  onChange={(e) => setExportFormat(e.target.value as 'csv')}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="csv" className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">CSV Spreadsheet</p>
                      <p className="text-sm text-gray-600">Compatible with Excel and other spreadsheet apps</p>
                    </div>
                    <FileText className="w-8 h-8 text-green-500" />
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Export Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Export Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Format:</span>
                <span className="font-medium text-gray-900 uppercase">{exportFormat}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Items:</span>
                <span className="font-medium text-gray-900">{getTotalItems()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Export Date:</span>
                <span className="font-medium text-gray-900">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <button
              onClick={handleExport}
              disabled={!hasSelectedData || isExporting}
              className={`w-full mt-6 flex items-center justify-center space-x-2 px-6 py-3 font-semibold rounded-lg transition-colors ${
                hasSelectedData && !isExporting
                  ? 'btn-primary text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Export Data</span>
                </>
              )}
            </button>

            {exportComplete && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center text-green-800">
                  <Check className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Export completed successfully!</span>
                </div>
              </div>
            )}
          </div>

          {/* Privacy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-blue-900 font-semibold mb-2">Privacy & Security</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Downloaded files contain sensitive health data</li>
                  <li>• Store exported files securely</li>
                  <li>• Delete files from public devices after use</li>
                  <li>• Share only with authorized healthcare providers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}