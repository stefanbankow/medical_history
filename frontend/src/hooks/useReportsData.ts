import { useMemo } from 'react';
import {
  useGetDashboardStatsQuery,
  useGetMostCommonDiagnosesQuery,
  useGetFamilyDoctorPatientCountsQuery,
  useGetDoctorVisitCountsQuery,
  useGetSickLeavesByMonthQuery,
  useGetDoctorsWithMostSickLeavesQuery,
  useGetVisitsByDateRangeQuery,
} from '../store/reportsApi';
import { useGetDoctorsQuery } from '../store/doctorsApi';

export interface ReportsFilters {
  dateFrom: Date | null;
  dateTo: Date | null;
  selectedDoctor: number;
  selectedDiagnosis: number;
  patientEgn: string;
}

export interface ProcessedReportsData {
  // Dashboard stats
  totalPatients: number;
  totalVisits: number;
  totalDoctors: number;
  totalSickLeaves: number;
  
  // Processed data for components
  doctors: Array<{ id: number; name: string; specialty: string }>;
  mostCommonDiagnoses: Array<{ diagnosisName: string; count: number; percentage: number }>;
  patientsByDiagnosis: Array<{ id: number; diagnosisName: string; patientCount: number }>;
  doctorStatistics: Array<{
    id: number;
    doctorName: string;
    specialty: string;
    totalVisits: number;
    totalPatients: number;
    sickLeavesIssued: number;
    averageVisitsPerPatient: number;
  }>;
  patientsByFamilyDoctor: Array<{ doctorName: string; totalPatients: number; paidInsuranceCount: number }>;
  insuranceStats: { paidCount: number; unpaidCount: number; paymentRate: number };
  patientsWithMostVisits: Array<{ patientName: string; visitCount: number; lastVisitDate: string }>;
  sickLeaveByMonth: Array<{ id: number; month: string; count: number; totalDays: number; averageDays: number }>;
  doctorsSickLeaveStats: Array<{ doctorName: string; sickLeaveCount: number; totalDays: number; averageDays: number }>;
  visitsByDateRange: Array<{
    id: number;
    visitDate: string;
    visitCount: number;
    uniquePatients: number;
    uniqueDoctors: number;
    sickLeavesIssued: number;
  }>;
  peakVisitHours: Array<{ hour: number; count: number; percentage: number }>;
}

