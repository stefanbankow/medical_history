import { api } from './api';
import { Doctor } from '../types';

export const doctorsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDoctors: builder.query<Doctor[], void>({
      query: () => '/doctors',
      providesTags: ['Doctor'],
    }),
    
    getDoctorById: builder.query<Doctor, number>({
      query: (id) => `/doctors/${id}`,
      providesTags: (result, error, id) => [{ type: 'Doctor', id }],
    }),
    
    getFamilyDoctors: builder.query<Doctor[], void>({
      query: () => '/doctors/family',
      providesTags: ['Doctor'],
    }),
    
    getDoctorsBySpecialty: builder.query<Doctor[], string>({
      query: (specialty) => `/doctors/specialty/${specialty}`,
      providesTags: ['Doctor'],
    }),
    
    createDoctor: builder.mutation<Doctor, Partial<Doctor>>({
      query: (doctor) => ({
        url: '/doctors',
        method: 'POST',
        body: doctor,
      }),
      invalidatesTags: ['Doctor'],
    }),
    
    updateDoctor: builder.mutation<Doctor, { id: number; doctor: Partial<Doctor> }>({
      query: ({ id, doctor }) => ({
        url: `/doctors/${id}`,
        method: 'PUT',
        body: doctor,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Doctor', id }],
    }),
    
    deleteDoctor: builder.mutation<void, number>({
      query: (id) => ({
        url: `/doctors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Doctor'],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetDoctorByIdQuery,
  useGetFamilyDoctorsQuery,
  useGetDoctorsBySpecialtyQuery,
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} = doctorsApi;
