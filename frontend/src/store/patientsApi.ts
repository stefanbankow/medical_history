import { api } from './api';
import { Patient } from '../types';

export const patientsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPatients: builder.query<Patient[], void>({
      query: () => '/patients',
      providesTags: ['Patient'],
    }),
    
    getPatientById: builder.query<Patient, number>({
      query: (id) => `/patients/${id}`,
      providesTags: (result, error, id) => [{ type: 'Patient', id }],
    }),
    
    getPatientByEgn: builder.query<Patient, string>({
      query: (egn) => `/patients/egn/${egn}`,
      providesTags: (result, error, egn) => [{ type: 'Patient', id: egn }],
    }),
    
    getPatientsByFamilyDoctor: builder.query<Patient[], number>({
      query: (doctorId) => `/patients/family-doctor/${doctorId}`,
      providesTags: ['Patient'],
    }),
    
    getPatientsByDiagnosis: builder.query<Patient[], number>({
      query: (diagnosisId) => `/patients/diagnosis/${diagnosisId}`,
      providesTags: ['Patient'],
    }),
    
    createPatient: builder.mutation<Patient, Partial<Patient>>({
      query: (patient) => ({
        url: '/patients',
        method: 'POST',
        body: patient,
      }),
      invalidatesTags: ['Patient'],
    }),
    
    updatePatient: builder.mutation<Patient, { id: number; patient: Partial<Patient> }>({
      query: ({ id, patient }) => ({
        url: `/patients/${id}`,
        method: 'PUT',
        body: patient,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Patient', id }],
    }),
    
    deletePatient: builder.mutation<void, number>({
      query: (id) => ({
        url: `/patients/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Patient'],
    }),
  }),
});

export const {
  useGetPatientsQuery,
  useGetPatientByIdQuery,
  useGetPatientByEgnQuery,
  useGetPatientsByFamilyDoctorQuery,
  useGetPatientsByDiagnosisQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
} = patientsApi;
