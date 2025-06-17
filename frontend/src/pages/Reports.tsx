import React, { useState } from 'react';
import { Box } from '@mui/material';

import { useAuth } from '../utils/auth';
import { useReportsData } from '../hooks/useReportsData';
import { useGetDoctorsQuery } from '../store/doctorsApi';
// import { useGetDiagnosesQuery } from '../store/diagnosesApi'; // For future use
import PageHeader from '../components/shared/PageHeader';
import FilterPanel from '../components/reports/FilterPanel';
import DashboardStats from '../components/reports/DashboardStats';
import ReportTabs from '../components/reports/ReportTabs';
import ReportsError from '../components/reports/ReportsError';
import ReportsLoadingSkeleton from '../components/reports/ReportsLoadingSkeleton';

const Reports: React.FC = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [dateFrom, setDateFrom] = useState<Date | null>(
    new Date(new Date().getFullYear(), 0, 1)
  );
  const [dateTo, setDateTo] = useState<Date | null>(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<number>(0);
  const [patientEgn, setPatientEgn] = useState<string>('');
  
  // Fetch doctors and diagnoses for filters
  const { data: doctors = [] } = useGetDoctorsQuery();
  // const { data: diagnoses = [] } = useGetDiagnosesQuery(); // For future use
  
  const { data, isLoading, error, refetch } = useReportsData({
    dateFrom,
    dateTo,
    selectedDoctor,
    selectedDiagnosis: 0, // Add when diagnosis filtering is implemented
    patientEgn,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleClearFilters = () => {
    setDateFrom(new Date(new Date().getFullYear(), 0, 1));
    setDateTo(new Date());
    setSelectedDoctor(0);
    setPatientEgn('');
  };

  // Show loading skeleton while data is being fetched
  if (isLoading) {
    return <ReportsLoadingSkeleton />;
  }

  // Show error with retry button
  if (error) {
    return <ReportsError error={error} onRetry={refetch} />;
  }

  // Show error if no data is available
  if (!data) {
    return <ReportsError error="No data available" onRetry={refetch} />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader title="Reports & Analytics" showAddButton={false} />

      <FilterPanel
        dateFrom={dateFrom}
        dateTo={dateTo}
        selectedDoctor={selectedDoctor}
        doctors={doctors}
        showDoctorFilter={isAdmin()}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onDoctorChange={setSelectedDoctor}
        onClearFilters={handleClearFilters}
        patientEgn={patientEgn}
        onPatientEgnChange={setPatientEgn}
      />

      <DashboardStats
        totalPatients={data.totalPatients}
        totalVisits={data.totalVisits}
        totalDoctors={data.totalDoctors}
        totalSickLeaves={data.totalSickLeaves}
        isLoading={isLoading}
      />

      <ReportTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        data={data}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default Reports;
