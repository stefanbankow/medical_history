import * as yup from 'yup';

export const doctorValidationSchema = yup.object({
  identificationNumber: yup
    .string()
    .required('Identification number is required')
    .min(3, 'Identification number must be at least 3 characters'),
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  specialty: yup
    .string()
    .required('Specialty is required'),
  isFamilyDoctor: yup.boolean().required(),
});

export const patientValidationSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  egn: yup
    .string()
    .required('EGN is required')
    .matches(/^\d{10}$/, 'EGN must be exactly 10 digits'),
  familyDoctorId: yup
    .number()
    .required('Family doctor is required')
    .positive('Please select a family doctor'),
  healthInsurancePaid: yup.boolean(),
  lastInsurancePaymentDate: yup.date().nullable(),
});

export const medicalVisitValidationSchema = yup.object({
  visitDate: yup
    .date()
    .required('Visit date is required')
    .max(new Date(), 'Visit date cannot be in the future'),
  patientId: yup
    .number()
    .required('Patient is required')
    .positive('Please select a patient'),
  doctorId: yup
    .number()
    .required('Doctor is required')
    .positive('Please select a doctor'),
  symptoms: yup.string(),
  treatment: yup.string(),
  prescribedMedication: yup.string(),
  notes: yup.string(),
  diagnosisId: yup.number().nullable(),
});

export const diagnosisValidationSchema = yup.object({
  code: yup
    .string()
    .required('Diagnosis code is required')
    .min(2, 'Code must be at least 2 characters'),
  name: yup
    .string()
    .required('Diagnosis name is required')
    .min(2, 'Name must be at least 2 characters'),
  description: yup.string(),
});

export const sickLeaveValidationSchema = yup.object({
  startDate: yup
    .date()
    .required('Start date is required'),
  durationDays: yup
    .number()
    .required('Duration is required')
    .positive('Duration must be positive')
    .integer('Duration must be a whole number')
    .max(365, 'Duration cannot exceed 365 days'),
  reason: yup.string(),
});

export const loginValidationSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});
