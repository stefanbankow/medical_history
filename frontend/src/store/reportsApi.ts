import { api } from './api';
import { Doctor, Patient, Diagnosis } from '../types';

export interface DiagnosisReport {
  diagnosis: Diagnosis;
  patientCount: number;
}

export interface DoctorPatientCountReport {
  doctor: Doctor;
  patientCount: number;
}

export interface DoctorVisitCountReport {
  doctor: Doctor;
  visitCount: number;
}

export interface MonthlyReport {
  month: number;
  year: number;
  count: number;
}

export interface DoctorSickLeaveReport {
  doctor: Doctor;
  sickLeaveCount: number;
}

export const reportsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // 3a. Списък с пациенти, с дадена диагноза
    getPatientsByDiagnosis: builder.query<Patient[], number>({
      query: (diagnosisId) => `/reports/patients-by-diagnosis/${diagnosisId}`,
      providesTags: ['Reports'],
    }),
    
    // 3b. Най-често диагностицирани диагнози
    getMostCommonDiagnoses: builder.query<DiagnosisReport[], void>({
      query: () => '/reports/most-common-diagnoses',
      providesTags: ['Reports'],
    }),
    
    // 3c. Списък с пациенти, които имат даден личен лекар
    getPatientsByFamilyDoctor: builder.query<Patient[], number>({
      query: (doctorId) => `/reports/patients-by-family-doctor/${doctorId}`,
      providesTags: ['Reports'],
    }),
    
    // 3d. Брой на пациентите, записани при всеки от личните лекари
    getFamilyDoctorPatientCounts: builder.query<DoctorPatientCountReport[], void>({
      query: () => '/reports/family-doctor-patient-counts',
      providesTags: ['Reports'],
    }),
    
    // 3e. Брой посещения при всеки от лекарите
    getDoctorVisitCounts: builder.query<DoctorVisitCountReport[], void>({
      query: () => '/reports/doctor-visit-counts',
      providesTags: ['Reports'],
    }),
    
    // 3f. Списък с посещения на всеки пациент (included in medicalVisitsApi)
    
    // 3g. Списък на прегледите при всички лекари в даден период
    getVisitsByDateRange: builder.query<any[], { startDate: string; endDate: string }>({
      query: ({ startDate, endDate }) => 
        `/reports/visits-by-date-range?startDate=${startDate}&endDate=${endDate}`,
      providesTags: ['Reports'],
    }),
    
    // 3h. Списък на прегледите при определен лекар за даден период
    getVisitsByDoctorAndDateRange: builder.query<any[], { doctorId: number; startDate: string; endDate: string }>({
      query: ({ doctorId, startDate, endDate }) => 
        `/reports/visits-by-doctor-and-date-range?doctorId=${doctorId}&startDate=${startDate}&endDate=${endDate}`,
      providesTags: ['Reports'],
    }),
    
    // 3i. Месец в годината, в който са издадени най-много болнични
    getMonthWithMostSickLeaves: builder.query<MonthlyReport, void>({
      query: () => '/reports/month-most-sick-leaves',
      providesTags: ['Reports'],
    }),
    
    // 3j. Лекар/лекари, които са издали най-много болнични
    getDoctorsWithMostSickLeaves: builder.query<DoctorSickLeaveReport[], void>({
      query: () => '/reports/doctors-most-sick-leaves',
      providesTags: ['Reports'],
    }),
    
    // Additional useful reports
    getSickLeavesByMonth: builder.query<MonthlyReport[], void>({
      query: () => '/reports/sick-leaves-by-month',
      providesTags: ['Reports'],
    }),
    
    getDashboardStats: builder.query<{
      totalDoctors: number;
      totalPatients: number;
      totalVisits: number;
      totalSickLeaves: number;
    }, void>({
      query: () => '/reports/dashboard-stats',
      providesTags: ['Reports'],
    }),
    
    // New detailed reports
    getPatientsWithMostVisits: builder.query<Array<{
      patient: { id: number; name: string; egn: string };
      visitCount: number;
    }>, void>({
      query: () => '/reports/patients-most-visits',
      providesTags: ['Reports'],
    }),
    
    getInsuranceStats: builder.query<{
      paidCount: number;
      unpaidCount: number;
      paymentRate: number;
    }, void>({
      query: () => '/reports/insurance-stats',
      providesTags: ['Reports'],
    }),
    
    getDetailedSickLeavesByMonth: builder.query<Array<{
      month: number;
      year: number;
      count: number;
      totalDays: number;
      averageDays: number;
    }>, void>({
      query: () => '/reports/sick-leaves-detailed-monthly',
      providesTags: ['Reports'],
    }),
    
    getDetailedDoctorSickLeaveStats: builder.query<Array<{
      doctor: { id: number; name: string; specialty: string };
      sickLeaveCount: number;
      totalDays: number;
      averageDays: number;
    }>, void>({
      query: () => '/reports/doctors-sick-leaves-detailed',
      providesTags: ['Reports'],
    }),
  }),
});

export const {
  useGetPatientsByDiagnosisQuery,
  useGetMostCommonDiagnosesQuery,
  useGetPatientsByFamilyDoctorQuery,
  useGetFamilyDoctorPatientCountsQuery,
  useGetDoctorVisitCountsQuery,
  useGetVisitsByDateRangeQuery,
  useGetVisitsByDoctorAndDateRangeQuery,
  useGetMonthWithMostSickLeavesQuery,
  useGetDoctorsWithMostSickLeavesQuery,
  useGetSickLeavesByMonthQuery,
  useGetDashboardStatsQuery,
  useGetPatientsWithMostVisitsQuery,
  useGetInsuranceStatsQuery,
  useGetDetailedSickLeavesByMonthQuery,
  useGetDetailedDoctorSickLeaveStatsQuery,
} = reportsApi;
