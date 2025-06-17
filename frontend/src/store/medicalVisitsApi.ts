import { api } from './api';
import { MedicalVisit } from '../types';

export const medicalVisitsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMedicalVisits: builder.query<MedicalVisit[], void>({
      query: () => '/medical-visits',
      providesTags: ['MedicalVisit'],
    }),
    
    getMedicalVisitById: builder.query<MedicalVisit, number>({
      query: (id) => `/medical-visits/${id}`,
      providesTags: (result, error, id) => [{ type: 'MedicalVisit', id }],
    }),
    
    getMedicalVisitsByPatient: builder.query<MedicalVisit[], number>({
      query: (patientId) => `/medical-visits/patient/${patientId}`,
      providesTags: ['MedicalVisit'],
    }),
    
    getMedicalVisitsByDoctor: builder.query<MedicalVisit[], number>({
      query: (doctorId) => `/medical-visits/doctor/${doctorId}`,
      providesTags: ['MedicalVisit'],
    }),
    
    getMedicalVisitsByDateRange: builder.query<MedicalVisit[], { startDate: string; endDate: string }>({
      query: ({ startDate, endDate }) => `/medical-visits/date-range?startDate=${startDate}&endDate=${endDate}`,
      providesTags: ['MedicalVisit'],
    }),
    
    getMedicalVisitsByDoctorAndDateRange: builder.query<MedicalVisit[], { doctorId: number; startDate: string; endDate: string }>({
      query: ({ doctorId, startDate, endDate }) => 
        `/medical-visits/doctor/${doctorId}/date-range?startDate=${startDate}&endDate=${endDate}`,
      providesTags: ['MedicalVisit'],
    }),
    
    getPatientMedicalHistory: builder.query<MedicalVisit[], number>({
      query: (patientId) => `/medical-visits/patient/${patientId}/history`,
      providesTags: ['MedicalVisit'],
    }),
    
    createMedicalVisit: builder.mutation<MedicalVisit, Partial<MedicalVisit>>({
      query: (visit) => ({
        url: '/medical-visits',
        method: 'POST',
        body: visit,
      }),
      invalidatesTags: ['MedicalVisit', 'Patient', 'Doctor'],
    }),
    
    updateMedicalVisit: builder.mutation<MedicalVisit, { id: number; visit: Partial<MedicalVisit> }>({
      query: ({ id, visit }) => ({
        url: `/medical-visits/${id}`,
        method: 'PUT',
        body: visit,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'MedicalVisit', id }],
    }),
    
    deleteMedicalVisit: builder.mutation<void, number>({
      query: (id) => ({
        url: `/medical-visits/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MedicalVisit'],
    }),
  }),
});

export const {
  useGetMedicalVisitsQuery,
  useGetMedicalVisitByIdQuery,
  useGetMedicalVisitsByPatientQuery,
  useGetMedicalVisitsByDoctorQuery,
  useGetMedicalVisitsByDateRangeQuery,
  useGetMedicalVisitsByDoctorAndDateRangeQuery,
  useGetPatientMedicalHistoryQuery,
  useCreateMedicalVisitMutation,
  useUpdateMedicalVisitMutation,
  useDeleteMedicalVisitMutation,
} = medicalVisitsApi;
