import React from 'react';
import { Box } from '@mui/material';
import {
  Person,
  LocalHospital,
  Assessment,
  Timeline,
} from '@mui/icons-material';
import StatisticsCard from '../shared/StatisticsCard';

interface DashboardStatsProps {
  totalPatients: number;
  totalVisits: number;
  totalDoctors: number;
  totalSickLeaves: number;
  isLoading?: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalPatients,
  totalVisits,
  totalDoctors,
  totalSickLeaves,
  isLoading = false,
}) => {
  const statsCardsData = [
    {
      title: 'Total Patients',
      value: totalPatients,
      icon: <Person />,
      color: 'primary' as const,
    },
    {
      title: 'Total Visits',
      value: totalVisits,
      icon: <LocalHospital />,
      color: 'secondary' as const,
    },
    {
      title: 'Active Doctors',
      value: totalDoctors,
      icon: <Assessment />,
      color: 'success' as const,
    },
    {
      title: 'Sick Leaves',
      value: totalSickLeaves,
      icon: <Timeline />,
      color: 'warning' as const,
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' },
        gap: 3,
        mb: 3,
      }}
    >
      {statsCardsData.map((card, index) => (
        <StatisticsCard
          key={index}
          title={card.title}
          value={isLoading ? 0 : card.value}
          icon={card.icon}
          color={card.color}
        />
      ))}
    </Box>
  );
};

export default DashboardStats;
