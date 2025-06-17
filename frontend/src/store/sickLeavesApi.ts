import { api } from './api';
import { SickLeave } from '../types';

export const sickLeavesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSickLeaves: builder.query<SickLeave[], void>({
      query: () => '/sick-leaves',
      providesTags: ['SickLeave'],
    }),
    
    getSickLeaveById: builder.query<SickLeave, number>({
      query: (id) => `/sick-leaves/${id}`,
      providesTags: (result, error, id) => [{ type: 'SickLeave', id }],
    }),
    
    getSickLeavesByPatient: builder.query<SickLeave[], number>({
      query: (patientId) => `/sick-leaves/patient/${patientId}`,
      providesTags: ['SickLeave'],
    }),
    
    getSickLeavesByDoctor: builder.query<SickLeave[], number>({
      query: (doctorId) => `/sick-leaves/doctor/${doctorId}`,
      providesTags: ['SickLeave'],
    }),
    
    getSickLeavesByDateRange: builder.query<SickLeave[], { startDate: string; endDate: string }>({
      query: ({ startDate, endDate }) => `/sick-leaves/date-range?startDate=${startDate}&endDate=${endDate}`,
      providesTags: ['SickLeave'],
    }),
    
    createSickLeave: builder.mutation<SickLeave, Partial<SickLeave>>({
      query: (sickLeave) => ({
        url: '/sick-leaves',
        method: 'POST',
        body: sickLeave,
      }),
      invalidatesTags: ['SickLeave', 'MedicalVisit'],
    }),
    
    updateSickLeave: builder.mutation<SickLeave, { id: number; sickLeave: Partial<SickLeave> }>({
      query: ({ id, sickLeave }) => ({
        url: `/sick-leaves/${id}`,
        method: 'PUT',
        body: sickLeave,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'SickLeave', id }],
    }),
    
    deleteSickLeave: builder.mutation<void, number>({
      query: (id) => ({
        url: `/sick-leaves/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SickLeave'],
    }),
  }),
});

export const {
  useGetSickLeavesQuery,
  useGetSickLeaveByIdQuery,
  useGetSickLeavesByPatientQuery,
  useGetSickLeavesByDoctorQuery,
  useGetSickLeavesByDateRangeQuery,
  useCreateSickLeaveMutation,
  useUpdateSickLeaveMutation,
  useDeleteSickLeaveMutation,
} = sickLeavesApi;
