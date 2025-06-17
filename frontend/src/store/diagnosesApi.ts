import { api } from './api';
import { Diagnosis } from '../types';

export const diagnosesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDiagnoses: builder.query<Diagnosis[], void>({
      query: () => '/diagnoses',
      providesTags: ['Diagnosis'],
    }),
    
    getDiagnosisById: builder.query<Diagnosis, number>({
      query: (id) => `/diagnoses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Diagnosis', id }],
    }),
    
    getDiagnosesByCode: builder.query<Diagnosis[], string>({
      query: (code) => `/diagnoses/code/${code}`,
      providesTags: ['Diagnosis'],
    }),
    
    searchDiagnoses: builder.query<Diagnosis[], string>({
      query: (searchTerm) => `/diagnoses/search?term=${encodeURIComponent(searchTerm)}`,
      providesTags: ['Diagnosis'],
    }),
    
    createDiagnosis: builder.mutation<Diagnosis, Partial<Diagnosis>>({
      query: (diagnosis) => ({
        url: '/diagnoses',
        method: 'POST',
        body: diagnosis,
      }),
      invalidatesTags: ['Diagnosis'],
    }),
    
    updateDiagnosis: builder.mutation<Diagnosis, { id: number; diagnosis: Partial<Diagnosis> }>({
      query: ({ id, diagnosis }) => ({
        url: `/diagnoses/${id}`,
        method: 'PUT',
        body: diagnosis,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Diagnosis', id }],
    }),
    
    deleteDiagnosis: builder.mutation<void, number>({
      query: (id) => ({
        url: `/diagnoses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Diagnosis'],
    }),
  }),
});

export const {
  useGetDiagnosesQuery,
  useGetDiagnosisByIdQuery,
  useGetDiagnosesByCodeQuery,
  useSearchDiagnosesQuery,
  useCreateDiagnosisMutation,
  useUpdateDiagnosisMutation,
  useDeleteDiagnosisMutation,
} = diagnosesApi;
