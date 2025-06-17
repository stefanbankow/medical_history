import React from 'react';
import { Paper, Tabs, Tab } from '@mui/material';
import {
  Assessment,
  Person,
  Analytics,
  LocalHospital,
  BarChart,
} from '@mui/icons-material';
import ReportTabPanel from './ReportTabPanel';
import DiagnosisReports from './DiagnosisReports';
import DoctorStatistics from './DoctorStatistics';
import PatientAnalytics from './PatientAnalytics';
import SickLeaveReports from './SickLeaveReports';
import VisitStatistics from './VisitStatistics';
import { ProcessedReportsData } from '../../hooks/useReportsData';

interface ReportTabsProps {
  activeTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  data: ProcessedReportsData;
  isLoading: boolean;
}

const ReportTabs: React.FC<ReportTabsProps> = ({
  activeTab,
  onTabChange,
  data,
  isLoading,
}) => {
  const tabs = [
    {
      label: 'Diagnosis Reports',
      icon: <Assessment />,
      component: (
        <DiagnosisReports
          isLoading={isLoading}
          mostCommonDiagnoses={data.mostCommonDiagnoses}
          patientsByDiagnosis={data.patientsByDiagnosis}
        />
      ),
    },
    {
      label: 'Doctor Statistics',
      icon: <Person />,
      component: (
        <DoctorStatistics
          isLoading={isLoading}
          doctorStatistics={data.doctorStatistics}
          patientsByFamilyDoctor={data.patientsByFamilyDoctor}
        />
      ),
    },
    {
      label: 'Patient Analytics',
      icon: <Analytics />,
      component: (
        <PatientAnalytics
          isLoading={isLoading}
          insuranceStats={data.insuranceStats}
          patientsWithMostVisits={data.patientsWithMostVisits}
        />
      ),
    },
    {
      label: 'Sick Leave Reports',
      icon: <LocalHospital />,
      component: (
        <SickLeaveReports
          isLoading={isLoading}
          sickLeaveByMonth={data.sickLeaveByMonth}
          doctorsSickLeaveStats={data.doctorsSickLeaveStats}
        />
      ),
    },
    {
      label: 'Visit Statistics',
      icon: <BarChart />,
      component: (
        <VisitStatistics
          isLoading={isLoading}
          visitsByDateRange={data.visitsByDateRange}
          peakVisitHours={data.peakVisitHours}
        />
      ),
    },
  ];

  return (
    <Paper sx={{ width: '100%' }}>
      <Tabs
        value={activeTab}
        onChange={onTabChange}
        aria-label="report tabs"
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} icon={tab.icon} />
        ))}
      </Tabs>

      {tabs.map((tab, index) => (
        <ReportTabPanel key={index} value={activeTab} index={index}>
          {tab.component}
        </ReportTabPanel>
      ))}
    </Paper>
  );
};

export default ReportTabs;
