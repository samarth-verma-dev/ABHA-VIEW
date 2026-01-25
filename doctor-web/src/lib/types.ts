import type { Timestamp } from 'firebase/firestore';

export type Doctor = {
  id: string;
  doctorName: string;
  doctorHospital: string;
  role: string;
};


export type Session = {
  id:string;
  doctorId: string;
  doctorName: string;
  hospital: string;
  patientAbhaId: string;
  consentStatus: 'requested' | 'granted' | 'denied';
  sessionActive: boolean;
  createdAt: Timestamp;
};

export type MedicalRecord = {
  id: string;
  patientAbhaId: string;
  date: Timestamp;
  type: string;
  details: string;
  verified: boolean;
  doctor: string;
  hospital: string;
};

    