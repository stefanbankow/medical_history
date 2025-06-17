import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import { 
  Assessment, 
  BarChart, 
  Timeline, 
  LocalHospital, 
  Person, 
  Analytics 
} from '@mui/icons-material';

import { useAuth } from '../utils/auth';
import PageHeader from '../components/shared/PageHeader';
import StatisticsCard from '../components/shared/StatisticsCard';
import FilterPanel from '../components/reports/FilterPanel';
import ReportTabPanel from '../components/reports/ReportTabPanel';
import DiagnosisReports from '../components/reports/DiagnosisReports';
import DoctorStatistics from '../components/reports/DoctorStatistics';
import PatientAnalytics from '../components/reports/PatientAnalytics';
import SickLeaveReports from '../components/reports/SickLeaveReports';
import VisitStatistics from '../components/reports/VisitStatistics';

// Mock data - would normally come from API
const mockReportsData = {
  totalPatients: 150,
  totalVisits: 450,
  totalDoctors: 25,
  totalSickLeaves: 80,
  doctors: [
    { id: 1, name: 'Dr. Smith', specialty: 'Cardiology' },
    { id: 2, name: 'Dr. Johnson', specialty: 'Pediatrics' },
  ],
  mostCommonDiagnoses: [
    { diagnosisName: 'Common Cold', count: 45, percentage: 25.5 },
    { diagnosisName: 'Hypertension', count: 32, percentage: 18.2 },
    { diagnosisName: 'Diabetes', count: 28, percentage: 15.9 },
  ],
  patientsByDiagnosis: [
    { id: 1, diagnosisName: 'Common Cold', patientCount: 45 },
    { id: 2, diagnosisName: 'Hypertension', patientCount: 32 },
  ],
  doctorStatistics: [
    { 
      id: 1, 
      doctorName: 'Dr. Smith', 
      specialty: 'Cardiology', 
      totalVisits: 120, 
      totalPatients: 80, 
      sickLeavesIssued: 15,
      averageVisitsPerPatient: 1.5 
    },
  ],
  patientsByFamilyDoctor: [
    { doctorName: 'Dr. Smith', totalPatients: 80, paidInsuranceCount: 75 },
  ],
  insuranceStats: { paidCount: 120, unpaidCount: 30, paymentRate: 80 },
  patientsWithMostVisits: [
    { patientName: 'John Doe', visitCount: 8, lastVisitDate: '2024-01-15' },
  ],
  sickLeaveByMonth: [
    { id: 1, month: 'January 2024', count: 12, totalDays: 84, averageDays: 7 },
  ],
  doctorsSickLeaveStats: [
    { doctorName: 'Dr. Smith', sickLeaveCount: 15, totalDays: 105, averageDays: 7.0 },
  ],
  visitsByDateRange: [
    { 
      id: 1, 
      visitDate: '2024-01-15', 
      visitCount: 25, 
      uniquePatients: 20, 
      uniqueDoctors: 8, 
      sickLeavesIssued: 3 
    },
  ],
  peakVisitHours: [
    { hour: 9, count: 45, percentage: 15.2 },
    { hour: 10, count: 52, percentage: 17.6 },
  ],
};

const Reports: React.FC = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [dateFrom, setDateFrom] = useState<Date | null>(
    new Date(new Date().getFullYear(), 0, 1)
  );
  const [dateTo, setDateTo] = useState<Date | null>(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<number>(0);
  
  const isLoading = false;
  const error = null;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Failed to load reports data</Alert>
      </Box>
    );
  }

  const statsCardsData = [
    {
      title: 'Total Patients',
      value: mockReportsData.totalPatients,
      icon: <Person />,
      color: 'primary' as const,
    },
    {
      title: 'Total Visits',
      value: mockReportsData.totalVisits,
      icon: <LocalHospital />,
      color: 'secondary' as const,
    },
    {
      title: 'Active Doctors',
      value: mockReportsData.totalDoctors,
      icon: <Assessment />,
      color: 'success' as const,
    },
    {
      title: 'Sick Leaves',
      value: mockReportsData.totalSickLeaves,
      icon: <Timeline />,
      color: 'warning' as const,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader title="Reports & Analytics" showAddButton={false} />

      <FilterPanel
        dateFrom={dateFrom}
        dateTo={dateTo}
        selectedDoctor={selectedDoctor}
        doctors={mockReportsData.doctors}
        showDoctorFilter={isAdmin()}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onDoctorChange={setSelectedDoctor}
      />

      {/* Statistics Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' },
        gap: 3, 
        mb: 3 
      }}>
        {statsCardsData.map((card, index) => (
          <StatisticsCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </Box>

      {/* Tabbed Reports */}
      <Paper sx={{ width: '100%' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="report tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Diagnosis Reports" icon={<Assessment />} />
          <Tab label="Doctor Statistics" icon={<Person />} />
          <Tab label="Patient Analytics" icon={<Analytics />} />
          <Tab label="Sick Leave Reports" icon={<LocalHospital />} />
          <Tab label="Visit Statistics" icon={<BarChart />} />
        </Tabs>

        <ReportTabPanel value={activeTab} index={0}>
          <DiagnosisReports
            isLoading={isLoading}
            mostCommonDiagnoses={mockReportsData.mostCommonDiagnoses}
            patientsByDiagnosis={mockReportsData.patientsByDiagnosis}
          />
        </ReportTabPanel>

        <ReportTabPanel value={activeTab} index={1}>
          <DoctorStatistics
            isLoading={isLoading}
            doctorStatistics={mockReportsData.doctorStatistics}
            patientsByFamilyDoctor={mockReportsData.patientsByFamilyDoctor}
          />
        </ReportTabPanel>

        <ReportTabPanel value={activeTab} index={2}>
          <PatientAnalytics
            isLoading={isLoading}
            insuranceStats={mockReportsData.insuranceStats}
            patientsWithMostVisits={mockReportsData.patientsWithMostVisits}
          />
        </ReportTabPanel>

        <ReportTabPanel value={activeTab} index={3}>
          <SickLeaveReports
            isLoading={isLoading}
            sickLeaveByMonth={mockReportsData.sickLeaveByMonth}
            doctorsSickLeaveStats={mockReportsData.doctorsSickLeaveStats}
          />
        </ReportTabPanel>

        <ReportTabPanel value={activeTab} index={4}>
          <VisitStatistics
            isLoading={isLoading}
            visitsByDateRange={mockReportsData.visitsByDateRange}
            peakVisitHours={mockReportsData.peakVisitHours}
          />
        </ReportTabPanel>
      </Paper>
    </Box>
  );
};

export default Reports;
