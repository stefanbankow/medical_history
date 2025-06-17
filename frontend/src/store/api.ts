import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './store';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Define base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: `${API_BASE_URL}/api`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('content-type', 'application/json');
    return headers;
  },
});

// Create the base API slice
export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'Auth',
    'Doctor', 
    'Patient', 
    'Diagnosis', 
    'MedicalVisit', 
    'SickLeave',
    'Reports'
  ],
  endpoints: () => ({}),
});

export default api;
