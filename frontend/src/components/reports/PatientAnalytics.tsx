import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';

interface InsuranceStats {
  paidCount: number;
  unpaidCount: number;
  paymentRate: number;
}

interface PatientWithMostVisits {
  patientName: string;
  visitCount: number;
  lastVisitDate: string;
}

interface PatientAnalyticsProps {
  isLoading: boolean;
  insuranceStats: InsuranceStats;
  patientsWithMostVisits: PatientWithMostVisits[];
}

const PatientAnalytics: React.FC<PatientAnalyticsProps> = ({
  isLoading,
  insuranceStats,
  patientsWithMostVisits,
}) => {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      <Card>
        <CardHeader title="Insurance Status Overview" />
        <CardContent>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Box>
              <Typography variant="h6" gutterBottom>
                Insurance Payment Status
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip 
                  label={`Paid: ${insuranceStats.paidCount}`}
                  color="success"
                />
                <Chip 
                  label={`Unpaid: ${insuranceStats.unpaidCount}`}
                  color="error"
                />
              </Box>
              <Typography variant="body2" color="textSecondary">
                Payment Rate: {insuranceStats.paymentRate}%
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Patients with Most Visits" />
        <CardContent>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Patient</TableCell>
                    <TableCell align="right">Visit Count</TableCell>
                    <TableCell align="right">Last Visit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patientsWithMostVisits.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.patientName}</TableCell>
                      <TableCell align="right">{item.visitCount}</TableCell>
                      <TableCell align="right">
                        {item.lastVisitDate ? format(new Date(item.lastVisitDate), 'dd/MM/yyyy') : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PatientAnalytics;
