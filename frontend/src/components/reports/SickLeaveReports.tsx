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
  CircularProgress,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface SickLeaveByMonth {
  id: number;
  month: string;
  count: number;
  totalDays: number;
  averageDays: number;
}

interface DoctorSickLeaveStats {
  doctorName: string;
  sickLeaveCount: number;
  totalDays: number;
  averageDays: number;
}

interface SickLeaveReportsProps {
  isLoading: boolean;
  sickLeaveByMonth: SickLeaveByMonth[];
  doctorsSickLeaveStats: DoctorSickLeaveStats[];
}

const SickLeaveReports: React.FC<SickLeaveReportsProps> = ({
  isLoading,
  sickLeaveByMonth,
  doctorsSickLeaveStats,
}) => {
  const columns: GridColDef[] = [
    { field: 'month', headerName: 'Month', width: 150 },
    { field: 'count', headerName: 'Count', width: 100, type: 'number' },
    { field: 'totalDays', headerName: 'Total Days', width: 120, type: 'number' },
    { field: 'averageDays', headerName: 'Avg Days', width: 120, type: 'number' },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      <Card>
        <CardHeader title="Sick Leave Statistics by Month" />
        <CardContent>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <DataGrid
              rows={sickLeaveByMonth}
              columns={columns}
              autoHeight
              hideFooter
              disableRowSelectionOnClick
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Doctors Who Issued Most Sick Leaves" />
        <CardContent>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Doctor</TableCell>
                    <TableCell align="right">Sick Leaves</TableCell>
                    <TableCell align="right">Total Days</TableCell>
                    <TableCell align="right">Avg Days</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {doctorsSickLeaveStats.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.doctorName}</TableCell>
                      <TableCell align="right">{item.sickLeaveCount}</TableCell>
                      <TableCell align="right">{item.totalDays}</TableCell>
                      <TableCell align="right">{item.averageDays?.toFixed(1) || '0'}</TableCell>
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

export default SickLeaveReports;
