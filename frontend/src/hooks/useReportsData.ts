import { useMemo } from 'react';
import {
  useGetDashboardStatsQuery,
  useGetMostCommonDiagnosesQuery,
  useGetFamilyDoctorPatientCountsQuery,
  useGetDoctorVisitCountsQuery,
  useGetDoctorsWithMostSickLeavesQuery,
  useGetVisitsByDateRangeQuery,
  useGetPatientsWithMostVisitsQuery,
  useGetInsuranceStatsQuery,
  useGetDetailedSickLeavesByMonthQuery,
  useGetDetailedDoctorSickLeaveStatsQuery,
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

  // Removed unused hook - using detailed sick leaves instead

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

  // New detailed API calls
  const {
    data: patientsWithMostVisits,
    isLoading: isPatientsVisitsLoading,
    error: patientsVisitsError,
    refetch: refetchPatientsVisits,
  } = useGetPatientsWithMostVisitsQuery();

  const {
    data: insuranceStats,
    isLoading: isInsuranceLoading,
    error: insuranceError,
    refetch: refetchInsurance,
  } = useGetInsuranceStatsQuery();

  const {
    data: detailedSickLeavesByMonth,
    isLoading: isDetailedSickLeavesLoading,
    error: detailedSickLeavesError,
    refetch: refetchDetailedSickLeaves,
  } = useGetDetailedSickLeavesByMonthQuery();

  const {
    data: detailedDoctorSickLeaveStats,
    isLoading: isDetailedDoctorSickLeavesLoading,
    error: detailedDoctorSickLeavesError,
    refetch: refetchDetailedDoctorSickLeaves,
  } = useGetDetailedDoctorSickLeaveStatsQuery();

  const isLoading = useMemo(() => {
    return (
      isDashboardLoading ||
      isDiagnosesLoading ||
      isFamilyDoctorLoading ||
      isDoctorVisitsLoading ||
      isDoctorsSickLeavesLoading ||
      isDoctorsLoading ||
      isVisitsLoading ||
      isPatientsVisitsLoading ||
      isInsuranceLoading ||
      isDetailedSickLeavesLoading ||
      isDetailedDoctorSickLeavesLoading
    );
  }, [
    isDashboardLoading,
    isDiagnosesLoading,
    isFamilyDoctorLoading,
    isDoctorVisitsLoading,
    isDoctorsSickLeavesLoading,
    isDoctorsLoading,
    isVisitsLoading,
    isPatientsVisitsLoading,
    isInsuranceLoading,
    isDetailedSickLeavesLoading,
    isDetailedDoctorSickLeavesLoading,
  ]);

  const error = useMemo(() => {
    const errors = [
      dashboardError,
      diagnosesError,
      familyDoctorError,
      doctorVisitsError,
      doctorsSickLeavesError,
      doctorsError,
      visitsError,
      patientsVisitsError,
      insuranceError,
      detailedSickLeavesError,
      detailedDoctorSickLeavesError,
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
    doctorsSickLeavesError,
    doctorsError,
    visitsError,
    patientsVisitsError,
    insuranceError,
    detailedSickLeavesError,
    detailedDoctorSickLeavesError,
  ]);

  const refetch = () => {
    refetchDashboard();
    refetchDiagnoses();
    refetchFamilyDoctor();
    refetchDoctorVisits();
    refetchDoctorsSickLeaves();
    refetchDoctors();
    refetchVisits();
    refetchPatientsVisits();
    refetchInsurance();
    refetchDetailedSickLeaves();
    refetchDetailedDoctorSickLeaves();
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
      paidInsuranceCount: Math.floor(item.patientCount * (insuranceStats?.paymentRate || 85) / 100),
    })) || [];

    // Use real insurance stats from API
    const processedInsuranceStats = insuranceStats || {
      paidCount: 0,
      unpaidCount: 0,
      paymentRate: 0,
    };

    // Use real patients with most visits data
    const processedPatientsWithMostVisits = patientsWithMostVisits?.map(item => ({
      patientName: item.patient.name,
      visitCount: item.visitCount,
      lastVisitDate: new Date().toISOString().split('T')[0], // Note: Need to add last visit date to backend
    })) || [];

    // Process sick leave by month using detailed data
    const processedSickLeaveByMonth = detailedSickLeavesByMonth?.map((item, index) => ({
      id: index + 1,
      month: `${monthNames[item.month - 1]} ${item.year}`,
      count: item.count,
      totalDays: item.totalDays,
      averageDays: item.averageDays,
    })) || [];

    // Process doctors sick leave stats using detailed data
    const processedDoctorsSickLeaveStats = detailedDoctorSickLeaveStats?.map(item => ({
      doctorName: item.doctor.name,
      sickLeaveCount: item.sickLeaveCount,
      totalDays: item.totalDays,
      averageDays: item.averageDays,
    })) || [];

    // Process visits by date range - improve data handling
    const processedVisitsByDateRange = visitsByDateRange?.map((visit, index) => ({
      id: index + 1,
      visitDate: visit.visitDate || new Date().toISOString().split('T')[0],
      visitCount: visit.visitCount || 0,
      uniquePatients: visit.uniquePatients || 0,
      uniqueDoctors: visit.uniqueDoctors || 0,
      sickLeavesIssued: visit.sickLeavesIssued || 0,
    })) || [];

    // Note: This should be real data from backend - peak visit hours analysis
    const peakVisitHours = [
      { hour: 9, count: 0, percentage: 0 },
      { hour: 10, count: 0, percentage: 0 },
      { hour: 11, count: 0, percentage: 0 },
      { hour: 14, count: 0, percentage: 0 },
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
      insuranceStats: processedInsuranceStats,
      patientsWithMostVisits: processedPatientsWithMostVisits,
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
    visitsByDateRange,
    patientsWithMostVisits,
    insuranceStats,
    detailedSickLeavesByMonth,
    detailedDoctorSickLeaveStats,
  ]);

  return {
    data: processedData,
    isLoading,
    error,
    refetch,
  };
};
