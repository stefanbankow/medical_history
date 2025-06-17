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
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface DoctorStatistic {
  id: number;
  doctorName: string;
  specialty: string;
  totalVisits: number;
  totalPatients: number;
  sickLeavesIssued: number;
  averageVisitsPerPatient: number;
}

interface PatientsByFamilyDoctor {
  doctorName: string;
  totalPatients: number;
  paidInsuranceCount: number;
}

interface DoctorStatisticsProps {
  isLoading: boolean;
  doctorStatistics: DoctorStatistic[];
  patientsByFamilyDoctor: PatientsByFamilyDoctor[];
}

const DoctorStatistics: React.FC<DoctorStatisticsProps> = ({
  isLoading,
  doctorStatistics,
  patientsByFamilyDoctor,
}) => {
  const columns: GridColDef[] = [
    { field: 'doctorName', headerName: 'Doctor', width: 200 },
    { field: 'specialty', headerName: 'Specialty', width: 150 },
    { field: 'totalVisits', headerName: 'Total Visits', width: 120, type: 'number' },
    { field: 'totalPatients', headerName: 'Total Patients', width: 120, type: 'number' },
    { field: 'sickLeavesIssued', headerName: 'Sick Leaves', width: 120, type: 'number' },
    { 
      field: 'averageVisitsPerPatient', 
      headerName: 'Avg Visits/Patient', 
      width: 150, 
      type: 'number',
      valueFormatter: (value: any) => (typeof value === 'number' ? value.toFixed(2) : '0')
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Card>
        <CardHeader title="Doctor Performance Statistics" />
        <CardContent>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <DataGrid
              rows={doctorStatistics}
              columns={columns}
              autoHeight
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Patients by Family Doctor" />
        <CardContent>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Family Doctor</TableCell>
                    <TableCell align="right">Patient Count</TableCell>
                    <TableCell align="right">Paid Insurance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patientsByFamilyDoctor.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.doctorName}</TableCell>
                      <TableCell align="right">{item.totalPatients}</TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={`${item.paidInsuranceCount}/${item.totalPatients}`}
                          size="small"
                          color={item.paidInsuranceCount === item.totalPatients ? 'success' : 'warning'}
                        />
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

export default DoctorStatistics;
