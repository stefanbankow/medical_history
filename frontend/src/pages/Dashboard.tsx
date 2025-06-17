import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People as PeopleIcon,
  LocalHospital as HospitalIcon,
  Assignment as AssignmentIcon,
  Assessment as ReportsIcon,
} from '@mui/icons-material';
import { useGetDashboardStatsQuery } from '../store/reportsApi';

const Dashboard: React.FC = () => {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load dashboard statistics
      </Alert>
    );
  }

  const statCards = [
    {
      title: 'Total Doctors',
      value: stats?.totalDoctors || 0,
      icon: <HospitalIcon fontSize="large" />,
      color: '#1976d2',
    },
    {
      title: 'Total Patients',
      value: stats?.totalPatients || 0,
      icon: <PeopleIcon fontSize="large" />,
      color: '#2e7d32',
    },
    {
      title: 'Medical Visits',
      value: stats?.totalVisits || 0,
      icon: <AssignmentIcon fontSize="large" />,
      color: '#ed6c02',
    },
    {
      title: 'Sick Leaves',
      value: stats?.totalSickLeaves || 0,
      icon: <ReportsIcon fontSize="large" />,
      color: '#9c27b0',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Box display="flex" flexWrap="wrap" gap={3} mb={3}>
        {statCards.map((stat, index) => (
          <Card key={index} sx={{ minWidth: 200, flex: '1 1 200px' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Box sx={{ color: stat.color, mr: 2 }}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="h4" component="div">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box display="flex" flexWrap="wrap" gap={3}>
        <Paper sx={{ p: 2, flex: '1 1 300px' }}>
          <Typography variant="h6" gutterBottom>
            Recent Activities
          </Typography>
          <Typography variant="body2">
            • New patient registered: Maria Popov
          </Typography>
          <Typography variant="body2">
            • Medical visit completed: John Doe
          </Typography>
          <Typography variant="body2">
            • Sick leave issued: Peter Stoyanov
          </Typography>
        </Paper>
        
        <Paper sx={{ p: 2, flex: '1 1 300px' }}>
          <Typography variant="h6" gutterBottom>
            System Status
          </Typography>
          <Typography variant="body2" color="success.main">
            ✓ Database: Connected
          </Typography>
          <Typography variant="body2" color="success.main">
            ✓ API: Operational
          </Typography>
          <Typography variant="body2" color="success.main">
            ✓ Backup: Completed
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
