export interface Doctor {
  id: number;
  identificationNumber: string;
  name: string;
  specialty: string;
  isFamilyDoctor: boolean;
  patientCount?: number;
  visitCount?: number;
}

export interface Patient {
  id: number;
  name: string;
  egn: string;
  healthInsurancePaid: boolean;
  lastInsurancePaymentDate?: string;
  familyDoctorId: number;
  familyDoctorName?: string;
  healthInsuranceValid?: boolean;
}

export interface Diagnosis {
  id: number;
  code: string;
  name: string;
  description?: string;
  visitCount?: number;
}

export interface SickLeave {
  id: number;
  startDate: string;
  durationDays: number;
  endDate?: string;
  reason?: string;
  medicalVisitId: number;
}

export interface MedicalVisit {
  id: number;
  visitDate: string;
  visitTime?: string;
  symptoms?: string;
  treatment?: string;
  prescribedMedication?: string;
  notes?: string;
  patientId: number;
  patientName?: string;
  doctorId: number;
  doctorName?: string;
  diagnosisId?: number;
  diagnosisName?: string;
  sickLeave?: SickLeave;
}

export interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
  patientId?: number;
  doctorId?: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  role: string[];
  name?: string;
  egn?: string;
  identificationNumber?: string;
  specialty?: string;
  isFamilyDoctor?: boolean;
  familyDoctorId?: number;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
  patientId?: number;
  doctorId?: number;
}

export interface MessageResponse {
  message: string;
}