export interface UseReportsDataResult {
  data: ProcessedReportsData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const useReportsData = (filters: ReportsFilters): UseReportsDataResult => {
  const {
    data: dashboardStats,
    isLoading: isDashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useGetDashboardStatsQuery();

  const {
    data: commonDiagnoses,
    isLoading: isDiagnosesLoading,
    error: diagnosesError,
    refetch: refetchDiagnoses,
  } = useGetMostCommonDiagnosesQuery();

  const {
    data: familyDoctorCounts,
    isLoading: isFamilyDoctorLoading,
    error: familyDoctorError,
    refetch: refetchFamilyDoctor,
  } = useGetFamilyDoctorPatientCountsQuery();

  const {
    data: doctorVisitCounts,
    isLoading: isDoctorVisitsLoading,
    error: doctorVisitsError,
    refetch: refetchDoctorVisits,
  } = useGetDoctorVisitCountsQuery();

  const {
    data: sickLeavesByMonth,
    isLoading: isSickLeavesLoading,
    error: sickLeavesError,
    refetch: refetchSickLeaves,
  } = useGetSickLeavesByMonthQuery();

  const {
    data: doctorsSickLeaves,
    isLoading: isDoctorsSickLeavesLoading,
    error: doctorsSickLeavesError,
    refetch: refetchDoctorsSickLeaves,
  } = useGetDoctorsWithMostSickLeavesQuery();

  const {
    data: doctors,
    isLoading: isDoctorsLoading,
    error: doctorsError,
    refetch: refetchDoctors,
  } = useGetDoctorsQuery();

  // Date range query - only if valid dates are provided
  const dateRangeQuery = useMemo(() => {
    if (filters.dateFrom && filters.dateTo) {
      return {
        startDate: filters.dateFrom.toISOString().split('T')[0],
        endDate: filters.dateTo.toISOString().split('T')[0],
      };
    }
    return null;
  }, [filters.dateFrom, filters.dateTo]);

  const {
    data: visitsByDateRange,
    isLoading: isVisitsLoading,
    error: visitsError,
    refetch: refetchVisits,
  } = useGetVisitsByDateRangeQuery(
    dateRangeQuery!,
    { skip: !dateRangeQuery }
  );

  const isLoading = useMemo(() => {
    return (
      isDashboardLoading ||
      isDiagnosesLoading ||
      isFamilyDoctorLoading ||
      isDoctorVisitsLoading ||
      isSickLeavesLoading ||
      isDoctorsSickLeavesLoading ||
      isDoctorsLoading ||
      isVisitsLoading
    );
  }, [
    isDashboardLoading,
    isDiagnosesLoading,
    isFamilyDoctorLoading,
    isDoctorVisitsLoading,
    isSickLeavesLoading,
    isDoctorsSickLeavesLoading,
    isDoctorsLoading,
    isVisitsLoading,
  ]);

  const error = useMemo(() => {
    const errors = [
      dashboardError,
      diagnosesError,
      familyDoctorError,
      doctorVisitsError,
      sickLeavesError,
      doctorsSickLeavesError,
      doctorsError,
      visitsError,
    ].filter(Boolean);

    if (errors.length > 0) {
      return 'Failed to load reports data';
    }
    return null;
  }, [
    dashboardError,
    diagnosesError,
    familyDoctorError,
    doctorVisitsError,
    sickLeavesError,
    doctorsSickLeavesError,
    doctorsError,
    visitsError,
  ]);

  const refetch = () => {
    refetchDashboard();
    refetchDiagnoses();
    refetchFamilyDoctor();
    refetchDoctorVisits();
    refetchSickLeaves();
    refetchDoctorsSickLeaves();
    refetchDoctors();
    refetchVisits();
  };

  const processedData = useMemo((): ProcessedReportsData | null => {
    if (!dashboardStats || !doctors) {
      return null;
    }

    // Process doctors data
    const processedDoctors = doctors.map(doctor => ({
      id: doctor.id,
      name: doctor.name,
      specialty: doctor.specialty,
    }));

    // Process most common diagnoses
    const processedDiagnoses = commonDiagnoses?.map(item => ({
      diagnosisName: item.diagnosis.name,
      count: item.patientCount,
      percentage: dashboardStats.totalPatients > 0 
        ? (item.patientCount / dashboardStats.totalPatients) * 100 
        : 0,
    })) || [];

    // Process patients by diagnosis for the table
    const processedPatientsByDiagnosis = commonDiagnoses?.map((item, index) => ({
      id: index + 1,
      diagnosisName: item.diagnosis.name,
      patientCount: item.patientCount,
    })) || [];

    // Process doctor statistics
    const processedDoctorStats = doctors.map(doctor => {
      const visitCount = doctorVisitCounts?.find(dvc => dvc.doctor.id === doctor.id)?.visitCount || 0;
      const patientCount = familyDoctorCounts?.find(fdc => fdc.doctor.id === doctor.id)?.patientCount || 0;
      const sickLeaveCount = doctorsSickLeaves?.find(dsl => dsl.doctor.id === doctor.id)?.sickLeaveCount || 0;

      return {
        id: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        totalVisits: visitCount,
        totalPatients: patientCount,
        sickLeavesIssued: sickLeaveCount,
        averageVisitsPerPatient: patientCount > 0 ? visitCount / patientCount : 0,
      };
    });

    // Process patients by family doctor
    const processedPatientsByFamilyDoctor = familyDoctorCounts?.map(item => ({
      doctorName: item.doctor.name,
      totalPatients: item.patientCount,
      paidInsuranceCount: Math.floor(item.patientCount * 0.85), // Mock paid insurance data
    })) || [];

    // Mock insurance stats (would need real data from backend)
    const insuranceStats = {
      paidCount: Math.floor(dashboardStats.totalPatients * 0.85),
      unpaidCount: Math.floor(dashboardStats.totalPatients * 0.15),
      paymentRate: 85,
    };

    // Mock patients with most visits (would need real data from backend)
    const patientsWithMostVisits = [
      { patientName: 'John Doe', visitCount: 8, lastVisitDate: '2024-01-15' },
      { patientName: 'Jane Smith', visitCount: 6, lastVisitDate: '2024-01-20' },
    ];

    // Process sick leave by month
    const processedSickLeaveByMonth = sickLeavesByMonth?.map((item, index) => ({
      id: index + 1,
      month: `${monthNames[item.month - 1]} ${item.year}`,
      count: item.count,
      totalDays: item.count * 7, // Mock total days
      averageDays: 7, // Mock average days
    })) || [];

    // Process doctors sick leave stats
    const processedDoctorsSickLeaveStats = doctorsSickLeaves?.map(item => ({
      doctorName: item.doctor.name,
      sickLeaveCount: item.sickLeaveCount,
      totalDays: item.sickLeaveCount * 7, // Mock total days
      averageDays: 7.0, // Mock average days
    })) || [];

    // Mock visit statistics (would need real data from backend)
    const processedVisitsByDateRange = visitsByDateRange?.map((visit, index) => ({
      id: index + 1,
      visitDate: visit.visitDate || new Date().toISOString().split('T')[0],
      visitCount: 25, // Mock data
      uniquePatients: 20, // Mock data
      uniqueDoctors: 8, // Mock data
      sickLeavesIssued: 3, // Mock data
    })) || [];

    // Mock peak visit hours
    const peakVisitHours = [
      { hour: 9, count: 45, percentage: 15.2 },
      { hour: 10, count: 52, percentage: 17.6 },
      { hour: 11, count: 48, percentage: 16.2 },
      { hour: 14, count: 41, percentage: 13.9 },
    ];

    return {
      totalPatients: dashboardStats.totalPatients,
      totalVisits: dashboardStats.totalVisits,
      totalDoctors: dashboardStats.totalDoctors,
      totalSickLeaves: dashboardStats.totalSickLeaves,
      doctors: processedDoctors,
      mostCommonDiagnoses: processedDiagnoses,
      patientsByDiagnosis: processedPatientsByDiagnosis,
      doctorStatistics: processedDoctorStats,
      patientsByFamilyDoctor: processedPatientsByFamilyDoctor,
      insuranceStats,
      patientsWithMostVisits,
      sickLeaveByMonth: processedSickLeaveByMonth,
      doctorsSickLeaveStats: processedDoctorsSickLeaveStats,
      visitsByDateRange: processedVisitsByDateRange,
      peakVisitHours,
    };
  }, [
    dashboardStats,
    doctors,
    commonDiagnoses,
    familyDoctorCounts,
    doctorVisitCounts,
    doctorsSickLeaves,
    sickLeavesByMonth,
    visitsByDateRange,
  ]);

  return {
    data: processedData,
    isLoading,
    error,
    refetch,
  };
};
