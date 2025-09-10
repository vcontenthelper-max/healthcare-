import React, { createContext, useContext, useState, useEffect } from 'react';

export interface HealthRecord {
  id: string;
  type: 'allergy' | 'vital' | 'treatment' | 'vaccination' | 'test';
  title: string;
  description: string;
  date: string;
  doctor?: string;
  severity?: 'low' | 'medium' | 'high';
  value?: string;
  unit?: string;
  notes?: string;
  attachments?: string[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  instructions: string;
  reminders: boolean;
  reminderTimes: string[];
  isActive: boolean;
}

export interface Appointment {
  id: string;
  type: 'checkup' | 'specialist' | 'emergency' | 'follow-up' | 'vaccination';
  title: string;
  doctor: string;
  location: string;
  date: string;
  time: string;
  notes?: string;
  completed: boolean;
  reminder: boolean;
}

interface HealthContextType {
  records: HealthRecord[];
  medications: Medication[];
  appointments: Appointment[];
  addRecord: (record: Omit<HealthRecord, 'id'>) => void;
  updateRecord: (id: string, record: Partial<HealthRecord>) => void;
  deleteRecord: (id: string) => void;
  addMedication: (medication: Omit<Medication, 'id'>) => void;
  updateMedication: (id: string, medication: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export function HealthProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const savedRecords = localStorage.getItem('healthTracker_records');
    const savedMedications = localStorage.getItem('healthTracker_medications');
    const savedAppointments = localStorage.getItem('healthTracker_appointments');

    if (savedRecords) setRecords(JSON.parse(savedRecords));
    if (savedMedications) setMedications(JSON.parse(savedMedications));
    if (savedAppointments) setAppointments(JSON.parse(savedAppointments));
  }, []);

  useEffect(() => {
    localStorage.setItem('healthTracker_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('healthTracker_medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem('healthTracker_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const addRecord = (record: Omit<HealthRecord, 'id'>) => {
    const newRecord = { ...record, id: Date.now().toString() };
    setRecords(prev => [...prev, newRecord]);
  };

  const updateRecord = (id: string, updatedRecord: Partial<HealthRecord>) => {
    setRecords(prev => prev.map(record => 
      record.id === id ? { ...record, ...updatedRecord } : record
    ));
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(record => record.id !== id));
  };

  const addMedication = (medication: Omit<Medication, 'id'>) => {
    const newMedication = { ...medication, id: Date.now().toString() };
    setMedications(prev => [...prev, newMedication]);
  };

  const updateMedication = (id: string, updatedMedication: Partial<Medication>) => {
    setMedications(prev => prev.map(medication => 
      medication.id === id ? { ...medication, ...updatedMedication } : medication
    ));
  };

  const deleteMedication = (id: string) => {
    setMedications(prev => prev.filter(medication => medication.id !== id));
  };

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment = { ...appointment, id: Date.now().toString() };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (id: string, updatedAppointment: Partial<Appointment>) => {
    setAppointments(prev => prev.map(appointment => 
      appointment.id === id ? { ...appointment, ...updatedAppointment } : appointment
    ));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(appointment => appointment.id !== id));
  };

  return (
    <HealthContext.Provider value={{
      records,
      medications,
      appointments,
      addRecord,
      updateRecord,
      deleteRecord,
      addMedication,
      updateMedication,
      deleteMedication,
      addAppointment,
      updateAppointment,
      deleteAppointment,
    }}>
      {children}
    </HealthContext.Provider>
  );
}

export function useHealth() {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
}